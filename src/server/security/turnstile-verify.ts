/**
 * Server-only re-export of Turnstile Siteverify for Server Actions.
 * Prefer importing from here in server code so the adapter stays out of client bundles.
 */

import "server-only";

export {
  verifyEnquiryTurnstileToken,
  type VerifyEnquiryTurnstileOptions,
} from "@/lib/security/turnstile-siteverify";
