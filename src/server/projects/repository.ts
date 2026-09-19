import "server-only";

import { randomBytes } from "node:crypto";
import { Int32 } from "mongodb";
import {
  ADMIN_PROJECT_PAGE_SIZE,
  buildStoryStub,
  buildSummarySnapshot,
  classifyListPublication,
  DRAFT_PLACEHOLDER,
  editorialIdFromSlug,
  type ProjectDraftFormValues,
  type ProjectListItem,
  type ProjectListQuery,
  workStatusLabel,
} from "@/lib/admin/projects";
import {
  buildStorySnapshot,
  type StoryDraftFormValues,
} from "@/lib/admin/story";
import { COLLECTION_NAMES } from "@/lib/mongodb/collections";
import {
  isMongoRuntimeConfigured,
  sanitizeMongoError,
} from "@/lib/mongodb/config";
import { getDb } from "@/lib/mongodb/connection";
import { SCHEMA_VERSION_CURRENT } from "@/lib/mongodb/limits";
import type {
  ProjectDocument,
  ProjectRevisionDocument,
  ProjectStorySnapshot,
  ProjectSummarySnapshot,
} from "@/lib/mongodb/models/types";
import { escapeRegexLiteral } from "@/lib/media/policy";
import { findLatestMediaVersion } from "@/server/media/repository";
import { listArchivedEditorialIds } from "@/server/projects/admin-state";

export type ProjectListResult =
  | {
      ok: true;
      items: readonly ProjectListItem[];
      total: number;
      page: number;
      pageSize: number;
    }
  | { ok: false; reason: "unavailable"; detail: string };

export type ProjectDraftLoad =
  | {
      ok: true;
      project: ProjectDocument;
      summary: ProjectSummarySnapshot | null;
      story: ProjectStorySnapshot | null;
      revisionNumber: number;
    }
  | {
      ok: false;
      reason: "not-found" | "unavailable";
      detail: string;
    };

export type ProjectMutationResult =
  | {
      ok: true;
      editorialId: string;
      concurrencyVersion: number;
      revisionId: string;
    }
  | {
      ok: false;
      reason:
        "unavailable" | "conflict" | "validation" | "duplicate" | "not-found";
      detail: string;
    };

function createRevisionId(editorialId: string, revisionNumber: number): string {
  return `rev_${editorialId}_${revisionNumber}_${randomBytes(4).toString("hex")}`.slice(
    0,
    80,
  );
}

function toListItem(doc: ProjectDocument): ProjectListItem {
  return {
    editorialId: doc.editorialId,
    draftTitle: doc.draftTitle,
    draftSlug: doc.draftSlug,
    workStatus: doc.workStatus,
    workStatusLabel: workStatusLabel(doc.workStatus),
    publication: classifyListPublication(doc),
    concurrencyVersion: Number(doc.concurrencyVersion),
    updatedAtIso:
      doc.updatedAt instanceof Date
        ? doc.updatedAt.toISOString()
        : new Date(doc.updatedAt).toISOString(),
    hasDraftRevision: Boolean(doc.draftRevisionId),
  };
}

export async function listAdminProjects(
  query: ProjectListQuery,
): Promise<ProjectListResult> {
  if (!isMongoRuntimeConfigured()) {
    return {
      ok: false,
      reason: "unavailable",
      detail: "MongoDB is not configured.",
    };
  }

  const pageSize = ADMIN_PROJECT_PAGE_SIZE;
  const page = Math.max(1, query.page);
  const skip = (page - 1) * pageSize;

  try {
    const db = await getDb();
    const collection = db.collection(COLLECTION_NAMES.projects);
    const match: Record<string, unknown> = {};

    const archivedIds = await listArchivedEditorialIds();
    if (query.archived) {
      if (archivedIds.length === 0) {
        return { ok: true, items: [], total: 0, page, pageSize };
      }
      match.editorialId = { $in: [...archivedIds] };
    } else if (archivedIds.length > 0) {
      match.editorialId = { $nin: [...archivedIds] };
    }

    if (query.workStatus !== "all") {
      match.workStatus = query.workStatus;
    }
    if (query.publication === "draft") {
      match.publishedSummaryRevisionId = null;
    } else if (query.publication === "published") {
      match.publishedSummaryRevisionId = { $ne: null };
    }
    if (query.search) {
      const literal = escapeRegexLiteral(query.search);
      match.$or = [
        { draftTitle: { $regex: literal, $options: "i" } },
        { draftSlug: { $regex: literal, $options: "i" } },
        { editorialId: { $regex: literal, $options: "i" } },
      ];
    }

    const [total, docs] = await Promise.all([
      collection.countDocuments(match),
      collection
        .find(match)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
    ]);

    return {
      ok: true,
      items: (docs as unknown as ProjectDocument[]).map(toListItem),
      total,
      page,
      pageSize,
    };
  } catch (error) {
    return {
      ok: false,
      reason: "unavailable",
      detail: sanitizeMongoError(error),
    };
  }
}

