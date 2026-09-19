import "server-only";

import {
  getEnquiryMailtoHref,
  getWhatsAppHref,
  siteContact,
} from "@/config/brand";
import { publicRoutes } from "@/config/routes";
import { isPublicServiceDetailEligible } from "@/server/service-detail";
import {
  listPublishedFeaturedProjects,
  listPublishedRelatedProjects,
} from "@/server/public-projects";
import { loadMongoPublicProjectsRepository } from "@/server/projects/public-catalog";
import { contentCatalog } from "@/content/catalog";
import { WORK_STATUS_LABELS, type ProjectRecord } from "@/content/projects";
import type { PublicProjectCard } from "@/lib/public-projects";
import { listPublishedFeaturedProjectCards } from "@/lib/public-projects";
import {
  homeAutomationExampleRecord,
  type PublicAutomationExample,
} from "@/content/automation-example";
import {
  businessNeedRecords,
  homeServiceExplorerRecord,
  type BusinessNeedRecord,
  type PublicBusinessNeed,
  type PublicServiceExplorer,
} from "@/content/business-needs";
import {
  evidenceRecords,
  homeEvidenceIntro,
  type EvidenceKind,
  type EvidenceRecord,
  type EvidenceSubjectType,
} from "@/content/evidence";
import { siteRecord } from "@/content/site";
import {
  getHeroScenarioById,
  heroScenarios,
  homeHeroRecord,
  homeSelectedWorkRecord,
  type HeroScenario,
  type HomeHeroRecord,
  type PublicCta,
} from "@/content/home";
import {
  homeFinalCtaRecord,
  type PublicHomeFinalCta,
} from "@/content/home-final-cta";
import { homeProcessRecord, type PublicHomeProcess } from "@/content/process";
import {
  homePeopleRecord,
  type PublicHomePeople,
  type PublicPerson,
  type WorkingPrinciple,
} from "@/content/people";
import {
  homeQuestionsRecord,
  type PublicFeedback,
  type PublicFaqItem,
  type PublicHomeQuestions,
} from "@/content/home-questions";
import type { FeedbackRecord } from "@/content/feedback";
import type { FounderRecord } from "@/content/founders";
import type { ServiceSlug, WorkStatus } from "@/types/content";

export type {
  PublicCta,
  PublicBusinessNeed,
  PublicServiceExplorer,
  PublicAutomationExample,
  PublicHomeProcess,
  PublicHomePeople,
  PublicHomeQuestions,
  PublicHomeFinalCta,
};

export type PublicHomeHero = Readonly<{
  id: string;
  eyebrow: string;
  headline: string;
  supporting: string;
  workflowCaption: string;
  scenarios: readonly HeroScenario[];
  defaultScenarioId: string;
  scenario: HeroScenario;
  /** Pre-resolved optional service links keyed by scenario id */
  scenarioServiceLinks: Readonly<Record<string, PublicCta | null>>;
  primaryCta: PublicCta | null;
  secondaryCta: PublicCta | null;
}>;

export type PublicEvidenceItem = Readonly<{
  id: string;
  claim: string;
  kind: EvidenceKind;
  subjectType: EvidenceSubjectType;
  subjectLabel: string;
  supportingLabel: string;
  link: PublicCta | null;
}>;

export type PublicHomeEvidence = Readonly<{
  id: "home-evidence";
  heading: string;
  intro: string | null;
  items: readonly PublicEvidenceItem[];
}>;

export type PublicProjectMedia = Readonly<{
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string | null;
}>;

export type PublicProjectFeature = Readonly<{
  id: string;
  title: string;
  workStatus: WorkStatus;
  workStatusLabel: string;
  problem: string;
  contribution: string;
  result: string;
  media: PublicProjectMedia | null;
  link: PublicCta | null;
}>;

export type PublicSelectedWork = Readonly<{
  id: "selected-work";
  heading: string;
  supporting: string;
  features: readonly PublicProjectFeature[];
}>;

export type HomeSectionId =
  | "home-hero"
  | "home-evidence"
  | "selected-work"
  | "services-explorer"
  | "automation-example"
  | "how-we-work"
  | "people"
  | "questions"
  | "start-a-project";

export type HomeComposition = Readonly<{
  sections: Readonly<Record<HomeSectionId, boolean>>;
  /** Anchor targets that actually render on this page */
  anchors: readonly string[];
}>;

/**
 * Shared CTA policy for homepage actions.
 * Never returns an unimplemented internal route.
 * Prefers #start-a-project when the final invitation renders with a real action.
 */
export function resolveHomeCta(
  intent: HomeHeroRecord["primaryIntent"] | HomeHeroRecord["secondaryIntent"],
  composition: HomeComposition,
): PublicCta | null {
  if (intent === "start-project") {
    return resolveEnquiryFallback(composition, {
      label: siteRecord.cta.primaryLabel,
    });
  }

  if (intent === "explore-work") {
    if (publicRoutes.work.implemented) {
      return {
        label: siteRecord.cta.secondaryWorkLabel,
        href: publicRoutes.work.path,
      };
    }

    if (composition.sections["selected-work"]) {
      return {
        label: siteRecord.cta.secondaryWorkLabel,
        href: "#selected-work",
      };
    }

    if (composition.sections["how-we-work"]) {
      return {
        label: "See how we work",
        href: "#how-we-work",
      };
    }

    return null;
  }

  return null;
}

/**
 * Contact / enquiry fallback shared by homepage sections.
 * Never self-links to #start-a-project from the final invitation itself.
 */
function resolveEnquiryFallback(
  composition: HomeComposition,
  options?: { label?: string; contactQuery?: string },
): PublicCta | null {
  const label = options?.label ?? siteRecord.cta.primaryLabel;

  if (composition.sections["start-a-project"]) {
    return {
      label,
      href: "#start-a-project",
    };
  }

  if (publicRoutes.contact.implemented) {
    const href = options?.contactQuery
      ? `${publicRoutes.contact.path}?${options.contactQuery}`
      : publicRoutes.contact.path;
    return { label, href };
  }

  if (siteContact.email.status === "confirmed") {
    return {
      label: options?.label ?? "Email Zatroz",
      href: getEnquiryMailtoHref(siteContact.email),
    };
  }

  if (siteContact.whatsapp.status === "confirmed") {
    return {
      label: options?.label ?? siteRecord.cta.secondaryWhatsAppLabel,
      href: getWhatsAppHref(siteContact.whatsapp),
    };
  }

  return null;
}

