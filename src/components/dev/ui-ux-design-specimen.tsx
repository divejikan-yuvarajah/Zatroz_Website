import { ServiceDetailPage } from "@/components/sections/service-detail-page";
import { getServiceDetailGalleryPreview } from "@/server/service-detail";

/**
 * Gallery preview of the UI/UX Design draft detail.
 * Not a public page — copy stays draft until founders approve.
 */
export function UiUxDesignSpecimen() {
  const detail = getServiceDetailGalleryPreview("ui-ux-design");

  if (!detail) {
    return (
      <p className="m-0 text-text-muted">
        UI/UX Design detail draft is not available.
      </p>
    );
  }

  return (
    <div>
      <h3>UI/UX Design (draft)</h3>
      <p className="ds-support mt-2 max-w-reading">
        Full draft for review, including the enquiry flow and form-state
        illustration. Public <code>/services/ui-ux-design</code> stays
        unavailable until overview approval, detail approval, and publication
        readiness align.
      </p>
      <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
        <ServiceDetailPage
          detail={detail}
          headingLevel={2}
          idPrefix="gallery-ux-"
          showBreadcrumb={false}
        />
      </div>
    </div>
  );
}
