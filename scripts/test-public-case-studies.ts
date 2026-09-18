/**
 * Focused case-study selector and block projection tests (Step 38).
 * Run: npm run test:public-case-studies
 */
import assert from "node:assert/strict";
import type { MediaRecord } from "../src/content/media";
import type { ProjectRecord } from "../src/content/projects";
import type { ServiceRecord } from "../src/content/services";
import {
  listPublishedCaseStudySlugs,
  projectPublishedCaseStudy,
} from "../src/lib/public-case-study";
import type { PublicProjectsRepository } from "../src/lib/public-projects";

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
    serviceIds: ["svc-websites-ecommerce"],
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

const approvedStory = {
  publicationState: "approved" as const,
  title: "Published story",
  intro: "Intro for the published story.",
  context: [{ type: "paragraph" as const, text: "Context." }],
  contribution: [{ type: "paragraph" as const, text: "Contribution." }],
  solution: [{ type: "paragraph" as const, text: "Solution." }],
  features: ["Feature A"],
  processNotes: [],
  gallery: [
    {
      mediaId: "media-public",
      caption: "Approved screenshot caption",
      conceptLabel: "Prototype screen",
    },
    {
      mediaId: "media-draft",
      caption: "Should be excluded",
    },
  ],
  technologies: ["TypeScript"],
  outcomes: ["Qualitative observation"],
  lessons: [],
  testimonial: {
    quote: "Useful quote",
    attribution: "Named person",
    publicationState: "approved" as const,
  },
  reviewNotes: "SECRET_REVIEW_NOTES",
};

const services: ServiceRecord[] = [
  serviceStub({
    id: "svc-websites-ecommerce",
    slug: "websites-ecommerce",
    title: "Websites and E-commerce",
  }),
];

const media: MediaRecord[] = [
  {
    id: "media-draft",
    publicPath: "/images/projects/hidden.webp",
    width: 800,
    height: 500,
    publicationState: "draft",
    alt: { decorative: false, alt: "Draft" },
    caption: null,
  },
  {
    id: "media-public",
    publicPath: "/images/projects/specimen-ui-frame.svg",
    width: 800,
    height: 500,
    publicationState: "approved",
    alt: { decorative: false, alt: "Approved" },
    caption: null,
  },
];

const projects: ProjectRecord[] = [
  projectStub({
    id: "proj-published",
    slug: "published-story",
    title: "Published story",
    publicationState: "approved",
    storyPublicationState: "approved",
    story: approvedStory,
    mediaIds: ["media-public"],
  }),
  projectStub({
    id: "proj-summary-only",
    slug: "summary-only",
    title: "Summary only",
    publicationState: "approved",
    storyPublicationState: null,
    story: null,
  }),
  projectStub({
    id: "proj-draft-story",
    slug: "draft-story",
    title: "Draft story project",
    publicationState: "approved",
    storyPublicationState: "draft",
    story: {
      ...approvedStory,
      publicationState: "draft",
      title: "Draft story",
    },
  }),
  projectStub({
    id: "proj-archived",
    slug: "archived-project",
    title: "Archived project",
    publicationState: "archived",
    storyPublicationState: "approved",
    story: approvedStory,
  }),
];

function repo(
  overrides?: Partial<PublicProjectsRepository>,
): PublicProjectsRepository {
  return {
    projects,
    media,
    services,
    featuredProjectIds: [],
    workStoriesImplemented: true,
    ...overrides,
  };
}

function run(name: string, fn: () => void) {
  fn();
  console.log(`PASS ${name}`);
}

run("unknown-slug-returns-null", () => {
  assert.equal(projectPublishedCaseStudy(repo(), "missing"), null);
});

run("archived-project-returns-null", () => {
  assert.equal(projectPublishedCaseStudy(repo(), "archived-project"), null);
});

run("draft-story-returns-null", () => {
  assert.equal(projectPublishedCaseStudy(repo(), "draft-story"), null);
});

run("approved-summary-without-story-returns-null", () => {
  assert.equal(projectPublishedCaseStudy(repo(), "summary-only"), null);
});

run("published-story-projects", () => {
  const study = projectPublishedCaseStudy(repo(), "published-story");
  assert.ok(study);
  assert.equal(study.slug, "published-story");
  assert.equal(study.gallery.length, 1);
  assert.equal(study.gallery[0]?.conceptLabel, "Prototype screen");
  assert.ok(study.testimonial);
  const json = JSON.stringify(study);
  assert.ok(!json.includes("SECRET_REVIEW_NOTES"));
  assert.ok(!json.includes("hidden.webp"));
  assert.ok(study.sections.some((section) => section.key === "context"));
  assert.ok(!study.related.some((card) => card.slug === "published-story"));
});

run("stories-disabled-when-flag-off", () => {
  assert.equal(
    projectPublishedCaseStudy(
      repo({ workStoriesImplemented: false }),
      "published-story",
    ),
    null,
  );
});

run("slug-list-only-eligible", () => {
  assert.deepEqual(listPublishedCaseStudySlugs(repo()), ["published-story"]);
});

run("unsupported-block-types-are-not-projected", () => {
  const badBlocks = [
    { type: "html", html: "<script>alert(1)</script>" },
  ] as unknown as ProjectRecord["story"] extends infer S
    ? S extends { context: infer C }
      ? C
      : never
    : never;

  const badRepo = repo({
    projects: [
      projectStub({
        id: "proj-bad-block",
        slug: "bad-block",
        title: "Bad block",
        publicationState: "approved",
        storyPublicationState: "approved",
        story: {
          ...approvedStory,
          context: badBlocks,
        },
      }),
    ],
  });
  const study = projectPublishedCaseStudy(badRepo, "bad-block");
  assert.ok(study);
  const context = study.sections.find((section) => section.key === "context");
  assert.equal(context, undefined);
});

run("duplicate-anchors-are-unique", () => {
  const study = projectPublishedCaseStudy(repo(), "published-story", {
    idPrefix: "case-",
  });
  assert.ok(study);
  const anchors = study.sections.map((section) => section.anchorId);
  assert.equal(new Set(anchors).size, anchors.length);
});

console.log("Public case study tests passed.");
