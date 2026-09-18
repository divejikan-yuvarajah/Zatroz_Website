import "server-only";

import { contentCatalog } from "@/content/catalog";
import type { ProjectRecord } from "@/content/projects";
import type { ServiceRecord } from "@/content/services";
import { siteRecord } from "@/content/site";
import {
  getCopyrightYear,
  getPublicContactLinks,
  type PublicContactLink,
  type SiteBrand,
} from "@/config/brand";
import {
  getFooterNavigation,
  getHeaderNavigation,
  getHomeDestination,
  type FooterNavigation,
  type HeaderNavigation,
  type NavDestination,
} from "@/config/navigation";
import { publicRoutes } from "@/config/routes";
import { isPublicServiceDetailEligible } from "@/server/service-detail";

export type PublicService = Readonly<{
  id: string;
  slug: ServiceRecord["slug"];
  title: string;
  summary: string;
  path: string;
}>;

export type PublicProject = Readonly<{
  id: string;
  slug: string;
  title: string;
  workStatus: ProjectRecord["workStatus"];
  summaryContribution: string;
  path: string;
}>;

export type PublicFounder = Readonly<{
  id: string;
  displayName: string;
  role: string;
  bio: string;
}>;

export type PublicFaq = Readonly<{
  id: string;
  question: string;
  answer: string;
  relatedServiceId: string | null;
}>;

function toPublicService(service: ServiceRecord): PublicService {
  return {
    id: service.id,
    slug: service.slug,
    title: service.title,
    summary: service.summary,
    path: publicRoutes[service.routeId].path,
  };
}

/** Approved services only (may still lack an implemented route). */
export function getPublishedServices(): readonly PublicService[] {
  return contentCatalog.services
    .filter((service) => service.publicationState === "approved")
    .map(toPublicService);
}

/**
 * Approved services whose public detail page is eligible to link.
 * Requires overview approval, detail approval, and an implemented route.
 */
export function getLinkableServices(): readonly PublicService[] {
  return contentCatalog.services
    .filter(isPublicServiceDetailEligible)
    .map(toPublicService);
}

export function getPublishedProjects(): readonly PublicProject[] {
  return contentCatalog.projects
    .filter((project) => project.publicationState === "approved")
    .map((project) => ({
      id: project.id,
      slug: project.slug,
      title: project.title,
      workStatus: project.workStatus,
      summaryContribution: project.zatrozContribution,
      path: `/work/${project.slug}`,
    }));
}

export function getLinkableProjects(): readonly PublicProject[] {
  if (!publicRoutes.work.implemented) {
    return [];
  }
  return getPublishedProjects();
}

export function getPublishedFounders(): readonly PublicFounder[] {
  return contentCatalog.founders
    .filter((founder) => founder.publicationState === "approved")
    .map((founder) => ({
      id: founder.id,
      displayName: founder.displayName,
      role: founder.role,
      bio: founder.bio,
    }));
}

export function getPublishedFaqs(): readonly PublicFaq[] {
  return contentCatalog.faqs
    .filter((faq) => faq.publicationState === "approved")
    .map((faq) => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      relatedServiceId: faq.relatedServiceId,
    }));
}

/** Live header projection — implemented destinations; service details only when eligible. */
export function getPublicNavigation(): HeaderNavigation {
  const navigation = getHeaderNavigation();
  if (!navigation.services) {
    return navigation;
  }

  const linkablePaths = new Set(
    getLinkableServices().map((service) => service.path),
  );

  const categories = navigation.services.categories.filter((item) =>
    linkablePaths.has(item.path),
  );

  const services = {
    overview: navigation.services.overview,
    categories,
  };

  return {
    ...navigation,
    services:
      services.overview || services.categories.length > 0 ? services : null,
  };
}

export function getPublicHomeDestination(): NavDestination {
  return getHomeDestination();
}

export function getPublicFooterNavigation(): FooterNavigation {
  const footer = getFooterNavigation();
  const linkablePaths = new Set(
    getLinkableServices().map((service) => service.path),
  );

  return {
    ...footer,
    services: footer.services.filter((item) => linkablePaths.has(item.path)),
  };
}

export function getPublicSiteBrand(): SiteBrand {
  return {
    name: siteRecord.name,
    description: {
      text: siteRecord.description.text,
      status: siteRecord.description.status,
    },
  };
}

export function getPublicFooterContactLinks(): PublicContactLink[] {
  return getPublicContactLinks();
}

export { getCopyrightYear };

/** Re-export for server callers that need draft counts in docs/tools only. */
export function getContentGapSummary(): {
  draftServices: number;
  draftFaqs: number;
  projectCount: number;
  founderCount: number;
} {
  return {
    draftServices: contentCatalog.services.filter(
      (s) => s.publicationState === "draft",
    ).length,
    draftFaqs: contentCatalog.faqs.filter((f) => f.publicationState === "draft")
      .length,
    projectCount: contentCatalog.projects.length,
    founderCount: contentCatalog.founders.length,
  };
}
