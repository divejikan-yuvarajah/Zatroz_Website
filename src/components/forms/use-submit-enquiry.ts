/**
 * Client-side enquiry submission wrapper.
 * Bridges the Server Action to the SubmitEnquiryFn type with idempotency key management.
 *
 * Attempt lifecycle:
 * - A fresh key is generated for each new/changed submission.
 * - The key is retained across retries of the same captured payload (e.g. after unknown-outcome).
 * - The key is cleared only after a confirmed accepted result.
 * - Page refresh loses in-memory state — documented limitation.
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
 * Stable canonical signature of business-only fields.
 * Must match the server's businessFieldsProjection ordering
 * so the same input produces the same key retention decision.
 */
function businessPayloadSignature(input: EnquiryNormalizedInput): string {
  const fields: Record<string, string | null> = {
    name: input.name,
    email: input.email.toLowerCase(),
    company: input.company,
    service: input.service,
    message: input.message,
    timeline: input.timeline,
    requestType: input.requestType,
    preferredContact: input.preferredContact,
    phone: input.phone,
  };
  return Object.keys(fields)
    .sort()
    .map((k) => `${k}=${fields[k] ?? ""}`)
    .join("\n");
}

/**
 * Hook that returns a stable SubmitEnquiryFn for the real Server Action.
 * Manages an idempotency key per captured attempt:
 * - Generates a fresh key for each new/changed submission.
 * - Retains the key across uncertain retries of the same payload.
 * - Clears after a confirmed accepted result.
 *
 * Limitation: refreshing the page loses the in-memory key. A retry
 * after refresh generates a new key and may create a second enquiry
 * if the first was already stored. This is documented in the contract.
 */
export function useSubmitEnquiry(): SubmitEnquiryFn {
  const currentKey = useRef<string | null>(null);
  const lastPayload = useRef<string | null>(null);

  return useCallback(
    async (input: EnquiryNormalizedInput): Promise<EnquirySubmitResult> => {
      const signature = businessPayloadSignature(input);

      // Generate a new key if this is a new/changed submission
      if (!currentKey.current || lastPayload.current !== signature) {
        currentKey.current = generateIdempotencyKey();
        lastPayload.current = signature;
      }

      let raw: unknown;
      try {
        raw = await submitEnquiryAction(input, currentKey.current);
      } catch {
        // Network/transport failure — retain key for retry
        return {
          status: "unknown-outcome",
          message:
            "We could not confirm whether your enquiry was received. Try again later, or email / WhatsApp us using the contact details on this page.",
        };
      }

      const result = coerceEnquirySubmitResult(raw);

      // Clear key only after confirmed acceptance so next submission gets a fresh key
      if (result.status === "accepted") {
        currentKey.current = null;
        lastPayload.current = null;
      }
      // For unknown-outcome, rate-limited, unavailable: keep key for retry
      // For validation-error: keep key (correction + resubmit generates new key
      // only if the business fields actually changed)

      return result;
    },
    [],
  );
}
