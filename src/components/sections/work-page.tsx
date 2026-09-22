import { ProjectCard } from "@/components/sections/project-card";
import {
  WorkFilters,
  WorkPagination,
} from "@/components/sections/work-filters";
import { InlineUnavailableNotice } from "@/components/system/system-state";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { TextLink } from "@/components/ui/text-link";
import type { PublicCta } from "@/content/home";
import { WORK_STATUS_LABELS } from "@/content/projects";
import type { PublicProjectListResult } from "@/lib/public-projects";
import type { WorkStatus } from "@/types/content";
import { cn } from "@/lib/cn";

export type WorkPageProps = {
  list: PublicProjectListResult;
  enquiryAction: PublicCta | null;
  headingLevel?: 1 | 2;
  idPrefix?: string;
  className?: string;
  showBreadcrumb?: boolean;
};

function describeFilters(list: PublicProjectListResult): string {
  const parts: string[] = [];
  if (list.filters.service) {
    const match = list.availableServices.find(
      (service) => service.slug === list.filters.service,
    );
    parts.push(match?.title ?? list.filters.service);
  }
  if (list.filters.status) {
    parts.push(WORK_STATUS_LABELS[list.filters.status as WorkStatus]);
  }
  return parts.join(" · ");
}

/**
 * Public Work listing. Honest empty and no-match states; no invented portfolio.
 */
export function WorkPage({
  list,
  enquiryAction,
  headingLevel = 1,
  idPrefix = "",
  className,
  showBreadcrumb = true,
}: WorkPageProps) {
  const headingId = `${idPrefix}work-heading`;
  const catalogueUnavailable = list.availability === "unavailable";
  const eligibleUniverseEmpty =
    !catalogueUnavailable &&
    list.availableServices.length === 0 &&
    list.availableStatuses.length === 0 &&
    list.total === 0;
  const noMatches =
    !catalogueUnavailable &&
    !eligibleUniverseEmpty &&
    list.total === 0 &&
    (Boolean(list.filters.service) || Boolean(list.filters.status));
  const filterLabel = describeFilters(list);
  const showResults =
    !catalogueUnavailable && !eligibleUniverseEmpty && !noMatches;

  return (
    <div className={cn(className)}>
      <Section
        as="section"
        surface="light"
        id={`${idPrefix}work`}
        aria-labelledby={headingId}
      >
        <Container>
          {showBreadcrumb ? (
            <PageBreadcrumb
              className="mb-8"
              items={[{ label: "Home", href: "/" }, { label: "Work" }]}
            />
          ) : null}

          <SectionHeading
            level={headingLevel}
            visualLevel={1}
            id={headingId}
            description="Examples of digital work from Zatroz and credited founders — published only when details are approved. This is not a client logo wall."
          >
            Selected work
          </SectionHeading>

          {catalogueUnavailable ? <InlineUnavailableNotice /> : null}

          {!catalogueUnavailable && !eligibleUniverseEmpty ? (
            <WorkFilters list={list} />
          ) : null}

          {eligibleUniverseEmpty ? (
            <div className="mt-10 max-w-reading">
              <p className="m-0 text-text-body">
                Public project details are being prepared. When approved stories
                are ready, they will appear here with accurate labels — not
                invented case studies or logos.
              </p>
              {enquiryAction ? (
                <p className="mt-8 m-0">
                  <ButtonLink
                    href={enquiryAction.href}
                    variant="primary"
                    newTab={enquiryAction.href.startsWith("https://")}
                  >
                    {enquiryAction.label}
                  </ButtonLink>
                </p>
              ) : null}
            </div>
          ) : null}

          {noMatches ? (
            <div className="mt-10 max-w-reading" role="status">
              <p className="m-0 text-text-body">
                No published projects match
                {filterLabel ? ` “${filterLabel}”` : " the selected filters"}.
              </p>
              <p className="mt-4 m-0">
                <TextLink href="/work">Clear filters</TextLink>
              </p>
            </div>
          ) : null}

          {showResults ? (
            <>
              <p
                className="mt-8 m-0 text-sm text-text-muted"
                aria-live="polite"
              >
                {list.total === 1
                  ? "1 published project"
                  : `${list.total} published projects`}
                {list.filters.service || list.filters.status
                  ? " matching these filters"
                  : ""}
                .
              </p>

              <ul className="mt-8 grid list-none gap-10 p-0 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
                {list.items.map((project) => (
                  <li key={project.id} className="min-w-0">
                    <ProjectCard
                      project={project}
                      headingLevel={headingLevel === 1 ? 2 : 3}
                      idPrefix={idPrefix}
                    />
                  </li>
                ))}
              </ul>

              <WorkPagination list={list} />
            </>
          ) : null}

          {!catalogueUnavailable && !eligibleUniverseEmpty && enquiryAction ? (
            <div className="mt-14 max-w-reading border-t border-border-subtle pt-10">
              <h2 className="ds-h3 m-0">Discuss a similar project</h2>
              <p className="mt-3 m-0 text-text-body">
                Tell us what you need to accomplish. We reply with a clear next
                step — not a packaged price list on this page.
              </p>
              <p className="mt-6 m-0">
                <ButtonLink
                  href={enquiryAction.href}
                  variant="primary"
                  newTab={enquiryAction.href.startsWith("https://")}
                >
                  {enquiryAction.label}
                </ButtonLink>
              </p>
            </div>
          ) : null}
        </Container>
      </Section>
    </div>
  );
}
