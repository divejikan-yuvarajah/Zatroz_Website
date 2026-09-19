/**
 * Development-only enquiry submission simulations.
 * Never called from production /contact.
 */

import type { EnquirySubmitResult, SubmitEnquiryFn } from "./transport";

export type EnquirySimulateScenario =
  | "accepted"
  | "validation-error"
  | "rate-limited"
  | "unavailable"
  | "unknown-outcome"
  | "challenge-failed"
  | "malformed"
  | "delayed";

export type CreateSimulatedSubmitOptions = {
  scenario: EnquirySimulateScenario;
  /** Artificial delay in ms (useful for double-submit tests). */
  delayMs?: number;
};

async function wait(ms: number): Promise<void> {
  if (ms <= 0) return;
  await new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Returns a submit function for the gallery harness.
 * Does not network, persist, log personal data, or hit production.
 */
export function createSimulatedSubmitEnquiry(
  options: CreateSimulatedSubmitOptions,
): SubmitEnquiryFn {
  const delayMs =
    options.delayMs ?? (options.scenario === "delayed" ? 1200 : 350);

  return async (): Promise<EnquirySubmitResult> => {
    await wait(delayMs);

    switch (options.scenario) {
      case "accepted":
      case "delayed":
        return {
          status: "accepted",
          reference: "demo-ref",
          message: "We have received your enquiry.",
        };
      case "validation-error":
        return {
          status: "validation-error",
          message: "Check the highlighted fields and try again.",
          fieldErrors: {
            message: "Add a little more detail about your project.",
          },
        };
      case "rate-limited":
        return {
          status: "rate-limited",
          message:
            "Too many attempts right now. Wait a short while before trying again, or email / WhatsApp us.",
          retryAfterSeconds: 60,
        };
      case "unavailable":
        return {
          status: "unavailable",
          message:
            "The enquiry service is temporarily unavailable. Please email or message us on WhatsApp instead.",
        };
      case "unknown-outcome":
        return {
          status: "unknown-outcome",
          message:
            "We could not confirm whether your enquiry was received. Try again later, or email / WhatsApp us using the contact details on this page.",
        };
      case "challenge-failed":
        return {
          status: "challenge-failed",
          message:
            "We could not verify this submission. Complete the security check and try again, or email / WhatsApp us using the contact details on this page.",
        };
      case "malformed":
        // Caller should coerce; returning a non-contract shape on purpose.
        return {
          status: "accepted",
          message: "We have received your enquiry.",
        } satisfies EnquirySubmitResult;
      default:
        return {
          status: "unavailable",
          message:
            "The enquiry service is temporarily unavailable. Please email or message us on WhatsApp instead.",
        };
    }
  };
}

/** Deliberately returns a non-contract payload for harness testing. */
export function createMalformedSubmitEnquiry(
  delayMs = 200,
): () => Promise<unknown> {
  return async () => {
    await wait(delayMs);
    return { ok: true, mongoId: "should-never-surface" };
  };
}
