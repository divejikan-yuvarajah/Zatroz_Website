import { ServiceDetailPage } from "@/components/sections/service-detail-page";
import { getServiceDetailGalleryPreview } from "@/server/service-detail";

/**
 * Gallery preview of the AI and Automation draft detail.
 * Not a public page — copy stays draft until founders approve.
 */
export async function AiAutomationSpecimen() {
  const detail = await getServiceDetailGalleryPreview("ai-automation");

  if (!detail) {
    return (
      <p className="m-0 text-text-muted">
        AI and Automation detail draft is not available.
      </p>
    );
  }

  return (
    <div>
      <h3>AI and Automation (draft)</h3>
      <p className="ds-support mt-2 max-w-reading">
        Full draft for review, including rules-versus-AI options and the
        labelled review workflow. Public <code>/services/ai-automation</code>{" "}
        stays unavailable until overview approval, detail approval, and
        publication readiness align.
      </p>
      <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
        <ServiceDetailPage
          detail={detail}
          headingLevel={2}
          idPrefix="gallery-ai-"
          showBreadcrumb={false}
        />
      </div>
    </div>
  );
}
