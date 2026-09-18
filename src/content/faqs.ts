import type { PublicationState } from "@/types/content";

export type FaqRecord = {
  id: string;
  question: string;
  answer: string;
  publicationState: PublicationState;
  /** Optional link to a service record id */
  relatedServiceId: string | null;
};

/**
 * Draft enquiry FAQs only. No prices, deadlines, ownership, or support SLAs.
 */
export const faqRecords = [
  {
    id: "faq-what-to-expect",
    question: "What happens after I send an enquiry?",
    answer:
      "Draft answer: We review your message and reply using the contact details you provide. We do not publish a fixed response-time promise until monitoring is confirmed.",
    publicationState: "draft",
    relatedServiceId: null,
  },
  {
    id: "faq-not-sure-service",
    question: "What if I am not sure which service I need?",
    answer:
      "Draft answer: Tell us what you are trying to improve in the business. We can help narrow the fit during the conversation. A public Contact page will offer a Not sure option when that route ships.",
    publicationState: "draft",
    relatedServiceId: null,
  },
  {
    id: "faq-project-fit",
    question: "Do you only work with companies in Sri Lanka?",
    answer:
      "Draft answer: Our primary focus is Sri Lankan SMEs and local businesses, with room for international clients when the work is a good fit. Exact geographic claims need founder approval before launch.",
    publicationState: "draft",
    relatedServiceId: null,
  },
] as const satisfies readonly FaqRecord[];
