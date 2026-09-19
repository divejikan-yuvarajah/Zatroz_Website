import "server-only";

import { COLLECTION_NAMES } from "@/lib/mongodb/collections";
import {
  isMongoRuntimeConfigured,
  sanitizeMongoError,
} from "@/lib/mongodb/config";
import { getDb } from "@/lib/mongodb/connection";
import { SCHEMA_VERSION_CURRENT } from "@/lib/mongodb/limits";
import type { MediaAssetDocument } from "@/lib/mongodb/models/types";
import type {
  MediaProcessingState,
  MediaVisibility,
} from "@/lib/mongodb/enums";
import { escapeRegexLiteral } from "@/lib/media/policy";
import type { MediaAlt } from "@/types/content";

export type MediaLibraryItem = Readonly<{
  mediaId: string;
  versionId: string;
  providerAssetId: string;
  width: number | null;
  height: number | null;
  mimeType: string;
  byteSize: number;
  alt: MediaAlt;
  caption: string | null;
  provenance: string | null;
  licence: string | null;
  generationBrief: string | null;
  processingState: MediaProcessingState;
  visibility: MediaVisibility;
  storageHint: string | null;
  createdAtIso: string;
  updatedAtIso: string;
}>;

export type MediaListResult =
  | { ok: true; items: readonly MediaLibraryItem[]; total: number }
  | { ok: false; reason: "unavailable"; detail: string };

function toItem(doc: MediaAssetDocument & { _id?: unknown }): MediaLibraryItem {
  return {
    mediaId: doc.mediaId,
    versionId: doc.versionId,
    providerAssetId: doc.providerAssetId,
    width: doc.width,
    height: doc.height,
    mimeType: doc.mimeType,
    byteSize: doc.byteSize,
    alt: doc.alt,
    caption: doc.caption,
    provenance: doc.provenance,
    licence: doc.licence,
    generationBrief: doc.generationBrief,
    processingState: doc.processingState,
    visibility: doc.visibility,
    storageHint: doc.storageHint,
    createdAtIso: doc.createdAt.toISOString(),
    updatedAtIso: doc.updatedAt.toISOString(),
  };
}

/**
 * Latest non-archived version per mediaId for the admin library.
 */
export async function listMediaLibrary(input?: {
  search?: string;
  includeArchived?: boolean;
  limit?: number;
}): Promise<MediaListResult> {
  if (!isMongoRuntimeConfigured()) {
    return {
      ok: false,
      reason: "unavailable",
      detail: "MongoDB is not configured.",
    };
  }

  const limit = Math.min(Math.max(input?.limit ?? 48, 1), 100);
  const includeArchived = input?.includeArchived === true;
  const search = input?.search?.trim() ?? "";

  try {
    const db = await getDb();
    const collection = db.collection(COLLECTION_NAMES.mediaAssets);

    const match: Record<string, unknown> = {};
    if (!includeArchived) {
      match.processingState = { $ne: "archived" };
    }
    if (search) {
      const literal = escapeRegexLiteral(search);
      match.$or = [
        { mediaId: { $regex: literal, $options: "i" } },
        { caption: { $regex: literal, $options: "i" } },
        { provenance: { $regex: literal, $options: "i" } },
      ];
    }

    const pipeline = [
      { $match: match },
      { $sort: { mediaId: 1, createdAt: -1 } },
      {
        $group: {
          _id: "$mediaId",
          doc: { $first: "$$ROOT" },
        },
      },
      { $replaceRoot: { newRoot: "$doc" } },
      { $sort: { updatedAt: -1 } },
      {
        $facet: {
          items: [{ $limit: limit }],
          total: [{ $count: "count" }],
        },
      },
    ];

    const [facet] = await collection.aggregate(pipeline).toArray();
    const rawItems = (facet?.items as MediaAssetDocument[]) ?? [];
    const total = Number(
      (facet?.total as { count: number }[] | undefined)?.[0]?.count ?? 0,
    );

    return {
      ok: true,
      items: rawItems.map((doc) => toItem(doc)),
      total,
    };
  } catch (error) {
    return {
      ok: false,
      reason: "unavailable",
      detail: sanitizeMongoError(error),
    };
  }
}

