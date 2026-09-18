import "server-only";

import { getMailtoHref, getWhatsAppHref, siteContact } from "@/config/brand";
import { publicRoutes } from "@/config/routes";
import { siteRecord } from "@/content/site";
import {
  getHeroScenarioById,
  heroScenarios,
  homeHeroRecord,
  type HeroScenario,
  type HomeHeroRecord,
} from "@/content/home";

export type PublicCta = Readonly<{
  label: string;
  href: string;
}>;

export type PublicHomeHero = Readonly<{
  id: string;
  eyebrow: string;
  headline: string;
  supporting: string;
  workflowCaption: string;
  scenario: HeroScenario;
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

  const scenario =
    getHeroScenarioById(homeHeroRecord.defaultScenarioId) ?? heroScenarios[0];
  const composition = getHomeComposition();

  return {
    id: homeHeroRecord.id,
    eyebrow: homeHeroRecord.eyebrow,
    headline: homeHeroRecord.headline,
    supporting: homeHeroRecord.supporting,
    workflowCaption: homeHeroRecord.workflowCaption,
    scenario,
    primaryCta: resolveHomeCta(homeHeroRecord.primaryIntent, composition),
    secondaryCta: resolveHomeCta(homeHeroRecord.secondaryIntent, composition),
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
  const composition = buildComposition(true);
  const scenario =
    getHeroScenarioById(homeHeroRecord.defaultScenarioId) ?? heroScenarios[0];

  return {
    id: homeHeroRecord.id,
    eyebrow: homeHeroRecord.eyebrow,
    headline: homeHeroRecord.headline,
    supporting: homeHeroRecord.supporting,
    workflowCaption: homeHeroRecord.workflowCaption,
    scenario,
    primaryCta:
      options && "primaryCta" in options
        ? (options.primaryCta ?? null)
        : resolveHomeCta(homeHeroRecord.primaryIntent, composition),
    secondaryCta:
      options && "secondaryCta" in options
        ? (options.secondaryCta ?? null)
        : resolveHomeCta(homeHeroRecord.secondaryIntent, composition),
  };
}
