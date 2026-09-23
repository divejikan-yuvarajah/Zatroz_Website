/**
 * Canonical origin helpers for SEO (pure — no Host / forwarded-host).
 * Reuses the same SITE_URL normalisation as auth and enquiry policy.
 */

import { resolveSiteUrl } from "@/server/resolve-site-url";

/** Normalise SITE_URL to an origin (scheme + host). Throws on invalid values. */
export function resolveCanonicalOrigin(
  raw: string | undefined = process.env.SITE_URL,
): string {
  return resolveSiteUrl(raw);
}

/**
 * Join an origin and a site-relative path into an absolute URL.
 * Paths must start with `/`. Query/hash on `path` are preserved.
 */
export function joinAbsoluteUrl(origin: string, path: string): string {
  const base = origin.replace(/\/+$/, "");
  if (!path.startsWith("/")) {
    throw new Error(
      `joinAbsoluteUrl: path must be site-relative (got "${path}")`,
    );
  }
  return `${base}${path}`;
}

/** Marketing attribution and other non-content query keys to drop from canonicals. */
export const NON_CANONICAL_QUERY_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "msclkid",
  "ref",
] as const;
