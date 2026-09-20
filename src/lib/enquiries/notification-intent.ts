/**
 * Enquiry notification intent — pure helpers (no I/O).
 * Intent is embedded on the enquiry document and created with acceptance.
 */

import { createHash, randomBytes } from "node:crypto";
import type { EnquiryNormalizedInput } from "@/lib/enquiries/input";
import { ENQUIRY_INTERNAL_TEMPLATE_VERSION } from "@/lib/email/templates/enquiry-internal";
import type { EmailConfig } from "@/lib/email/config";

export const ENQUIRY_NOTIFICATION_TYPE = "enquiry-internal" as const;

export const ENQUIRY_NOTIFICATION_INTENT_STATES = [
  "pending",
  "paused",
  "leased",
  "provider-accepted",
  "rejected",
  "uncertain",
] as const;

export type EnquiryNotificationIntentState =
  (typeof ENQUIRY_NOTIFICATION_INTENT_STATES)[number];

export const ENQUIRY_NOTIFICATION_ERROR_CATEGORIES = [
  "missing-config",
  "notifications-disabled",
  "invalid-payload",
  "recipient-not-allowed",
  "provider-rejected",
  "provider-unavailable",
  "rate-limited",
  "timeout",
  "network-loss",
  "ambiguous-response",
  "lease-lost",
  "persistence-failed",
] as const;

export type EnquiryNotificationErrorCategory =
  (typeof ENQUIRY_NOTIFICATION_ERROR_CATEGORIES)[number];

/** Frozen provider request identity — set before the first external attempt. */
export type EnquiryNotificationFreeze = Readonly<{
  fromHeader: string;
  to: readonly string[];
  replyTo: string;
  receivedAtDisplay: string;
  templateVersion: string;
  /** Stable hash of frozen send identity (no browser key, no secrets). */
  requestFingerprint: string;
}>;

export type EnquiryNotificationIntent = {
  intentId: string;
  type: typeof ENQUIRY_NOTIFICATION_TYPE;
  state: EnquiryNotificationIntentState;
  templateVersion: string;
  /** Provider idempotency key — derived from intent/version only. */
  providerIdempotencyKey: string;
  freeze: EnquiryNotificationFreeze | null;
  attempts: number;
  nextAttemptAt: Date;
  leaseOwner: string | null;
  leaseToken: string | null;
  leaseExpiresAt: Date | null;
  /** First moment a provider attempt may have started (dedupe horizon). */
  firstProviderAttemptAt: Date | null;
  providerMessageId: string | null;
  lastErrorCategory: EnquiryNotificationErrorCategory | null;
  createdAt: Date;
  updatedAt: Date;
};

export const ENQUIRY_NOTIFICATION_LEASE_MS = 45_000;
export const ENQUIRY_NOTIFICATION_PROVIDER_BUDGET_MS = 15_000;
export const ENQUIRY_NOTIFICATION_DISPATCH_BATCH_MAX = 10;

export function createNotificationIntentId(): string {
  return `eni_${randomBytes(12).toString("hex")}`;
}

export function buildProviderIdempotencyKey(input: {
  intentId: string;
  templateVersion: string;
}): string {
  // No email addresses and no browser enquiry key.
  return `enquiry-notice/${input.intentId}/${input.templateVersion}`;
}

export function buildRequestFingerprint(input: {
  fromHeader: string;
  to: readonly string[];
  replyTo: string;
  templateVersion: string;
  receivedAtDisplay: string;
  publicReference: string;
  payloadFingerprint: string;
}): string {
  const canonical = [
    `from=${input.fromHeader.trim().toLowerCase()}`,
    `to=${[...input.to]
      .map((v) => v.trim().toLowerCase())
      .sort()
      .join(",")}`,
    `replyTo=${input.replyTo.trim().toLowerCase()}`,
    `template=${input.templateVersion}`,
    `receivedAt=${input.receivedAtDisplay}`,
    `reference=${input.publicReference}`,
    `payload=${input.payloadFingerprint}`,
  ].join("\n");
  return createHash("sha256").update(canonical, "utf8").digest("hex");
}