/** Primary action for the final invitation — never #start-a-project. */
function resolveFinalCtaPrimaryAction(): PublicCta | null {
  if (publicRoutes.contact.implemented) {
    return {
      label: siteRecord.cta.primaryLabel,
      href: publicRoutes.contact.path,
    };
  }

  if (siteContact.email.status === "confirmed") {
    return {
      label: "Email Zatroz",
      href: getEnquiryMailtoHref(siteContact.email),
    };
  }

  if (siteContact.whatsapp.status === "confirmed") {
    return {
      label: siteRecord.cta.secondaryWhatsAppLabel,
      href: getWhatsAppHref(siteContact.whatsapp),
    };
  }

  return null;
}

function resolveFinalCtaAlternatives(
  composition: HomeComposition,
  primary: PublicCta,
): PublicCta[] {
  const alternatives: PublicCta[] = [];

  if (publicRoutes.work.implemented) {
    alternatives.push({
      label: siteRecord.cta.secondaryWorkLabel,
      href: publicRoutes.work.path,
    });
  } else if (composition.sections["selected-work"]) {
    alternatives.push({
      label: siteRecord.cta.secondaryWorkLabel,
      href: "#selected-work",
    });
  }

  const primaryIsWhatsApp = primary.href.startsWith("https://wa.me/");
  const primaryIsMailto = primary.href.startsWith("mailto:");

  if (
    !primaryIsWhatsApp &&
    siteContact.whatsapp.status === "confirmed" &&
    alternatives.length < 2
  ) {
    alternatives.push({
      label: siteRecord.cta.secondaryWhatsAppLabel,
      href: getWhatsAppHref(siteContact.whatsapp),
    });
  }

  if (
    primaryIsWhatsApp &&
    !primaryIsMailto &&
    siteContact.email.status === "confirmed" &&
    alternatives.length < 2
  ) {
    alternatives.push({
      label: "Email Zatroz",
      href: getEnquiryMailtoHref(siteContact.email),
    });
  }

  return alternatives.slice(0, 2);
}

function hasPublicFinalCta(): boolean {
  if (homeFinalCtaRecord.publicationState !== "approved") {
    return false;
  }

  return resolveFinalCtaPrimaryAction() !== null;
}

function resolveScenarioServiceLink(
  slug: ServiceSlug | null,
): PublicCta | null {
  if (!slug) {
    return null;
  }

  const service = contentCatalog.services.find((row) => row.slug === slug);
  if (!service) {
    return null;
  }

  const route = publicRoutes[service.routeId];
  if (!route.implemented) {
    return null;
  }

  return {
    label: `About ${service.title}`,
    href: route.path,
  };
}

function buildScenarioServiceLinks(
  scenarios: readonly HeroScenario[],
): Record<string, PublicCta | null> {
  const links: Record<string, PublicCta | null> = {};
  for (const scenario of scenarios) {
    links[scenario.id] = resolveScenarioServiceLink(
      scenario.relatedServiceSlug,
    );
  }
  return links;
}

function isHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

function isInternalPath(value: string): boolean {
  return value.startsWith("/") && !value.startsWith("//");
}

/**
 * Resolve an evidence destination. Omit unsafe schemes and unimplemented
 * internal routes. Never invent a URL.
 */
function resolveEvidenceHref(href: string | null): string | null {
  if (!href) {
    return null;
  }

  const trimmed = href.trim();
  if (!trimmed || /^javascript:/i.test(trimmed)) {
    return null;
  }

  if (isHttpsUrl(trimmed)) {
    return trimmed;
  }

  if (!isInternalPath(trimmed)) {
    return null;
  }

  const routes = Object.values(publicRoutes);
  const exact = routes.find((route) => route.path === trimmed);
  if (exact) {
    return exact.implemented ? exact.path : null;
  }

  const nested = routes
    .filter(
      (route) => route.path !== "/" && trimmed.startsWith(`${route.path}/`),
    )
    .sort((a, b) => b.path.length - a.path.length)[0];

  if (nested && !nested.implemented) {
    return null;
  }

  return trimmed;
}

function projectEvidenceItem(record: EvidenceRecord): PublicEvidenceItem {
  const href = resolveEvidenceHref(record.href);
  const link =
    href && record.linkLabel ? { label: record.linkLabel, href } : null;

  return {
    id: record.id,
    claim: record.claim,
    kind: record.kind,
    subjectType: record.subject.type,
    subjectLabel: record.subject.label,
    supportingLabel: record.supportingLabel,
    link,
  };
}

function getApprovedEvidenceItems(): PublicEvidenceItem[] {
  return evidenceRecords
    .filter((row) => row.publicationState === "approved")
    .slice(0, 3)
    .map(projectEvidenceItem);
}

function hasPublicEvidenceContent(): boolean {
  if (getApprovedEvidenceItems().length > 0) {
    return true;
  }

  return homeEvidenceIntro.publicationState === "approved";
}

function resolveProjectResult(project: ProjectRecord): string {
  const outcome = project.verifiedOutcomes.find((row) => row.trim());
  if (outcome) {
    return outcome;
  }

  if (project.zatrozContribution.trim()) {
    return project.zatrozContribution;
  }

  return project.approach;
}

function resolveProjectMedia(
  project: ProjectRecord,
): PublicProjectMedia | null {
  for (const mediaId of project.mediaIds) {
    const media = contentCatalog.media.find((row) => row.id === mediaId);
    if (!media || media.publicationState !== "approved") {
      continue;
    }
    if (media.width == null || media.height == null) {
      continue;
    }
    if (!media.publicPath.trim()) {
      continue;
    }

    const alt =
      media.alt.decorative === true
        ? ""
        : media.alt.alt.trim() || project.title;

    return {
      src: media.publicPath,
      width: media.width,
      height: media.height,
      alt,
      caption: media.caption,
    };
  }

  return null;
}

function resolveProjectFeatureLink(
  project: ProjectRecord,
  card: PublicProjectCard,
): PublicCta | null {
  if (card.storyLinkEligible) {
    return {
      label: "Read case study",
      href: card.storyPath,
    };
  }

  for (const link of card.links) {
    const href = link.href.trim();
    if (isHttpsUrl(href)) {
      return { label: link.label, href };
    }
    if (isInternalPath(href)) {
      const exact = Object.values(publicRoutes).find(
        (route) => route.path === href,
      );
      if (exact && !exact.implemented) {
        continue;
      }
      // Do not treat the Work listing or a story path as a case-study link.
      if (href === publicRoutes.work.path || href === card.storyPath) {
        continue;
      }
      return { label: link.label, href };
    }
  }

  // Prefer browsing the Work listing when it is live and no demo link exists.
  if (publicRoutes.work.implemented) {
    return {
      label: siteRecord.cta.secondaryWorkLabel,
      href: publicRoutes.work.path,
    };
  }

  void project;
  return null;
}

