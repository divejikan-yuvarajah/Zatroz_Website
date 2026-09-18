/**
 * Shared enquiry input model — safe for client and future server use.
 * No secrets, catalog, or database imports.
 *
 * Counting rule: required string lengths use edge-trimmed length
 * (`value.trim().length`). Internal spaces and line breaks in `message`
 * are preserved after edge trim only.
 */

import { SERVICE_SLUGS, type ServiceSlug } from "@/types/content";

export const ENQUIRY_LIMITS = {
  nameMin: 1,
  nameMax: 100,
  emailMax: 254,
  companyMax: 120,
  messageMin: 20,
  messageMax: 5000,
  phoneMax: 40,
  phoneDigitMin: 7,
  phoneDigitMax: 15,
} as const;

export const ENQUIRY_SERVICE_VALUES = ["not-sure", ...SERVICE_SLUGS] as const;

export type EnquiryServiceValue = (typeof ENQUIRY_SERVICE_VALUES)[number];

export const ENQUIRY_TIMELINE_VALUES = [
  "exploring",
  "within-month",
  "one-to-three-months",
  "flexible",
] as const;

export type EnquiryTimelineValue = (typeof ENQUIRY_TIMELINE_VALUES)[number];

export const ENQUIRY_REQUEST_TYPE_VALUES = [
  "project-enquiry",
  "meeting-request",
] as const;

export type EnquiryRequestTypeValue =
  (typeof ENQUIRY_REQUEST_TYPE_VALUES)[number];

export const ENQUIRY_PREFERRED_CONTACT_VALUES = [
  "email",
  "whatsapp",
  "phone",
] as const;

export type EnquiryPreferredContactValue =
  (typeof ENQUIRY_PREFERRED_CONTACT_VALUES)[number];

/** Raw form values as collected from controls (before normalization). */
export type EnquiryFormValues = {
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
  timeline: string;
  requestType: string;
  preferredContact: string;
  phone: string;
};

/** Normalized payload for a future server boundary. */
export type EnquiryNormalizedInput = {
  name: string;
  email: string;
  company: string | null;
  service: EnquiryServiceValue;
  message: string;
  timeline: EnquiryTimelineValue | null;
  requestType: EnquiryRequestTypeValue;
  preferredContact: EnquiryPreferredContactValue;
  /** Present only when preferredContact is phone or whatsapp. */
  phone: string | null;
};

export type EnquiryFieldName = keyof EnquiryFormValues;

export type EnquiryFieldErrors = Partial<Record<EnquiryFieldName, string>>;

export type EnquiryValidationSuccess = {
  ok: true;
  value: EnquiryNormalizedInput;
};

export type EnquiryValidationFailure = {
  ok: false;
  errors: EnquiryFieldErrors;
};

export type EnquiryValidationResult =
  EnquiryValidationSuccess | EnquiryValidationFailure;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isEnquiryServiceValue(value: string): value is EnquiryServiceValue {
  return (ENQUIRY_SERVICE_VALUES as readonly string[]).includes(value);
}

function isTimelineValue(value: string): value is EnquiryTimelineValue {
  return (ENQUIRY_TIMELINE_VALUES as readonly string[]).includes(value);
}

function isRequestTypeValue(value: string): value is EnquiryRequestTypeValue {
  return (ENQUIRY_REQUEST_TYPE_VALUES as readonly string[]).includes(value);
}

function isPreferredContactValue(
  value: string,
): value is EnquiryPreferredContactValue {
  return (ENQUIRY_PREFERRED_CONTACT_VALUES as readonly string[]).includes(
    value,
  );
}

/** Edge-trim helper shared by validation and message counters. */
export function edgeTrim(value: string): string {
  return value.trim();
}

export function countEnquiryMessage(value: string): number {
  return edgeTrim(value).length;
}

/**
 * Usable international phone check: strip common separators, require a
 * reasonable digit count, optional leading +. Not a country-code inventer.
 */
export function isReasonablePhone(value: string): boolean {
  const trimmed = edgeTrim(value);
  if (!trimmed || trimmed.length > ENQUIRY_LIMITS.phoneMax) {
    return false;
  }
  if (!/^[+]?[\d\s().-]+$/.test(trimmed)) {
    return false;
  }
  const digits = trimmed.replace(/\D/g, "");
  return (
    digits.length >= ENQUIRY_LIMITS.phoneDigitMin &&
    digits.length <= ENQUIRY_LIMITS.phoneDigitMax
  );
}

