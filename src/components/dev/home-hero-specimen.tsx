import { HomeHero } from "@/components/sections/home-hero";
import { getHomeHeroSpecimen } from "@/server/home";

/**
 * Draft hero review specimen for /dev/ui only.
 * Uses H2 and an id prefix so the gallery keeps one page H1.
 */
export function HomeHeroSpecimen() {
  const full = getHomeHeroSpecimen();
  const noCtas = getHomeHeroSpecimen({
    primaryCta: null,
    secondaryCta: null,
  });
  const primaryOnly = getHomeHeroSpecimen({
    primaryCta: {
      label: "Email Zatroz (specimen)",
      href: "mailto:review-example@example.com",
    },
    secondaryCta: null,
  });
  const bothCtas = getHomeHeroSpecimen({
    primaryCta: {
      label: "Email Zatroz (specimen)",
      href: "mailto:review-example@example.com",
    },
    secondaryCta: {
      label: "In-page colour target (specimen)",
      href: "#colour-heading",
    },
  });

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h3>Draft hero (no public CTAs yet)</h3>
        <p className="ds-support mt-2 max-w-reading">
          Proposed copy and the Sell online workflow. Live Contact and Work
          routes are not implemented, so the default specimen omits actions —
          the same rule as the public site.
        </p>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeHero
            hero={full}
            headingLevel={2}
            idPrefix="gallery-hero-default-"
          />
        </div>
      </div>

      <div>
        <h3>Zero CTAs</h3>
        <p className="ds-support mt-2 max-w-reading">
          Explicit empty actions for layout review.
        </p>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeHero
            hero={noCtas}
            headingLevel={2}
            idPrefix="gallery-hero-zero-"
          />
        </div>
      </div>

      <div>
        <h3>One CTA</h3>
        <p className="ds-support mt-2 max-w-reading">
          Specimen uses a safe example mailto only inside /dev/ui.
        </p>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeHero
            hero={primaryOnly}
            headingLevel={2}
            idPrefix="gallery-hero-one-"
          />
        </div>
      </div>

      <div>
        <h3>Two CTAs</h3>
        <p className="ds-support mt-2 max-w-reading">
          Secondary uses an existing in-page gallery target. Do not treat this
          as a public Work page link.
        </p>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeHero
            hero={bothCtas}
            headingLevel={2}
            idPrefix="gallery-hero-two-"
          />
        </div>
      </div>
    </div>
  );
}