export async function findLatestMediaVersion(
  mediaId: string,
): Promise<
  | { ok: true; item: MediaLibraryItem; document: MediaAssetDocument }
  | { ok: false; reason: "not-found" | "unavailable"; detail: string }
> {
  if (!isMongoRuntimeConfigured()) {
    return {
      ok: false,
      reason: "unavailable",
      detail: "MongoDB is not configured.",
    };
  }

  try {
    const db = await getDb();
    const doc = await db.collection(COLLECTION_NAMES.mediaAssets).findOne(
      {
        mediaId,
        processingState: { $ne: "archived" },
      },
      { sort: { createdAt: -1 } },
    );

    if (!doc) {
      return { ok: false, reason: "not-found", detail: "Media not found." };
    }

    const document = doc as unknown as MediaAssetDocument;
    return { ok: true, item: toItem(document), document };
  } catch (error) {
    return {
      ok: false,
      reason: "unavailable",
      detail: sanitizeMongoError(error),
    };
  }
}

export async function insertMediaAsset(
  document: MediaAssetDocument,
): Promise<{ ok: true } | { ok: false; detail: string }> {
  if (!isMongoRuntimeConfigured()) {
    return { ok: false, detail: "MongoDB is not configured." };
  }
  try {
    const db = await getDb();
    await db.collection(COLLECTION_NAMES.mediaAssets).insertOne({
      ...document,
      schemaVersion: SCHEMA_VERSION_CURRENT,
    });
    return { ok: true };
  } catch (error) {
    return { ok: false, detail: sanitizeMongoError(error) };
  }
}

export async function updateMediaMetadata(input: {
  mediaId: string;
  versionId: string;
  alt: MediaAlt;
  caption: string | null;
  provenance: string | null;
  licence: string | null;
  generationBrief: string | null;
}): Promise<{ ok: true } | { ok: false; detail: string }> {
  if (!isMongoRuntimeConfigured()) {
    return { ok: false, detail: "MongoDB is not configured." };
  }
  try {
    const db = await getDb();
    const result = await db.collection(COLLECTION_NAMES.mediaAssets).updateOne(
      { mediaId: input.mediaId, versionId: input.versionId },
      {
        $set: {
          alt: input.alt,
          caption: input.caption,
          provenance: input.provenance,
          licence: input.licence,
          generationBrief: input.generationBrief,
          updatedAt: new Date(),
        },
      },
    );
    if (result.matchedCount === 0) {
      return { ok: false, detail: "Media version not found." };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, detail: sanitizeMongoError(error) };
  }
}

export async function archiveMediaVersion(input: {
  mediaId: string;
  versionId: string;
}): Promise<{ ok: true } | { ok: false; detail: string }> {
  if (!isMongoRuntimeConfigured()) {
    return { ok: false, detail: "MongoDB is not configured." };
  }
  try {
    const db = await getDb();
    const result = await db.collection(COLLECTION_NAMES.mediaAssets).updateOne(
      { mediaId: input.mediaId, versionId: input.versionId },
      {
        $set: {
          processingState: "archived",
          updatedAt: new Date(),
        },
      },
    );
    if (result.matchedCount === 0) {
      return { ok: false, detail: "Media version not found." };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, detail: sanitizeMongoError(error) };
  }
}

export async function writeAdminAuditEvent(input: {
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  outcome: "succeeded" | "failed" | "denied";
}): Promise<void> {
  if (!isMongoRuntimeConfigured()) return;
  try {
    const db = await getDb();
    await db.collection(COLLECTION_NAMES.adminAuditEvents).insertOne({
      schemaVersion: SCHEMA_VERSION_CURRENT,
      createdAt: new Date(),
      actorId: input.actorId,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
      outcome: input.outcome,
    });
  } catch {
    // Audit failure must not block the media operation response.
  }
}
