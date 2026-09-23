/**
 * Shared Metadata builders for public routes (server-safe).
 */

import type { Metadata } from "next";
import {
  environmentRobotsDirective,
  isPublicIndexingEnabled,
} from "@/lib/seo/indexing-policy";
import { defaultSiteDescription, siteName } from "@/lib/seo/site-copy";
import { joinAbsoluteUrl, resolveCanonicalOrigin } from "@/lib/seo/site-origin";
import { getSiteUrl } from "@/server/env";

const BRAND_SUFFIX = " — Zatroz";

export function getMetadataBase(): URL {
  return new URL(`${getSiteUrl()}/`);
}

/** Absolute title when copy already includes the brand; otherwise template segment. */
export function titleForMetadata(title: string): Metadata["title"] {
  const trimmed = title.trim();
  if (
    trimmed === siteName() ||
    trimmed.endsWith(BRAND_SUFFIX) ||
    trimmed.endsWith(" | Zatroz")
  ) {
    return { absolute: trimmed };
  }
  return trimmed;
}

export type PublicPageMetaInput = Readonly<{
  title: string;
  description: string;
  /** Site-relative canonical path, e.g. `/work` or `/work/my-slug`. */
  canonicalPath: string;
  /** When false, force noindex even on production. */
  indexable?: boolean;
  ogImagePath?: string;
}>;

/**
 * Build metadata for a public HTML page, applying environment indexing policy.
 */
export function buildPublicPageMetadata(input: PublicPageMetaInput): Metadata {
  const envRobots = environmentRobotsDirective();
  const pageIndexable = input.indexable !== false;
  const index = envRobots.index && pageIndexable;
  const follow = envRobots.follow;

  const canonicalPath = input.canonicalPath.startsWith("/")
    ? input.canonicalPath
    : `/${input.canonicalPath}`;

  const ogImage = input.ogImagePath ?? "/opengraph-image";

  const displayTitle = input.title.endsWith(BRAND_SUFFIX)
    ? input.title
    : `${input.title}${BRAND_SUFFIX}`;

  return {
    title: titleForMetadata(input.title),
    description: input.description,
    alternates: {
      canonical: canonicalPath,
    },
    robots: {
      index,
      follow,
      googleBot: {
        index,
        follow,
      },
    },
    openGraph: {
      type: "website",
      locale: "en",
      siteName: siteName(),
      title: displayTitle,
      description: input.description,
      url: canonicalPath,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${siteName()} — ${input.title.replace(BRAND_SUFFIX, "")}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: displayTitle,
      description: input.description,
      images: [ogImage],
    },
  };
}

/** Root layout metadata defaults. */
export function buildRootMetadata(): Metadata {
  const description = defaultSiteDescription();
  const envRobots = environmentRobotsDirective();
  const indexing = isPublicIndexingEnabled();

  return {
    metadataBase: getMetadataBase(),
    title: {
      default: siteName(),
      template: `%s${BRAND_SUFFIX}`,
    },
    description,
    applicationName: siteName(),
    authors: [{ name: siteName() }],
    creator: siteName(),
    robots: {
      index: envRobots.index,
      follow: envRobots.follow,
      googleBot: {
        index: envRobots.index,
        follow: envRobots.follow,
      },
    },
    openGraph: {
      type: "website",
      locale: "en",
      siteName: siteName(),
      title: siteName(),
      description,
      url: "/",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${siteName()} — digital solutions studio`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName(),
      description,
      images: ["/opengraph-image"],
    },
    other: indexing
      ? undefined
      : {
          "zatroz:indexing": "disabled-non-production",
        },
  };
}

/** Absolute URL for JSON-LD / docs (never from Host headers). */
export function absolutePublicUrl(path: string): string {
  return joinAbsoluteUrl(resolveCanonicalOrigin(), path);
}
