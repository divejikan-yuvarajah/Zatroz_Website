/**
 * Pure helpers for A08 publish / unpublish / archive / slug redirect checks.
 */

import { DRAFT_PLACEHOLDER } from "@/lib/admin/projects";
import { storyHasRenderableBody } from "@/lib/admin/preview";
import { SLUG_PATTERN, DB_STRING_LIMITS } from "@/lib/mongodb/limits";
import type {
  ProjectDocument,
  ProjectStorySnapshot,
  ProjectSummarySnapshot,
} from "@/lib/mongodb/models/types";

export type PublishTarget = "summary" | "story";

export type PublishReadiness =
  { ok: true } | { ok: false; message: string; code: string };

export function isNonEmptyDraftText(value: string | null | undefined): boolean {
  const trimmed = (value ?? "").trim();
  return Boolean(trimmed) && trimmed !== DRAFT_PLACEHOLDER;
}

export function assessSummaryPublishReadiness(input: {
  project: ProjectDocument;
  summary: ProjectSummarySnapshot | null;
}): PublishReadiness {
  if (!input.project.draftRevisionId) {
    return {
      ok: false,
      code: "no-draft-revision",
      message: "Save a draft revision before publishing the summary.",
    };
  }
  if (!input.summary) {
    return {
      ok: false,
      code: "no-summary",
      message: "Draft summary is missing.",
    };
  }
  if (!isNonEmptyDraftText(input.summary.title)) {
    return {
      ok: false,
      code: "title-required",
      message: "Summary title is required before publish.",
    };
  }
  if (!isNonEmptyDraftText(input.summary.summary)) {
    return {
      ok: false,
      code: "summary-required",
      message: "Short summary text is required before publish.",
    };
  }
  const slug = input.project.draftSlug.trim();
  if (!SLUG_PATTERN.test(slug) || slug.length > DB_STRING_LIMITS.slugMax) {
    return {
      ok: false,
      code: "slug-invalid",
      message: "Draft slug must be a valid kebab-case slug before publish.",
    };
  }
  return { ok: true };
}

export function assessStoryPublishReadiness(input: {
  project: ProjectDocument;
  story: ProjectStorySnapshot | null;
}): PublishReadiness {
  if (!input.project.publishedSummaryRevisionId) {
    return {
      ok: false,
      code: "summary-not-published",
      message: "Publish the summary before publishing the case-study story.",
    };
  }
  if (!input.project.draftRevisionId) {
    return {
      ok: false,
      code: "no-draft-revision",
      message: "Save a draft revision before publishing the story.",
    };
  }
  if (!storyHasRenderableBody(input.story)) {
    return {
      ok: false,
      code: "story-empty",
      message: "Add case-study content before publishing the story.",
    };
  }
  return { ok: true };
}

export function willCreateSlugRedirect(input: {
  previousCanonicalSlug: string | null;
  nextSlug: string;
}): boolean {
  const prev = input.previousCanonicalSlug?.trim() || null;
  const next = input.nextSlug.trim();
  return Boolean(prev && prev !== next);
}

export type ProjectPublicationStatus = Readonly<{
  summaryPublished: boolean;
  storyPublished: boolean;
  canonicalPublishedSlug: string | null;
  draftSlug: string;
  slugWillRedirectOnPublish: boolean;
}>;

export function getProjectPublicationStatus(
  project: ProjectDocument,
): ProjectPublicationStatus {
  return {
    summaryPublished: Boolean(project.publishedSummaryRevisionId),
    storyPublished: Boolean(project.publishedStoryRevisionId),
    canonicalPublishedSlug: project.canonicalPublishedSlug,
    draftSlug: project.draftSlug,
    slugWillRedirectOnPublish: willCreateSlugRedirect({
      previousCanonicalSlug: project.canonicalPublishedSlug,
      nextSlug: project.draftSlug,
    }),
  };
}

export function classifyAdminPublication(project: {
  publishedSummaryRevisionId: string | null;
  archived?: boolean;
}): "draft" | "published" | "archived" {
  if (project.archived) return "archived";
  return project.publishedSummaryRevisionId ? "published" : "draft";
}
