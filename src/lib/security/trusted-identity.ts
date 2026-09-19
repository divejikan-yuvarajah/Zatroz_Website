/**
 * Trusted client identity helpers (pure).
 * Server code should still avoid logging raw identities.
 */

export type TrustedIdentityPlatform = "vercel" | "unknown" | "test";

export type TrustedIdentityResult =
  | { ok: true; identity: string; source: string }
  | { ok: false; reason: "missing" | "invalid" };

/**
 * Resolve a trusted client IP / identity from platform-verified headers only.
 *
 * - Vercel: uses `x-vercel-forwarded-for` when present (platform-controlled).
 * - Local/test: callers must pass `testIdentity` via code — never an HTTP bypass param.
 * - Do not use Host, X-Real-IP alone, or arbitrary leftmost X-Forwarded-For.
 */
export function resolveTrustedClientIdentity(options: {
  headers: Headers | Record<string, string | null | undefined>;
  platform?: TrustedIdentityPlatform;
  testIdentity?: string;
}): TrustedIdentityResult {
  if (options.testIdentity != null && options.testIdentity.trim() !== "") {
    return {
      ok: true,
      identity: options.testIdentity.trim(),
      source: "test-injection",
    };
  }

  const get = (name: string): string | undefined => {
    if (typeof (options.headers as Headers).get === "function") {
      const value = (options.headers as Headers).get(name);
      return value ?? undefined;
    }
    const record = options.headers as Record<string, string | null | undefined>;
    const value = record[name] ?? record[name.toLowerCase()];
    return value ?? undefined;
  };

  const platform = options.platform ?? detectPlatform(get);

  if (platform === "vercel") {
    const vercelForwarded = get("x-vercel-forwarded-for");
    if (vercelForwarded) {
      const first = vercelForwarded.split(",")[0]?.trim();
      if (first && isPlausibleIpOrIdentity(first)) {
        return {
          ok: true,
          identity: normalizeIdentity(first),
          source: "x-vercel-forwarded-for",
        };
      }
    }
    return { ok: false, reason: "missing" };
  }

  return { ok: false, reason: "missing" };
}

function detectPlatform(
  get: (name: string) => string | undefined,
): TrustedIdentityPlatform {
  if (get("x-vercel-id") || get("x-vercel-forwarded-for")) {
    return "vercel";
  }
  return "unknown";
}

function isPlausibleIpOrIdentity(value: string): boolean {
  if (value.length < 3 || value.length > 128) return false;
  if (/[\s\r\n]/.test(value)) return false;
  return true;
}

function normalizeIdentity(value: string): string {
  return value.trim().toLowerCase();
}

export const MISSING_IDENTITY_FALLBACK = "missing-trusted-identity" as const;