function projectToFeature(
  project: ProjectRecord,
  card: PublicProjectCard,
): PublicProjectFeature {
  return {
    id: project.id,
    title: project.title,
    workStatus: project.workStatus,
    workStatusLabel: WORK_STATUS_LABELS[project.workStatus],
    problem: project.problem,
    contribution: project.zatrozContribution,
    result: resolveProjectResult(project),
    media: resolveProjectMedia(project),
    link: resolveProjectFeatureLink(project, card),
  };
}

/**
 * Resolve featured IDs through the Mongo public project selector.
 * Drafts and unknown IDs are skipped.
 */
async function getApprovedFeaturedProjects(): Promise<PublicProjectFeature[]> {
  const repo = await loadMongoPublicProjectsRepository();
  const cards = listPublishedFeaturedProjectCards(repo, 3);
  const features: PublicProjectFeature[] = [];

  for (const card of cards) {
    const project = repo.projects.find((row) => row.id === card.id);
    if (!project) {
      continue;
    }
    features.push(projectToFeature(project, card));
  }

  return features;
}

async function hasPublicSelectedWork(): Promise<boolean> {
  const featured = await listPublishedFeaturedProjects(3);
  return featured.length > 0;
}

function resolveNeedAction(
  need: BusinessNeedRecord,
  composition: HomeComposition,
): PublicCta | null {
  const primary = contentCatalog.services.find(
    (service) => service.id === need.primaryServiceId,
  );

  if (primary) {
    const route = publicRoutes[primary.routeId];
    if (route.implemented) {
      return {
        label: `Explore ${primary.title}`,
        href: route.path,
      };
    }
  }

  return resolveEnquiryFallback(composition, {
    label: siteRecord.cta.primaryLabel,
    contactQuery: primary ? `service=${primary.slug}` : undefined,
  });
}

async function projectNeed(
  need: BusinessNeedRecord,
  number: number,
  options?: {
    includeDraftServices?: boolean;
    composition?: HomeComposition;
  },
): Promise<PublicBusinessNeed> {
  const includeDraft = options?.includeDraftServices ?? false;
  const composition =
    options?.composition ??
    buildComposition({
      heroApproved: false,
      evidenceRenders: false,
      selectedWorkRenders: false,
      servicesExplorerRenders: false,
      automationExampleRenders: false,
      processRenders: false,
      peopleRenders: false,
      questionsRenders: false,
      finalCtaRenders: false,
    });

  const services = need.serviceIds.flatMap((serviceId) => {
    const service = contentCatalog.services.find((row) => row.id === serviceId);
    if (!service) {
      return [];
    }
    if (!includeDraft && service.publicationState !== "approved") {
      return [];
    }

    const route = publicRoutes[service.routeId];
    const href = isPublicServiceDetailEligible(service) ? route.path : null;

    return [
      {
        id: service.id,
        title: service.title,
        summary: service.summary,
        href,
      },
    ];
  });

  const relatedWork = (
    await listPublishedRelatedProjects(need.relatedProjectIds)
  ).map((card) => ({
    id: card.id,
    title: card.title,
    workStatusLabel: card.workStatusLabel,
    href: card.storyLinkEligible
      ? card.storyPath
      : (card.links.find((link) => /^https:\/\//i.test(link.href))?.href ??
        null),
  }));

  return {
    id: need.id,
    number,
    title: need.title,
    explanation: need.explanation,
    deliverable: need.deliverable,
    services,
    relatedWork,
    action: resolveNeedAction(need, composition),
  };
}

async function buildServiceExplorer(
  needs: readonly BusinessNeedRecord[],
  options?: {
    includeDraftServices?: boolean;
    heading?: string;
    supporting?: string;
    defaultNeedId?: string;
    longDeliverable?: boolean;
    composition?: HomeComposition;
  },
): Promise<PublicServiceExplorer> {
  const projected = await Promise.all(
    needs.map(async (need, index) => {
      const base = await projectNeed(need, index + 1, {
        includeDraftServices: options?.includeDraftServices,
        composition: options?.composition,
      });
      if (options?.longDeliverable && index === 0) {
        return {
          ...base,
          deliverable:
            "A clear business website or online catalogue that explains what you sell, how customers can contact you, and the next step they should take — written long here only to check wrapping on narrow viewports.",
        };
      }
      return base;
    }),
  );

  const defaultNeedId =
    options?.defaultNeedId ??
    (projected.some(
      (need) => need.id === homeServiceExplorerRecord.defaultNeedId,
    )
      ? homeServiceExplorerRecord.defaultNeedId
      : projected[0]!.id);

  return {
    id: "services-explorer",
    heading: options?.heading ?? homeServiceExplorerRecord.heading,
    supporting: options?.supporting ?? homeServiceExplorerRecord.supporting,
    defaultNeedId,
    needs: projected,
  };
}

function getApprovedBusinessNeeds(): BusinessNeedRecord[] {
  return businessNeedRecords.filter(
    (need) => need.publicationState === "approved",
  );
}

function hasPublicServiceExplorer(): boolean {
  return (
    homeServiceExplorerRecord.publicationState === "approved" &&
    getApprovedBusinessNeeds().length > 0
  );
}

function hasPublicAutomationExample(): boolean {
  return homeAutomationExampleRecord.publicationState === "approved";
}

function hasPublicHomeProcess(): boolean {
  return homeProcessRecord.publicationState === "approved";
}

function hasPublicHomePeople(): boolean {
  return homePeopleRecord.publicationState === "approved";
}

function getApprovedFaqs(): PublicFaqItem[] {
  return contentCatalog.faqs
    .filter((faq) => faq.publicationState === "approved")
    .map((faq) => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
    }));
}

function projectFeedback(record: FeedbackRecord): PublicFeedback {
  return {
    id: record.id,
    kind: record.kind,
    quote: record.quote,
    attribution: record.attribution,
    roleOrCompany: record.roleOrCompany,
    relationship: record.relationship,
  };
}

/**
 * One homepage feedback item: prefer an approved testimonial, else an
 * approved project lesson. Never invents quotes.
 */
