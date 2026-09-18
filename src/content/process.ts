import type { PublicationState } from "@/types/content";
import type { PublicCta } from "@/content/home";

export type ProcessStepRecord = {
  id: string;
  title: string;
  description: string;
  /** Visible customer-facing output for this stage. */
  customerOutput: string;
};

export type HomeProcessRecord = {
  id: "how-we-work";
  publicationState: PublicationState;
  heading: string;
  supporting: string;
  steps: readonly [
    ProcessStepRecord,
    ProcessStepRecord,
    ProcessStepRecord,
    ProcessStepRecord,
  ];
};

export type PublicProcessStep = {
  id: string;
  number: number;
  title: string;
  description: string;
  customerOutput: string;
};

export type PublicHomeProcess = {
  id: "how-we-work";
  heading: string;
  supporting: string;
  steps: readonly PublicProcessStep[];
  action: PublicCta | null;
};

/**
 * Proposed delivery process for homepage review.
 * Stays draft — not a published guarantee of timelines, revisions, or free support.
 */
export const homeProcessRecord: HomeProcessRecord = {
  id: "how-we-work",
  publicationState: "draft",
  heading: "How we work together",
  supporting:
    "A calm path from understanding your business to a careful handover. Support after launch follows the scope we agree — it is not automatically free forever.",
  steps: [
    {
      id: "discover",
      title: "Discover",
      description:
        "We learn the business problem, the people involved, constraints, and what matters most.",
      customerOutput: "An agreed initial scope",
    },
    {
      id: "design",
      title: "Design",
      description:
        "We review the user journey and interface direction before building the wrong thing.",
      customerOutput:
        "A reviewed prototype or design appropriate to the project",
    },
    {
      id: "build",
      title: "Build",
      description:
        "We implement in manageable increments and review working progress together.",
      customerOutput: "Demonstrated functionality and feedback checkpoints",
    },
    {
      id: "launch-support",
      title: "Launch and support",
      description:
        "We verify the agreed release, hand over access and documentation, and define ongoing responsibilities.",
      customerOutput:
        "A launch/handover checklist and an explicit support arrangement",
    },
  ],
};
