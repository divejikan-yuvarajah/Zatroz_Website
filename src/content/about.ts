import type { PublicationState } from "@/types/content";

export type AboutValueRecord = {
  id: string;
  title: string;
  /** One observable behaviour — not a process guarantee. */
  behaviour: string;
};

export type AboutStatementRecord = {
  text: string;
  publicationState: PublicationState;
};

/**
 * About page editorial record.
 * Company story, mission, vision, and values were approved for public use
 * by the owner on 2026-09-24. That approval covers this existing copy only.
 * It is not independent verification of facts, and it does not create founder
 * profiles or project stories that are not in the catalog.
 */
export type AboutPageRecord = {
  id: "about";
  publicationState: PublicationState;
  heroTitle: string;
  introduction: string;
  primaryCtaLabel: string;
  companyStory: readonly string[];
  mission: AboutStatementRecord;
  vision: AboutStatementRecord;
  valuesHeading: string;
  valuesSupporting: string;
  values: readonly AboutValueRecord[];
  teamHeading: string;
  teamSupporting: string;
  evidenceHeading: string;
  evidenceSupporting: string;
  directionHeading: string;
  /** Future intention — must stay clearly labelled as intention. */
  directionNote: string;
  pageTitle: string;
  pageDescription: string;
};

export const aboutPageRecord = {
  id: "about",
  publicationState: "approved",
  heroTitle: "A small team focused on useful digital solutions.",
  introduction:
    "Zatroz is a service-based software studio. We help SMEs and local businesses improve how they sell, serve customers, and run everyday operations — through design and custom software, not through invented scale.",
  primaryCtaLabel: "Start a project",
  companyStory: [
    "We started as a small founding team that wanted digital work to stay practical: clear scope, visible progress, and tools people can actually use after handover.",
    "Today we offer six service groups — websites and e-commerce, web and mobile applications, business systems, AI and automation, custom software, and UI/UX design. What we take on must match what we can deliver.",
    "We do not claim a large agency bench, a fixed delivery calendar, or a wall of unnamed clients. When project stories are approved, they appear on Work with honest status labels.",
  ],
  mission: {
    text: "Help businesses turn a clear operational need into a digital result they can run and maintain.",
    publicationState: "approved",
  },
  vision: {
    text: "Become a trusted partner for SMEs that need software shaped around real work — starting with strong delivery, then expanding product ideas only when they are ready.",
    publicationState: "approved",
  },
  valuesHeading: "How we work",
  valuesSupporting:
    "These are working commitments — not proof that every past project followed a formal process.",
  values: [
    {
      id: "about-value-understand",
      title: "Understand the business",
      behaviour:
        "We ask how work happens today before proposing screens, workflows, or automation.",
    },
    {
      id: "about-value-scope",
      title: "Keep scope clear",
      behaviour:
        "We write what is in and out of the first release so the build does not grow in the wrong direction.",
    },
    {
      id: "about-value-review",
      title: "Review work together",
      behaviour:
        "We share working increments so feedback arrives while change is still affordable.",
    },
    {
      id: "about-value-handover",
      title: "Build for handover",
      behaviour:
        "We leave access, documentation, and support expectations explicit — not assumed.",
    },
  ],
  teamHeading: "The founding team",
  teamSupporting:
    "Zatroz has three founders. Names, roles, biographies, and portraits appear here when each person has supplied them for the public site. Until then, this section stays text-first.",
  evidenceHeading: "Selected evidence",
  evidenceSupporting:
    "Approved project summaries from Work appear here when they exist. We do not invent logos, awards, or metrics to fill this section.",
  directionHeading: "Where we are heading",
  directionNote:
    "Intention: keep improving delivery for SMEs through the six launch services, and explore product ideas only when they are ready to stand on verified work — not as launched products on this page.",
  pageTitle: "About — Zatroz",
  pageDescription:
    "Meet Zatroz — a small software studio helping SMEs with practical digital solutions across design and custom software.",
} as const satisfies AboutPageRecord;
