import "server-only";

import { randomBytes } from "node:crypto";
import { Int32 } from "mongodb";
import {
  assessStoryPublishReadiness,
  assessSummaryPublishReadiness,
  willCreateSlugRedirect,
} from "@/lib/admin/publish";
import { COLLECTION_NAMES } from "@/lib/mongodb/collections";
import {
  isMongoRuntimeConfigured,
  sanitizeMongoError,
} from "@/lib/mongodb/config";
import { getDb } from "@/lib/mongodb/connection";
import { SCHEMA_VERSION_CURRENT } from "@/lib/mongodb/limits";
import { loadProjectDraft } from "@/server/projects/repository";
import {
  isProjectArchived,
  PROJECT_ADMIN_STATE_COLLECTION,
} from "@/server/projects/admin-state";

/** Application-managed routes (redirects / reservations). No Step-45 validator yet. */
export const PROJECT_ROUTES_COLLECTION = "project_routes";

export type PublishMutationResult =
  | {
      ok: true;
      editorialId: string;
      concurrencyVersion: number;
      message: string;
      redirectFrom?: string;
    }
  | {
      ok: false;
      reason:
        | "unavailable"
        | "conflict"
        | "validation"
        | "not-found"
        | "duplicate"
        | "denied";
      detail: string;
    };

async function assertSlugFreeForPublish(input: {
  slug: string;
  editorialId: string;
}): Promise<{ ok: true } | { ok: false; detail: string }> {
  const db = await getDb();
  const clash = await db.collection(COLLECTION_NAMES.projects).findOne({
    editorialId: { $ne: input.editorialId },
    $or: [{ canonicalPublishedSlug: input.slug }, { draftSlug: input.slug }],
  });
  if (clash) {
    return {
      ok: false,
      detail: `Slug "${input.slug}" is already used by another project.`,
    };
  }

  const reserved = await db.collection(PROJECT_ROUTES_COLLECTION).findOne({
    fromSlug: input.slug,
    kind: "reserved",
    editorialId: { $ne: input.editorialId },
  });
  if (reserved) {
    return {
      ok: false,
      detail: `Slug "${input.slug}" is reserved by another project route.`,
    };
  }
  return { ok: true };
}

async function writeRedirect(input: {
  fromSlug: string;
  toSlug: string;
  editorialId: string;
  actorId: string;
}): Promise<void> {
  const db = await getDb();
  await db.collection(PROJECT_ROUTES_COLLECTION).updateOne(
    { fromSlug: input.fromSlug },
    {
      $set: {
        schemaVersion: new Int32(SCHEMA_VERSION_CURRENT),
        fromSlug: input.fromSlug,
        toSlug: input.toSlug,
        editorialId: input.editorialId,
        kind: "redirect",
        updatedAt: new Date(),
        updatedByActorId: input.actorId,
      },
      $setOnInsert: {
        createdAt: new Date(),
        createdByActorId: input.actorId,
      },
    },
    { upsert: true },
  );
}

async function queuePublishRefreshJob(input: {
  editorialId: string;
  action: string;
}): Promise<void> {
  if (!isMongoRuntimeConfigured()) return;
  try {
    const db = await getDb();
    const jobId = `job_${randomBytes(6).toString("hex")}`;
    const dedupeKey = `publish-refresh:${input.editorialId}:${input.action}`;
    await db.collection(COLLECTION_NAMES.contentJobs).updateOne(
      { dedupeKey, state: { $in: ["queued", "leased"] } },
      {
        $setOnInsert: {
          schemaVersion: new Int32(SCHEMA_VERSION_CURRENT),
          createdAt: new Date(),
          updatedAt: new Date(),
          jobId,
          dedupeKey,
          state: "queued",
          attempts: new Int32(0),
          nextRunAt: new Date(),
          leaseOwner: null,
          leaseExpiresAt: null,
        },
      },
      { upsert: true },
    );
  } catch {
    // Job queue is best-effort in A08; publish itself must still succeed.
  }
}

