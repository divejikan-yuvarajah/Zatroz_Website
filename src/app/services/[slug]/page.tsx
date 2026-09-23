import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ServiceDetailPage } from "@/components/sections/service-detail-page";
import {
  getEligibleServiceDetailSlugs,
  getPublicServiceDetail,
} from "@/server/service-detail";
import { buildPublicPageMetadata } from "@/server/seo/metadata";

type ServiceDetailRouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams(): { slug: string }[] {
  return getEligibleServiceDetailSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ServiceDetailRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getPublicServiceDetail(slug);

  if (!detail) {
    return buildPublicPageMetadata({
      title: "Service not found",
      description: "That service page is not available on the Zatroz website.",
      canonicalPath: `/services/${slug}`,
      indexable: false,
    });
  }

  return buildPublicPageMetadata({
    title: detail.pageTitle,
    description: detail.pageDescription,
    canonicalPath: `/services/${detail.slug}`,
  });
}

/**
 * Dynamic service detail route for the six canonical slugs.
 * Unknown, draft, archived, or unimplemented details call notFound().
 * Empty generateStaticParams is valid while no public details are ready.
 */
export default async function ServiceDetailRoute({
  params,
}: ServiceDetailRouteProps) {
  const { slug } = await params;
  const detail = await getPublicServiceDetail(slug);

  if (!detail) {
    notFound();
  }

  return <ServiceDetailPage detail={detail} headingLevel={1} />;
}
