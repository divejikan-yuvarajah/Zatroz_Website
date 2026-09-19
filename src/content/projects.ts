import type { PublicationState, WorkStatus } from "@/types/content";

/**
 * Controlled story content blocks for the future admin editor.
 * No arbitrary HTML, MDX, or scripts.
 */
export type StoryParagraphBlock = {
  type: "paragraph";
  text: string;
};

export type StoryListBlock = {
  type: "list";
  style: "bulleted" | "numbered";
  items: readonly string[];
};

export type StoryContentBlock = StoryParagraphBlock | StoryListBlock;

export type ProjectStoryGalleryItem = {
  mediaId: string;
  /** Explains the task or decision shown. */
  caption: string;
  /** e.g. "Prototype screen" — omit when the asset is production evidence. */
  conceptLabel?: string | null;
};

export type ProjectStoryTestimonial = {
  quote: string;
  attribution: string;
  publicationState: PublicationState;
};

/**
 * Separately publishable case-study body.
 * Summary publication on ProjectRecord can exist without a story.
 */
export type ProjectStoryRecord = {
  publicationState: PublicationState;
  /** Story H1; usually matches project title. */
  title: string;
  intro: string;
  context: readonly StoryContentBlock[];
  contribution: readonly StoryContentBlock[];
  solution: readonly StoryContentBlock[];
  /** Key capabilities or design decisions supported by evidence. */
  features: readonly string[];
  processNotes: readonly StoryContentBlock[];
  gallery: readonly ProjectStoryGalleryItem[];
  /** Verified technologies only — omit empty. */
  technologies: readonly string[];
  /** Qualitative observations allowed; do not invent metrics. */
  outcomes: readonly string[];
  lessons: readonly StoryContentBlock[];
  testimonial: ProjectStoryTestimonial | null;
  /**
   * Internal review notes — never projected to public DTOs.
   */
  reviewNotes?: string;
};

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
   * Null uses stable id tie-breaker only.
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
   * Case-study story publication gate, independent of the project summary.
   * Must match `story.publicationState` when a story body exists.
   * `null` means no public story yet (summary-only card).
   */
  storyPublicationState: PublicationState | null;
  /** Structured story body; null when summary-only. */
  story: ProjectStoryRecord | null;
};

/**
 * Empty on purpose. No verified launch stories are approved yet
 * (see content inventory C-WORK and decision D-028). Do not seed fiction.
 *
 * A10: MongoDB is the live portfolio source via admin publish. Do not treat
 * this array as a parallel live catalog — keep it empty (or fixtures-only)
 * after migration. Import approved rows with `npm run migrate:repo-portfolio`.
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

/** Stable section keys for anchors — do not derive from mutable copy. */
export const CASE_STUDY_SECTION_KEYS = [
  "context",
  "contribution",
  "solution",
  "gallery",
  "outcomes",
  "lessons",
  "testimonial",
] as const;

export type CaseStudySectionKey = (typeof CASE_STUDY_SECTION_KEYS)[number];

export const CASE_STUDY_SECTION_HEADINGS: Readonly<
  Record<CaseStudySectionKey, string>
> = {
  context: "Context and problem",
  contribution: "Contribution and scope",
  solution: "Solution",
  gallery: "Screens and evidence",
  outcomes: "Outcomes and observations",
  lessons: "Limitations and lessons",
  testimonial: "What people said",
};

/** Editorial limits for validation (admin-ready). */
export const PROJECT_STORY_LIMITS = {
  titleMax: 120,
  introMax: 400,
  blockTextMax: 2000,
  listItemMax: 300,
  maxBlocksPerSection: 12,
  maxListItems: 12,
  maxFeatures: 8,
  maxTechnologies: 8,
  maxOutcomes: 8,
  maxGalleryItems: 12,
  captionMax: 280,
  testimonialQuoteMax: 600,
  testimonialAttributionMax: 160,
} as const;
