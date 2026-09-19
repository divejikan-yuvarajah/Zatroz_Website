/**
 * Admin media upload policy (pure — unit-testable).
 * Formats and limits align with docs/content/image-policy.md.
 */

export const MEDIA_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type MediaAllowedMime = (typeof MEDIA_ALLOWED_MIME_TYPES)[number];

/** 10 MiB hard cap on upload bytes. */
export const MEDIA_MAX_BYTES = 10 * 1024 * 1024;

/** Reject decoded images above this pixel count (width × height). */
export const MEDIA_MAX_PIXELS = 40_000_000;

/** Short-lived signed preview URL lifetime (seconds). */
export const MEDIA_PREVIEW_TTL_SECONDS = 300;

export const MEDIA_PROVIDER_CLOUDINARY = "cloudinary" as const;

export function isAllowedMediaMime(value: string): value is MediaAllowedMime {
  return (MEDIA_ALLOWED_MIME_TYPES as readonly string[]).includes(value);
}

/**
 * Detect image type from magic bytes. Rejects SVG/HTML/scripts by absence of match.
 */
export function detectImageMimeFromMagic(
  bytes: Uint8Array,
): MediaAllowedMime | null {
  if (bytes.length < 3) return null;

  // JPEG
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }

  if (bytes.length < 12) return null;

  // PNG
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "image/png";
  }

  // WebP: RIFF....WEBP
  const riff =
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46;
  const webp =
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50;
  if (riff && webp) {
    return "image/webp";
  }

  return null;
}

export type MediaFileValidation =
  | {
      ok: true;
      mimeType: MediaAllowedMime;
      byteSize: number;
    }
  | {
      ok: false;
      code: string;
      message: string;
    };

export function validateMediaFileBytes(
  bytes: Uint8Array,
  claimedMime?: string | null,
): MediaFileValidation {
  if (bytes.byteLength === 0) {
    return {
      ok: false,
      code: "empty-file",
      message: "The upload is empty.",
    };
  }
  if (bytes.byteLength > MEDIA_MAX_BYTES) {
    return {
      ok: false,
      code: "file-too-large",
      message: `File exceeds the ${MEDIA_MAX_BYTES} byte limit.`,
    };
  }

  const detected = detectImageMimeFromMagic(bytes);
  if (!detected) {
    return {
      ok: false,
      code: "unsupported-type",
      message: "Only JPEG, PNG, and WebP images are accepted.",
    };
  }

  if (claimedMime && claimedMime.trim() && claimedMime !== detected) {
    // Browser MIME can be wrong; magic wins, but reject obvious spoof attempts
    // when claim is a known dangerous type.
    const claim = claimedMime.trim().toLowerCase();
    if (
      claim.includes("svg") ||
      claim.includes("html") ||
      claim.includes("javascript") ||
      claim === "image/svg+xml"
    ) {
      return {
        ok: false,
        code: "dangerous-type",
        message: "SVG and scriptable formats are not allowed.",
      };
    }
  }

  return {
    ok: true,
    mimeType: detected,
    byteSize: bytes.byteLength,
  };
}

export function isWithinPixelBudget(
  width: number | null,
  height: number | null,
): boolean {
  if (width == null || height == null) return true;
  if (width < 1 || height < 1) return false;
  return width * height <= MEDIA_MAX_PIXELS;
}

/** Escape user search input for safe MongoDB regex (literal match). */
export function escapeRegexLiteral(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
