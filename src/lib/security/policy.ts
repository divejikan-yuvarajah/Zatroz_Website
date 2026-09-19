/**
 * Shared request-policy constants (safe for tests; no secrets).
 * Transport: Next.js Server Action (Step 43) — helpers map to that boundary.
 */

/** Initial body budget for enquiry submission material (32 KiB). */
export const ENQUIRY_REQUEST_BODY_BUDGET_BYTES = 32 * 1024;

/** Rate-limit policy version — bump when bucket key material changes. */
export const RATE_LIMIT_POLICY_VERSION = 1 as const;

/**
 * Initial operational defaults — not universal security guarantees.
 * Per-source: 10 attempts / 10 minutes. Global circuit: 120 / 10 minutes.
 */
export const RATE_LIMIT_POLICIES = {
  enquiryPerSource: {
    id: "enquiry-per-source",
    limit: 10,
    windowMs: 10 * 60 * 1000,
  },
  enquiryGlobal: {
    id: "enquiry-global",
    limit: 120,
    windowMs: 10 * 60 * 1000,
  },
} as const;

export type RateLimitPolicyId =
  (typeof RATE_LIMIT_POLICIES)[keyof typeof RATE_LIMIT_POLICIES]["id"];

/** Allowed JSON media type for a future JSON boundary (charset optional). */
export const ALLOWED_JSON_CONTENT_TYPE_PATTERN =
  /^application\/json(?:\s*;\s*charset\s*=\s*["']?utf-8["']?)?$/i;

export const SAFE_CACHE_CONTROL = "no-store" as const;

export const CUSTOMER_SAFE_MESSAGES = {
  validation: "Please check the highlighted fields and try again.",
  rateLimited:
    "Too many attempts from this network. Please wait a few minutes, or email / WhatsApp us using the contact details on this page.",
  unavailable:
    "We could not process your enquiry right now. Please try again later, or email / WhatsApp us using the contact details on this page.",
  unknown:
    "We could not confirm whether your enquiry was received. Try again later, or email / WhatsApp us using the contact details on this page.",
  forbiddenOrigin:
    "This request could not be verified. Use the contact form on our website, or email / WhatsApp us directly.",
} as const;
