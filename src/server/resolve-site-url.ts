/**
 * Pure SITE_URL normalisation (no secrets).
 * Used by the server-only env helper and by a lightweight verification script.
 */
export function resolveSiteUrl(raw: string | undefined): string {
  const fallback = "http://localhost:3000";
  const value = (raw ?? "").trim();

  if (!value) {
    return fallback;
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(
      'Invalid SITE_URL: must be an absolute http(s) URL (for example "http://localhost:3000").',
    );
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(
      "Invalid SITE_URL: only http: and https: protocols are allowed.",
    );
  }

  // Normalise: drop trailing slash on the origin path for a stable site origin.
  const normalized = `${url.protocol}//${url.host}`;
  return normalized;
}