export async function findProjectRedirect(
  fromSlug: string,
): Promise<{ toSlug: string; editorialId: string } | null> {
  if (!isMongoRuntimeConfigured()) return null;
  try {
    const db = await getDb();
    const row = await db.collection(PROJECT_ROUTES_COLLECTION).findOne({
      fromSlug,
      kind: "redirect",
    });
    if (
      row &&
      typeof row.toSlug === "string" &&
      typeof row.editorialId === "string"
    ) {
      return { toSlug: row.toSlug, editorialId: row.editorialId };
    }
    return null;
  } catch {
    return null;
  }
}

export async function publishProjectSummary(input: {
  editorialId: string;
  expectedConcurrencyVersion: number;
  actorId: string;
}): Promise<PublishMutationResult> {
  if (!isMongoRuntimeConfigured()) {
    return {
      ok: false,
      reason: "unavailable",
      detail: "MongoDB is not configured.",
    };
  }

  try {
    if (await isProjectArchived(input.editorialId)) {
      return {
        ok: false,
        reason: "validation",
        detail: "Restore this project from archive before publishing.",
      };
    }

    const loaded = await loadProjectDraft(input.editorialId);
    if (!loaded.ok) {
      return {
        ok: false,
        reason: loaded.reason === "not-found" ? "not-found" : "unavailable",
        detail: loaded.detail,
      };
    }

    if (
      loaded.project.concurrencyVersion !== input.expectedConcurrencyVersion
    ) {
      return {
        ok: false,
        reason: "conflict",
        detail:
          "This project was changed by someone else. Reload, then publish again.",
      };
    }

    const ready = assessSummaryPublishReadiness({
      project: loaded.project,
      summary: loaded.summary,
    });
    if (!ready.ok) {
      return { ok: false, reason: "validation", detail: ready.message };
    }

    const nextSlug = loaded.project.draftSlug.trim();
    const slugCheck = await assertSlugFreeForPublish({
      slug: nextSlug,
      editorialId: input.editorialId,
    });
    if (!slugCheck.ok) {
      return { ok: false, reason: "duplicate", detail: slugCheck.detail };
    }

    const previousCanonical = loaded.project.canonicalPublishedSlug;
    const createRedirect = willCreateSlugRedirect({
      previousCanonicalSlug: previousCanonical,
      nextSlug,
    });

    const nextConcurrency = input.expectedConcurrencyVersion + 1;
    const now = new Date();
    const db = await getDb();
    const update = await db.collection(COLLECTION_NAMES.projects).updateOne(
      {
        editorialId: input.editorialId,
        concurrencyVersion: input.expectedConcurrencyVersion,
      },
      {
        $set: {
          publishedSummaryRevisionId: loaded.project.draftRevisionId,
          canonicalPublishedSlug: nextSlug,
          updatedAt: now,
          concurrencyVersion: new Int32(nextConcurrency),
        },
      },
    );

    if (update.matchedCount === 0) {
      return {
        ok: false,
        reason: "conflict",
        detail:
          "This project was changed by someone else. Reload, then publish again.",
      };
    }

    if (createRedirect && previousCanonical) {
      await writeRedirect({
        fromSlug: previousCanonical,
        toSlug: nextSlug,
        editorialId: input.editorialId,
        actorId: input.actorId,
      });
    }

    await queuePublishRefreshJob({
      editorialId: input.editorialId,
      action: "summary-publish",
    });

    return {
      ok: true,
      editorialId: input.editorialId,
      concurrencyVersion: nextConcurrency,
      message: createRedirect
        ? `Summary published. Redirect recorded from /work/${previousCanonical} to /work/${nextSlug}. Public pages switch in A09.`
        : "Summary published. Public Work pages still use repository selectors until A09.",
      redirectFrom: createRedirect
        ? (previousCanonical ?? undefined)
        : undefined,
    };
  } catch (error) {
    return {
      ok: false,
      reason: "unavailable",
      detail: sanitizeMongoError(error),
    };
  }
}

