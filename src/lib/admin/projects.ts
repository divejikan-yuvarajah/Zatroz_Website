/**
 * Pure helpers for admin project list filters and draft form validation (A05).
 */

import {
  WORK_STATUS_LABELS,
  WORK_STATUS_VALUES,
  type ProjectStoryGalleryItem,
} from "@/content/projects";
import {
  DB_ARRAY_LIMITS,
  DB_STRING_LIMITS,
  EDITORIAL_ID_PATTERN,
  SLUG_PATTERN,
} from "@/lib/mongodb/limits";
import {
  validateEditorialId,
  validateSlug,
} from "@/lib/mongodb/models/validate";
import type {
  ProjectDocument,
  ProjectStorySnapshot,
  ProjectSummarySnapshot,
} from "@/lib/mongodb/models/types";
import type { WorkStatus } from "@/types/content";

export { validateEditorialId, validateSlug };

/** Required non-empty BSON strings when a draft field is not yet written. */
export const DRAFT_PLACEHOLDER = "—" as const;

export const ADMIN_PROJECT_PAGE_SIZE = 10;
export const ADMIN_PROJECT_MAX_PAGE = 100;

export type ProjectPublicationFilter = "all" | "draft" | "published";

export type ProjectListQuery = Readonly<{
  search: string;
  workStatus: WorkStatus | "all";
  publication: ProjectPublicationFilter;
  page: number;
}>;

export type ProjectListItem = Readonly<{
  editorialId: string;
  draftTitle: string;
  draftSlug: string;
  workStatus: WorkStatus;
  workStatusLabel: string;
  publication: "draft" | "published";
  concurrencyVersion: number;
  updatedAtIso: string;
  hasDraftRevision: boolean;
}>;

export type ProjectDraftFormValues = Readonly<{
  title: string;
  slug: string;
  summary: string;
  workStatus: WorkStatus;
  serviceIds: readonly string[];
  technologies: readonly string[];
  contributors: readonly string[];
  publicLinks: readonly { label: string; href: string }[];
  coverMediaId: string | null;
  gallery: readonly ProjectStoryGalleryItem[];
  featuredEligible: boolean;
  editorialOrder: number | null;
  /** Preserved summary narrative fields (not primary A05 UI). */
  zatrozContribution: string;
  problem: string;
  approach: string;
  deliverables: readonly string[];
  verifiedOutcomes: readonly string[];
}>;

export type ProjectDraftParseResult =
  | { ok: true; values: ProjectDraftFormValues }
  | { ok: false; message: string; field?: string };

export function isWorkStatus(value: string): value is WorkStatus {
  return (WORK_STATUS_VALUES as readonly string[]).includes(value);
}

export function workStatusLabel(status: WorkStatus): string {
  return WORK_STATUS_LABELS[status];
}

export function slugifyTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, DB_STRING_LIMITS.slugMax);
}

export function editorialIdFromSlug(slug: string): string {
  const base = `proj-${slug}`.slice(0, DB_STRING_LIMITS.editorialIdMax);
  return base;
}

