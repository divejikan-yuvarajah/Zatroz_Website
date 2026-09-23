import type { PublicationState } from "@/types/content";
import type { PublicCta } from "@/content/home";

export type BusinessNeedRecord = {
  id: string;
  publicationState: PublicationState;
  title: string;
  explanation: string;
  /** Typical deliverable — draft until founders approve. */
  deliverable: string;
  /** Existing service record IDs (not titles or paths). */
  serviceIds: readonly string[];
  /** Primary service for enquiry / detail CTA among serviceIds. */
  primaryServiceId: string;
  /** Optional approved project IDs when available. */
  relatedProjectIds: readonly string[];
};

export type HomeServiceExplorerRecord = {
  id: "services-explorer";
  publicationState: PublicationState;
  heading: string;
  supporting: string;
  defaultNeedId: string;
};

export type PublicBusinessNeedService = {
  id: string;
  title: string;
  summary: string;
  href: string | null;
};

export type PublicBusinessNeedWork = {
  id: string;
  title: string;
  workStatusLabel: string;
  href: string | null;
};

export type PublicBusinessNeed = {
  id: string;
  number: number;
  title: string;
  explanation: string;
  deliverable: string;
  services: readonly PublicBusinessNeedService[];
  relatedWork: readonly PublicBusinessNeedWork[];
  action: PublicCta | null;
};

export type PublicServiceExplorer = {
  id: "services-explorer";
  heading: string;
  supporting: string;
  defaultNeedId: string;
  needs: readonly PublicBusinessNeed[];
};

/**
 * Proposed explorer framing. Stays draft until founders approve wording.
 */
export const homeServiceExplorerRecord: HomeServiceExplorerRecord = {
  id: "services-explorer",
  publicationState: "approved",
  heading: "What do you need help with?",
  supporting:
    "Choose a business need to see how Zatroz can help — without jargon-first service names.",
  defaultNeedId: "need-reach-customers",
};

/**
 * Four business-need rows from the homepage plan.
 * Descriptions stay draft; public page omits the section until approved.
 */
export const businessNeedRecords: readonly BusinessNeedRecord[] = [
  {
    id: "need-reach-customers",
    publicationState: "approved",
    title: "Reach more customers",
    explanation:
      "Make it easier for people to find your business, understand what you offer, and take the next step online.",
    deliverable: "A clear business website or online catalogue",
    serviceIds: ["svc-websites-ecommerce", "svc-ui-ux-design"],
    primaryServiceId: "svc-websites-ecommerce",
    relatedProjectIds: [],
  },
  {
    id: "need-launch-product",
    publicationState: "approved",
    title: "Launch a digital product",
    explanation:
      "Turn a focused idea into a first usable application that your team and customers can try for real.",
    deliverable: "A focused first version of an application",
    serviceIds: [
      "svc-web-mobile-apps",
      "svc-ui-ux-design",
      "svc-custom-software",
    ],
    primaryServiceId: "svc-web-mobile-apps",
    relatedProjectIds: [],
  },
  {
    id: "need-organise-operations",
    publicationState: "approved",
    title: "Organise daily operations",
    explanation:
      "Replace scattered notes and spreadsheets with a clearer system for stock, sales, or internal workflows.",
    deliverable: "A stock, POS, or internal workflow system",
    serviceIds: ["svc-business-systems", "svc-custom-software"],
    primaryServiceId: "svc-business-systems",
    relatedProjectIds: [],
  },
  {
    id: "need-reduce-repetition",
    publicationState: "approved",
    title: "Reduce repetitive work",
    explanation:
      "Connect routine tasks so people spend less time copying information and more time checking what matters.",
    deliverable: "A reviewed workflow connecting routine tasks",
    serviceIds: ["svc-ai-automation", "svc-custom-software"],
    primaryServiceId: "svc-ai-automation",
    relatedProjectIds: [],
  },
];
