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
  "retry-scheduled",
  "uncertain",
  "rejected",
  "permanently-failed",
  "needs-review",
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
  "idempotency-window-expired",
  "attempts-exhausted",
  "delivery-bounced",
  "delivery-complained",
  "delivery-suppressed",
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

/** Destination facts from verified provider events — separate from dispatch state. */
export const ENQUIRY_NOTIFICATION_DELIVERY_FACTS = [
  "delivered",
  "bounced",
  "complained",
  "suppressed",
] as const;

export type EnquiryNotificationDeliveryFact =
  (typeof ENQUIRY_NOTIFICATION_DELIVERY_FACTS)[number];

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
  /** Verified destination outcome (null until a delivery event is applied). */
  deliveryFact: EnquiryNotificationDeliveryFact | null;
  /** Optimistic concurrency token for owner recovery mutations. */
  recoveryVersion: number;
  createdAt: Date;
  updatedAt: Date;
};

export const ENQUIRY_NOTIFICATION_LEASE_MS = 45_000;
export const ENQUIRY_NOTIFICATION_PROVIDER_BUDGET_MS = 15_000;
export const ENQUIRY_NOTIFICATION_DISPATCH_BATCH_MAX = 10;

/** Operational retry settings (Step 52). */
export const ENQUIRY_NOTIFICATION_MAX_ATTEMPTS = 8;
export const ENQUIRY_NOTIFICATION_MAX_AGE_MS = 72 * 60 * 60_000;
/** Resend idempotency key retention — verified 2026-09-21 docs: 24 hours. */
export const RESEND_IDEMPOTENCY_WINDOW_MS = 24 * 60 * 60_000;
/** Margin inside the provider window (clock skew + max in-flight). */
export const ENQUIRY_NOTIFICATION_IDEMPOTENCY_MARGIN_MS =
  60 * 60_000 +
  ENQUIRY_NOTIFICATION_LEASE_MS +
  ENQUIRY_NOTIFICATION_PROVIDER_BUDGET_MS;
export const ENQUIRY_NOTIFICATION_BACKOFF_MS = [
  60_000,
  2 * 60_000,
  5 * 60_000,
  15 * 60_000,
  30 * 60_000,
  60 * 60_000,
  2 * 60 * 60_000,
  4 * 60 * 60_000,
] as const;
export const ENQUIRY_NOTIFICATION_OPS_STALE_PENDING_MS = 30 * 60_000;
export const ENQUIRY_NOTIFICATION_OPS_WORKER_HEARTBEAT_MS = 20 * 60_000;

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
    deliveryFact: null,
    recoveryVersion: 0,
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
    "pending" | "leased" | "retry-scheduled"
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

  if (reason === "notifications-disabled") {
    return { state: "paused", errorCategory: "notifications-disabled" };
  }

  const category: EnquiryNotificationErrorCategory =
    reason === "missing-config"
      ? "missing-config"
      : reason === "recipient-not-allowed"
        ? "recipient-not-allowed"
        : reason === "provider-rejected"
          ? "provider-rejected"
          : "invalid-payload";
  return { state: "permanently-failed", errorCategory: category };
}

/** Format a frozen UTC display timestamp (no locale variance). */
export function formatReceivedAtDisplay(date: Date): string {
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}

/** Deterministic jitter in [0.8, 1.2] from attempt + intent id. */
export function notificationBackoffJitterFactor(input: {
  intentId: string;
  attempts: number;
}): number {
  const material = `${input.intentId}:${input.attempts}`;
  let hash = 0;
  for (let i = 0; i < material.length; i += 1) {
    hash = (hash * 31 + material.charCodeAt(i)) >>> 0;
  }
  return 0.8 + (hash % 401) / 1000;
}

export function computeNotificationBackoffMs(input: {
  intentId: string;
  attempts: number;
}): number {
  const index = Math.min(
    Math.max(input.attempts - 1, 0),
    ENQUIRY_NOTIFICATION_BACKOFF_MS.length - 1,
  );
  const base = ENQUIRY_NOTIFICATION_BACKOFF_MS[index]!;
  return Math.round(base * notificationBackoffJitterFactor(input));
}

