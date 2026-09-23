import type { ServiceDetailRecord } from "@/content/service-detail";

/**
 * Draft Web and Mobile Applications detail copy for review.
 * Not public until overview approval, detail approval, and route readiness align.
 * Capability claims remain draft until founders confirm delivery capacity.
 * This marketing site stack is not automatically the client application stack.
 */
export const webMobileAppsDetail = {
  publicationState: "approved",
  heroTitle: "Applications built around the tasks that matter",
  introduction:
    "Turn a clear customer or team workflow into a usable web or mobile experience, starting with a focused first release. Choose a browser application, a phone-focused application, or a phased product — then agree who uses it and which journey comes first.",
  primaryCtaLabel: "Discuss your application",
  heroVisual: "device-pair",
  audienceItems: [
    {
      id: "wma-aud-portal",
      text: "A business that needs a customer or staff portal for a repeated task — not only a marketing page that explains the company.",
    },
    {
      id: "wma-aud-coord",
      text: "A team coordinating bookings, requests, approvals, or field updates that currently live in messages and spreadsheets.",
    },
    {
      id: "wma-aud-validate",
      text: "A founder validating a defined product workflow with a small first release before expanding roles or platforms.",
    },
  ],
  problemItems: [
    {
      id: "wma-prob-website-only",
      text: "A brochure site cannot support the repeated task people need to complete.",
    },
    {
      id: "wma-prob-login-alone",
      text: "Adding a login screen does not make a useful product if the core journey is still unclear.",
    },
    {
      id: "wma-prob-too-wide",
      text: "Trying to ship every role, device, and integration in the first version delays a usable release.",
    },
  ],
  scopeOptions: [
    {
      id: "wma-scope-web",
      title: "Web application",
      purpose:
        "Useful when people need a browser-based task, portal, dashboard, or workflow on supported browsers.",
      examples: [
        "Users and roles for the agreed journeys",
        "Supported browsers and screen sizes",
        "Integrations required for the first release",
      ],
      notIncluded:
        "A native phone app, offline synchronisation, push notifications, or every optional integration unless agreed separately.",
    },
    {
      id: "wma-scope-mobile",
      title: "Mobile application",
      purpose:
        "Useful when the task benefits from a phone-focused experience or specific device features.",
      examples: [
        "Target platforms and distribution approach",
        "Connectivity expectations for the core journey",
        "Device features only when they are required and supported",
      ],
      notIncluded:
        "Automatic native iOS and Android builds, app-store approval, offline sync, or real-time updates unless those capabilities are agreed and supported.",
    },
    {
      id: "wma-scope-phased",
      title: "Phased product",
      purpose:
        "Useful when the team needs to test the core workflow with a first user group before expanding.",
      examples: [
        "One essential journey for the first release",
        "Feedback checkpoints after people use it",
        "A planned next release only when justified",
      ],
      notIncluded:
        "A rushed or knowingly insecure MVP, unlimited platforms in version one, or a fixed public delivery schedule on this page.",
    },
  ],
  deliverableGroups: [
    {
      id: "wma-del-discovery",
      title: "Discovery and journeys",
      items: [
        "Workflow discovery for the agreed users and tasks",
        "User journeys and an interface prototype for the first release",
        "Clear validation and error states for the scoped flows",
      ],
    },
    {
      id: "wma-del-build",
      title: "Build and integration",
      items: [
        "Agreed application screens for web and/or mobile as scoped",
        "Backend or data integration required for the first journeys",
        "Role-aware features when permissions are part of the proposal",
      ],
    },
    {
      id: "wma-del-handover",
      title: "Validation and handover",
      items: [
        "Testing of behaviour, errors, and permissions appropriate to scope",
        "Preparation for the agreed release path",
        "Handover notes for access, feedback, and next increments",
      ],
    },
  ],
  illustrativeExample: {
    id: "wma-ex-booking",
    label: "Illustrative example",
    title: "Browser workspace beside a phone task screen",
    description:
      "Fictional booking or request sample — not a live signup, login, or submitted booking. This illustration is not portfolio evidence.",
    points: [
      "Browser path: staff review a request list and open one item to decide",
      "Phone path: a person submits a short request while away from a desk",
      "Neither path collects real credentials or claims a booking was completed",
    ],
    visualVariant: "web-mobile-task-comparison",
  },
  relatedProjectIds: [],
  deliveryStages: [
    {
      id: "wma-stage-clarify",
      title: "Clarify roles and critical journeys",
      description:
        "Agree who uses the application, which task comes first, and what is out of scope for the first release.",
    },
    {
      id: "wma-stage-prototype",
      title: "Prototype the workflow",
      description:
        "Review a readable prototype of the core journey before heavy build work.",
    },
    {
      id: "wma-stage-build",
      title: "Build reviewed increments",
      description:
        "Implement the agreed screens and integrations in increments people can try and correct.",
    },
    {
      id: "wma-stage-validate",
      title: "Validate behaviour and prepare release",
      description:
        "Check errors, permissions, and device expectations that are in scope, then prepare the agreed release and handover. Production readiness is a project responsibility — not a blanket compliance promise.",
    },
  ],
  clientInputs: [
    "Target users and concrete task examples for the first release",
    "A role and responsibility list for who can view, edit, or approve",
    "Sample non-sensitive data that represents real cases without personal datasets",
    "Integration documentation and access arrangements when systems must connect",
    "Platform preferences (browser, phone, or phased) and an owner for feedback",
    "Sensitive requirements are scoped separately — do not send production credentials or personal data through a public enquiry",
  ],
  boundaries: [
    "Authentication, permissions, push notifications, offline behaviour, reporting, payments, and external APIs are scoped requirements — not a free default bundle",
    "Native iOS/Android, offline synchronisation, real-time updates, and store publication are included only when agreed and supported",
    "Offline behaviour and synchronisation conflict handling need explicit design; “works everywhere” is not a promise",
    "Marketplace or app-store approval cannot be guaranteed by Zatroz",
  ],
  recurringCostNotes: [
    "Third-party hosting, APIs, and account ownership remain separate unless the proposal says otherwise",
    "Store or distribution requirements, where applicable, have their own fees and review processes",
    "Ongoing maintenance, OS or browser changes, and support coverage are scoped explicitly",
    "Provider fees change over time — this page does not quote unstable prices",
  ],
  faqIds: [
    "faq-wma-web-or-mobile",
    "faq-wma-smaller-release",
    "faq-wma-existing-system",
    "faq-wma-without-internet",
    "faq-wma-after-launch",
  ],
  relatedServiceIds: [
    "svc-websites-ecommerce",
    "svc-ui-ux-design",
    "svc-custom-software",
  ],
  pageTitle: "Web and Mobile Applications — Zatroz",
  pageDescription:
    "Discuss a focused web or mobile application for a clear customer or team workflow — starting with a useful first release, not every optional feature.",
} as const satisfies ServiceDetailRecord;
