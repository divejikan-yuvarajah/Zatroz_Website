import type { RouteId } from "@/config/routes";
import type { PublicationState, ServiceSlug } from "@/types/content";

export type ServiceRecord = {
  id: string;
  slug: ServiceSlug;
  routeId: RouteId;
  title: string;
  publicationState: PublicationState;
  /** Short summary; draft wording is not a capacity promise. */
  summary: string;
  deliverables: string[];
  relatedProjectIds: string[];
  whoItSuits: string;
  problemsAddressed: string;
  exampleNotes: string;
  deliverySteps: string;
  clientInputs: string;
  scopeBoundaries: string;
};

/**
 * Exactly six service groups. All start as draft until founders approve copy
 * and confirm delivery capacity (see decision register D-009).
 */
export const serviceRecords = [
  {
    id: "svc-websites-ecommerce",
    slug: "websites-ecommerce",
    routeId: "websitesEcommerce",
    title: "Websites and E-commerce",
    publicationState: "draft",
    summary:
      "Draft: marketing sites and online sales flows for small businesses. Capacity and inclusions need founder confirmation before public claims.",
    deliverables: [],
    relatedProjectIds: [],
    whoItSuits: "",
    problemsAddressed: "",
    exampleNotes: "",
    deliverySteps: "",
    clientInputs: "",
    scopeBoundaries: "",
  },
  {
    id: "svc-web-mobile-apps",
    slug: "web-mobile-apps",
    routeId: "webMobileApps",
    title: "Web and Mobile Applications",
    publicationState: "draft",
    summary:
      "Draft: custom web and mobile applications shaped around real workflows. Scope boundaries are not yet approved for launch pages.",
    deliverables: [],
    relatedProjectIds: [],
    whoItSuits: "",
    problemsAddressed: "",
    exampleNotes: "",
    deliverySteps: "",
    clientInputs: "",
    scopeBoundaries: "",
  },
  {
    id: "svc-business-systems",
    slug: "business-systems",
    routeId: "businessSystems",
    title: "Business Systems",
    publicationState: "draft",
    summary:
      "Draft: systems that help teams sell, serve, and operate day to day. Hardware and support boundaries need confirmation.",
    deliverables: [],
    relatedProjectIds: [],
    whoItSuits: "",
    problemsAddressed: "",
    exampleNotes: "",
    deliverySteps: "",
    clientInputs: "",
    scopeBoundaries: "",
  },
  {
    id: "svc-ai-automation",
    slug: "ai-automation",
    routeId: "aiAutomation",
    title: "AI and Automation",
    publicationState: "draft",
    summary:
      "Draft: practical automation with human review where it matters. Public AI claims stay limited until limitations wording is approved.",
    deliverables: [],
    relatedProjectIds: [],
    whoItSuits: "",
    problemsAddressed: "",
    exampleNotes: "",
    deliverySteps: "",
    clientInputs: "",
    scopeBoundaries: "",
  },
  {
    id: "svc-custom-software",
    slug: "custom-software",
    routeId: "customSoftware",
    title: "Custom Software",
    publicationState: "draft",
    summary:
      "Draft: software built for a specific business process when off-the-shelf tools do not fit. Example boundaries are still empty.",
    deliverables: [],
    relatedProjectIds: [],
    whoItSuits: "",
    problemsAddressed: "",
    exampleNotes: "",
    deliverySteps: "",
    clientInputs: "",
    scopeBoundaries: "",
  },
  {
    id: "svc-ui-ux-design",
    slug: "ui-ux-design",
    routeId: "uiUxDesign",
    title: "UI/UX Design",
    publicationState: "draft",
    summary:
      "Draft: interface and experience design for products and business tools. Deliverable list needs content-owner approval.",
    deliverables: [],
    relatedProjectIds: [],
    whoItSuits: "",
    problemsAddressed: "",
    exampleNotes: "",
    deliverySteps: "",
    clientInputs: "",
    scopeBoundaries: "",
  },
] as const satisfies readonly ServiceRecord[];