export function isWithinProviderIdempotencyWindow(input: {
  firstProviderAttemptAt: Date | null;
  now: Date;
}): boolean {
  if (!input.firstProviderAttemptAt) return true;
  const elapsed = input.now.getTime() - input.firstProviderAttemptAt.getTime();
  const limit =
    RESEND_IDEMPOTENCY_WINDOW_MS - ENQUIRY_NOTIFICATION_IDEMPOTENCY_MARGIN_MS;
  return elapsed < limit;
}

export type NotificationRetryDecision = Readonly<{
  state: "retry-scheduled" | "needs-review" | "permanently-failed" | "paused";
  nextAttemptAt: Date | null;
  errorCategory: EnquiryNotificationErrorCategory | null;
  reason:
    | "retry"
    | "idempotency-expired"
    | "attempts-exhausted"
    | "max-age"
    | "permanent"
    | "paused";
}>;

/**
 * Decide the durable post-attempt state for a retryable/uncertain outcome.
 * Never mints a new provider idempotency key.
 */
export function decideNotificationRetry(input: {
  intentId: string;
  attempts: number;
  createdAt: Date;
  firstProviderAttemptAt: Date | null;
  now: Date;
  errorCategory: EnquiryNotificationErrorCategory | null;
  kind: "retryable" | "permanent" | "paused";
}): NotificationRetryDecision {
  if (input.kind === "paused") {
    return {
      state: "paused",
      nextAttemptAt: null,
      errorCategory: input.errorCategory ?? "notifications-disabled",
      reason: "paused",
    };
  }
  if (input.kind === "permanent") {
    return {
      state: "permanently-failed",
      nextAttemptAt: null,
      errorCategory: input.errorCategory,
      reason: "permanent",
    };
  }

  const ageMs = input.now.getTime() - input.createdAt.getTime();
  if (ageMs >= ENQUIRY_NOTIFICATION_MAX_AGE_MS) {
    return {
      state: "needs-review",
      nextAttemptAt: null,
      errorCategory: input.errorCategory ?? "attempts-exhausted",
      reason: "max-age",
    };
  }
  if (input.attempts >= ENQUIRY_NOTIFICATION_MAX_ATTEMPTS) {
    return {
      state: "needs-review",
      nextAttemptAt: null,
      errorCategory: "attempts-exhausted",
      reason: "attempts-exhausted",
    };
  }
  if (
    input.firstProviderAttemptAt &&
    !isWithinProviderIdempotencyWindow({
      firstProviderAttemptAt: input.firstProviderAttemptAt,
      now: input.now,
    })
  ) {
    return {
      state: "needs-review",
      nextAttemptAt: null,
      errorCategory: "idempotency-window-expired",
      reason: "idempotency-expired",
    };
  }

  return {
    state: "retry-scheduled",
    nextAttemptAt: new Date(
      input.now.getTime() +
        computeNotificationBackoffMs({
          intentId: input.intentId,
          attempts: input.attempts,
        }),
    ),
    errorCategory: input.errorCategory,
    reason: "retry",
  };
}

export function isClaimableNotificationState(
  state: EnquiryNotificationIntentState,
): boolean {
  return (
    state === "pending" ||
    state === "retry-scheduled" ||
    state === "uncertain" ||
    state === "leased"
  );
}

/** Delivery-fact transition policy — never downgrade confirmed delivery to weaker facts. */
export function mergeDeliveryFact(
  current: EnquiryNotificationDeliveryFact | null,
  incoming: EnquiryNotificationDeliveryFact,
): EnquiryNotificationDeliveryFact {
  const rank: Record<EnquiryNotificationDeliveryFact, number> = {
    delivered: 1,
    bounced: 2,
    complained: 3,
    suppressed: 3,
  };
  if (!current) return incoming;
  return rank[incoming] >= rank[current] ? incoming : current;
}

export const RESEND_WEBHOOK_EVENT_ALLOWLIST = [
  "email.delivered",
  "email.bounced",
  "email.complained",
  "email.delivery_delayed",
  "email.failed",
  "email.suppressed",
] as const;

export type ResendWebhookEventType =
  (typeof RESEND_WEBHOOK_EVENT_ALLOWLIST)[number];

export function deliveryFactFromResendEvent(
  type: string,
): EnquiryNotificationDeliveryFact | null {
  switch (type) {
    case "email.delivered":
      return "delivered";
    case "email.bounced":
      return "bounced";
    case "email.complained":
      return "complained";
    case "email.suppressed":
    case "email.failed":
      return "suppressed";
    default:
      return null;
  }
}
