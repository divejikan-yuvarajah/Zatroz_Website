/**
 * Durable Resend delivery-event intake (Step 52).
 * Verified events are stored first, then applied to matching intents.
 */

import "server-only";

import type { Db } from "mongodb";
import { COLLECTION_NAMES } from "@/lib/mongodb/collections";
import {
  mergeDeliveryFact,
  type EnquiryNotificationDeliveryFact,
} from "@/lib/enquiries/notification-intent";
import type { VerifiedResendWebhookEvent } from "@/lib/email/resend-webhook";

export type DeliveryEventProcessResult = Readonly<{
  status:
    | "applied"
    | "duplicate"
    | "unmatched"
    | "ignored"
    | "received"
    | "storage-failed";
  deliveryFact: EnquiryNotificationDeliveryFact | null;
}>;

function events(db: Db) {
  return db.collection(COLLECTION_NAMES.emailDeliveryEvents);
}

function enquiries(db: Db) {
  return db.collection(COLLECTION_NAMES.enquiries);
}

/**
 * Crash-safe webhook application:
 * 1) insert durable receipt (unique on providerEventId)
 * 2) apply delivery fact when a matching provider message id exists
 * 3) mark receipt applied / unmatched
 */
export async function processVerifiedResendDeliveryEvent(
  db: Db,
  event: VerifiedResendWebhookEvent,
  now: Date = new Date(),
): Promise<DeliveryEventProcessResult> {
  if (!event.allowlisted || !event.deliveryFact) {
    try {
      await events(db).updateOne(
        { providerEventId: event.eventId },
        {
          $setOnInsert: {
            schemaVersion: 1,
            providerEventId: event.eventId,
            providerMessageId: event.messageId ?? "unknown",
            eventType: event.type,
            deliveryFact: event.deliveryFact,
            status: "ignored",
            publicReference: null,
            intentId: null,
            providerOccurredAt: event.createdAt ?? now,
            receivedAt: now,
            appliedAt: now,
            createdAt: now,
            updatedAt: now,
          },
        },
        { upsert: true },
      );
    } catch {
      return { status: "storage-failed", deliveryFact: event.deliveryFact };
    }
    return { status: "ignored", deliveryFact: event.deliveryFact };
  }

  if (!event.messageId) {
    try {
      await events(db).insertOne({
        schemaVersion: 1,
        providerEventId: event.eventId,
        providerMessageId: "missing",
        eventType: event.type,
        deliveryFact: event.deliveryFact,
        status: "unmatched",
        publicReference: null,
        intentId: null,
        providerOccurredAt: event.createdAt ?? now,
        receivedAt: now,
        appliedAt: null,
        createdAt: now,
        updatedAt: now,
      });
    } catch (error) {
      if (isDuplicateKey(error)) {
        return { status: "duplicate", deliveryFact: event.deliveryFact };
      }
      return { status: "storage-failed", deliveryFact: event.deliveryFact };
    }
    return { status: "unmatched", deliveryFact: event.deliveryFact };
  }

  try {
    await events(db).insertOne({
      schemaVersion: 1,
      providerEventId: event.eventId,
      providerMessageId: event.messageId,
      eventType: event.type,
      deliveryFact: event.deliveryFact,
      status: "received",
      publicReference: null,
      intentId: null,
      providerOccurredAt: event.createdAt ?? now,
      receivedAt: now,
      appliedAt: null,
      createdAt: now,
      updatedAt: now,
    });
  } catch (error) {
    if (isDuplicateKey(error)) {
      return { status: "duplicate", deliveryFact: event.deliveryFact };
    }
    return { status: "storage-failed", deliveryFact: event.deliveryFact };
  }

  const match = await enquiries(db).findOne(
    { "notificationIntent.providerMessageId": event.messageId },
    {
      projection: {
        publicReference: 1,
        "notificationIntent.intentId": 1,
        "notificationIntent.deliveryFact": 1,
        "notificationIntent.state": 1,
      },
    },
  );

  if (!match?.notificationIntent || !match.publicReference) {
    await events(db).updateOne(
      { providerEventId: event.eventId },
      { $set: { status: "unmatched", updatedAt: now } },
    );
    return { status: "unmatched", deliveryFact: event.deliveryFact };
  }

  const currentFact =
    (match.notificationIntent
      .deliveryFact as EnquiryNotificationDeliveryFact | null) ?? null;
  const nextFact = mergeDeliveryFact(currentFact, event.deliveryFact);

  const setFields: Record<string, unknown> = {
    "notificationIntent.deliveryFact": nextFact,
    "notificationIntent.updatedAt": now,
    updatedAt: now,
  };

  if (
    nextFact === "bounced" ||
    nextFact === "complained" ||
    nextFact === "suppressed"
  ) {
    const state = String(match.notificationIntent.state ?? "");
    if (
      state === "provider-accepted" ||
      state === "uncertain" ||
      state === "retry-scheduled"
    ) {
      setFields["notificationIntent.state"] = "needs-review";
      setFields["notificationIntent.lastErrorCategory"] =
        nextFact === "bounced"
          ? "delivery-bounced"
          : nextFact === "complained"
            ? "delivery-complained"
            : "delivery-suppressed";
    }
  }

  await enquiries(db).updateOne(
    {
      publicReference: match.publicReference,
      "notificationIntent.providerMessageId": event.messageId,
    },
    { $set: setFields },
  );

  await events(db).updateOne(
    { providerEventId: event.eventId },
    {
      $set: {
        status: "applied",
        publicReference: match.publicReference,
        intentId: match.notificationIntent.intentId ?? null,
        appliedAt: now,
        updatedAt: now,
      },
    },
  );

  return { status: "applied", deliveryFact: nextFact };
}

function isDuplicateKey(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: number }).code === 11000
  );
}
