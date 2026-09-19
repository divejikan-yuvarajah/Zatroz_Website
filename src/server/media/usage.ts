import "server-only";

import {
  assessPermanentDeleteEligibility,
  classifyCleanupCandidate,
  collectMediaIdsFromRevisionPayload,
  publicDeliveryPublicId,
  type MediaUsageRef,
} from "@/lib/admin/media-usage";
import { COLLECTION_NAMES } from "@/lib/mongodb/collections";
import {
  isMongoRuntimeConfigured,
  sanitizeMongoError,
} from "@/lib/mongodb/config";
import { getDb } from "@/lib/mongodb/connection";
import {
  destroyCloudinaryAsset,
  destroyPublicCloudinaryAsset,
} from "@/server/media/cloudinary";
import {
  findLatestMediaVersion,
  type MediaLibraryItem,
  writeAdminAuditEvent,
} from "@/server/media/repository";

export type MediaUsageReport = Readonly<{
  mediaId: string;
  usages: readonly MediaUsageRef[];
  usageCount: number;
}>;

export type CleanupCandidate = Readonly<{
  item: MediaLibraryItem;
  kind: "failed-orphan" | "archived-unused";
  usageCount: number;
}>;

/**
 * Scan project_revisions for references to the given media id.
 */
export async function findMediaUsages(
  mediaId: string,
): Promise<
  { ok: true; report: MediaUsageReport } | { ok: false; detail: string }
> {
  if (!isMongoRuntimeConfigured()) {
    return { ok: false, detail: "MongoDB is not configured." };
  }
  try {
    const db = await getDb();
    const revisions = await db
      .collection(COLLECTION_NAMES.projectRevisions)
      .find({})
      .project({
        revisionId: 1,
        projectId: 1,
        mediaRefs: 1,
        summary: 1,
        story: 1,
      })
      .toArray();

    const usages: MediaUsageRef[] = [];
    for (const rev of revisions) {
      const summaryMediaIds =
        rev.summary &&
        typeof rev.summary === "object" &&
        Array.isArray((rev.summary as { mediaIds?: unknown }).mediaIds)
          ? ((rev.summary as { mediaIds: string[] }).mediaIds ?? [])
          : [];
      const galleryMediaIds =
        rev.story &&
        typeof rev.story === "object" &&
        Array.isArray((rev.story as { gallery?: unknown }).gallery)
          ? (
              (rev.story as { gallery: { mediaId?: string }[] }).gallery ?? []
            ).map((g) => g.mediaId ?? "")
          : [];
      const ids = collectMediaIdsFromRevisionPayload({
        mediaRefs: Array.isArray(rev.mediaRefs)
          ? (rev.mediaRefs as string[])
          : [],
        summaryMediaIds,
        galleryMediaIds,
      });
      if (!ids.includes(mediaId)) continue;

      const editorialId =
        typeof rev.projectId === "string" ? rev.projectId : "";
      const revisionId =
        typeof rev.revisionId === "string" ? rev.revisionId : "";
      let kind: MediaUsageRef["kind"] = "revision-ref";
      if (summaryMediaIds.includes(mediaId)) kind = "summary";
      else if (galleryMediaIds.includes(mediaId)) kind = "story";

      usages.push({ editorialId, revisionId, kind });
    }

    return {
      ok: true,
      report: { mediaId, usages, usageCount: usages.length },
    };
  } catch (error) {
    return { ok: false, detail: sanitizeMongoError(error) };
  }
}

export async function listCleanupCandidates(): Promise<
  | { ok: true; items: readonly CleanupCandidate[] }
  | { ok: false; detail: string }
> {
  if (!isMongoRuntimeConfigured()) {
    return { ok: false, detail: "MongoDB is not configured." };
  }
  try {
    const db = await getDb();
    const docs = await db
      .collection(COLLECTION_NAMES.mediaAssets)
      .aggregate([
        { $match: { processingState: { $in: ["failed", "archived"] } } },
        { $sort: { updatedAt: -1 } },
        {
          $group: {
            _id: "$mediaId",
            doc: { $first: "$$ROOT" },
          },
        },
        { $replaceRoot: { newRoot: "$doc" } },
        { $limit: 100 },
      ])
      .toArray();

    const items: CleanupCandidate[] = [];
    for (const doc of docs) {
      const mediaId = typeof doc.mediaId === "string" ? doc.mediaId : "";
      if (!mediaId) continue;

      const found = await findLatestMediaVersion(mediaId);
      if (!found.ok) continue;
      // Only offer cleanup when the latest version is failed/archived.
      if (
        found.item.processingState !== "failed" &&
        found.item.processingState !== "archived"
      ) {
        continue;
      }

      const usage = await findMediaUsages(mediaId);
      const usageCount = usage.ok ? usage.report.usageCount : 0;
      const kind = classifyCleanupCandidate({
        processingState: found.item.processingState,
        usageCount,
      });
      if (kind !== "failed-orphan" && kind !== "archived-unused") continue;

      items.push({ item: found.item, kind, usageCount });
    }

    return { ok: true, items };
  } catch (error) {
    return { ok: false, detail: sanitizeMongoError(error) };
  }
}

/**
 * Owner-only permanent delete after dependency checks.
 * Destroys Cloudinary authenticated + public derivative copies, then removes Mongo rows.
 */
export async function permanentlyDeleteUnusedMedia(input: {
  mediaId: string;
  versionId: string;
  actorId: string;
}): Promise<{ ok: true } | { ok: false; detail: string }> {
  if (!isMongoRuntimeConfigured()) {
    return { ok: false, detail: "MongoDB is not configured." };
  }

  try {
    const found = await findLatestMediaVersion(input.mediaId);
    if (!found.ok) {
      return {
        ok: false,
        detail:
          found.reason === "not-found" ? "Media not found." : found.detail,
      };
    }
    if (found.item.versionId !== input.versionId) {
      return {
        ok: false,
        detail: "Version mismatch — reload the media library and try again.",
      };
    }

    const usage = await findMediaUsages(input.mediaId);
    if (!usage.ok) return { ok: false, detail: usage.detail };

    const assessment = assessPermanentDeleteEligibility({
      exists: true,
      processingState: found.item.processingState,
      usageCount: usage.report.usageCount,
    });
    if (!assessment.ok) {
      await writeAdminAuditEvent({
        actorId: input.actorId,
        action: "media.permanent_delete",
        targetType: "media",
        targetId: input.mediaId,
        outcome: "denied",
      });
      return { ok: false, detail: assessment.message };
    }

    if (found.item.provider === "cloudinary" && found.item.providerAssetId) {
      await destroyCloudinaryAsset(found.item.providerAssetId);
      await destroyPublicCloudinaryAsset(
        publicDeliveryPublicId(found.item.providerAssetId),
      );
    }

    const db = await getDb();
    await db.collection(COLLECTION_NAMES.mediaAssets).deleteMany({
      mediaId: input.mediaId,
    });

    await writeAdminAuditEvent({
      actorId: input.actorId,
      action: "media.permanent_delete",
      targetType: "media",
      targetId: input.mediaId,
      outcome: "succeeded",
    });

    return { ok: true };
  } catch (error) {
    return { ok: false, detail: sanitizeMongoError(error) };
  }
}
