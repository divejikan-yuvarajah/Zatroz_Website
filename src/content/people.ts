import type { PublicationState } from "@/types/content";
import type { PublicCta } from "@/content/home";

export type WorkingPrinciple = {
  id: string;
  title: string;
  description: string;
};

export type HomePeopleRecord = {
  id: "people";
  publicationState: PublicationState;
  heading: string;
  companyIntro: string;
  /** How customers work with Zatroz — no 24/7 or capacity overclaim. */
  communicationNote: string;
  workingPrinciples: readonly WorkingPrinciple[];
  /** Optional approved team photograph media id. */
  teamPhotoMediaId: string | null;
};

export type PublicPersonPortrait = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type PublicPerson = {
  id: string;
  displayName: string;
  role: string;
  bio: string;
  portrait: PublicPersonPortrait | null;
  links: readonly PublicCta[];
};

export type PublicTeamPhoto = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string | null;
};

export type PublicHomePeople = {
  id: "people";
  heading: string;
  companyIntro: string;
  communicationNote: string;
  principles: readonly WorkingPrinciple[];
  teamPhoto: PublicTeamPhoto | null;
  people: readonly PublicPerson[];
  action: PublicCta | null;
  /**
   * Honest layout choice from available approved assets.
   * text-led: company story only; profiles: individual people; team-photo: group image.
   */
  layout: "text-led" | "profiles" | "team-photo";
};

/**
 * Proposed homepage people / company introduction.
 * Remains draft. Do not invent founder names, portraits, or headcount.
 * Working principles are proposals until founders confirm them.
 */
export const homePeopleRecord: HomePeopleRecord = {
  id: "people",
  publicationState: "draft",
  heading: "The people behind the work",
  companyIntro:
    "Zatroz is a small software studio. We work directly with business owners and teams to turn a clear need into a useful digital result.",
  communicationNote:
    "You work with the people building the product. We keep communication practical — scope, progress, and next decisions — without claiming 24/7 availability or a large bench of specialists.",
  workingPrinciples: [
    {
      id: "clear-scope",
      title: "Clear scope",
      description:
        "Agree what is in and what is out before the build grows in the wrong direction.",
    },
    {
      id: "visible-progress",
      title: "Visible progress",
      description:
        "Show working increments so feedback arrives while change is still affordable.",
    },
    {
      id: "careful-handover",
      title: "Careful handover",
      description:
        "Leave access, documentation, and support expectations explicit — not assumed.",
    },
  ],
  teamPhotoMediaId: null,
};
