import "server-only";

import { getMailtoHref, getWhatsAppHref, siteContact } from "@/config/brand";
import { publicRoutes } from "@/config/routes";
import { contentCatalog } from "@/content/catalog";
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
import type { ProjectRecord } from "@/content/projects";
import type { ServiceSlug, WorkStatus } from "@/types/content";

export type { PublicCta };

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
 */
export function resolveHomeCta(
  intent: HomeHeroRecord["primaryIntent"] | HomeHeroRecord["secondaryIntent"],
  composition: HomeComposition,
): PublicCta | null {
  if (intent === "start-project") {
    if (publicRoutes.contact.implemented) {
      return {
        label: siteRecord.cta.primaryLabel,
        href: publicRoutes.contact.path,
      };
    }

    if (siteContact.email.status === "confirmed") {
      return {
        label: "Email Zatroz",
        href: getMailtoHref(siteContact.email),
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

    return null;
  }

  return null;
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

const WORK_STATUS_LABELS: Record<WorkStatus, string> = {
  "client-work": "Client work",
  "live-product": "Live product",
  prototype: "Prototype",
  "research-concept": "Research concept",
};

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

function resolveProjectFeatureLink(project: ProjectRecord): PublicCta | null {
  if (publicRoutes.work.implemented) {
    return {
      label: "Read project story",
      href: `/work/${project.slug}`,
    };
  }

  for (const link of project.publicLinks) {
    const href = link.href.trim();
    if (!href || /^javascript:/i.test(href)) {
      continue;
    }
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
      return { label: link.label, href };
    }
  }

  return null;
}

function projectToFeature(project: ProjectRecord): PublicProjectFeature {
  return {
    id: project.id,
    title: project.title,
    workStatus: project.workStatus,
    workStatusLabel: WORK_STATUS_LABELS[project.workStatus],
    problem: project.problem,
    contribution: project.zatrozContribution,
    result: resolveProjectResult(project),
    media: resolveProjectMedia(project),
    link: resolveProjectFeatureLink(project),
  };
}

/**
 * Resolve featured IDs to approved projects only, preserving order.
 * Drafts and unknown IDs are skipped (validation should already reject them).
 */
function getApprovedFeaturedProjects(): PublicProjectFeature[] {
  const features: PublicProjectFeature[] = [];

  for (const id of contentCatalog.featuredProjectIds) {
    const project = contentCatalog.projects.find((row) => row.id === id);
    if (!project || project.publicationState !== "approved") {
      continue;
    }
    features.push(projectToFeature(project));
    if (features.length >= 3) {
      break;
    }
  }

  return features;
}

function hasPublicSelectedWork(): boolean {
  return getApprovedFeaturedProjects().length > 0;
}

function buildComposition(options: {
  heroApproved: boolean;
  evidenceRenders: boolean;
  selectedWorkRenders: boolean;
}): HomeComposition {
  const sections: Record<HomeSectionId, boolean> = {
    "home-hero": options.heroApproved,
    "home-evidence": options.evidenceRenders,
    "selected-work": options.selectedWorkRenders,
    "services-explorer": false,
    "automation-example": false,
    "how-we-work": false,
    people: false,
    questions: false,
    "start-a-project": false,
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
export function getHomeComposition(): HomeComposition {
  return buildComposition({
    heroApproved: homeHeroRecord.publicationState === "approved",
    evidenceRenders: hasPublicEvidenceContent(),
    selectedWorkRenders: hasPublicSelectedWork(),
  });
}

/**
 * Approved public hero projection, or null while copy remains draft.
 * Does not silently publish proposed marketing copy.
 */
export function getPublicHomeHero(): PublicHomeHero | null {
  if (homeHeroRecord.publicationState !== "approved") {
    return null;
  }

  return buildPublicHero(getHomeComposition());
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
export function getPublicSelectedWork(): PublicSelectedWork | null {
  const features = getApprovedFeaturedProjects();
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
