/**
 * MongoDB fixed-window rate limiter using rate_limit_buckets.
 * Interface is replaceable if traffic later justifies a dedicated store.
 */

import "server-only";

import type { Collection, Db } from "mongodb";
import { COLLECTION_NAMES } from "@/lib/mongodb/collections";
import { SCHEMA_VERSION_CURRENT } from "@/lib/mongodb/limits";
import {
  RATE_LIMIT_POLICIES,
  type RateLimitPolicyId,
} from "@/lib/security/policy";
import { classifyMongoError } from "@/lib/security/errors";
import {
  buildRateLimitBucketId,
  getRateLimitPolicy,
  windowBounds,
} from "@/lib/security/rate-limit-keys";

export type RateLimitDecision =
  | {
      ok: true;
      allowed: true;
      count: number;
      policyId: RateLimitPolicyId;
      retryAfterSeconds?: undefined;
    }
  | {
      ok: true;
      allowed: false;
      count: number;
      policyId: RateLimitPolicyId;
      retryAfterSeconds: number;
    }
  | {
      ok: false;
      reason: "store-unavailable" | "misconfigured";
      category: ReturnType<typeof classifyMongoError> | "unavailable";
    };

type RateLimitDoc = {
  schemaVersion: number;
  bucketId: string;
  count: number;
  windowStart: Date;
  windowEnd: Date;
  expiresAt: Date;
};

export {
  buildRateLimitBucketId,
  windowBounds,
} from "@/lib/security/rate-limit-keys";

/**
 * Atomic increment/upsert. Decision uses the post-update count.
 * Concurrent first-request collisions: retry once on duplicate key.
 *
 * Global + per-source need not share one transaction: partial consumption may
 * only deny extra traffic, never admit over-limit traffic.
 */
export async function consumeRateLimit(options: {
  db: Db;
  policyId: RateLimitPolicyId;
  identityHash: string;
  now?: Date;
}): Promise<RateLimitDecision> {
  const policy = getRateLimitPolicy(options.policyId);
  const now = options.now ?? new Date();
  const { windowStart, windowEnd, expiresAt } = windowBounds(
    now,
    policy.windowMs,
  );
  const bucketId = buildRateLimitBucketId({
    policyId: policy.id,
    identityHash: options.identityHash,
    windowStart,
  });

  const collection = options.db.collection<RateLimitDoc>(
    COLLECTION_NAMES.rateLimitBuckets,
  );

  try {
    const updated = await incrementBucket(collection, {
      bucketId,
      windowStart,
      windowEnd,
      expiresAt,
    });

    if (updated.count > policy.limit) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((windowEnd.getTime() - now.getTime()) / 1000),
      );
      return {
        ok: true,
        allowed: false,
        count: updated.count,
        policyId: policy.id,
        retryAfterSeconds,
      };
    }

    return {
      ok: true,
      allowed: true,
      count: updated.count,
      policyId: policy.id,
    };
  } catch (error) {
    return {
      ok: false,
      reason: "store-unavailable",
      category: classifyMongoError(error),
    };
  }
}

async function incrementBucket(
  collection: Collection<RateLimitDoc>,
  params: {
    bucketId: string;
    windowStart: Date;
    windowEnd: Date;
    expiresAt: Date;
  },
): Promise<RateLimitDoc> {
  const filter = { bucketId: params.bucketId };
  const result = await collection.findOneAndUpdate(
    filter,
    {
      $inc: { count: 1 },
      $setOnInsert: {
        schemaVersion: SCHEMA_VERSION_CURRENT,
        bucketId: params.bucketId,
        windowStart: params.windowStart,
        windowEnd: params.windowEnd,
        expiresAt: params.expiresAt,
      },
    },
    {
      upsert: true,
      returnDocument: "after",
    },
  );

  if (result && typeof result.count === "number") {
    return result as RateLimitDoc;
  }

  try {
    const doc: RateLimitDoc = {
      schemaVersion: SCHEMA_VERSION_CURRENT,
      bucketId: params.bucketId,
      count: 1,
      windowStart: params.windowStart,
      windowEnd: params.windowEnd,
      expiresAt: params.expiresAt,
    };
    await collection.insertOne(doc);
    return doc;
  } catch {
    const retry = await collection.findOneAndUpdate(
      filter,
      { $inc: { count: 1 } },
      { returnDocument: "after" },
    );
    if (!retry || typeof retry.count !== "number") {
      throw new Error("Rate limit bucket update returned no document.");
    }
    return retry as RateLimitDoc;
  }
}

/**
 * Evaluate both per-source and global policies.
 * Fail closed (unavailable) if the store errors — never fail open.
 */
export async function enforceEnquiryRateLimits(options: {
  db: Db;
  sourceIdentityHash: string;
  now?: Date;
}): Promise<RateLimitDecision> {
  const perSource = await consumeRateLimit({
    db: options.db,
    policyId: RATE_LIMIT_POLICIES.enquiryPerSource.id,
    identityHash: options.sourceIdentityHash,
    now: options.now,
  });
  if (!perSource.ok) return perSource;
  if (!perSource.allowed) return perSource;

  const global = await consumeRateLimit({
    db: options.db,
    policyId: RATE_LIMIT_POLICIES.enquiryGlobal.id,
    identityHash: "global",
    now: options.now,
  });
  return global;
}
