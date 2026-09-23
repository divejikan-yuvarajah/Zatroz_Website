/**
 * Eligible absolute URLs for the production sitemap.
 * Omits lastModified when a meaningful publication timestamp is unavailable.
 */

import "server-only";

import type { MetadataRoute } from "next";
import { publicRoutes } from "@/config/routes";
import { isPublicIndexingEnabled } from "@/lib/seo/indexing-policy";
import { joinAbsoluteUrl } from "@/lib/seo/site-origin";
import { getSiteUrl } from "@/server/env";
import {
  getPublicPrivacyPage,
  getPublicTermsPage,
} from "@/server/legal-policies";
import {
  getPublishedCaseStudySlugsForPrerender,
  listPublishedProjects,
} from "@/server/public-projects";
import { getEligibleServiceDetailSlugs } from "@/server/service-detail";

export type SitemapBuildResult =
  | { ok: true; entries: MetadataRoute.Sitemap }
  | { ok: false; reason: "catalogue-unavailable" };

function entry(path: string): MetadataRoute.Sitemap[number] {
  return {
    url: joinAbsoluteUrl(getSiteUrl(), path),
  };
}

/**
 * Build sitemap entries from live public selectors only.
 * When the published-work catalogue is unavailable, fail closed (do not
 * return a successful empty sitemap that would drop known work URLs silently).
 */
export async function buildSitemapEntries(): Promise<SitemapBuildResult> {
  if (!isPublicIndexingEnabled()) {
    // Preview / non-production: empty sitemap is intentional (robots disallow).
    return { ok: true, entries: [] };
  }

  const entries: MetadataRoute.Sitemap = [];

  const always = [
    "home",
    "services",
    "work",
    "about",
    "process",
    "contact",
  ] as const;

  for (const id of always) {
    const route = publicRoutes[id];
    if (route.implemented) {
      entries.push(entry(route.path));
    }
  }

  for (const slug of getEligibleServiceDetailSlugs()) {
    entries.push(entry(`/services/${slug}`));
  }

  // Privacy / terms only when approved public content is ready (index-eligible).
  if (getPublicPrivacyPage()) {
    entries.push(entry(publicRoutes.privacy.path));
  }
  if (getPublicTermsPage()) {
    entries.push(entry(publicRoutes.terms.path));
  }

  const list = await listPublishedProjects({ page: 1, pageSize: 1 });
  if (list.availability === "unavailable") {
    return { ok: false, reason: "catalogue-unavailable" };
  }

  const slugs = await getPublishedCaseStudySlugsForPrerender();
  for (const slug of slugs) {
    entries.push(entry(`/work/${slug}`));
  }

  const seen = new Set<string>();
  const unique = entries.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });

  return { ok: true, entries: unique };
}
