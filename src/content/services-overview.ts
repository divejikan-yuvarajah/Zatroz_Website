import type { PublicationState } from "@/types/content";
import type { PublicCta } from "@/content/home";

export type ServicesOverviewRecord = {
  id: "services-overview";
  publicationState: PublicationState;
  heading: string;
  supporting: string;
  needsHeading: string;
  needsSupporting: string;
  notSureHeading: string;
  notSureBody: string;
  notSureItems: readonly {
    id: string;
    situation: string;
    guidance: string;
    /** Service record IDs to highlight */
    serviceIds: readonly string[];
  }[];
  deliveryHeading: string;
  deliveryBody: string;
  deliveryPublicationState: PublicationState;
  workHeading: string;
  workSupporting: string;
};

export type PublicOverviewNeed = {
  id: string;
  title: string;
  explanation: string;
  /** In-page service row target ids (without #) */
  serviceAnchors: readonly {
    id: string;
    title: string;
    anchorId: string;
  }[];
};

export type PublicOverviewService = {
  id: string;
  slug: string;
  anchorId: string;
  title: string;
  whoItSuits: string;
  outcome: string;
  deliverables: readonly string[];
  detailAction: PublicCta | null;
};

export type PublicOverviewGuideItem = {
  id: string;
  situation: string;
  guidance: string;
  serviceLabels: readonly string[];
};

export type PublicServicesOverview = {
  id: "services-overview";
  heading: string;
  supporting: string;
  enquiryAction: PublicCta | null;
  needsHeading: string;
  needsSupporting: string;
  needs: readonly PublicOverviewNeed[];
  services: readonly PublicOverviewService[];
  notSureHeading: string;
  notSureBody: string;
  notSureItems: readonly PublicOverviewGuideItem[];
  delivery: { heading: string; body: string } | null;
  work: {
    heading: string;
    supporting: string;
    items: readonly { id: string; title: string; href: string | null }[];
  } | null;
  finalAction: PublicCta | null;
};

/**
 * Services overview framing. Remains draft until founders approve wording
 * and service capacity claims.
 */
export const servicesOverviewRecord: ServicesOverviewRecord = {
  id: "services-overview",
  publicationState: "approved",
  heading: "Digital services built around your business.",
  supporting:
    "From a clearer online presence to tools that organise everyday work, we help you define a practical next step and build around it.",
  needsHeading: "Start from a business need",
  needsSupporting:
    "Jump to the service summaries that usually fit. One need can relate to more than one service.",
  notSureHeading: "Not sure where to start?",
  notSureBody:
    "Use these common situations as a guide. Exact scope is agreed after we understand your business — not from a fixed package list.",
  notSureItems: [
    {
      id: "guide-online-presence",
      situation: "People struggle to find what you offer online",
      guidance:
        "Start with Websites and E-commerce; UI/UX Design can refine the journey.",
      serviceIds: ["svc-websites-ecommerce", "svc-ui-ux-design"],
    },
    {
      id: "guide-focused-product",
      situation: "You need a focused app for customers or staff",
      guidance:
        "Start with Web and Mobile Applications; Custom Software fits unusual rules.",
      serviceIds: ["svc-web-mobile-apps", "svc-custom-software"],
    },
    {
      id: "guide-operations",
      situation: "Sales, stock, or internal work is scattered",
      guidance:
        "Start with Business Systems when day-to-day operations need one clearer place.",
      serviceIds: ["svc-business-systems"],
    },
    {
      id: "guide-repetition",
      situation: "The same information is copied between tools every day",
      guidance:
        "AI and Automation can help when review steps stay clear; Custom Software covers deeper integrations.",
      serviceIds: ["svc-ai-automation", "svc-custom-software"],
    },
    {
      id: "guide-design-only",
      situation: "You need clearer journeys before building software",
      guidance:
        "UI/UX Design can stand alone as a design engagement without development.",
      serviceIds: ["svc-ui-ux-design"],
    },
  ],
  deliveryHeading: "How we usually work",
  deliveryBody:
    "We clarify the need, agree an initial scope, build in reviewable steps, and hand over access with clear next actions. Timelines and support depend on the agreed proposal — not a fixed promise on this page.",
  deliveryPublicationState: "approved",
  workHeading: "Related work",
  workSupporting:
    "Approved project stories appear here when they are ready to publish.",
};
