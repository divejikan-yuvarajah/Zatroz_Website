import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { CaseStudyPage } from "@/components/sections/case-study-page";
import {
  getPublishedCaseStudyBySlugOrRedirect,
  getPublishedCaseStudySlugsForPrerender,
} from "@/server/public-projects";
import { resolveServicesEnquiryCta } from "@/server/services";

type CaseStudyRouteProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Optional prerender of known public stories. Not an eligibility allowlist —
 * unknown/new admin slugs still resolve at request time (dynamicParams default).
 */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await getPublishedCaseStudySlugsForPrerender();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CaseStudyRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await getPublishedCaseStudyBySlugOrRedirect(slug);

  if (resolved.kind === "redirect") {
    return {
      title: "Redirecting… — Zatroz",
      robots: { index: false, follow: true },
    };
  }

  if (resolved.kind !== "study") {
    return {
      title: "Project not found — Zatroz",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: resolved.study.pageTitle,
    description: resolved.study.pageDescription,
  };
}

/**
 * Public case-study route. Draft, archived, summary-only, and unknown slugs
 * call notFound(). Former slugs may permanent-redirect via A08 project_routes.
 */
export default async function CaseStudyRoute({ params }: CaseStudyRouteProps) {
  const { slug } = await params;
  const resolved = await getPublishedCaseStudyBySlugOrRedirect(slug);

  if (resolved.kind === "redirect") {
    permanentRedirect(`/work/${resolved.toSlug}`);
  }

  if (resolved.kind !== "study") {
    notFound();
  }

  const study = resolved.study;
  const serviceHint =
    study.facts.services.length === 1
      ? study.facts.services[0]?.slug
      : undefined;
  const enquiryAction = resolveServicesEnquiryCta({
    serviceSlug: serviceHint,
    label: "Discuss a similar project",
  });

  return (
    <CaseStudyPage
      study={study}
      enquiryAction={enquiryAction}
      headingLevel={1}
    />
  );
}
