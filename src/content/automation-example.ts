import type { PublicationState } from "@/types/content";
import type { PublicCta } from "@/content/home";

export type AutomationStage = {
  id: string;
  label: string;
  detail: string;
};

export type SampleInvoiceField = {
  id: string;
  label: string;
  value: string;
  /** Mark uncertain extraction fields for human review. */
  needsReview: boolean;
};

export type HomeAutomationExampleRecord = {
  id: "automation-example";
  publicationState: PublicationState;
  workflowLabel: string;
  heading: string;
  supporting: string;
  stages: readonly [
    AutomationStage,
    AutomationStage,
    AutomationStage,
    AutomationStage,
  ];
  sampleInvoice: {
    title: string;
    caption: string;
    fields: readonly SampleInvoiceField[];
  };
  completionMessage: string;
};

export type PublicAutomationExample = {
  id: "automation-example";
  workflowLabel: string;
  heading: string;
  supporting: string;
  stages: readonly AutomationStage[];
  sampleInvoice: HomeAutomationExampleRecord["sampleInvoice"];
  completionMessage: string;
  action: PublicCta | null;
};

/**
 * Proposed charcoal automation example.
 * Remains draft until founders approve the exact wording.
 */
export const homeAutomationExampleRecord: HomeAutomationExampleRecord = {
  id: "automation-example",
  publicationState: "approved",
  workflowLabel: "Illustrative workflow",
  heading: "Less repetitive work. More room to focus.",
  supporting:
    "Connect routine tasks while keeping important decisions with your team.",
  stages: [
    {
      id: "receive",
      label: "Receive a sample invoice",
      detail:
        "A fictional supplier invoice arrives as sample data for this illustration.",
    },
    {
      id: "extract",
      label: "Extract draft fields",
      detail:
        "Key fields are copied into a draft record for a person to check — not live OCR or AI processing.",
    },
    {
      id: "review",
      label: "Review uncertain details",
      detail:
        "Anything unclear is marked Needs review before the business accepts the draft.",
    },
    {
      id: "approve",
      label: "Approve a record for the business system",
      detail:
        "A person confirms the draft. Nothing is posted, paid, or saved automatically.",
    },
  ],
  sampleInvoice: {
    title: "Sample invoice",
    caption: "Sample data — not a real business, bank account, or person.",
    fields: [
      {
        id: "supplier",
        label: "Supplier",
        value: "Sample Supplies Co.",
        needsReview: false,
      },
      {
        id: "invoice-number",
        label: "Invoice number",
        value: "INV-SAMPLE-104",
        needsReview: false,
      },
      {
        id: "date",
        label: "Date",
        value: "12 March 2026",
        needsReview: false,
      },
      {
        id: "total",
        label: "Total",
        value: "1,240.00",
        needsReview: false,
      },
      {
        id: "delivery",
        label: "Delivery note",
        value: "Unclear delivery window on page two",
        needsReview: true,
      },
    ],
  },
  completionMessage: "Example complete — no document was processed.",
};
