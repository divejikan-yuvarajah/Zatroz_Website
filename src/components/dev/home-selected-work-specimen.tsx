import { HomeFeaturedWork } from "@/components/sections/home-featured-work";
import { getSelectedWorkSpecimen } from "@/server/home";

/**
 * Gallery-only selected-work fixtures. Never treated as public portfolio proof.
 */
export function HomeSelectedWorkSpecimen() {
  const one = getSelectedWorkSpecimen(1);
  const two = getSelectedWorkSpecimen(2);
  const three = getSelectedWorkSpecimen(3);
  const textLed = getSelectedWorkSpecimen(1, { textLedOnly: true });
  const longTitle = getSelectedWorkSpecimen(1, { longTitle: true });
  const nonlinked = getSelectedWorkSpecimen(1, { unlink: true });

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h3>Zero features</h3>
        <p className="ds-support mt-2 max-w-reading">
          Public `/` omits this section when no approved featured projects
          resolve. There is no empty grid on the live homepage.
        </p>
      </div>

      <div>
        <h3>One feature (image-led specimen)</h3>
        <p className="ds-support mt-2 max-w-reading">
          Specimen illustration only — not a screenshot of a shipped Zatroz
          system.
        </p>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeFeaturedWork
            selectedWork={one}
            headingLevel={2}
            idPrefix="gallery-work-one-"
          />
        </div>
      </div>

      <div>
        <h3>Two features</h3>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeFeaturedWork
            selectedWork={two}
            headingLevel={2}
            idPrefix="gallery-work-two-"
          />
        </div>
      </div>

      <div>
        <h3>Three features (lead + two)</h3>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeFeaturedWork
            selectedWork={three}
            headingLevel={2}
            idPrefix="gallery-work-three-"
          />
        </div>
      </div>

      <div>
        <h3>Text-led (no media)</h3>
        <p className="ds-support mt-2 max-w-reading">
          When approved media is missing, the feature stays useful without a
          broken image path.
        </p>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeFeaturedWork
            selectedWork={textLed}
            headingLevel={2}
            idPrefix="gallery-work-text-"
          />
        </div>
      </div>

      <div>
        <h3>Long title</h3>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeFeaturedWork
            selectedWork={longTitle}
            headingLevel={2}
            idPrefix="gallery-work-long-"
          />
        </div>
      </div>

      <div>
        <h3>Nonlinked feature</h3>
        <p className="ds-support mt-2 max-w-reading">
          No fake “Read story” action when the case-study route and external
          demos are unavailable.
        </p>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeFeaturedWork
            selectedWork={nonlinked}
            headingLevel={2}
            idPrefix="gallery-work-nolink-"
          />
        </div>
      </div>
    </div>
  );
}
