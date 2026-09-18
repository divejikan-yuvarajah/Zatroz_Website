import type { PublicationState } from "@/types/content";

export type FounderRecord = {
  id: string;
  displayName: string;
  role: string;
  bio: string;
  publicationState: PublicationState;
  portraitMediaId: string | null;
  professionalUrls: { label: string; href: string }[];
};

/**
 * Empty on purpose. Divejikan is named in planning docs but role, bio,
 * portrait, and publication consent are still TODO. Founders 2–3 are unnamed.
 * Do not invent Person cards (see founder-profile-template.md).
 */
export const founderRecords: readonly FounderRecord[] = [];
