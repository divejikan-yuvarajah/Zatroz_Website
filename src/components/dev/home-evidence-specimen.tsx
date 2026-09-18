import { HomeEvidence } from "@/components/sections/home-evidence";
import { getHomeEvidenceSpecimen } from "@/server/home";

/**
 * Gallery-only evidence fixtures. Never used as public homepage proof.
 */
export function HomeEvidenceSpecimen() {
  const introOnly = getHomeEvidenceSpecimen(0);
  const oneItem = getHomeEvidenceSpecimen(1);
  const twoItems = getHomeEvidenceSpecimen(2);
  const threeItems = getHomeEvidenceSpecimen(3);
  const longClaim = getHomeEvidenceSpecimen(1, { longClaim: true });

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h3>Intro only (zero proof items)</h3>
        <p className="ds-support mt-2 max-w-reading">
          Approved company introduction with no proof list. Specimens are
          labelled fixtures — not real Zatroz evidence.
        </p>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeEvidence
            evidence={introOnly}
            headingLevel={2}
            idPrefix="gallery-evidence-zero-"
          />
        </div>
      </div>

      <div>
        <h3>One proof item</h3>
        <p className="ds-support mt-2 max-w-reading">
          Single fixture claim with a specimen in-page link.
        </p>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeEvidence
            evidence={oneItem}
            headingLevel={2}
            idPrefix="gallery-evidence-one-"
          />
        </div>
      </div>

      <div>
        <h3>Two proof items</h3>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeEvidence
            evidence={twoItems}
            headingLevel={2}
            idPrefix="gallery-evidence-two-"
          />
        </div>
      </div>

      <div>
        <h3>Three proof items</h3>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeEvidence
            evidence={threeItems}
            headingLevel={2}
            idPrefix="gallery-evidence-three-"
          />
        </div>
      </div>

      <div>
        <h3>Long claim text</h3>
        <p className="ds-support mt-2 max-w-reading">
          Layout check for wrapping on narrow viewports.
        </p>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeEvidence
            evidence={longClaim}
            headingLevel={2}
            idPrefix="gallery-evidence-long-"
          />
        </div>
      </div>
    </div>
  );
}
