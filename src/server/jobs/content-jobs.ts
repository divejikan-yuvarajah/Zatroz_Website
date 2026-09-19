import "server-only";

import { randomBytes } from "node:crypto";
import { Int32 } from "mongodb";
import {
  buildPublishRefreshDedupeKey,
  CONTENT_JOB_LEASE_MS,
  CONTENT_JOB_MAX_ATTEMPTS,
  nextRetryDelayMs,
  parsePublishRefreshDedupeKey,
  planContentJobEnqueue,
  shouldRetryAfterFailure,
} from "@/lib/admin/content-jobs";
import { COLLECTION_NAMES } from "@/lib/mongodb/collections";
import {
  isMongoRuntimeConfigured,
  sanitizeMongoError,
} from "@/lib/mongodb/config";
import { getDb } from "@/lib/mongodb/connection";
import { SCHEMA_VERSION_CURRENT } from "@/lib/mongodb/limits";
import type { ContentJobDocument } from "@/lib/mongodb/models/types";
import { preparePublicDerivativesForProject } from "@/server/media/public-delivery";
import { revalidatePublicPortfolioPaths } from "@/server/projects/revalidate-public";

export type ContentJobListItem = Readonly<{
  jobId: string;
  dedupeKey: string;
  state: string;
  attempts: number;
  nextRunAtIso: string | null;
  leaseOwner: string | null;
  leaseExpiresAtIso: string | null;
  updatedAtIso: string;
  editorialId: string | null;
  action: string | null;
}>;

export type EnqueueResult =
  | { ok: true; outcome: "inserted" | "requeued" | "noop"; jobId: string }
  | { ok: false; detail: string };

export type WorkerRunResult = Readonly<{
  processed: number;
  succeeded: number;
  failed: number;
  retried: number;
  skipped: number;
  details: readonly string[];
}>;

function mapJob(doc: ContentJobDocument): ContentJobListItem {
  const parsed = parsePublishRefreshDedupeKey(doc.dedupeKey);
  return {
    jobId: doc.jobId,
    dedupeKey: doc.dedupeKey,
    state: doc.state,
    attempts: Number(doc.attempts) || 0,
    nextRunAtIso: doc.nextRunAt ? doc.nextRunAt.toISOString() : null,
    leaseOwner: doc.leaseOwner,
    leaseExpiresAtIso: doc.leaseExpiresAt
      ? doc.leaseExpiresAt.toISOString()
      : null,
    updatedAtIso:
      doc.updatedAt instanceof Date
        ? doc.updatedAt.toISOString()
        : new Date(0).toISOString(),
    editorialId: parsed.editorialId,
    action: parsed.action,
  };
}

/**
 * Idempotent enqueue: never creates a second row for the same dedupeKey.
 * Reuses succeeded/failed/cancelled rows by resetting them to queued.
 */
export async function enqueueContentJob(input: {
  dedupeKey: string;
}): Promise<EnqueueResult> {
  if (!isMongoRuntimeConfigured()) {
    return { ok: false, detail: "MongoDB is not configured." };
  }

  try {
    const db = await getDb();
    const col = db.collection(COLLECTION_NAMES.contentJobs);
    const existing = (await col.findOne({
      dedupeKey: input.dedupeKey,
    })) as ContentJobDocument | null;

    const plan = planContentJobEnqueue(
      existing ? { state: existing.state } : null,
    );

    if (plan === "noop" && existing) {
      return { ok: true, outcome: "noop", jobId: existing.jobId };
    }

    if (plan === "requeue" && existing) {
      await col.updateOne(
        { jobId: existing.jobId },
        {
          $set: {
            state: "queued",
            nextRunAt: new Date(),
            leaseOwner: null,
            leaseExpiresAt: null,
            updatedAt: new Date(),
          },
        },
      );
      return { ok: true, outcome: "requeued", jobId: existing.jobId };
    }

    const jobId = `job_${randomBytes(6).toString("hex")}`;
    const now = new Date();
    await col.insertOne({
      schemaVersion: new Int32(SCHEMA_VERSION_CURRENT),
      createdAt: now,
      updatedAt: now,
      jobId,
      dedupeKey: input.dedupeKey,
      state: "queued",
      attempts: new Int32(0),
      nextRunAt: now,
      leaseOwner: null,
      leaseExpiresAt: null,
    });
    return { ok: true, outcome: "inserted", jobId };
  } catch (error) {
    return { ok: false, detail: sanitizeMongoError(error) };
  }
}

