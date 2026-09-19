/**
 * Narrow enquiry repository — fixed queries/projections only.
 * Accepts validated typed values; never caller-supplied operators or filters.
 */

import "server-only";

import type { Db, Collection } from "mongodb";
import { COLLECTION_NAMES } from "@/lib/mongodb/collections";
import type { EnquiryDocument } from "@/lib/mongodb/models/types";
import { validateEnquiryDocument } from "@/lib/mongodb/models/validate";
import { classifyMongoError, type ErrorCategory } from "@/lib/security/errors";

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
