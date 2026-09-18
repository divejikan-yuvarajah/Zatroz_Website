import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyPage } from "@/components/sections/case-study-page";
import {
  getPublishedCaseStudyBySlug,
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
export function generateStaticParams(): { slug: string }[] {
  return getPublishedCaseStudySlugsForPrerender().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CaseStudyRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const study = await getPublishedCaseStudyBySlug(slug);

  if (!study) {
    return {
      title: "Project not found — Zatroz",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: study.pageTitle,
    description: study.pageDescription,
  };
}

/**
 * Public case-study route. Draft, archived, summary-only, and unknown slugs
 * call notFound(). Empty generateStaticParams is valid while no stories exist.
 */
export default async function CaseStudyRoute({ params }: CaseStudyRouteProps) {
  const { slug } = await params;
  const study = await getPublishedCaseStudyBySlug(slug);

  if (!study) {
    notFound();
  }

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