export async function publishProjectStory(input: {
  editorialId: string;
  expectedConcurrencyVersion: number;
  actorId: string;
}): Promise<PublishMutationResult> {
  if (!isMongoRuntimeConfigured()) {
    return {
      ok: false,
      reason: "unavailable",
      detail: "MongoDB is not configured.",
    };
  }

  try {
    if (await isProjectArchived(input.editorialId)) {
      return {
        ok: false,
        reason: "validation",
        detail: "Restore this project from archive before publishing.",
      };
    }

    const loaded = await loadProjectDraft(input.editorialId);
    if (!loaded.ok) {
      return {
        ok: false,
        reason: loaded.reason === "not-found" ? "not-found" : "unavailable",
        detail: loaded.detail,
      };
    }

    if (
      loaded.project.concurrencyVersion !== input.expectedConcurrencyVersion
    ) {
      return {
        ok: false,
        reason: "conflict",
        detail:
          "This project was changed by someone else. Reload, then publish again.",
      };
    }

    const ready = assessStoryPublishReadiness({
      project: loaded.project,
      story: loaded.story,
    });
    if (!ready.ok) {
      return { ok: false, reason: "validation", detail: ready.message };
    }

    const nextConcurrency = input.expectedConcurrencyVersion + 1;
    const db = await getDb();
    const update = await db.collection(COLLECTION_NAMES.projects).updateOne(
      {
        editorialId: input.editorialId,
        concurrencyVersion: input.expectedConcurrencyVersion,
      },
      {
        $set: {
          publishedStoryRevisionId: loaded.project.draftRevisionId,
          updatedAt: new Date(),
          concurrencyVersion: new Int32(nextConcurrency),
        },
      },
    );

    if (update.matchedCount === 0) {
      return {
        ok: false,
        reason: "conflict",
        detail:
          "This project was changed by someone else. Reload, then publish again.",
      };
    }

    await queuePublishRefreshJob({
      editorialId: input.editorialId,
      action: "story-publish",
    });

    return {
      ok: true,
      editorialId: input.editorialId,
      concurrencyVersion: nextConcurrency,
      message:
        "Case-study story published (summary was already live). Public story pages switch in A09.",
    };
  } catch (error) {
    return {
      ok: false,
      reason: "unavailable",
      detail: sanitizeMongoError(error),
    };
  }
}

export async function unpublishProjectSummary(input: {
  editorialId: string;
  expectedConcurrencyVersion: number;
  actorId: string;
}): Promise<PublishMutationResult> {
  if (!isMongoRuntimeConfigured()) {
    return {
      ok: false,
      reason: "unavailable",
      detail: "MongoDB is not configured.",
    };
  }

  try {
    const loaded = await loadProjectDraft(input.editorialId);
    if (!loaded.ok) {
      return {
        ok: false,
        reason: loaded.reason === "not-found" ? "not-found" : "unavailable",
        detail: loaded.detail,
      };
    }

    if (
      loaded.project.concurrencyVersion !== input.expectedConcurrencyVersion
    ) {
      return {
        ok: false,
        reason: "conflict",
        detail:
          "This project was changed by someone else. Reload, then try again.",
      };
    }

    if (!loaded.project.publishedSummaryRevisionId) {
      return {
        ok: false,
        reason: "validation",
        detail: "Summary is not published.",
      };
    }

    const previousSlug = loaded.project.canonicalPublishedSlug;
    const nextConcurrency = input.expectedConcurrencyVersion + 1;
    const db = await getDb();
    const update = await db.collection(COLLECTION_NAMES.projects).updateOne(
      {
        editorialId: input.editorialId,
        concurrencyVersion: input.expectedConcurrencyVersion,
      },
      {
        $set: {
          publishedSummaryRevisionId: null,
          publishedStoryRevisionId: null,
          // Keep slug reserved so it is not silently reused.
          canonicalPublishedSlug: previousSlug,
          updatedAt: new Date(),
          concurrencyVersion: new Int32(nextConcurrency),
        },
      },
    );

    if (update.matchedCount === 0) {
      return {
        ok: false,
        reason: "conflict",
        detail:
          "This project was changed by someone else. Reload, then try again.",
      };
    }

    if (previousSlug) {
      await db.collection(PROJECT_ROUTES_COLLECTION).updateOne(
        { fromSlug: previousSlug },
        {
          $set: {
            schemaVersion: new Int32(SCHEMA_VERSION_CURRENT),
            fromSlug: previousSlug,
            toSlug: null,
            editorialId: input.editorialId,
            kind: "reserved",
            updatedAt: new Date(),
            updatedByActorId: input.actorId,
          },
          $setOnInsert: {
            createdAt: new Date(),
            createdByActorId: input.actorId,
          },
        },
        { upsert: true },
      );
    }

    await queuePublishRefreshJob({
      editorialId: input.editorialId,
      action: "summary-unpublish",
    });

    return {
      ok: true,
      editorialId: input.editorialId,
      concurrencyVersion: nextConcurrency,
      message:
        "Summary and story unpublished. Former slug remains reserved until reassigned.",
    };
  } catch (error) {
    return {
      ok: false,
      reason: "unavailable",
      detail: sanitizeMongoError(error),
    };
  }
}

