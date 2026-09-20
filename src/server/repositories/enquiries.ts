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
    state: "provider-accepted" | "rejected" | "uncertain" | "paused";
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
