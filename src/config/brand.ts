/**
 * Public-safe brand/contact helpers for Server Components and gallery fixtures.
 * Authoritative records live in `src/content/site.ts`.
 * Do not import `src/content/catalog` or draft collections from Client Components.
 */

import {
  contactRecord,
  siteRecord,
  type BrandDescription,
  type ContactRecord,
  type EmailContact,
  type PhoneContact,
  type SiteRecord,
  type SocialProfile,
  type WhatsAppContact,
} from "@/content/site";
import type { ConfirmationStatus } from "@/types/content";

export type { ConfirmationStatus };
export type {
  BrandDescription,
  EmailContact,
  PhoneContact,
  SocialProfile,
  WhatsAppContact,
};

export type SiteBrand = {
  name: string;
  description: BrandDescription;
};

export type SiteContact = ContactRecord;

export type PublicContactLink = {
  id: string;
  label: string;
  href: string;
};

export const siteBrand: SiteBrand = {
  name: siteRecord.name,
  description: {
    text: siteRecord.description.text,
    status: siteRecord.description.status,
  },
};

export const siteContact: SiteContact = {
  phone: { ...contactRecord.phone },
  email: { ...contactRecord.email },
  whatsapp: { ...contactRecord.whatsapp },
  social: {
    instagram: { ...contactRecord.social.instagram },
    linkedin: { ...contactRecord.social.linkedin },
  },
};

/** Build-time / request-time year for the copyright line (Server Component). */
export function getCopyrightYear(date = new Date()): number {
  return date.getFullYear();
}

export function getTelHref(phone: PhoneContact): string {
  return `tel:${phone.e164}`;
}

export function getMailtoHref(
  email: EmailContact,
  options?: { subject?: string; body?: string },
): string {
  const params = new URLSearchParams();
  if (options?.subject) {
    params.set("subject", options.subject);
  }
  if (options?.body) {
    params.set("body", options.body);
  }
  const query = params.toString();
  return query ? `mailto:${email.display}?${query}` : `mailto:${email.display}`;
}

/** Generic enquiry mailto — no visitor data. */
export function getEnquiryMailtoHref(
  email: EmailContact,
  options?: { serviceTitle?: string },
): string {
  const subject = options?.serviceTitle
    ? `Project enquiry — ${options.serviceTitle}`
    : "Project enquiry";
  return getMailtoHref(email, {
    subject,
    body: siteContact.whatsapp.prefillsMessage,
  });
}

export function getWhatsAppHref(
  whatsapp: WhatsAppContact,
  options?: { serviceTitle?: string },
): string {
  const base = whatsapp.prefillsMessage;
  const message = options?.serviceTitle
    ? `${base} Interested in ${options.serviceTitle}.`
    : base;
  const text = encodeURIComponent(message);
  return `https://wa.me/${whatsapp.internationalDigits}?text=${text}`;
}

/**
 * Contact and social links that may appear in the live footer.
 * Unconfirmed channels and missing social URLs are omitted.
 */
export function getPublicContactLinks(
  contact: SiteContact = siteContact,
): PublicContactLink[] {
  const links: PublicContactLink[] = [];

  if (contact.phone.status === "confirmed") {
    links.push({
      id: "phone",
      label: contact.phone.display,
      href: getTelHref(contact.phone),
    });
  }

  if (contact.email.status === "confirmed") {
    links.push({
      id: "email",
      label: contact.email.display,
      href: getMailtoHref(contact.email),
    });
  }

  if (contact.whatsapp.status === "confirmed") {
    links.push({
      id: "whatsapp",
      label: "WhatsApp",
      href: getWhatsAppHref(contact.whatsapp),
    });
  }

  for (const [id, profile] of Object.entries(contact.social) as [
    string,
    SocialProfile,
  ][]) {
    if (profile.status === "confirmed" && profile.href) {
      links.push({
        id,
        label: profile.label,
        href: profile.href,
      });
    }
  }

  return links;
}

export type { SiteRecord };
