/**
 * Cloudflare Turnstile helpers — pure, no secrets, safe for unit tests.
 * Server verification uses these parsers; tokens never persist or log.
 */

import { APP_ENV_VALUES, type AppEnv } from "@/lib/mongodb/config";

/** Widget action passed to Turnstile and checked on Siteverify. */
export const TURNSTILE_ENQUIRY_ACTION = "enquiry-submit" as const;

/** Official Siteverify endpoint. */
export const TURNSTILE_SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify" as const;

/** Bounded verification deadline for a single Siteverify request. */
export const TURNSTILE_VERIFY_TIMEOUT_MS = 5000 as const;

/** Turnstile response token length bounds (provider tokens are opaque strings). */
export const TURNSTILE_TOKEN_MIN_LENGTH = 10;
export const TURNSTILE_TOKEN_MAX_LENGTH = 2048;

/** Cloudflare documented always-pass test keys (development/test only). */
export const TURNSTILE_TEST_SITE_KEYS = [
  "1x00000000000000000000AA",
  "2x00000000000000000000AB",
  "3x00000000000000000000FF",
] as const;

export const TURNSTILE_TEST_SECRET_KEYS = [
  "1x0000000000000000000000000000000AA",
  "2x0000000000000000000000000000000AA",
  "3x0000000000000000000000000000000AA",
] as const;

export type TurnstileConfig = Readonly<{
  siteKey: string;
  secretKey: string;
  expectedHostname: string;
  appEnv: AppEnv;
}>;

export type TurnstileVerifyOutcome =
  | { ok: true; action: string; hostname: string }
  | {
      ok: false;
      reason:
        | "missing-config"
        | "test-keys-in-production"
        | "missing-token"
        | "invalid-token"
        | "provider-rejected"
        | "wrong-hostname"
        | "wrong-action"
        | "malformed-response"
        | "provider-unavailable";
    };

export type SiteverifyResponse = Readonly<{
  success: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: string[];
}>;

function resolveAppEnv(raw: string | undefined): AppEnv {
  if (raw && (APP_ENV_VALUES as readonly string[]).includes(raw)) {
    return raw as AppEnv;
  }
  return "development";
}

/** Extract hostname from APP_ORIGIN / SITE_URL for Siteverify hostname check. */
export function hostnameFromOrigin(origin: string | undefined): string | null {
  if (!origin?.trim()) return null;
  try {
    return new URL(origin.trim()).hostname.toLowerCase();
  } catch {
    return null;
  }
}

export function isTurnstileTestSiteKey(siteKey: string): boolean {
  return (TURNSTILE_TEST_SITE_KEYS as readonly string[]).includes(siteKey);
}

export function isTurnstileTestSecretKey(secretKey: string): boolean {
  return (TURNSTILE_TEST_SECRET_KEYS as readonly string[]).includes(secretKey);
}

/** Resolve Turnstile config from environment; null when incomplete. */
export function resolveTurnstileConfig(
  env: NodeJS.ProcessEnv = process.env,
): TurnstileConfig | null {
  const siteKey = (env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "").trim();
  const secretKey = (env.TURNSTILE_SECRET_KEY ?? "").trim();
  const expectedHostname = hostnameFromOrigin(
    (env.APP_ORIGIN ?? env.SITE_URL)?.trim(),
  );

  if (!siteKey || !secretKey || !expectedHostname) {
    return null;
  }

  return {
    siteKey,
    secretKey,
    expectedHostname,
    appEnv: resolveAppEnv(env.APP_ENV),
  };
}

/** Production must not use Cloudflare's documented test keys. */
export function turnstileConfigUsesTestKeysInProduction(
  config: TurnstileConfig,
): boolean {
  if (config.appEnv !== "production") return false;
  return (
    isTurnstileTestSiteKey(config.siteKey) ||
    isTurnstileTestSecretKey(config.secretKey)
  );
}

/** Validate an inbound challenge token before calling Siteverify. */
export function validateTurnstileToken(token: unknown): string | null {
  if (typeof token !== "string") return null;
  const trimmed = token.trim();
  if (
    trimmed.length < TURNSTILE_TOKEN_MIN_LENGTH ||
    trimmed.length > TURNSTILE_TOKEN_MAX_LENGTH
  ) {
    return null;
  }
  return trimmed;
}

/** Parse Siteverify JSON without trusting arbitrary shapes. */
export function parseSiteverifyResponse(
  body: unknown,
): SiteverifyResponse | null {
  if (!body || typeof body !== "object") return null;
  const record = body as Record<string, unknown>;
  if (typeof record.success !== "boolean") return null;

  const errorCodes = record["error-codes"];
  return {
    success: record.success,
    ...(typeof record.hostname === "string"
      ? { hostname: record.hostname }
      : {}),
    ...(typeof record.action === "string" ? { action: record.action } : {}),
    ...(Array.isArray(errorCodes)
      ? {
          "error-codes": errorCodes.filter(
            (code): code is string => typeof code === "string",
          ),
        }
      : {}),
  };
}

/** Evaluate a parsed Siteverify response against expected hostname/action. */
export function evaluateSiteverifyResponse(
  response: SiteverifyResponse,
  expected: { hostname: string; action: string },
): TurnstileVerifyOutcome {
  if (!response.success) {
    return { ok: false, reason: "provider-rejected" };
  }

  const hostname = response.hostname?.trim().toLowerCase();
  if (!hostname || hostname !== expected.hostname.toLowerCase()) {
    return { ok: false, reason: "wrong-hostname" };
  }

  const action = response.action?.trim();
  if (!action || action !== expected.action) {
    return { ok: false, reason: "wrong-action" };
  }

  return { ok: true, action, hostname };
}
