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
  {
    id: "faq-wec-which-type",
    question: "Which type of website do I need?",
    answer:
      "Choose a business website when you mainly need clear explanation and enquiries. Choose a catalogue with assisted ordering when people browse items and your team confirms each order. Choose an online store when you are ready to run checkout, payments, and fulfilment rules. We help pick the fit from how you sell today — not from a fixed package name.",
    publicationState: "draft",
    relatedServiceId: "svc-websites-ecommerce",
  },
  {
    id: "faq-wec-assisted-ordering",
    question: "Can we start with assisted ordering?",
    answer:
      "Yes, when a catalogue plus enquiry or WhatsApp order path matches how you fulfil today. That path does not automatically confirm a sale; your team still confirms stock, price, and delivery. A later move to full checkout can be discussed once the process is ready.",
    publicationState: "draft",
    relatedServiceId: "svc-websites-ecommerce",
  },
  {
    id: "faq-wec-update-content",
    question: "Can I update content myself?",
    answer:
      "When the proposal includes an agreed editing tool or update path, you can change the content areas we hand over. Product entry, structured catalogue work, and design changes outside that path stay proposal-scoped.",
    publicationState: "draft",
    relatedServiceId: "svc-websites-ecommerce",
  },
  {
    id: "faq-wec-what-to-provide",
    question: "What do I need to provide?",
    answer:
      "Expect brand assets, approved page or product information, a content owner, and domain or hosting ownership details when they exist. For catalogue or store scopes, also share product images and ordering, payment, and delivery rules. Do not send passwords in the enquiry — sensitive access is arranged securely later.",
    publicationState: "draft",
    relatedServiceId: "svc-websites-ecommerce",
  },
  {
    id: "faq-wec-hosting-costs",
    question: "How are hosting, maintenance, and ongoing costs handled?",
    answer:
      "Domain and hosting renewals, paid plugins or services, and payment-provider fees (when a store is in scope) are usually separate from the build unless the proposal says otherwise. Maintenance and who manages content updates are agreed explicitly — we do not quote unverified provider prices or offer lifetime hosting on this page.",
    publicationState: "draft",
    relatedServiceId: "svc-websites-ecommerce",
  },
  {
    id: "faq-wma-web-or-mobile",
    question: "Web or mobile first?",
    answer:
      "Start from where people do the task today. A browser application often fits desks and shared workstations; a phone-focused application fits on-the-go capture or device features. Many teams begin with one platform and a single journey, then expand only when that release proves useful. Both platforms together are not required for a first version.",
    publicationState: "draft",
    relatedServiceId: "svc-web-mobile-apps",
  },
  {
    id: "faq-wma-smaller-release",
    question: "Can we start with a smaller release?",
    answer:
      "Yes. A focused first version means one core user journey that works reliably for the first user group — not a rushed or insecure product. Extra roles, integrations, and platforms are planned as later increments when justified by feedback.",
    publicationState: "draft",
    relatedServiceId: "svc-web-mobile-apps",
  },
  {
    id: "faq-wma-existing-system",
    question: "Can an existing system be connected?",
    answer:
      "When the proposal includes an integration, we use documented interfaces and agreed access arrangements. Connecting an existing system is scoped work — not automatic with every application. Sensitive production access is arranged securely later, not through the public enquiry form.",
    publicationState: "draft",
    relatedServiceId: "svc-web-mobile-apps",
  },
  {
    id: "faq-wma-without-internet",
    question: "Will it work without internet?",
    answer:
      "Only when offline behaviour is explicitly designed and included in scope. Synchronisation and conflict handling need clear rules. Do not assume the application works everywhere or keeps working without connectivity by default.",
    publicationState: "draft",
    relatedServiceId: "svc-web-mobile-apps",
  },
  {
    id: "faq-wma-after-launch",
    question: "What happens after launch?",
    answer:
      "Handover covers agreed access, how feedback is collected, and what maintenance or support is in the proposal. OS, browser, and store changes continue after launch; ongoing work is scoped separately rather than assumed unlimited.",
    publicationState: "draft",
    relatedServiceId: "svc-web-mobile-apps",
  },
  {
    id: "faq-bs-one-module",
    question: "Can we start with one module?",
    answer:
      "Yes. A focused first project on one workflow — for example sales recording or stock movements — is often the sensible start. The other areas on this page are options to discuss, not mandatory modules in every engagement.",
    publicationState: "draft",
    relatedServiceId: "svc-business-systems",
  },
  {
    id: "faq-bs-printer-scanner",
    question: "Can you work with our existing printer or scanner?",
    answer:
      "When a specific model is named in the proposal, we plan to test it with representative cases. Compatibility is not assumed for every device. Hardware that fails validation may need a different model or a scoped workaround.",
    publicationState: "draft",
    relatedServiceId: "svc-business-systems",
  },
  {
    id: "faq-bs-offline",
    question: "Can the system work offline?",
    answer:
      "Only when offline behaviour and synchronisation rules are explicitly designed and included. Do not assume counter sales or stock updates continue without internet by default.",
    publicationState: "draft",
    relatedServiceId: "svc-business-systems",
  },
  {
    id: "faq-bs-existing-data",
    question: "What happens to our existing data?",
    answer:
      "Import, cleanup, and reconciliation are scoped when needed after reviewing data quality. There is no promise of automatic migration from every legacy database or a disruption-free cutover without investigation.",
    publicationState: "draft",
    relatedServiceId: "svc-business-systems",
  },
  {
    id: "faq-bs-who-access",
    question: "Who can access each function?",
    answer:
      "Roles and permissions are agreed for the workflows in scope — for example who can record a sale, correct a quantity, or open a report. Broader access rules outside that scope are not assumed.",
    publicationState: "draft",
    relatedServiceId: "svc-business-systems",
  },
  {
    id: "faq-bs-backup-training",
    question: "How are backup, training, and support handled?",
    answer:
      "Backup and recovery steps, training for the operational owner, and support coverage are proposal decisions. Having a backup file is not enough on its own — restoration must be agreed and tested for the actual system.",
    publicationState: "draft",
    relatedServiceId: "svc-business-systems",
  },
  {
    id: "faq-ai-without-ai",
    question: "Can this be solved without AI?",
    answer:
      "Often yes. When steps and decisions can be written as clear rules, deterministic workflow automation is usually simpler to test and operate. AI-assisted extraction or drafting is considered when the content varies and a person will still review uncertain output.",
    publicationState: "draft",
    relatedServiceId: "svc-ai-automation",
  },
  {
    id: "faq-ai-existing-tools",
    question: "Can you connect to our existing tools?",
    answer:
      "When the proposal includes an integration and usable APIs or exports exist, we can plan constrained access for the agreed workflow. Named tools are only promised when evidence and access support them — not as a default list on this page.",
    publicationState: "draft",
    relatedServiceId: "svc-ai-automation",
  },
  {
    id: "faq-ai-who-reviews",
    question: "Who reviews uncertain or incorrect output?",
    answer:
      "A named person or role in your team. Review queues and exception paths are design requirements for AI-assisted work. Untrusted documents and messages are inputs to process — not instructions that grant a system extra permission.",
    publicationState: "draft",
    relatedServiceId: "svc-ai-automation",
  },
  {
    id: "faq-ai-data-access",
    question: "What data and access do you need?",
    answer:
      "A description of the current process, sample data you may share, systems involved, and decision owners. Production credentials and sensitive personal datasets are not collected through the public enquiry form; access is arranged securely later when scoped.",
    publicationState: "draft",
    relatedServiceId: "svc-ai-automation",
  },
  {
    id: "faq-ai-ongoing-costs",
    question: "What costs continue after launch?",
    answer:
      "Provider usage, monitoring, integration maintenance, and human review time may continue when those items are in scope. Exact amounts depend on volume and vendors — this page does not invent savings percentages or fixed fees.",
    publicationState: "draft",
    relatedServiceId: "svc-ai-automation",
  },
  {
    id: "faq-ai-one-workflow",
    question: "Can we begin with one small workflow?",
    answer:
      "Yes. A limited pilot with representative inputs, expected outputs, failure examples, and an acceptance threshold is the preferred start. Wider rollout follows only after that evaluation — not from a generic claim that every workflow needs AI.",
    publicationState: "draft",
    relatedServiceId: "svc-ai-automation",
  },
  {
    id: "faq-cs-build-or-buy",
    question:
      "How do we decide between an existing product and a custom build?",
    answer:
      "We compare configuring what you already use, integrating existing tools, and building a tailored application against your real workflow gaps. Custom software is chosen only when those practical alternatives cannot support the requirements well — not because a build is assumed cheaper or faster.",
    publicationState: "draft",
    relatedServiceId: "svc-custom-software",
  },
  {
    id: "faq-cs-current-software",
    question: "Can you work with our current software and data?",
    answer:
      "When authorized access and usable APIs or exports exist, integrations can be assessed and scoped. We do not scrape or bypass access controls. Feasibility depends on what each system actually allows.",
    publicationState: "draft",
    relatedServiceId: "svc-custom-software",
  },
  {
    id: "faq-cs-smaller-version",
    question: "Can we launch a smaller first version?",
    answer:
      "Yes. A first useful release for the core journey is preferred. Later roles, integrations, and migrations are planned as separate increments after that release is usable.",
    publicationState: "draft",
    relatedServiceId: "svc-custom-software",
  },
  {
    id: "faq-cs-handover",
    question: "What do we receive at handover?",
    answer:
      "Agreed documentation, access notes, and the deliverables listed in the proposal — typically including deployment notes and how to operate the first release. Exact contents are confirmed after discovery.",
    publicationState: "draft",
    relatedServiceId: "svc-custom-software",
  },
  {
    id: "faq-cs-ownership",
    question: "Who owns the code and design files?",
    answer:
      "Ownership and licensing terms are agreed in the engagement. Third-party components keep their own licences and may be excluded from a simple ownership statement. This page does not make a blanket legal guarantee.",
    publicationState: "draft",
    relatedServiceId: "svc-custom-software",
  },
  {
    id: "faq-cs-after-launch",
    question: "What happens after launch?",
    answer:
      "Hosting, monitoring, provider charges, and support response times continue only as scoped. Maintenance is optional and explicit — not perpetual free support. Changes to APIs or business rules may need follow-on work.",
    publicationState: "draft",
    relatedServiceId: "svc-custom-software",
  },
] as const satisfies readonly FaqRecord[];
