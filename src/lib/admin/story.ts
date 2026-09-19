/**
 * Pure helpers for admin case-study (story) draft editing — A06.
 * Blocks are paragraph | list only; no HTML/MDX/scripts.
 */

import {
  PROJECT_STORY_LIMITS,
  type ProjectStoryGalleryItem,
  type ProjectStoryTestimonial,
  type StoryContentBlock,
  type StoryListBlock,
  type StoryParagraphBlock,
} from "@/content/projects";
import { DRAFT_PLACEHOLDER } from "@/lib/admin/projects";
import { DB_ARRAY_LIMITS, DB_STRING_LIMITS } from "@/lib/mongodb/limits";
import type { ProjectStorySnapshot } from "@/lib/mongodb/models/types";
import type { PublicationState } from "@/types/content";

export type StorySectionKey =
  "context" | "contribution" | "solution" | "processNotes" | "lessons";

export const STORY_BLOCK_SECTION_KEYS: readonly StorySectionKey[] = [
  "context",
  "contribution",
  "solution",
  "processNotes",
  "lessons",
] as const;

export const STORY_BLOCK_SECTION_LABELS: Readonly<
  Record<StorySectionKey, string>
> = {
  context: "Context and problem",
  contribution: "Contribution and scope",
  solution: "Solution",
  processNotes: "Process notes",
  lessons: "Limitations and lessons",
};

export type StoryDraftFormValues = Readonly<{
  title: string;
  intro: string;
  context: readonly StoryContentBlock[];
  contribution: readonly StoryContentBlock[];
  solution: readonly StoryContentBlock[];
  features: readonly string[];
  processNotes: readonly StoryContentBlock[];
  gallery: readonly ProjectStoryGalleryItem[];
  technologies: readonly string[];
  outcomes: readonly string[];
  lessons: readonly StoryContentBlock[];
  testimonial: ProjectStoryTestimonial | null;
  reviewNotes: string;
}>;

export type StoryDraftParseResult =
  | { ok: true; values: StoryDraftFormValues }
  | { ok: false; message: string; field?: string };

export function emptyParagraphBlock(): StoryParagraphBlock {
  return { type: "paragraph", text: "" };
}

export function emptyListBlock(
  style: "bulleted" | "numbered" = "bulleted",
): StoryListBlock {
  return { type: "list", style, items: [""] };
}

export function moveItem<T>(
  items: readonly T[],
  index: number,
  direction: "up" | "down",
): T[] {
  const next = [...items];
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || index >= next.length) return next;
  if (target < 0 || target >= next.length) return next;
  const tmp = next[index]!;
  next[index] = next[target]!;
  next[target] = tmp;
  return next;
}

function isPublicationState(value: string): value is PublicationState {
  return value === "draft" || value === "approved" || value === "archived";
}

function validateParagraph(
  block: unknown,
  field: string,
): { ok: true; block: StoryParagraphBlock } | { ok: false; message: string } {
  if (!block || typeof block !== "object") {
    return { ok: false, message: `${field}: invalid paragraph block.` };
  }
  const text = String((block as { text?: unknown }).text ?? "").trim();
  if (!text) {
    return { ok: false, message: `${field}: paragraph text cannot be empty.` };
  }
  if (text.length > PROJECT_STORY_LIMITS.blockTextMax) {
    return {
      ok: false,
      message: `${field}: paragraph exceeds ${PROJECT_STORY_LIMITS.blockTextMax} characters.`,
    };
  }
  return { ok: true, block: { type: "paragraph", text } };
}

