import "server-only";

import { v2 as cloudinary } from "cloudinary";
import {
  cloudinaryConfigLabel,
  isCloudinaryConfigured,
  resolveCloudinaryRuntimeConfig,
  type CloudinaryRuntimeConfig,
} from "@/lib/media/config";
import { MEDIA_PREVIEW_TTL_SECONDS } from "@/lib/media/policy";

let configuredKey: string | null = null;

function ensureConfigured(config: CloudinaryRuntimeConfig): void {
  const key = `${config.cloudName}|${config.apiKey.length}|${config.apiSecret.length}`;
  if (configuredKey === key) return;
  cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
    secure: true,
  });
  configuredKey = key;
}

export function getCloudinaryConfigOrNull(): CloudinaryRuntimeConfig | null {
  const resolved = resolveCloudinaryRuntimeConfig();
  return resolved.ok ? resolved.config : null;
}

export type CloudinaryUploadResult =
  | {
      ok: true;
      publicId: string;
      /** Cloudinary asset version string/number as string. */
      providerVersionId: string;
      width: number | null;
      height: number | null;
      bytes: number;
      format: string | null;
      resourceType: string;
    }
  | { ok: false; message: string };

/**
 * Upload bytes as an authenticated (non-public) Cloudinary asset.
 * Folder path is a hint only — access is controlled by type=authenticated + signed URLs.
 */
export async function uploadAuthenticatedImage(input: {
  buffer: Buffer;
  publicId: string;
  mimeType: string;
}): Promise<CloudinaryUploadResult> {
  const resolved = resolveCloudinaryRuntimeConfig();
  if (!resolved.ok) {
    return {
      ok: false,
      message: resolved.issues.map((i) => i.message).join(" "),
    };
  }

  ensureConfigured(resolved.config);

  try {
    const dataUri = `data:${input.mimeType};base64,${input.buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      public_id: input.publicId,
      resource_type: "image",
      type: "authenticated",
      overwrite: false,
      unique_filename: false,
      use_filename: false,
    });

    return {
      ok: true,
      publicId: String(result.public_id),
      providerVersionId: String(result.version ?? result.version_id ?? "1"),
      width: typeof result.width === "number" ? result.width : null,
      height: typeof result.height === "number" ? result.height : null,
      bytes:
        typeof result.bytes === "number" ? result.bytes : input.buffer.length,
      format: typeof result.format === "string" ? result.format : null,
      resourceType:
        typeof result.resource_type === "string"
          ? result.resource_type
          : "image",
    };
  } catch {
    return {
      ok: false,
      message: "Cloudinary upload failed (details omitted).",
    };
  }
}

/**
 * Time-limited signed URL for authenticated assets. Never log the URL.
 */
export function createAuthenticatedPreviewUrl(input: {
  publicId: string;
  ttlSeconds?: number;
}):
  | { ok: true; url: string; expiresAt: number }
  | { ok: false; message: string } {
  const resolved = resolveCloudinaryRuntimeConfig();
  if (!resolved.ok) {
    return {
      ok: false,
      message: "Cloudinary is not configured.",
    };
  }
  ensureConfigured(resolved.config);

  const ttl = input.ttlSeconds ?? MEDIA_PREVIEW_TTL_SECONDS;
  const expiresAt = Math.floor(Date.now() / 1000) + ttl;

  try {
    const url = cloudinary.url(input.publicId, {
      type: "authenticated",
      resource_type: "image",
      sign_url: true,
      secure: true,
      auth_token: {
        duration: ttl,
      },
    });
    if (!url || typeof url !== "string") {
      return { ok: false, message: "Could not sign preview URL." };
    }
    return { ok: true, url, expiresAt };
  } catch {
    // Fallback: signed URL without auth_token (still requires type authenticated).
    try {
      const url = cloudinary.url(input.publicId, {
        type: "authenticated",
        resource_type: "image",
        sign_url: true,
        secure: true,
      });
      return { ok: true, url, expiresAt };
    } catch {
      return { ok: false, message: "Could not sign preview URL." };
    }
  }
}

export function destroyCloudinaryAsset(publicId: string): Promise<boolean> {
  const resolved = resolveCloudinaryRuntimeConfig();
  if (!resolved.ok) return Promise.resolve(false);
  ensureConfigured(resolved.config);
  return cloudinary.uploader
    .destroy(publicId, { type: "authenticated", resource_type: "image" })
    .then(() => true)
    .catch(() => false);
}

/** Destroy a public (type=upload) delivery copy created for published pages. */
export function destroyPublicCloudinaryAsset(
  publicId: string,
): Promise<boolean> {
  const resolved = resolveCloudinaryRuntimeConfig();
  if (!resolved.ok) return Promise.resolve(false);
  ensureConfigured(resolved.config);
  return cloudinary.uploader
    .destroy(publicId, { type: "upload", resource_type: "image" })
    .then(() => true)
    .catch(() => false);
}

/**
 * Upload bytes as a public Cloudinary asset (type=upload) for anonymous HTML.
 * Used only for server-owned derivatives of already-authenticated media — never
 * for arbitrary remote URLs submitted by clients.
 */
export async function uploadPublicImage(input: {
  buffer: Buffer;
  publicId: string;
  mimeType: string;
}): Promise<CloudinaryUploadResult & { publicUrl?: string }> {
  const resolved = resolveCloudinaryRuntimeConfig();
  if (!resolved.ok) {
    return {
      ok: false,
      message: resolved.issues.map((i) => i.message).join(" "),
    };
  }

  ensureConfigured(resolved.config);

  try {
    const dataUri = `data:${input.mimeType};base64,${input.buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      public_id: input.publicId,
      resource_type: "image",
      type: "upload",
      overwrite: true,
      unique_filename: false,
      use_filename: false,
    });

    const publicUrl = cloudinary.url(String(result.public_id), {
      secure: true,
      resource_type: "image",
      type: "upload",
    });

    return {
      ok: true,
      publicId: String(result.public_id),
      providerVersionId: String(result.version ?? result.version_id ?? "1"),
      width: typeof result.width === "number" ? result.width : null,
      height: typeof result.height === "number" ? result.height : null,
      bytes:
        typeof result.bytes === "number" ? result.bytes : input.buffer.length,
      format: typeof result.format === "string" ? result.format : null,
      resourceType:
        typeof result.resource_type === "string"
          ? result.resource_type
          : "image",
      publicUrl,
    };
  } catch {
    return {
      ok: false,
      message: "Cloudinary public upload failed (details omitted).",
    };
  }
}

export function mediaProviderReadyLabel(): string | null {
  const config = getCloudinaryConfigOrNull();
  if (!config) return null;
  return cloudinaryConfigLabel(config);
}

export { isCloudinaryConfigured };