export async function loadProjectDraft(
  editorialId: string,
): Promise<ProjectDraftLoad> {
  if (!isMongoRuntimeConfigured()) {
    return {
      ok: false,
      reason: "unavailable",
      detail: "MongoDB is not configured.",
    };
  }

  try {
    const db = await getDb();
    const project = (await db
      .collection(COLLECTION_NAMES.projects)
      .findOne({ editorialId })) as ProjectDocument | null;

    if (!project) {
      return { ok: false, reason: "not-found", detail: "Project not found." };
    }

    const normalizedProject: ProjectDocument = {
      ...project,
      concurrencyVersion: Number(project.concurrencyVersion),
      createdAt:
        project.createdAt instanceof Date
          ? project.createdAt
          : new Date(project.createdAt),
      updatedAt:
        project.updatedAt instanceof Date
          ? project.updatedAt
          : new Date(project.updatedAt),
    };

    let summary: ProjectSummarySnapshot | null = null;
    let story: ProjectStorySnapshot | null = null;
    let revisionNumber = 0;

    if (normalizedProject.draftRevisionId) {
      const revision = (await db
        .collection(COLLECTION_NAMES.projectRevisions)
        .findOne({
          revisionId: normalizedProject.draftRevisionId,
          projectId: editorialId,
        })) as ProjectRevisionDocument | null;
      if (revision) {
        summary = revision.summary;
        story = revision.story;
        revisionNumber = Number(revision.revisionNumber);
      }
    }

    if (revisionNumber === 0) {
      const latest = await db
        .collection(COLLECTION_NAMES.projectRevisions)
        .find({ projectId: editorialId })
        .sort({ revisionNumber: -1 })
        .limit(1)
        .toArray();
      revisionNumber = Number(
        (latest[0] as unknown as ProjectRevisionDocument | undefined)
          ?.revisionNumber ?? 0,
      );
    }

    return {
      ok: true,
      project: normalizedProject,
      summary,
      story,
      revisionNumber,
    };
  } catch (error) {
    return {
      ok: false,
      reason: "unavailable",
      detail: sanitizeMongoError(error),
    };
  }
}

async function assertMediaIdsExist(
  mediaIds: readonly string[],
): Promise<{ ok: true } | { ok: false; detail: string }> {
  const unique = [...new Set(mediaIds.filter(Boolean))];
  for (const mediaId of unique) {
    const found = await findLatestMediaVersion(mediaId);
    if (!found.ok) {
      return {
        ok: false,
        detail:
          found.reason === "not-found"
            ? `Media "${mediaId}" was not found in the library.`
            : found.detail,
      };
    }
  }
  return { ok: true };
}

async function assertSlugAvailable(input: {
  slug: string;
  excludeEditorialId?: string;
}): Promise<{ ok: true } | { ok: false; detail: string }> {
  const db = await getDb();
  const clash = await db.collection(COLLECTION_NAMES.projects).findOne({
    $or: [{ draftSlug: input.slug }, { canonicalPublishedSlug: input.slug }],
    ...(input.excludeEditorialId
      ? { editorialId: { $ne: input.excludeEditorialId } }
      : {}),
  });
  if (clash) {
    return {
      ok: false,
      detail: `Slug "${input.slug}" is already used by another project.`,
    };
  }
  return { ok: true };
}