function validateList(
  block: unknown,
  field: string,
): { ok: true; block: StoryListBlock } | { ok: false; message: string } {
  if (!block || typeof block !== "object") {
    return { ok: false, message: `${field}: invalid list block.` };
  }
  const raw = block as { style?: unknown; items?: unknown };
  const style = raw.style === "numbered" ? "numbered" : "bulleted";
  const itemsRaw = Array.isArray(raw.items) ? raw.items : [];
  const items = itemsRaw
    .map((item) => String(item ?? "").trim())
    .filter(Boolean);
  if (items.length === 0) {
    return { ok: false, message: `${field}: list needs at least one item.` };
  }
  if (items.length > PROJECT_STORY_LIMITS.maxListItems) {
    return {
      ok: false,
      message: `${field}: at most ${PROJECT_STORY_LIMITS.maxListItems} list items.`,
    };
  }
  for (const item of items) {
    if (item.length > PROJECT_STORY_LIMITS.listItemMax) {
      return {
        ok: false,
        message: `${field}: list item exceeds ${PROJECT_STORY_LIMITS.listItemMax} characters.`,
      };
    }
  }
  return { ok: true, block: { type: "list", style, items } };
}

export function validateStoryBlocks(
  blocks: unknown,
  field: string,
): { ok: true; blocks: StoryContentBlock[] } | { ok: false; message: string } {
  if (!Array.isArray(blocks)) {
    return { ok: false, message: `${field} must be an array of blocks.` };
  }
  if (blocks.length > PROJECT_STORY_LIMITS.maxBlocksPerSection) {
    return {
      ok: false,
      message: `${field}: at most ${PROJECT_STORY_LIMITS.maxBlocksPerSection} blocks.`,
    };
  }
  const out: StoryContentBlock[] = [];
  for (let i = 0; i < blocks.length; i += 1) {
    const raw = blocks[i];
    const type =
      raw && typeof raw === "object"
        ? String((raw as { type?: unknown }).type ?? "")
        : "";
    if (type === "paragraph") {
      const checked = validateParagraph(raw, `${field}[${i}]`);
      if (!checked.ok) return checked;
      out.push(checked.block);
    } else if (type === "list") {
      const checked = validateList(raw, `${field}[${i}]`);
      if (!checked.ok) return checked;
      out.push(checked.block);
    } else {
      return {
        ok: false,
        message: `${field}[${i}]: only paragraph and list blocks are allowed.`,
      };
    }
  }
  return { ok: true, blocks: out };
}

export function validateGalleryItems(
  items: unknown,
):
  | { ok: true; gallery: ProjectStoryGalleryItem[] }
  | { ok: false; message: string } {
  if (!Array.isArray(items)) {
    return { ok: false, message: "Gallery must be an array." };
  }
  if (items.length > DB_ARRAY_LIMITS.maxGalleryItems) {
    return {
      ok: false,
      message: `At most ${DB_ARRAY_LIMITS.maxGalleryItems} gallery items.`,
    };
  }
  const gallery: ProjectStoryGalleryItem[] = [];
  for (let i = 0; i < items.length; i += 1) {
    const raw = items[i];
    if (!raw || typeof raw !== "object") {
      return { ok: false, message: `Gallery item ${i + 1} is invalid.` };
    }
    const mediaId = String((raw as { mediaId?: unknown }).mediaId ?? "").trim();
    const caption = String((raw as { caption?: unknown }).caption ?? "").trim();
    const conceptRaw = (raw as { conceptLabel?: unknown }).conceptLabel;
    const conceptLabel =
      conceptRaw === null || conceptRaw === undefined
        ? null
        : String(conceptRaw).trim() || null;

    if (!mediaId) {
      return {
        ok: false,
        message: `Gallery item ${i + 1}: media id is required.`,
      };
    }
    if (mediaId.length > DB_STRING_LIMITS.mediaIdMax) {
      return {
        ok: false,
        message: `Gallery item ${i + 1}: media id is too long.`,
      };
    }
    if (!caption) {
      return {
        ok: false,
        message: `Gallery item ${i + 1}: caption is required.`,
      };
    }
    if (caption.length > DB_STRING_LIMITS.captionMax) {
      return {
        ok: false,
        message: `Gallery item ${i + 1}: caption is too long.`,
      };
    }
    if (conceptLabel && conceptLabel.length > 120) {
      return {
        ok: false,
        message: `Gallery item ${i + 1}: concept label is too long.`,
      };
    }
    gallery.push({
      mediaId,
      caption,
      conceptLabel,
    });
  }
  return { ok: true, gallery };
}

