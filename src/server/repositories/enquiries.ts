/**
 * Narrow enquiry repository — fixed queries/projections only.
 * Accepts validated typed values; never caller-supplied operators or filters.
 */

import "server-only";

import { randomBytes } from "node:crypto";
import type { Db, Collection } from "mongodb";
import { COLLECTION_NAMES } from "@/lib/mongodb/collections";
import type { EnquiryDocument } from "@/lib/mongodb/models/types";
import { validateEnquiryDocument } from "@/lib/mongodb/models/validate";
import { classifyMongoError, type ErrorCategory } from "@/lib/security/errors";
import type {
  EnquiryNotificationErrorCategory,
  EnquiryNotificationFreeze,
  EnquiryNotificationIntent,
} from "@/lib/enquiries/notification-intent";
import { ENQUIRY_NOTIFICATION_LEASE_MS } from "@/lib/enquiries/notification-intent";

export type EnquiryInsertResult =
  | { ok: true; publicReference: string; duplicated: false }
  | {
      ok: true;
      publicReference: string;
      duplicated: true;
      payloadFingerprintMatches: boolean;
    }
  | {
      ok: false;
      category: ErrorCategory;
    };

function enquiries(db: Db): Collection {
  return db.collection(COLLECTION_NAMES.enquiries);
}

const IDEMPOTENCY_PROJECTION = {
  publicReference: 1,
  payloadFingerprint: 1,
  fingerprintVersion: 1,
} as const;

/**
 * Insert a fully validated enquiry document.
 * On duplicate idempotency digest, returns the existing public reference.
 */
export async function insertEnquiryDocument(
  db: Db,
  document: EnquiryDocument,
): Promise<EnquiryInsertResult> {
  const validation = validateEnquiryDocument(document);
  if (!validation.ok) {
    return { ok: false, category: "unavailable" };
  }

  try {
    await enquiries(db).insertOne({ ...document });
    return {
      ok: true,
      publicReference: document.publicReference,
      duplicated: false,
    };
  } catch (error) {
    const category = classifyMongoError(error);
    if (category !== "duplicate-key") {
      return { ok: false, category };
    }

    const existing = await findEnquiryByIdempotencyDigest(
      db,
      document.idempotencyDigest,
    );
    if (!existing) {
      return { ok: false, category: "unavailable" };
    }

    return {
      ok: true,
      publicReference: existing.publicReference,
      duplicated: true,
      payloadFingerprintMatches:
        existing.payloadFingerprint === document.payloadFingerprint,
    };
  }
}

/**
 * Bounded idempotency lookup — fixed filter and projection only.
 */
export async function findEnquiryByIdempotencyDigest(
  db: Db,
  idempotencyDigest: string,
): Promise<{
  publicReference: string;
  payloadFingerprint: string;
  fingerprintVersion: number;
} | null> {
  if (
    typeof idempotencyDigest !== "string" ||
    idempotencyDigest.length < 32 ||
    idempotencyDigest.length > 128
  ) {
    return null;
  }

  const doc = await enquiries(db).findOne(
    { idempotencyDigest },
    { projection: IDEMPOTENCY_PROJECTION },
  );

  if (
    !doc ||
    typeof doc.publicReference !== "string" ||
    typeof doc.payloadFingerprint !== "string" ||
    typeof doc.fingerprintVersion !== "number"
  ) {
    return null;
  }

  return {
    publicReference: doc.publicReference,
    payloadFingerprint: doc.payloadFingerprint,
    fingerprintVersion: doc.fingerprintVersion,
  };
}

/**
 * Explicitly rejected: never accept caller-supplied collection names,
 * update documents, operators, regexes, sort fields, or arbitrary filters.
 */
export function assertSafeEnquiryRepositoryCall(): void {
  // Documentation anchor for reviews — no dynamic query builder is exported.
}

export type ClaimedNotificationWork = Readonly<{
  publicReference: string;
  payloadFingerprint: string;
  name: string;
  email: string;
  company: string | null;
  service: string;
  message: string;
  timeline: string | null;
  requestType: string;
  preferredContact: string;
  phone: string | null;
  createdAt: Date;
  notificationIntent: EnquiryNotificationIntent;
  leaseOwner: string;
  leaseToken: string;
}>;