export async function unpublishProjectStory(input: {
  editorialId: string;
  expectedConcurrencyVersion: number;
  actorId: string;
}): Promise<PublishMutationResult> {
  if (!isMongoRuntimeConfigured()) {
    return {
      ok: false,
      reason: "unavailable",
      detail: "MongoDB is not configured.",
    };
  }

  try {
    const loaded = await loadProjectDraft(input.editorialId);
    if (!loaded.ok) {
      return {
        ok: false,
        reason: loaded.reason === "not-found" ? "not-found" : "unavailable",
        detail: loaded.detail,
      };
    }

    if (
      loaded.project.concurrencyVersion !== input.expectedConcurrencyVersion
    ) {
      return {
        ok: false,
        reason: "conflict",
        detail:
          "This project was changed by someone else. Reload, then try again.",
      };
    }

    if (!loaded.project.publishedStoryRevisionId) {
      return {
        ok: false,
        reason: "validation",
        detail: "Story is not published.",
      };
    }

    const nextConcurrency = input.expectedConcurrencyVersion + 1;
    const db = await getDb();
    const update = await db.collection(COLLECTION_NAMES.projects).updateOne(
      {
        editorialId: input.editorialId,
        concurrencyVersion: input.expectedConcurrencyVersion,
      },
      {
        $set: {
          publishedStoryRevisionId: null,
          updatedAt: new Date(),
          concurrencyVersion: new Int32(nextConcurrency),
        },
      },
    );

    if (update.matchedCount === 0) {
      return {
        ok: false,
        reason: "conflict",
        detail:
          "This project was changed by someone else. Reload, then try again.",
      };
    }

    await queuePublishRefreshJob({
      editorialId: input.editorialId,
      action: "story-unpublish",
    });

    return {
      ok: true,
      editorialId: input.editorialId,
      concurrencyVersion: nextConcurrency,
      message:
        "Case-study story unpublished. Summary publication is unchanged.",
    };
  } catch (error) {
    return {
      ok: false,
      reason: "unavailable",
      detail: sanitizeMongoError(error),
    };
  }
}

