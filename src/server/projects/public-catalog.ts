import "server-only";

import { contentCatalog } from "@/content/catalog";
import type { MediaRecord } from "@/content/media";
import type { ProjectRecord, ProjectStoryRecord } from "@/content/projects";
import { publicRoutes } from "@/config/routes";
import { DRAFT_PLACEHOLDER } from "@/lib/admin/projects";
import { COLLECTION_NAMES } from "@/lib/mongodb/collections";
import { isMongoRuntimeConfigured } from "@/lib/mongodb/config";
import { getDb } from "@/lib/mongodb/connection";
import type {
  ProjectDocument,
  ProjectRevisionDocument,
  ProjectStorySnapshot,
  ProjectSummarySnapshot,
} from "@/lib/mongodb/models/types";
import type { PublicProjectsRepository } from "@/lib/public-projects";
import { listArchivedEditorialIds } from "@/server/projects/admin-state";
import { loadFeaturedProjectIds } from "@/server/projects/featured";

function emptyPublicRepository(): PublicProjectsRepository {
  return {
    projects: [],
    media: [],
    services: contentCatalog.services,
    featuredProjectIds: [],
    workStoriesImplemented: publicRoutes.work.implemented,
  };
}

function nonPlaceholder(value: string | null | undefined): string {
  const trimmed = (value ?? "").trim();
  if (!trimmed || trimmed === DRAFT_PLACEHOLDER) return "";
  return trimmed;
}

function mapStorySnapshot(snapshot: ProjectStorySnapshot): ProjectStoryRecord {
  return {
    publicationState: "approved",
    title: nonPlaceholder(snapshot.title) || "Case study",
    intro: nonPlaceholder(snapshot.intro),
    context: snapshot.context ?? [],
    contribution: snapshot.contribution ?? [],
    solution: snapshot.solution ?? [],
    features: snapshot.features ?? [],
    processNotes: snapshot.processNotes ?? [],
    gallery: (snapshot.gallery ?? []).map((item) => ({
      mediaId: item.mediaId,
      caption: item.caption,
      conceptLabel: item.conceptLabel ?? null,
    })),
    technologies: snapshot.technologies ?? [],
    outcomes: snapshot.outcomes ?? [],
    lessons: snapshot.lessons ?? [],
    testimonial: snapshot.testimonial
      ? {
          quote: snapshot.testimonial.quote,
          attribution: snapshot.testimonial.attribution,
          publicationState: snapshot.testimonial.publicationState,
        }
      : null,
    // reviewNotes intentionally omitted from public projection source
  };
}

function mapPublishedProject(input: {
  project: ProjectDocument;
  summary: ProjectSummarySnapshot;
  story: ProjectStorySnapshot | null;
  storyPublished: boolean;
}): ProjectRecord | null {
  const slug = input.project.canonicalPublishedSlug?.trim();
  if (!slug) return null;

  const title =
    nonPlaceholder(input.summary.title) ||
    nonPlaceholder(input.project.draftTitle) ||
    slug;
  const summaryText =
    nonPlaceholder(input.summary.summary) ||
    nonPlaceholder(input.summary.zatrozContribution);
  if (!summaryText) return null;

  const story =
    input.storyPublished && input.story ? mapStorySnapshot(input.story) : null;

  return {
    id: input.project.editorialId,
    slug,
    title,
    summary: summaryText,
    publicationState: "approved",
    workStatus: input.summary.workStatus ?? input.project.workStatus,
    editorialOrder: input.summary.editorialOrder,
    serviceIds: input.summary.serviceIds ?? [],
    contributors: input.summary.contributors ?? [],
    zatrozContribution: nonPlaceholder(input.summary.zatrozContribution),
    problem: nonPlaceholder(input.summary.problem),
    approach: nonPlaceholder(input.summary.approach),
    deliverables: input.summary.deliverables ?? [],
    verifiedOutcomes: input.summary.verifiedOutcomes ?? [],
    mediaIds: input.summary.mediaIds ?? [],
    publicLinks: (input.summary.publicLinks ?? []).map((link) => ({
      label: link.label,
      href: link.href,
    })),
    storyPublicationState: story ? "approved" : null,
    story,
  };
}

/**
 * Load the public portfolio adapter from MongoDB published pointers only.
 * On configuration miss or database error: empty catalog — never repository drafts.
 */
