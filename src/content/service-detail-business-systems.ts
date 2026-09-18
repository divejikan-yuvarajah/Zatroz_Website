import type { ServiceDetailRecord } from "@/content/service-detail";

/**
 * Draft Business Systems detail copy for review.
 * Not public until overview approval, detail approval, and route readiness align.
 * Not a claim that Zatroz ships a complete off-the-shelf ERP product.
 */
export const businessSystemsDetail = {
  publicationState: "draft",
  heroTitle: "Bring sales, stock, and daily work into a clearer system",
  introduction:
    "Build practical tools around the way your team works, with scope, responsibilities, and support agreed from the start. Start with one operational workflow — sales, stock, internal tasks, or reporting — then expand only when that first piece is useful.",
  primaryCtaLabel: "Discuss your business system",
  heroVisual: "ops-summary",
  audienceItems: [
    {
      id: "bs-aud-reentry",
      text: "A business losing time to repeated data entry across notebooks, spreadsheets, and chat messages.",
    },
    {
      id: "bs-aud-disconnect",
      text: "A team whose stock, sales, and handoffs do not stay connected, so people re-check the same facts.",
    },
    {
      id: "bs-aud-reports",
      text: "An owner who needs operational reports that currently take too long to assemble by hand.",
    },
  ],
  problemItems: [
    {
      id: "bs-prob-scatter",
      text: "Sales, stock, and staff tasks live in separate places that do not update together.",
    },
    {
      id: "bs-prob-handoff",
      text: "Approvals and corrections depend on informal messages that are hard to review later.",
    },
    {
      id: "bs-prob-erp-myth",
      text: "Buying a large ERP name does not automatically match how this team works day to day.",
    },
  ],
  scopeOptions: [
    {
      id: "bs-scope-sales",
      title: "Sales / POS",
      purpose:
        "Record a sale and produce the agreed receipt for the devices and payment methods you actually use.",
      examples: [
        "Devices and peripherals to be tested",
        "Connectivity expectations at the counter",
        "Corrections, returns, and who can change a sale",
      ],
      notIncluded:
        "Compatibility with every printer or scanner, offline sales by default, or accounting/payroll modules unless scoped separately.",
    },
    {
      id: "bs-scope-inventory",
      title: "Inventory",
      purpose:
        "Track stock movements and replenishment across the locations and units you agree.",
      examples: [
        "Locations, units, and product identifiers",
        "Opening stock quality and cleanup effort",
        "Movements tied to sales or internal use when scoped",
      ],
      notIncluded:
        "Automatic cleanup of poor product data, every warehouse process, or live financial stock valuation as a default promise.",
    },
    {
      id: "bs-scope-internal",
      title: "Internal operations",
      purpose:
        "Coordinate an approval or staff task with clear roles and exceptions.",
      examples: [
        "Roles and responsibilities for each step",
        "Review or correction paths",
        "Audit needs agreed for the workflow — not a claim of tamper-proof fraud prevention",
      ],
      notIncluded:
        "Enterprise-wide workflow automation for every department, or specialised regulatory case management unless scoped.",
    },
    {
      id: "bs-scope-reporting",
      title: "Reporting",
      purpose:
        "Review operational information from agreed data sources with clear freshness and export needs.",
      examples: [
        "Report definitions the team will actually use",
        "How fresh the figures need to be",
        "Export or share arrangements in scope",
      ],
      notIncluded:
        "Legal or tax compliance reporting, or dashboards fed by systems that are not in the proposal.",
    },
  ],
  deliverableGroups: [
    {
      id: "bs-del-records",
      title: "Records and flows",
      items: [
        "Product or customer records required for the agreed modules",
        "Sales or receipt flows when Sales/POS is in scope",
        "Stock movements when Inventory is in scope",
      ],
    },
    {
      id: "bs-del-roles",
      title: "Roles and operations",
      items: [
        "Role-specific screens for the people who run the workflow",
        "Approvals or corrections when Internal operations is in scope",
        "Exports and reporting views when Reporting is in scope",
      ],
    },
    {
      id: "bs-del-handover",
      title: "Resilience and handover",
      items: [
        "Documented backup and recovery arrangements agreed for the system",
        "Training and rollout planning for the named operational owner",
        "Handover notes for support coverage in the proposal",
      ],
    },
  ],
  illustrativeExample: {
    id: "bs-ex-ops",
    label: "Illustrative example",
    title: "Sale, stock movement, and a reporting line",
    description:
      "Fictional sample products and quantities — not live stock, not a real receipt, and not connected to a database. Review and correction stay a human responsibility in this example.",
    points: [
      "Sales view: record a sample sale of 2 × Blue Notebook",
      "Inventory view: sample on-hand quantity moves from 10 to 8",
      "Reporting view: the same sample sale appears as one operational line",
    ],
    visualVariant: "business-ops-panel",
  },
  relatedProjectIds: [],
  deliveryStages: [
    {
      id: "bs-stage-discover",
      title: "Discover workflows and data",
      description:
        "Review how sales, stock, or tasks run today, including data quality and who owns decisions.",
    },
    {
      id: "bs-stage-prototype",
      title: "Prototype the key task",
      description:
        "Agree a focused first module and review a prototype of that task before wider build work.",
    },
    {
      id: "bs-stage-build",
      title: "Implement and test the agreed modules",
      description:
        "Build what is in scope, then test with representative cases and any devices named in the proposal. Peripherals need explicit validation — not assumed universal compatibility.",
    },
    {
      id: "bs-stage-rollout",
      title: "Train, roll out, and hand over",
      description:
        "Plan training, rollout, and support. Data import, reconciliation, pilot operation, and rollback are scoped when needed — not promised as automatic for every legacy database.",
    },
  ],
  clientInputs: [
    "Current workflows and anonymised example forms or reports where possible",
    "Product and stock data quality notes, locations, users, and roles",
    "Existing software that must stay connected or be replaced",
    "Hardware model details for printers or scanners that must be tested",
    "Connectivity conditions and any offline expectations to assess",
    "A named operational owner for feedback and rollout",
    "Do not send production passwords or sensitive customer datasets through the public enquiry channel",
  ],
  boundaries: [
    "Accounting, payroll, procurement, enterprise-wide ERP, and specialised regulatory requirements need separate scoping",
    "Offline sales or synchronisation are included only when designed and agreed — not automatic",
    "Hardware purchases and third-party licences remain proposal decisions; Zatroz does not claim all POS hardware works",
    "Backup existence alone is not proof of recoverability — restoration steps must be agreed and tested",
    "This page does not advertise legal or tax compliance certifications that have not been established",
  ],
  recurringCostNotes: [
    "Hosting, backups, and third-party services continue after launch when you use them",
    "Data cleaning and import effort is scoped separately when opening data needs work",
    "Maintenance and support coverage are explicit proposal items — not unlimited free changes",
    "OS, browser, and device changes over time may require follow-on work",
  ],
  faqIds: [
    "faq-bs-one-module",
    "faq-bs-printer-scanner",
    "faq-bs-offline",
    "faq-bs-existing-data",
    "faq-bs-who-access",
    "faq-bs-backup-training",
  ],
  relatedServiceIds: ["svc-custom-software", "svc-ai-automation"],
  pageTitle: "Business Systems — Zatroz",
  pageDescription:
    "Discuss scoped tools for sales, stock, internal tasks, or reporting — starting with one clear operational workflow, not a claimed complete ERP.",
} as const satisfies ServiceDetailRecord;