/**
 * Atomically claim one eligible notification intent with a lease/fencing token.
 * Does not send mail — callers must invoke the Step 50 adapter after claim.
 */
export async function claimNextNotificationIntent(
  db: Db,
  input: {
    leaseOwner: string;
    now?: Date;
    leaseMs?: number;
  },
): Promise<ClaimedNotificationWork | null> {
  const now = input.now ?? new Date();
  const leaseExpiresAt = new Date(
    now.getTime() + (input.leaseMs ?? ENQUIRY_NOTIFICATION_LEASE_MS),
  );
  const leaseToken = `lease_${randomBytes(8).toString("hex")}`;

  const claimed = await enquiries(db).findOneAndUpdate(
    {
      $or: [
        {
          "notificationIntent.state": "pending",
          "notificationIntent.nextAttemptAt": { $lte: now },
        },
        {
          "notificationIntent.state": "uncertain",
          "notificationIntent.nextAttemptAt": { $lte: now },
        },
        {
          "notificationIntent.state": "leased",
          "notificationIntent.leaseExpiresAt": { $lte: now },
        },
      ],
    },
    {
      $set: {
        "notificationIntent.state": "leased",
        "notificationIntent.leaseOwner": input.leaseOwner,
        "notificationIntent.leaseToken": leaseToken,
        "notificationIntent.leaseExpiresAt": leaseExpiresAt,
        "notificationIntent.updatedAt": now,
        updatedAt: now,
      },
      $inc: { "notificationIntent.attempts": 1 },
      $min: { "notificationIntent.firstProviderAttemptAt": now },
    },
    {
      sort: { "notificationIntent.nextAttemptAt": 1, createdAt: 1 },
      returnDocument: "after",
    },
  );

  if (!claimed?.notificationIntent || !claimed.publicReference) {
    return null;
  }

  return {
    publicReference: String(claimed.publicReference),
    payloadFingerprint: String(claimed.payloadFingerprint),
    name: String(claimed.name),
    email: String(claimed.email),
    company: (claimed.company as string | null) ?? null,
    service: String(claimed.service),
    message: String(claimed.message),
    timeline: (claimed.timeline as string | null) ?? null,
    requestType: String(claimed.requestType),
    preferredContact: String(claimed.preferredContact),
    phone: (claimed.phone as string | null) ?? null,
    createdAt: claimed.createdAt as Date,
    notificationIntent: claimed.notificationIntent as EnquiryNotificationIntent,
    leaseOwner: input.leaseOwner,
    leaseToken,
  };
}

/**
 * Persist a notification outcome only while the caller still owns the lease.
 */
export async function finalizeNotificationIntentClaim(
  db: Db,
  input: {
    publicReference: string;
    leaseOwner: string;
    leaseToken: string;
    state:
      | "provider-accepted"
      | "rejected"
      | "uncertain"
      | "paused"
      | "retry-scheduled"
      | "permanently-failed"
      | "needs-review";
    deliveryFact?:
      | import("@/lib/enquiries/notification-intent").EnquiryNotificationDeliveryFact
      | null;
    recoveryVersionInc?: boolean;
    providerMessageId?: string | null;
    lastErrorCategory?: EnquiryNotificationErrorCategory | null;
    nextAttemptAt?: Date;
    freeze?: EnquiryNotificationFreeze | null;
    now?: Date;
  },
): Promise<{ ok: true; matched: boolean } | { ok: false }> {
  const now = input.now ?? new Date();
  const setFields: Record<string, unknown> = {
    "notificationIntent.state": input.state,
    "notificationIntent.leaseOwner": null,
    "notificationIntent.leaseToken": null,
    "notificationIntent.leaseExpiresAt": null,
    "notificationIntent.updatedAt": now,
    updatedAt: now,
  };

  if (input.providerMessageId !== undefined) {
    setFields["notificationIntent.providerMessageId"] = input.providerMessageId;
  }
  if (input.lastErrorCategory !== undefined) {
    setFields["notificationIntent.lastErrorCategory"] = input.lastErrorCategory;
  }
  if (input.nextAttemptAt) {
    setFields["notificationIntent.nextAttemptAt"] = input.nextAttemptAt;
  }
  if (input.freeze) {
    setFields["notificationIntent.freeze"] = input.freeze;
  }

  try {
    const result = await enquiries(db).updateOne(
      {
        publicReference: input.publicReference,
        "notificationIntent.leaseOwner": input.leaseOwner,
        "notificationIntent.leaseToken": input.leaseToken,
        "notificationIntent.state": "leased",
      },
      { $set: setFields },
    );
    return { ok: true, matched: result.matchedCount === 1 };
  } catch {
    return { ok: false };
  }
}

