import type { PublicationState } from "@/types/content";

/**
 * Versioned Privacy / Terms policy records.
 * Draft bodies are gallery-only until publicationState is approved and the
 * matching publicRoutes.*.implemented flag is flipped after owner approval.
 */

export type PolicySectionRecord = {
  /** Stable anchor id (unique within the policy). */
  id: string;
  title: string;
  /** Plain-language paragraphs. */
  paragraphs: readonly string[];
  /** Optional bullet lists under the section. */
  bullets?: readonly string[];
};

export type PolicyPageRecord = {
  id: "privacy-policy" | "terms-of-use";
  kind: "privacy" | "terms";
  publicationState: PublicationState;
  /** Content revision for operators; not a public effective date while draft. */
  version: string;
  /** ISO date when this draft was last reviewed in-repo. */
  lastReviewedOn: string | null;
  /** Public effective date — null until owner approval supplies one. */
  effectiveOn: string | null;
  /** Server-owned notice id for future accepted-enquiry provenance. */
  noticeId: string;
  heroTitle: string;
  introduction: string;
  sections: readonly PolicySectionRecord[];
  pageTitle: string;
  pageDescription: string;
  /** Short contact-form notice once Privacy is public-ready. */
  shortDataUseNotice: string;
};

/** Matches confirmed `contactRecord.email.display`. */
const CONTACT_EMAIL = "zatroz.co@gmail.com";

