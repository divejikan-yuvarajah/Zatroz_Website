/**
 * Server Action enquiry request-policy gate (pure — safe for unit tests).
 * Server modules may re-export; do not expose a live endpoint from this file.
 */

import {
  checkEnquiryOrigin,
  checkFetchMetadataSupplement,
  type OriginPolicyConfig,
} from "@/lib/security/origins";
import {
  estimateEnquiryPayloadBytes,
  isWithinEnquiryPayloadBudget,
} from "@/lib/security/request-body";
import {
  createCorrelationId,
  formatSafeLogLine,
  mapFailureToEnquiryResult,
} from "@/lib/security/errors";
import { CUSTOMER_SAFE_MESSAGES } from "@/lib/security/policy";
import type { EnquirySubmitResult } from "@/lib/enquiries/transport";
import {
  rejectServerOwnedEnquiryFields,
  validateEnquiryVisitorFields,
} from "@/lib/mongodb/models/validate";
import {
  validateEnquiryInput,
  type EnquiryNormalizedInput,
} from "@/lib/enquiries/input";
import { APP_ENV_VALUES, type AppEnv } from "@/lib/mongodb/config";

export type EnquiryPolicyHeaders = Readonly<{
  origin?: string | null;
  secFetchSite?: string | null;
  secFetchMode?: string | null;
  host?: string | null;
  xForwardedHost?: string | null;
}>;

export type EnquiryPolicyGateResult =
  | {
      ok: true;
      correlationId: string;
      origin: string;
      normalized: EnquiryNormalizedInput;
    }
  | {
      ok: false;
      correlationId: string;
      result: EnquirySubmitResult;
      logLine: string;
    };

function resolveAppEnv(raw: string | undefined): AppEnv {
  if (raw && (APP_ENV_VALUES as readonly string[]).includes(raw)) {
    return raw as AppEnv;
  }
  return "development";
}

export function buildOriginConfigFromEnv(
  env: NodeJS.ProcessEnv = process.env,
): OriginPolicyConfig {
  return {
    appOrigin: (env.APP_ORIGIN ?? env.SITE_URL)?.trim() || undefined,
    appEnv: resolveAppEnv(env.APP_ENV),
  };
}

/**
 * Pre-persistence policy gate for a future Server Action.
 * Order: origin → fetch-metadata supplement → payload budget → unknown fields → validation.
 */
export function gateEnquiryServerActionInput(options: {
  headers: EnquiryPolicyHeaders;
  rawInput: Record<string, unknown>;
  env?: NodeJS.ProcessEnv;
  correlationId?: string;
}): EnquiryPolicyGateResult {
  const correlationId = options.correlationId ?? createCorrelationId();
  const started = Date.now();
  const originConfig = buildOriginConfigFromEnv(options.env);

  void options.headers.host;
  void options.headers.xForwardedHost;

  const originCheck = checkEnquiryOrigin(options.headers.origin, originConfig);
  if (!originCheck.ok) {
    const result = mapFailureToEnquiryResult("forbidden-origin");
    return {
      ok: false,
      correlationId,
      result,
      logLine: formatSafeLogLine({
        category: "forbidden-origin",
        operation: "enquiry.gate.origin",
        correlationId,
        elapsedMs: Date.now() - started,
      }),
    };
  }

  const fetchMeta = checkFetchMetadataSupplement({
    secFetchSite: options.headers.secFetchSite,
    secFetchMode: options.headers.secFetchMode,
  });
  if (!fetchMeta.ok) {
    const result = mapFailureToEnquiryResult("forbidden-origin");
    return {
      ok: false,
      correlationId,
      result,
      logLine: formatSafeLogLine({
        category: "forbidden-origin",
        operation: "enquiry.gate.fetch-metadata",
        correlationId,
        elapsedMs: Date.now() - started,
      }),
    };
  }

  if (!isWithinEnquiryPayloadBudget(options.rawInput)) {
    const result = mapFailureToEnquiryResult("payload-too-large");
    return {
      ok: false,
      correlationId,
      result,
      logLine: formatSafeLogLine({
        category: "payload-too-large",
        operation: "enquiry.gate.budget",
        correlationId,
        elapsedMs: Date.now() - started,
      }),
    };
  }

  const serverOwned = rejectServerOwnedEnquiryFields(options.rawInput);
  if (!serverOwned.ok) {
    const result: EnquirySubmitResult = {
      status: "validation-error",
      message: CUSTOMER_SAFE_MESSAGES.validation,
      fieldErrors: {},
    };
    return {
      ok: false,
      correlationId,
      result,
      logLine: formatSafeLogLine({
        category: "validation",
        operation: "enquiry.gate.server-owned",
        correlationId,
        elapsedMs: Date.now() - started,
      }),
    };
  }

  const formValues = {
    name: String(options.rawInput.name ?? ""),
    email: String(options.rawInput.email ?? ""),
    company: String(options.rawInput.company ?? ""),
    service: String(options.rawInput.service ?? ""),
    message: String(options.rawInput.message ?? ""),
    timeline: String(options.rawInput.timeline ?? ""),
    requestType: String(options.rawInput.requestType ?? ""),
    preferredContact: String(options.rawInput.preferredContact ?? ""),
    phone: String(options.rawInput.phone ?? ""),
  };

  const validated = validateEnquiryInput(formValues);
  if (!validated.ok) {
    const result: EnquirySubmitResult = {
      status: "validation-error",
      message: CUSTOMER_SAFE_MESSAGES.validation,
      fieldErrors: validated.errors,
    };
    return {
      ok: false,
      correlationId,
      result,
      logLine: formatSafeLogLine({
        category: "validation",
        operation: "enquiry.gate.validate",
        correlationId,
        elapsedMs: Date.now() - started,
      }),
    };
  }

  const visitor = validateEnquiryVisitorFields(validated.value);
  if (!visitor.ok) {
    const result: EnquirySubmitResult = {
      status: "validation-error",
      message: CUSTOMER_SAFE_MESSAGES.validation,
      fieldErrors: {},
    };
    return {
      ok: false,
      correlationId,
      result,
      logLine: formatSafeLogLine({
        category: "validation",
        operation: "enquiry.gate.visitor",
        correlationId,
        elapsedMs: Date.now() - started,
      }),
    };
  }

  return {
    ok: true,
    correlationId,
    origin: originCheck.origin,
    normalized: validated.value,
  };
}

export function enquiryPayloadByteEstimate(
  payload: Record<string, unknown>,
): number {
  return estimateEnquiryPayloadBytes(payload);
}
