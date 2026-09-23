import type { PublicationState } from "@/types/content";

export type ContactPageFaqRecord = {
  id: string;
  question: string;
  answer: string;
};

export type ContactIncludeItem = {
  id: string;
  text: string;
};

/**
 * Contact page editorial record.
 * Page copy stays draft until founders approve framing.
 * Channel confirmation lives on `contactRecord` (email / WhatsApp / phone).
 * Embedded form submission readiness is separate and stays false until later.
 */
export type ContactPageRecord = {
  id: "contact-page";
  publicationState: PublicationState;
  /** Live form on public /contact — false until backend gates after Step 43. */
  formSubmissionReady: boolean;
  heroTitle: string;
  introduction: string;
  methodsHeading: string;
  methodsSupporting: string;
  includeHeading: string;
  includeItems: readonly ContactIncludeItem[];
  nextStepsHeading: string;
  nextStepsBody: string;
  dataUseHeading: string;
  dataUseNotice: string;
  sensitiveNote: string;
  faqHeading: string;
  faqs: readonly ContactPageFaqRecord[];
  pageTitle: string;
  pageDescription: string;
};

export const contactPageRecord = {
  id: "contact-page",
  publicationState: "approved",
  formSubmissionReady: false,
  heroTitle: "Tell us what you want to build.",
  introduction:
    "Share a short note about your business and what you need to improve. An early idea is enough to start — we will reply with a clear next step, not a packaged price list on this page.",
  methodsHeading: "Contact Zatroz",
  methodsSupporting:
    "Use email or WhatsApp to reach us. Opening a link starts a conversation in that app — it does not mean a message was already sent.",
  includeHeading: "What to include",
  includeItems: [
    {
      id: "include-business",
      text: "What the business does",
    },
    {
      id: "include-need",
      text: "What needs improving",
    },
    {
      id: "include-service",
      text: "A relevant service, if you already know one",
    },
    {
      id: "include-timing",
      text: "Preferred timing or constraints",
    },
  ],
  nextStepsHeading: "What happens next",
  nextStepsBody:
    "We read your note and reply to discuss scope. This page does not book a meeting automatically or promise a fixed response time.",
  dataUseHeading: "How we use your message",
  dataUseNotice:
    "Information you send by email or WhatsApp is used to respond to your enquiry and discuss the project. A fuller privacy notice will appear here when the privacy page is ready. We do not ask for passwords, payment cards, or confidential customer records through these channels.",
  sensitiveNote:
    "Sensitive access or files can be arranged through an agreed channel later — do not send passwords, private keys, or confidential datasets to start.",
  faqHeading: "Before you write",
  faqs: [
    {
      id: "contact-faq-early-idea",
      question: "Is an early idea enough to start?",
      answer:
        "Yes. Describe the business need as best you can. Exact scope, timing, and cost are agreed after we understand the work — not before the first conversation.",
    },
  ],
  pageTitle: "Contact — Zatroz",
  pageDescription:
    "Contact Zatroz by email or WhatsApp to discuss a website, app, system, or design project.",
} as const satisfies ContactPageRecord;

/** Enquiry form field options shared by the layout specimen (Step 42) and later validation (Step 43). */
export const ENQUIRY_SERVICE_OPTIONS = [
  { value: "", label: "Select a service" },
  { value: "not-sure", label: "Not sure yet" },
  { value: "websites-ecommerce", label: "Websites and E-commerce" },
  { value: "web-mobile-apps", label: "Web and Mobile Applications" },
  { value: "business-systems", label: "Business Systems" },
  { value: "ai-automation", label: "AI and Automation" },
  { value: "custom-software", label: "Custom Software" },
  { value: "ui-ux-design", label: "UI/UX Design" },
] as const;

export const ENQUIRY_TIMELINE_OPTIONS = [
  { value: "", label: "Select a preference" },
  { value: "exploring", label: "Exploring options" },
  { value: "within-month", label: "Within a month" },
  { value: "one-to-three-months", label: "1–3 months" },
  { value: "flexible", label: "Flexible" },
] as const;

export const ENQUIRY_REQUEST_TYPE_OPTIONS = [
  { value: "project-enquiry", label: "Project enquiry" },
  { value: "meeting-request", label: "Meeting request" },
] as const;

export const ENQUIRY_PREFERRED_CONTACT_OPTIONS = [
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "phone", label: "Phone" },
] as const;
