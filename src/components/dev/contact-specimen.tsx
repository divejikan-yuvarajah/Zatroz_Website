import { ContactPage } from "@/components/sections/contact-page";
import { EnquiryFormHarness } from "@/components/dev/enquiry-form-harness";
import { EnquiryFormLayout } from "@/components/forms/enquiry-form-layout";
import { getContactGalleryPreview } from "@/server/contact";

/**
 * Gallery Contact page + enquiry form harness.
 * Interactive form never mounts on public /contact while submission is not ready.
 */
export function ContactSpecimen() {
  const contact = getContactGalleryPreview("ui-ux-design");

  return (
    <div className="space-y-12">
      <div>
        <h3>Contact page (draft framing)</h3>
        <p className="ds-support mt-2 max-w-reading">
          Full draft with confirmed email and WhatsApp actions. Public{" "}
          <code>/contact</code> shows channels and omits the interactive form
          until backend submission readiness.
        </p>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <ContactPage
            contact={contact}
            headingLevel={2}
            idPrefix="gallery-contact-"
            showBreadcrumb={false}
          />
        </div>
      </div>

      <EnquiryFormHarness
        initialService="ui-ux-design"
        directContactHref="mailto:zatroz.co@gmail.com?subject=Project%20enquiry"
      />

      <div>
        <h3>Static layout reference</h3>
        <p className="ds-support mt-2 max-w-reading">
          Non-interactive field layout from Step 42, kept for visual comparison.
          Prefer the harness above for behaviour review.
        </p>
        <div className="mt-6 max-w-reading rounded-md border border-border-subtle p-6">
          <EnquiryFormLayout
            idPrefix="gallery-enquiry-layout-"
            initialService="ui-ux-design"
            showInvalidSample
          />
        </div>
      </div>
    </div>
  );
}