function getApprovedHomepageFeedback(): PublicFeedback | null {
  const approved = contentCatalog.feedback.filter(
    (item) => item.publicationState === "approved",
  );

  const testimonial = approved.find((item) => item.kind === "testimonial");
  if (testimonial) {
    return projectFeedback(testimonial);
  }

  const lesson = approved.find((item) => item.kind === "project-lesson");
  if (lesson) {
    return projectFeedback(lesson);
  }

  return null;
}

function hasPublicHomeQuestions(): boolean {
  if (homeQuestionsRecord.publicationState !== "approved") {
    return false;
  }

  return getApprovedFaqs().length > 0 || getApprovedHomepageFeedback() !== null;
}

function resolveQuestionsAction(
  composition: HomeComposition,
): PublicCta | null {
  return resolveEnquiryFallback(composition, {
    label: "Ask us about your project",
  });
}

function buildPublicHomeQuestions(
  composition: HomeComposition,
  options?: {
    faqs?: readonly PublicFaqItem[];
    feedback?: PublicFeedback | null;
    action?: PublicCta | null;
    heading?: string;
    supporting?: string;
  },
): PublicHomeQuestions {
  return {
    id: homeQuestionsRecord.id,
    heading: options?.heading ?? homeQuestionsRecord.heading,
    supporting: options?.supporting ?? homeQuestionsRecord.supporting,
    feedback:
      options && "feedback" in options
        ? (options.feedback ?? null)
        : getApprovedHomepageFeedback(),
    faqs: options?.faqs ?? getApprovedFaqs(),
    action:
      options && "action" in options
        ? (options.action ?? null)
        : resolveQuestionsAction(composition),
  };
}

function resolvePeopleAction(composition: HomeComposition): PublicCta | null {
  if (publicRoutes.about.implemented) {
    return {
      label: "Meet Zatroz",
      href: publicRoutes.about.path,
    };
  }

  return resolveEnquiryFallback(composition);
}

function resolveFounderPortrait(
  founder: FounderRecord,
): PublicPerson["portrait"] {
  if (!founder.portraitMediaId) {
    return null;
  }

  const media = contentCatalog.media.find(
    (row) => row.id === founder.portraitMediaId,
  );
  if (!media || media.publicationState !== "approved") {
    return null;
  }
  if (media.width == null || media.height == null || !media.publicPath.trim()) {
    return null;
  }

  const alt =
    media.alt.decorative === true
      ? ""
      : media.alt.alt.trim() || `Portrait of ${founder.displayName}`;

  return {
    src: media.publicPath,
    width: media.width,
    height: media.height,
    alt,
  };
}

function projectFounder(founder: FounderRecord): PublicPerson {
  const links = founder.professionalUrls
    .filter((link) => {
      const href = link.href.trim();
      return href && isHttpsUrl(href) && !/^javascript:/i.test(href);
    })
    .map((link) => ({ label: link.label, href: link.href.trim() }));

  return {
    id: founder.id,
    displayName: founder.displayName,
    role: founder.role,
    bio: founder.bio,
    portrait: resolveFounderPortrait(founder),
    links,
  };
}

function resolveTeamPhoto(): PublicHomePeople["teamPhoto"] {
  const mediaId = homePeopleRecord.teamPhotoMediaId;
  if (!mediaId) {
    return null;
  }

  const media = contentCatalog.media.find((row) => row.id === mediaId);
  if (!media || media.publicationState !== "approved") {
    return null;
  }
  if (media.width == null || media.height == null || !media.publicPath.trim()) {
    return null;
  }

  const alt =
    media.alt.decorative === true ? "" : media.alt.alt.trim() || "Zatroz team";

  return {
    src: media.publicPath,
    width: media.width,
    height: media.height,
    alt,
    caption: media.caption,
  };
}

function buildPublicHomePeople(
  composition: HomeComposition,
  options?: {
    people?: readonly PublicPerson[];
    principles?: readonly WorkingPrinciple[];
    teamPhoto?: PublicHomePeople["teamPhoto"];
    action?: PublicCta | null;
    heading?: string;
    companyIntro?: string;
    communicationNote?: string;
  },
): PublicHomePeople {
  const people =
    options?.people ??
    contentCatalog.founders
      .filter((founder) => founder.publicationState === "approved")
      .map(projectFounder);

  const teamPhoto =
    options && "teamPhoto" in options
      ? (options.teamPhoto ?? null)
      : resolveTeamPhoto();

  let layout: PublicHomePeople["layout"] = "text-led";
  if (teamPhoto) {
    layout = "team-photo";
  } else if (people.length > 0) {
    layout = "profiles";
  }

  return {
    id: homePeopleRecord.id,
    heading: options?.heading ?? homePeopleRecord.heading,
    companyIntro: options?.companyIntro ?? homePeopleRecord.companyIntro,
    communicationNote:
      options?.communicationNote ?? homePeopleRecord.communicationNote,
    principles: options?.principles ?? [...homePeopleRecord.workingPrinciples],
    teamPhoto,
    people,
    action:
      options && "action" in options
        ? (options.action ?? null)
        : resolvePeopleAction(composition),
    layout,
  };
}

function resolveProcessAction(composition: HomeComposition): PublicCta | null {
  if (publicRoutes.process.implemented) {
    return {
      label: "See our process",
      href: publicRoutes.process.path,
    };
  }

  return resolveEnquiryFallback(composition);
}

function buildPublicHomeProcess(
  composition: HomeComposition,
  actionOverride?: PublicCta | null,
): PublicHomeProcess {
  return {
    id: homeProcessRecord.id,
    heading: homeProcessRecord.heading,
    supporting: homeProcessRecord.supporting,
    steps: homeProcessRecord.steps.map((step, index) => ({
      id: step.id,
      number: index + 1,
      title: step.title,
      description: step.description,
      customerOutput: step.customerOutput,
    })),
    action:
      actionOverride !== undefined
        ? actionOverride
        : resolveProcessAction(composition),
  };
}

function resolveAutomationAction(
  composition: HomeComposition,
): PublicCta | null {
  if (publicRoutes.aiAutomation.implemented) {
    return {
      label: "Explore AI and automation",
      href: publicRoutes.aiAutomation.path,
    };
  }

  if (composition.sections["services-explorer"]) {
    return {
      label: "Explore business needs",
      href: "#services-explorer",
    };
  }

  return resolveEnquiryFallback(composition, {
    label: siteRecord.cta.primaryLabel,
    contactQuery: "service=ai-automation",
  });
}

