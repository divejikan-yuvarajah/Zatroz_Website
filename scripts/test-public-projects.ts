/**
 * Focused public-project selector tests (Step 37).
 * Run: npm run test:public-projects
 * Uses synthetic non-confidential fixtures — not seeded public portfolio data.
 */
import assert from "node:assert/strict";
import type { MediaRecord } from "../src/content/media";
import type { ProjectRecord } from "../src/content/projects";
import type { ServiceRecord } from "../src/content/services";
import {
  buildWorkListHref,
  getPublishedProjectCardBySlug,
  listPublishedFeaturedProjectCards,
  listPublishedProjectCards,
  parseWorkListSearchParams,
  toPublicProjectCard,
  type PublicProjectsRepository,
} from "../src/lib/public-projects";

function serviceStub(
  partial: Partial<ServiceRecord> &
    Pick<ServiceRecord, "id" | "slug" | "title">,
): ServiceRecord {
  return {
    routeId: "websitesEcommerce",
    publicationState: "approved",
    summary: "Summary",
    deliverables: [],
    relatedProjectIds: [],
    whoItSuits: "",
    problemsAddressed: "",
    exampleNotes: "",
    deliverySteps: "",
    clientInputs: "",
    scopeBoundaries: "",
    detail: null,
    ...partial,
  };
}

function projectStub(
  partial: Partial<ProjectRecord> &
    Pick<ProjectRecord, "id" | "slug" | "title" | "publicationState">,
): ProjectRecord {
  return {
    summary: "Public summary for tests.",
    workStatus: "prototype",
    editorialOrder: null,
    serviceIds: [],
    contributors: [],
    zatrozContribution: "Contribution",
    problem: "Problem",
    approach: "Approach",
    deliverables: [],
    verifiedOutcomes: [],
    mediaIds: [],
    publicLinks: [],
    storyPublicationState: null,
    story: null,
    ...partial,
  };
}

const services: ServiceRecord[] = [
  serviceStub({
    id: "svc-websites-ecommerce",
    slug: "websites-ecommerce",
    title: "Websites and E-commerce",
  }),
  serviceStub({
    id: "svc-ui-ux-design",
    slug: "ui-ux-design",
    title: "UI/UX Design",
    routeId: "uiUxDesign",
  }),
];

const media: MediaRecord[] = [
  {
    id: "media-draft",
    publicPath: "/images/projects/hidden.webp",
    width: 800,
    height: 500,
    publicationState: "draft",
    alt: { decorative: false, alt: "Draft cover" },
    caption: null,
  },
  {
    id: "media-public",
    publicPath: "/images/projects/specimen-ui-frame.svg",
    width: 800,
    height: 500,
    publicationState: "approved",
    alt: { decorative: false, alt: "Approved cover" },
    caption: "Caption",
  },
];

const projects: ProjectRecord[] = [
  projectStub({
    id: "proj-a",
    slug: "alpha-tool",
    title: "Alpha tool",
    publicationState: "approved",
    workStatus: "live-product",
    editorialOrder: 2,
    serviceIds: ["svc-websites-ecommerce"],
    mediaIds: ["media-draft"],
    publicLinks: [{ label: "Demo", href: "https://example.com/demo" }],
    storyPublicationState: null,
    contributors: ["Founder A"],
  }),
  projectStub({
    id: "proj-b",
    slug: "beta-app",
    title: "Beta app",
    publicationState: "approved",
    workStatus: "prototype",
    editorialOrder: 1,
    serviceIds: ["svc-ui-ux-design"],
    mediaIds: ["media-public"],
    storyPublicationState: "approved",
    story: {
      publicationState: "approved",
      title: "Beta app",
      intro: "A short approved story for selector tests.",
      context: [{ type: "paragraph", text: "Context for the specimen." }],
      contribution: [
        { type: "paragraph", text: "Contribution for the specimen." },
      ],
      solution: [{ type: "paragraph", text: "Solution for the specimen." }],
      features: ["One useful capability"],
      processNotes: [],
      gallery: [],
      technologies: ["TypeScript"],
      outcomes: ["Qualitative observation only"],
      lessons: [],
      testimonial: null,
      reviewNotes: "Internal only — must never appear in DTOs",
    },
  }),
  projectStub({
    id: "proj-draft",
    slug: "draft-secret",
    title: "Draft secret",
    publicationState: "draft",
    summary: "Must never appear in public DTOs",
    workStatus: "client-work",
    serviceIds: ["svc-websites-ecommerce"],
    storyPublicationState: "draft",
    story: {
      publicationState: "draft",
      title: "Draft secret story",
      intro: "Draft intro",
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
      reviewNotes: "secret review",
    },
  }),
  projectStub({
    id: "proj-archived",
    slug: "archived-old",
    title: "Archived old",
    publicationState: "archived",
    workStatus: "client-work",
  }),
];

