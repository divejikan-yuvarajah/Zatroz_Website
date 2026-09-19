"use server";

import { revalidatePath } from "next/cache";
import { SCHEMA_VERSION_CURRENT } from "@/lib/mongodb/limits";
import type { MediaAssetDocument } from "@/lib/mongodb/models/types";
import {
  buildCloudinaryPublicId,
  createMediaId,
  createMediaVersionId,
} from "@/lib/media/ids";
import { parseMediaMetadata } from "@/lib/media/metadata";
import { readImageDimensions } from "@/lib/media/dimensions";
import {
  isWithinPixelBudget,
  MEDIA_PROVIDER_CLOUDINARY,
  validateMediaFileBytes,
} from "@/lib/media/policy";
import { isCloudinaryConfigured } from "@/lib/media/config";
import { isMongoRuntimeConfigured } from "@/lib/mongodb/config";
import {
  destroyCloudinaryAsset,
  getCloudinaryConfigOrNull,
  uploadAuthenticatedImage,
} from "@/server/media/cloudinary";
import {
  archiveMediaVersion,
  findLatestMediaVersion,
  insertMediaAsset,
  updateMediaMetadata,
  writeAdminAuditEvent,
} from "@/server/media/repository";
import { requirePermissionSession } from "@/server/security/auth-gate";

export type MediaActionState =
  | { ok: true; message: string; mediaId?: string }
  | { ok: false; message: string };

function readMetaFromForm(formData: FormData) {
  return parseMediaMetadata({
    decorative: formData.get("decorative") === "on",
    altText: String(formData.get("altText") ?? ""),
    caption: String(formData.get("caption") ?? ""),
    provenance: String(formData.get("provenance") ?? ""),
    licence: String(formData.get("licence") ?? ""),
    generationBrief: String(formData.get("generationBrief") ?? ""),
  });
}

async function readUploadBytes(
  formData: FormData,
): Promise<
  | { ok: true; buffer: Buffer; claimedMime: string | null }
  | { ok: false; message: string }
> {
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false, message: "Choose an image file to upload." };
  }
  if (file.size === 0) {
    return { ok: false, message: "The upload is empty." };
  }
  const arrayBuffer = await file.arrayBuffer();
  return {
    ok: true,
    buffer: Buffer.from(arrayBuffer),
    claimedMime: file.type || null,
  };
}

export async function uploadMediaAction(
  _prev: MediaActionState | null,
  formData: FormData,
): Promise<MediaActionState> {
  const gate = await requirePermissionSession("admin.content.write");
  if (!gate.ok || !gate.context.userId) {
    return {
      ok: false,
      message: "You do not have permission to upload media.",
    };
  }

  if (!isMongoRuntimeConfigured() || !isCloudinaryConfigured()) {
    return {
      ok: false,
      message:
        "Media uploads require MongoDB and Cloudinary credentials in this environment.",
    };
  }

  const config = getCloudinaryConfigOrNull();
  if (!config) {
    return { ok: false, message: "Cloudinary is not configured." };
  }

  const fileRead = await readUploadBytes(formData);
  if (!fileRead.ok) return fileRead;

  const bytes = new Uint8Array(fileRead.buffer);
  const fileCheck = validateMediaFileBytes(bytes, fileRead.claimedMime);
  if (!fileCheck.ok) {
    return { ok: false, message: fileCheck.message };
  }

  const dims = readImageDimensions(bytes, fileCheck.mimeType);
  if (dims && !isWithinPixelBudget(dims.width, dims.height)) {
    return {
      ok: false,
      message: "Image pixel dimensions exceed the allowed budget.",
    };
  }

  const meta = readMetaFromForm(formData);
  if (!meta.ok) return { ok: false, message: meta.message };

  const mediaId = createMediaId();
  const versionId = createMediaVersionId();
  const publicId = buildCloudinaryPublicId({
    folderPrefix: config.folderPrefix,
    mediaId,
    versionId,
  });

  const uploaded = await uploadAuthenticatedImage({
    buffer: fileRead.buffer,
    publicId,
    mimeType: fileCheck.mimeType,
  });
  if (!uploaded.ok) {
    await writeAdminAuditEvent({
      actorId: gate.context.userId,
      action: "media.upload",
      targetType: "media",
      targetId: mediaId,
      outcome: "failed",
    });
    return { ok: false, message: uploaded.message };
  }

  const width = uploaded.width ?? dims?.width ?? null;
  const height = uploaded.height ?? dims?.height ?? null;
  if (!isWithinPixelBudget(width, height)) {
    await destroyCloudinaryAsset(uploaded.publicId);
    return {
      ok: false,
      message: "Uploaded image exceeded the pixel budget and was discarded.",
    };
  }

  const now = new Date();
  const document: MediaAssetDocument = {
    schemaVersion: SCHEMA_VERSION_CURRENT,
    createdAt: now,
    updatedAt: now,
    mediaId,
    versionId,
    provider: MEDIA_PROVIDER_CLOUDINARY,
    providerAssetId: uploaded.publicId,
    providerVersionId: uploaded.providerVersionId,
    width,
    height,
    mimeType: fileCheck.mimeType,
    byteSize: uploaded.bytes,
    alt: meta.alt,
    caption: meta.caption,
    provenance: meta.provenance,
    licence: meta.licence,
    generationBrief: meta.generationBrief,
    processingState: "ready",
    visibility: "private",
    storageHint: config.folderPrefix,
  };

  const inserted = await insertMediaAsset(document);
  if (!inserted.ok) {
    await destroyCloudinaryAsset(uploaded.publicId);
    await writeAdminAuditEvent({
      actorId: gate.context.userId,
      action: "media.upload",
      targetType: "media",
      targetId: mediaId,
      outcome: "failed",
    });
    return { ok: false, message: inserted.detail };
  }

  await writeAdminAuditEvent({
    actorId: gate.context.userId,
    action: "media.upload",
    targetType: "media",
    targetId: mediaId,
    outcome: "succeeded",
  });

  revalidatePath("/admin/media");
  return { ok: true, message: "Media uploaded.", mediaId };
}

