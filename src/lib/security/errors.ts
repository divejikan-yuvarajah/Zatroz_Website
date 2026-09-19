/**
 * Safe operational error mapping — customer messages + allowlisted log fields.
 * Never include PII, connection strings, or raw driver errors.
 */

import { randomBytes } from "node:crypto";
import { CUSTOMER_SAFE_MESSAGES } from "@/lib/security/policy";
import type { EnquirySubmitResult } from "@/lib/enquiries/transport";

export type ErrorCategory =
  | "validation"
  | "duplicate-key"
  | "rate-limited"
  | "network"
  | "timeout"
  | "permission"
  | "unavailable-schema"
  | "unavailable"
  | "forbidden-origin"
  | "payload-too-large"
  | "unsupported-media"
  | "malformed"
  | "unknown";

export type SafeLogEvent = Readonly<{
  category: ErrorCategory;
  operation: string;
  correlationId: string;
  elapsedMs?: number;
}>;

export function createCorrelationId(): string {
  return `z-${randomBytes(8).toString("hex")}`;
}

/**
 * Map known failure kinds to customer-safe enquiry results.
 */
export function mapFailureToEnquiryResult(
  category: ErrorCategory,
  options?: { retryAfterSeconds?: number },
): EnquirySubmitResult {
  switch (category) {
    case "validation":
      return {
        status: "validation-error",
        message: CUSTOMER_SAFE_MESSAGES.validation,
        fieldErrors: {},
      };
    case "rate-limited":
      return {
        status: "rate-limited",
        message: CUSTOMER_SAFE_MESSAGES.rateLimited,
        retryAfterSeconds: options?.retryAfterSeconds,
      };
    case "forbidden-origin":
    case "payload-too-large":
    case "unsupported-media":
    case "malformed":
      return {
        status: "unavailable",
        message: CUSTOMER_SAFE_MESSAGES.forbiddenOrigin,
      };
    case "duplicate-key":
      // Duplicate idempotency is handled by repositories as accept/replay —
      // unexpected duplicates surface as unavailable rather than leaking keys.
      return {
        status: "unavailable",
        message: CUSTOMER_SAFE_MESSAGES.unavailable,
      };
    case "network":
    case "timeout":
    case "permission":
    case "unavailable-schema":
    case "unavailable":
      return {
        status: "unavailable",
        message: CUSTOMER_SAFE_MESSAGES.unavailable,
      };
    default:
      return {
        status: "unknown-outcome",
        message: CUSTOMER_SAFE_MESSAGES.unknown,
      };
  }
}

/**
 * Classify a MongoDB / Node error without exposing its message.
 */
export function classifyMongoError(error: unknown): ErrorCategory {
  const name =
    error && typeof error === "object" && "name" in error
      ? String((error as { name: unknown }).name)
      : "";
  const code =
    error && typeof error === "object" && "code" in error
      ? (error as { code: unknown }).code
      : undefined;

  if (code === 11000 || name === "MongoServerError") {
    if (code === 11000) return "duplicate-key";
  }
  if (name === "MongoServerSelectionError" || name === "MongoNetworkError") {
    return "network";
  }
  if (name === "MongoNetworkTimeoutError" || name === "TimeoutError") {
    return "timeout";
  }
  if (name === "MongoError" && code === 13) {
    return "permission";
  }
  return "unavailable";
}

/**
 * Sanitize a log line — only allowlisted fields.
 */
export function formatSafeLogLine(event: SafeLogEvent): string {
  const parts = [
    `category=${event.category}`,
    `operation=${event.operation}`,
    `correlationId=${event.correlationId}`,
  ];
  if (typeof event.elapsedMs === "number") {
    parts.push(`elapsedMs=${Math.round(event.elapsedMs)}`);
  }
  return parts.join(" ");
}

/** Fields that must never appear in application logs. */
export const FORBIDDEN_LOG_FIELD_NAMES = [
  "email",
  "message",
  "name",
  "phone",
  "idempotencyKey",
  "idempotencyDigest",
  "payloadFingerprint",
  "MONGODB_URI",
  "password",
  "authorization",
  "cookie",
] as const;

export function assertNoForbiddenLogFields(
  record: Record<string, unknown>,
): string[] {
  const hits: string[] = [];
  for (const key of FORBIDDEN_LOG_FIELD_NAMES) {
    if (Object.prototype.hasOwnProperty.call(record, key)) {
      hits.push(key);
    }
  }
  return hits;
}
