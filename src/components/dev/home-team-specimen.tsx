import { HomeTeam } from "@/components/sections/home-team";
import { getHomePeopleSpecimen } from "@/server/home";

/**
 * Gallery specimens for the people / company section.
 * Fixtures are labelled examples — not real founder cards.
 */
export function HomeTeamSpecimen() {
  const textLed = getHomePeopleSpecimen("text-led");
  const oneProfile = getHomePeopleSpecimen("one-profile");
  const multiple = getHomePeopleSpecimen("multiple-profiles");
  const longName = getHomePeopleSpecimen("long-name");

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h3>Text-led (no portraits)</h3>
        <p className="ds-support mt-2 max-w-reading">
          Approved company story and working principles only. Public `/` uses
          this shape when there are no approved founder cards or team photo.
        </p>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeTeam
            people={textLed}
            headingLevel={2}
            idPrefix="gallery-people-text-"
          />
        </div>
      </div>

      <div>
        <h3>One specimen profile (no portrait)</h3>
        <p className="ds-support mt-2 max-w-reading">
          Labelled gallery fixture — not a real Zatroz founder card.
        </p>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeTeam
            people={oneProfile}
            headingLevel={2}
            idPrefix="gallery-people-one-"
          />
        </div>
      </div>

      <div>
        <h3>Multiple specimen profiles</h3>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeTeam
            people={multiple}
            headingLevel={2}
            idPrefix="gallery-people-multi-"
          />
        </div>
      </div>

      <div>
        <h3>Long name wrapping</h3>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeTeam
            people={longName}
            headingLevel={2}
            idPrefix="gallery-people-long-"
          />
        </div>
      </div>
    </div>
  );
}
