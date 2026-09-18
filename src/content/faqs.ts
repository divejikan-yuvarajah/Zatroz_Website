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
 * Draft enquiry FAQs for review. Conditional wording only — no prices,
 * fixed turnarounds, unlimited revisions, free ongoing support, or legal guarantees.
 */
export const faqRecords = [
  {
    id: "faq-how-to-start",
    question: "How do I start, and what information should I share?",
    answer:
      "Share the business need you want to improve, who will use the result, and any systems or content you already have. An early idea is enough to begin a conversation. Exact next steps and timelines are agreed after we understand the scope.",
    publicationState: "draft",
    relatedServiceId: null,
  },
  {
    id: "faq-not-sure-service",
    question: "What if I am not sure which service I need?",
    answer:
      "Tell us what you are trying to improve in the business. We can help narrow a suitable service during the conversation. Choosing a label on the site is less important than describing the real task.",
    publicationState: "draft",
    relatedServiceId: null,
  },
  {
    id: "faq-scope-time-cost",
    question: "How does scope affect time and cost?",
    answer:
      "Broader features, more stakeholders, integrations, and content readiness all change effort. We discuss scope first, then propose time and cost based on that scope — not a single fixed price for every project.",
    publicationState: "draft",
    relatedServiceId: null,
  },
  {
    id: "faq-content-assets",
    question: "Who prepares content and assets?",
    answer:
      "You usually supply business facts, product details, and approved brand assets. We can help structure and polish copy or UI where agreed in the proposal. Stock imagery and third-party assets need clear permission before use.",
    publicationState: "draft",
    relatedServiceId: null,
  },
  {
    id: "faq-ownership-access",
    question: "How are ownership and access agreed?",
    answer:
      "Access to code, hosting accounts, and content is agreed in the proposal for your project. Third-party platforms keep their own terms. We do not invent blanket ownership claims on this page.",
    publicationState: "draft",
    relatedServiceId: null,
  },
  {
    id: "faq-hosting-maintenance",
    question: "How are hosting, maintenance, and third-party costs handled?",
    answer:
      "Hosting, domains, paid APIs, and app-store fees are usually separate from build work unless the proposal says otherwise. Ongoing maintenance and support are scoped explicitly — not assumed as free unlimited changes.",
    publicationState: "draft",
    relatedServiceId: null,
  },
] as const satisfies readonly FaqRecord[];
