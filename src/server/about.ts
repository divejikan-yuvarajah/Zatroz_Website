import "server-only";

import { contentCatalog } from "@/content/catalog";
import type { AboutPageRecord, AboutValueRecord } from "@/content/about";
import type { FounderRecord } from "@/content/founders";
import type { PublicCta } from "@/content/home";
import type { PublicPerson } from "@/content/people";
import { publicRoutes } from "@/config/routes";
import {
  listPublishedProjects,
  type PublicProjectCard,
} from "@/server/public-projects";
import { resolveServicesEnquiryCta } from "@/server/services";

export type PublicAboutStatement = Readonly<{
  text: string;
}>;

export type PublicAboutValue = Readonly<{
  id: string;
  title: string;
  behaviour: string;
}>;

export type PublicAboutPage = Readonly<{
  id: "about";
  heroTitle: string;
  introduction: string;
  companyStory: readonly string[];
  mission: PublicAboutStatement | null;
  vision: PublicAboutStatement | null;
  valuesHeading: string;
  valuesSupporting: string;
  values: readonly PublicAboutValue[];
  teamHeading: string;
  teamSupporting: string;
  founders: readonly PublicPerson[];
  evidenceHeading: string;
  evidenceSupporting: string;
  evidence: readonly PublicProjectCard[];
  directionHeading: string;
  directionNote: string;
  enquiryAction: PublicCta | null;
  workAction: PublicCta | null;
  pageTitle: string;
  pageDescription: string;
}>;

function projectValues(
  values: readonly AboutValueRecord[],
): PublicAboutValue[] {
  return values.map((value) => ({
    id: value.id,
    title: value.title,
    behaviour: value.behaviour,
  }));
}

function isHttpsUrl(href: string): boolean {
  try {
    const url = new URL(href);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

function projectFounder(founder: FounderRecord): PublicPerson {
  const media = founder.portraitMediaId
    ? contentCatalog.media.find((row) => row.id === founder.portraitMediaId)
    : undefined;
  const portrait =
    media &&
    media.publicationState === "approved" &&
    media.width != null &&
    media.height != null &&
    media.publicPath.trim()
      ? {
          src: media.publicPath,
          width: media.width,
          height: media.height,
          alt:
            media.alt.decorative === true
              ? ""
              : media.alt.alt.trim() || `Portrait of ${founder.displayName}`,
        }
      : null;

  const links = founder.professionalUrls
    .filter((link) => isHttpsUrl(link.href.trim()))
    .map((link) => ({ label: link.label, href: link.href.trim() }));

  return {
    id: founder.id,
    displayName: founder.displayName,
    role: founder.role,
    bio: founder.bio,
    portrait,
    links,
  };
}

async function buildAboutPage(
  record: AboutPageRecord,
  options?: { includeDraftStatements?: boolean },
): Promise<PublicAboutPage> {
  const includeDraftStatements = options?.includeDraftStatements ?? false;

  const mission =
    record.mission.publicationState === "approved" ||
    (includeDraftStatements && record.mission.publicationState === "draft")
      ? { text: record.mission.text }
      : null;

  const vision =
    record.vision.publicationState === "approved" ||
    (includeDraftStatements && record.vision.publicationState === "draft")
      ? { text: record.vision.text }
      : null;

  const founders: PublicPerson[] = contentCatalog.founders
    .filter((founder) => founder.publicationState === "approved")
    .map(projectFounder);

  const evidence = (
    await listPublishedProjects({
      page: 1,
      pageSize: 3,
    })
  ).items;

  return {
    id: "about",
    heroTitle: record.heroTitle,
    introduction: record.introduction,
    companyStory: [...record.companyStory],
    mission,
    vision,
    valuesHeading: record.valuesHeading,
    valuesSupporting: record.valuesSupporting,
    values: projectValues(record.values),
    teamHeading: record.teamHeading,
    teamSupporting: record.teamSupporting,
    founders,
    evidenceHeading: record.evidenceHeading,
    evidenceSupporting: record.evidenceSupporting,
    evidence,
    directionHeading: record.directionHeading,
    directionNote: record.directionNote,
    enquiryAction: resolveServicesEnquiryCta({
      label: record.primaryCtaLabel,
    }),
    workAction: publicRoutes.work.implemented
      ? {
          label: "Explore our work",
          href: publicRoutes.work.path,
        }
      : null,
    pageTitle: record.pageTitle,
    pageDescription: record.pageDescription,
  };
}

/**
 * Public About page. Returns null while the page body stays draft so `/about`
 * can show an honest sparse placeholder instead of unpublished marketing copy.
 */
export async function getPublicAboutPage(): Promise<PublicAboutPage | null> {
  const record = contentCatalog.about;
  if (record.publicationState !== "approved") {
    return null;
  }
  return buildAboutPage(record);
}

/** Gallery-only draft projection — includes draft mission/vision for review. */
export async function getAboutGalleryPreview(): Promise<PublicAboutPage> {
  return buildAboutPage(contentCatalog.about, {
    includeDraftStatements: true,
  });
}
