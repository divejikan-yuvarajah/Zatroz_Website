/**
 * Unit tests for A07 authenticated draft preview mappers.
 */

import assert from "node:assert/strict";
import {
  adminMediaPreviewPath,
  buildDraftCaseStudyPreview,
  buildDraftSummaryCardPreview,
  isAdminMediaPreviewSrc,
  storyHasRenderableBody,
  type PreviewMediaAsset,
} from "../src/lib/admin/preview";
import { DRAFT_PLACEHOLDER } from "../src/lib/admin/projects";
import type {
  ProjectStorySnapshot,
  ProjectSummarySnapshot,
} from "../src/lib/mongodb/models/types";

let passed = 0;

function pass(name: string) {
  passed += 1;
  console.log(`ok — ${name}`);
}

const summary: ProjectSummarySnapshot = {
  title: "Flow Pilot",
  summary: "Short card summary.",
  workStatus: "prototype",
  serviceIds: ["svc-ai-automation"],
  contributors: ["Ada"],
  zatrozContribution: "Product design",
  problem: DRAFT_PLACEHOLDER,
  approach: DRAFT_PLACEHOLDER,
  deliverables: [],
  verifiedOutcomes: [],
  mediaIds: ["med_cover"],
  publicLinks: [{ label: "Demo", href: "https://example.com" }],
  editorialOrder: null,
};

const story: ProjectStorySnapshot = {
  title: "Flow Pilot story",
  intro: "Lead paragraph for the case study.",
  context: [{ type: "paragraph", text: "Context body." }],
  contribution: [],
  solution: [
    { type: "list", style: "bulleted", items: ["Built intake", "Shipped MVP"] },
  ],
  features: ["Dashboard"],
  processNotes: [],
  gallery: [
    { mediaId: "med_g1", caption: "Overview screen", conceptLabel: null },
  ],
  technologies: ["Next.js"],
  outcomes: ["Clearer path"],
  lessons: [],
  testimonial: {
    quote: "Helpful.",
    attribution: "Client",
    publicationState: "draft",
  },
  reviewNotes: "Internal only",
};

const mediaById = new Map<string, PreviewMediaAsset>([
  [
    "med_cover",
    {
      mediaId: "med_cover",
      src: adminMediaPreviewPath("med_cover"),
      width: 1200,
      height: 800,
      alt: "Cover",
      caption: null,
    },
  ],
  [
    "med_g1",
    {
      mediaId: "med_g1",
      src: adminMediaPreviewPath("med_g1"),
      width: 1000,
      height: 700,
      alt: "Gallery",
      caption: "Cap",
    },
  ],
]);

function runPaths() {
  const path = adminMediaPreviewPath("med_abc");
  assert.equal(path, "/api/admin/media/med_abc/preview");
  assert.equal(isAdminMediaPreviewSrc(path), true);
  assert.equal(isAdminMediaPreviewSrc("/images/public.jpg"), false);
  pass("preview-media-paths");
}

function runCardPreview() {
  const card = buildDraftSummaryCardPreview({
    editorialId: "proj-flow-pilot",
    draftSlug: "flow-pilot",
    summary,
    mediaById,
    services: [
      {
        id: "svc-ai-automation",
        slug: "ai-automation",
        title: "AI and Automation",
      },
    ],
    hasStoryBody: true,
  });
  assert.equal(card.title, "Flow Pilot");
  assert.equal(card.storyLinkEligible, false);
  assert.ok(card.cover);
  assert.equal(isAdminMediaPreviewSrc(card.cover!.src), true);
  assert.equal(card.services[0]?.slug, "ai-automation");
  pass("summary-card-preview");
}

function runCaseStudyPreview() {
  assert.equal(storyHasRenderableBody(story), true);
  assert.equal(storyHasRenderableBody(null), false);

  const study = buildDraftCaseStudyPreview({
    editorialId: "proj-flow-pilot",
    draftSlug: "flow-pilot",
    summary,
    story,
    mediaById,
    services: [
      {
        id: "svc-ai-automation",
        slug: "ai-automation",
        title: "AI and Automation",
      },
    ],
  });

  assert.equal(study.title, "Flow Pilot story");
  assert.ok(study.sections.some((s) => s.key === "context"));
  assert.ok(study.sections.some((s) => s.key === "gallery"));
  assert.ok(study.testimonial);
  assert.equal(study.gallery.length, 1);
  assert.equal(isAdminMediaPreviewSrc(study.gallery[0]!.src), true);
  // reviewNotes must never appear on the public DTO shape
  assert.equal(
    Object.prototype.hasOwnProperty.call(study, "reviewNotes"),
    false,
  );
  pass("case-study-preview-dto");
}

function runPlaceholderIntro() {
  const emptyIntroStory: ProjectStorySnapshot = {
    ...story,
    intro: DRAFT_PLACEHOLDER,
    context: [],
    contribution: [],
    solution: [],
    features: [],
    processNotes: [],
    gallery: [],
    technologies: [],
    outcomes: [],
    lessons: [],
    testimonial: null,
  };
  // Only placeholder intro → not a renderable body for full preview
  assert.equal(storyHasRenderableBody(emptyIntroStory), false);
  pass("empty-story-detection");
}

runPaths();
runCardPreview();
runCaseStudyPreview();
runPlaceholderIntro();
console.log(`\n${passed} checks passed`);
