import { ServiceDetailPage } from "@/components/sections/service-detail-page";
import { getServiceDetailGalleryPreview } from "@/server/service-detail";

/**
 * Gallery preview of the Websites and E-commerce draft detail.
 * Not a public page — copy stays draft until founders approve.
 */
export async function WebsitesEcommerceSpecimen() {
  const detail = await getServiceDetailGalleryPreview("websites-ecommerce");

  if (!detail) {
    return (
      <p className="m-0 text-text-muted">
        Websites and E-commerce detail draft is not available.
      </p>
    );
  }

  return (
    <div>
      <h3>Websites and E-commerce (draft)</h3>
      <p className="ds-support mt-2 max-w-reading">
        Full draft for review, including scope options and the labelled website
        vs catalogue illustration. Public{" "}
        <code>/services/websites-ecommerce</code> stays unavailable until
        overview approval, detail approval, and publication readiness align.
      </p>
      <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
        <ServiceDetailPage
          detail={detail}
          headingLevel={2}
          idPrefix="gallery-wec-"
          showBreadcrumb={false}
        />
      </div>
    </div>
  );
}
