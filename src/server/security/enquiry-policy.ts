import "server-only";

/**
 * Server-only re-exports for enquiry policy helpers.
 */

export {
  buildOriginConfigFromEnv,
  enquiryPayloadByteEstimate,
  gateEnquiryServerActionInput,
  type EnquiryPolicyGateResult,
  type EnquiryPolicyHeaders,
} from "@/lib/security/enquiry-gate";