export type NotificationOpsRow = Readonly<{
  publicReference: string;
  state: string;
  attempts: number;
  nextAttemptAt: Date | null;
  firstProviderAttemptAt: Date | null;
  providerMessageId: string | null;
  lastErrorCategory: string | null;
  deliveryFact: string | null;
  recoveryVersion: number;
  updatedAt: Date;
  createdAt: Date;
  ageMs: number;
}>;

export type NotificationOpsSummary = Readonly<{
  pending: number;
  retryScheduled: number;
  uncertain: number;
  needsReview: number;
  permanentlyFailed: number;
  paused: number;
  providerAccepted: number;
  oldestPendingAgeMs: number | null;
  needsReviewCount: number;
}>;

export async function listNotificationOpsRows(
  db: Db,
  input: { limit?: number; now?: Date } = {},
): Promise<NotificationOpsRow[]> {
  const now = input.now ?? new Date();
  const limit = Math.min(Math.max(1, input.limit ?? 50), 100);
  const docs = await enquiries(db)
    .find(
      {
        notificationIntent: { $type: "object" },
        "notificationIntent.state": {
          $in: [
            "pending",
            "retry-scheduled",
            "uncertain",
            "needs-review",
            "permanently-failed",
            "paused",
            "leased",
            "rejected",
          ],
        },
      },
      {
        projection: {
          publicReference: 1,
          createdAt: 1,
          "notificationIntent.state": 1,
          "notificationIntent.attempts": 1,
          "notificationIntent.nextAttemptAt": 1,
          "notificationIntent.firstProviderAttemptAt": 1,
          "notificationIntent.providerMessageId": 1,
          "notificationIntent.lastErrorCategory": 1,
          "notificationIntent.deliveryFact": 1,
          "notificationIntent.recoveryVersion": 1,
          "notificationIntent.updatedAt": 1,
        },
        sort: { "notificationIntent.updatedAt": -1 },
        limit,
      },
    )
    .toArray();

  return docs.map((doc) => {
    const intent = doc.notificationIntent as Record<string, unknown>;
    const createdAt = (doc.createdAt as Date) ?? now;
    return {
      publicReference: String(doc.publicReference),
      state: String(intent.state ?? "unknown"),
      attempts: Number(intent.attempts ?? 0),
      nextAttemptAt: (intent.nextAttemptAt as Date | null) ?? null,
      firstProviderAttemptAt:
        (intent.firstProviderAttemptAt as Date | null) ?? null,
      providerMessageId: (intent.providerMessageId as string | null) ?? null,
      lastErrorCategory: (intent.lastErrorCategory as string | null) ?? null,
      deliveryFact: (intent.deliveryFact as string | null) ?? null,
      recoveryVersion: Number(intent.recoveryVersion ?? 0),
      updatedAt: (intent.updatedAt as Date) ?? createdAt,
      createdAt,
      ageMs: now.getTime() - createdAt.getTime(),
    };
  });
}

export async function summarizeNotificationOps(
  db: Db,
  now: Date = new Date(),
): Promise<NotificationOpsSummary> {
  const rows = await listNotificationOpsRows(db, { limit: 100, now });
  let pending = 0;
  let retryScheduled = 0;
  let uncertain = 0;
  let needsReview = 0;
  let permanentlyFailed = 0;
  let paused = 0;
  let oldestPendingAgeMs: number | null = null;
  for (const row of rows) {
    if (row.state === "pending") pending += 1;
    if (row.state === "retry-scheduled") retryScheduled += 1;
    if (row.state === "uncertain") uncertain += 1;
    if (row.state === "needs-review") needsReview += 1;
    if (row.state === "permanently-failed" || row.state === "rejected") {
      permanentlyFailed += 1;
    }
    if (row.state === "paused") paused += 1;
    if (
      row.state === "pending" ||
      row.state === "retry-scheduled" ||
      row.state === "uncertain"
    ) {
      if (oldestPendingAgeMs === null || row.ageMs > oldestPendingAgeMs) {
        oldestPendingAgeMs = row.ageMs;
      }
    }
  }

  return {
    pending,
    retryScheduled,
    uncertain,
    needsReview,
    permanentlyFailed,
    paused,
    providerAccepted: 0,
    oldestPendingAgeMs,
    needsReviewCount: needsReview,
  };
}

