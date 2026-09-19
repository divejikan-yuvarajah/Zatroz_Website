/**
 * Unit tests for A08 publish readiness and slug-redirect helpers.
 */

import assert from "node:assert/strict";
import {
  assessStoryPublishReadiness,
  assessSummaryPublishReadiness,
  classifyAdminPublication,
  getProjectPublicationStatus,
  willCreateSlugRedirect,
} from "../src/lib/admin/publish";
import { DRAFT_PLACEHOLDER } from "../src/lib/admin/projects";
import type {
  ProjectDocument,
  ProjectStorySnapshot,
  ProjectSummarySnapshot,
} from "../src/lib/mongodb/models/types";

let passed = 0;

function pass(name: string) {
  passed += 1;
  console.log(`ok — ${name}`);
}

function baseProject(
  overrides: Partial<ProjectDocument> = {},
): ProjectDocument {
  return {
    schemaVersion: 1,
    editorialId: "proj-flow-pilot",
    draftSlug: "flow-pilot",
    draftTitle: "Flow Pilot",
    workStatus: "prototype",
    draftRevisionId: "rev_draft_1",
    publishedSummaryRevisionId: null,
    publishedStoryRevisionId: null,
    canonicalPublishedSlug: null,
    concurrencyVersion: 1,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    ...overrides,
  };
}

const readySummary: ProjectSummarySnapshot = {
  title: "Flow Pilot",
  summary: "Short card summary for Work.",
  workStatus: "prototype",
  serviceIds: ["svc-ai-automation"],
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

const emptyStory: ProjectStorySnapshot = {
  title: DRAFT_PLACEHOLDER,
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
  reviewNotes: null,
};

const readyStory: ProjectStorySnapshot = {
  ...emptyStory,
  title: "Flow Pilot story",
  intro: "Lead paragraph.",
  context: [{ type: "paragraph", text: "Context body." }],
};

function runSummaryReadiness() {
  const missingDraft = assessSummaryPublishReadiness({
    project: baseProject({ draftRevisionId: null }),
    summary: readySummary,
  });
  assert.equal(missingDraft.ok, false);
  if (!missingDraft.ok) assert.equal(missingDraft.code, "no-draft-revision");

  const placeholderTitle = assessSummaryPublishReadiness({
    project: baseProject(),
    summary: { ...readySummary, title: DRAFT_PLACEHOLDER },
  });
  assert.equal(placeholderTitle.ok, false);
  if (!placeholderTitle.ok)
    assert.equal(placeholderTitle.code, "title-required");

  const ok = assessSummaryPublishReadiness({
    project: baseProject(),
    summary: readySummary,
  });
  assert.equal(ok.ok, true);
  pass("summary-publish-readiness");
}

function runStoryReadiness() {
  const beforeSummary = assessStoryPublishReadiness({
    project: baseProject(),
    story: readyStory,
  });
  assert.equal(beforeSummary.ok, false);
  if (!beforeSummary.ok) {
    assert.equal(beforeSummary.code, "summary-not-published");
  }

  const empty = assessStoryPublishReadiness({
    project: baseProject({
      publishedSummaryRevisionId: "rev_pub_summary",
    }),
    story: emptyStory,
  });
  assert.equal(empty.ok, false);
  if (!empty.ok) assert.equal(empty.code, "story-empty");

  const ok = assessStoryPublishReadiness({
    project: baseProject({
      publishedSummaryRevisionId: "rev_pub_summary",
    }),
    story: readyStory,
  });
  assert.equal(ok.ok, true);
  pass("story-publish-readiness");
}

function runSlugRedirect() {
  assert.equal(
    willCreateSlugRedirect({
      previousCanonicalSlug: null,
      nextSlug: "flow-pilot",
    }),
    false,
  );
  assert.equal(
    willCreateSlugRedirect({
      previousCanonicalSlug: "flow-pilot",
      nextSlug: "flow-pilot",
    }),
    false,
  );
  assert.equal(
    willCreateSlugRedirect({
      previousCanonicalSlug: "old-slug",
      nextSlug: "flow-pilot",
    }),
    true,
  );

  const status = getProjectPublicationStatus(
    baseProject({
      publishedSummaryRevisionId: "rev_1",
      canonicalPublishedSlug: "old-slug",
      draftSlug: "flow-pilot",
    }),
  );
  assert.equal(status.summaryPublished, true);
  assert.equal(status.storyPublished, false);
  assert.equal(status.slugWillRedirectOnPublish, true);
  pass("slug-redirect-helpers");
}

function runClassify() {
  assert.equal(
    classifyAdminPublication({ publishedSummaryRevisionId: null }),
    "draft",
  );
  assert.equal(
    classifyAdminPublication({
      publishedSummaryRevisionId: "rev_1",
    }),
    "published",
  );
  assert.equal(
    classifyAdminPublication({
      publishedSummaryRevisionId: "rev_1",
      archived: true,
    }),
    "archived",
  );
  pass("classify-admin-publication");
}

runSummaryReadiness();
runStoryReadiness();
runSlugRedirect();
runClassify();

console.log(`\n${passed} checks passed`);
