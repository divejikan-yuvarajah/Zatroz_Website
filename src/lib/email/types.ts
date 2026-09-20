/**
 * Shared transactional-email types (safe for tests; no secrets).
 */

export const EMAIL_TRANSPORT_VALUES = ["capture", "provider"] as const;
export type EmailTransportMode = (typeof EMAIL_TRANSPORT_VALUES)[number];

/** Resend documents a 24-hour idempotency-key retention window. */
export const RESEND_IDEMPOTENCY_WINDOW_HOURS = 24 as const;

export type NotificationSendRequest = Readonly<{
  from: string;
  to: readonly string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  /** Caller-supplied provider idempotency key (≠ browser enquiry key). */
  providerIdempotencyKey?: string;
  templateVersion: string;
}>;

export type NotificationSendResult =
  | {
      status: "accepted";
      messageId: string;
      transport: EmailTransportMode;
    }
  | {
      status: "rejected";
      reason:
        | "notifications-disabled"
        | "missing-config"
        | "invalid-recipient"
        | "recipient-not-allowed"
        | "invalid-sender"
        | "invalid-payload"
        | "provider-rejected";
      transport: EmailTransportMode;
      providerCode?: string;
    }
  | {
      status: "transient-failure";
      reason: "provider-unavailable" | "rate-limited" | "timeout";
      transport: EmailTransportMode;
      providerCode?: string;
    }
  | {
      status: "uncertain";
      reason: "ambiguous-response" | "network-loss";
      transport: EmailTransportMode;
    };

export type CapturedNotification = Readonly<{
  id: string;
  capturedAt: string;
  transport: "capture";
  from: string;
  to: readonly string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  providerIdempotencyKey?: string;
  templateVersion: string;
}>;
