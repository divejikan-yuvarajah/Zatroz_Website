import type { PublicationState } from "@/types/content";

/**
 * Long-form service detail copy. Separate from overview summary approval.
 * Only `publicationState: "approved"` details may appear on public routes
 * when the matching route is also `implemented`.
 */
export type ServiceDetailAudienceItem = {
  id: string;
  text: string;
};

export type ServiceDetailScopeOption = {
  id: string;
  title: string;
  purpose: string;
  examples: readonly string[];
  /** What is not automatic in this option */
  notIncluded: string;
};

export type ServiceDetailDeliverableGroup = {
  id: string;
  title: string;
  items: readonly string[];
};

export type ServiceDetailExample = {
  id: string;
  /** Visible label e.g. "Illustrative example" */
  label: string;
  title: string;
  description: string;
  points: readonly string[];
  /**
   * Optional known visual for this example. Never store JSX or HTML here.
   * Known variants render labelled static illustrations in the template.
   */
  visualVariant?:
    | "websites-catalogue-comparison"
    | "web-mobile-task-comparison"
    | "business-ops-panel"
    | "ai-automation-workflow"
    | "custom-software-guide"
    | "ui-ux-form-states";
};

export type ServiceDetailStage = {
  id: string;
  title: string;
  description: string;
};

export type ServiceDetailRecord = {
  publicationState: PublicationState;
  heroTitle: string;
  introduction: string;
  /** Enquiry button label when a destination exists */
  primaryCtaLabel: string;
  audienceItems: readonly ServiceDetailAudienceItem[];
  problemItems: readonly ServiceDetailAudienceItem[];
  scopeOptions: readonly ServiceDetailScopeOption[];
  deliverableGroups: readonly ServiceDetailDeliverableGroup[];
  illustrativeExample: ServiceDetailExample | null;
  /**
   * Optional light hero decoration. Never store JSX here.
   * `browser-frame` — sample browser chrome.
   * `device-pair` — sample browser beside a phone task screen.
   * `ops-summary` — sample sales / stock / report strip.
   * `review-workflow` — sample steps ending in a human review marker.
   * `modules-link` — sample modular forms linked for tailored software.
   * `wireframe-stack` — sample hierarchy of blank panels for design process.
   */
  heroVisual?:
    | "browser-frame"
    | "device-pair"
    | "ops-summary"
    | "review-workflow"
    | "modules-link"
    | "wireframe-stack";
  relatedProjectIds: readonly string[];
  deliveryStages: readonly ServiceDetailStage[];
  clientInputs: readonly string[];
  boundaries: readonly string[];
  recurringCostNotes: readonly string[];
  /** FAQ record ids from the shared FAQ catalog */
  faqIds: readonly string[];
  /** Related service record ids */
  relatedServiceIds: readonly string[];
  pageTitle: string;
  pageDescription: string;
};