function buildPublicAutomationExample(
  composition: HomeComposition,
  actionOverride?: PublicCta | null,
): PublicAutomationExample {
  return {
    id: homeAutomationExampleRecord.id,
    workflowLabel: homeAutomationExampleRecord.workflowLabel,
    heading: homeAutomationExampleRecord.heading,
    supporting: homeAutomationExampleRecord.supporting,
    stages: [...homeAutomationExampleRecord.stages],
    sampleInvoice: homeAutomationExampleRecord.sampleInvoice,
    completionMessage: homeAutomationExampleRecord.completionMessage,
    action:
      actionOverride !== undefined
        ? actionOverride
        : resolveAutomationAction(composition),
  };
}

function buildComposition(options: {
  heroApproved: boolean;
  evidenceRenders: boolean;
  selectedWorkRenders: boolean;
  servicesExplorerRenders: boolean;
  automationExampleRenders: boolean;
  processRenders: boolean;
  peopleRenders: boolean;
  questionsRenders: boolean;
  finalCtaRenders: boolean;
}): HomeComposition {
  const sections: Record<HomeSectionId, boolean> = {
    "home-hero": options.heroApproved,
    "home-evidence": options.evidenceRenders,
    "selected-work": options.selectedWorkRenders,
    "services-explorer": options.servicesExplorerRenders,
    "automation-example": options.automationExampleRenders,
    "how-we-work": options.processRenders,
    people: options.peopleRenders,
    questions: options.questionsRenders,
    "start-a-project": options.finalCtaRenders,
  };

  const anchors = (Object.entries(sections) as [HomeSectionId, boolean][])
    .filter(([, renders]) => renders)
    .map(([id]) => `#${id}`);

  return { sections, anchors };
}

function buildPublicHero(
  composition: HomeComposition,
  ctaOptions?: {
    primaryCta?: PublicCta | null;
    secondaryCta?: PublicCta | null;
  },
): PublicHomeHero {
  const scenarios = [...heroScenarios];
  const scenario =
    getHeroScenarioById(homeHeroRecord.defaultScenarioId, scenarios) ??
    scenarios[0]!;

  return {
    id: homeHeroRecord.id,
    eyebrow: homeHeroRecord.eyebrow,
    headline: homeHeroRecord.headline,
    supporting: homeHeroRecord.supporting,
    workflowCaption: homeHeroRecord.workflowCaption,
    scenarios,
    defaultScenarioId: scenario.id,
    scenario,
    scenarioServiceLinks: buildScenarioServiceLinks(scenarios),
    primaryCta:
      ctaOptions && "primaryCta" in ctaOptions
        ? (ctaOptions.primaryCta ?? null)
        : resolveHomeCta(homeHeroRecord.primaryIntent, composition),
    secondaryCta:
      ctaOptions && "secondaryCta" in ctaOptions
        ? (ctaOptions.secondaryCta ?? null)
        : resolveHomeCta(homeHeroRecord.secondaryIntent, composition),
  };
}

function buildPublicEvidence(
  items: readonly PublicEvidenceItem[],
  options?: { intro?: string | null; heading?: string },
): PublicHomeEvidence {
  const introApproved = homeEvidenceIntro.publicationState === "approved";

  return {
    id: "home-evidence",
    heading: options?.heading ?? homeEvidenceIntro.heading,
    intro:
      options && "intro" in options
        ? (options.intro ?? null)
        : introApproved
          ? homeEvidenceIntro.text
          : null,
    items,
  };
}

/** Public homepage composition — approved sections only. */
export async function getHomeComposition(): Promise<HomeComposition> {
  return buildComposition({
    heroApproved: homeHeroRecord.publicationState === "approved",
    evidenceRenders: hasPublicEvidenceContent(),
    selectedWorkRenders: await hasPublicSelectedWork(),
    servicesExplorerRenders: hasPublicServiceExplorer(),
    automationExampleRenders: hasPublicAutomationExample(),
    processRenders: hasPublicHomeProcess(),
    peopleRenders: hasPublicHomePeople(),
    questionsRenders: hasPublicHomeQuestions(),
    finalCtaRenders: hasPublicFinalCta(),
  });
}

/**
 * Approved public hero projection, or null while copy remains draft.
 * Does not silently publish proposed marketing copy.
 */
export async function getPublicHomeHero(): Promise<PublicHomeHero | null> {
  if (homeHeroRecord.publicationState !== "approved") {
    return null;
  }

  return buildPublicHero(await getHomeComposition());
}

/**
 * Approved evidence strip, or null when there are no approved items and no
 * approved company introduction. Never fabricates proof.
 */
export function getPublicHomeEvidence(): PublicHomeEvidence | null {
  if (!hasPublicEvidenceContent()) {
    return null;
  }

  return buildPublicEvidence(getApprovedEvidenceItems());
}

/**
 * Approved selected-work section, or null when no featured approved projects.
 * Never invents stories, media paths, or fake “Read story” links.
 */
export async function getPublicSelectedWork(): Promise<PublicSelectedWork | null> {
  const features = await getApprovedFeaturedProjects();
  if (features.length === 0) {
    return null;
  }

  return {
    id: "selected-work",
    heading: homeSelectedWorkRecord.heading,
    supporting: homeSelectedWorkRecord.supporting,
    features,
  };
}

/**
 * Approved service explorer, or null while need copy remains draft.
 * Never invents service titles/paths in the projection — resolves from records.
 */
export async function getPublicServiceExplorer(): Promise<PublicServiceExplorer | null> {
  if (!hasPublicServiceExplorer()) {
    return null;
  }

  return buildServiceExplorer(getApprovedBusinessNeeds(), {
    includeDraftServices: false,
    composition: await getHomeComposition(),
  });
}

/**
 * Approved charcoal automation example, or null while copy remains draft.
 */
export async function getPublicAutomationExample(): Promise<PublicAutomationExample | null> {
  if (!hasPublicAutomationExample()) {
    return null;
  }

  return buildPublicAutomationExample(await getHomeComposition());
}

/**
 * Approved delivery process section, or null while copy remains draft.
 * Does not publish guarantees about timelines, revisions, or free support.
 */
export async function getPublicHomeProcess(): Promise<PublicHomeProcess | null> {
  if (!hasPublicHomeProcess()) {
    return null;
  }

  return buildPublicHomeProcess(await getHomeComposition());
}

/**
 * Approved people / company section, or null while copy remains draft.
 * Never invents founders, portraits, or headcount.
 */
export async function getPublicHomePeople(): Promise<PublicHomePeople | null> {
  if (!hasPublicHomePeople()) {
    return null;
  }

  return buildPublicHomePeople(await getHomeComposition());
}

