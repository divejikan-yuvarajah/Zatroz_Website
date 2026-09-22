/**
 * Public project projections — pure helpers for eligibility, filters, and DTOs.
 * Server adapter loads Mongo published revisions (A09); tests use fixtures.
 *
 * Components must consume DTOs via `src/server/public-projects.ts`, not raw arrays.
 */
import type { MediaRecord } from "@/content/media";
import { WORK_STATUS_LABELS, type ProjectRecord } from "@/content/projects";
import type { ServiceRecord } from "@/content/services";
import {
  SERVICE_SLUGS,
  type ServiceSlug,
  type WorkStatus,
} from "@/types/content";

export const PUBLIC_PROJECTS_PAGE_SIZE = 9;
export const PUBLIC_PROJECTS_MAX_PAGE_SIZE = 24;

export type PublicProjectCover = Readonly<{
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string | null;
}>;

export type PublicProjectServiceRef = Readonly<{
  id: string;
  slug: ServiceSlug;
  title: string;
}>;

export type PublicProjectLink = Readonly<{
  label: string;
  href: string;
}>;

/**
 * Bounded public card DTO. Draft fields, internal notes, and unapproved media
 * must never appear here.
 */
export type PublicProjectCard = Readonly<{
  id: string;
  slug: string;
  title: string;
  summary: string;
  workStatus: WorkStatus;
  workStatusLabel: string;
  services: readonly PublicProjectServiceRef[];
  cover: PublicProjectCover | null;
  /** True only when an approved story may link to `/work/[slug]`. */
  storyLinkEligible: boolean;
  /** External or internal demo links that are safe to expose. */
  links: readonly PublicProjectLink[];
  /** Attribution line when contributors are present; omit empty. */
  attribution: string | null;
  /** Stable path for a future story — use only when storyLinkEligible. */
  storyPath: string;
}>;

export type PublicProjectListFilters = Readonly<{
  service: ServiceSlug | null;
  status: WorkStatus | null;
  page: number;
  pageSize: number;
}>;

/** Catalogue source health for public Work listings. */
export type PublicCatalogAvailability = "ready" | "unavailable";

