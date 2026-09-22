import { PolicyPage } from "@/components/sections/policy-page";
import {
  getPrivacyGalleryPreview,
  getTermsGalleryPreview,
} from "@/server/legal-policies";

/**
 * Gallery preview of Privacy + Terms drafts.
 * Public routes stay sparse until owner approval.
 */
export function PolicySpecimen() {
  const privacy = getPrivacyGalleryPreview();
  const terms = getTermsGalleryPreview();

  return (
    <div className="space-y-16">
      <div>
        <h3>Privacy (draft)</h3>
        <p className="ds-support mt-2 max-w-reading">
          Full Privacy draft for review. Public <code>/privacy</code> stays
          sparse until approval. No guessed effective date. Footer and Contact
          stay unlinked while routes remain unimplemented.
        </p>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <PolicyPage
            policy={privacy}
            headingLevel={2}
            idPrefix="gallery-privacy-"
            showBreadcrumb={false}
            showDraftChrome
          />
        </div>
      </div>

      <div>
        <h3>Website terms (draft)</h3>
        <p className="ds-support mt-2 max-w-reading">
          Website-use terms draft — not a fabricated client-service contract.
          Public <code>/terms</code> stays sparse until approval.
        </p>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <PolicyPage
            policy={terms}
            headingLevel={2}
            idPrefix="gallery-terms-"
            showBreadcrumb={false}
            showDraftChrome
          />
        </div>
      </div>
    </div>
  );
}
