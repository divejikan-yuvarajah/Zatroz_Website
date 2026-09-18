import type { ConfirmationStatus } from "@/types/content";

export type BrandDescription = {
  text: string;
  status: ConfirmationStatus;
};

export type PhoneContact = {
  display: string;
  /** E.164 with leading +, no spaces */
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

export type SiteRecord = {
  name: string;
  description: BrandDescription;
  cta: {
    primaryLabel: string;
    secondaryWorkLabel: string;
    secondaryWhatsAppLabel: string;
  };
};

export type ContactRecord = {
  phone: PhoneContact;
  email: EmailContact;
  whatsapp: WhatsAppContact;
  social: {
    instagram: SocialProfile;
    linkedin: SocialProfile;
  };
};

/**
 * Authoritative site + contact records.
 * Confirmation status is editorial metadata; live links use confirmed only.
 */
export const siteRecord = {
  name: "Zatroz",
  description: {
    text: "Digital solutions for everyday work.",
    status: "unconfirmed",
  },
  cta: {
    primaryLabel: "Start a project",
    secondaryWorkLabel: "Explore our work",
    secondaryWhatsAppLabel: "Chat on WhatsApp",
  },
} as const satisfies SiteRecord;

export const contactRecord = {
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
} as const satisfies ContactRecord;
