import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { SelectField } from "@/components/forms/select-field";
import { TextLink } from "@/components/ui/text-link";
import {
  buildWorkListHref,
  type PublicProjectListResult,
} from "@/lib/public-projects";

export type WorkFiltersProps = {
  list: PublicProjectListResult;
};

/**
 * Native GET filter form for `/work`. Works without JavaScript.
 */
export function WorkFilters({ list }: WorkFiltersProps) {
  const showService = list.availableServices.length > 1;
  const showStatus = list.availableStatuses.length > 1;

  if (!showService && !showStatus) {
    return null;
  }

  const clearHref = "/work";
  const hasActiveFilter = Boolean(list.filters.service || list.filters.status);

  return (
    <form
      method="get"
      action="/work"
      className="mt-8 flex flex-col gap-4 border-t border-border-subtle pt-8 sm:flex-row sm:flex-wrap sm:items-end"
      aria-label="Filter selected work"
    >
      {showService ? (
        <p className="m-0 min-w-0 w-full flex-1 sm:min-w-[12rem]">
          <label htmlFor="work-filter-service" className="ds-support block">
            Service
          </label>
          <SelectField
            id="work-filter-service"
            name="service"
            className="mt-2 w-full"
            defaultValue={list.filters.service ?? ""}
          >
            <option value="">All services</option>
            {list.availableServices.map((service) => (
              <option key={service.id} value={service.slug}>
                {service.title}
              </option>
            ))}
          </SelectField>
        </p>
      ) : null}

      {showStatus ? (
        <p className="m-0 min-w-0 w-full flex-1 sm:min-w-[12rem]">
          <label htmlFor="work-filter-status" className="ds-support block">
            Work type
          </label>
          <SelectField
            id="work-filter-status"
            name="status"
            className="mt-2 w-full"
            defaultValue={list.filters.status ?? ""}
          >
            <option value="">All work types</option>
            {list.availableStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </SelectField>
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="secondary">
          Apply filters
        </Button>
        {hasActiveFilter ? (
          <ButtonLink href={clearHref} variant="quiet">
            Clear filters
          </ButtonLink>
        ) : null}
      </div>

      {/* Applying filters always restarts at page 1 — omit page from the form. */}
      <p className="sr-only">
        Applying filters shows the first page of matching results. Pagination
        links keep the selected filters.
      </p>
    </form>
  );
}

export type WorkPaginationProps = {
  list: PublicProjectListResult;
};

export function WorkPagination({ list }: WorkPaginationProps) {
  if (list.pageCount <= 1) {
    return null;
  }

  const prevHref =
    list.page > 1
      ? buildWorkListHref({
          service: list.filters.service,
          status: list.filters.status,
          page: list.page - 1,
        })
      : null;
  const nextHref =
    list.page < list.pageCount
      ? buildWorkListHref({
          service: list.filters.service,
          status: list.filters.status,
          page: list.page + 1,
        })
      : null;

  return (
    <nav
      aria-label="Work results pages"
      className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-6"
    >
      <p className="m-0 text-sm text-text-muted">
        Page {list.page} of {list.pageCount}
      </p>
      <div className="flex flex-wrap gap-4">
        {prevHref ? (
          <TextLink href={prevHref} rel="prev">
            Previous
          </TextLink>
        ) : (
          <span className="text-sm text-text-muted">Previous</span>
        )}
        {nextHref ? (
          <TextLink href={nextHref} rel="next">
            Next
          </TextLink>
        ) : (
          <span className="text-sm text-text-muted">Next</span>
        )}
      </div>
    </nav>
  );
}
