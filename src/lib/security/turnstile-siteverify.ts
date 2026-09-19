/**
 * Cloudflare Turnstile Siteverify adapter (pure — injectable fetch/env for tests).
 * Tokens and secrets never log or persist.
 */

import {
  TURNSTILE_ENQUIRY_ACTION,
  TURNSTILE_SITEVERIFY_URL,
  TURNSTILE_VERIFY_TIMEOUT_MS,
  evaluateSiteverifyResponse,
  parseSiteverifyResponse,
  resolveTurnstileConfig,
  turnstileConfigUsesTestKeysInProduction,
  validateTurnstileToken,
  type TurnstileVerifyOutcome,
} from "@/lib/security/turnstile";

export type VerifyEnquiryTurnstileOptions = Readonly<{
  token: unknown;
  remoteIp?: string | null;
  /** Optional Siteverify idempotency key — separate from enquiry idempotency. */
  siteverifyIdempotencyKey?: string;
  env?: NodeJS.ProcessEnv;
  fetchImpl?: typeof fetch;
}>;

/**
 * Verify a Turnstile token for enquiry submission.
 * Cheap validation runs before the remote call; malformed tokens skip Siteverify.
 */
export async function verifyEnquiryTurnstileToken(
  options: VerifyEnquiryTurnstileOptions,
): Promise<TurnstileVerifyOutcome> {
  const env = options.env ?? process.env;
  const config = resolveTurnstileConfig(env);

  if (!config) {
    return { ok: false, reason: "missing-config" };
  }

  if (turnstileConfigUsesTestKeysInProduction(config)) {
    return { ok: false, reason: "test-keys-in-production" };
  }

  if (
    options.token == null ||
    (typeof options.token === "string" && options.token.trim().length === 0)
  ) {
    return { ok: false, reason: "missing-token" };
  }

  const validatedToken = validateTurnstileToken(options.token);
  if (!validatedToken) {
    return { ok: false, reason: "invalid-token" };
  }

  const body = new URLSearchParams();
  body.set("secret", config.secretKey);
  body.set("response", validatedToken);
  if (options.remoteIp?.trim()) {
    body.set("remoteip", options.remoteIp.trim());
  }
  if (options.siteverifyIdempotencyKey?.trim()) {
    body.set("idempotency_key", options.siteverifyIdempotencyKey.trim());
  }

  const fetchFn = options.fetchImpl ?? fetch;
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    TURNSTILE_VERIFY_TIMEOUT_MS,
  );

  let response: Response;
  try {
    response = await fetchFn(TURNSTILE_SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: controller.signal,
      cache: "no-store",
    });
  } catch {
    return { ok: false, reason: "provider-unavailable" };
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    return { ok: false, reason: "provider-unavailable" };
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    return { ok: false, reason: "malformed-response" };
  }

  const parsed = parseSiteverifyResponse(json);
  if (!parsed) {
    return { ok: false, reason: "malformed-response" };
  }

  return evaluateSiteverifyResponse(parsed, {
    hostname: config.expectedHostname,
    action: TURNSTILE_ENQUIRY_ACTION,
  });
}