export async function queuePublishRefreshJob(input: {
  editorialId: string;
  action: string;
}): Promise<void> {
  try {
    const dedupeKey = buildPublishRefreshDedupeKey(input);
    await enqueueContentJob({ dedupeKey });
  } catch {
    // Best-effort: publish/unpublish must still succeed if the queue is down.
  }
}

export async function listContentJobs(input?: {
  limit?: number;
}): Promise<
  | { ok: true; items: readonly ContentJobListItem[] }
  | { ok: false; detail: string }
> {
  if (!isMongoRuntimeConfigured()) {
    return { ok: false, detail: "MongoDB is not configured." };
  }
  try {
    const db = await getDb();
    const limit = Math.min(Math.max(input?.limit ?? 40, 1), 100);
    const rows = (await db
      .collection(COLLECTION_NAMES.contentJobs)
      .find({})
      .sort({ updatedAt: -1 })
      .limit(limit)
      .toArray()) as unknown as ContentJobDocument[];
    return { ok: true, items: rows.map(mapJob) };
  } catch (error) {
    return { ok: false, detail: sanitizeMongoError(error) };
  }
}

export async function hasOpenPublishRefreshJob(
  editorialId: string,
): Promise<boolean> {
  if (!isMongoRuntimeConfigured()) return false;
  try {
    const db = await getDb();
    const prefix = `publish-refresh:${editorialId}:`;
    const hit = await db.collection(COLLECTION_NAMES.contentJobs).findOne({
      dedupeKey: { $regex: `^${escapeRegex(prefix)}` },
      state: { $in: ["queued", "leased", "failed"] },
    });
    return Boolean(hit);
  } catch {
    return false;
  }
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Owner recovery: move a failed job back to queued without creating a duplicate.
 */
export async function retryFailedContentJob(input: {
  jobId: string;
}): Promise<{ ok: true } | { ok: false; detail: string }> {
  if (!isMongoRuntimeConfigured()) {
    return { ok: false, detail: "MongoDB is not configured." };
  }
  try {
    const db = await getDb();
    const result = await db.collection(COLLECTION_NAMES.contentJobs).updateOne(
      { jobId: input.jobId, state: "failed" },
      {
        $set: {
          state: "queued",
          nextRunAt: new Date(),
          leaseOwner: null,
          leaseExpiresAt: null,
          updatedAt: new Date(),
        },
      },
    );
    if (result.matchedCount === 0) {
      return {
        ok: false,
        detail: "Failed job not found (already queued or succeeded).",
      };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, detail: sanitizeMongoError(error) };
  }
}

async function leaseNextJob(
  leaseOwner: string,
): Promise<ContentJobDocument | null> {
  if (!isMongoRuntimeConfigured()) return null;
  const db = await getDb();
  const now = new Date();
  const leaseExpiresAt = new Date(now.getTime() + CONTENT_JOB_LEASE_MS);

  const leased = await db
    .collection(COLLECTION_NAMES.contentJobs)
    .findOneAndUpdate(
      {
        $or: [
          {
            state: "queued",
            $or: [{ nextRunAt: null }, { nextRunAt: { $lte: now } }],
          },
          {
            state: "leased",
            leaseExpiresAt: { $lte: now },
          },
        ],
      },
      {
        $set: {
          state: "leased",
          leaseOwner,
          leaseExpiresAt,
          updatedAt: now,
        },
      },
      { sort: { nextRunAt: 1, createdAt: 1 }, returnDocument: "after" },
    );

  return (leased as ContentJobDocument | null) ?? null;
}

async function markJobSucceeded(jobId: string): Promise<void> {
  const db = await getDb();
  await db.collection(COLLECTION_NAMES.contentJobs).updateOne(
    { jobId },
    {
      $set: {
        state: "succeeded",
        leaseOwner: null,
        leaseExpiresAt: null,
        nextRunAt: null,
        updatedAt: new Date(),
      },
    },
  );
}

async function markJobFailedOrRetry(input: {
  jobId: string;
  previousAttempts: number;
  detail: string;
}): Promise<"failed" | "retried"> {
  const db = await getDb();
  const nextAttempts = input.previousAttempts + 1;
  const now = new Date();

  if (shouldRetryAfterFailure(nextAttempts)) {
    const delay = nextRetryDelayMs(nextAttempts);
    await db.collection(COLLECTION_NAMES.contentJobs).updateOne(
      { jobId: input.jobId },
      {
        $set: {
          state: "queued",
          attempts: new Int32(nextAttempts),
          nextRunAt: new Date(now.getTime() + delay),
          leaseOwner: null,
          leaseExpiresAt: null,
          updatedAt: now,
        },
      },
    );
    return "retried";
  }

  await db.collection(COLLECTION_NAMES.contentJobs).updateOne(
    { jobId: input.jobId },
    {
      $set: {
        state: "failed",
        attempts: new Int32(Math.min(nextAttempts, CONTENT_JOB_MAX_ATTEMPTS)),
        nextRunAt: null,
        leaseOwner: null,
        leaseExpiresAt: null,
        updatedAt: now,
      },
    },
  );
  void input.detail;
  return "failed";
}

async function executePublishRefreshJob(
  job: ContentJobDocument,
): Promise<{ ok: true } | { ok: false; detail: string }> {
  const parsed = parsePublishRefreshDedupeKey(job.dedupeKey);
  if (parsed.kind !== "publish-refresh" || !parsed.editorialId) {
    return { ok: false, detail: "Unrecognised job dedupe key." };
  }

  const editorialId = parsed.editorialId;
  let slug: string | null = null;

  try {
    const db = await getDb();
    const project = await db.collection(COLLECTION_NAMES.projects).findOne({
      editorialId,
    });
    if (project && typeof project.canonicalPublishedSlug === "string") {
      slug = project.canonicalPublishedSlug;
    }

    // Prepare public media derivatives before / with cache refresh.
    if (
      parsed.action === "summary-publish" ||
      parsed.action === "story-publish"
    ) {
      const mediaPrep = await preparePublicDerivativesForProject(editorialId);
      if (!mediaPrep.ok) {
        return { ok: false, detail: mediaPrep.detail };
      }
    }

    revalidatePublicPortfolioPaths({ editorialId, slug });
    return { ok: true };
  } catch (error) {
    return { ok: false, detail: sanitizeMongoError(error) };
  }
}

/**
 * Process up to `limit` due content jobs. Safe to call from cron or CLI.
 */
export async function runContentJobWorker(input?: {
  limit?: number;
  leaseOwner?: string;
}): Promise<WorkerRunResult> {
  const limit = Math.min(Math.max(input?.limit ?? 10, 1), 50);
  const leaseOwner =
    input?.leaseOwner?.trim() || `worker_${randomBytes(4).toString("hex")}`;

  const details: string[] = [];
  let processed = 0;
  let succeeded = 0;
  let failed = 0;
  let retried = 0;
  let skipped = 0;

  if (!isMongoRuntimeConfigured()) {
    return {
      processed: 0,
      succeeded: 0,
      failed: 0,
      retried: 0,
      skipped: 0,
      details: ["MongoDB is not configured."],
    };
  }

  for (let i = 0; i < limit; i += 1) {
    const job = await leaseNextJob(leaseOwner);
    if (!job) {
      skipped += 1;
      break;
    }
    processed += 1;

    const result = await executePublishRefreshJob(job);
    if (result.ok) {
      await markJobSucceeded(job.jobId);
      succeeded += 1;
      details.push(`${job.jobId}: succeeded`);
      continue;
    }

    const outcome = await markJobFailedOrRetry({
      jobId: job.jobId,
      previousAttempts: Number(job.attempts) || 0,
      detail: result.detail,
    });
    if (outcome === "retried") {
      retried += 1;
      details.push(`${job.jobId}: retry scheduled (${result.detail})`);
    } else {
      failed += 1;
      details.push(`${job.jobId}: failed (${result.detail})`);
    }
  }

  return { processed, succeeded, failed, retried, skipped, details };
}