export async function replaceMediaAction(
  _prev: MediaActionState | null,
  formData: FormData,
): Promise<MediaActionState> {
  const gate = await requirePermissionSession("admin.content.write");
  if (!gate.ok || !gate.context.userId) {
    return {
      ok: false,
      message: "You do not have permission to replace media.",
    };
  }

  if (!isMongoRuntimeConfigured() || !isCloudinaryConfigured()) {
    return {
      ok: false,
      message:
        "Media replace requires MongoDB and Cloudinary credentials in this environment.",
    };
  }

  const config = getCloudinaryConfigOrNull();
  if (!config) {
    return { ok: false, message: "Cloudinary is not configured." };
  }

  const mediaId = String(formData.get("mediaId") ?? "").trim();
  if (!mediaId) {
    return { ok: false, message: "Missing media id." };
  }

  const existing = await findLatestMediaVersion(mediaId);
  if (!existing.ok) {
    return { ok: false, message: existing.detail };
  }

  const fileRead = await readUploadBytes(formData);
  if (!fileRead.ok) return fileRead;

  const bytes = new Uint8Array(fileRead.buffer);
  const fileCheck = validateMediaFileBytes(bytes, fileRead.claimedMime);
  if (!fileCheck.ok) {
    return { ok: false, message: fileCheck.message };
  }

  const dims = readImageDimensions(bytes, fileCheck.mimeType);
  if (dims && !isWithinPixelBudget(dims.width, dims.height)) {
    return {
      ok: false,
      message: "Image pixel dimensions exceed the allowed budget.",
    };
  }

  // Keep prior metadata unless the form supplies new fields.
  const meta = readMetaFromForm(formData);
  const resolvedMeta = meta.ok
    ? meta
    : {
        ok: true as const,
        alt: existing.document.alt,
        caption: existing.document.caption,
        provenance: existing.document.provenance,
        licence: existing.document.licence,
        generationBrief: existing.document.generationBrief,
      };
  if (!resolvedMeta.ok) {
    return { ok: false, message: "Invalid metadata." };
  }

  const versionId = createMediaVersionId();
  const publicId = buildCloudinaryPublicId({
    folderPrefix: config.folderPrefix,
    mediaId,
    versionId,
  });

  const uploaded = await uploadAuthenticatedImage({
    buffer: fileRead.buffer,
    publicId,
    mimeType: fileCheck.mimeType,
  });
  if (!uploaded.ok) {
    await writeAdminAuditEvent({
      actorId: gate.context.userId,
      action: "media.replace",
      targetType: "media",
      targetId: mediaId,
      outcome: "failed",
    });
    return { ok: false, message: uploaded.message };
  }

  const width = uploaded.width ?? dims?.width ?? null;
  const height = uploaded.height ?? dims?.height ?? null;
  if (!isWithinPixelBudget(width, height)) {
    await destroyCloudinaryAsset(uploaded.publicId);
    return {
      ok: false,
      message: "Replacement image exceeded the pixel budget and was discarded.",
    };
  }

  const now = new Date();
  const document: MediaAssetDocument = {
    schemaVersion: SCHEMA_VERSION_CURRENT,
    createdAt: now,
    updatedAt: now,
    mediaId,
    versionId,
    provider: MEDIA_PROVIDER_CLOUDINARY,
    providerAssetId: uploaded.publicId,
    providerVersionId: uploaded.providerVersionId,
    width,
    height,
    mimeType: fileCheck.mimeType,
    byteSize: uploaded.bytes,
    alt: resolvedMeta.alt,
    caption: resolvedMeta.caption,
    provenance: resolvedMeta.provenance,
    licence: resolvedMeta.licence,
    generationBrief: resolvedMeta.generationBrief,
    processingState: "ready",
    visibility: "private",
    storageHint: config.folderPrefix,
  };

  const inserted = await insertMediaAsset(document);
  if (!inserted.ok) {
    await destroyCloudinaryAsset(uploaded.publicId);
    return { ok: false, message: inserted.detail };
  }

  // Archive previous head version (immutable history retained).
  await archiveMediaVersion({
    mediaId,
    versionId: existing.item.versionId,
  });

  await writeAdminAuditEvent({
    actorId: gate.context.userId,
    action: "media.replace",
    targetType: "media",
    targetId: mediaId,
    outcome: "succeeded",
  });

  revalidatePath("/admin/media");
  return { ok: true, message: "Media replaced with a new version.", mediaId };
}

