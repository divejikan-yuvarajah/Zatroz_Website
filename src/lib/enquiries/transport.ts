/**
 * Enquiry transport contract for the future Server Action boundary.
 * Frontend simulation and later backend must share these meanings.
 */

import type { EnquiryFieldErrors, EnquiryNormalizedInput } from "./input";

export type EnquirySubmitAccepted = {
  status: "accepted";
  /** Opaque public reference when the backend supplies one. */
  reference?: string;
  message: string;
};

export type EnquirySubmitValidationError = {
  status: "validation-error";
  message: string;
  fieldErrors: EnquiryFieldErrors;
};

export type EnquirySubmitRateLimited = {
  status: "rate-limited";
  message: string;
  /** Seconds until retry is advised, when known. */
  retryAfterSeconds?: number;
};

export type EnquirySubmitUnavailable = {
  status: "unavailable";
  message: string;
};

export type EnquirySubmitUnknownOutcome = {
  status: "unknown-outcome";
  message: string;
};

export type EnquirySubmitResult =
  | EnquirySubmitAccepted
  | EnquirySubmitValidationError
  | EnquirySubmitRateLimited
  | EnquirySubmitUnavailable
  | EnquirySubmitUnknownOutcome;

/**
 * Future transport: Next.js Server Action (not a parallel Route Handler).
 * Must independently validate `input` and never trust client-only checks.
 */
export type SubmitEnquiryFn = (
  input: EnquiryNormalizedInput,
) => Promise<EnquirySubmitResult>;

export function isEnquirySubmitResult(
  value: unknown,
): value is EnquirySubmitResult {
  if (!value || typeof value !== "object") {
    return false;
  }
  const status = (value as { status?: unknown }).status;
  return (
    status === "accepted" ||
    status === "validation-error" ||
    status === "rate-limited" ||
    status === "unavailable" ||
    status === "unknown-outcome"
  );
}

/** Map a malformed/unexpected transport payload to an unknown outcome. */
export function coerceEnquirySubmitResult(value: unknown): EnquirySubmitResult {
  if (isEnquirySubmitResult(value)) {
    return value;
  }
  return {
    status: "unknown-outcome",
    message:
      "We could not confirm whether your enquiry was received. Try again later, or email / WhatsApp us using the contact details on this page.",
  };
}
