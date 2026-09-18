import "server-only";

import { publicRoutes } from "@/config/routes";
import { contentCatalog } from "@/content/catalog";
import type { PublicCta } from "@/content/home";
import type {
  ServiceDetailDeliverableGroup,
  ServiceDetailExample,
  ServiceDetailRecord,
  ServiceDetailScopeOption,
  ServiceDetailStage,
} from "@/content/service-detail";
import type { ServiceRecord } from "@/content/services";
import {
  SERVICE_SLUGS,
  type ServiceSlug,
  type WorkStatus,
} from "@/types/content";
import { resolveServicesEnquiryCta } from "@/server/services";

const WORK_STATUS_LABELS: Record<WorkStatus, string> = {
  "client-work": "Client work",
  "live-product": "Live product",
  prototype: "Prototype",
  "research-concept": "Research concept",
};

export type PublicServiceDetailFaq = {
  id: string;
  question: string;
  answer: string;
};

export type PublicServiceDetailWork = {
  id: string;
  title: string;
  workStatusLabel: string;
  href: string | null;
};

export type PublicServiceDetailRelated = {
  id: string;
  title: string;
  summary: string;
  href: string | null;
};

export type PublicServiceDetail = {
  id: string;
  slug: ServiceSlug;
  serviceTitle: string;
  heroTitle: string;
  introduction: string;
  audienceItems: readonly { id: string; text: string }[];
  problemItems: readonly { id: string; text: string }[];
  scopeOptions: readonly ServiceDetailScopeOption[];
  deliverableGroups: readonly ServiceDetailDeliverableGroup[];
  illustrativeExample: ServiceDetailExample | null;
  deliveryStages: readonly ServiceDetailStage[];
  clientInputs: readonly string[];
  boundaries: readonly string[];
  recurringCostNotes: readonly string[];
  faqs: readonly PublicServiceDetailFaq[];
  relatedWork: readonly PublicServiceDetailWork[];
  relatedServices: readonly PublicServiceDetailRelated[];
  enquiryAction: PublicCta | null;
  pageTitle: string;
  pageDescription: string;
  /** Section ids that actually render — for optional contents nav */
  sectionIds: readonly string[];
};

function isServiceSlug(value: string): value is ServiceSlug {
  return (SERVICE_SLUGS as readonly string[]).includes(value);
}

/**
 * Public-ready detail eligibility: summary approved, detail approved,
 * and the detail route marked implemented. Used by page, metadata, and
 * generateStaticParams together.
 */
export function isPublicServiceDetailEligible(service: ServiceRecord): boolean {
  if (service.publicationState !== "approved") {
    return false;
  }
  if (!service.detail || service.detail.publicationState !== "approved") {
    return false;
  }
  if (!publicRoutes[service.routeId].implemented) {
    return false;
  }
  return hasRequiredDetailFields(service.detail);
}

function hasRequiredDetailFields(detail: ServiceDetailRecord): boolean {
  if (
    !detail.heroTitle.trim() ||
    !detail.introduction.trim() ||
    !detail.primaryCtaLabel.trim() ||
    !detail.pageTitle.trim() ||
    !detail.pageDescription.trim()
  ) {
    return false;
  }
  if (detail.audienceItems.length === 0) {
    return false;
  }
  if (detail.deliverableGroups.length === 0) {
    return false;
  }
  if (detail.clientInputs.length === 0) {
    return false;
  }
  if (detail.boundaries.length === 0) {
    return false;
  }
  return true;
}