export async function updateMediaMetaAction(
  _prev: MediaActionState | null,
  formData: FormData,
): Promise<MediaActionState> {
  const gate = await requirePermissionSession("admin.content.write");
  if (!gate.ok || !gate.context.userId) {
    return { ok: false, message: "You do not have permission to edit media." };
  }

  const mediaId = String(formData.get("mediaId") ?? "").trim();
  const versionId = String(formData.get("versionId") ?? "").trim();
  if (!mediaId || !versionId) {
    return { ok: false, message: "Missing media version." };
  }

  const meta = readMetaFromForm(formData);
  if (!meta.ok) return { ok: false, message: meta.message };

  const updated = await updateMediaMetadata({
    mediaId,
    versionId,
    alt: meta.alt,
    caption: meta.caption,
    provenance: meta.provenance,
    licence: meta.licence,
    generationBrief: meta.generationBrief,
  });
  if (!updated.ok) {
    return { ok: false, message: updated.detail };
  }

  await writeAdminAuditEvent({
    actorId: gate.context.userId,
    action: "media.update_meta",
    targetType: "media",
    targetId: mediaId,
    outcome: "succeeded",
  });

  revalidatePath("/admin/media");
  return { ok: true, message: "Media details saved.", mediaId };
}

export async function archiveMediaAction(
  _prev: MediaActionState | null,
  formData: FormData,
): Promise<MediaActionState> {
  const gate = await requirePermissionSession("admin.content.write");
  if (!gate.ok || !gate.context.userId) {
    return {
      ok: false,
      message: "You do not have permission to archive media.",
    };
  }

  const mediaId = String(formData.get("mediaId") ?? "").trim();
  const versionId = String(formData.get("versionId") ?? "").trim();
  if (!mediaId || !versionId) {
    return { ok: false, message: "Missing media version." };
  }

  const archived = await archiveMediaVersion({ mediaId, versionId });
  if (!archived.ok) {
    return { ok: false, message: archived.detail };
  }

  await writeAdminAuditEvent({
    actorId: gate.context.userId,
    action: "media.archive",
    targetType: "media",
    targetId: mediaId,
    outcome: "succeeded",
  });

  revalidatePath("/admin/media");
  return { ok: true, message: "Media version archived.", mediaId };
}
