import "server-only";

import { getMailtoHref, getWhatsAppHref, siteContact } from "@/config/brand";
import { publicRoutes } from "@/config/routes";
import { contentCatalog } from "@/content/catalog";
import { siteRecord } from "@/content/site";
import {
  getHeroScenarioById,
  heroScenarios,
  homeHeroRecord,
  type HeroScenario,
  type HomeHeroRecord,
  type PublicCta,
} from "@/content/home";
import type { ServiceSlug } from "@/types/content";

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

function buildComposition(heroApproved: boolean): HomeComposition {
  const sections: Record<HomeSectionId, boolean> = {
    "home-hero": heroApproved,
    "home-evidence": false,
    "selected-work": false,
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

/** Public homepage composition — approved sections only. */
export function getHomeComposition(): HomeComposition {
  const heroApproved = homeHeroRecord.publicationState === "approved";
  return buildComposition(heroApproved);
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
 * Draft-safe gallery projection. Optional CTA overrides support zero/one/two
 * destination review cases. Not for the public homepage.
 */
export function getHomeHeroSpecimen(options?: {
  primaryCta?: PublicCta | null;
  secondaryCta?: PublicCta | null;
}): PublicHomeHero {
  return buildPublicHero(buildComposition(true), options);
}
