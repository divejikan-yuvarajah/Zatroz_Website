/**
 * Public case-study projections — pure module for tests and server adapter.
 * Never includes draft story bodies, review notes, or unapproved media.
 */
import type { MediaRecord } from "@/content/media";
import {
  CASE_STUDY_SECTION_HEADINGS,
  WORK_STATUS_LABELS,
  type CaseStudySectionKey,
  type ProjectRecord,
  type ProjectStoryRecord,
  type StoryContentBlock,
} from "@/content/projects";
import type { ServiceRecord } from "@/content/services";
import {
  isProjectStoryEligible,
  isProjectSummaryEligible,
  listPublishedRelatedProjectCards,
  toPublicProjectCard,
  type PublicProjectCard,
  type PublicProjectCover,
  type PublicProjectLink,
  type PublicProjectServiceRef,
  type PublicProjectsRepository,
} from "@/lib/public-projects";
import type { WorkStatus } from "@/types/content";

export type PublicStoryParagraph = Readonly<{
  type: "paragraph";
  text: string;
}>;

export type PublicStoryList = Readonly<{
  type: "list";
  style: "bulleted" | "numbered";
  items: readonly string[];
}>;

export type PublicStoryBlock = PublicStoryParagraph | PublicStoryList;

export type PublicCaseStudySection = Readonly<{
  key: CaseStudySectionKey;
  heading: string;
  anchorId: string;
  blocks: readonly PublicStoryBlock[];
  /** Feature list rendered under solution when present. */
  features?: readonly string[];
}>;

export type PublicCaseStudyGalleryItem = Readonly<{
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  conceptLabel: string | null;
}>;

export type PublicCaseStudyTestimonial = Readonly<{
  quote: string;
  attribution: string;
}>;

export type PublicCaseStudyFacts = Readonly<{
  contribution: string | null;
  workStatusLabel: string;
  services: readonly PublicProjectServiceRef[];
  technologies: readonly string[];
  attribution: string | null;
}>;

