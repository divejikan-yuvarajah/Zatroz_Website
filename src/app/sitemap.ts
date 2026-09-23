import type { MetadataRoute } from "next";
import { buildSitemapEntries } from "@/server/seo/sitemap-entries";

/**
 * Dynamic sitemap of indexable public URLs only.
 * When the published catalogue is unavailable, throw so the response is a
 * diagnosable failure rather than a successful empty document.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const result = await buildSitemapEntries();
  if (!result.ok) {
    throw new Error(
      `Sitemap unavailable: ${result.reason}. Retry after catalogue recovery.`,
    );
  }
  return result.entries;
}
