/**
 * Public-safe brand and contact values for the site chrome.
 * Confirmation metadata stays here for server/docs use; only confirmed
 * destinations are rendered as links. Do not put approval evidence or
 * private founder contacts in this module.
 */

export type ConfirmationStatus = "confirmed" | "unconfirmed";

export type BrandDescription = {
  text: string;
  status: ConfirmationStatus;
};

export type PhoneContact = {
  display: string;
  /** E.164 without spaces, for tel: */
  e164: string;
  status: ConfirmationStatus;
};

export type EmailContact = {
  display: string;
  status: ConfirmationStatus;
};

export type WhatsAppContact = {
  /** Digits only, country code included, no + */
  internationalDigits: string;
  /** Short generic message; no visitor data */
  prefillsMessage: string;
  status: ConfirmationStatus;
};

export type SocialProfile = {
  label: string;
  /** Exact profile URL when known; null until founders supply it */
  href: string | null;
  status: ConfirmationStatus;
};

export type SiteBrand = {
  name: string;
  description: BrandDescription;
};

export type SiteContact = {
  phone: PhoneContact;
  email: EmailContact;
  whatsapp: WhatsAppContact;
  social: {
    instagram: SocialProfile;
    linkedin: SocialProfile;
  };
};

export type PublicContactLink = {
  id: string;
  label: string;
  href: string;
};

export const siteBrand: SiteBrand = {
  name: "Zatroz",
  description: {
    text: "Digital solutions for everyday work.",
    status: "unconfirmed",
  },
};

/**
 * Supplied working values from the plan. Status is unconfirmed until
 * founders mark them approved for public pages (see brand-and-contact.md).
 */
export const siteContact: SiteContact = {
  phone: {
    display: "+94 76 809 8068",
    e164: "+94768098068",
    status: "unconfirmed",
  },
  email: {
    display: "zatroz.co@gmail.com",
    status: "unconfirmed",
  },
  whatsapp: {
    internationalDigits: "94768098068",
    prefillsMessage: "I would like to discuss a project with Zatroz.",
    status: "unconfirmed",
  },
  social: {
    instagram: {
      label: "Instagram",
      href: null,
      status: "unconfirmed",
    },
    linkedin: {
      label: "LinkedIn",
      href: null,
      status: "unconfirmed",
    },
  },
};

/** Build-time / request-time year for the copyright line (Server Component). */
export function getCopyrightYear(date = new Date()): number {
  return date.getFullYear();
}

export function getTelHref(phone: PhoneContact): string {
  return `tel:${phone.e164}`;
}

export function getMailtoHref(email: EmailContact): string {
  return `mailto:${email.display}`;
}

export function getWhatsAppHref(whatsapp: WhatsAppContact): string {
  const text = encodeURIComponent(whatsapp.prefillsMessage);
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
