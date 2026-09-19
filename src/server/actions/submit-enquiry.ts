/**
 * Server Action: submit a project enquiry.
 * This is the single real transport boundary for the Contact form.
 *
 * Pipeline order: readiness → origin/fetch-metadata → payload budget →
 * server-owned rejection → validation → rate limit → Turnstile → idempotent insert.
 */

"use server";

import { headers } from "next/headers";
import { randomBytes, createHash } from "node:crypto";
import type { EnquiryNormalizedInput } from "@/lib/enquiries/input";
import type { EnquirySubmitResult } from "@/lib/enquiries/transport";
import {
  CUSTOMER_SAFE_MESSAGES,
  IDEMPOTENCY_KEY_MIN_LENGTH,
  IDEMPOTENCY_KEY_MAX_LENGTH,
  IDEMPOTENCY_KEY_PATTERN,
} from "@/lib/security/policy";
import {
  gateEnquiryServerActionInput,
  type EnquiryPolicyHeaders,
} from "@/lib/security/enquiry-gate";
import {
  createCorrelationId,
  formatSafeLogLine,
  mapFailureToEnquiryResult,
} from "@/lib/security/errors";
import { SCHEMA_VERSION_CURRENT } from "@/lib/mongodb/limits";
import {
  resolveAbuseHashSecrets,
  resolveIdempotencySecrets,
  hashTrustedIdentity,
  hmacHex,
} from "@/server/security/secrets";
import { enforceEnquiryRateLimits } from "@/server/security/rate-limit";
import { insertEnquiryDocument } from "@/server/repositories/enquiries";
import { evaluateEnquiryReadiness } from "@/server/security/readiness";
import { verifyEnquiryTurnstileToken } from "@/server/security/turnstile-verify";
import { getDb } from "@/lib/mongodb/connection";
import type { EnquiryDocument } from "@/lib/mongodb/models/types";

/**
 * Extract trusted client IP from request headers.
 * Uses the hosting platform's verified header; never trusts arbitrary XFF.
 */
function getTrustedClientIp(reqHeaders: Headers): string | null {
  // Vercel/Next.js provides x-real-ip as the platform-verified client IP.
  const realIp = reqHeaders.get("x-real-ip");
  if (realIp && realIp.trim().length > 0) return realIp.trim();

  // Fallback: x-forwarded-for leftmost only in development.
  const xff = reqHeaders.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first && first.length > 0) return first;
  }

  return null;
}

/** Generate an opaque public reference (not the idempotency key). */
function generatePublicReference(): string {
  return `ZQ-${randomBytes(6).toString("hex").toUpperCase()}`;
}

/** SHA-256 digest of the raw idempotency key (stable across secret rotation). */
function idempotencyKeyDigest(key: string): string {
  return createHash("sha256").update(key, "utf8").digest("hex");
}

/**
 * Validate an idempotency key from the client.
 * Returns the key if valid, null otherwise.
 */
function validateIdempotencyKey(key: unknown): string | null {
  if (typeof key !== "string") return null;
  const trimmed = key.trim();
  if (
    trimmed.length < IDEMPOTENCY_KEY_MIN_LENGTH ||
    trimmed.length > IDEMPOTENCY_KEY_MAX_LENGTH
  ) {
    return null;
  }
  if (!IDEMPOTENCY_KEY_PATTERN.test(trimmed)) return null;
  return trimmed;
}

/**
 * Extract the business-only fields for canonical fingerprinting.
 * Transport metadata (idempotency key, challenge tokens, trace IDs)
 * is deliberately excluded so retries with fresh transport tokens
 * still match the same business enquiry.
 */
function businessFieldsProjection(
  normalized: EnquiryNormalizedInput,
): Record<string, string | null> {
  return {
    name: normalized.name,
    email: normalized.email.toLowerCase(),
    company: normalized.company,
    service: normalized.service,
    message: normalized.message,
    timeline: normalized.timeline,
    requestType: normalized.requestType,
    preferredContact: normalized.preferredContact,
    phone: normalized.phone,
  };
}

