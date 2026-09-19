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
 *
 * A10: Live project media is managed in Mongo (`media_assets`) via admin.
 * Repository media records are not a parallel public source after migration.
 */
export const mediaRecords: readonly MediaRecord[] = [];
