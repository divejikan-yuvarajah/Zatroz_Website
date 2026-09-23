import type { ServiceDetailRecord } from "@/content/service-detail";

/**
 * Draft Custom Software detail copy for review.
 * Not public until overview approval, detail approval, and route readiness align.
 * Describes a service — not a client portal, subscription platform, or product.
 */
export const customSoftwareDetail = {
  publicationState: "approved",
  heroTitle: "Software shaped around the way your business works",
  introduction:
    "Choose a tailored solution when requirements, workflows, or integrations cannot be supported well by existing products after practical alternatives have been assessed. Custom software is not automatically cheaper, faster, or safer than configuring or integrating what you already have — discovery decides the fit.",
  primaryCtaLabel: "Discuss a custom software scope",
  heroVisual: "modules-link",
  audienceItems: [
    {
      id: "cs-aud-gap",
      text: "A business whose important workflow does not fit the off-the-shelf tools already tried.",
    },
    {
      id: "cs-aud-integrate",
      text: "A team that needs systems to exchange data in a controlled way, with clear ownership of each step.",
    },
    {
      id: "cs-aud-stage",
      text: "An owner ready to replace a legacy process in stages rather than in one untested leap.",
    },
  ],
  problemItems: [
    {
      id: "cs-prob-workaround",
      text: "Staff work around product limits with spreadsheets and messages that are hard to audit.",
    },
    {
      id: "cs-prob-integrate",
      text: "Existing tools do not connect in the way the business process requires.",
    },
    {
      id: "cs-prob-rules",
      text: "Rules, roles, or reporting needs are too specific for configuration alone.",
    },
    {
      id: "cs-prob-buy",
      text: "Buying another generic product would still leave the same gap after setup.",
    },
  ],
  scopeOptions: [
    {
      id: "cs-scope-portal",
      title: "Customer or supplier portal",
      purpose:
        "A possible engagement when external parties need a focused place to submit, track, or review agreed work.",
      examples: [
        "Roles for your staff and external users",
        "Status visibility for the agreed journey",
        "Handoff into your internal process",
      ],
      notIncluded:
        "A full marketplace, subscription billing platform, or every optional portal feature unless scoped.",
    },
    {
      id: "cs-scope-approval",
      title: "Specialised approval workflow",
      purpose:
        "A possible engagement when decisions must follow named roles, exceptions, and review points.",
      examples: [
        "Clear submit → review → decide path",
        "Exception handling for incomplete information",
        "Records appropriate to the agreed process",
      ],
      notIncluded:
        "Enterprise-wide BPM for every department, or legal compliance guarantees without a verified design.",
    },
    {
      id: "cs-scope-reporting",
      title: "Reporting interface over permitted data",
      purpose:
        "A possible engagement when people need readable views of data you are allowed to use.",
      examples: [
        "Agreed report definitions",
        "Access limited to permitted sources",
        "Export arrangements when in scope",
      ],
      notIncluded:
        "Access to systems without authorization, or invented accuracy claims about source data.",
    },
    {
      id: "cs-scope-integrations",
      title: "Integrations between existing systems",
      purpose:
        "A possible engagement when two or more tools must exchange data through available APIs or exports.",
      examples: [
        "Feasibility checks on access and rate limits",
        "Error handling when a sync fails",
        "Human review where automated updates are risky",
      ],
      notIncluded:
        "Scraping or bypassing a system's access controls. Named vendors are only claimed when access and evidence support them.",
    },
    {
      id: "cs-scope-legacy",
      title: "Staged replacement of a legacy workflow",
      purpose:
        "A possible engagement when an old process must be replaced in useful increments with migration and training scoped.",
      examples: [
        "First useful release that staff can run",
        "Migration and reconciliation when needed",
        "Rollback planning for the cutover window",
      ],
      notIncluded:
        "Automatic migration of every legacy database, or a disruption-free cutover without investigation.",
    },
  ],
  deliverableGroups: [
    {
      id: "cs-del-discovery",
      title: "Discovery and scope",
      items: [
        "Requirements and constraints brief after discovery",
        "Prioritised first-release scope",
        "Acceptance criteria agreed with decision makers",
      ],
    },
    {
      id: "cs-del-design-build",
      title: "Design and build",
      items: [
        "Interaction design for the risky journeys",
        "Agreed integration and data model where systems connect",
        "Implementation reviewed in increments",
      ],
    },
    {
      id: "cs-del-handover",
      title: "Handover and support",
      items: [
        "Acceptance checks with representative scenarios",
        "Deployment and handover documentation",
        "Optional maintenance arrangement — only when proposed and accepted",
      ],
    },
  ],
  illustrativeExample: {
    id: "cs-ex-guide",
    label: "Illustrative example",
    title: "Choose an approach, then see how systems can relate",
    description:
      "Decision guide and sample system relationship — not a live product, vendor certification, or completed Zatroz case study. Integrations depend on available APIs and access.",
    points: [
      "Compare configure, integrate, and tailor before committing to a build",
      "Sample map: existing system → tailored application → reporting or notification destination",
      "Human review sits where automated updates would be risky",
    ],
    visualVariant: "custom-software-guide",
  },
  relatedProjectIds: [],
  deliveryStages: [
    {
      id: "cs-stage-understand",
      title: "Understand the current process",
      description:
        "Map how work runs today, who decides, and which tools or data are involved — including constraints that cannot bend.",
    },
    {
      id: "cs-stage-define",
      title: "Define the first useful release",
      description:
        "Agree what staff can actually run in version one. Later increments wait until that release is useful.",
    },
    {
      id: "cs-stage-prototype",
      title: "Prototype risky interactions and integrations",
      description:
        "Test the uncertain journeys and access paths early, while change is still affordable.",
    },
    {
      id: "cs-stage-build",
      title: "Build, review, and test",
      description:
        "Implement in reviewed increments and test with representative scenarios before launch.",
    },
    {
      id: "cs-stage-handover",
      title: "Launch and hand over",
      description:
        "Deploy the agreed release, leave documentation and access clear, and scope migration, training, hosting, and support response times explicitly. No fixed public schedule on this page.",
    },
  ],
  clientInputs: [
    "Business goals and concrete workflow examples",
    "Users, roles, and decision makers for acceptance",
    "Current tools and what must stay connected",
    "Allowed data access and key constraints",
    "Acceptance criteria for the first useful release",
    "Sensitive materials use an agreed secure channel — not an ordinary marketing-site message field",
  ],
  boundaries: [
    "Custom software is not always preferable to buying or configuring an existing product",
    "Web and Mobile Applications cover delivery channels; Business Systems focus on internal operations; AI and Automation focus on repetitive workflows — this page is for tailored behaviour those options do not cover well",
    "Ownership, licensing, and handover terms are agreed in the engagement and may exclude third-party components",
    "Do not scrape or bypass system access controls; integrations need authorized access and feasibility checks",
    "No perpetual free support, invented technology badges, or unsupported industry expertise claims",
  ],
  recurringCostNotes: [
    "Hosting, third-party services, and provider charges continue when those services are used",
    "Maintenance and support response times are proposal items — not assumed unlimited",
    "OS, browser, and API changes over time may require follow-on work",
    "Training and migration effort are scoped when needed",
  ],
  faqIds: [
    "faq-cs-build-or-buy",
    "faq-cs-current-software",
    "faq-cs-smaller-version",
    "faq-cs-handover",
    "faq-cs-ownership",
    "faq-cs-after-launch",
  ],
  relatedServiceIds: [
    "svc-web-mobile-apps",
    "svc-business-systems",
    "svc-ai-automation",
  ],
  pageTitle: "Custom Software — Zatroz",
  pageDescription:
    "Discuss when a tailored solution fits — after assessing configure, integrate, and buy options — with clear discovery, ownership, and maintenance boundaries.",
} as const satisfies ServiceDetailRecord;
