import "server-only";

import { contentCatalog } from "@/content/catalog";
import type { PolicyPageRecord } from "@/content/legal-policies";
import { publicRoutes } from "@/config/routes";

export type PublicPolicySection = Readonly<{
  id: string;
  title: string;
  paragraphs: readonly string[];
  bullets: readonly string[];
}>;

export type PublicPolicyPage = Readonly<{
  id: PolicyPageRecord["id"];
  kind: PolicyPageRecord["kind"];
  heroTitle: string;
  introduction: string;
  sections: readonly PublicPolicySection[];
  version: string;
  lastReviewedOn: string | null;
  /** Only set when the approved public page may show an effective date. */
  effectiveOn: string | null;
  noticeId: string;
  pageTitle: string;
  pageDescription: string;
  shortDataUseNotice: string;
  contactEmailHref: string | null;
}>;

function projectPolicy(record: PolicyPageRecord): PublicPolicyPage {
  return {
    id: record.id,
    kind: record.kind,
    heroTitle: record.heroTitle,
    introduction: record.introduction,
    sections: record.sections.map((section) => ({
      id: section.id,
      title: section.title,
      paragraphs: [...section.paragraphs],
      bullets: section.bullets ? [...section.bullets] : [],
    })),
    version: record.version,
    lastReviewedOn: record.lastReviewedOn,
    effectiveOn: record.effectiveOn,
    noticeId: record.noticeId,
    pageTitle: record.pageTitle,
    pageDescription: record.pageDescription,
    shortDataUseNotice: record.shortDataUseNotice,
    contactEmailHref: publicRoutes.contact.implemented
      ? publicRoutes.contact.path
      : "mailto:zatroz.co@gmail.com",
  };
}

function isPublicReady(record: PolicyPageRecord): boolean {
  return (
    record.publicationState === "approved" &&
    record.effectiveOn != null &&
    record.effectiveOn.length > 0
  );
}

/**
 * Public Privacy page. Returns null while draft so `/privacy` stays sparse
 * and does not publish unapproved policy wording or a guessed effective date.
 */
export function getPublicPrivacyPage(): PublicPolicyPage | null {
  const record = contentCatalog.privacyPolicy;
  if (!isPublicReady(record)) {
    return null;
  }
  return projectPolicy(record);
}

/**
 * Public Terms page. Returns null while draft so `/terms` stays sparse.
 */
export function getPublicTermsPage(): PublicPolicyPage | null {
  const record = contentCatalog.termsOfUse;
  if (!isPublicReady(record)) {
    return null;
  }
  return projectPolicy(record);
}

/** Gallery-only Privacy draft for `/dev/ui` review. */
export function getPrivacyGalleryPreview(): PublicPolicyPage {
  return projectPolicy(contentCatalog.privacyPolicy);
}

/** Gallery-only Terms draft for `/dev/ui` review. */
export function getTermsGalleryPreview(): PublicPolicyPage {
  return projectPolicy(contentCatalog.termsOfUse);
}

/** True when Privacy is approved and the public route may link it. */
export function isPrivacyPubliclyLinkable(): boolean {
  return (
    isPublicReady(contentCatalog.privacyPolicy) &&
    publicRoutes.privacy.implemented
  );
}

/** True when Terms is approved and the public route may link it. */
export function isTermsPubliclyLinkable(): boolean {
  return (
    isPublicReady(contentCatalog.termsOfUse) && publicRoutes.terms.implemented
  );
}
