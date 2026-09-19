/**
 * Env-only readiness fragments (pure). Full DB readiness stays server-side.
 */

import { isMongoRuntimeConfigured } from "@/lib/mongodb/config";
import {
  resolveTurnstileConfig,
  turnstileConfigUsesTestKeysInProduction,
} from "@/lib/security/turnstile";

export type EnvReadinessItem = Readonly<{
  id:
    | "env-mongodb"
    | "env-abuse-secret"
    | "env-origin"
    | "enquiries-enabled-flag"
    | "env-turnstile-site-key"
    | "env-turnstile-secret";
  ok: boolean;
  detail: string;
}>;

export function evaluateEnquiryEnvReadiness(
  env: NodeJS.ProcessEnv = process.env,
): readonly EnvReadinessItem[] {
  const items: EnvReadinessItem[] = [];

  items.push({
    id: "env-mongodb",
    ok: isMongoRuntimeConfigured(env),
    detail: isMongoRuntimeConfigured(env)
      ? "MongoDB runtime config present"
      : "MONGODB_URI / MONGODB_DB_NAME missing or invalid",
  });

  const abuse = (env.ABUSE_HASH_SECRET ?? "").trim().length > 0;
  items.push({
    id: "env-abuse-secret",
    ok: abuse,
    detail: abuse ? "ABUSE_HASH_SECRET present" : "ABUSE_HASH_SECRET missing",
  });

  const origin = (env.APP_ORIGIN ?? env.SITE_URL ?? "").trim();
  items.push({
    id: "env-origin",
    ok: origin.length > 0,
    detail: origin
      ? "APP_ORIGIN or SITE_URL present for allowlist"
      : "APP_ORIGIN / SITE_URL missing",
  });

  const enabled = (env.ENQUIRIES_ENABLED ?? "").trim().toLowerCase() === "true";
  items.push({
    id: "enquiries-enabled-flag",
    ok: enabled,
    detail: enabled
      ? "ENQUIRIES_ENABLED=true"
      : "ENQUIRIES_ENABLED is not true — submission stays disabled",
  });

  const turnstile = resolveTurnstileConfig(env);
  const turnstileTestKeysInProd =
    turnstile != null && turnstileConfigUsesTestKeysInProduction(turnstile);

  items.push({
    id: "env-turnstile-site-key",
    ok: Boolean(turnstile?.siteKey) && !turnstileTestKeysInProd,
    detail: !turnstile?.siteKey
      ? "NEXT_PUBLIC_TURNSTILE_SITE_KEY missing"
      : turnstileTestKeysInProd
        ? "Test Turnstile site key refused in production"
        : "Turnstile site key configured",
  });

  items.push({
    id: "env-turnstile-secret",
    ok: Boolean(turnstile?.secretKey) && !turnstileTestKeysInProd,
    detail: !turnstile?.secretKey
      ? "TURNSTILE_SECRET_KEY missing"
      : turnstileTestKeysInProd
        ? "Test Turnstile secret refused in production"
        : "Turnstile secret configured",
  });

  return items;
}
