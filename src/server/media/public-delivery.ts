import "server-only";

import { Int32 } from "mongodb";
import {
  isDurablePublicDeliveryPath,
  publicDeliveryPublicId,
} from "@/lib/admin/media-usage";
import { COLLECTION_NAMES } from "@/lib/mongodb/collections";
import {
  isMongoRuntimeConfigured,
  sanitizeMongoError,
} from "@/lib/mongodb/config";
import { getDb } from "@/lib/mongodb/connection";
import {
  createAuthenticatedPreviewUrl,
  isCloudinaryConfigured,
  uploadPublicImage,
} from "@/server/media/cloudinary";
import { findLatestMediaVersion } from "@/server/media/repository";

export type PublicDerivativeResult =
  | { ok: true; mediaId: string; storageHint: string; skipped: boolean }
  | { ok: false; mediaId: string; detail: string };

/**
 * Ensure a media asset has a durable public delivery path for anonymous HTML.
 * Site-relative storageHint values are left as-is. Cloudinary private assets
 * get an explicit public (type=upload) derivative; the authenticated original
 * remains for draft preview.
 */
export async function preparePublicDerivativeForMedia(
  mediaId: string,
): Promise<PublicDerivativeResult> {
  if (!isMongoRuntimeConfigured()) {
    return { ok: false, mediaId, detail: "MongoDB is not configured." };
  }

  const found = await findLatestMediaVersion(mediaId);
  if (!found.ok) {
    return {
      ok: false,
      mediaId,
      detail: found.reason === "not-found" ? "Media not found." : found.detail,
    };
  }

  const item = found.item;
  if (item.processingState !== "ready") {
    return {
      ok: false,
      mediaId,
      detail: `Media is ${item.processingState}, not ready for public delivery.`,
    };
  }

  if (isDurablePublicDeliveryPath(item.storageHint)) {
    if (item.visibility !== "public") {
      const db = await getDb();
      await db.collection(COLLECTION_NAMES.mediaAssets).updateOne(
        { mediaId: item.mediaId, versionId: item.versionId },
        {
          $set: {
            visibility: "public",
            updatedAt: new Date(),
          },
        },
      );
    }
    return {
      ok: true,
      mediaId,
      storageHint: item.storageHint!.trim(),
      skipped: true,
    };
  }

  if (item.provider !== "cloudinary") {
    return {
      ok: false,
      mediaId,
      detail: "Only Cloudinary assets can generate public derivatives in A11.",
    };
  }

  if (!isCloudinaryConfigured()) {
    return {
      ok: false,
      mediaId,
      detail: "Cloudinary is not configured.",
    };
  }

  const preview = createAuthenticatedPreviewUrl({
    publicId: item.providerAssetId,
    ttlSeconds: 120,
  });
  if (!preview.ok) {
    return { ok: false, mediaId, detail: preview.message };
  }

  let buffer: Buffer;
  try {
    const response = await fetch(preview.url);
    if (!response.ok) {
      return {
        ok: false,
        mediaId,
        detail: "Could not fetch authenticated original for public copy.",
      };
    }
    buffer = Buffer.from(await response.arrayBuffer());
  } catch {
    return {
      ok: false,
      mediaId,
      detail: "Network error fetching authenticated original.",
    };
  }

  const targetId = publicDeliveryPublicId(item.providerAssetId);
  const uploaded = await uploadPublicImage({
    buffer,
    publicId: targetId,
    mimeType: item.mimeType || "image/jpeg",
  });
  if (!uploaded.ok) {
    return { ok: false, mediaId, detail: uploaded.message };
  }

  if (!uploaded.publicUrl) {
    return {
      ok: false,
      mediaId,
      detail: "Public upload succeeded but no delivery URL was returned.",
    };
  }
  const storageHint = uploaded.publicUrl;

  try {
    const db = await getDb();
    await db.collection(COLLECTION_NAMES.mediaAssets).updateOne(
      { mediaId: item.mediaId, versionId: item.versionId },
      {
        $set: {
          visibility: "public",
          storageHint,
          width:
            uploaded.width != null
              ? new Int32(uploaded.width)
              : item.width != null
                ? new Int32(item.width)
                : null,
          height:
            uploaded.height != null
              ? new Int32(uploaded.height)
              : item.height != null
                ? new Int32(item.height)
                : null,
          updatedAt: new Date(),
        },
      },
    );
    return { ok: true, mediaId, storageHint, skipped: false };
  } catch (error) {
    return { ok: false, mediaId, detail: sanitizeMongoError(error) };
  }
}

/**
 * Prepare public derivatives for every media id referenced by a project's
 * published (or draft) revisions.
 */
export async function preparePublicDerivativesForProject(
  editorialId: string,
): Promise<{ ok: true; prepared: number } | { ok: false; detail: string }> {
  if (!isMongoRuntimeConfigured()) {
    return { ok: false, detail: "MongoDB is not configured." };
  }

  try {
    const db = await getDb();
    const project = await db.collection(COLLECTION_NAMES.projects).findOne({
      editorialId,
    });
    if (!project) {
      return { ok: false, detail: "Project not found." };
    }

    const revisionIds = new Set<string>();
    if (typeof project.publishedSummaryRevisionId === "string") {
      revisionIds.add(project.publishedSummaryRevisionId);
    }
    if (typeof project.publishedStoryRevisionId === "string") {
      revisionIds.add(project.publishedStoryRevisionId);
    }
    if (typeof project.draftRevisionId === "string") {
      revisionIds.add(project.draftRevisionId);
    }

    if (revisionIds.size === 0) {
      return { ok: true, prepared: 0 };
    }

    const revisions = await db
      .collection(COLLECTION_NAMES.projectRevisions)
      .find({ revisionId: { $in: [...revisionIds] } })
      .toArray();

    const mediaIds = new Set<string>();
    for (const rev of revisions) {
      if (Array.isArray(rev.mediaRefs)) {
        for (const id of rev.mediaRefs) {
          if (typeof id === "string" && id.trim()) mediaIds.add(id.trim());
        }
      }
      const summary = rev.summary as { mediaIds?: unknown } | null;
      if (summary && Array.isArray(summary.mediaIds)) {
        for (const id of summary.mediaIds) {
          if (typeof id === "string" && id.trim()) mediaIds.add(id.trim());
        }
      }
      const story = rev.story as {
        gallery?: readonly { mediaId?: unknown }[];
      } | null;
      if (story?.gallery) {
        for (const item of story.gallery) {
          if (typeof item.mediaId === "string" && item.mediaId.trim()) {
            mediaIds.add(item.mediaId.trim());
          }
        }
      }
    }

    let prepared = 0;
    for (const mediaId of mediaIds) {
      const result = await preparePublicDerivativeForMedia(mediaId);
      if (!result.ok) {
        return { ok: false, detail: `${mediaId}: ${result.detail}` };
      }
      if (!result.skipped) prepared += 1;
    }
    return { ok: true, prepared };
  } catch (error) {
    return { ok: false, detail: sanitizeMongoError(error) };
  }
}
