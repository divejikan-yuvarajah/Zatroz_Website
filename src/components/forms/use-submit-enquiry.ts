/**
 * Client-side enquiry submission wrapper.
 * Bridges the Server Action to the SubmitEnquiryFn type with idempotency key management.
 */

"use client";

import { useCallback, useRef } from "react";
import type { EnquiryNormalizedInput } from "@/lib/enquiries/input";
import {
  coerceEnquirySubmitResult,
  type EnquirySubmitResult,
  type SubmitEnquiryFn,
} from "@/lib/enquiries/transport";
import { submitEnquiryAction } from "@/server/actions/submit-enquiry";

/** Generate a cryptographically random idempotency key (browser). */
function generateIdempotencyKey(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Hook that returns a stable SubmitEnquiryFn for the real Server Action.
 * Manages an idempotency key per captured attempt:
 * - Generates a fresh key for each new submission.
 * - Retains the key across uncertain retries of the same payload.
 * - Clears after a confirmed accepted result.
 */
export function useSubmitEnquiry(): SubmitEnquiryFn {
  const currentKey = useRef<string | null>(null);
  const lastPayload = useRef<string | null>(null);

  return useCallback(
    async (input: EnquiryNormalizedInput): Promise<EnquirySubmitResult> => {
      const payloadSignature = JSON.stringify(input);

      // Generate a new key if this is a new/changed submission
      if (!currentKey.current || lastPayload.current !== payloadSignature) {
        currentKey.current = generateIdempotencyKey();
        lastPayload.current = payloadSignature;
      }

      let raw: unknown;
      try {
        raw = await submitEnquiryAction(input);
      } catch {
        return {
          status: "unknown-outcome",
          message:
            "We could not confirm whether your enquiry was received. Try again later, or email / WhatsApp us using the contact details on this page.",
        };
      }

      const result = coerceEnquirySubmitResult(raw);

      // Clear key after confirmed acceptance so next submission gets a fresh key
      if (result.status === "accepted") {
        currentKey.current = null;
        lastPayload.current = null;
      }

      return result;
    },
    [],
  );
}