function projectDetail(
  service: ServiceRecord,
  detail: ServiceDetailRecord,
  options?: { enquiryAction?: PublicCta | null },
): PublicServiceDetail {
  const faqs = detail.faqIds.flatMap((faqId) => {
    const faq = contentCatalog.faqs.find((row) => row.id === faqId);
    if (!faq || faq.publicationState !== "approved") {
      return [];
    }
    return [
      {
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
      },
    ];
  });

  const relatedWork = detail.relatedProjectIds.flatMap((projectId) => {
    const project = contentCatalog.projects.find((row) => row.id === projectId);
    if (!project || project.publicationState !== "approved") {
      return [];
    }
    return [
      {
        id: project.id,
        title: project.title,
        workStatusLabel: WORK_STATUS_LABELS[project.workStatus],
        href: publicRoutes.work.implemented ? `/work/${project.slug}` : null,
      },
    ];
  });

  const relatedServices = detail.relatedServiceIds.flatMap((serviceId) => {
    const related = contentCatalog.services.find((row) => row.id === serviceId);
    if (!related || related.publicationState !== "approved") {
      return [];
    }
    const route = publicRoutes[related.routeId];
    const href =
      isPublicServiceDetailEligible(related) && route.implemented
        ? route.path
        : null;
    return [
      {
        id: related.id,
        title: related.title,
        summary: related.summary,
        href,
      },
    ];
  });

  const enquiryAction =
    options && "enquiryAction" in options
      ? (options.enquiryAction ?? null)
      : resolveServicesEnquiryCta({
          serviceSlug: service.slug,
          label: detail.primaryCtaLabel,
        });

  const sectionIds: string[] = ["hero"];
  if (detail.audienceItems.length > 0 || detail.problemItems.length > 0) {
    sectionIds.push("who-it-suits");
  }
  if (detail.scopeOptions.length > 0) {
    sectionIds.push("scope-options");
  }
  if (detail.deliverableGroups.length > 0) {
    sectionIds.push("deliverables");
  }
  if (detail.illustrativeExample) {
    sectionIds.push("example");
  }
  if (relatedWork.length > 0) {
    sectionIds.push("related-work");
  }
  if (detail.deliveryStages.length > 0) {
    sectionIds.push("delivery");
  }
  if (detail.clientInputs.length > 0) {
    sectionIds.push("inputs");
  }
  if (detail.boundaries.length > 0 || detail.recurringCostNotes.length > 0) {
    sectionIds.push("boundaries");
  }
  if (faqs.length > 0) {
    sectionIds.push("faqs");
  }
  if (relatedServices.length > 0) {
    sectionIds.push("related-services");
  }
  if (enquiryAction) {
    sectionIds.push("enquire");
  }

  return {
    id: service.id,
    slug: service.slug,
    serviceTitle: service.title,
    heroTitle: detail.heroTitle,
    introduction: detail.introduction,
    audienceItems: detail.audienceItems,
    problemItems: detail.problemItems,
    scopeOptions: detail.scopeOptions,
    deliverableGroups: detail.deliverableGroups,
    illustrativeExample: detail.illustrativeExample,
    deliveryStages: detail.deliveryStages,
    clientInputs: detail.clientInputs,
    boundaries: detail.boundaries,
    recurringCostNotes: detail.recurringCostNotes,
    faqs,
    relatedWork,
    relatedServices,
    enquiryAction,
    pageTitle: detail.pageTitle,
    pageDescription: detail.pageDescription,
    sectionIds,
  };
}

/** Slugs eligible for public static generation and linking. */
export function getEligibleServiceDetailSlugs(): readonly ServiceSlug[] {
  return contentCatalog.services
    .filter(isPublicServiceDetailEligible)
    .map((service) => service.slug);
}

/**
 * Public detail projection for a canonical slug, or null when unavailable.
 * Does not fall back to another service or draft copy.
 */
export function getPublicServiceDetail(
  slug: string,
): PublicServiceDetail | null {
  if (!isServiceSlug(slug)) {
    return null;
  }

  const service = contentCatalog.services.find((row) => row.slug === slug);
  if (!service || !service.detail) {
    return null;
  }
  if (!isPublicServiceDetailEligible(service)) {
    return null;
  }

  return projectDetail(service, service.detail);
}