export function parseProjectListQuery(input: {
  q?: string | string[];
  workStatus?: string | string[];
  publication?: string | string[];
  page?: string | string[];
}): ProjectListQuery {
  const search = firstParam(input.q)?.trim() ?? "";
  const workRaw = firstParam(input.workStatus)?.trim() ?? "all";
  const workStatus =
    workRaw === "all" || !isWorkStatus(workRaw) ? "all" : workRaw;
  const pubRaw = firstParam(input.publication)?.trim() ?? "all";
  const publication: ProjectPublicationFilter =
    pubRaw === "draft" || pubRaw === "published" ? pubRaw : "all";
  const pageRaw = Number.parseInt(firstParam(input.page) ?? "1", 10);
  const page = Number.isFinite(pageRaw)
    ? Math.min(Math.max(pageRaw, 1), ADMIN_PROJECT_MAX_PAGE)
    : 1;
  return { search, workStatus, publication, page };
}

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function splitLines(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function splitCsv(raw: string): string[] {
  return raw
    .split(/[,|\n]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function parsePublicLinks(
  raw: string,
):
  | { ok: true; links: { label: string; href: string }[] }
  | { ok: false; message: string } {
  const lines = splitLines(raw);
  if (lines.length > DB_ARRAY_LIMITS.maxPublicLinks) {
    return {
      ok: false,
      message: `At most ${DB_ARRAY_LIMITS.maxPublicLinks} public links.`,
    };
  }
  const links: { label: string; href: string }[] = [];
  for (const line of lines) {
    const sep = line.indexOf("|");
    if (sep <= 0 || sep === line.length - 1) {
      return {
        ok: false,
        message:
          'Each link must be "Label | https://example.com" on its own line.',
      };
    }
    const label = line.slice(0, sep).trim();
    const href = line.slice(sep + 1).trim();
    if (!label || !href) {
      return {
        ok: false,
        message: "Link label and URL are required.",
      };
    }
    if (label.length > DB_STRING_LIMITS.linkLabelMax) {
      return {
        ok: false,
        message: `Link label must be at most ${DB_STRING_LIMITS.linkLabelMax} characters.`,
      };
    }
    if (href.length > DB_STRING_LIMITS.hrefMax) {
      return {
        ok: false,
        message: `Link URL must be at most ${DB_STRING_LIMITS.hrefMax} characters.`,
      };
    }
    if (!/^https?:\/\//i.test(href)) {
      return {
        ok: false,
        message: "Link URLs must start with http:// or https://.",
      };
    }
    links.push({ label, href });
  }
  return { ok: true, links };
}

export function parseGalleryField(
  raw: string,
):
  | { ok: true; gallery: ProjectStoryGalleryItem[] }
  | { ok: false; message: string } {
  const lines = splitLines(raw);
  if (lines.length > DB_ARRAY_LIMITS.maxGalleryItems) {
    return {
      ok: false,
      message: `At most ${DB_ARRAY_LIMITS.maxGalleryItems} gallery items.`,
    };
  }
  const gallery: ProjectStoryGalleryItem[] = [];
  for (const line of lines) {
    const sep = line.indexOf("|");
    if (sep <= 0 || sep === line.length - 1) {
      return {
        ok: false,
        message:
          'Each gallery row must be "mediaId | caption" on its own line.',
      };
    }
    const mediaId = line.slice(0, sep).trim();
    const caption = line.slice(sep + 1).trim();
    if (!mediaId || !caption) {
      return {
        ok: false,
        message: "Gallery media id and caption are required.",
      };
    }
    if (mediaId.length > DB_STRING_LIMITS.mediaIdMax) {
      return { ok: false, message: "Gallery media id is too long." };
    }
    if (caption.length > DB_STRING_LIMITS.captionMax) {
      return {
        ok: false,
        message: `Gallery caption must be at most ${DB_STRING_LIMITS.captionMax} characters.`,
      };
    }
    gallery.push({ mediaId, caption });
  }
  return { ok: true, gallery };
}

export function parseProjectDraftFormData(
  formData: FormData,
  options?: { allowedServiceIds?: readonly string[] },
): ProjectDraftParseResult {
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase();
  const summary = String(formData.get("summary") ?? "").trim();
  const workStatusRaw = String(formData.get("workStatus") ?? "").trim();
  const coverMediaIdRaw = String(formData.get("coverMediaId") ?? "").trim();
  const featuredEligible = formData.get("featuredEligible") === "on";
  const orderRaw = String(formData.get("editorialOrder") ?? "").trim();

  if (!title) {
    return { ok: false, message: "Title is required.", field: "title" };
  }
  if (title.length > DB_STRING_LIMITS.titleMax) {
    return {
      ok: false,
      message: `Title must be at most ${DB_STRING_LIMITS.titleMax} characters.`,
      field: "title",
    };
  }

  const slugCheck = validateSlug(slug, "slug");
  if (!slugCheck.ok) {
    return {
      ok: false,
      message: "Slug must be kebab-case (lowercase letters, numbers, hyphens).",
      field: "slug",
    };
  }

  if (!summary) {
    return { ok: false, message: "Summary is required.", field: "summary" };
  }
  if (summary.length > DB_STRING_LIMITS.summaryMax) {
    return {
      ok: false,
      message: `Summary must be at most ${DB_STRING_LIMITS.summaryMax} characters.`,
      field: "summary",
    };
  }

  if (!isWorkStatus(workStatusRaw)) {
    return {
      ok: false,
      message: "Choose a valid work status.",
      field: "workStatus",
    };
  }

  const serviceIds = formData
    .getAll("serviceIds")
    .map((v) => String(v).trim())
    .filter(Boolean);
  if (serviceIds.length > DB_ARRAY_LIMITS.maxServiceIds) {
    return {
      ok: false,
      message: `At most ${DB_ARRAY_LIMITS.maxServiceIds} services.`,
      field: "serviceIds",
    };
  }
  const allowed = options?.allowedServiceIds;
  if (allowed) {
    for (const id of serviceIds) {
      if (!allowed.includes(id)) {
        return {
          ok: false,
          message: `Unknown service id: ${id}`,
          field: "serviceIds",
        };
      }
    }
  }
  for (const id of serviceIds) {
    if (id.length > DB_STRING_LIMITS.serviceIdMax) {
      return {
        ok: false,
        message: "Service id is too long.",
        field: "serviceIds",
      };
    }
  }

  const technologies = splitCsv(String(formData.get("technologies") ?? ""));
  if (technologies.length > DB_ARRAY_LIMITS.maxTechnologies) {
    return {
      ok: false,
      message: `At most ${DB_ARRAY_LIMITS.maxTechnologies} technologies.`,
      field: "technologies",
    };
  }
  for (const tech of technologies) {
    if (tech.length > DB_STRING_LIMITS.technologyMax) {
      return {
        ok: false,
        message: `Each technology must be at most ${DB_STRING_LIMITS.technologyMax} characters.`,
        field: "technologies",
      };
    }
  }

  const contributors = splitLines(String(formData.get("contributors") ?? ""));
  if (contributors.length > DB_ARRAY_LIMITS.maxContributors) {
    return {
      ok: false,
      message: `At most ${DB_ARRAY_LIMITS.maxContributors} contributors.`,
      field: "contributors",
    };
  }
  for (const name of contributors) {
    if (name.length > DB_STRING_LIMITS.contributorMax) {
      return {
        ok: false,
        message: `Each contributor must be at most ${DB_STRING_LIMITS.contributorMax} characters.`,
        field: "contributors",
      };
    }
  }

  const linksParsed = parsePublicLinks(
    String(formData.get("publicLinks") ?? ""),
  );
  if (!linksParsed.ok) {
    return { ok: false, message: linksParsed.message, field: "publicLinks" };
  }

  const galleryParsed = parseGalleryField(
    String(formData.get("gallery") ?? ""),
  );
  if (!galleryParsed.ok) {
    return { ok: false, message: galleryParsed.message, field: "gallery" };
  }

  const coverMediaId = coverMediaIdRaw || null;
  if (coverMediaId && coverMediaId.length > DB_STRING_LIMITS.mediaIdMax) {
    return {
      ok: false,
      message: "Cover media id is too long.",
      field: "coverMediaId",
    };
  }

  let editorialOrder: number | null = null;
  if (featuredEligible) {
    if (orderRaw) {
      const n = Number.parseInt(orderRaw, 10);
      if (!Number.isFinite(n) || n < 0 || n > 9999) {
        return {
          ok: false,
          message: "Featured order must be a whole number from 0 to 9999.",
          field: "editorialOrder",
        };
      }
      editorialOrder = n;
    } else {
      editorialOrder = 0;
    }
  }

  const zatrozContribution = nonEmptyOrPlaceholder(
    String(formData.get("zatrozContribution") ?? ""),
  );
  const problem = nonEmptyOrPlaceholder(String(formData.get("problem") ?? ""));
  const approach = nonEmptyOrPlaceholder(
    String(formData.get("approach") ?? ""),
  );
  const deliverables = splitLines(String(formData.get("deliverables") ?? ""));
  const verifiedOutcomes = splitLines(
    String(formData.get("verifiedOutcomes") ?? ""),
  );

  if (deliverables.length > DB_ARRAY_LIMITS.maxDeliverables) {
    return {
      ok: false,
      message: `At most ${DB_ARRAY_LIMITS.maxDeliverables} deliverables.`,
    };
  }
  if (verifiedOutcomes.length > DB_ARRAY_LIMITS.maxVerifiedOutcomes) {
    return {
      ok: false,
      message: `At most ${DB_ARRAY_LIMITS.maxVerifiedOutcomes} verified outcomes.`,
    };
  }

  return {
    ok: true,
    values: {
      title,
      slug,
      summary,
      workStatus: workStatusRaw,
      serviceIds,
      technologies,
      contributors,
      publicLinks: linksParsed.links,
      coverMediaId,
      gallery: galleryParsed.gallery,
      featuredEligible,
      editorialOrder,
      zatrozContribution,
      problem,
      approach,
      deliverables,
      verifiedOutcomes,
    },
  };
}

function nonEmptyOrPlaceholder(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return DRAFT_PLACEHOLDER;
  return trimmed.slice(0, DB_STRING_LIMITS.contributionMax);
}

export function buildSummarySnapshot(
  values: ProjectDraftFormValues,
): ProjectSummarySnapshot {
  const mediaIds: string[] = [];
  if (values.coverMediaId) {
    mediaIds.push(values.coverMediaId);
  }
  for (const item of values.gallery) {
    if (!mediaIds.includes(item.mediaId)) {
      mediaIds.push(item.mediaId);
    }
  }
  return {
    title: values.title,
    summary: values.summary,
    workStatus: values.workStatus,
    serviceIds: [...values.serviceIds],
    contributors: [...values.contributors],
    zatrozContribution: values.zatrozContribution || DRAFT_PLACEHOLDER,
    problem: values.problem || DRAFT_PLACEHOLDER,
    approach: values.approach || DRAFT_PLACEHOLDER,
    deliverables: [...values.deliverables],
    verifiedOutcomes: [...values.verifiedOutcomes],
    mediaIds: mediaIds.slice(0, DB_ARRAY_LIMITS.maxMediaIds),
    publicLinks: values.publicLinks.map((l) => ({ ...l })),
    editorialOrder: values.featuredEligible
      ? (values.editorialOrder ?? 0)
      : null,
  };
}

export function buildStoryStub(
  values: ProjectDraftFormValues,
  previous?: ProjectStorySnapshot | null,
): ProjectStorySnapshot {
  return {
    title: values.title,
    intro: previous?.intro?.trim() ? previous.intro : DRAFT_PLACEHOLDER,
    context: previous?.context ?? [],
    contribution: previous?.contribution ?? [],
    solution: previous?.solution ?? [],
    features: previous?.features ?? [],
    processNotes: previous?.processNotes ?? [],
    gallery: values.gallery.map((item) => ({
      mediaId: item.mediaId,
      caption: item.caption,
      conceptLabel: item.conceptLabel ?? null,
    })),
    technologies: [...values.technologies],
    outcomes: previous?.outcomes ?? [],
    lessons: previous?.lessons ?? [],
    testimonial: previous?.testimonial ?? null,
    ...(previous?.reviewNotes !== undefined
      ? { reviewNotes: previous.reviewNotes }
      : {}),
  };
}

export function formValuesFromDraft(input: {
  project: ProjectDocument;
  summary: ProjectSummarySnapshot | null;
  story: ProjectStorySnapshot | null;
}): ProjectDraftFormValues {
  const summary = input.summary;
  const story = input.story;
  const coverMediaId = summary?.mediaIds?.[0] ?? null;
  const editorialOrder = summary?.editorialOrder ?? null;
  return {
    title: summary?.title ?? input.project.draftTitle,
    slug: input.project.draftSlug,
    summary: summary?.summary ?? "",
    workStatus: summary?.workStatus ?? input.project.workStatus,
    serviceIds: summary?.serviceIds ?? [],
    technologies: story?.technologies ?? [],
    contributors: summary?.contributors ?? [],
    publicLinks: summary?.publicLinks ?? [],
    coverMediaId,
    gallery: story?.gallery ?? [],
    featuredEligible: editorialOrder !== null,
    editorialOrder,
    zatrozContribution:
      summary?.zatrozContribution === DRAFT_PLACEHOLDER
        ? ""
        : (summary?.zatrozContribution ?? ""),
    problem:
      summary?.problem === DRAFT_PLACEHOLDER ? "" : (summary?.problem ?? ""),
    approach:
      summary?.approach === DRAFT_PLACEHOLDER ? "" : (summary?.approach ?? ""),
    deliverables: summary?.deliverables ?? [],
    verifiedOutcomes: summary?.verifiedOutcomes ?? [],
  };
}

export function serializePublicLinks(
  links: readonly { label: string; href: string }[],
): string {
  return links.map((l) => `${l.label} | ${l.href}`).join("\n");
}

export function serializeGallery(
  gallery: readonly ProjectStoryGalleryItem[],
): string {
  return gallery.map((g) => `${g.mediaId} | ${g.caption}`).join("\n");
}

export function classifyListPublication(project: {
  publishedSummaryRevisionId: string | null;
}): "draft" | "published" {
  return project.publishedSummaryRevisionId ? "published" : "draft";
}

export function isValidEditorialIdFormat(id: string): boolean {
  return (
    EDITORIAL_ID_PATTERN.test(id) &&
    id.length <= DB_STRING_LIMITS.editorialIdMax
  );
}

export function isValidSlugFormat(slug: string): boolean {
  return SLUG_PATTERN.test(slug) && slug.length <= DB_STRING_LIMITS.slugMax;
}
