import "server-only";

import {
  adminMediaPreviewPath,
  buildDraftCaseStudyPreview,
  buildDraftSummaryCardPreview,
  storyHasRenderableBody,
  type PreviewMediaAsset,
  type PreviewServiceRef,
} from "@/lib/admin/preview";
import { DRAFT_PLACEHOLDER } from "@/lib/admin/projects";
import { isMongoRuntimeConfigured } from "@/lib/mongodb/config";
import type {
  ProjectStorySnapshot,
  ProjectSummarySnapshot,
} from "@/lib/mongodb/models/types";
import type { PublicCaseStudy } from "@/lib/public-case-study";
import type { PublicProjectCard } from "@/lib/public-projects";
import { serviceRecords } from "@/content/services";
import { findLatestMediaVersion } from "@/server/media/repository";
import { loadProjectDraft } from "@/server/projects/repository";

export type ProjectPreviewResult =
  | {
      ok: true;
      editorialId: string;
      draftSlug: string;
      draftTitle: string;
      concurrencyVersion: number;
      card: PublicProjectCard;
      study: PublicCaseStudy | null;
      hasStoryBody: boolean;
      missingMediaIds: readonly string[];
      mediaNotes: readonly string[];
    }
  | {
      ok: false;
      reason: "not-found" | "unavailable" | "incomplete";
      detail: string;
    };

const PREVIEW_SERVICES: readonly PreviewServiceRef[] = serviceRecords.map(
  (s) => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
  }),
);

function collectMediaIds(
  summary: ProjectSummarySnapshot | null,
  story: ProjectStorySnapshot | null,
): string[] {
  const ids = new Set<string>();
  for (const id of summary?.mediaIds ?? []) {
    if (id) ids.add(id);
  }
  for (const item of story?.gallery ?? []) {
    if (item.mediaId) ids.add(item.mediaId);
  }
  return [...ids];
}

async function resolvePreviewMedia(mediaIds: readonly string[]): Promise<{
  mediaById: Map<string, PreviewMediaAsset>;
  missingMediaIds: string[];
  mediaNotes: string[];
}> {
  const mediaById = new Map<string, PreviewMediaAsset>();
  const missingMediaIds: string[] = [];
  const mediaNotes: string[] = [];

  for (const mediaId of mediaIds) {
    const found = await findLatestMediaVersion(mediaId);
    if (!found.ok) {
      missingMediaIds.push(mediaId);
      mediaNotes.push(
        found.reason === "not-found"
          ? `Media ${mediaId} was not found.`
          : `Media ${mediaId} unavailable (${found.detail}).`,
      );
      continue;
    }
    const width =
      found.item.width && found.item.width > 0 ? found.item.width : 1200;
    const height =
      found.item.height && found.item.height > 0 ? found.item.height : 800;
    const alt =
      found.item.alt.decorative === true
        ? ""
        : found.item.alt.alt.trim() || found.item.caption || mediaId;

    mediaById.set(mediaId, {
      mediaId,
      src: adminMediaPreviewPath(mediaId),
      width,
      height,
      alt,
      caption: found.item.caption,
    });
  }

  return { mediaById, missingMediaIds, mediaNotes };
}

function ensureSummary(
  summary: ProjectSummarySnapshot | null,
  draftTitle: string,
  workStatus: ProjectSummarySnapshot["workStatus"],
): ProjectSummarySnapshot {
  if (summary) return summary;
  return {
    title: draftTitle || DRAFT_PLACEHOLDER,
    summary: DRAFT_PLACEHOLDER,
    workStatus,
    serviceIds: [],
    contributors: [],
    zatrozContribution: DRAFT_PLACEHOLDER,
    problem: DRAFT_PLACEHOLDER,
    approach: DRAFT_PLACEHOLDER,
    deliverables: [],
    verifiedOutcomes: [],
    mediaIds: [],
    publicLinks: [],
    editorialOrder: null,
  };
}

/**
 * Load a project draft and project public-shaped DTOs for staff preview.
 */
export async function loadProjectPreview(
  editorialId: string,
): Promise<ProjectPreviewResult> {
  if (!isMongoRuntimeConfigured()) {
    return {
      ok: false,
      reason: "unavailable",
      detail: "MongoDB is not configured in this environment.",
    };
  }

  const loaded = await loadProjectDraft(editorialId);
  if (!loaded.ok) {
    return {
      ok: false,
      reason: loaded.reason === "not-found" ? "not-found" : "unavailable",
      detail: loaded.detail,
    };
  }

  const summary = ensureSummary(
    loaded.summary,
    loaded.project.draftTitle,
    loaded.project.workStatus,
  );

  const mediaIds = collectMediaIds(summary, loaded.story);
  const { mediaById, missingMediaIds, mediaNotes } =
    await resolvePreviewMedia(mediaIds);

  const hasStoryBody = storyHasRenderableBody(loaded.story);
  const card = buildDraftSummaryCardPreview({
    editorialId: loaded.project.editorialId,
    draftSlug: loaded.project.draftSlug,
    summary,
    mediaById,
    services: PREVIEW_SERVICES,
    hasStoryBody,
  });

  const study =
    loaded.story && hasStoryBody
      ? buildDraftCaseStudyPreview({
          editorialId: loaded.project.editorialId,
          draftSlug: loaded.project.draftSlug,
          summary,
          story: loaded.story,
          mediaById,
          services: PREVIEW_SERVICES,
        })
      : null;

  return {
    ok: true,
    editorialId: loaded.project.editorialId,
    draftSlug: loaded.project.draftSlug,
    draftTitle: loaded.project.draftTitle,
    concurrencyVersion: loaded.project.concurrencyVersion,
    card,
    study,
    hasStoryBody,
    missingMediaIds,
    mediaNotes,
  };
}
