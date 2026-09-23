import type { PublicationState } from "@/types/content";
import type { PublicCta } from "@/content/home";
import type { FeedbackKind } from "@/content/feedback";

export type HomeQuestionsRecord = {
  id: "questions";
  publicationState: PublicationState;
  heading: string;
  supporting: string;
};

export type PublicFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type PublicFeedback = {
  id: string;
  kind: FeedbackKind;
  quote: string;
  attribution: string | null;
  roleOrCompany: string | null;
  relationship: string | null;
};

export type PublicHomeQuestions = {
  id: "questions";
  heading: string;
  supporting: string;
  /** At most one approved feedback item for the homepage. */
  feedback: PublicFeedback | null;
  faqs: readonly PublicFaqItem[];
  action: PublicCta | null;
};

/**
 * Homepage feedback / FAQ framing. Remains draft until founders approve
 * wording and at least one approved FAQ or feedback item is ready.
 */
export const homeQuestionsRecord: HomeQuestionsRecord = {
  id: "questions",
  publicationState: "approved",
  heading: "Questions before you enquire",
  supporting:
    "Practical answers to common buying questions. Exact scope, timing, and commercial terms are agreed in the proposal for your project.",
};