function specimenBaseDetail(): ServiceDetailRecord {
  return {
    publicationState: "draft",
    heroTitle: "A clear service outcome for your business",
    introduction:
      "Specimen introduction explaining who this service helps and what a practical next step looks like. Gallery only — not a published Zatroz service page.",
    primaryCtaLabel: "Discuss this service",
    audienceItems: [
      {
        id: "aud-1",
        text: "A business that needs a focused digital improvement, not a vague transformation slogan.",
      },
      {
        id: "aud-2",
        text: "A team that can name the task customers or staff struggle with today.",
      },
    ],
    problemItems: [
      {
        id: "prob-1",
        text: "Information is scattered and the next step for customers is unclear.",
      },
    ],
    scopeOptions: [
      {
        id: "scope-simple",
        title: "Focused first version",
        purpose: "Solve one clear task well before expanding.",
        examples: ["Core journey", "Essential roles", "Review checkpoints"],
        notIncluded:
          "Every optional integration, unlimited revisions, or ongoing free support.",
      },
      {
        id: "scope-extended",
        title: "Extended scope",
        purpose: "Add journeys or integrations only when justified.",
        examples: ["Extra roles", "Selected integrations", "Reporting views"],
        notIncluded:
          "Open-ended feature lists without an agreed proposal boundary.",
      },
    ],
    deliverableGroups: [
      {
        id: "del-structure",
        title: "Structure and journeys",
        items: [
          "Agreed page or flow structure",
          "Key user tasks documented",
          "Reviewable working increments",
        ],
      },
      {
        id: "del-handover",
        title: "Handover",
        items: [
          "Access notes for agreed accounts",
          "Short instructions for ongoing updates",
        ],
      },
    ],
    illustrativeExample: {
      id: "ex-1",
      label: "Illustrative example",
      title: "Specimen workflow comparison",
      description:
        "Labelled gallery illustration only — not a screenshot of a shipped client system.",
      points: [
        "Before: repeated manual copying",
        "After: a reviewed draft ready for a person to check",
      ],
    },
    relatedProjectIds: [],
    deliveryStages: [
      {
        id: "stage-1",
        title: "Clarify the need",
        description: "Agree audience, constraints, and an honest first scope.",
      },
      {
        id: "stage-2",
        title: "Build and review",
        description: "Show working progress while change is still affordable.",
      },
      {
        id: "stage-3",
        title: "Hand over",
        description: "Leave access, documentation, and next actions explicit.",
      },
    ],
    clientInputs: [
      "Business facts and who owns content decisions",
      "Brand assets with permission to use them",
      "Examples of the task to improve",
    ],
    boundaries: [
      "Features and third-party costs are agreed per proposal",
      "Hosting, domains, and paid APIs are usually separate unless stated",
    ],
    recurringCostNotes: [
      "Domain and hosting renewals continue after launch when you use those services",
      "Maintenance and support are scoped explicitly — not assumed unlimited",
    ],
    faqIds: [],
    relatedServiceIds: [],
    pageTitle: "Specimen service — Zatroz",
    pageDescription:
      "Gallery specimen for the service detail template. Not a public service page.",
  };
}

/**
 * Gallery fixtures for the service detail template.
 * Never used as public `/services/[slug]` content.
 */
export function getServiceDetailSpecimen(
  variant: "complete" | "minimal" | "long-copy" | "no-cta" | "missing-optional",
): PublicServiceDetail {
  const service = contentCatalog.services[0]!;
  let detail = specimenBaseDetail();

  if (variant === "minimal") {
    detail = {
      ...detail,
      problemItems: [],
      scopeOptions: [],
      illustrativeExample: null,
      deliveryStages: [],
      recurringCostNotes: [],
      faqIds: [],
      relatedServiceIds: [],
      relatedProjectIds: [],
      heroTitle: "Minimal specimen service",
      pageTitle: "Minimal specimen — Zatroz",
    };
  }

  if (variant === "long-copy") {
    detail = {
      ...detail,
      heroTitle:
        "An intentionally long specimen hero title to check wrapping on narrow viewports without inventing a real commercial promise",
      introduction: `${detail.introduction} ${detail.introduction}`,
      deliverableGroups: [
        {
          id: "del-long",
          title: "Long deliverable group for layout review",
          items: [
            "A long deliverable line that should wrap cleanly on small screens without clipping or horizontal scroll",
            "Second long item describing documentation, access, and handover expectations without fixed timelines",
            "Third item clarifying that third-party fees stay outside build work unless the proposal says otherwise",
          ],
        },
        ...detail.deliverableGroups,
      ],
      pageTitle: "Long specimen — Zatroz",
    };
  }

  if (variant === "missing-optional") {
    detail = {
      ...detail,
      illustrativeExample: null,
      relatedProjectIds: [],
      faqIds: [],
      relatedServiceIds: [],
      problemItems: [],
      scopeOptions: [],
      heroTitle: "Specimen without optional sections",
      pageTitle: "Optional-sections specimen — Zatroz",
    };
  }

  const projected = projectDetail(service, detail, {
    enquiryAction:
      variant === "no-cta"
        ? null
        : resolveServicesEnquiryCta({
            serviceSlug: service.slug,
            label: detail.primaryCtaLabel,
          }),
  });

  return {
    ...projected,
    heroTitle: `${projected.heroTitle} (specimen)`,
    introduction: `${projected.introduction} Gallery specimen — excluded from public routes.`,
  };
}
