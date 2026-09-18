import { ServiceDetailPage } from "@/components/sections/service-detail-page";
import { getServiceDetailGalleryPreview } from "@/server/service-detail";

/**
 * Gallery preview of the Custom Software draft detail.
 * Not a public page — copy stays draft until founders approve.
 */
export function CustomSoftwareSpecimen() {
  const detail = getServiceDetailGalleryPreview("custom-software");

  if (!detail) {
    return (
      <p className="m-0 text-text-muted">
        Custom Software detail draft is not available.
      </p>
    );
  }

  return (
    <div>
      <h3>Custom Software (draft)</h3>
      <p className="ds-support mt-2 max-w-reading">
        Full draft for review, including the configure/integrate/tailor guide
        and system relationship map. Public{" "}
        <code>/services/custom-software</code> stays unavailable until overview
        approval, detail approval, and publication readiness align.
      </p>
      <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
        <ServiceDetailPage
          detail={detail}
          headingLevel={2}
          idPrefix="gallery-cs-"
          showBreadcrumb={false}
        />
      </div>
    </div>
  );
}
