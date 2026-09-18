import { WorkPage } from "@/components/sections/work-page";
import {
  listPublishedProjectCards,
  type PublicProjectsRepository,
} from "@/lib/public-projects";
import type { ProjectRecord } from "@/content/projects";
import { contentCatalog } from "@/content/catalog";
import { resolveServicesEnquiryCta } from "@/server/services";

const SPECIMEN_PROJECTS: readonly ProjectRecord[] = [
  {
    id: "specimen-work-card-1",
    slug: "specimen-request-board",
    title: "Specimen request board",
    summary:
      "Gallery-only sample card showing a text-first layout when no approved cover exists.",
    publicationState: "approved",
    workStatus: "prototype",
    editorialOrder: 1,
    serviceIds: ["svc-web-mobile-apps"],
    contributors: ["Gallery specimen"],
    zatrozContribution: "Illustrative contribution for layout review.",
    problem: "Specimen problem",
    approach: "Specimen approach",
    deliverables: [],
    verifiedOutcomes: [],
    mediaIds: [],
    publicLinks: [{ label: "Specimen demo", href: "https://example.com" }],
    storyPublicationState: null,
  },
  {
    id: "specimen-work-card-2",
    slug: "specimen-catalogue",
    title: "Specimen catalogue screen",
    summary:
      "Second gallery sample with an illustrative SVG frame — not client evidence.",
    publicationState: "approved",
    workStatus: "research-concept",
    editorialOrder: 2,
    serviceIds: ["svc-ui-ux-design"],
    contributors: [],
    zatrozContribution: "Illustrative contribution.",
    problem: "Specimen problem",
    approach: "Specimen approach",
    deliverables: [],
    verifiedOutcomes: [],
    mediaIds: [],
    publicLinks: [],
    storyPublicationState: null,
  },
];

/**
 * Gallery preview of the Work page with labelled specimen cards.
 * Public `/work` still uses the live empty catalog until projects are approved.
 */
export function WorkPageSpecimen() {
  const repo: PublicProjectsRepository = {
    projects: SPECIMEN_PROJECTS,
    media: contentCatalog.media,
    services: contentCatalog.services,
    featuredProjectIds: [],
    workStoriesImplemented: false,
  };
  const list = listPublishedProjectCards(repo);
  const enquiryAction = resolveServicesEnquiryCta({
    label: "Start a project",
  });

  return (
    <div>
      <h3>Work page (specimen)</h3>
      <p className="ds-support mt-2 max-w-reading">
        Labelled fixtures for layout review. The live <code>/work</code> route
        uses approved catalog projects only (currently zero) and does not
        publish these specimens.
      </p>
      <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
        <WorkPage
          list={list}
          enquiryAction={enquiryAction}
          headingLevel={2}
          idPrefix="gallery-work-"
          showBreadcrumb={false}
        />
      </div>
    </div>
  );
}