export type PublicProjectListResult = Readonly<{
  items: readonly PublicProjectCard[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  filters: PublicProjectListFilters;
  /** Distinct services present on eligible projects (for filter UI). */
  availableServices: readonly PublicProjectServiceRef[];
  /** Distinct work statuses present on eligible projects. */
  availableStatuses: readonly {
    value: WorkStatus;
    label: string;
  }[];
  /** Catalogue source health — see PublicProjectsRepository.availability. */
  availability: PublicCatalogAvailability;
}>;

export type PublicProjectsRepository = Readonly<{
  projects: readonly ProjectRecord[];
  media: readonly MediaRecord[];
  services: readonly ServiceRecord[];
  featuredProjectIds: readonly string[];
  /** When false, storyLinkEligible is always false. */
  workStoriesImplemented: boolean;
  /**
   * `unavailable` means the catalogue source failed (e.g. database).
   * Must not be presented as an empty portfolio.
   */
  availability?: PublicCatalogAvailability;
}>;

function isHttpsUrl(href: string): boolean {
  return /^https:\/\//i.test(href.trim());
}

function isInternalPath(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

function isSafePublicHref(href: string): boolean {
  const trimmed = href.trim();
  if (!trimmed || /^javascript:/i.test(trimmed)) {
    return false;
  }
  return isHttpsUrl(trimmed) || isInternalPath(trimmed);
}

export function isProjectSummaryEligible(project: ProjectRecord): boolean {
  return project.publicationState === "approved";
}

export function isProjectStoryEligible(
  project: ProjectRecord,
  workStoriesImplemented: boolean,
): boolean {
  return (
    workStoriesImplemented &&
    isProjectSummaryEligible(project) &&
    project.storyPublicationState === "approved" &&
    project.story?.publicationState === "approved"
  );
}

function comparePublishedProjects(a: ProjectRecord, b: ProjectRecord): number {
  const orderA = a.editorialOrder;
  const orderB = b.editorialOrder;
  const hasA = typeof orderA === "number";
  const hasB = typeof orderB === "number";
  if (hasA && hasB && orderA !== orderB) {
    return orderA - orderB;
  }
  if (hasA && !hasB) {
    return -1;
  }
  if (!hasA && hasB) {
    return 1;
  }
  return a.id.localeCompare(b.id);
}

export function listEligibleProjectRecords(
  projects: readonly ProjectRecord[],
): ProjectRecord[] {
  return projects
    .filter(isProjectSummaryEligible)
    .slice()
    .sort(comparePublishedProjects);
}

function resolveCover(
  project: ProjectRecord,
  media: readonly MediaRecord[],
): PublicProjectCover | null {
  for (const mediaId of project.mediaIds) {
    const row = media.find((item) => item.id === mediaId);
    if (!row || row.publicationState !== "approved") {
      continue;
    }
    if (row.width == null || row.height == null) {
      continue;
    }
    if (!row.publicPath.trim()) {
      continue;
    }
    const alt =
      row.alt.decorative === true ? "" : row.alt.alt.trim() || project.title;
    return {
      src: row.publicPath,
      width: row.width,
      height: row.height,
      alt,
      caption: row.caption,
    };
  }
  return null;
}

function resolveServiceRefs(
  project: ProjectRecord,
  services: readonly ServiceRecord[],
): PublicProjectServiceRef[] {
  const refs: PublicProjectServiceRef[] = [];
  for (const serviceId of project.serviceIds) {
    const service = services.find((row) => row.id === serviceId);
    if (!service || service.publicationState !== "approved") {
      continue;
    }
    refs.push({
      id: service.id,
      slug: service.slug,
      title: service.title,
    });
  }
  return refs;
}

function resolvePublicLinks(project: ProjectRecord): PublicProjectLink[] {
  const links: PublicProjectLink[] = [];
  for (const link of project.publicLinks) {
    if (!isSafePublicHref(link.href)) {
      continue;
    }
    links.push({ label: link.label, href: link.href.trim() });
  }
  return links;
}

function resolveAttribution(project: ProjectRecord): string | null {
  const names = project.contributors.map((name) => name.trim()).filter(Boolean);
  if (names.length === 0) {
    return null;
  }
  return `Credited: ${names.join(", ")}`;
}

export function toPublicProjectCard(
  project: ProjectRecord,
  repo: Pick<
    PublicProjectsRepository,
    "media" | "services" | "workStoriesImplemented"
  >,
): PublicProjectCard {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    summary: project.summary.trim() || project.zatrozContribution,
    workStatus: project.workStatus,
    workStatusLabel: WORK_STATUS_LABELS[project.workStatus],
    services: resolveServiceRefs(project, repo.services),
    cover: resolveCover(project, repo.media),
    storyLinkEligible: isProjectStoryEligible(
      project,
      repo.workStoriesImplemented,
    ),
    links: resolvePublicLinks(project),
    attribution: resolveAttribution(project),
    storyPath: `/work/${project.slug}`,
  };
}

function matchesFilters(
  project: ProjectRecord,
  filters: Pick<PublicProjectListFilters, "service" | "status">,
  services: readonly ServiceRecord[],
): boolean {
  if (filters.status && project.workStatus !== filters.status) {
    return false;
  }
  if (filters.service) {
    const hasService = project.serviceIds.some((serviceId) => {
      const service = services.find((row) => row.id === serviceId);
      return service?.slug === filters.service;
    });
    if (!hasService) {
      return false;
    }
  }
  return true;
}

function clampPageSize(pageSize: number): number {
  if (!Number.isFinite(pageSize) || pageSize < 1) {
    return PUBLIC_PROJECTS_PAGE_SIZE;
  }
  return Math.min(Math.floor(pageSize), PUBLIC_PROJECTS_MAX_PAGE_SIZE);
}

function normalizePage(page: number, pageCount: number): number {
  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }
  const floored = Math.floor(page);
  if (pageCount < 1) {
    return 1;
  }
  return Math.min(floored, pageCount);
}

/**
 * Filter → count → sort → paginate. Eligibility is applied before filters.
 */
export function listPublishedProjectCards(
  repo: PublicProjectsRepository,
  options?: {
    service?: ServiceSlug | null;
    status?: WorkStatus | null;
    page?: number;
    pageSize?: number;
  },
): PublicProjectListResult {
  const pageSize = clampPageSize(
    options?.pageSize ?? PUBLIC_PROJECTS_PAGE_SIZE,
  );
  const service = options?.service ?? null;
  const status = options?.status ?? null;

  // Outages must not surface residual/fixture rows as a ready portfolio.
  if (repo.availability === "unavailable") {
    return {
      items: [],
      total: 0,
      page: 1,
      pageSize,
      pageCount: 0,
      filters: {
        service,
        status,
        page: 1,
        pageSize,
      },
      availableServices: [],
      availableStatuses: [],
      availability: "unavailable",
    };
  }

  const eligible = listEligibleProjectRecords(repo.projects);
  const filtered = eligible.filter((project) =>
    matchesFilters(project, { service, status }, repo.services),
  );

  const total = filtered.length;
  const pageCount = total === 0 ? 0 : Math.ceil(total / pageSize);
  const page = normalizePage(options?.page ?? 1, Math.max(pageCount, 1));
  const start = (page - 1) * pageSize;
  const pageRows = filtered.slice(start, start + pageSize);

  const availableServicesMap = new Map<string, PublicProjectServiceRef>();
  const availableStatuses = new Map<WorkStatus, string>();
  for (const project of eligible) {
    availableStatuses.set(
      project.workStatus,
      WORK_STATUS_LABELS[project.workStatus],
    );
    for (const ref of resolveServiceRefs(project, repo.services)) {
      availableServicesMap.set(ref.id, ref);
    }
  }

  return {
    items: pageRows.map((project) => toPublicProjectCard(project, repo)),
    total,
    page: total === 0 ? 1 : page,
    pageSize,
    pageCount,
    filters: {
      service,
      status,
      page: total === 0 ? 1 : page,
      pageSize,
    },
    availableServices: [...availableServicesMap.values()].sort((a, b) =>
      a.title.localeCompare(b.title),
    ),
    availableStatuses: [...availableStatuses.entries()]
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    availability: "ready",
  };
}

