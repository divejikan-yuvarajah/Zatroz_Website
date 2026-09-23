/**
 * Response security headers. Safe to import from next.config.
 *
 * Enforced CSP is limited to directives that do not block Next.js inline
 * bootstrap scripts. A stricter script policy is report-only until a
 * per-response nonce is wired (that would force dynamic HTML).
 */

export const ENFORCED_CSP = [
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
].join("; ");

/** Origins the app actually uses. Not a host wildcard. */
export const REPORT_ONLY_CSP = [
  "default-src 'self'",
  "script-src 'self' https://challenges.cloudflare.com",
  "style-src 'self'",
  "img-src 'self' data: blob: https://res.cloudinary.com",
  "font-src 'self'",
  "connect-src 'self' https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
].join("; ");

export function securityHeaderList(): { key: string; value: string }[] {
  return [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-Frame-Options", value: "DENY" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), payment=()",
    },
    { key: "Content-Security-Policy", value: ENFORCED_CSP },
    { key: "Content-Security-Policy-Report-Only", value: REPORT_ONLY_CSP },
  ];
}
