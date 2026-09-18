import type { PublicationState, WorkStatus } from "@/types/content";

export type ProjectRecord = {
  id: string;
  slug: string;
  title: string;
  publicationState: PublicationState;
  workStatus: WorkStatus;
  contributors: string[];
  zatrozContribution: string;
  problem: string;
  approach: string;
  deliverables: string[];
  /** Verified outcomes only; never invent percentages. */
  verifiedOutcomes: string[];
  mediaIds: string[];
  publicLinks: { label: string; href: string }[];
};

/**
 * Empty on purpose. No verified launch stories are approved yet
 * (see content inventory C-WORK and decision D-028). Do not seed fiction.
 */
export const projectRecords: readonly ProjectRecord[] = [];