/**
 * Approved feedback / FAQ section, or null while framing stays draft or
 * there is no approved FAQ/feedback content. Never invents quotes.
 */
export async function getPublicHomeQuestions(): Promise<PublicHomeQuestions | null> {
  if (!hasPublicHomeQuestions()) {
    return null;
  }

  return buildPublicHomeQuestions(await getHomeComposition());
}

/**
 * Approved final enquiry invitation, or null while copy stays draft or no
 * usable contact action exists. Never renders a dead button.
 */
export async function getPublicHomeFinalCta(): Promise<PublicHomeFinalCta | null> {
  if (!hasPublicFinalCta()) {
    return null;
  }

  return buildPublicHomeFinalCta(await getHomeComposition());
}

function buildPublicHomeFinalCta(
  composition: HomeComposition,
  options?: {
    primary?: PublicCta;
    alternatives?: readonly PublicCta[];
    heading?: string;
    supporting?: string;
  },
): PublicHomeFinalCta | null {
  const primary = options?.primary ?? resolveFinalCtaPrimaryAction();
  if (!primary) {
    return null;
  }

  return {
    id: homeFinalCtaRecord.id,
    heading: options?.heading ?? homeFinalCtaRecord.heading,
    supporting: options?.supporting ?? homeFinalCtaRecord.supporting,
    primary,
    alternatives:
      options?.alternatives ??
      resolveFinalCtaAlternatives(composition, primary),
  };
}

/**
 * Draft-safe gallery projection. Optional CTA overrides support zero/one/two
 * destination review cases. Not for the public homepage.
 */
export function getHomeHeroSpecimen(options?: {
  primaryCta?: PublicCta | null;
  secondaryCta?: PublicCta | null;
}): PublicHomeHero {
  return buildPublicHero(
    buildComposition({
      heroApproved: true,
      evidenceRenders: false,
      selectedWorkRenders: false,
      servicesExplorerRenders: false,
      automationExampleRenders: false,
      processRenders: false,
      peopleRenders: false,
      questionsRenders: false,
      finalCtaRenders: false,
    }),
    options,
  );
}

/** Gallery-only fixtures — clearly labelled, never public evidence. */
const GALLERY_EVIDENCE_FIXTURES: readonly PublicEvidenceItem[] = [
  {
    id: "specimen-evidence-1",
    claim:
      "Example claim for layout review only — not a real Zatroz proof item.",
    kind: "project-demo",
    subjectType: "project",
    subjectLabel: "Specimen project",
    supportingLabel: "Gallery fixture · Prototype",
    link: {
      label: "View prototype (specimen)",
      href: "#colour-heading",
    },
  },
  {
    id: "specimen-evidence-2",
    claim: "Second fixture describing an attributed team result for layout.",
    kind: "team-achievement",
    subjectType: "team",
    subjectLabel: "Specimen team",
    supportingLabel: "Gallery fixture · Team result",
    link: {
      label: "View achievement source (specimen)",
      href: "#colour-heading",
    },
  },
  {
    id: "specimen-evidence-3",
    claim: "Third fixture for a case-story style proof row.",
    kind: "case-story",
    subjectType: "company",
    subjectLabel: "Specimen company",
    supportingLabel: "Gallery fixture · Case story",
    link: null,
  },
];

const LONG_CLAIM =
  "This long specimen claim checks wrapping on narrow viewports without inventing a real customer outcome, logo wall, or percentage improvement for Zatroz.";

/**
 * Gallery evidence projection for 0–3 fixture items. Not for public `/`.
 */
export function getHomeEvidenceSpecimen(
  itemCount: 0 | 1 | 2 | 3,
  options?: { longClaim?: boolean },
): PublicHomeEvidence {
  const items = GALLERY_EVIDENCE_FIXTURES.slice(0, itemCount).map(
    (item, index) => {
      if (options?.longClaim && index === 0) {
        return { ...item, claim: LONG_CLAIM, link: null };
      }
      return item;
    },
  );

  return {
    id: "home-evidence",
    heading: "Why continue reading (specimen)",
    intro:
      "Gallery specimen introduction — labelled fixtures only, never published as Zatroz proof.",
    items,
  };
}

/** Gallery-only project fixtures — labelled specimens, never public portfolio. */
const GALLERY_WORK_FIXTURES: readonly PublicProjectFeature[] = [
  {
    id: "specimen-work-1",
    title: "Specimen catalogue workflow",
    workStatus: "prototype",
    workStatusLabel: "Prototype",
    problem:
      "A sample business needed a clearer way to organise product requests before fulfilment.",
    contribution:
      "Built an illustrative request-to-review path for gallery layout review only.",
    result:
      "Honest capability description — no measured outcome claimed for this specimen.",
    media: {
      src: "/images/projects/specimen-ui-frame.svg",
      width: 1600,
      height: 1000,
      alt: "Specimen UI frame illustration for gallery layout",
      caption:
        "Gallery specimen illustration — not a screenshot of a shipped system.",
    },
    link: {
      label: "View prototype (specimen)",
      href: "#colour-heading",
    },
  },
  {
    id: "specimen-work-2",
    title: "Specimen operations board",
    workStatus: "research-concept",
    workStatusLabel: "Research concept",
    problem:
      "Teams reviewing stock notes needed one shared overview without inventing live inventory claims.",
    contribution:
      "Documented a sample shared-record approach for layout and status-label review.",
    result: "Research concept only — not client delivery or a live product.",
    media: null,
    link: {
      label: "View achievement source (specimen)",
      href: "#colour-heading",
    },
  },
  {
    id: "specimen-work-3",
    title: "Specimen invoice draft review",
    workStatus: "client-work",
    workStatusLabel: "Client work",
    problem:
      "Routine invoice intake created repetitive copying before a person could check totals.",
    contribution:
      "Described a human-reviewed extraction draft for gallery composition only.",
    result: "Specimen status label only — not a verified Zatroz client story.",
    media: null,
    link: null,
  },
];

const LONG_WORK_TITLE =
  "Specimen project with an intentionally long title to check wrapping across narrow viewports without inventing a real customer brand";

/**
 * Gallery selected-work projection for 1–3 fixture features. Not for public `/`.
 */
