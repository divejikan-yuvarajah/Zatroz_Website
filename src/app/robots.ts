import type { MetadataRoute } from "next";
import { isPublicIndexingEnabled } from "@/lib/seo/indexing-policy";
import { joinAbsoluteUrl } from "@/lib/seo/site-origin";
import { getSiteUrl } from "@/server/env";

/**
 * robots.txt — production allows public crawl of marketing HTML; previews
 * disallow all. Does not enumerate private project IDs or preview URLs.
 * Authorization remains the access boundary for admin/API.
 */
export default function robots(): MetadataRoute.Robots {
  const origin = getSiteUrl();

  if (!isPublicIndexingEnabled()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/dev/"],
    },
    sitemap: joinAbsoluteUrl(origin, "/sitemap.xml"),
  };
}
