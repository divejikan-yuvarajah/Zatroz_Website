import type { MediaAlt, PublicationState } from "@/types/content";

export type MediaRecord = {
  id: string;
  publicPath: string;
  width: number | null;
  height: number | null;
  publicationState: PublicationState;
  alt: MediaAlt;
  caption: string | null;
};

/**
 * Empty on purpose. No approved logo or project screenshots are in public/.
 */
export const mediaRecords: readonly MediaRecord[] = [];
