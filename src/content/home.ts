import type { PublicationState, ServiceSlug } from "@/types/content";

export type HeroCtaIntent = "start-project" | "explore-work";

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
  /** Optional service slug for Step 20 destination wiring */
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
 * Proposed homepage hero copy and the static Sell online scenario.
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
    "Illustrative workflow: a customer request becomes organised order details, then waits for the business to review. Not a live product demo.",
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
] as const satisfies readonly HeroScenario[];

export function getHeroScenarioById(
  id: string,
  scenarios: readonly HeroScenario[] = heroScenarios,
): HeroScenario | undefined {
  return scenarios.find((scenario) => scenario.id === id);
}
