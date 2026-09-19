import { HomeServiceExplorer } from "@/components/sections/home-service-explorer";
import { getServiceExplorerSpecimen } from "@/server/home";

/**
 * Gallery-only service explorer specimen. Draft needs for layout review —
 * not published on public `/` until approved.
 */
export async function HomeServiceExplorerSpecimen() {
  const explorer = await getServiceExplorerSpecimen();
  const longCopy = await getServiceExplorerSpecimen({ longDeliverable: true });

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h3>Four business needs (draft specimen)</h3>
        <p className="ds-support mt-2 max-w-reading">
          Disclosure opens one need at a time. Desktop places the open panel
          beside the rows; mobile keeps it under the trigger. Service detail
          routes stay unlinked until implemented.
        </p>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeServiceExplorer
            explorer={explorer}
            headingLevel={2}
            idPrefix="gallery-explorer-default-"
          />
        </div>
      </div>

      <div>
        <h3>Long deliverable text</h3>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeServiceExplorer
            explorer={longCopy}
            headingLevel={2}
            idPrefix="gallery-explorer-long-"
          />
        </div>
      </div>
    </div>
  );
}