export async function archiveProject(input: {
  editorialId: string;
  expectedConcurrencyVersion: number;
  actorId: string;
}): Promise<PublishMutationResult> {
  if (!isMongoRuntimeConfigured()) {
    return {
      ok: false,
      reason: "unavailable",
      detail: "MongoDB is not configured.",
    };
  }

  try {
    const loaded = await loadProjectDraft(input.editorialId);
    if (!loaded.ok) {
      return {
        ok: false,
        reason: loaded.reason === "not-found" ? "not-found" : "unavailable",
        detail: loaded.detail,
      };
    }

    if (
      loaded.project.concurrencyVersion !== input.expectedConcurrencyVersion
    ) {
      return {
        ok: false,
        reason: "conflict",
        detail:
          "This project was changed by someone else. Reload, then try again.",
      };
    }

    // Archive always clears live pointers (owner or editor).
    const nextConcurrency = input.expectedConcurrencyVersion + 1;
    const previousSlug = loaded.project.canonicalPublishedSlug;
    const db = await getDb();
    const update = await db.collection(COLLECTION_NAMES.projects).updateOne(
      {
        editorialId: input.editorialId,
        concurrencyVersion: input.expectedConcurrencyVersion,
      },
      {
        $set: {
          publishedSummaryRevisionId: null,
          publishedStoryRevisionId: null,
          canonicalPublishedSlug: previousSlug,
          updatedAt: new Date(),
          concurrencyVersion: new Int32(nextConcurrency),
        },
      },
    );

    if (update.matchedCount === 0) {
      return {
        ok: false,
        reason: "conflict",
        detail:
          "This project was changed by someone else. Reload, then try again.",
      };
    }

    await db.collection(PROJECT_ADMIN_STATE_COLLECTION).updateOne(
      { editorialId: input.editorialId },
      {
        $set: {
          editorialId: input.editorialId,
          archived: true,
          updatedAt: new Date(),
          updatedByActorId: input.actorId,
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true },
    );

    if (previousSlug) {
      await db.collection(PROJECT_ROUTES_COLLECTION).updateOne(
        { fromSlug: previousSlug },
        {
          $set: {
            schemaVersion: new Int32(SCHEMA_VERSION_CURRENT),
            fromSlug: previousSlug,
            toSlug: null,
            editorialId: input.editorialId,
            kind: "reserved",
            updatedAt: new Date(),
            updatedByActorId: input.actorId,
          },
          $setOnInsert: {
            createdAt: new Date(),
            createdByActorId: input.actorId,
          },
        },
        { upsert: true },
      );
    }

    await queuePublishRefreshJob({
      editorialId: input.editorialId,
      action: "archive",
    });

    return {
      ok: true,
      editorialId: input.editorialId,
      concurrencyVersion: nextConcurrency,
      message: "Project archived and removed from the active list.",
    };
  } catch (error) {
    return {
      ok: false,
      reason: "unavailable",
      detail: sanitizeMongoError(error),
    };
  }
}

export async function restoreArchivedProject(input: {
  editorialId: string;
  expectedConcurrencyVersion: number;
  actorId: string;
}): Promise<PublishMutationResult> {
  if (!isMongoRuntimeConfigured()) {
    return {
      ok: false,
      reason: "unavailable",
      detail: "MongoDB is not configured.",
    };
  }

  try {
    const loaded = await loadProjectDraft(input.editorialId);
    if (!loaded.ok) {
      return {
        ok: false,
        reason: loaded.reason === "not-found" ? "not-found" : "unavailable",
        detail: loaded.detail,
      };
    }

    if (
      loaded.project.concurrencyVersion !== input.expectedConcurrencyVersion
    ) {
      return {
        ok: false,
        reason: "conflict",
        detail:
          "This project was changed by someone else. Reload, then try again.",
      };
    }

    const nextConcurrency = input.expectedConcurrencyVersion + 1;
    const db = await getDb();
    const update = await db.collection(COLLECTION_NAMES.projects).updateOne(
      {
        editorialId: input.editorialId,
        concurrencyVersion: input.expectedConcurrencyVersion,
      },
      {
        $set: {
          updatedAt: new Date(),
          concurrencyVersion: new Int32(nextConcurrency),
        },
      },
    );
    if (update.matchedCount === 0) {
      return {
        ok: false,
        reason: "conflict",
        detail:
          "This project was changed by someone else. Reload, then try again.",
      };
    }

    await db.collection(PROJECT_ADMIN_STATE_COLLECTION).updateOne(
      { editorialId: input.editorialId },
      {
        $set: {
          editorialId: input.editorialId,
          archived: false,
          updatedAt: new Date(),
          updatedByActorId: input.actorId,
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true },
    );

    return {
      ok: true,
      editorialId: input.editorialId,
      concurrencyVersion: nextConcurrency,
      message: "Project restored to the active list as a draft.",
    };
  } catch (error) {
    return {
      ok: false,
      reason: "unavailable",
      detail: sanitizeMongoError(error),
    };
  }
}
