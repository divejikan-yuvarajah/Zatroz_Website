import "server-only";

import {
  getEnquiryMailtoHref,
  getPublicContactLinks,
  getWhatsAppHref,
  siteContact,
  type PublicContactLink,
} from "@/config/brand";
import { contentCatalog } from "@/content/catalog";
import type {
  ContactIncludeItem,
  ContactPageFaqRecord,
} from "@/content/contact-page";
import { publicRoutes } from "@/config/routes";
import type { ServiceSlug } from "@/types/content";

export type PublicContactMethod = Readonly<{
  id: string;
  kind: "email" | "whatsapp" | "phone" | "social";
  label: string;
  /** Visible detail (email address, phone display, or channel name). */
  detail: string;
  href: string;
  actionLabel: string;
}>;

export type PublicContactServiceContext = Readonly<{
  slug: ServiceSlug;
  title: string;
}>;

export type PublicContactFaq = Readonly<{
  id: string;
  question: string;
  answer: string;
}>;

export type PublicContactPage = Readonly<{
  id: "contact-page";
  heroTitle: string;
  introduction: string;
  methodsHeading: string;
  methodsSupporting: string;
  methods: readonly PublicContactMethod[];
  includeHeading: string;
  includeItems: readonly ContactIncludeItem[];
  nextStepsHeading: string;
  nextStepsBody: string;
  dataUseHeading: string;
  dataUseNotice: string;
  /** Privacy link only when that route is implemented. */
  privacyHref: string | null;
  sensitiveNote: string;
  faqHeading: string;
  faqs: readonly PublicContactFaq[];
  serviceContext: PublicContactServiceContext | null;
  /** Always false until a later backend gate — public page must omit the form. */
  formSubmissionReady: boolean;
  pageTitle: string;
  pageDescription: string;
}>;

function serviceTitle(slug: ServiceSlug): string {
  const match = contentCatalog.services.find(
    (service) => service.slug === slug,
  );
  return match?.title ?? slug;
}

function buildContactMethods(
  serviceContext: PublicContactServiceContext | null,
): PublicContactMethod[] {
  const methods: PublicContactMethod[] = [];

  if (siteContact.email.status === "confirmed") {
    methods.push({
      id: "email",
      kind: "email",
      label: "Email",
      detail: siteContact.email.display,
      href: getEnquiryMailtoHref(siteContact.email, {
        serviceTitle: serviceContext?.title,
      }),
      actionLabel: "Email Zatroz",
    });
  }

  if (siteContact.whatsapp.status === "confirmed") {
    methods.push({
      id: "whatsapp",
      kind: "whatsapp",
      label: "WhatsApp",
      detail: siteContact.phone.display,
      href: getWhatsAppHref(siteContact.whatsapp, {
        serviceTitle: serviceContext?.title,
      }),
      actionLabel: "Message on WhatsApp",
    });
  }

  if (siteContact.phone.status === "confirmed") {
    methods.push({
      id: "phone",
      kind: "phone",
      label: "Phone",
      detail: siteContact.phone.display,
      href: `tel:${siteContact.phone.e164}`,
      actionLabel: "Call Zatroz",
    });
  }

  return methods;
}

function projectFaqs(
  faqs: readonly ContactPageFaqRecord[],
): PublicContactFaq[] {
  return faqs.map((faq) => ({
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
  }));
}

function buildContactPage(
  options: {
    serviceSlug?: ServiceSlug | null;
    includeDraftCopy?: boolean;
  } = {},
): PublicContactPage {
  const record = contentCatalog.contactPage;
  const includeDraftCopy = options.includeDraftCopy ?? false;
  const serviceSlug = options.serviceSlug ?? null;
  const serviceContext = serviceSlug
    ? { slug: serviceSlug, title: serviceTitle(serviceSlug) }
    : null;

  const framingReady =
    record.publicationState === "approved" || includeDraftCopy;

  return {
    id: "contact-page",
    heroTitle: framingReady ? record.heroTitle : "Contact",
    introduction: framingReady
      ? record.introduction
      : "Use the channels below to reach Zatroz. Fuller page copy stays in review until founders approve it.",
    methodsHeading: framingReady ? record.methodsHeading : "Ways to reach us",
    methodsSupporting: framingReady
      ? record.methodsSupporting
      : "Opening email or WhatsApp starts a conversation in that app — it does not mean a message was already sent.",
    methods: buildContactMethods(serviceContext),
    includeHeading: record.includeHeading,
    includeItems: framingReady ? [...record.includeItems] : [],
    nextStepsHeading: record.nextStepsHeading,
    nextStepsBody: framingReady ? record.nextStepsBody : "",
    dataUseHeading: record.dataUseHeading,
    dataUseNotice: framingReady ? record.dataUseNotice : "",
    privacyHref: publicRoutes.privacy.implemented
      ? publicRoutes.privacy.path
      : null,
    sensitiveNote: framingReady ? record.sensitiveNote : "",
    faqHeading: record.faqHeading,
    faqs: framingReady ? projectFaqs(record.faqs) : [],
    serviceContext,
    formSubmissionReady: record.formSubmissionReady,
    pageTitle: record.pageTitle,
    pageDescription: record.pageDescription,
  };
}

/**
 * Public Contact page projection.
 * Confirmed channels render even while framing copy stays draft.
 * Returns null only when the route should not offer any useful contact path.
 */
export function getPublicContactPage(
  serviceSlug?: ServiceSlug | null,
): PublicContactPage | null {
  const page = buildContactPage({ serviceSlug: serviceSlug ?? null });
  if (
    page.methods.length === 0 &&
    !contentCatalog.contactPage.formSubmissionReady
  ) {
    return null;
  }
  return page;
}

/** Gallery draft — full framing copy including FAQs. */
export function getContactGalleryPreview(
  serviceSlug?: ServiceSlug | null,
): PublicContactPage {
  return buildContactPage({
    serviceSlug: serviceSlug ?? null,
    includeDraftCopy: true,
  });
}

/** Footer-compatible confirmed links (unchanged policy). */
export function getContactPageFooterLinks(): readonly PublicContactLink[] {
  return getPublicContactLinks();
}
