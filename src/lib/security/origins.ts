/**
 * Origin allowlist construction for enquiry submission boundaries.
 * Origins come from trusted deployment config — never Host / X-Forwarded-Host.
 */

import { CUSTOMER_SAFE_MESSAGES } from "@/lib/security/policy";

export type OriginPolicyConfig = Readonly<{
  /** Exact approved site origin (e.g. https://zatroz.example). */
  appOrigin?: string;
  /** APP_ENV / deployment marker. */
  appEnv: "development" | "test" | "preview" | "production";
  /** Extra exact origins allowed only outside production (localhost tests). */
  extraDevOrigins?: readonly string[];
}>;

export type OriginCheckResult =
  | { ok: true; origin: string }
  | { ok: false; reason: "missing" | "null" | "foreign"; message: string };

function normalizeOrigin(value: string): string | null {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    // Reject credentials / paths / queries in configured origins.
    if (url.username || url.password) return null;
    if (url.pathname !== "/" || url.search || url.hash) {
      // Allow bare origin strings that parse with trailing path stripped.
      return `${url.protocol}//${url.host}`;
    }
    return `${url.protocol}//${url.host}`;
  } catch {
    return null;
  }
}

const LOCAL_DEV_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
] as const;

/**
 * Build the exact allowlist from trusted config.
 * Does not whitelist all preview subdomains or reflect request Host.
 */
export function buildAllowedOrigins(
  config: OriginPolicyConfig,
): readonly string[] {
  const allowed = new Set<string>();

  if (config.appOrigin) {
    const normalized = normalizeOrigin(config.appOrigin);
    if (normalized) allowed.add(normalized);
  }

  if (config.appEnv !== "production") {
    for (const origin of LOCAL_DEV_ORIGINS) {
      allowed.add(origin);
    }
    for (const extra of config.extraDevOrigins ?? []) {
      const normalized = normalizeOrigin(extra);
      if (normalized) allowed.add(normalized);
    }
  }

  return [...allowed];
}

/**
 * Require an approved browser Origin for enquiry submission.
 * Missing, null, or foreign origins are rejected.
 */
export function checkEnquiryOrigin(
  originHeader: string | null | undefined,
  config: OriginPolicyConfig,
): OriginCheckResult {
  if (originHeader == null || originHeader.trim() === "") {
    return {
      ok: false,
      reason: "missing",
      message: CUSTOMER_SAFE_MESSAGES.forbiddenOrigin,
    };
  }
  if (originHeader.trim().toLowerCase() === "null") {
    return {
      ok: false,
      reason: "null",
      message: CUSTOMER_SAFE_MESSAGES.forbiddenOrigin,
    };
  }

  const normalized = normalizeOrigin(originHeader.trim());
  if (!normalized) {
    return {
      ok: false,
      reason: "foreign",
      message: CUSTOMER_SAFE_MESSAGES.forbiddenOrigin,
    };
  }

  const allowed = buildAllowedOrigins(config);
  if (!allowed.includes(normalized)) {
    return {
      ok: false,
      reason: "foreign",
      message: CUSTOMER_SAFE_MESSAGES.forbiddenOrigin,
    };
  }

  return { ok: true, origin: normalized };
}

/**
 * Fetch Metadata supplementary check (not authentication).
 * When headers are present, require same-origin style values for this form post.
 */
export function checkFetchMetadataSupplement(headers: {
  secFetchSite?: string | null;
  secFetchMode?: string | null;
}): { ok: true } | { ok: false; reason: string } {
  const site = headers.secFetchSite?.toLowerCase();
  const mode = headers.secFetchMode?.toLowerCase();

  // Absent headers (older browsers / some proxies) — do not fail solely on this.
  if (!site && !mode) {
    return { ok: true };
  }

  if (
    site &&
    site !== "same-origin" &&
    site !== "same-site" &&
    site !== "none"
  ) {
    // "none" can appear for user-initiated navigations; for form actions prefer same-*.
    if (site === "cross-site") {
      return { ok: false, reason: "cross-site-fetch-metadata" };
    }
  }

  if (
    mode &&
    mode !== "cors" &&
    mode !== "same-origin" &&
    mode !== "navigate"
  ) {
    // Server Actions often appear as cors/same-origin depending on runtime.
    return { ok: false, reason: "unexpected-fetch-mode" };
  }

  return { ok: true };
}

/**
 * Reject spoofed Host / X-Forwarded-Host as origin sources.
 * Callers must never pass these into buildAllowedOrigins.
 */
export function isUntrustedOriginSourceHeader(name: string): boolean {
  const lower = name.toLowerCase();
  return (
    lower === "host" ||
    lower === "x-forwarded-host" ||
    lower === "x-forwarded-server" ||
    lower === "forwarded"
  );
}
