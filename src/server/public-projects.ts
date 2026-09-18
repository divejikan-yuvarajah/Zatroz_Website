import "server-only";

import { contentCatalog } from "@/content/catalog";
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
 * Temporary repository adapter. A09–A10 will swap this to MongoDB published
 * revisions without changing PublicProjectCard / PublicCaseStudy consumers.
 *
 * workStoriesImplemented is true once `/work/[slug]` exists (Step 38).
 * New admin-published slugs resolve at request time (dynamicParams stays default).
 */
function getRepository(): PublicProjectsRepository {
  return {
    projects: contentCatalog.projects,
    media: contentCatalog.media,
    services: contentCatalog.services,
    featuredProjectIds: contentCatalog.featuredProjectIds,
    workStoriesImplemented: publicRoutes.work.implemented,
  };
}

export async function listPublishedProjects(options?: {
  service?: ServiceSlug | null;
  status?: WorkStatus | null;
  page?: number;
  pageSize?: number;
}): Promise<PublicProjectListResult> {
  return listPublishedProjectCards(getRepository(), options);
}

export async function getPublishedProjectSummaryBySlug(
  slug: string,
): Promise<PublicProjectCard | null> {
  return getPublishedProjectCardBySlug(getRepository(), slug);
}

export async function getPublishedCaseStudyBySlug(
  slug: string,
  options?: { idPrefix?: string },
): Promise<PublicCaseStudy | null> {
  return projectPublishedCaseStudy(getRepository(), slug, options);
}

export async function listPublishedFeaturedProjects(
  limit = 3,
): Promise<readonly PublicProjectCard[]> {
  return listPublishedFeaturedProjectCards(getRepository(), limit);
}

export async function listPublishedRelatedProjects(
  projectIds: readonly string[],
  limit = 3,
): Promise<readonly PublicProjectCard[]> {
  return listPublishedRelatedProjectCards(getRepository(), projectIds, limit);
}

/** Known public story slugs for optional prerender — not a permanent eligibility allowlist. */
export function getPublishedCaseStudySlugsForPrerender(): string[] {
  return listPublishedCaseStudySlugs(getRepository());
}

/** Thin sync helpers for existing homepage/service projections. */
export function getPublishedProjectCardsSync(options?: {
  service?: ServiceSlug | null;
  status?: WorkStatus | null;
  page?: number;
  pageSize?: number;
}): PublicProjectListResult {
  return listPublishedProjectCards(getRepository(), options);
}

export function getPublishedFeaturedProjectCardsSync(
  limit = 3,
): readonly PublicProjectCard[] {
  return listPublishedFeaturedProjectCards(getRepository(), limit);
}

export function getPublishedRelatedProjectCardsSync(
  projectIds: readonly string[],
  limit = 3,
): readonly PublicProjectCard[] {
  return listPublishedRelatedProjectCards(getRepository(), projectIds, limit);
}

export function isWorkListingImplemented(): boolean {
  return publicRoutes.work.implemented;
}