export async function createProjectDraft(input: {
  values: ProjectDraftFormValues;
  actorId: string;
}): Promise<ProjectMutationResult> {
  if (!isMongoRuntimeConfigured()) {
    return {
      ok: false,
      reason: "unavailable",
      detail: "MongoDB is not configured.",
    };
  }

  const editorialId = editorialIdFromSlug(input.values.slug);
  const mediaCheck = await assertMediaIdsExist([
    ...(input.values.coverMediaId ? [input.values.coverMediaId] : []),
    ...input.values.gallery.map((g) => g.mediaId),
  ]);
  if (!mediaCheck.ok) {
    return { ok: false, reason: "validation", detail: mediaCheck.detail };
  }

  try {
    const slugCheck = await assertSlugAvailable({ slug: input.values.slug });
    if (!slugCheck.ok) {
      return { ok: false, reason: "duplicate", detail: slugCheck.detail };
    }

    const db = await getDb();
    const existing = await db
      .collection(COLLECTION_NAMES.projects)
      .findOne({ editorialId });
    if (existing) {
      return {
        ok: false,
        reason: "duplicate",
        detail: `A project with id "${editorialId}" already exists. Choose a different slug.`,
      };
    }

    const now = new Date();
    const revisionNumber = 1;
    const revisionId = createRevisionId(editorialId, revisionNumber);
    const summary = buildSummarySnapshot(input.values);
    const story = buildStoryStub(input.values, null);
    const mediaRefs = [
      ...new Set([...summary.mediaIds, ...story.gallery.map((g) => g.mediaId)]),
    ];

    const projectDoc: ProjectDocument = {
      schemaVersion: SCHEMA_VERSION_CURRENT,
      createdAt: now,
      updatedAt: now,
      editorialId,
      draftSlug: input.values.slug,
      draftTitle: input.values.title,
      canonicalPublishedSlug: null,
      workStatus: input.values.workStatus,
      draftRevisionId: revisionId,
      publishedSummaryRevisionId: null,
      publishedStoryRevisionId: null,
      concurrencyVersion: 1,
    };

    const revisionDoc: ProjectRevisionDocument = {
      schemaVersion: SCHEMA_VERSION_CURRENT,
      createdAt: now,
      revisionId,
      projectId: editorialId,
      revisionNumber,
      kind: "summary_and_story",
      summary,
      story,
      mediaRefs,
      createdByActorId: input.actorId,
    };

    await db.collection(COLLECTION_NAMES.projects).insertOne({
      ...projectDoc,
      schemaVersion: new Int32(SCHEMA_VERSION_CURRENT),
      concurrencyVersion: new Int32(1),
    });
    await db.collection(COLLECTION_NAMES.projectRevisions).insertOne({
      ...revisionDoc,
      schemaVersion: new Int32(SCHEMA_VERSION_CURRENT),
      revisionNumber: new Int32(revisionNumber),
    });

    return {
      ok: true,
      editorialId,
      concurrencyVersion: 1,
      revisionId,
    };
  } catch (error) {
    return {
      ok: false,
      reason: "unavailable",
      detail: sanitizeMongoError(error),
    };
  }
}

export async function saveProjectDraft(input: {
  editorialId: string;
  expectedConcurrencyVersion: number;
  values: ProjectDraftFormValues;
  actorId: string;
}): Promise<ProjectMutationResult> {
  if (!isMongoRuntimeConfigured()) {
    return {
      ok: false,
      reason: "unavailable",
      detail: "MongoDB is not configured.",
    };
  }

  const mediaCheck = await assertMediaIdsExist([
    ...(input.values.coverMediaId ? [input.values.coverMediaId] : []),
    ...input.values.gallery.map((g) => g.mediaId),
  ]);
  if (!mediaCheck.ok) {
    return { ok: false, reason: "validation", detail: mediaCheck.detail };
  }

  try {
    const slugCheck = await assertSlugAvailable({
      slug: input.values.slug,
      excludeEditorialId: input.editorialId,
    });
    if (!slugCheck.ok) {
      return { ok: false, reason: "duplicate", detail: slugCheck.detail };
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
          "This project was changed by someone else. Reload the page, then save again.",
      };
    }

    const nextRevisionNumber = loaded.revisionNumber + 1;
    const revisionId = createRevisionId(input.editorialId, nextRevisionNumber);
    const summary = buildSummarySnapshot(input.values);
    const story = buildStoryStub(input.values, loaded.story);
    const mediaRefs = [
      ...new Set([...summary.mediaIds, ...story.gallery.map((g) => g.mediaId)]),
    ];
    const now = new Date();
    const nextConcurrency = input.expectedConcurrencyVersion + 1;

    const db = await getDb();
    const update = await db.collection(COLLECTION_NAMES.projects).updateOne(
      {
        editorialId: input.editorialId,
        concurrencyVersion: input.expectedConcurrencyVersion,
      },
      {
        $set: {
          draftSlug: input.values.slug,
          draftTitle: input.values.title,
          workStatus: input.values.workStatus,
          draftRevisionId: revisionId,
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
          "This project was changed by someone else. Reload the page, then save again.",
      };
    }

    await db.collection(COLLECTION_NAMES.projectRevisions).insertOne({
      schemaVersion: new Int32(SCHEMA_VERSION_CURRENT),
      createdAt: now,
      revisionId,
      projectId: input.editorialId,
      revisionNumber: new Int32(nextRevisionNumber),
      kind: "summary_and_story",
      summary,
      story,
      mediaRefs,
      createdByActorId: input.actorId,
    });

    return {
      ok: true,
      editorialId: input.editorialId,
      concurrencyVersion: nextConcurrency,
      revisionId,
    };
  } catch (error) {
    return {
      ok: false,
      reason: "unavailable",
      detail: sanitizeMongoError(error),
    };
  }
}

