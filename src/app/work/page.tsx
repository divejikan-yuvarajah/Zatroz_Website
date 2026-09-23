import type { Metadata } from "next";
import { WorkPage } from "@/components/sections/work-page";
import {
  listPublishedProjects,
  parseWorkListSearchParams,
} from "@/server/public-projects";
import { resolveServicesEnquiryCta } from "@/server/services";
import { buildPublicPageMetadata } from "@/server/seo/metadata";

type WorkRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  searchParams,
}: WorkRouteProps): Promise<Metadata> {
  const raw = await searchParams;
  const parsed = parseWorkListSearchParams(raw);
  const hasQueryFilters = Boolean(
    parsed.service || parsed.status || parsed.page > 1,
  );

  return buildPublicPageMetadata({
    title: "Work",
    description:
      "Selected digital work from Zatroz — published project summaries with accurate labels when approved stories are ready.",
    canonicalPath: "/work",
    // Filtered / paginated combinations are not separate landing pages.
    indexable: !hasQueryFilters,
  });
}

/**
 * Public Work listing. Uses GET filters (`service`, `status`, `page`).
 * Published project count is currently zero until founders approve stories.
 */
export default async function WorkRoute({ searchParams }: WorkRouteProps) {
  const raw = await searchParams;
  const parsed = parseWorkListSearchParams(raw);
  const list = await listPublishedProjects({
    service: parsed.service,
    status: parsed.status,
    page: parsed.page,
  });
  const enquiryAction = resolveServicesEnquiryCta({
    label: "Start a project",
  });

  return (
    <WorkPage list={list} enquiryAction={enquiryAction} headingLevel={1} />
  );
}
