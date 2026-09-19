import type { PublicationState, ServiceSlug } from "@/types/content";

export type HeroCtaIntent = "start-project" | "explore-work";

export type PublicCta = {
  label: string;
  href: string;
};

export type HeroWorkflowStage = {
  id: string;
  label: string;
  detail: string;
};

export type HeroScenario = {
  id: string;
  title: string;
  explanation: string;
  stages: readonly [HeroWorkflowStage, HeroWorkflowStage, HeroWorkflowStage];
  /** Optional service slug for destination wiring when the route is ready */
  relatedServiceSlug: ServiceSlug | null;
};

export type HomeHeroRecord = {
  id: "home-hero";
  publicationState: PublicationState;
  eyebrow: string;
  headline: string;
  supporting: string;
  primaryIntent: HeroCtaIntent;
  secondaryIntent: HeroCtaIntent;
  defaultScenarioId: string;
  workflowCaption: string;
};

/**
 * Proposed homepage hero copy.
 * Remains draft until founders approve the exact wording.
 */
export const homeHeroRecord: HomeHeroRecord = {
  id: "home-hero",
  publicationState: "draft",
  eyebrow: "Software studio",
  headline: "Digital solutions. Built around your business.",
  supporting:
    "We design websites, applications, and automation that help your business sell, serve customers, and manage everyday work.",
  primaryIntent: "start-project",
  secondaryIntent: "explore-work",
  defaultScenarioId: "sell-online",
  workflowCaption:
    "Illustrative workflow only — sample labels, not a live product, payment, inventory, or AI system.",
};

export const heroScenarios = [
  {
    id: "sell-online",
    title: "Sell online",
    explanation:
      "A sample customer request is organised into clear order details the business can review. No payment or live checkout is shown.",
    relatedServiceSlug: "websites-ecommerce",
    stages: [
      {
        id: "request",
        label: "Customer request",
        detail: "Sample: “Two blue shirts, deliver this week.”",
      },
      {
        id: "organised",
        label: "Organised order details",
        detail: "Sample: items, quantity, and delivery note grouped together.",
      },
      {
        id: "review",
        label: "Ready for review",
        detail: "Sample: waiting for the business to confirm next steps.",
      },
    ],
  },
  {
    id: "run-operations",
    title: "Run operations",
    explanation:
      "A sample stock note is written into a shared record the team can overview together. Not a live inventory system.",
    relatedServiceSlug: "business-systems",
    stages: [
      {
        id: "stock-update",
        label: "Stock update",
        detail: "Sample: “Shelf B — 12 units remaining.”",
      },
      {
        id: "shared-record",
        label: "Shared record",
        detail: "Sample: the note is saved where the team can find it.",
      },
      {
        id: "team-overview",
        label: "Team overview",
        detail: "Sample: colleagues see the same status in one place.",
      },
    ],
  },
  {
    id: "automate-tasks",
    title: "Automate tasks",
    explanation:
      "A sample invoice is turned into an extracted draft for a person to check. Not live AI processing or banking integration.",
    relatedServiceSlug: "ai-automation",
    stages: [
      {
        id: "invoice-received",
        label: "Invoice received",
        detail: "Sample: a supplier invoice PDF arrives by email.",
      },
      {
        id: "extracted-draft",
        label: "Extracted draft",
        detail: "Sample: supplier name, date, and total copied into a draft.",
      },
      {
        id: "human-review",
        label: "Human review",
        detail:
          "Sample: a person checks the draft before anything is approved.",
      },
    ],
  },
] as const satisfies readonly HeroScenario[];

export function getHeroScenarioById(
  id: string,
  scenarios: readonly HeroScenario[] = heroScenarios,
): HeroScenario | undefined {
  return scenarios.find((scenario) => scenario.id === id);
}

export type HomeSelectedWorkRecord = {
  id: "selected-work";
  heading: string;
  supporting: string;
  /**
   * Ordered project IDs for the homepage feature strip.
   * Only approved projects may be listed; validation rejects drafts and unknowns.
   */
  featuredProjectIds: readonly string[];
};

/**
 * Homepage selected-work copy and feature order.
 * Public featured IDs live in Mongo `site_content_settings` (A09+).
 * This repository array remains for content-validation fixtures only — do not
 * treat it as the live homepage order after A10.
 */
export const homeSelectedWorkRecord: HomeSelectedWorkRecord = {
  id: "selected-work",
  heading: "Selected work",
  supporting:
    "Concrete examples of digital work — with honest status labels for client delivery, prototypes, and research.",
  featuredProjectIds: [],
};
