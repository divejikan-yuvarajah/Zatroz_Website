import { ProcessPage } from "@/components/sections/process-page";
import { getProcessGalleryPreview } from "@/server/process";

/**
 * Gallery preview of the Process page draft.
 * Not a public page — commitments stay draft until founders approve.
 */
export function ProcessSpecimen() {
  const process = getProcessGalleryPreview();

  return (
    <div>
      <h3>Process (draft)</h3>
      <p className="ds-support mt-2 max-w-reading">
        Full six-stage draft for review. Public <code>/process</code> stays
        sparse until page approval. Not a guarantee of timelines, revisions, or
        free support.
      </p>
      <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
        <ProcessPage
          process={process}
          headingLevel={2}
          idPrefix="gallery-process-page-"
          showBreadcrumb={false}
        />
      </div>
    </div>
  );
}
