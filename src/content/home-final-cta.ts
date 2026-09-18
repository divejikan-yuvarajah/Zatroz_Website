import type { PublicationState } from "@/types/content";
import type { PublicCta } from "@/content/home";

export type HomeFinalCtaRecord = {
  id: "start-a-project";
  publicationState: PublicationState;
  heading: string;
  supporting: string;
};

export type PublicHomeFinalCta = {
  id: "start-a-project";
  heading: string;
  supporting: string;
  /** Required when the public section renders — never a dead button. */
  primary: PublicCta;
  /** Up to two quiet alternatives (e.g. work, WhatsApp). */
  alternatives: readonly PublicCta[];
};

/**
 * Final homepage enquiry invitation. Remains draft until founders approve
 * wording. Public render also requires a usable contact action.
 */
export const homeFinalCtaRecord: HomeFinalCtaRecord = {
  id: "start-a-project",
  publicationState: "draft",
  heading: "Tell us what your business needs next",
  supporting:
    "Share your idea or the task you want to improve. We can discuss the scope and a suitable next step.",
};
