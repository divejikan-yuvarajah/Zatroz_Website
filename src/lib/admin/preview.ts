/**
 * Pure helpers: map Mongo draft snapshots → public DTOs for authenticated preview (A07).
 * Bypasses publication eligibility; never used by anonymous public selectors.
 */

import {
  CASE_STUDY_SECTION_HEADINGS,
  WORK_STATUS_LABELS,
  type CaseStudySectionKey,
  type StoryContentBlock,
} from "@/content/projects";
import { DRAFT_PLACEHOLDER } from "@/lib/admin/projects";
import type {
  PublicCaseStudy,
  PublicCaseStudyGalleryItem,
  PublicCaseStudySection,
  PublicStoryBlock,
} from "@/lib/public-case-study";
import type {
  PublicProjectCard,
  PublicProjectCover,
  PublicProjectLink,
  PublicProjectServiceRef,
} from "@/lib/public-projects";
import type {
  ProjectStorySnapshot,
  ProjectSummarySnapshot,
} from "@/lib/mongodb/models/types";
import type { ServiceSlug } from "@/types/content";

export type PreviewMediaAsset = Readonly<{
  mediaId: string;
  /** Prefer same-origin admin preview path so the browser sends auth cookies. */
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string | null;
}>;

export type PreviewServiceRef = Readonly<{
  id: string;
  slug: ServiceSlug;
  title: string;
}>;

function isSafePublicHref(href: string): boolean {
  const trimmed = href.trim();
  if (!trimmed || /^javascript:/i.test(trimmed)) {
    return false;
  }
  return (
    /^https:\/\//i.test(trimmed) ||
    (trimmed.startsWith("/") && !trimmed.startsWith("//"))
  );
}

function displayText(value: string): string {
  const trimmed = value.trim();
  if (!trimmed || trimmed === DRAFT_PLACEHOLDER) {
    return "";
  }
  return trimmed;
}

function projectBlocks(
  blocks: readonly StoryContentBlock[],
): PublicStoryBlock[] {
  const out: PublicStoryBlock[] = [];
  for (const block of blocks) {
    if (block.type === "paragraph") {
      const text = displayText(block.text);
      if (!text) continue;
      out.push({ type: "paragraph", text });
    } else {
      const items = block.items.map((item) => item.trim()).filter(Boolean);
      if (items.length === 0) continue;
      out.push({
        type: "list",
        style: block.style === "numbered" ? "numbered" : "bulleted",
        items,
      });
    }
  }
  return out;
}

function resolveLinks(summary: ProjectSummarySnapshot): PublicProjectLink[] {
  const links: PublicProjectLink[] = [];
  for (const link of summary.publicLinks) {
    if (!isSafePublicHref(link.href)) continue;
    links.push({ label: link.label, href: link.href.trim() });
  }
  return links;
}

function resolveServiceRefs(
  serviceIds: readonly string[],
  catalog: readonly PreviewServiceRef[],
): PublicProjectServiceRef[] {
  const refs: PublicProjectServiceRef[] = [];
  for (const id of serviceIds) {
    const service = catalog.find((row) => row.id === id);
    if (!service) continue;
    refs.push({
      id: service.id,
      slug: service.slug,
      title: service.title,
    });
  }
  return refs;
}

function resolveCover(
  summary: ProjectSummarySnapshot,
  mediaById: ReadonlyMap<string, PreviewMediaAsset>,
  fallbackTitle: string,
): PublicProjectCover | null {
  const coverId = summary.mediaIds[0];
  if (!coverId) return null;
  const asset = mediaById.get(coverId);
  if (!asset) return null;
  return {
    src: asset.src,
    width: asset.width,
    height: asset.height,
    alt: asset.alt || fallbackTitle,
    caption: asset.caption,
  };
}

function resolveGallery(
  story: ProjectStorySnapshot,
  mediaById: ReadonlyMap<string, PreviewMediaAsset>,
  fallbackTitle: string,
): PublicCaseStudyGalleryItem[] {
  const items: PublicCaseStudyGalleryItem[] = [];
  for (const entry of story.gallery) {
    const asset = mediaById.get(entry.mediaId);
    if (!asset) continue;
    const caption = entry.caption.trim();
    if (!caption) continue;
    items.push({
      src: asset.src,
      width: asset.width,
      height: asset.height,
      alt: asset.alt || caption || fallbackTitle,
      caption,
      conceptLabel: entry.conceptLabel?.trim() || null,
    });
  }
  return items;
}

function buildPreviewSections(
  story: ProjectStorySnapshot,
  idPrefix: string,
  galleryCount: number,
  includeDraftTestimonial: boolean,
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
    if (projected.length === 0 && features.length === 0) return;
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
      blocks: [{ type: "list", style: "bulleted", items: outcomes }],
    });
  }

  push("lessons", story.lessons);

  if (
    includeDraftTestimonial &&
    story.testimonial &&
    story.testimonial.quote.trim() &&
    story.testimonial.attribution.trim()
  ) {
    sections.push({
      key: "testimonial",
      heading: CASE_STUDY_SECTION_HEADINGS.testimonial,
      anchorId: `${idPrefix}testimonial`,
      blocks: [
        { type: "paragraph", text: story.testimonial.quote.trim() },
        { type: "paragraph", text: story.testimonial.attribution.trim() },
      ],
    });
  }

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

