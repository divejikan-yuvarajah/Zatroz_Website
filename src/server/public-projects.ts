import "server-only";

import { publicRoutes } from "@/config/routes";
import {
  listPublishedCaseStudySlugs,
  projectPublishedCaseStudy,
  type PublicCaseStudy,
} from "@/lib/public-case-study";
import {
  PUBLIC_PROJECTS_ADAPTER_NOTE,
  PUBLIC_PROJECTS_MAX_PAGE_SIZE,
  PUBLIC_PROJECTS_PAGE_SIZE,
  buildWorkListHref,
  getPublishedProjectCardBySlug,
  listPublishedFeaturedProjectCards,
  listPublishedProjectCards,
  listPublishedRelatedProjectCards,
  parseWorkListSearchParams,
  type PublicProjectCard,
  type PublicProjectListResult,
  type PublicProjectsRepository,
} from "@/lib/public-projects";
import {
  getEmptyPublicProjectsRepository,
  loadMongoPublicProjectsRepository,
} from "@/server/projects/public-catalog";
import { findProjectRedirect } from "@/server/projects/publish";
import type { ServiceSlug, WorkStatus } from "@/types/content";

export {
  PUBLIC_PROJECTS_ADAPTER_NOTE,
  PUBLIC_PROJECTS_MAX_PAGE_SIZE,
  PUBLIC_PROJECTS_PAGE_SIZE,
  buildWorkListHref,
  parseWorkListSearchParams,
};
export type { PublicProjectCard, PublicProjectListResult, PublicCaseStudy };

/**
 * MongoDB published-revision adapter (A09).
 * On DB failure or missing config: empty catalog — never repository drafts.
 */
async function getRepository(): Promise<PublicProjectsRepository> {
  return loadMongoPublicProjectsRepository();
}

export async function listPublishedProjects(options?: {
  service?: ServiceSlug | null;
  status?: WorkStatus | null;
  page?: number;
  pageSize?: number;
}): Promise<PublicProjectListResult> {
  return listPublishedProjectCards(await getRepository(), options);
}

export async function getPublishedProjectSummaryBySlug(
  slug: string,
): Promise<PublicProjectCard | null> {
  return getPublishedProjectCardBySlug(await getRepository(), slug);
}

export async function getPublishedCaseStudyBySlug(
  slug: string,
  options?: { idPrefix?: string },
): Promise<PublicCaseStudy | null> {
  return projectPublishedCaseStudy(await getRepository(), slug, options);
}

/**
 * Resolve a published case study, following A08 slug redirects when needed.
 */
export async function getPublishedCaseStudyBySlugOrRedirect(
  slug: string,
  options?: { idPrefix?: string },
): Promise<
  | { kind: "study"; study: PublicCaseStudy }
  | { kind: "redirect"; toSlug: string }
  | { kind: "missing" }
> {
  const study = await getPublishedCaseStudyBySlug(slug, options);
  if (study) {
    return { kind: "study", study };
  }
  const redirectTarget = await findProjectRedirect(slug);
  if (redirectTarget?.toSlug && redirectTarget.toSlug !== slug) {
    return { kind: "redirect", toSlug: redirectTarget.toSlug };
  }
  return { kind: "missing" };
}

export async function listPublishedFeaturedProjects(
  limit = 3,
): Promise<readonly PublicProjectCard[]> {
  return listPublishedFeaturedProjectCards(await getRepository(), limit);
}

export async function listPublishedRelatedProjects(
  projectIds: readonly string[],
  limit = 3,
): Promise<readonly PublicProjectCard[]> {
  return listPublishedRelatedProjectCards(
    await getRepository(),
    projectIds,
    limit,
  );
}

/** Known public story slugs for optional prerender — not a permanent eligibility allowlist. */
export async function getPublishedCaseStudySlugsForPrerender(): Promise<
  string[]
> {
  return listPublishedCaseStudySlugs(await getRepository());
}

/**
 * @deprecated Sync helpers cannot load Mongo. Prefer async listPublished* APIs.
 * Returns an empty portfolio so callers never see repository drafts.
 */
export function getPublishedProjectCardsSync(options?: {
  service?: ServiceSlug | null;
  status?: WorkStatus | null;
  page?: number;
  pageSize?: number;
}): PublicProjectListResult {
  return listPublishedProjectCards(getEmptyPublicProjectsRepository(), options);
}

/** @deprecated Prefer listPublishedFeaturedProjects. */
export function getPublishedFeaturedProjectCardsSync(
  limit = 3,
): readonly PublicProjectCard[] {
  return listPublishedFeaturedProjectCards(
    getEmptyPublicProjectsRepository(),
    limit,
  );
}

/** @deprecated Prefer listPublishedRelatedProjects. */
export function getPublishedRelatedProjectCardsSync(
  projectIds: readonly string[],
  limit = 3,
): readonly PublicProjectCard[] {
  return listPublishedRelatedProjectCards(
    getEmptyPublicProjectsRepository(),
    projectIds,
    limit,
  );
}

export function isWorkListingImplemented(): boolean {
  return publicRoutes.work.implemented;
}
