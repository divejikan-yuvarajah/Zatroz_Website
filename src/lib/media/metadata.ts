/**
 * Validate media metadata fields before Mongo write.
 */

import { DB_STRING_LIMITS } from "@/lib/mongodb/limits";
import type { MediaAlt } from "@/types/content";

export type MediaMetadataInput = Readonly<{
  decorative: boolean;
  altText: string;
  caption: string;
  provenance: string;
  licence: string;
  generationBrief: string;
}>;

export type MediaMetadataResult =
  | {
      ok: true;
      alt: MediaAlt;
      caption: string | null;
      provenance: string | null;
      licence: string | null;
      generationBrief: string | null;
    }
  | { ok: false; message: string };

function nullIfBlank(value: string, max: number): string | null | "too-long" {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.length > max) return "too-long";
  return trimmed;
}

export function parseMediaMetadata(
  input: MediaMetadataInput,
): MediaMetadataResult {
  const caption = nullIfBlank(input.caption, DB_STRING_LIMITS.captionMax);
  if (caption === "too-long") {
    return { ok: false, message: "Caption is too long." };
  }
  const provenance = nullIfBlank(
    input.provenance,
    DB_STRING_LIMITS.provenanceMax,
  );
  if (provenance === "too-long") {
    return { ok: false, message: "Provenance is too long." };
  }
  const licence = nullIfBlank(input.licence, DB_STRING_LIMITS.licenceMax);
  if (licence === "too-long") {
    return { ok: false, message: "Licence is too long." };
  }
  const generationBrief = nullIfBlank(
    input.generationBrief,
    DB_STRING_LIMITS.generationBriefMax,
  );
  if (generationBrief === "too-long") {
    return { ok: false, message: "Generation brief is too long." };
  }

  if (input.decorative) {
    return {
      ok: true,
      alt: { decorative: true, alt: "" },
      caption,
      provenance,
      licence,
      generationBrief,
    };
  }

  const altText = input.altText.trim();
  if (!altText) {
    return {
      ok: false,
      message: "Alt text is required unless the image is marked decorative.",
    };
  }
  if (altText.length > DB_STRING_LIMITS.altMax) {
    return { ok: false, message: "Alt text is too long." };
  }

  return {
    ok: true,
    alt: { decorative: false, alt: altText },
    caption,
    provenance,
    licence,
    generationBrief,
  };
}
