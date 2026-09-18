import { ServiceDetailPage } from "@/components/sections/service-detail-page";
import { getServiceDetailGalleryPreview } from "@/server/service-detail";

/**
 * Gallery preview of the Business Systems draft detail.
 * Not a public page — copy stays draft until founders approve.
 */
export function BusinessSystemsSpecimen() {
  const detail = getServiceDetailGalleryPreview("business-systems");

  if (!detail) {
    return (
      <p className="m-0 text-text-muted">
        Business Systems detail draft is not available.
      </p>
    );
  }

  return (
    <div>
      <h3>Business Systems (draft)</h3>
      <p className="ds-support mt-2 max-w-reading">
        Full draft for review, including optional modules and the labelled sales
        → stock → reporting illustration. Public{" "}
        <code>/services/business-systems</code> stays unavailable until overview
        approval, detail approval, and publication readiness align.
      </p>
      <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
        <ServiceDetailPage
          detail={detail}
          headingLevel={2}
          idPrefix="gallery-bs-"
          showBreadcrumb={false}
        />
      </div>
    </div>
  );
}
