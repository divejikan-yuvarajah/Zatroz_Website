/**
 * Resend webhook verification helpers.
 * Always verify against the raw body — never re-serialized JSON.
 */

import { Resend } from "resend";
import {
  RESEND_WEBHOOK_EVENT_ALLOWLIST,
  deliveryFactFromResendEvent,
  type EnquiryNotificationDeliveryFact,
  type ResendWebhookEventType,
} from "@/lib/enquiries/notification-intent";

export const RESEND_WEBHOOK_MAX_BODY_BYTES = 64 * 1024;

export type VerifiedResendWebhookEvent = Readonly<{
  type: string;
  eventId: string;
  messageId: string | null;
  createdAt: Date | null;
  deliveryFact: EnquiryNotificationDeliveryFact | null;
  allowlisted: boolean;
}>;

export function resolveResendWebhookSecret(
  env: NodeJS.ProcessEnv = process.env,
): string | null {
  const value = (env.RESEND_WEBHOOK_SECRET ?? "").trim();
  return value.length >= 16 ? value : null;
}

export function isAllowlistedResendWebhookEvent(
  type: string,
): type is ResendWebhookEventType {
  return (RESEND_WEBHOOK_EVENT_ALLOWLIST as readonly string[]).includes(type);
}

/**
 * Verify a Resend/Svix-signed webhook using the official SDK.
 * `payload` must be the exact raw request body string.
 */
export function verifyResendWebhookPayload(input: {
  payload: string;
  headers: Headers;
  webhookSecret: string;
}):
  | { ok: true; event: VerifiedResendWebhookEvent }
  | { ok: false; reason: string } {
  try {
    const resend = new Resend("re_webhook_verify_only");
    const parsed = resend.webhooks.verify({
      payload: input.payload,
      headers: {
        id: input.headers.get("svix-id") ?? "",
        timestamp: input.headers.get("svix-timestamp") ?? "",
        signature: input.headers.get("svix-signature") ?? "",
      },
      webhookSecret: input.webhookSecret,
    }) as {
      type?: string;
      created_at?: string;
      data?: { email_id?: string; created_at?: string };
    };

    const type = typeof parsed.type === "string" ? parsed.type : "";
    const messageId =
      typeof parsed.data?.email_id === "string" ? parsed.data.email_id : null;
    const createdRaw = parsed.created_at ?? parsed.data?.created_at ?? null;
    const createdAt =
      typeof createdRaw === "string" && createdRaw.length > 0
        ? new Date(createdRaw)
        : null;
    const eventId = input.headers.get("svix-id")?.trim() || "";
    if (!eventId || !type) {
      return { ok: false, reason: "missing-event-identity" };
    }

    return {
      ok: true,
      event: {
        type,
        eventId,
        messageId,
        createdAt:
          createdAt && !Number.isNaN(createdAt.getTime()) ? createdAt : null,
        deliveryFact: deliveryFactFromResendEvent(type),
        allowlisted: isAllowlistedResendWebhookEvent(type),
      },
    };
  } catch {
    return { ok: false, reason: "invalid-signature" };
  }
}
