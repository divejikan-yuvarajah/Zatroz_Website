import { ServiceDetailPage } from "@/components/sections/service-detail-page";
import { getServiceDetailGalleryPreview } from "@/server/service-detail";

/**
 * Gallery preview of the Web and Mobile Applications draft detail.
 * Not a public page — copy stays draft until founders approve.
 */
export async function WebMobileAppsSpecimen() {
  const detail = await getServiceDetailGalleryPreview("web-mobile-apps");

  if (!detail) {
    return (
      <p className="m-0 text-text-muted">
        Web and Mobile Applications detail draft is not available.
      </p>
    );
  }

  return (
    <div>
      <h3>Web and Mobile Applications (draft)</h3>
      <p className="ds-support mt-2 max-w-reading">
        Full draft for review, including platform options and the labelled
        browser vs phone task illustration. Public{" "}
        <code>/services/web-mobile-apps</code> stays unavailable until overview
        approval, detail approval, and publication readiness align.
      </p>
      <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
        <ServiceDetailPage
          detail={detail}
          headingLevel={2}
          idPrefix="gallery-wma-"
          showBreadcrumb={false}
        />
      </div>
    </div>
  );
}
