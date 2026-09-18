import { CaseStudyPage } from "@/components/sections/case-study-page";
import type { MediaRecord } from "@/content/media";
import type { ProjectRecord } from "@/content/projects";
import { contentCatalog } from "@/content/catalog";
import { projectPublishedCaseStudy } from "@/lib/public-case-study";
import type { PublicProjectsRepository } from "@/lib/public-projects";
import { resolveServicesEnquiryCta } from "@/server/services";

const SPECIMEN_MEDIA: readonly MediaRecord[] = [
  {
    id: "media-specimen-frame",
    publicPath: "/images/projects/specimen-ui-frame.svg",
    width: 960,
    height: 600,
    publicationState: "approved",
    alt: { decorative: false, alt: "Specimen interface frame" },
    caption: "Gallery fixture frame — not project evidence",
  },
];

function baseStoryProject(
  partial: Pick<ProjectRecord, "id" | "slug" | "title"> &
    Partial<ProjectRecord>,
): ProjectRecord {
  return {
    summary: "Gallery specimen summary — not a published portfolio entry.",
    publicationState: "approved",
    workStatus: "prototype",
    editorialOrder: null,
    serviceIds: ["svc-web-mobile-apps"],
    contributors: ["Gallery specimen"],
    zatrozContribution: "Illustrative contribution for layout review only.",
    problem: "Specimen problem statement.",
    approach: "Specimen approach.",
    deliverables: [],
    verifiedOutcomes: [],
    mediaIds: ["media-specimen-frame"],
    publicLinks: [{ label: "Specimen demo", href: "https://example.com" }],
    storyPublicationState: "approved",
    story: {
      publicationState: "approved",
      title: partial.title,
      intro: "Short specimen intro for the case-study template.",
      context: [
        {
          type: "paragraph",
          text: "Context paragraph explaining the problem without inventing a client.",
        },
      ],
      contribution: [
        {
          type: "paragraph",
          text: "Contribution paragraph describing what was explored in this fixture.",
        },
      ],
      solution: [
        {
          type: "paragraph",
          text: "Solution paragraph with enough length to check reading measure.",
        },
      ],
      features: ["Readable labels", "Honest work-status badge"],
      processNotes: [],
      gallery: [
        {
          mediaId: "media-specimen-frame",
          caption: "Specimen screen showing hierarchy — labelled fixture only.",
          conceptLabel: "Prototype screen",
        },
      ],
      technologies: ["TypeScript", "Next.js"],
      outcomes: [
        "Qualitative observation: the layout remains readable without metrics.",
      ],
      lessons: [],
      testimonial: null,
      reviewNotes: "Internal gallery note — must not appear in public props",
    },
    ...partial,
  };
}

const SHORT_PROJECT = baseStoryProject({
  id: "specimen-case-short",
  slug: "specimen-short-story",
  title: "Specimen short story",
});

const LONG_PROJECT = baseStoryProject({
  id: "specimen-case-long",
  slug: "specimen-long-story",
  title:
    "Specimen long story with an extended title that should wrap cleanly on narrow viewports",
  story: {
    publicationState: "approved",
    title:
      "Specimen long story with an extended title that should wrap cleanly on narrow viewports",
    intro:
      "Longer intro used only in the development gallery to review spacing, table of contents, and section rhythm without publishing a real case study.",
    context: [
      {
        type: "paragraph",
        text: "First context paragraph for the long specimen. It stays fictional and labelled.",
      },
      {
        type: "paragraph",
        text: "Second context paragraph so the table of contents has enough sections to appear.",
      },
    ],
    contribution: [
      {
        type: "paragraph",
        text: "Contribution details for layout review — not a claim about client delivery.",
      },
      {
        type: "list",
        style: "bulleted",
        items: [
          "Scoped the first useful journey",
          "Documented states for handoff",
          "Kept evidence requirements explicit",
        ],
      },
    ],
    solution: [
      {
        type: "paragraph",
        text: "Solution narrative describing structure before polish.",
      },
    ],
    features: [
      "Empty and error states noted",
      "Keyboard focus called out",
      "Responsive reading measure",
      "Related work cards",
    ],
    processNotes: [
      {
        type: "paragraph",
        text: "Process note: wireframes before visual polish, then handoff notes.",
      },
    ],
    gallery: [
      {
        mediaId: "media-specimen-frame",
        caption: "Wide specimen frame used to check object-fit containment.",
        conceptLabel: "Prototype screen",
      },
      {
        mediaId: "media-specimen-frame",
        caption:
          "Second fixture image for gallery spacing — same synthetic asset.",
        conceptLabel: "Concept screen",
      },
    ],
    technologies: ["TypeScript", "React", "Tailwind CSS"],
    outcomes: [
      "No numeric adoption metric is claimed for this specimen.",
      "Reading remains usable with JavaScript disabled.",
    ],
    lessons: [
      {
        type: "paragraph",
        text: "Limitation: this specimen is not evidence of shipped client work.",
      },
    ],
    testimonial: {
      quote:
        "A labelled specimen quote for layout only — not a real customer statement.",
      attribution: "Gallery fixture attribution",
      publicationState: "approved",
    },
    reviewNotes: "Long specimen internal notes",
  },
});

function specimenRepo(
  projects: readonly ProjectRecord[],
): PublicProjectsRepository {
  return {
    projects,
    media: SPECIMEN_MEDIA,
    services: contentCatalog.services,
    featuredProjectIds: [],
    workStoriesImplemented: true,
  };
}

function SpecimenFrame({
  slug,
  label,
  idPrefix,
}: {
  slug: string;
  label: string;
  idPrefix: string;
}) {
  const repo = specimenRepo([SHORT_PROJECT, LONG_PROJECT]);
  const study = projectPublishedCaseStudy(repo, slug, { idPrefix });
  const enquiryAction = resolveServicesEnquiryCta({
    label: "Discuss a similar project",
  });

  if (!study) {
    return (
      <p className="m-0 text-text-muted">
        {label} case-study specimen could not be projected.
      </p>
    );
  }

  // Ensure review notes never leaked into the public DTO.
  const leaked = JSON.stringify(study).includes("Internal gallery note");

  return (
    <div className="mt-10">
      <h3>{label}</h3>
      {leaked ? (
        <p className="text-error">DTO leak detected in specimen projection.</p>
      ) : (
        <p className="ds-support mt-2 max-w-reading">
          Labelled fixture only. Live <code>/work/[slug]</code> returns
          not-found until an approved story exists in the catalog.
        </p>
      )}
      <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
        <CaseStudyPage
          study={study}
          enquiryAction={enquiryAction}
          headingLevel={2}
          idPrefix={idPrefix}
          showBreadcrumb={false}
        />
      </div>
    </div>
  );
}

/**
 * Short and long case-study specimens for `/dev/ui`.
 * Never published as portfolio work.
 */
export function CaseStudySpecimen() {
  return (
    <div>
      <h3>Case study template (specimen)</h3>
      <p className="ds-support mt-2 max-w-reading">
        Synthetic non-confidential fixtures for the reusable story layout.
        Public routes stay empty until founders approve real stories (Step 39).
      </p>
      <SpecimenFrame
        slug="specimen-short-story"
        label="Short story specimen"
        idPrefix="gallery-case-short-"
      />
      <SpecimenFrame
        slug="specimen-long-story"
        label="Long story specimen"
        idPrefix="gallery-case-long-"
      />
    </div>
  );
}