export function getSelectedWorkSpecimen(
  featureCount: 1 | 2 | 3,
  options?: {
    textLedOnly?: boolean;
    longTitle?: boolean;
    unlink?: boolean;
  },
): PublicSelectedWork {
  const features = GALLERY_WORK_FIXTURES.slice(0, featureCount).map(
    (feature, index) => {
      let next = { ...feature };

      if (options?.textLedOnly) {
        next = { ...next, media: null };
      }

      if (options?.longTitle && index === 0) {
        next = { ...next, title: LONG_WORK_TITLE };
      }

      if (options?.unlink) {
        next = { ...next, link: null };
      }

      return next;
    },
  );

  return {
    id: "selected-work",
    heading: "Selected work (specimen)",
    supporting:
      "Gallery fixtures for layout review — not approved Zatroz portfolio evidence.",
    features,
  };
}

/**
 * Gallery service-explorer projection. Includes draft service summaries for
 * layout review — never used as the public homepage projection.
 */
export async function getServiceExplorerSpecimen(options?: {
  longDeliverable?: boolean;
}): Promise<PublicServiceExplorer> {
  return buildServiceExplorer([...businessNeedRecords], {
    includeDraftServices: true,
    heading: `${homeServiceExplorerRecord.heading} (specimen)`,
    supporting:
      "Gallery specimen — draft need copy for layout review. Public / omits this section until approved.",
    longDeliverable: options?.longDeliverable,
  });
}

/**
 * Gallery automation example. Draft copy for layout review — not public `/`.
 */
export function getAutomationExampleSpecimen(options?: {
  action?: PublicCta | null;
}): PublicAutomationExample {
  const composition = buildComposition({
    heroApproved: false,
    evidenceRenders: false,
    selectedWorkRenders: false,
    servicesExplorerRenders: false,
    automationExampleRenders: true,
    processRenders: false,
    peopleRenders: false,
    questionsRenders: false,
    finalCtaRenders: false,
  });

  const example = buildPublicAutomationExample(
    composition,
    options && "action" in options ? options.action : undefined,
  );

  return {
    ...example,
    heading: `${example.heading} (specimen)`,
    supporting: `${example.supporting} Gallery specimen — not published until approved.`,
  };
}

/**
 * Gallery delivery-process projection. Draft copy for layout review.
 */
export function getHomeProcessSpecimen(options?: {
  action?: PublicCta | null;
  longCopy?: boolean;
}): PublicHomeProcess {
  const composition = buildComposition({
    heroApproved: false,
    evidenceRenders: false,
    selectedWorkRenders: false,
    servicesExplorerRenders: false,
    automationExampleRenders: false,
    processRenders: true,
    peopleRenders: false,
    questionsRenders: false,
    finalCtaRenders: false,
  });

  const process = buildPublicHomeProcess(
    composition,
    options && "action" in options ? options.action : undefined,
  );

  if (!options?.longCopy) {
    return {
      ...process,
      heading: `${process.heading} (specimen)`,
      supporting: `${process.supporting} Gallery specimen — not published until approved.`,
    };
  }

  const [first, ...rest] = process.steps;
  return {
    ...process,
    heading: `${process.heading} (specimen)`,
    supporting: `${process.supporting} Gallery specimen — not published until approved.`,
    steps: [
      {
        ...first!,
        title:
          "Discover with an intentionally long title for wrapping checks on narrow viewports",
        description:
          "We learn the business problem, the people involved, constraints, priorities, and practical limits so the first scope stays honest and useful without inventing delivery durations.",
        customerOutput:
          "An agreed initial scope written clearly enough that both sides know what is in and what is out",
      },
      ...rest,
    ],
  };
}

const GALLERY_PERSON_ONE: PublicPerson = {
  id: "specimen-person-1",
  displayName: "Specimen Person",
  role: "Gallery fixture · not a real founder",
  bio: "This labelled specimen is for layout review only. It is not Divejikan or any other Zatroz founder profile.",
  portrait: null,
  links: [],
};

const GALLERY_PERSON_TWO: PublicPerson = {
  id: "specimen-person-2",
  displayName: "Another Specimen",
  role: "Gallery fixture · contribution example",
  bio: "Second labelled fixture to check a multi-profile layout without inventing a real team member.",
  portrait: null,
  links: [
    {
      label: "Example profile (specimen)",
      href: "https://example.com/",
    },
  ],
};

const GALLERY_PERSON_LONG: PublicPerson = {
  id: "specimen-person-long",
  displayName:
    "Specimen Person With An Intentionally Long Display Name For Wrapping",
  role: "Gallery fixture · long-name check",
  bio: "Checks wrapping on narrow viewports without claiming a real identity.",
  portrait: null,
  links: [],
};

/**
 * Gallery people projection. Fixtures are never public founder evidence.
 */
export function getHomePeopleSpecimen(
  variant: "text-led" | "one-profile" | "multiple-profiles" | "long-name",
): PublicHomePeople {
  const composition = buildComposition({
    heroApproved: false,
    evidenceRenders: false,
    selectedWorkRenders: false,
    servicesExplorerRenders: false,
    automationExampleRenders: false,
    processRenders: false,
    peopleRenders: true,
    questionsRenders: false,
    finalCtaRenders: false,
  });

  const base = buildPublicHomePeople(composition, {
    people: [],
    teamPhoto: null,
    action: null,
    heading: `${homePeopleRecord.heading} (specimen)`,
    companyIntro: `${homePeopleRecord.companyIntro} Gallery specimen — not published until approved.`,
    communicationNote: homePeopleRecord.communicationNote,
  });

  if (variant === "text-led") {
    return { ...base, layout: "text-led", people: [] };
  }

  if (variant === "one-profile") {
    return {
      ...base,
      layout: "profiles",
      people: [GALLERY_PERSON_ONE],
    };
  }

  if (variant === "long-name") {
    return {
      ...base,
      layout: "profiles",
      people: [GALLERY_PERSON_LONG],
    };
  }

  return {
    ...base,
    layout: "profiles",
    people: [GALLERY_PERSON_ONE, GALLERY_PERSON_TWO],
  };
}

const GALLERY_FAQ_FIXTURES: readonly PublicFaqItem[] = [
  {
    id: "specimen-faq-1",
    question: "How do I start a specimen enquiry?",
    answer:
      "Gallery fixture answer — share the business need and who will use the result. Not published as a Zatroz FAQ.",
  },
  {
    id: "specimen-faq-2",
    question: "What if I am not sure which service fits?",
    answer:
      "Describe the task first. Labels matter less than the real work. Specimen copy only.",
  },
  {
    id: "specimen-faq-3",
    question: "How does scope affect time and cost?",
    answer:
      "Broader features and integrations change effort. Exact terms stay in a proposal — specimen wording only.",
  },
  {
    id: "specimen-faq-4",
    question: "Who prepares content and assets?",
    answer:
      "Business facts usually come from you; polishing can be agreed in scope. Specimen only.",
  },
  {
    id: "specimen-faq-5",
    question: "How are ownership and access agreed?",
    answer:
      "Access arrangements belong in the proposal. This gallery answer is not a legal term.",
  },
  {
    id: "specimen-faq-6",
    question: "How are hosting and third-party costs handled?",
    answer:
      "Hosting and paid APIs are usually separate unless the proposal says otherwise. Specimen only.",
  },
];