function validateStringList(
  items: unknown,
  field: string,
  maxItems: number,
  maxLen: number,
): { ok: true; items: string[] } | { ok: false; message: string } {
  if (!Array.isArray(items)) {
    return { ok: false, message: `${field} must be an array.` };
  }
  const cleaned = items.map((v) => String(v ?? "").trim()).filter(Boolean);
  if (cleaned.length > maxItems) {
    return { ok: false, message: `${field}: at most ${maxItems} items.` };
  }
  for (const item of cleaned) {
    if (item.length > maxLen) {
      return {
        ok: false,
        message: `${field}: each item must be at most ${maxLen} characters.`,
      };
    }
  }
  return { ok: true, items: cleaned };
}

export function parseStoryDraftPayload(raw: unknown): StoryDraftParseResult {
  if (!raw || typeof raw !== "object") {
    return { ok: false, message: "Story payload is missing or invalid." };
  }
  const data = raw as Record<string, unknown>;

  const title = String(data.title ?? "").trim();
  if (!title) {
    return { ok: false, message: "Story title is required.", field: "title" };
  }
  if (title.length > PROJECT_STORY_LIMITS.titleMax) {
    return {
      ok: false,
      message: `Title must be at most ${PROJECT_STORY_LIMITS.titleMax} characters.`,
      field: "title",
    };
  }

  let intro = String(data.intro ?? "").trim();
  if (!intro) intro = DRAFT_PLACEHOLDER;
  if (intro.length > PROJECT_STORY_LIMITS.introMax) {
    return {
      ok: false,
      message: `Intro must be at most ${PROJECT_STORY_LIMITS.introMax} characters.`,
      field: "intro",
    };
  }

  const sections: Partial<Record<StorySectionKey, StoryContentBlock[]>> = {};
  for (const key of STORY_BLOCK_SECTION_KEYS) {
    const checked = validateStoryBlocks(data[key] ?? [], key);
    if (!checked.ok) {
      return { ok: false, message: checked.message, field: key };
    }
    sections[key] = checked.blocks;
  }

  const features = validateStringList(
    data.features ?? [],
    "features",
    DB_ARRAY_LIMITS.maxFeatures,
    DB_STRING_LIMITS.featureMax,
  );
  if (!features.ok) {
    return { ok: false, message: features.message, field: "features" };
  }

  const technologies = validateStringList(
    data.technologies ?? [],
    "technologies",
    DB_ARRAY_LIMITS.maxTechnologies,
    DB_STRING_LIMITS.technologyMax,
  );
  if (!technologies.ok) {
    return {
      ok: false,
      message: technologies.message,
      field: "technologies",
    };
  }

  const outcomes = validateStringList(
    data.outcomes ?? [],
    "outcomes",
    DB_ARRAY_LIMITS.maxOutcomes,
    DB_STRING_LIMITS.outcomeMax,
  );
  if (!outcomes.ok) {
    return { ok: false, message: outcomes.message, field: "outcomes" };
  }

  const gallery = validateGalleryItems(data.gallery ?? []);
  if (!gallery.ok) {
    return { ok: false, message: gallery.message, field: "gallery" };
  }

  let testimonial: ProjectStoryTestimonial | null = null;
  const testimonialRaw = data.testimonial;
  if (testimonialRaw && typeof testimonialRaw === "object") {
    const quote = String(
      (testimonialRaw as { quote?: unknown }).quote ?? "",
    ).trim();
    const attribution = String(
      (testimonialRaw as { attribution?: unknown }).attribution ?? "",
    ).trim();
    const pubRaw = String(
      (testimonialRaw as { publicationState?: unknown }).publicationState ??
        "draft",
    ).trim();
    if (quote || attribution) {
      if (!quote || !attribution) {
        return {
          ok: false,
          message:
            "Testimonial needs both quote and attribution, or leave both empty.",
          field: "testimonial",
        };
      }
      if (quote.length > PROJECT_STORY_LIMITS.testimonialQuoteMax) {
        return {
          ok: false,
          message: "Testimonial quote is too long.",
          field: "testimonial",
        };
      }
      if (attribution.length > PROJECT_STORY_LIMITS.testimonialAttributionMax) {
        return {
          ok: false,
          message: "Testimonial attribution is too long.",
          field: "testimonial",
        };
      }
      if (!isPublicationState(pubRaw)) {
        return {
          ok: false,
          message: "Invalid testimonial publication state.",
          field: "testimonial",
        };
      }
      testimonial = {
        quote,
        attribution,
        publicationState: pubRaw,
      };
    }
  }

  const reviewNotes = String(data.reviewNotes ?? "")
    .trim()
    .slice(0, DB_STRING_LIMITS.reviewNotesMax);

  return {
    ok: true,
    values: {
      title,
      intro,
      context: sections.context ?? [],
      contribution: sections.contribution ?? [],
      solution: sections.solution ?? [],
      features: features.items,
      processNotes: sections.processNotes ?? [],
      gallery: gallery.gallery,
      technologies: technologies.items,
      outcomes: outcomes.items,
      lessons: sections.lessons ?? [],
      testimonial,
      reviewNotes,
    },
  };
}

