import Link from "next/link";
import { WORK_STATUS_VALUES, WORK_STATUS_LABELS } from "@/content/projects";
import type { ProjectListItem } from "@/lib/admin/projects";
import { ButtonLink } from "@/components/ui/button-link";
import { TextInput } from "@/components/forms/text-input";
import { SelectField } from "@/components/forms/select-field";
import { Button } from "@/components/ui/button";

export type AdminProjectListProps = {
  items: readonly ProjectListItem[] | null;
  total: number;
  page: number;
  pageSize: number;
  search: string;
  workStatus: string;
  publication: string;
  archived: boolean;
  unavailableDetail: string | null;
  canWrite: boolean;
};

export function AdminProjectList({
  items,
  total,
  page,
  pageSize,
  search,
  workStatus,
  publication,
  archived,
  unavailableDetail,
  canWrite,
}: AdminProjectListProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <form
          method="get"
          className="flex w-full max-w-3xl flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end"
          role="search"
        >
          <div className="min-w-0 w-full flex-1 sm:min-w-[12rem]">
            <label
              htmlFor="project-search"
              className="block text-sm font-medium text-ink"
            >
              Search
            </label>
            <TextInput
              id="project-search"
              name="q"
              defaultValue={search}
              placeholder="Title, slug, or id"
              className="mt-1"
              autoComplete="off"
            />
          </div>
          <div>
            <label
              htmlFor="project-work-status"
              className="block text-sm font-medium text-ink"
            >
              Work status
            </label>
            <SelectField
              id="project-work-status"
              name="workStatus"
              defaultValue={workStatus}
              className="mt-1"
            >
              <option value="all">All</option>
              {WORK_STATUS_VALUES.map((value) => (
                <option key={value} value={value}>
                  {WORK_STATUS_LABELS[value]}
                </option>
              ))}
            </SelectField>
          </div>
          <div>
            <label
              htmlFor="project-publication"
              className="block text-sm font-medium text-ink"
            >
              Publication
            </label>
            <SelectField
              id="project-publication"
              name="publication"
              defaultValue={publication}
              className="mt-1"
            >
              <option value="all">All</option>
              <option value="draft">Draft only</option>
              <option value="published">Has published summary</option>
            </SelectField>
          </div>
          <div>
            <label
              htmlFor="project-archived"
              className="block text-sm font-medium text-ink"
            >
              List
            </label>
            <SelectField
              id="project-archived"
              name="archived"
              defaultValue={archived ? "1" : "0"}
              className="mt-1"
            >
              <option value="0">Active</option>
              <option value="1">Archived</option>
            </SelectField>
          </div>
          <Button type="submit" variant="secondary" size="compact">
            Filter
          </Button>
        </form>
        {canWrite ? (
          <ButtonLink
            href="/admin/projects/new"
            variant="primary"
            size="compact"
          >
            Create project
          </ButtonLink>
        ) : null}
      </div>

      {unavailableDetail ? (
        <div
          className="rounded-md border border-border-subtle bg-warning-soft p-4 text-warning"
          role="status"
        >
          <p className="font-medium">Project list unavailable</p>
          <p className="mt-1 text-sm">{unavailableDetail}</p>
        </div>
      ) : null}

      {items && items.length === 0 ? (
        <p className="ds-support">
          {search || workStatus || publication || archived
            ? "No projects match these filters. Clear filters or create a new draft."
            : "No projects yet. Create a draft to start the portfolio catalog."}
        </p>
      ) : null}

      {items && items.length > 0 ? (
        <div
          className="overflow-x-auto overscroll-x-contain rounded-sm border border-border-subtle [-webkit-overflow-scrolling:touch]"
          role="region"
          aria-label="Projects table"
          tabIndex={0}
        >
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-text-muted">
                <th scope="col" className="py-2 pr-4 font-medium">
                  Title
                </th>
                <th scope="col" className="py-2 pr-4 font-medium">
                  Status
                </th>
                <th scope="col" className="py-2 pr-4 font-medium">
                  Publication
                </th>
                <th scope="col" className="py-2 pr-4 font-medium">
                  Updated
                </th>
                <th scope="col" className="py-2 font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.editorialId}
                  className="border-b border-border-subtle"
                >
                  <td className="py-3 pr-4 align-top">
                    <p className="font-medium text-ink">{item.draftTitle}</p>
                    <p className="text-text-muted">
                      <code className="text-xs">{item.draftSlug}</code>
                      <span className="mx-1">·</span>
                      <code className="text-xs">{item.editorialId}</code>
                    </p>
                  </td>
                  <td className="py-3 pr-4 align-top text-text-body">
                    {item.workStatusLabel}
                  </td>
                  <td className="py-3 pr-4 align-top text-text-body capitalize">
                    {item.publication}
                  </td>
                  <td className="py-3 pr-4 align-top text-text-muted tabular-nums">
                    {item.updatedAtIso
                      .replace("T", " ")
                      .replace(/\.\d+Z$/, " UTC")}
                  </td>
                  <td className="py-3 align-top">
                    <div className="flex flex-col gap-1">
                      <Link
                        href={`/admin/projects/${item.editorialId}`}
                        className="font-medium text-ink underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:[outline-color:var(--ink)]"
                      >
                        Edit draft
                      </Link>
                      <Link
                        href={`/admin/projects/${item.editorialId}/preview`}
                        className="text-sm text-text-muted underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:[outline-color:var(--ink)]"
                      >
                        Preview
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {items && total > pageSize ? (
        <nav
          aria-label="Project list pages"
          className="flex flex-wrap items-center gap-3 text-sm"
        >
          <p className="text-text-muted">
            Page {page} of {totalPages} · {total} total
          </p>
          <div className="flex gap-2">
            {page > 1 ? (
              <ButtonLink
                href={pageHref({
                  search,
                  workStatus,
                  publication,
                  archived,
                  page: page - 1,
                })}
                variant="secondary"
                size="compact"
              >
                Previous
              </ButtonLink>
            ) : null}
            {page < totalPages ? (
              <ButtonLink
                href={pageHref({
                  search,
                  workStatus,
                  publication,
                  archived,
                  page: page + 1,
                })}
                variant="secondary"
                size="compact"
              >
                Next
              </ButtonLink>
            ) : null}
          </div>
        </nav>
      ) : null}
    </div>
  );
}

function pageHref(input: {
  search: string;
  workStatus: string;
  publication: string;
  archived: boolean;
  page: number;
}): string {
  const params = new URLSearchParams();
  if (input.search) params.set("q", input.search);
  if (input.workStatus !== "all") params.set("workStatus", input.workStatus);
  if (input.publication !== "all") params.set("publication", input.publication);
  if (input.archived) params.set("archived", "1");
  if (input.page > 1) params.set("page", String(input.page));
  const qs = params.toString();
  return qs ? `/admin/projects?${qs}` : "/admin/projects";
}