export function isReasonableEmail(value: string): boolean {
  const trimmed = edgeTrim(value);
  if (!trimmed || trimmed.length > ENQUIRY_LIMITS.emailMax) {
    return false;
  }
  if (trimmed.includes(" ")) {
    return false;
  }
  return EMAIL_PATTERN.test(trimmed);
}

export function phoneIsRequired(
  preferredContact: string,
): preferredContact is "phone" | "whatsapp" {
  return preferredContact === "phone" || preferredContact === "whatsapp";
}

export function createEmptyEnquiryValues(
  initialService?: ServiceSlug | null,
): EnquiryFormValues {
  const service =
    initialService && isEnquiryServiceValue(initialService)
      ? initialService
      : "";

  return {
    name: "",
    email: "",
    company: "",
    service,
    message: "",
    timeline: "",
    requestType: "project-enquiry",
    preferredContact: "email",
    phone: "",
  };
}

/**
 * Validate enquiry form values. Client guidance only — the future server
 * must validate independently and ignore unknown properties.
 */
export function validateEnquiryInput(
  values: EnquiryFormValues,
): EnquiryValidationResult {
  const errors: EnquiryFieldErrors = {};

  const name = edgeTrim(values.name);
  if (!name) {
    errors.name = "Enter your name.";
  } else if (name.length > ENQUIRY_LIMITS.nameMax) {
    errors.name = `Use ${ENQUIRY_LIMITS.nameMax} characters or fewer for your name.`;
  }

  const email = edgeTrim(values.email);
  if (!email) {
    errors.email = "Enter a valid email address.";
  } else if (!isReasonableEmail(email)) {
    errors.email = "Enter a valid email address.";
  }

  const companyRaw = edgeTrim(values.company);
  if (companyRaw.length > ENQUIRY_LIMITS.companyMax) {
    errors.company = `Use ${ENQUIRY_LIMITS.companyMax} characters or fewer for company.`;
  }

  const service = values.service.trim();
  if (!service || !isEnquiryServiceValue(service)) {
    errors.service = "Choose a service or Not sure yet.";
  }

  const message = edgeTrim(values.message);
  if (!message) {
    errors.message = "Add a little more detail about your project.";
  } else if (message.length < ENQUIRY_LIMITS.messageMin) {
    errors.message = "Add a little more detail about your project.";
  } else if (message.length > ENQUIRY_LIMITS.messageMax) {
    errors.message = `Use ${ENQUIRY_LIMITS.messageMax} characters or fewer for your message.`;
  }

  const timelineRaw = values.timeline.trim();
  if (timelineRaw && !isTimelineValue(timelineRaw)) {
    errors.timeline = "Choose a timing preference from the list.";
  }

  const requestType = values.requestType.trim() || "project-enquiry";
  if (!isRequestTypeValue(requestType)) {
    errors.requestType = "Choose a request type from the list.";
  }

  const preferredContact = values.preferredContact.trim() || "email";
  if (!isPreferredContactValue(preferredContact)) {
    errors.preferredContact = "Choose a reply channel from the list.";
  }

  let phone: string | null = null;
  if (phoneIsRequired(preferredContact)) {
    const phoneRaw = edgeTrim(values.phone);
    if (!phoneRaw) {
      errors.phone = "Enter a phone or WhatsApp number.";
    } else if (!isReasonablePhone(phoneRaw)) {
      errors.phone =
        "Enter a usable phone number with a country code when possible.";
    } else {
      phone = phoneRaw;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      name,
      email,
      company: companyRaw || null,
      service: service as EnquiryServiceValue,
      message,
      timeline: timelineRaw ? (timelineRaw as EnquiryTimelineValue) : null,
      requestType: requestType as EnquiryRequestTypeValue,
      preferredContact: preferredContact as EnquiryPreferredContactValue,
      phone,
    },
  };
}

/** Field order for error summaries and focus links. */
export const ENQUIRY_FIELD_ORDER: readonly EnquiryFieldName[] = [
  "name",
  "email",
  "company",
  "service",
  "message",
  "timeline",
  "requestType",
  "preferredContact",
  "phone",
] as const;