export async function submitEnquiryAction(
  input: EnquiryNormalizedInput,
  idempotencyKey?: string,
  turnstileToken?: string,
): Promise<EnquirySubmitResult> {
  const correlationId = createCorrelationId();
  const started = Date.now();

  // 1. Readiness pre-check (env-level — fast, no DB yet)
  const env = process.env;
  const enabledFlag =
    (env.ENQUIRIES_ENABLED ?? "").trim().toLowerCase() === "true";
  if (!enabledFlag) {
    return {
      status: "unavailable",
      message: CUSTOMER_SAFE_MESSAGES.unavailable,
    };
  }

  // 2. Extract request headers for origin/policy gate
  const reqHeaders = await headers();
  const policyHeaders: EnquiryPolicyHeaders = {
    origin: reqHeaders.get("origin"),
    secFetchSite: reqHeaders.get("sec-fetch-site"),
    secFetchMode: reqHeaders.get("sec-fetch-mode"),
    host: reqHeaders.get("host"),
    xForwardedHost: reqHeaders.get("x-forwarded-host"),
  };

  // 3. Run the full policy gate (origin → fetch-metadata → budget → validation)
  const rawInput: Record<string, unknown> = { ...input };
  const gate = gateEnquiryServerActionInput({
    headers: policyHeaders,
    rawInput,
    env,
    correlationId,
  });

  if (!gate.ok) {
    console.warn(`[enquiry] ${gate.logLine}`);
    return gate.result;
  }

  // 4. Resolve secrets
  const abuseSecrets = resolveAbuseHashSecrets(env);
  if (!abuseSecrets) {
    return {
      status: "unavailable",
      message: CUSTOMER_SAFE_MESSAGES.unavailable,
    };
  }

  const idempotencySecrets = resolveIdempotencySecrets(env);
  if (!idempotencySecrets) {
    return {
      status: "unavailable",
      message: CUSTOMER_SAFE_MESSAGES.unavailable,
    };
  }

  // 5. Get database handle
  let db;
  try {
    db = await getDb();
  } catch {
    console.warn(
      `[enquiry] ${formatSafeLogLine({ category: "unavailable", operation: "enquiry.db", correlationId, elapsedMs: Date.now() - started })}`,
    );
    return {
      status: "unavailable",
      message: CUSTOMER_SAFE_MESSAGES.unavailable,
    };
  }

  // 6. Full readiness check (indexes, migration)
  const readiness = await evaluateEnquiryReadiness({ db, env });
  if (!readiness.ready) {
    console.warn(
      `[enquiry] ${formatSafeLogLine({ category: "unavailable-schema", operation: "enquiry.readiness", correlationId, elapsedMs: Date.now() - started })}`,
    );
    return {
      status: "unavailable",
      message: CUSTOMER_SAFE_MESSAGES.unavailable,
    };
  }

  // 7. Rate limiting (per-source + global)
  const clientIp = getTrustedClientIp(reqHeaders);
  const sourceIdentity = clientIp ?? "unknown-source";
  const { identityHash } = hashTrustedIdentity(sourceIdentity, abuseSecrets);

  const rateResult = await enforceEnquiryRateLimits({
    db,
    sourceIdentityHash: identityHash,
  });

  if (!rateResult.ok) {
    console.warn(
      `[enquiry] ${formatSafeLogLine({ category: "unavailable", operation: "enquiry.rate-limit.store", correlationId, elapsedMs: Date.now() - started })}`,
    );
    return {
      status: "unavailable",
      message: CUSTOMER_SAFE_MESSAGES.unavailable,
    };
  }

  if (!rateResult.allowed) {
    return {
      status: "rate-limited",
      message: CUSTOMER_SAFE_MESSAGES.rateLimited,
      retryAfterSeconds: rateResult.retryAfterSeconds,
    };
  }

  // 8. Turnstile verification (after cheap gates + rate limits, before insert)
  const turnstile = await verifyEnquiryTurnstileToken({
    token: turnstileToken,
    remoteIp: clientIp,
    env,
  });

  if (!turnstile.ok) {
    const unavailable =
      turnstile.reason === "missing-config" ||
      turnstile.reason === "test-keys-in-production" ||
      turnstile.reason === "provider-unavailable";

    console.warn(
      `[enquiry] ${formatSafeLogLine({
        category: unavailable ? "unavailable" : "validation",
        operation: "enquiry.turnstile",
        correlationId,
        elapsedMs: Date.now() - started,
      })}`,
    );

    if (unavailable) {
      return {
        status: "unavailable",
        message: CUSTOMER_SAFE_MESSAGES.unavailable,
      };
    }

    return {
      status: "challenge-failed",
      message: CUSTOMER_SAFE_MESSAGES.challengeFailed,
    };
  }

  // 9. Validate and resolve the idempotency key
  const validatedKey = validateIdempotencyKey(idempotencyKey);
  const effectiveKey = validatedKey ?? randomBytes(32).toString("hex");

  const digest = idempotencyKeyDigest(effectiveKey);

  // 10. Build payload fingerprint (business fields only)
  const idempotencySecret =
    idempotencySecrets.secretsByVersion[idempotencySecrets.currentVersion];
  if (!idempotencySecret) {
    return {
      status: "unavailable",
      message: CUSTOMER_SAFE_MESSAGES.unavailable,
    };
  }

  const businessFields = businessFieldsProjection(gate.normalized);
  const sorted = Object.keys(businessFields)
    .sort()
    .map((k) => `${k}=${businessFields[k] ?? ""}`)
    .join("\n");
  const fingerprint = hmacHex(idempotencySecret, `enquiry:v1:${sorted}`);

  // 11. Construct enquiry document
  const now = new Date();
  const document: EnquiryDocument = {
    schemaVersion: SCHEMA_VERSION_CURRENT,
    createdAt: now,
    updatedAt: now,
    status: "new",
    publicReference: generatePublicReference(),
    idempotencyDigest: digest,
    fingerprintVersion: idempotencySecrets.currentVersion,
    keyVersion: abuseSecrets.currentVersion,
    payloadFingerprint: fingerprint,
    name: gate.normalized.name,
    email: gate.normalized.email,
    company: gate.normalized.company,
    service: gate.normalized.service,
    message: gate.normalized.message,
    timeline: gate.normalized.timeline,
    requestType: gate.normalized.requestType,
    preferredContact: gate.normalized.preferredContact,
    phone: gate.normalized.phone,
  };

  // 12. Insert with idempotent duplicate handling
  const insertResult = await insertEnquiryDocument(db, document);

  if (!insertResult.ok) {
    console.warn(
      `[enquiry] ${formatSafeLogLine({ category: insertResult.category, operation: "enquiry.insert", correlationId, elapsedMs: Date.now() - started })}`,
    );
    return mapFailureToEnquiryResult(insertResult.category);
  }

  if (insertResult.duplicated) {
    if (!insertResult.payloadFingerprintMatches) {
      // Same idempotency key, different payload → conflict
      return {
        status: "unavailable",
        message:
          "This submission could not be processed. If you changed your enquiry, please try again.",
      };
    }
    // Identical replay → return the same accepted result
    return {
      status: "accepted",
      reference: insertResult.publicReference,
      message: "We have received your enquiry.",
    };
  }

  // New insertion
  return {
    status: "accepted",
    reference: insertResult.publicReference,
    message: "We have received your enquiry.",
  };
}
