import type { RouteId } from "@/config/routes";
import type { ServiceDetailRecord } from "@/content/service-detail";
import { webMobileAppsDetail } from "@/content/service-detail-web-mobile-apps";
import { websitesEcommerceDetail } from "@/content/service-detail-websites-ecommerce";
import type { PublicationState, ServiceSlug } from "@/types/content";

export type ServiceRecord = {
  id: string;
  slug: ServiceSlug;
  routeId: RouteId;
  title: string;
  /** Overview / summary approval — separate from detail.publicationState. */
  publicationState: PublicationState;
  /** Short summary / overview outcome; draft wording is not a capacity promise. */
  summary: string;
  deliverables: string[];
  relatedProjectIds: string[];
  whoItSuits: string;
  problemsAddressed: string;
  exampleNotes: string;
  deliverySteps: string;
  clientInputs: string;
  scopeBoundaries: string;
  /**
   * Long-form detail page copy. Null until a detail draft exists.
   * Public detail routes require detail.publicationState === "approved"
   * and the matching route implemented flag.
   */
  detail: ServiceDetailRecord | null;
};

/**
 * Exactly six service groups. All start as draft until founders approve copy
 * and confirm delivery capacity (see decision register D-009).
 * Overview rows use summary, whoItSuits, and deliverables when approved.
 * Detail pages are filled in Steps 31–36; unset details stay null until drafted.
 */
export const serviceRecords = [
  {
    id: "svc-websites-ecommerce",
    slug: "websites-ecommerce",
    routeId: "websitesEcommerce",
    title: "Websites and E-commerce",
    publicationState: "draft",
    summary:
      "Help visitors understand your business and take the next step — enquiry, catalogue browse, or online order.",
    deliverables: [
      "Business website or online catalogue structure",
      "Clear contact or ordering paths",
      "Content and handover notes for updates",
    ],
    relatedProjectIds: [],
    whoItSuits:
      "Owners who need a clearer online presence or a practical way for customers to enquire or order.",
    problemsAddressed:
      "Unclear offers, hard-to-use sites, and informal order messages that are difficult to track.",
    exampleNotes:
      "Illustrative website vs catalogue comparison only — not a live store or portfolio proof.",
    deliverySteps:
      "Agree scope, review structure, build key journeys, then test, launch, and hand over.",
    clientInputs:
      "Brand assets, approved content, content owner, domain/hosting ownership, and ordering rules when relevant.",
    scopeBoundaries:
      "CMS, product entry, payments, accounts, and delivery integrations depend on the proposal.",
    detail: websitesEcommerceDetail,
  },
  {
    id: "svc-web-mobile-apps",
    slug: "web-mobile-apps",
    routeId: "webMobileApps",
    title: "Web and Mobile Applications",
    publicationState: "draft",
    summary:
      "Help customers or staff complete a focused digital task in a first usable application.",
    deliverables: [
      "Scoped first version of a web or mobile application",
      "Core user journeys for the agreed roles",
      "Handover for testing and next releases",
    ],
    relatedProjectIds: [],
    whoItSuits:
      "Teams with a clear task to digitise — booking, requests, field updates, or similar focused work.",
    problemsAddressed:
      "Repeated tasks stuck in messages and spreadsheets, or a brochure site that cannot support the real workflow.",
    exampleNotes:
      "Illustrative browser vs phone booking/request sample — not a live app or portfolio proof.",
    deliverySteps:
      "Clarify journeys, prototype, build reviewed increments, validate, then release and hand over.",
    clientInputs:
      "Target users, task examples, roles, sample non-sensitive data, integration notes, and a feedback owner.",
    scopeBoundaries:
      "Auth, notifications, offline, payments, and APIs are scoped — not a default bundle. Store approval is not guaranteed.",
    detail: webMobileAppsDetail,
  },
  {
    id: "svc-business-systems",
    slug: "business-systems",
    routeId: "businessSystems",
    title: "Business Systems",
    publicationState: "draft",
    summary:
      "Organise sales, stock, reporting, and internal workflows in one clearer place for daily operations.",
    deliverables: [
      "Operational workflow for sales, stock, or internal records",
      "Roles and permissions suited to your team",
      "Reporting views agreed in scope",
    ],
    relatedProjectIds: [],
    whoItSuits:
      "Businesses replacing scattered notes and spreadsheets for day-to-day operations.",
    problemsAddressed: "",
    exampleNotes: "",
    deliverySteps: "",
    clientInputs: "",
    scopeBoundaries: "",
    detail: null,
  },
  {
    id: "svc-ai-automation",
    slug: "ai-automation",
    routeId: "aiAutomation",
    title: "AI and Automation",
    publicationState: "draft",
    summary:
      "Reduce repetitive copying and routine steps with rules, AI assistance, and human review where it matters.",
    deliverables: [
      "Mapped routine workflow with review checkpoints",
      "Automation or extraction draft suited to the task",
      "Clear limits on what stays human-checked",
    ],
    relatedProjectIds: [],
    whoItSuits:
      "Teams spending too much time moving the same information between tools or documents.",
    problemsAddressed: "",
    exampleNotes: "",
    deliverySteps: "",
    clientInputs: "",
    scopeBoundaries: "",
    detail: null,
  },
  {
    id: "svc-custom-software",
    slug: "custom-software",
    routeId: "customSoftware",
    title: "Custom Software",
    publicationState: "draft",
    summary:
      "Address requirements and integrations that need a tailored solution when standard tools are not enough.",
    deliverables: [
      "Software shaped around your specific process",
      "Agreed integrations with existing systems where in scope",
      "Documentation and access for ongoing ownership",
    ],
    relatedProjectIds: [],
    whoItSuits:
      "Organisations with unusual rules, integrations, or workflows that off-the-shelf tools do not cover well.",
    problemsAddressed: "",
    exampleNotes: "",
    deliverySteps: "",
    clientInputs: "",
    scopeBoundaries: "",
    detail: null,
  },
  {
    id: "svc-ui-ux-design",
    slug: "ui-ux-design",
    routeId: "uiUxDesign",
    title: "UI/UX Design",
    publicationState: "draft",
    summary:
      "Clarify user journeys and design usable interfaces — as a design engagement with or without development.",
    deliverables: [
      "Journey maps or flow outlines for key tasks",
      "Interface designs for agreed screens",
      "Handover notes for build or further design",
    ],
    relatedProjectIds: [],
    whoItSuits:
      "Teams that need clearer journeys and interfaces before or alongside a build.",
    problemsAddressed: "",
    exampleNotes: "",
    deliverySteps: "",
    clientInputs: "",
    scopeBoundaries: "",
    detail: null,
  },
] as const satisfies readonly ServiceRecord[];