export function getPublishedProjectCardBySlug(
  repo: PublicProjectsRepository,
  slug: string,
): PublicProjectCard | null {
  const project = listEligibleProjectRecords(repo.projects).find(
    (row) => row.slug === slug,
  );
  if (!project) {
    return null;
  }
  return toPublicProjectCard(project, repo);
}

export function listPublishedFeaturedProjectCards(
  repo: PublicProjectsRepository,
  limit = 3,
): PublicProjectCard[] {
  const cards: PublicProjectCard[] = [];
  for (const id of repo.featuredProjectIds) {
    const project = repo.projects.find((row) => row.id === id);
    if (!project || !isProjectSummaryEligible(project)) {
      continue;
    }
    cards.push(toPublicProjectCard(project, repo));
    if (cards.length >= limit) {
      break;
    }
  }
  return cards;
}

export function listPublishedRelatedProjectCards(
  repo: PublicProjectsRepository,
  projectIds: readonly string[],
  limit = 3,
): PublicProjectCard[] {
  const cards: PublicProjectCard[] = [];
  for (const id of projectIds) {
    const project = repo.projects.find((row) => row.id === id);
    if (!project || !isProjectSummaryEligible(project)) {
      continue;
    }
    cards.push(toPublicProjectCard(project, repo));
    if (cards.length >= limit) {
      break;
    }
  }
  return cards;
}

/**
 * Query policy for `/work`:
 * - Accept a single allowlisted `service` / `status`.
 * - Repeated or unknown values fall back to “all” (null).
 * - `page` is a bounded positive integer; invalid → 1.
 */
export function parseWorkListSearchParams(
  raw: URLSearchParams | Record<string, string | string[] | undefined>,
): Pick<PublicProjectListFilters, "service" | "status" | "page"> {
  const getAll = (key: string): string[] => {
    if (raw instanceof URLSearchParams) {
      return raw.getAll(key);
    }
    const value = raw[key];
    if (value == null) {
      return [];
    }
    return Array.isArray(value) ? value : [value];
  };

  const serviceValues = getAll("service").map((value) => value.trim());
  const statusValues = getAll("status").map((value) => value.trim());
  const pageValues = getAll("page").map((value) => value.trim());

  let service: ServiceSlug | null = null;
  if (serviceValues.length === 1) {
    const candidate = serviceValues[0];
    if ((SERVICE_SLUGS as readonly string[]).includes(candidate)) {
      service = candidate as ServiceSlug;
    }
  }

  let status: WorkStatus | null = null;
  if (statusValues.length === 1) {
    const candidate = statusValues[0];
    if (candidate in WORK_STATUS_LABELS) {
      status = candidate as WorkStatus;
    }
  }

  let page = 1;
  if (pageValues.length === 1) {
    const parsed = Number.parseInt(pageValues[0], 10);
    if (Number.isFinite(parsed) && parsed >= 1) {
      page = parsed;
    }
  }

  return { service, status, page };
}

/** Build `/work` href preserving filters; omit defaults. */
export function buildWorkListHref(options: {
  service?: ServiceSlug | null;
  status?: WorkStatus | null;
  page?: number;
}): string {
  const params = new URLSearchParams();
  if (options.service) {
    params.set("service", options.service);
  }
  if (options.status) {
    params.set("status", options.status);
  }
  if (options.page && options.page > 1) {
    params.set("page", String(options.page));
  }
  const query = params.toString();
  return query ? `/work?${query}` : "/work";
}

/**
 * Future MongoDB adapter (A09–A10) must:
 * - Read only published revisions
 * - Never fall back to repository drafts on database error
 * - Keep the same PublicProjectCard shape
 */
export const PUBLIC_PROJECTS_ADAPTER_NOTE =
  "MongoDB published-revision adapter (A09). Database outages must not fall back to draft repository content.";
