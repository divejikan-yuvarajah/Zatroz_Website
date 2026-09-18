import { HomeProcess } from "@/components/sections/home-process";
import { getHomeProcessSpecimen } from "@/server/home";

/**
 * Gallery specimen for the delivery process section.
 * Draft copy for review — not published on public `/` until approved.
 */
export function HomeProcessSpecimen() {
  const process = getHomeProcessSpecimen();
  const longCopy = getHomeProcessSpecimen({ longCopy: true });
  const withAction = getHomeProcessSpecimen({
    action: {
      label: "In-page colour target (specimen)",
      href: "#colour-heading",
    },
  });

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h3>Draft process (no public CTA yet)</h3>
        <p className="ds-support mt-2 max-w-reading">
          Four calm stages with customer outputs. Not fixed timelines or free
          ongoing support promises.
        </p>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeProcess
            process={process}
            headingLevel={2}
            idPrefix="gallery-process-default-"
          />
        </div>
      </div>

      <div>
        <h3>Long titles and descriptions</h3>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeProcess
            process={longCopy}
            headingLevel={2}
            idPrefix="gallery-process-long-"
          />
        </div>
      </div>

      <div>
        <h3>With specimen action</h3>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeProcess
            process={withAction}
            headingLevel={2}
            idPrefix="gallery-process-action-"
          />
        </div>
      </div>
    </div>
  );
}
