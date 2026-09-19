/**
 * Unit tests for A10 repository → Mongo portfolio migration planner.
 */

import assert from "node:assert/strict";
import type { MediaRecord } from "../src/content/media";
import type { ProjectRecord } from "../src/content/projects";
import {
  formatRepoPortfolioPlan,
  planRepoPortfolioMigration,
  REPO_PORTFOLIO_MIGRATION_ID,
} from "../src/lib/admin/repo-migration";
import { buildCatalogRepoPortfolioPlan } from "../src/lib/mongodb/repo-portfolio-migration";

let passed = 0;

function pass(name: string) {
  passed += 1;
  console.log(`ok — ${name}`);
}

const draftProject: ProjectRecord = {
  id: "proj-draft-demo",
  slug: "draft-demo",
  title: "Draft Demo",
  summary: "Draft only.",
  publicationState: "draft",
  workStatus: "prototype",
  editorialOrder: null,
  serviceIds: ["svc-ai-automation"],
  contributors: [],
  zatrozContribution: "Design",
  problem: "Problem",
  approach: "Approach",
  deliverables: [],
  verifiedOutcomes: [],
  mediaIds: [],
  publicLinks: [],
  storyPublicationState: null,
  story: null,
};

const publishedProject: ProjectRecord = {
  ...draftProject,
  id: "proj-live-demo",
  slug: "live-demo",
  title: "Live Demo",
  summary: "Published summary.",
  publicationState: "approved",
  storyPublicationState: "approved",
  story: {
    publicationState: "approved",
    title: "Live Demo story",
    intro: "Intro",
    context: [{ type: "paragraph", text: "Context" }],
    contribution: [],
    solution: [],
    features: [],
    processNotes: [],
    gallery: [],
    technologies: ["Next.js"],
    outcomes: ["Shipped"],
    lessons: [],
    testimonial: null,
  },
};

const archivedProject: ProjectRecord = {
  ...draftProject,
  id: "proj-archived",
  slug: "archived",
  publicationState: "archived",
};

const approvedMedia: MediaRecord = {
  id: "media-demo",
  publicPath: "/images/projects/demo.webp",
  width: 1200,
  height: 800,
  publicationState: "approved",
  alt: { decorative: false, alt: "Demo screen" },
  caption: "Overview",
};

function runEmptyCatalog() {
  const plan = buildCatalogRepoPortfolioPlan();
  assert.equal(plan.migrationId, REPO_PORTFOLIO_MIGRATION_ID);
  assert.equal(plan.counts.projectInsert, 0);
  assert.equal(plan.counts.mediaInsert, 0);
  assert.equal(plan.counts.publishedSummaries, 0);
  assert.ok(plan.notes.some((n) => n.includes("empty")));
  pass("empty-catalog-noop");
}

function runDraftNeverPublishes() {
  const plan = planRepoPortfolioMigration({
    projects: [draftProject],
    media: [],
    featuredProjectIds: ["proj-draft-demo"],
  });
  assert.equal(plan.projects.length, 1);
  assert.equal(plan.projects[0]?.publishSummary, false);
  assert.equal(plan.projects[0]?.publishStory, false);
  assert.equal(plan.featuredToWrite.length, 0);
  pass("draft-never-auto-publishes");
}

function runApprovedPublishes() {
  const plan = planRepoPortfolioMigration({
    projects: [publishedProject],
    media: [approvedMedia],
    featuredProjectIds: ["proj-live-demo", "proj-unknown"],
  });
  assert.equal(plan.projects[0]?.publishSummary, true);
  assert.equal(plan.projects[0]?.publishStory, true);
  assert.equal(plan.media[0]?.visibility, "public");
  assert.equal(plan.media[0]?.processingState, "ready");
  assert.deepEqual(plan.featuredToWrite, ["proj-live-demo"]);
  assert.ok(plan.notes.some((n) => n.includes("proj-unknown")));
  pass("approved-publishes-and-features");
}

function runIdempotentSkip() {
  const plan = planRepoPortfolioMigration({
    projects: [publishedProject],
    media: [approvedMedia],
    featuredProjectIds: [],
    existingEditorialIds: new Set(["proj-live-demo"]),
    existingMediaIds: new Set(["media-demo"]),
  });
  assert.equal(plan.projects[0]?.action, "skip-existing");
  assert.equal(plan.media[0]?.action, "skip-existing");
  assert.equal(plan.counts.projectInsert, 0);
  assert.equal(plan.counts.mediaInsert, 0);
  pass("idempotent-skip-existing");
}

function runArchivedSkipped() {
  const plan = planRepoPortfolioMigration({
    projects: [archivedProject],
    media: [],
    featuredProjectIds: [],
  });
  assert.equal(plan.projects.length, 0);
  assert.equal(plan.counts.skippedArchivedProjects, 1);
  pass("archived-projects-skipped");
}

function runFormat() {
  const plan = planRepoPortfolioMigration({
    projects: [],
    media: [],
    featuredProjectIds: [],
  });
  const text = formatRepoPortfolioPlan(plan);
  assert.ok(text.includes(REPO_PORTFOLIO_MIGRATION_ID));
  pass("format-plan");
}

runEmptyCatalog();
runDraftNeverPublishes();
runApprovedPublishes();
runIdempotentSkip();
runArchivedSkipped();
runFormat();

console.log(`\n${passed} checks passed`);