function repo(
  overrides?: Partial<PublicProjectsRepository>,
): PublicProjectsRepository {
  return {
    projects,
    media,
    services,
    featuredProjectIds: ["proj-draft", "proj-b", "proj-a"],
    workStoriesImplemented: true,
    ...overrides,
  };
}

function run(name: string, fn: () => void) {
  fn();
  console.log(`PASS ${name}`);
}

run("excludes-unpublished-and-archived", () => {
  const result = listPublishedProjectCards(repo());
  assert.equal(result.total, 2);
  assert.deepEqual(
    result.items.map((item) => item.id),
    ["proj-b", "proj-a"],
  );
});

run("dto-omits-draft-fields-and-unapproved-media", () => {
  const card = toPublicProjectCard(projects[0]!, repo());
  const serialized = JSON.stringify(card);
  assert.equal(card.cover, null);
  assert.ok(!serialized.includes("Draft secret"));
  assert.ok(!serialized.includes("hidden.webp"));
  assert.ok(!serialized.includes("Must never appear"));
  assert.equal(card.storyLinkEligible, false);
  assert.equal(card.attribution, "Credited: Founder A");
});

run("counts-only-eligible-records", () => {
  const result = listPublishedProjectCards(repo(), {
    service: "websites-ecommerce",
  });
  assert.equal(result.total, 1);
  assert.equal(result.items[0]?.id, "proj-a");
});

run("summary-only-cards-never-link-to-story", () => {
  const card = getPublishedProjectCardBySlug(repo(), "alpha-tool");
  assert.ok(card);
  assert.equal(card.storyLinkEligible, false);
  assert.equal(card.storyPath, "/work/alpha-tool");
});

run("story-eligible-when-approved-and-enabled", () => {
  const card = getPublishedProjectCardBySlug(repo(), "beta-app");
  assert.ok(card);
  assert.equal(card.storyLinkEligible, true);
  assert.equal(card.cover?.src, "/images/projects/specimen-ui-frame.svg");
  const studyJson = JSON.stringify(
    // card must not contain internal review notes from the story body
    card,
  );
  assert.ok(!studyJson.includes("Internal only"));
});

run("story-disabled-when-work-stories-flag-off", () => {
  const card = getPublishedProjectCardBySlug(
    repo({ workStoriesImplemented: false }),
    "beta-app",
  );
  assert.ok(card);
  assert.equal(card.storyLinkEligible, false);
});

run("invalid-and-repeated-query-values-default", () => {
  assert.deepEqual(
    parseWorkListSearchParams({
      service: ["websites-ecommerce", "ui-ux-design"],
      status: "not-a-status",
      page: "0",
    }),
    { service: null, status: null, page: 1 },
  );
  assert.deepEqual(
    parseWorkListSearchParams({
      service: "websites-ecommerce",
      status: "prototype",
      page: "2",
    }),
    { service: "websites-ecommerce", status: "prototype", page: 2 },
  );
});

run("valid-filters-and-no-matches", () => {
  const none = listPublishedProjectCards(repo(), {
    service: "ai-automation",
  });
  assert.equal(none.total, 0);
  assert.equal(none.items.length, 0);
  assert.equal(none.pageCount, 0);
  assert.ok(none.availableServices.length >= 1);
});

run("page-bounds-and-stable-ordering", () => {
  const page1 = listPublishedProjectCards(repo(), { page: 1, pageSize: 1 });
  assert.equal(page1.items[0]?.id, "proj-b");
  assert.equal(page1.pageCount, 2);
  const page2 = listPublishedProjectCards(repo(), { page: 2, pageSize: 1 });
  assert.equal(page2.items[0]?.id, "proj-a");
  const overflow = listPublishedProjectCards(repo(), { page: 99, pageSize: 1 });
  assert.equal(overflow.page, 2);
  assert.equal(overflow.items[0]?.id, "proj-a");
});

run("featured-excludes-ineligible-projects", () => {
  const featured = listPublishedFeaturedProjectCards(repo(), 3);
  assert.deepEqual(
    featured.map((item) => item.id),
    ["proj-b", "proj-a"],
  );
});

run("build-work-list-href", () => {
  assert.equal(buildWorkListHref({}), "/work");
  assert.equal(
    buildWorkListHref({ service: "ui-ux-design", page: 2 }),
    "/work?service=ui-ux-design&page=2",
  );
});

console.log("Public project selector tests passed.");