export type PublicCaseStudy = Readonly<{
  id: string;
  slug: string;
  title: string;
  intro: string;
  workStatus: WorkStatus;
  workStatusLabel: string;
  cover: PublicProjectCover | null;
  facts: PublicCaseStudyFacts;
  sections: readonly PublicCaseStudySection[];
  gallery: readonly PublicCaseStudyGalleryItem[];
  outcomes: readonly string[];
  testimonial: PublicCaseStudyTestimonial | null;
  links: readonly PublicProjectLink[];
  related: readonly PublicProjectCard[];
  pageTitle: string;
  pageDescription: string;
  path: string;
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

function projectBlocks(
  blocks: readonly StoryContentBlock[],
): PublicStoryBlock[] {
  const projected: PublicStoryBlock[] = [];
  for (const block of blocks) {
    if (block.type === "paragraph") {
      const text = block.text.trim();
      if (!text) {
        continue;
      }
      projected.push({ type: "paragraph", text });
      continue;
    }
    if (block.type === "list") {
      const items = block.items.map((item) => item.trim()).filter(Boolean);
      if (items.length === 0) {
        continue;
      }
      projected.push({ type: "list", style: block.style, items });
    }
  }
  return projected;
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
    if (row.width == null || row.height == null || !row.publicPath.trim()) {
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

function resolveLinks(project: ProjectRecord): PublicProjectLink[] {
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

function resolveGallery(
  story: ProjectStoryRecord,
  media: readonly MediaRecord[],
  fallbackTitle: string,
): PublicCaseStudyGalleryItem[] {
  const items: PublicCaseStudyGalleryItem[] = [];
  for (const entry of story.gallery) {
    const row = media.find((item) => item.id === entry.mediaId);
    if (!row || row.publicationState !== "approved") {
      continue;
    }
    if (row.width == null || row.height == null || !row.publicPath.trim()) {
      continue;
    }
    const caption = entry.caption.trim();
    if (!caption) {
      continue;
    }
    const alt =
      row.alt.decorative === true
        ? ""
        : row.alt.alt.trim() || caption || fallbackTitle;
    items.push({
      src: row.publicPath,
      width: row.width,
      height: row.height,
      alt,
      caption,
      conceptLabel: entry.conceptLabel?.trim() || null,
    });
  }
  return items;
}

function buildSections(
  story: ProjectStoryRecord,
  idPrefix: string,
  galleryCount: number,
): PublicCaseStudySection[] {
  const sections: PublicCaseStudySection[] = [];

  const push = (
    key: CaseStudySectionKey,
    blocks: readonly StoryContentBlock[],
    extras?: { features?: readonly string[] },
  ) => {
    const projected = projectBlocks(blocks);
    const features =
      extras?.features?.map((item) => item.trim()).filter(Boolean) ?? [];
    if (projected.length === 0 && features.length === 0) {
      return;
    }
    sections.push({
      key,
      heading: CASE_STUDY_SECTION_HEADINGS[key],
      anchorId: `${idPrefix}${key}`,
      blocks: projected,
      features: features.length > 0 ? features : undefined,
    });
  };

  push("context", story.context);
  push("contribution", story.contribution);
  push("solution", story.solution, { features: story.features });
  if (story.processNotes.length > 0) {
    // Process notes append under solution as extra blocks when solution exists,
    // or as their own solution section content.
    const processBlocks = projectBlocks(story.processNotes);
    const existing = sections.find((section) => section.key === "solution");
    if (existing && processBlocks.length > 0) {
      sections.splice(sections.indexOf(existing), 1, {
        ...existing,
        blocks: [...existing.blocks, ...processBlocks],
      });
    } else if (processBlocks.length > 0) {
      sections.push({
        key: "solution",
        heading: CASE_STUDY_SECTION_HEADINGS.solution,
        anchorId: `${idPrefix}solution`,
        blocks: processBlocks,
      });
    }
  }

  if (galleryCount > 0) {
    sections.push({
      key: "gallery",
      heading: CASE_STUDY_SECTION_HEADINGS.gallery,
      anchorId: `${idPrefix}gallery`,
      blocks: [],
    });
  }

  const outcomes = story.outcomes.map((item) => item.trim()).filter(Boolean);
  if (outcomes.length > 0) {
    sections.push({
      key: "outcomes",
      heading: CASE_STUDY_SECTION_HEADINGS.outcomes,
      anchorId: `${idPrefix}outcomes`,
      blocks: [
        {
          type: "list",
          style: "bulleted",
          items: outcomes,
        },
      ],
    });
  }

  push("lessons", story.lessons);

  if (
    story.testimonial &&
    story.testimonial.publicationState === "approved" &&
    story.testimonial.quote.trim() &&
    story.testimonial.attribution.trim()
  ) {
    sections.push({
      key: "testimonial",
      heading: CASE_STUDY_SECTION_HEADINGS.testimonial,
      anchorId: `${idPrefix}testimonial`,
      blocks: [
        {
          type: "paragraph",
          text: story.testimonial.quote.trim(),
        },
        {
          type: "paragraph",
          text: story.testimonial.attribution.trim(),
        },
      ],
    });
  }

  // Ensure unique anchors even if keys somehow collide.
  const seen = new Set<string>();
  return sections.map((section) => {
    let anchorId = section.anchorId;
    if (seen.has(anchorId)) {
      anchorId = `${anchorId}-b`;
    }
    seen.add(anchorId);
    return { ...section, anchorId };
  });
}

/**
 * Project an approved public case study, or null when ineligible.
 * Draft/archived/summary-only never resolve.
 */
export function projectPublishedCaseStudy(
  repo: PublicProjectsRepository,
  slug: string,
  options?: {
    idPrefix?: string;
    relatedLimit?: number;
  },
): PublicCaseStudy | null {
  const project = repo.projects.find((row) => row.slug === slug);
  if (!project || !isProjectSummaryEligible(project)) {
    return null;
  }
  if (!isProjectStoryEligible(project, repo.workStoriesImplemented)) {
    return null;
  }
  const story = project.story;
  if (!story || story.publicationState !== "approved") {
    return null;
  }
  // Never trust storyPublicationState alone if body is missing/mismatched.
  if (project.storyPublicationState !== "approved") {
    return null;
  }

  const idPrefix = options?.idPrefix ?? "case-";
  const gallery = resolveGallery(story, repo.media, story.title);
  const sections = buildSections(story, idPrefix, gallery.length);
  const services = resolveServiceRefs(project, repo.services);
  const attribution = resolveAttribution(project);
  const technologies = story.technologies
    .map((item) => item.trim())
    .filter(Boolean);
  const outcomes = story.outcomes.map((item) => item.trim()).filter(Boolean);

  const testimonial =
    story.testimonial &&
    story.testimonial.publicationState === "approved" &&
    story.testimonial.quote.trim() &&
    story.testimonial.attribution.trim()
      ? {
          quote: story.testimonial.quote.trim(),
          attribution: story.testimonial.attribution.trim(),
        }
      : null;

  const relatedIds = repo.projects
    .filter(
      (row) =>
        row.id !== project.id &&
        isProjectSummaryEligible(row) &&
        row.serviceIds.some((id) => project.serviceIds.includes(id)),
    )
    .map((row) => row.id);

  // Prefer shared services; fall back to any other eligible summaries.
  const fallbackIds = repo.projects
    .filter((row) => row.id !== project.id && isProjectSummaryEligible(row))
    .map((row) => row.id);

  const relatedSource = relatedIds.length > 0 ? relatedIds : fallbackIds;
  const related = listPublishedRelatedProjectCards(
    repo,
    relatedSource,
    options?.relatedLimit ?? 3,
  ).filter((card) => card.id !== project.id);

  const title = story.title.trim() || project.title;
  const intro = story.intro.trim() || project.summary;

  return {
    id: project.id,
    slug: project.slug,
    title,
    intro,
    workStatus: project.workStatus,
    workStatusLabel: WORK_STATUS_LABELS[project.workStatus],
    cover: resolveCover(project, repo.media),
    facts: {
      contribution: project.zatrozContribution.trim() || null,
      workStatusLabel: WORK_STATUS_LABELS[project.workStatus],
      services,
      technologies,
      attribution,
    },
    sections,
    gallery,
    outcomes,
    testimonial,
    links: resolveLinks(project),
    related,
    pageTitle: `${title} — Zatroz`,
    pageDescription: intro.slice(0, 160),
    path: `/work/${project.slug}`,
  };
}

export function listPublishedCaseStudySlugs(
  repo: PublicProjectsRepository,
): string[] {
  return repo.projects
    .filter((project) =>
      isProjectStoryEligible(project, repo.workStoriesImplemented),
    )
    .filter(
      (project) =>
        project.story?.publicationState === "approved" &&
        project.storyPublicationState === "approved",
    )
    .map((project) => project.slug)
    .sort((a, b) => a.localeCompare(b));
}

/** Re-export card helper for specimens that already have a card. */
export { toPublicProjectCard };