export async function loadMongoPublicProjectsRepository(): Promise<PublicProjectsRepository> {
  if (!isMongoRuntimeConfigured()) {
    return emptyPublicRepository();
  }

  try {
    const db = await getDb();
    const archived = new Set(await listArchivedEditorialIds());
    const projectDocs = (await db
      .collection(COLLECTION_NAMES.projects)
      .find({
        publishedSummaryRevisionId: { $ne: null },
        canonicalPublishedSlug: { $ne: null },
      })
      .toArray()) as unknown as ProjectDocument[];

    const liveProjects = projectDocs.filter(
      (doc) =>
        typeof doc.editorialId === "string" &&
        !archived.has(doc.editorialId) &&
        typeof doc.publishedSummaryRevisionId === "string" &&
        typeof doc.canonicalPublishedSlug === "string",
    );

    const revisionIds = new Set<string>();
    for (const doc of liveProjects) {
      if (doc.publishedSummaryRevisionId) {
        revisionIds.add(doc.publishedSummaryRevisionId);
      }
      if (doc.publishedStoryRevisionId) {
        revisionIds.add(doc.publishedStoryRevisionId);
      }
    }

    const revisionDocs =
      revisionIds.size === 0
        ? []
        : ((await db
            .collection(COLLECTION_NAMES.projectRevisions)
            .find({ revisionId: { $in: [...revisionIds] } })
            .toArray()) as unknown as ProjectRevisionDocument[]);

    const revisionsById = new Map(
      revisionDocs.map((rev) => [rev.revisionId, rev]),
    );

    const projects: ProjectRecord[] = [];
    const mediaIdSet = new Set<string>();

    for (const project of liveProjects) {
      const summaryRev = project.publishedSummaryRevisionId
        ? revisionsById.get(project.publishedSummaryRevisionId)
        : null;
      if (!summaryRev?.summary) continue;

      let storySnap: ProjectStorySnapshot | null = null;
      const storyPublished = Boolean(project.publishedStoryRevisionId);
      if (storyPublished && project.publishedStoryRevisionId) {
        const storyRev = revisionsById.get(project.publishedStoryRevisionId);
        storySnap = storyRev?.story ?? null;
        // Same revision may hold both summary and story.
        if (!storySnap && summaryRev.story) {
          storySnap = summaryRev.story;
        }
      }

      const mapped = mapPublishedProject({
        project,
        summary: summaryRev.summary,
        story: storySnap,
        storyPublished,
      });
      if (!mapped) continue;

      projects.push(mapped);
      for (const mediaId of mapped.mediaIds) {
        mediaIdSet.add(mediaId);
      }
      if (mapped.story) {
        for (const item of mapped.story.gallery) {
          mediaIdSet.add(item.mediaId);
        }
      }
    }

    const media: MediaRecord[] = [];
    if (mediaIdSet.size > 0) {
      const mediaDocs = await db
        .collection(COLLECTION_NAMES.mediaAssets)
        .find({
          mediaId: { $in: [...mediaIdSet] },
          visibility: "public",
          processingState: "ready",
        })
        .sort({ updatedAt: -1 })
        .toArray();

      const seenMedia = new Set<string>();
      for (const doc of mediaDocs) {
        if (typeof doc.mediaId !== "string" || seenMedia.has(doc.mediaId)) {
          continue;
        }
        // Durable public delivery for Cloudinary public assets is A11.
        // Until then, omit publicPath so cards stay text-led rather than
        // leaking private signed URLs into anonymous HTML.
        const publicPath =
          typeof doc.storageHint === "string" && doc.storageHint.startsWith("/")
            ? doc.storageHint
            : "";
        if (!publicPath.trim()) {
          continue;
        }
        if (typeof doc.width !== "number" || typeof doc.height !== "number") {
          continue;
        }
        seenMedia.add(doc.mediaId);
        media.push({
          id: doc.mediaId,
          publicPath,
          width: doc.width,
          height: doc.height,
          publicationState: "approved",
          alt: doc.alt ?? { decorative: false, alt: "" },
          caption: typeof doc.caption === "string" ? doc.caption : null,
        });
      }
    }

    const featuredProjectIds = await loadFeaturedProjectIds();
    const publishedIds = new Set(projects.map((p) => p.id));
    const eligibleFeatured = featuredProjectIds.filter((id) =>
      publishedIds.has(id),
    );

    return {
      projects,
      media,
      services: contentCatalog.services,
      featuredProjectIds: eligibleFeatured,
      workStoriesImplemented: publicRoutes.work.implemented,
    };
  } catch {
    // Database outages must not fall back to repository draft content.
    return emptyPublicRepository();
  }
}

export function getEmptyPublicProjectsRepository(): PublicProjectsRepository {
  return emptyPublicRepository();
}