/**
 * Build the intent embedded on a newly accepted enquiry.
 * Freeze is filled on first dispatch claim when email config is available.
 */
export function buildInitialNotificationIntent(input: {
  now: Date;
  notificationsEnabled: boolean;
  intentId?: string;
}): EnquiryNotificationIntent {
  const intentId = input.intentId ?? createNotificationIntentId();
  const templateVersion = ENQUIRY_INTERNAL_TEMPLATE_VERSION;
  return {
    intentId,
    type: ENQUIRY_NOTIFICATION_TYPE,
    state: input.notificationsEnabled ? "pending" : "paused",
    templateVersion,
    providerIdempotencyKey: buildProviderIdempotencyKey({
      intentId,
      templateVersion,
    }),
    freeze: null,
    attempts: 0,
    nextAttemptAt: input.now,
    leaseOwner: null,
    leaseToken: null,
    leaseExpiresAt: null,
    firstProviderAttemptAt: null,
    providerMessageId: null,
    lastErrorCategory: input.notificationsEnabled
      ? null
      : "notifications-disabled",
    createdAt: input.now,
    updatedAt: input.now,
  };
}

export function buildNotificationFreeze(input: {
  config: EmailConfig;
  enquiry: EnquiryNormalizedInput;
  publicReference: string;
  payloadFingerprint: string;
  receivedAtDisplay: string;
  templateVersion?: string;
}): EnquiryNotificationFreeze {
  const templateVersion =
    input.templateVersion ?? ENQUIRY_INTERNAL_TEMPLATE_VERSION;
  const to = [...input.config.notificationRecipients];
  const replyTo = input.enquiry.email.trim().toLowerCase();
  return {
    fromHeader: input.config.fromHeader,
    to,
    replyTo,
    receivedAtDisplay: input.receivedAtDisplay,
    templateVersion,
    requestFingerprint: buildRequestFingerprint({
      fromHeader: input.config.fromHeader,
      to,
      replyTo,
      templateVersion,
      receivedAtDisplay: input.receivedAtDisplay,
      publicReference: input.publicReference,
      payloadFingerprint: input.payloadFingerprint,
    }),
  };
}

export function isNotificationIntentState(
  value: unknown,
): value is EnquiryNotificationIntentState {
  return (
    typeof value === "string" &&
    (ENQUIRY_NOTIFICATION_INTENT_STATES as readonly string[]).includes(value)
  );
}

export function mapSendResultToIntentOutcome(
  status: "accepted" | "rejected" | "transient-failure" | "uncertain",
  reason?: string,
): {
  state: Exclude<
    EnquiryNotificationIntentState,
    "pending" | "paused" | "leased"
  >;
  errorCategory: EnquiryNotificationErrorCategory | null;
} {
  if (status === "accepted") {
    return { state: "provider-accepted", errorCategory: null };
  }
  if (status === "uncertain") {
    return {
      state: "uncertain",
      errorCategory:
        reason === "ambiguous-response" ? "ambiguous-response" : "network-loss",
    };
  }
  if (status === "transient-failure") {
    const category: EnquiryNotificationErrorCategory =
      reason === "rate-limited"
        ? "rate-limited"
        : reason === "timeout"
          ? "timeout"
          : "provider-unavailable";
    return { state: "uncertain", errorCategory: category };
  }

  const category: EnquiryNotificationErrorCategory =
    reason === "notifications-disabled"
      ? "notifications-disabled"
      : reason === "missing-config"
        ? "missing-config"
        : reason === "recipient-not-allowed"
          ? "recipient-not-allowed"
          : reason === "provider-rejected"
            ? "provider-rejected"
            : "invalid-payload";
  return { state: "rejected", errorCategory: category };
}

/** Format a frozen UTC display timestamp (no locale variance). */
export function formatReceivedAtDisplay(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}
