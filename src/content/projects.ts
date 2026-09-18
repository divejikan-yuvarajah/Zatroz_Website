import type {
  PublicationState,
  ServiceSlug,
  WorkStatus,
} from "@/types/content";

export type ProjectRecord = {
  id: string;
  slug: string;
  title: string;
  /** Short public card summary — required when publicationState is approved. */
  summary: string;
  publicationState: PublicationState;
  workStatus: WorkStatus;
  /**
   * Explicit editorial order among published projects (lower first).
   * Null/undefined uses stable id tie-breaker only.
   */
  editorialOrder: number | null;
  /** Canonical service ids this project relates to (e.g. svc-websites-ecommerce). */
  serviceIds: readonly string[];
  contributors: string[];
  zatrozContribution: string;
  problem: string;
  approach: string;
  deliverables: string[];
  /** Verified outcomes only; never invent percentages. */
  verifiedOutcomes: string[];
  mediaIds: string[];
  publicLinks: { label: string; href: string }[];
  /**
   * Case-study story publication, independent of the project summary.
   * `null` means no public story yet (summary-only card).
   */
  storyPublicationState: PublicationState | null;
};

/**
 * Empty on purpose. No verified launch stories are approved yet
 * (see content inventory C-WORK and decision D-028). Do not seed fiction.
 */
export const projectRecords: readonly ProjectRecord[] = [];

/** Public display labels for work-status taxonomy — keep IDs stable. */
export const WORK_STATUS_LABELS: Readonly<Record<WorkStatus, string>> = {
  "client-work": "Client work",
  "live-product": "Live product",
  prototype: "Prototype",
  "research-concept": "Research concept",
};

export const WORK_STATUS_VALUES = Object.keys(
  WORK_STATUS_LABELS,
) as WorkStatus[];

export type { ServiceSlug };