export const privacyPolicyRecord = {
  id: "privacy-policy",
  kind: "privacy",
  publicationState: "draft",
  version: "0.1.0-draft",
  lastReviewedOn: "2026-09-22",
  effectiveOn: null,
  noticeId: "privacy-notice-v0-draft",
  heroTitle: "Privacy",
  introduction:
    "This draft explains how the Zatroz website handles information in the product as built today. It is for owner review — it is not a certificate of legal compliance, and it is not public until approved.",
  sections: [
    {
      id: "who-operates",
      title: "Who operates this website",
      paragraphs: [
        "The website is published under the brand name Zatroz. The exact legal or trading name, registration number, and office address are not published here until the operator confirms them.",
        `For privacy questions or requests about information you sent through this website, email ${CONTACT_EMAIL}. WhatsApp may also be used when that channel is shown on the Contact page.`,
        "No separate data-protection officer is named in the current records.",
      ],
    },
    {
      id: "what-you-provide",
      title: "Information you provide",
      paragraphs: [
        "When you contact Zatroz by email or WhatsApp, you choose what to write in that app. Those messages are handled in those apps and mailboxes.",
        "When the website enquiry form is enabled, it is designed to collect: name, email, optional company, selected service, message, optional timeline, request type (project enquiry or meeting request), preferred contact method, and phone when the preferred method is phone or WhatsApp.",
        "The public form is not accepting submissions yet. Enabling it is a separate operational decision and is not unlocked merely because this Privacy draft exists.",
        "We do not ask for passwords, payment-card numbers, or confidential customer datasets through the public enquiry form or the public contact channels described on this site.",
      ],
    },
    {
      id: "technical-information",
      title: "Technical information we process",
      paragraphs: [
        "To protect the service and store enquiries safely, the server may process technical request information such as a trusted client IP address (when the host provides one), standard request metadata needed for security checks, and challenge tokens from Cloudflare Turnstile when that check is configured.",
        "For rate limiting, a trusted identity string (often derived from IP) is stored as an HMAC hash. That hash supports abuse controls. It is not the same as deleting your enquiry, and it should not be described as fully anonymous.",
        "A separate HMAC fingerprint of the business enquiry fields supports duplicate-submission protection. Challenge tokens and other transport-only values are kept out of that business fingerprint so a retry with a fresh challenge can still match the same enquiry.",
      ],
    },
    {
      id: "purposes",
      title: "Why we process this information",
      paragraphs: [
        "Enquiry and contact details are used to read your request, reply, and discuss a possible project or meeting.",
        "Technical and challenge data are used for security, abuse prevention, readiness checks, and reliable storage.",
        "Staff account, session, and multi-factor authentication data are used only to run the private admin tools.",
        "This draft does not describe marketing lists, advertising profiles, sale of personal data, or training public AI models on your enquiry messages. If those practices are ever introduced, this notice must be updated before they run.",
      ],
    },
    {
      id: "processors",
      title: "Services that help us run the site",
      paragraphs: [
        "Depending on configuration, information may be processed by:",
      ],
      bullets: [
        "The website host that runs the application (commonly a Vercel-style deployment for this stack).",
        "MongoDB Atlas — application database for enquiries, notification intents, rate-limit records, and staff auth data.",
        "Cloudflare Turnstile — bot challenge verification when enabled.",
        "Resend — transactional email delivery for internal enquiry notifications when enabled (allowlisted recipients only).",
        "Cloudinary — media files for the staff media library and published project images.",
        "The operator’s email or WhatsApp provider when you write through those channels directly.",
      ],
    },
    {
      id: "international-processing",
      title: "Where processing may happen",
      paragraphs: [
        "Zatroz is oriented around work with clients in Sri Lanka and elsewhere, but hosting and SaaS processors often run in more than one country.",
        "Exact cloud regions depend on the operator’s accounts. This draft does not invent a fixed country list. When the public notice is approved, the operator should record the real regions then in use.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies and similar technologies",
      paragraphs: [
        "The public marketing pages in this repository do not currently ship a first-party analytics or advertising pixel package.",
        "Staff admin sign-in uses session cookies (Better Auth) so authorised people can use private tools. Those cookies are for administration, not public tracking.",
        "Cloudflare Turnstile may use cookies or local storage as part of its challenge flow when the form challenge is enabled.",
        "The enquiry form does not rely on localStorage to hold your message as the system of record. In-progress browser state can be lost on refresh.",
        "There is no decorative cookie banner in this build. A consent banner should only appear if non-essential tracking is actually enabled and needs a real control.",
      ],
    },
    {
      id: "retention",
      title: "How long we keep information",
      paragraphs: [
        "A final public retention period for enquiries has not been approved yet. Until that decision is recorded, this draft does not invent a number of days.",
        "Operational copies can exist in more than one place: the application database, email-provider logs, team mailboxes, notification retry records, webhook receipts, and backups. Deleting one copy does not instantly erase every other copy.",
        "Rate-limit counters are short-lived. Notification retry and delivery records follow the operational recovery design and are not a substitute for a published retention policy.",
      ],
    },
    {
      id: "your-requests",
      title: "Access, correction, and deletion requests",
      paragraphs: [
        `Email ${CONTACT_EMAIL} to ask about information you sent through this website. Describe the request clearly and include enough detail for the team to find the right record (for example the approximate date and the email you used).`,
        "The team may ask proportionate follow-up questions to avoid disclosing someone else’s information. This process does not automatically demand identity documents.",
        "This draft does not promise a fixed statutory response deadline or instant complete erasure from every backup and mailbox.",
      ],
    },
    {
      id: "security",
      title: "Security measures (proportionate)",
      paragraphs: [
        "Controls in the product include server-side validation, abuse rate limits, challenge verification when configured, restricted admin permissions with multi-factor authentication for elevated staff access, and private handling of enquiry records.",
        "No website can promise perfect security. Incidents are handled operationally; this notice does not publish secret endpoints, keys, or firewall rules.",
      ],
    },
    {
      id: "children",
      title: "Children",
      paragraphs: [
        "The website is aimed at business project enquiries. It is not designed for children to submit personal information.",
      ],
    },
    {
      id: "sri-lanka-law-notes",
      title: "Sri Lanka data-protection context",
      paragraphs: [
        "Sri Lanka has enacted the Personal Data Protection Act, No. 9 of 2022, later amended by Act No. 22 of 2025. The Data Protection Authority publishes materials at https://www.dpa.gov.lk/.",
        "Commencement of parts of the Act is by Gazette order. Secondary reporting around Gazette Extraordinary No. 2498/16 (2026) describes further commencement steps; the operator and counsel should re-check the official Gazette text before treating any date or Part as settled in a published notice.",
        "This page does not claim that Zatroz is certified compliant, does not invent a lawful basis label, and does not assert that a specific foreign privacy law automatically governs every visitor.",
      ],
    },
    {
      id: "updates",
      title: "Updates to this notice",
      paragraphs: [
        "When an approved version is published, Zatroz should show a clear effective date and keep older notice identifiers for records where needed.",
        "This draft version has no public effective date. Gallery review uses the in-repo version label only.",
      ],
    },
  ],
  pageTitle: "Privacy — Zatroz",
  pageDescription:
    "How the Zatroz website handles enquiry and technical information.",
  shortDataUseNotice:
    "We use the details you send to respond to this enquiry and discuss the project. Read the Privacy page for more detail. We do not ask for passwords, payment cards, or confidential customer records here.",
} as const satisfies PolicyPageRecord;

export const termsOfUseRecord = {
  id: "terms-of-use",
  kind: "terms",
  publicationState: "draft",
  version: "0.1.0-draft",
  lastReviewedOn: "2026-09-22",
  effectiveOn: null,
  noticeId: "terms-notice-v0-draft",
  heroTitle: "Website terms",
  introduction:
    "These draft terms cover ordinary use of the Zatroz marketing website. They are not a signed project contract, proposal, or statement of work. They stay in review until the operator approves a public version.",
  sections: [
    {
      id: "operator-contact",
      title: "Operator and contact",
      paragraphs: [
        "This website is published under the brand Zatroz. Confirmed contact routes appear on the Contact page (currently email and WhatsApp when those channels are confirmed in the site records).",
        `General website questions: ${CONTACT_EMAIL}.`,
        "Legal entity details beyond the brand name are omitted until the operator confirms what may be published.",
      ],
    },
    {
      id: "website-purpose",
      title: "Purpose of the website",
      paragraphs: [
        "The site explains Zatroz services, selected work, process, and contact options so potential clients can decide whether to start a conversation.",
        "Content may change as services and examples are updated. Draft pages elsewhere on the site may remain unpublished until approved.",
      ],
    },
    {
      id: "acceptable-use",
      title: "Acceptable use",
      paragraphs: [
        "Use the site for lawful enquiry and browsing. Do not attempt to disrupt the service, probe private admin tools, bypass security controls, submit automated spam, or upload harmful content through available forms or channels.",
        "Do not use public contact channels to send malware, secrets you are not authorised to share, or other people’s personal data without a good reason connected to a project enquiry.",
      ],
    },
    {
      id: "enquiries-not-contracts",
      title: "Enquiries are not contracts",
      paragraphs: [
        "Sending an enquiry, email, or WhatsApp message does not create a project contract, book a meeting by itself, or confirm pricing, delivery dates, or scope.",
        "Project terms — including scope, fees, payment, support, timelines, and ownership of deliverables — are agreed separately when both sides choose to proceed.",
        "These website terms do not add cancellation penalties, subscription billing, unlimited support promises, or a blanket no-refund rule.",
      ],
    },
    {
      id: "site-materials",
      title: "Website materials and examples",
      paragraphs: [
        "Text, layout, and branding on this website are provided for information about Zatroz. You may not copy the site as a template for another commercial site without permission.",
        "Project examples and case-style stories describe work for illustration. Client names, marks, and third-party materials remain with their owners. Status labels (for example prototype versus live product) should be read as written.",
        "Third-party libraries, fonts, and media remain under their own licences.",
      ],
    },
    {
      id: "external-links",
      title: "External links and channels",
      paragraphs: [
        "Links to WhatsApp, email, or other external services open those third-party tools. Their terms and privacy notices also apply once you leave this website.",
      ],
    },
    {
      id: "availability",
      title: "Availability and updates",
      paragraphs: [
        "The website may be unavailable during maintenance, incidents, or hosting problems. Features such as the enquiry form, email notifications, or admin tools may be disabled until configuration and review gates pass.",
        "We may update content and these terms. An approved public version should carry a clear effective date.",
      ],
    },
    {
      id: "liability-review",
      title: "Liability, warranties, and governing law (for review)",
      paragraphs: [
        "The public website is provided for general information. It does not promise uninterrupted access or error-free content.",
        "Detailed limitation-of-liability, warranty disclaimer, indemnity, governing-law, and dispute wording for the operator’s legal entity are left for appropriate review. This draft does not invent sweeping waivers or choose a jurisdiction on the operator’s behalf.",
      ],
    },
    {
      id: "age",
      title: "Audience",
      paragraphs: [
        "The site is intended for people exploring business software and design services. If a minimum-age rule is required for the operator’s situation, counsel should supply that clause before publication.",
      ],
    },
    {
      id: "contact-for-terms",
      title: "Questions about these terms",
      paragraphs: [
        `Email ${CONTACT_EMAIL} with questions about this website’s terms. Project contract questions belong in a separate written agreement.`,
      ],
    },
  ],
  pageTitle: "Website terms — Zatroz",
  pageDescription:
    "Terms for using the Zatroz marketing website. Project work is agreed separately.",
  shortDataUseNotice: "",
} as const satisfies PolicyPageRecord;