export function adminMediaPreviewPath(mediaId: string): string {
  return `/api/admin/media/${encodeURIComponent(mediaId)}/preview`;
}

export function isAdminMediaPreviewSrc(src: string): boolean {
  return src.startsWith("/api/admin/media/") && src.includes("/preview");
}

/**
 * Build a Work-card style preview from the draft summary (publication gates ignored).
 */
export function buildDraftSummaryCardPreview(input: {
  editorialId: string;
  draftSlug: string;
  summary: ProjectSummarySnapshot;
  mediaById: ReadonlyMap<string, PreviewMediaAsset>;
  services: readonly PreviewServiceRef[];
  /** When story body exists, still keep storyLinkEligible false — public route may 404. */
  hasStoryBody: boolean;
}): PublicProjectCard {
  const title = displayText(input.summary.title) || input.draftSlug;
  const summary =
    displayText(input.summary.summary) || "Summary draft pending.";
  const names = input.summary.contributors
    .map((name) => name.trim())
    .filter(Boolean);

  return {
    id: input.editorialId,
    slug: input.draftSlug,
    title,
    summary,
    workStatus: input.summary.workStatus,
    workStatusLabel: WORK_STATUS_LABELS[input.summary.workStatus],
    services: resolveServiceRefs(input.summary.serviceIds, input.services),
    cover: resolveCover(input.summary, input.mediaById, title),
    storyLinkEligible: false,
    links: resolveLinks(input.summary),
    attribution: names.length > 0 ? `Credited: ${names.join(", ")}` : null,
    storyPath: `/work/${input.draftSlug}`,
  };
}

/**
 * Build a case-study page DTO from draft summary + story for staff preview.
 * Includes draft testimonials; omits internal reviewNotes.
 */
export function buildDraftCaseStudyPreview(input: {
  editorialId: string;
  draftSlug: string;
  summary: ProjectSummarySnapshot;
  story: ProjectStorySnapshot;
  mediaById: ReadonlyMap<string, PreviewMediaAsset>;
  services: readonly PreviewServiceRef[];
  idPrefix?: string;
}): PublicCaseStudy {
  const idPrefix = input.idPrefix ?? "preview-";
  const title =
    displayText(input.story.title) ||
    displayText(input.summary.title) ||
    input.draftSlug;
  const intro =
    displayText(input.story.intro) ||
    displayText(input.summary.summary) ||
    "Intro draft pending.";

  const gallery = resolveGallery(input.story, input.mediaById, title);
  const sections = buildPreviewSections(
    input.story,
    idPrefix,
    gallery.length,
    true,
  );
  const contribution = displayText(input.summary.zatrozContribution);
  const names = input.summary.contributors
    .map((name) => name.trim())
    .filter(Boolean);
  const technologies = input.story.technologies
    .map((item) => item.trim())
    .filter(Boolean);
  const outcomes = input.story.outcomes
    .map((item) => item.trim())
    .filter(Boolean);

  const testimonial =
    input.story.testimonial &&
    input.story.testimonial.quote.trim() &&
    input.story.testimonial.attribution.trim()
      ? {
          quote: input.story.testimonial.quote.trim(),
          attribution: input.story.testimonial.attribution.trim(),
        }
      : null;

  return {
    id: input.editorialId,
    slug: input.draftSlug,
    title,
    intro,
    workStatus: input.summary.workStatus,
    workStatusLabel: WORK_STATUS_LABELS[input.summary.workStatus],
    cover: resolveCover(input.summary, input.mediaById, title),
    facts: {
      contribution: contribution || null,
      workStatusLabel: WORK_STATUS_LABELS[input.summary.workStatus],
      services: resolveServiceRefs(input.summary.serviceIds, input.services),
      technologies,
      attribution: names.length > 0 ? `Credited: ${names.join(", ")}` : null,
    },
    sections,
    gallery,
    outcomes,
    testimonial,
    links: resolveLinks(input.summary),
    related: [],
    pageTitle: `${title} — draft preview`,
    pageDescription: intro.slice(0, 160),
    path: `/work/${input.draftSlug}`,
  };
}

export function storyHasRenderableBody(
  story: ProjectStorySnapshot | null,
): boolean {
  if (!story) return false;
  const hasBlocks =
    projectBlocks(story.context).length > 0 ||
    projectBlocks(story.contribution).length > 0 ||
    projectBlocks(story.solution).length > 0 ||
    projectBlocks(story.processNotes).length > 0 ||
    projectBlocks(story.lessons).length > 0;
  const hasLists =
    story.features.some((f) => f.trim()) ||
    story.outcomes.some((o) => o.trim()) ||
    story.gallery.length > 0 ||
    Boolean(
      story.testimonial?.quote.trim() && story.testimonial?.attribution.trim(),
    );
  const hasIntro = Boolean(displayText(story.intro));
  return hasBlocks || hasLists || hasIntro;
}
