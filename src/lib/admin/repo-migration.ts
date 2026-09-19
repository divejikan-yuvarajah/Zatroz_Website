/**
 * Pure A10 repository → Mongo portfolio migration planner.
 * Never auto-publishes drafts. Tests use fixtures; CLI uses the live catalog.
 */

import type { MediaRecord } from "@/content/media";
import type { ProjectRecord, ProjectStoryRecord } from "@/content/projects";
import { DRAFT_PLACEHOLDER } from "@/lib/admin/projects";
import { DB_STRING_LIMITS } from "@/lib/mongodb/limits";
import type {
  ProjectStorySnapshot,
  ProjectSummarySnapshot,
} from "@/lib/mongodb/models/types";
import type { MediaVisibility } from "@/lib/mongodb/enums";

export const REPO_PORTFOLIO_MIGRATION_ID = "a10-repo-portfolio-v1" as const;
export const REPO_MIGRATION_ACTOR_ID = "migration:a10-repo-portfolio" as const;

export type PlannedMediaImport = Readonly<{
  mediaId: string;
  versionId: string;
  publicPath: string;
  width: number | null;
  height: number | null;
  alt: MediaRecord["alt"];
  caption: string | null;
  visibility: MediaVisibility;
  processingState: "ready" | "pending";
  publicationState: MediaRecord["publicationState"];
  action: "insert" | "skip-existing";
}>;

export type PlannedProjectImport = Readonly<{
  editorialId: string;
  slug: string;
  title: string;
  workStatus: ProjectRecord["workStatus"];
  summaryPublication: ProjectRecord["publicationState"];
  storyPublication: ProjectRecord["storyPublicationState"];
  /** True only when summary publicationState is approved. */
  publishSummary: boolean;
  /** True only when story is approved and summary is also publishable. */
  publishStory: boolean;
  summary: ProjectSummarySnapshot;
  story: ProjectStorySnapshot | null;
  mediaIds: readonly string[];
  action: "insert" | "skip-existing";
}>;

export type RepoPortfolioMigrationPlan = Readonly<{
  migrationId: typeof REPO_PORTFOLIO_MIGRATION_ID;
  media: readonly PlannedMediaImport[];
  projects: readonly PlannedProjectImport[];
  featuredProjectIds: readonly string[];
  /** Featured IDs that will be written (approved + imported only). */
  featuredToWrite: readonly string[];
  counts: Readonly<{
    mediaInsert: number;
    mediaSkip: number;
    projectInsert: number;
    projectSkip: number;
    publishedSummaries: number;
    publishedStories: number;
    draftOnlyProjects: number;
    skippedArchivedProjects: number;
    featuredCount: number;
  }>;
  notes: readonly string[];
}>;

function nonEmptyOrPlaceholder(value: string): string {
  const trimmed = value.trim();
  return trimmed || DRAFT_PLACEHOLDER;
}

function mapStory(
  story: ProjectStoryRecord | null,
): ProjectStorySnapshot | null {
  if (!story) return null;
  return {
    title: nonEmptyOrPlaceholder(story.title),
    intro: nonEmptyOrPlaceholder(story.intro),
    context: [...story.context],
    contribution: [...story.contribution],
    solution: [...story.solution],
    features: [...story.features],
    processNotes: [...story.processNotes],
    gallery: story.gallery.map((item) => ({
      mediaId: item.mediaId,
      caption: item.caption,
      conceptLabel: item.conceptLabel ?? null,
    })),
    technologies: [...story.technologies],
    outcomes: [...story.outcomes],
    lessons: [...story.lessons],
    testimonial: story.testimonial
      ? {
          quote: story.testimonial.quote,
          attribution: story.testimonial.attribution,
          publicationState: story.testimonial.publicationState,
        }
      : null,
    ...(story.reviewNotes !== undefined
      ? { reviewNotes: story.reviewNotes }
      : {}),
  };
}

function mapSummary(project: ProjectRecord): ProjectSummarySnapshot {
  return {
    title: nonEmptyOrPlaceholder(project.title),
    summary: nonEmptyOrPlaceholder(project.summary),
    workStatus: project.workStatus,
    serviceIds: [...project.serviceIds],
    contributors: [...project.contributors],
    zatrozContribution: nonEmptyOrPlaceholder(project.zatrozContribution),
    problem: nonEmptyOrPlaceholder(project.problem),
    approach: nonEmptyOrPlaceholder(project.approach),
    deliverables: [...project.deliverables],
    verifiedOutcomes: [...project.verifiedOutcomes],
    mediaIds: [...project.mediaIds],
    publicLinks: project.publicLinks.map((link) => ({ ...link })),
    editorialOrder: project.editorialOrder,
  };
}

/**
 * Build an idempotent migration plan from repository catalog arrays.
 * `existing*` sets mark rows that already exist in Mongo (skip on apply).
 */