const GALLERY_TESTIMONIAL: PublicFeedback = {
  id: "specimen-testimonial-1",
  kind: "testimonial",
  quote:
    "Example quote for layout review only — not a real customer statement about Zatroz.",
  attribution: "Specimen Reviewer",
  roleOrCompany: "Gallery fixture · not a client",
  relationship: "Labelled specimen relationship — not published evidence.",
};

const GALLERY_LESSON: PublicFeedback = {
  id: "specimen-lesson-1",
  kind: "project-lesson",
  quote:
    "Agree content ownership early so handover does not stall on account access. Gallery lesson fixture only.",
  attribution: null,
  roleOrCompany: null,
  relationship: null,
};

const LONG_FAQ_QUESTION =
  "What happens when the question is intentionally long enough to wrap across several lines on a narrow phone viewport without inventing a real commercial promise?";

const LONG_FAQ_ANSWER =
  "This long specimen answer checks wrapping and natural flow without a fixed max-height. It does not invent prices, turnaround guarantees, unlimited revisions, or free ongoing support for Zatroz customers.";

/**
 * Gallery feedback / FAQ projection. Fixtures are never public evidence.
 */
export function getHomeQuestionsSpecimen(
  variant:
    "faqs-only" | "one-faq" | "with-testimonial" | "with-lesson" | "long-copy",
): PublicHomeQuestions {
  const composition = buildComposition({
    heroApproved: false,
    evidenceRenders: false,
    selectedWorkRenders: false,
    servicesExplorerRenders: false,
    automationExampleRenders: false,
    processRenders: false,
    peopleRenders: false,
    questionsRenders: true,
    finalCtaRenders: false,
  });

  const base = buildPublicHomeQuestions(composition, {
    faqs: GALLERY_FAQ_FIXTURES,
    feedback: null,
    action: null,
    heading: `${homeQuestionsRecord.heading} (specimen)`,
    supporting: `${homeQuestionsRecord.supporting} Gallery specimen — not published until approved.`,
  });

  if (variant === "one-faq") {
    return {
      ...base,
      faqs: GALLERY_FAQ_FIXTURES.slice(0, 1),
    };
  }

  if (variant === "with-testimonial") {
    return {
      ...base,
      feedback: GALLERY_TESTIMONIAL,
      faqs: GALLERY_FAQ_FIXTURES.slice(0, 3),
    };
  }

  if (variant === "with-lesson") {
    return {
      ...base,
      feedback: GALLERY_LESSON,
      faqs: GALLERY_FAQ_FIXTURES.slice(0, 3),
    };
  }

  if (variant === "long-copy") {
    return {
      ...base,
      faqs: [
        {
          id: "specimen-faq-long",
          question: LONG_FAQ_QUESTION,
          answer: LONG_FAQ_ANSWER,
        },
        ...GALLERY_FAQ_FIXTURES.slice(0, 2),
      ],
    };
  }

  return base;
}

/**
 * Gallery final-invitation projection. Fixtures show contact fallbacks —
 * not a claim that Contact or channels are live for the public site.
 */
export function getHomeFinalCtaSpecimen(
  variant: "contact" | "email" | "whatsapp" | "alternatives" | "long-copy",
): PublicHomeFinalCta {
  const composition = buildComposition({
    heroApproved: false,
    evidenceRenders: false,
    selectedWorkRenders: variant === "alternatives",
    servicesExplorerRenders: false,
    automationExampleRenders: false,
    processRenders: false,
    peopleRenders: false,
    questionsRenders: false,
    finalCtaRenders: true,
  });

  const contactPrimary: PublicCta = {
    label: siteRecord.cta.primaryLabel,
    href: "/contact",
  };
  const emailPrimary: PublicCta = {
    label: "Email Zatroz",
    href: getEnquiryMailtoHref(siteContact.email),
  };
  const whatsappPrimary: PublicCta = {
    label: siteRecord.cta.secondaryWhatsAppLabel,
    href: getWhatsAppHref(siteContact.whatsapp),
  };

  if (variant === "email") {
    return buildPublicHomeFinalCta(composition, {
      primary: emailPrimary,
      alternatives: [],
      heading: `${homeFinalCtaRecord.heading} (specimen)`,
      supporting: `${homeFinalCtaRecord.supporting} Gallery specimen — Email fallback only.`,
    })!;
  }

  if (variant === "whatsapp") {
    return buildPublicHomeFinalCta(composition, {
      primary: whatsappPrimary,
      alternatives: [],
      heading: `${homeFinalCtaRecord.heading} (specimen)`,
      supporting: `${homeFinalCtaRecord.supporting} Gallery specimen — WhatsApp fallback only.`,
    })!;
  }

  if (variant === "alternatives") {
    return buildPublicHomeFinalCta(composition, {
      primary: contactPrimary,
      alternatives: [
        {
          label: siteRecord.cta.secondaryWorkLabel,
          href: "#selected-work",
        },
        {
          label: siteRecord.cta.secondaryWhatsAppLabel,
          href: getWhatsAppHref(siteContact.whatsapp),
        },
      ],
      heading: `${homeFinalCtaRecord.heading} (specimen)`,
      supporting: `${homeFinalCtaRecord.supporting} Gallery specimen — primary plus quiet alternatives.`,
    })!;
  }

  if (variant === "long-copy") {
    return buildPublicHomeFinalCta(composition, {
      primary: contactPrimary,
      alternatives: [],
      heading:
        "Tell us what your business needs next with an intentionally long specimen heading for wrapping checks",
      supporting: `${homeFinalCtaRecord.supporting} Gallery specimen — long copy only.`,
    })!;
  }

  return buildPublicHomeFinalCta(composition, {
    primary: contactPrimary,
    alternatives: [],
    heading: `${homeFinalCtaRecord.heading} (specimen)`,
    supporting: `${homeFinalCtaRecord.supporting} Gallery specimen — Contact path. Public / omits until approved framing and a usable action exist.`,
  })!;
}