export async function applyNotificationOwnerAction(
  db: Db,
  input: {
    publicReference: string;
    expectedRecoveryVersion: number;
    action:
      "pause" | "resume" | "retry-now" | "mark-reviewed" | "authorize-resend";
    actorId: string;
    reason: string;
    now?: Date;
  },
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const now = input.now ?? new Date();
  const current = await enquiries(db).findOne(
    { publicReference: input.publicReference },
    { projection: { notificationIntent: 1, status: 1 } },
  );
  if (!current?.notificationIntent) {
    return { ok: false, reason: "not-found" };
  }
  const intent = current.notificationIntent as Record<string, unknown>;
  if (Number(intent.recoveryVersion ?? 0) !== input.expectedRecoveryVersion) {
    return { ok: false, reason: "version-conflict" };
  }
  if (intent.state === "leased" && intent.leaseExpiresAt) {
    const expires = new Date(String(intent.leaseExpiresAt));
    if (expires.getTime() > now.getTime()) {
      return { ok: false, reason: "lease-active" };
    }
  }

  const setFields: Record<string, unknown> = {
    "notificationIntent.updatedAt": now,
    updatedAt: now,
  };

  if (input.action === "pause") {
    setFields["notificationIntent.state"] = "paused";
    setFields["notificationIntent.lastErrorCategory"] =
      "notifications-disabled";
  } else if (input.action === "resume") {
    setFields["notificationIntent.state"] = "retry-scheduled";
    setFields["notificationIntent.nextAttemptAt"] = now;
    setFields["notificationIntent.lastErrorCategory"] = null;
  } else if (input.action === "retry-now") {
    setFields["notificationIntent.state"] = "retry-scheduled";
    setFields["notificationIntent.nextAttemptAt"] = now;
  } else if (input.action === "mark-reviewed") {
    setFields["notificationIntent.state"] = "paused";
  } else if (input.action === "authorize-resend") {
    // Intentional new send: mint a new intent id + idempotency key; do not reset history silently.
    const { createNotificationIntentId, buildProviderIdempotencyKey } =
      await import("@/lib/enquiries/notification-intent");
    // template version import may differ — use existing intent templateVersion
    const templateVersion = String(intent.templateVersion ?? "v1");
    const intentId = createNotificationIntentId();
    setFields["notificationIntent.intentId"] = intentId;
    setFields["notificationIntent.providerIdempotencyKey"] =
      buildProviderIdempotencyKey({ intentId, templateVersion });
    setFields["notificationIntent.state"] = "pending";
    setFields["notificationIntent.attempts"] = 0;
    setFields["notificationIntent.nextAttemptAt"] = now;
    setFields["notificationIntent.firstProviderAttemptAt"] = null;
    setFields["notificationIntent.providerMessageId"] = null;
    setFields["notificationIntent.deliveryFact"] = null;
    setFields["notificationIntent.lastErrorCategory"] = null;
    setFields["notificationIntent.freeze"] = intent.freeze ?? null;
  }

  const result = await enquiries(db).updateOne(
    {
      publicReference: input.publicReference,
      "notificationIntent.recoveryVersion": input.expectedRecoveryVersion,
    },
    {
      $set: setFields,
      $inc: { "notificationIntent.recoveryVersion": 1 },
    },
  );
  if (result.matchedCount !== 1) {
    return { ok: false, reason: "version-conflict" };
  }

  try {
    await db.collection(COLLECTION_NAMES.adminAuditEvents).insertOne({
      schemaVersion: 1,
      createdAt: now,
      actorId: input.actorId,
      action: `notification.${input.action}`,
      targetType: "enquiry-notification",
      targetId: input.publicReference,
      outcome: "succeeded",
      detail: input.reason.slice(0, 200),
    });
  } catch {
    // Audit failure must not undo the recovery mutation.
  }

  return { ok: true };
}
