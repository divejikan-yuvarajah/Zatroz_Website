import { ContactPage } from "@/components/sections/contact-page";
import { EnquiryFormLayout } from "@/components/forms/enquiry-form-layout";
import { getContactGalleryPreview } from "@/server/contact";

/**
 * Gallery Contact page + enquiry form layout specimen.
 * Form never mounts on public /contact while submission is not ready.
 */
export function ContactSpecimen() {
  const contact = getContactGalleryPreview("ui-ux-design");

  return (
    <div className="space-y-12">
      <div>
        <h3>Contact page (draft framing)</h3>
        <p className="ds-support mt-2 max-w-reading">
          Full draft with confirmed email and WhatsApp actions. Public{" "}
          <code>/contact</code> shows channels even while framing stays draft;
          the interactive form stays gallery-only until submission readiness.
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

      <div>
        <h3>Enquiry form layout (specimen)</h3>
        <p className="ds-support mt-2 max-w-reading">
          Shared field layout for Step 43. Preselects UI/UX Design from a safe
          gallery fixture. Submission is prevented — no GET of personal fields.
        </p>
        <div className="mt-6 max-w-reading rounded-md border border-border-subtle p-6">
          <EnquiryFormLayout
            idPrefix="gallery-enquiry-"
            initialService="ui-ux-design"
            showInvalidSample
          />
        </div>
      </div>
    </div>
  );
}