export function planRepoPortfolioMigration(input: {
  projects: readonly ProjectRecord[];
  media: readonly MediaRecord[];
  featuredProjectIds: readonly string[];
  existingEditorialIds?: ReadonlySet<string>;
  existingMediaIds?: ReadonlySet<string>;
}): RepoPortfolioMigrationPlan {
  const existingEditorialIds = input.existingEditorialIds ?? new Set<string>();
  const existingMediaIds = input.existingMediaIds ?? new Set<string>();
  const notes: string[] = [];

  const media: PlannedMediaImport[] = [];
  for (const row of input.media) {
    const approved = row.publicationState === "approved";
    const hasDims = row.width != null && row.height != null;
    const hasPath = row.publicPath.trim().length > 0;
    media.push({
      mediaId: row.id.slice(0, DB_STRING_LIMITS.mediaIdMax),
      versionId: `ver_repo_${row.id}`.slice(0, DB_STRING_LIMITS.versionIdMax),
      publicPath: row.publicPath.trim(),
      width: row.width,
      height: row.height,
      alt: row.alt,
      caption: row.caption,
      visibility: approved && hasPath ? "public" : "private",
      processingState: approved && hasDims && hasPath ? "ready" : "pending",
      publicationState: row.publicationState,
      action: existingMediaIds.has(row.id) ? "skip-existing" : "insert",
    });
    if (approved && (!hasDims || !hasPath)) {
      notes.push(
        `Media "${row.id}" is approved but missing dimensions or publicPath — imported as pending/private.`,
      );
    }
  }

  const projects: PlannedProjectImport[] = [];
  let skippedArchived = 0;
  for (const project of input.projects) {
    if (project.publicationState === "archived") {
      skippedArchived += 1;
      notes.push(
        `Project "${project.id}" is archived in the repository — skipped (import archive flags via admin if needed).`,
      );
      continue;
    }

    const publishSummary = project.publicationState === "approved";
    const storyApproved =
      project.storyPublicationState === "approved" &&
      project.story?.publicationState === "approved";
    const publishStory = publishSummary && storyApproved;

    if (storyApproved && !publishSummary) {
      notes.push(
        `Project "${project.id}" has an approved story but draft summary — story will not be published until the summary is approved.`,
      );
    }

    projects.push({
      editorialId: project.id.slice(0, DB_STRING_LIMITS.editorialIdMax),
      slug: project.slug.slice(0, DB_STRING_LIMITS.slugMax),
      title: project.title,
      workStatus: project.workStatus,
      summaryPublication: project.publicationState,
      storyPublication: project.storyPublicationState,
      publishSummary,
      publishStory,
      summary: mapSummary(project),
      story: mapStory(project.story),
      mediaIds: [...project.mediaIds],
      action: existingEditorialIds.has(project.id) ? "skip-existing" : "insert",
    });
  }

  const plannedPublished = new Set(
    projects.filter((p) => p.publishSummary).map((p) => p.editorialId),
  );

  const featuredToWrite = input.featuredProjectIds.filter((id) => {
    if (plannedPublished.has(id)) return true;
    notes.push(
      `Featured id "${id}" skipped — not an approved published summary in this plan.`,
    );
    return false;
  });

  const mediaInsert = media.filter((m) => m.action === "insert").length;
  const mediaSkip = media.filter((m) => m.action === "skip-existing").length;
  const projectInsert = projects.filter((p) => p.action === "insert").length;
  const projectSkip = projects.filter(
    (p) => p.action === "skip-existing",
  ).length;
  const publishedSummaries = projects.filter((p) => p.publishSummary).length;
  const publishedStories = projects.filter((p) => p.publishStory).length;
  const draftOnlyProjects = projects.filter((p) => !p.publishSummary).length;

  if (input.projects.length === 0 && input.media.length === 0) {
    notes.push(
      "Repository portfolio catalogs are empty — migration is a verified no-op until approved records exist.",
    );
  }

  return {
    migrationId: REPO_PORTFOLIO_MIGRATION_ID,
    media,
    projects,
    featuredProjectIds: input.featuredProjectIds,
    featuredToWrite,
    counts: {
      mediaInsert,
      mediaSkip,
      projectInsert,
      projectSkip,
      publishedSummaries,
      publishedStories,
      draftOnlyProjects,
      skippedArchivedProjects: skippedArchived,
      featuredCount: featuredToWrite.length,
    },
    notes,
  };
}

export function formatRepoPortfolioPlan(
  plan: RepoPortfolioMigrationPlan,
): string {
  const lines = [
    `Migration: ${plan.migrationId}`,
    `Media insert/skip: ${plan.counts.mediaInsert}/${plan.counts.mediaSkip}`,
    `Projects insert/skip: ${plan.counts.projectInsert}/${plan.counts.projectSkip}`,
    `Would publish summaries/stories: ${plan.counts.publishedSummaries}/${plan.counts.publishedStories}`,
    `Draft-only projects: ${plan.counts.draftOnlyProjects}`,
    `Archived skipped: ${plan.counts.skippedArchivedProjects}`,
    `Featured IDs to write: ${plan.counts.featuredCount}`,
  ];
  for (const note of plan.notes) {
    lines.push(`Note: ${note}`);
  }
  return lines.join("\n");
}
