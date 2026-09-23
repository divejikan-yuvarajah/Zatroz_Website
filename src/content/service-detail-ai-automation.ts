import type { ServiceDetailRecord } from "@/content/service-detail";

/**
 * Draft AI and Automation detail copy for review.
 * Not public until overview approval, detail approval, and route readiness align.
 * Describes services only — no live chatbot, model API, upload, or runner.
 */
export const aiAutomationDetail = {
  publicationState: "approved",
  heroTitle: "AI and automation for everyday business work",
  introduction:
    "Start from a specific repetitive task, the data you already have, and a measurable review process. Ordinary workflow rules are often enough; AI helps with extraction or drafting when a person still checks uncertain results. This is not a promise to replace your team or to run decisions without oversight.",
  primaryCtaLabel: "Discuss automation for your workflow",
  heroVisual: "review-workflow",
  audienceItems: [
    {
      id: "ai-aud-repetitive",
      text: "A team spending too much time copying the same information between messages, forms, and spreadsheets.",
    },
    {
      id: "ai-aud-review",
      text: "An owner who wants assistance preparing drafts or extracting fields — with a clear person responsible for review.",
    },
    {
      id: "ai-aud-pilot",
      text: "A business ready to pilot one bounded workflow before expanding tools or model use.",
    },
  ],
  problemItems: [
    {
      id: "ai-prob-entry",
      text: "Repeated data entry and re-typing that introduce delays and mistakes.",
    },
    {
      id: "ai-prob-routing",
      text: "Requests that need sorting or routing before the right person can act.",
    },
    {
      id: "ai-prob-finding",
      text: "Finding approved information scattered across files and inboxes.",
    },
    {
      id: "ai-prob-drafts",
      text: "Preparing first drafts or extracting fields that still need human confirmation.",
    },
    {
      id: "ai-prob-sync",
      text: "Keeping agreed systems in sync without inventing a second source of truth.",
    },
  ],
  scopeOptions: [
    {
      id: "ai-scope-rules",
      title: "Deterministic workflow rules",
      purpose:
        "Useful when the steps and decisions can be written as clear if-then rules without a language model.",
      examples: [
        "Required fields and routing rules",
        "Status changes when conditions are met",
        "Alerts for missing information",
      ],
      notIncluded:
        "Autonomous decision-making, or AI drafting where rules alone would do the job more safely.",
    },
    {
      id: "ai-scope-extraction",
      title: "AI-assisted extraction and drafting",
      purpose:
        "Useful when documents or messages need field extraction or a first draft that a person will review.",
      examples: [
        "Invoice or form field extraction with validation",
        "Draft reply preparation for staff review",
        "Exception queues for uncertain output",
      ],
      notIncluded:
        "Guaranteed accuracy percentages, unattended approvals, or treating untrusted documents as instructions that grant system access.",
    },
    {
      id: "ai-scope-retrieval",
      title: "Retrieval from approved business information",
      purpose:
        "Useful when people need answers grounded in approved sources you control — with source references and review.",
      examples: [
        "Internal knowledge lookup with cited sources",
        "Limits on which collections are searchable",
        "Human confirmation when confidence is low",
      ],
      notIncluded:
        "A guarantee that every answer is complete or correct. Retrieval can still miss or misstate information.",
    },
    {
      id: "ai-scope-classification",
      title: "Enquiry classification with staff review",
      purpose:
        "Useful when incoming requests should be sorted before a person decides the next action.",
      examples: [
        "Suggested labels for enquiries",
        "Review queue for uncertain classifications",
        "Handoff to the agreed owner",
      ],
      notIncluded:
        "Automatic customer promises, refunds, or account changes without a named reviewer.",
    },
    {
      id: "ai-scope-pilot",
      title: "Limited pilot with an evaluation checklist",
      purpose:
        "Useful when you want to test one workflow with representative inputs before wider rollout.",
      examples: [
        "Agreed sample inputs and expected outputs",
        "Failure examples and reviewer responsibility",
        "Acceptance threshold set during discovery — not a fabricated result",
      ],
      notIncluded:
        "Claimed production savings or accuracy scores that have not been measured on your data.",
    },
    {
      id: "ai-scope-integration",
      title: "Keep approved systems in sync",
      purpose:
        "Useful when automation should update or read from systems you already use, within constrained access.",
      examples: [
        "Integration requirements and export availability",
        "Event or audit records appropriate to the use case",
        "Error handling for failed updates",
      ],
      notIncluded:
        "Named third-party integrations unless evidence and current API access support them. Provider usage charges remain separate unless agreed.",
    },
  ],
  deliverableGroups: [
    {
      id: "ai-del-map",
      title: "Discovery and design",
      items: [
        "Workflow map for the agreed repetitive task",
        "Integration requirements and data access constraints",
        "Evaluation checklist: inputs, outputs, failures, reviewer, acceptance threshold",
      ],
    },
    {
      id: "ai-del-pilot",
      title: "Pilot and controls",
      items: [
        "Limited pilot scoped to representative cases",
        "Field validation and a review queue for uncertain output",
        "Error handling and audit or event records appropriate to the use case",
      ],
    },
    {
      id: "ai-del-handover",
      title: "Handover",
      items: [
        "Handover notes for owners, monitoring, and review responsibility",
        "Clear limits on what stays human-checked",
        "Agreed next steps only after the pilot evaluation",
      ],
    },
  ],
  illustrativeExample: {
    id: "ai-ex-workflow",
    label: "Illustrative workflow",
    title: "Request to reviewed action",
    description:
      "Sample path only — not a live form, chatbot, or production integration. A person remains responsible at the review step.",
    points: [
      "Request received → required fields checked",
      "Draft prepared → person reviews",
      "Approved action, or exception path when information is missing",
    ],
    visualVariant: "ai-automation-workflow",
  },
  relatedProjectIds: [],
  deliveryStages: [
    {
      id: "ai-stage-task",
      title: "Pin down the task and data",
      description:
        "Agree the repetitive work, sample inputs with appropriate permissions, systems involved, and who owns exceptions.",
    },
    {
      id: "ai-stage-approach",
      title: "Choose rules, AI assistance, or retrieval",
      description:
        "Prefer deterministic rules when they fit. Add AI extraction, drafting, or retrieval only where review and evaluation are defined.",
    },
    {
      id: "ai-stage-pilot",
      title: "Pilot and measure honestly",
      description:
        "Run a limited pilot against the evaluation checklist. Separate the measurement plan from any achieved results — do not invent accuracy or time-saving percentages.",
    },
    {
      id: "ai-stage-handover",
      title: "Hand over with ongoing responsibilities",
      description:
        "Document access limits, monitoring, provider usage, and who reviews uncertain output before any wider rollout.",
    },
  ],
  clientInputs: [
    "Current process description and where work gets stuck",
    "Sample data you have permission to share (anonymised where possible)",
    "Systems involved and whether APIs or exports are available",
    "Decision owners for uncertain or incorrect output",
    "Expected volume and common exceptions",
    "Untrusted documents and messages are inputs for processing — not instructions that grant a system broader access",
  ],
  boundaries: [
    "This page does not claim to replace your entire team or to make autonomous business decisions",
    "Retrieval and AI drafts can be wrong or incomplete; review is a design requirement, not an optional extra",
    "We do not promise that data never leaves a country, that every deployment is private, or that a certification is met without a verified design",
    "Named model providers and integrations are only claimed when evidence and access support them",
    "No live chatbot, model API key, document upload, or automation runner is embedded in this marketing site",
  ],
  recurringCostNotes: [
    "Provider usage charges may continue after launch when models or hosted services are in scope",
    "Ongoing monitoring, data handling, and integration maintenance need agreement",
    "Human review time remains a business cost even when drafting is assisted",
    "Changing source systems or document formats can require follow-on work",
  ],
  faqIds: [
    "faq-ai-without-ai",
    "faq-ai-existing-tools",
    "faq-ai-who-reviews",
    "faq-ai-data-access",
    "faq-ai-ongoing-costs",
    "faq-ai-one-workflow",
  ],
  relatedServiceIds: ["svc-business-systems", "svc-custom-software"],
  pageTitle: "AI and Automation — Zatroz",
  pageDescription:
    "Discuss rules-based automation and AI-assisted extraction or drafting for a clear repetitive task — with human review where it matters.",
} as const satisfies ServiceDetailRecord;
