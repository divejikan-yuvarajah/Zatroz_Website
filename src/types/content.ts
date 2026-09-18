/**
 * Shared content types safe for type-only imports.
 * Do not put draft editorial bodies or secrets here.
 */

export type PublicationState = "draft" | "approved" | "archived";

/** Project delivery nature — independent of publicationState. */
export type WorkStatus =
  "client-work" | "live-product" | "prototype" | "research-concept";

/** Canonical service URL segments (must match sitemap / routes). */
export const SERVICE_SLUGS = [
  "websites-ecommerce",
  "web-mobile-apps",
  "business-systems",
  "ai-automation",
  "custom-software",
  "ui-ux-design",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export type ConfirmationStatus = "confirmed" | "unconfirmed";

export type MediaDecorative = {
  decorative: true;
  alt: "";
};

export type MediaDescribed = {
  decorative: false;
  alt: string;
};

export type MediaAlt = MediaDecorative | MediaDescribed;