/**
 * Save case-study story draft while preserving the current summary snapshot.
 * Writes a new immutable revision and bumps concurrencyVersion.
 */
export async function saveProjectStoryDraft(input: {
  editorialId: string;
  expectedConcurrencyVersion: number;
  values: StoryDraftFormValues;
  actorId: string;
}): Promise<ProjectMutationResult> {
  if (!isMongoRuntimeConfigured()) {
    return {
      ok: false,
      reason: "unavailable",
      detail: "MongoDB is not configured.",
    };
  }

  const mediaCheck = await assertMediaIdsExist(
    input.values.gallery.map((g) => g.mediaId),
  );
  if (!mediaCheck.ok) {
    return { ok: false, reason: "validation", detail: mediaCheck.detail };
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
          "This project was changed by someone else. Reload the page, then save again.",
      };
    }

    const story = buildStorySnapshot(input.values);
    const summary: ProjectSummarySnapshot = loaded.summary ?? {
      title: loaded.project.draftTitle || input.values.title,
      summary: DRAFT_PLACEHOLDER,
      workStatus: loaded.project.workStatus,
      serviceIds: [],
      contributors: [],
      zatrozContribution: DRAFT_PLACEHOLDER,
      problem: DRAFT_PLACEHOLDER,
      approach: DRAFT_PLACEHOLDER,
      deliverables: [],
      verifiedOutcomes: [],
      mediaIds: [],
      publicLinks: [],
      editorialOrder: null,
    };

    // Keep cover/mediaIds; refresh gallery refs into mediaIds without dropping cover.
    const mediaIds = [...summary.mediaIds];
    for (const item of story.gallery) {
      if (!mediaIds.includes(item.mediaId)) {
        mediaIds.push(item.mediaId);
      }
    }

    const nextSummary: ProjectSummarySnapshot = {
      ...summary,
      mediaIds,
    };

    const mediaRefs = [
      ...new Set([
        ...nextSummary.mediaIds,
        ...story.gallery.map((g) => g.mediaId),
      ]),
    ];

    const nextRevisionNumber = loaded.revisionNumber + 1;
    const revisionId = createRevisionId(input.editorialId, nextRevisionNumber);
    const now = new Date();
    const nextConcurrency = input.expectedConcurrencyVersion + 1;

    const db = await getDb();
    const update = await db.collection(COLLECTION_NAMES.projects).updateOne(
      {
        editorialId: input.editorialId,
        concurrencyVersion: input.expectedConcurrencyVersion,
      },
      {
        $set: {
          draftTitle: input.values.title || loaded.project.draftTitle,
          draftRevisionId: revisionId,
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
          "This project was changed by someone else. Reload the page, then save again.",
      };
    }

    await db.collection(COLLECTION_NAMES.projectRevisions).insertOne({
      schemaVersion: new Int32(SCHEMA_VERSION_CURRENT),
      createdAt: now,
      revisionId,
      projectId: input.editorialId,
      revisionNumber: new Int32(nextRevisionNumber),
      kind: "summary_and_story",
      summary: nextSummary,
      story,
      mediaRefs,
      createdByActorId: input.actorId,
    });

    return {
      ok: true,
      editorialId: input.editorialId,
      concurrencyVersion: nextConcurrency,
      revisionId,
    };
  } catch (error) {
    return {
      ok: false,
      reason: "unavailable",
      detail: sanitizeMongoError(error),
    };
  }
}

export async function writeProjectAuditEvent(input: {
  actorId: string;
  action: string;
  targetId: string;
  outcome: "succeeded" | "failed" | "denied";
}): Promise<void> {
  if (!isMongoRuntimeConfigured()) return;
  try {
    const db = await getDb();
    await db.collection(COLLECTION_NAMES.adminAuditEvents).insertOne({
      schemaVersion: new Int32(SCHEMA_VERSION_CURRENT),
      createdAt: new Date(),
      actorId: input.actorId,
      action: input.action,
      targetType: "project",
      targetId: input.targetId,
      outcome: input.outcome,
    });
  } catch {
    // Audit failure must not block the editor response.
  }
}
