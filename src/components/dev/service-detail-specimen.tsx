import { ServiceDetailPage } from "@/components/sections/service-detail-page";
import { getServiceDetailSpecimen } from "@/server/service-detail";

/**
 * Gallery specimens for the reusable service detail template.
 * Fixtures are labelled examples — never public service pages.
 */
export async function ServiceDetailSpecimen() {
  const complete = await getServiceDetailSpecimen("complete");
  const minimal = await getServiceDetailSpecimen("minimal");
  const longCopy = await getServiceDetailSpecimen("long-copy");
  const missingOptional = await getServiceDetailSpecimen("missing-optional");
  const noCta = await getServiceDetailSpecimen("no-cta");

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h3>Complete specimen</h3>
        <p className="ds-support mt-2 max-w-reading">
          Full template with optional sections. Public routes stay unavailable
          until summary approval, detail approval, and route implementation
          align.
        </p>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <ServiceDetailPage
            detail={complete}
            headingLevel={2}
            idPrefix="gallery-svc-complete-"
            showBreadcrumb={false}
          />
        </div>
      </div>

      <div>
        <h3>Minimal specimen</h3>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <ServiceDetailPage
            detail={minimal}
            headingLevel={2}
            idPrefix="gallery-svc-minimal-"
            showBreadcrumb={false}
          />
        </div>
      </div>

      <div>
        <h3>Long-copy specimen</h3>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <ServiceDetailPage
            detail={longCopy}
            headingLevel={2}
            idPrefix="gallery-svc-long-"
            showBreadcrumb={false}
          />
        </div>
      </div>

      <div>
        <h3>Missing optional sections</h3>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <ServiceDetailPage
            detail={missingOptional}
            headingLevel={2}
            idPrefix="gallery-svc-optional-"
            showBreadcrumb={false}
          />
        </div>
      </div>

      <div>
        <h3>No enquiry CTA</h3>
        <p className="ds-support mt-2 max-w-reading">
          Template still renders essential copy when no contact destination is
          usable.
        </p>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <ServiceDetailPage
            detail={noCta}
            headingLevel={2}
            idPrefix="gallery-svc-nocta-"
            showBreadcrumb={false}
          />
        </div>
      </div>
    </div>
  );
}
