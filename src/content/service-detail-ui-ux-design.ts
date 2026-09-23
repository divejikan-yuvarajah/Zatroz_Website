import type { ServiceDetailRecord } from "@/content/service-detail";

/**
 * Draft UI/UX Design detail copy for review.
 * Not public until overview approval, detail approval, and route readiness align.
 * Describes a design service — not a client design application or site redesign.
 *
 * UX = how the journey works for the person. UI = how screens look and behave.
 */
export const uiUxDesignDetail = {
  publicationState: "approved",
  heroTitle: "Clearer journeys. Interfaces people can use.",
  introduction:
    "Useful design starts with what people need to accomplish and the constraints of your business, then moves from structure to visual detail and handoff. UX is how the journey works for the person; UI is how screens look and behave. We do not promise conversion lifts, “world-class” polish, or accessibility compliance from mockups alone.",
  primaryCtaLabel: "Discuss a design engagement",
  heroVisual: "wireframe-stack",
  audienceItems: [
    {
      id: "ux-aud-confusing",
      text: "A business whose website or app leaves people unsure what to do next.",
    },
    {
      id: "ux-aud-before-build",
      text: "A team that wants clearer journeys and screens before or alongside development.",
    },
    {
      id: "ux-aud-handoff",
      text: "An owner who needs design notes developers can follow — not only a polished success screen.",
    },
  ],
  problemItems: [
    {
      id: "ux-prob-journeys",
      text: "Confusing journeys where people miss the next step.",
    },
    {
      id: "ux-prob-inconsistent",
      text: "Inconsistent screens that feel like separate products stuck together.",
    },
    {
      id: "ux-prob-information",
      text: "Unclear information hierarchy — important facts compete with decoration.",
    },
    {
      id: "ux-prob-forms",
      text: "Difficult forms with weak labels, vague errors, or no empty/loading states.",
    },
    {
      id: "ux-prob-handoff",
      text: "An unclear handoff to development: missing states, focus behaviour, or component notes.",
    },
  ],
  scopeOptions: [
    {
      id: "ux-scope-review",
      title: "Interface review",
      purpose:
        "Useful when you already have screens and need a structured critique with concrete improvement recommendations.",
      examples: [
        "Review of key journeys and forms",
        "Notes on hierarchy, labels, and error copy",
        "Prioritised recommendations for the next release",
      ],
      notIncluded:
        "A full redesign, moderated usability sessions, or development work unless scoped separately.",
    },
    {
      id: "ux-scope-new",
      title: "Design for a new product or section",
      purpose:
        "Useful when a new journey needs structure, wireframes, and interface design before build.",
      examples: [
        "Information architecture for agreed pages or flows",
        "Low-fidelity wireframes then responsive visual designs",
        "Component and state notes for handoff",
      ],
      notIncluded:
        "A complete design system, extra languages, or development implementation unless included in the engagement.",
    },
    {
      id: "ux-scope-improve",
      title: "Improve an existing journey",
      purpose:
        "Useful when one high-friction path — such as enquiry or checkout — needs focused redesign.",
      examples: [
        "Map of the current journey and friction points",
        "Revised flow and screen states for that path",
        "Handoff notes for the agreed screens only",
      ],
      notIncluded:
        "Guaranteed conversion improvement, or redesign of the entire site by default.",
    },
  ],
  deliverableGroups: [
    {
      id: "ux-del-structure",
      title: "Structure",
      items: [
        "Lightweight discovery brief for the agreed goals and constraints",
        "Information architecture and key user flows",
        "Low-fidelity wireframes for the first useful screens",
      ],
    },
    {
      id: "ux-del-interface",
      title: "Interface",
      items: [
        "Responsive visual designs for agreed screens",
        "Empty, loading, error, and success states — not only the happy path",
        "Keyboard and focus behaviour noted where it matters for the journey",
      ],
    },
    {
      id: "ux-del-handoff",
      title: "Handoff",
      items: [
        "Reusable component and state notes",
        "Developer handoff guidance for interactions",
        "An interactive prototype only when it helps review — not as a substitute for build",
      ],
    },
  ],
  illustrativeExample: {
    id: "ux-ex-form",
    label: "Illustrative design example — not client work",
    title: "Short enquiry flow with form states",
    description:
      "Fictional sample text only. Hierarchy, labels, error copy, and focus style are demonstrated in HTML — nothing is submitted and no performance claim is made.",
    points: [
      "Flow: start enquiry → fill details → confirm",
      "States shown: empty, error, and success (loading noted in copy)",
      "Conceptual comparison only if you imagine a weaker prior layout — no metrics",
    ],
    visualVariant: "ui-ux-form-states",
  },
  relatedProjectIds: [],
  deliveryStages: [
    {
      id: "ux-stage-goal",
      title: "Understand the goal",
      description:
        "Clarify the user task, business constraints, devices, and who decides. Available research or feedback is used when you supply it — we do not invent interviews that were not run.",
    },
    {
      id: "ux-stage-map",
      title: "Map the journey",
      description:
        "Outline the steps people take and where confusion or drop-off is likely.",
    },
    {
      id: "ux-stage-wireframes",
      title: "Explore wireframes",
      description:
        "Agree structure and content priority before polishing visuals.",
    },
    {
      id: "ux-stage-refine",
      title: "Refine the interface",
      description:
        "Detail screens, states, and interactions within the agreed scope. Review or light testing happens only when scoped.",
    },
    {
      id: "ux-stage-handoff",
      title: "Prepare handoff",
      description:
        "Deliver agreed editable design files, exported assets, component notes, and interaction guidance using the tools confirmed for the engagement. Development remains separate unless included.",
    },
  ],
  clientInputs: [
    "User tasks and known constraints for the journey",
    "Brand assets you have permission to use",
    "Existing screens or flows to improve, when relevant",
    "Available research or feedback — only what you actually have",
    "Required devices and breakpoints",
    "A named decision maker for reviews and revision rounds",
  ],
  boundaries: [
    "Research recruitment, moderated usability sessions, extra languages, a full design system, and development are separately scoped",
    "We do not claim a specific design tool account already exists — tools are confirmed per engagement",
    "Usability and accessibility need implementation and testing as well as design; mockups alone do not guarantee outcomes",
    "Revision rounds and ongoing design support are agreed explicitly — not unlimited",
    "No “pixel-perfect,” “world-class,” or conversion guarantees on this page",
  ],
  recurringCostNotes: [
    "Additional revision rounds beyond the proposal are scoped separately",
    "Design support after handoff is optional and explicit",
    "If development is included later, build and hosting costs follow that proposal",
    "Tooling licences remain with whoever owns the accounts unless agreed otherwise",
  ],
  faqIds: [
    "faq-ux-design-only",
    "faq-ux-existing-site",
    "faq-ux-wireframe-vs-ui",
    "faq-ux-responsive",
    "faq-ux-users-involved",
    "faq-ux-developers-receive",
  ],
  relatedServiceIds: ["svc-websites-ecommerce", "svc-web-mobile-apps"],
  pageTitle: "UI/UX Design — Zatroz",
  pageDescription:
    "Discuss clearer user journeys and usable interfaces — from structure and wireframes to visual design and developer handoff, without conversion guarantees.",
} as const satisfies ServiceDetailRecord;
