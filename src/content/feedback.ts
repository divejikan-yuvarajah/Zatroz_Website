import type { PublicationState } from "@/types/content";

export type FeedbackKind = "testimonial" | "project-lesson";

/**
 * Authentic feedback only. Testimonials require permission and attribution.
 * Project lessons are Zatroz's own learning — never dress them as customer quotes.
 * Keep private approval evidence out of this file and out of public props.
 */
export type FeedbackRecord = {
  id: string;
  kind: FeedbackKind;
  quote: string;
  /** Person or organisation name for testimonials; null for lessons. */
  attribution: string | null;
  /** Role / company context when publication is permitted. */
  roleOrCompany: string | null;
  /** Genuine relationship to Zatroz when publication is permitted. */
  relationship: string | null;
  publicationState: PublicationState;
};

/**
 * Empty until founders approve a real quote or an honest project lesson.
 * Do not invent customer feedback or star ratings.
 */
export const feedbackRecords = [] as const satisfies readonly FeedbackRecord[];
