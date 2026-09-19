import { randomBytes } from "node:crypto";

/** Stable editorial media identity (not a Cloudinary public_id alone). */
export function createMediaId(): string {
  return `med_${randomBytes(8).toString("hex")}`;
}

/** Immutable version identity — replace creates a new one. */
export function createMediaVersionId(): string {
  return `ver_${Date.now().toString(36)}_${randomBytes(4).toString("hex")}`;
}

export function buildCloudinaryPublicId(input: {
  folderPrefix: string;
  mediaId: string;
  versionId: string;
}): string {
  return `${input.folderPrefix}/media/${input.mediaId}/${input.versionId}`;
}
