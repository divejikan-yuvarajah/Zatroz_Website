import { ServicesOverview } from "@/components/sections/services-overview";
import { getServicesOverviewSpecimen } from "@/server/services";

/**
 * Gallery specimen for the Services overview.
 * Shows all six draft rows with review labels — not public evidence.
 */
export function ServicesOverviewSpecimen() {
  const overview = getServicesOverviewSpecimen();

  return (
    <div className="overflow-hidden rounded-md border border-border-subtle">
      <ServicesOverview
        overview={overview}
        headingLevel={2}
        idPrefix="gallery-"
        showBreadcrumb={false}
      />
    </div>
  );
}