export function parseStoryDraftFormData(
  formData: FormData,
): StoryDraftParseResult {
  const raw = String(formData.get("storyPayload") ?? "").trim();
  if (!raw) {
    return { ok: false, message: "Story payload is missing." };
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return { ok: false, message: "Story payload is not valid JSON." };
  }
  return parseStoryDraftPayload(parsed);
}

export function buildStorySnapshot(
  values: StoryDraftFormValues,
): ProjectStorySnapshot {
  return {
    title: values.title,
    intro: values.intro || DRAFT_PLACEHOLDER,
    context: values.context.map((b) =>
      b.type === "paragraph"
        ? { type: "paragraph", text: b.text }
        : { type: "list", style: b.style, items: [...b.items] },
    ),
    contribution: values.contribution.map((b) =>
      b.type === "paragraph"
        ? { type: "paragraph", text: b.text }
        : { type: "list", style: b.style, items: [...b.items] },
    ),
    solution: values.solution.map((b) =>
      b.type === "paragraph"
        ? { type: "paragraph", text: b.text }
        : { type: "list", style: b.style, items: [...b.items] },
    ),
    features: [...values.features],
    processNotes: values.processNotes.map((b) =>
      b.type === "paragraph"
        ? { type: "paragraph", text: b.text }
        : { type: "list", style: b.style, items: [...b.items] },
    ),
    gallery: values.gallery.map((g) => ({
      mediaId: g.mediaId,
      caption: g.caption,
      conceptLabel: g.conceptLabel ?? null,
    })),
    technologies: [...values.technologies],
    outcomes: [...values.outcomes],
    lessons: values.lessons.map((b) =>
      b.type === "paragraph"
        ? { type: "paragraph", text: b.text }
        : { type: "list", style: b.style, items: [...b.items] },
    ),
    testimonial: values.testimonial
      ? {
          quote: values.testimonial.quote,
          attribution: values.testimonial.attribution,
          publicationState: values.testimonial.publicationState,
        }
      : null,
    ...(values.reviewNotes ? { reviewNotes: values.reviewNotes } : {}),
  };
}

export function formValuesFromStory(
  story: ProjectStorySnapshot | null,
  fallbackTitle: string,
): StoryDraftFormValues {
  return {
    title: story?.title ?? fallbackTitle,
    intro: story?.intro === DRAFT_PLACEHOLDER ? "" : (story?.intro ?? ""),
    context: story?.context ?? [],
    contribution: story?.contribution ?? [],
    solution: story?.solution ?? [],
    features: story?.features ?? [],
    processNotes: story?.processNotes ?? [],
    gallery: story?.gallery ?? [],
    technologies: story?.technologies ?? [],
    outcomes: story?.outcomes ?? [],
    lessons: story?.lessons ?? [],
    testimonial: story?.testimonial ?? null,
    reviewNotes: story?.reviewNotes ?? "",
  };
}
