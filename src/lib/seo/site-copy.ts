/**
 * Shared public metadata copy helpers — truthful defaults only.
 */

import { siteBrand } from "@/config/brand";

/** Root default description when page-level copy is sparse or draft. */
export const DEFAULT_SITE_DESCRIPTION =
  "Zatroz builds practical websites, applications, business systems, automation, custom software, and UI/UX for everyday work.";

export function siteName(): string {
  return siteBrand.name;
}

/**
 * Prefer confirmed brand description; otherwise the honest default above.
 * Does not invent awards, client counts, or unverified claims.
 */
export function defaultSiteDescription(): string {
  if (
    siteBrand.description.status === "confirmed" &&
    siteBrand.description.text.trim()
  ) {
    return siteBrand.description.text.trim();
  }
  return DEFAULT_SITE_DESCRIPTION;
}

/** Truncate for meta description without cutting mid-word when possible. */
export function clipMetaDescription(text: string, max = 160): string {
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (trimmed.length <= max) {
    return trimmed;
  }
  const slice = trimmed.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  if (lastSpace > max * 0.6) {
    return `${slice.slice(0, lastSpace)}…`;
  }
  return `${slice}…`;
}
