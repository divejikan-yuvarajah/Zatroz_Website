import type { PublicationState } from "@/types/content";

export type ProcessPageStageRecord = {
  id: string;
  title: string;
  whatWeDo: string;
  whatWeNeed: string;
  whatYouReceive: string;
};

export type ProcessPageFaqRecord = {
  id: string;
  question: string;
  answer: string;
};

export type ProcessChecklistItem = {
  id: string;
  text: string;
};

/**
 * Long-form How We Work page.
 * Remains draft until founders approve the commitments.
 * Not a contract: timelines, revisions, and support stay scoped per project.
 */
export type ProcessPageRecord = {
  id: "process-page";
  publicationState: PublicationState;
  heroTitle: string;
  introduction: string;
  primaryCtaLabel: string;
  stagesHeading: string;
  stagesSupporting: string;
  stages: readonly [
    ProcessPageStageRecord,
    ProcessPageStageRecord,
    ProcessPageStageRecord,
    ProcessPageStageRecord,
    ProcessPageStageRecord,
    ProcessPageStageRecord,
  ];
  collaborationHeading: string;
  collaborationBody: readonly string[];
  dependenciesHeading: string;
  dependenciesBody: string;
  acceptanceHeading: string;
  acceptanceBody: string;
  prepareHeading: string;
  prepareSupporting: string;
  prepareItems: readonly ProcessChecklistItem[];
  prepareSensitiveNote: string;
  faqHeading: string;
  faqs: readonly ProcessPageFaqRecord[];
  pageTitle: string;
  pageDescription: string;
};

export const processPageRecord = {
  id: "process-page",
  publicationState: "approved",
  heroTitle: "From the first conversation to a useful launch.",
  introduction:
    "Every project follows a calm sequence: understand the need, agree the first useful release, design and build in reviewable steps, then hand over clearly. The exact depth of each stage depends on the work — an early conversation helps us choose the right next step together.",
  primaryCtaLabel: "Start a project",
  stagesHeading: "Six stages we work through",
  stagesSupporting:
    "These are working stages — not a promise that every project uses every activity in the same way. Outputs are agreed for your scope.",
  stages: [
    {
      id: "process-understand",
      title: "Understand",
      whatWeDo:
        "We discuss goals, current problems, who will use the result, constraints, and the information you already have.",
      whatWeNeed:
        "A clear business goal, examples of the problem, and access to people who know how work happens today.",
      whatYouReceive:
        "A shared problem and requirements brief that frames what we are solving.",
    },
    {
      id: "process-define",
      title: "Define",
      whatWeDo:
        "We prioritise the first useful release, write scope and exclusions, clarify responsibilities, and draft acceptance criteria.",
      whatWeNeed:
        "Decisions on what must ship first, what can wait, and who can approve direction.",
      whatYouReceive:
        "An agreed scope or proposal you can review before build work expands.",
    },
    {
      id: "process-design",
      title: "Design",
      whatWeDo:
        "We explore journeys, structure, and key screens or workflow diagrams where they help — before locking the wrong approach.",
      whatWeNeed:
        "Feedback on real tasks and edge cases, plus brand or content materials when they exist.",
      whatYouReceive:
        "A reviewed design, prototype, or technical approach appropriate to the project.",
    },
    {
      id: "process-build",
      title: "Build",
      whatWeDo:
        "We implement the agreed work in reviewable increments and surface dependencies early.",
      whatWeNeed:
        "Timely feedback on working increments and access to systems when integrations are in scope.",
      whatYouReceive:
        "A reviewable working version at agreed checkpoints — not a surprise at the end.",
    },
    {
      id: "process-test-launch",
      title: "Test and launch",
      whatWeDo:
        "We review core scenarios, relevant devices, access, and launch prerequisites together.",
      whatWeNeed:
        "Availability to walk through important scenarios and confirm release readiness.",
      whatYouReceive:
        "Agreed release readiness and a deployment or handover plan for the launch you approved.",
    },
    {
      id: "process-handover-support",
      title: "Handover and support",
      whatWeDo:
        "We explain access, documentation, training if scoped, and maintenance options.",
      whatWeNeed:
        "Confirmation of who owns day-to-day updates and how support should work after launch.",
      whatYouReceive:
        "Agreed handover materials and an explicit support arrangement — not automatic free support forever.",
    },
  ],
  collaborationHeading: "Feedback and change",
  collaborationBody: [
    "Identify one primary decision maker on your side so feedback stays clear. Consolidate comments before we treat them as direction.",
    "Significant scope changes are confirmed in writing (or an equivalent agreed record) before we implement them, including how they affect timing and effort.",
    "We do not set payment terms, revision caps, or turnaround guarantees on this page — those belong in the proposal you approve for the project.",
  ],
  dependenciesHeading: "What affects timing",
  dependenciesBody:
    "Access to existing systems, approved content and assets, stakeholder feedback, third-party availability, and testing all affect when work can move forward. Timelines are agreed after scope and dependencies are understood — we do not promise a fixed “launch in seven days” on this page.",
  acceptanceHeading: "How we accept work",
  acceptanceBody:
    "We agree the important scenarios up front, review them together, record remaining issues, and decide what must be resolved before release. A visual review alone does not prove production security. Launch means the agreed release is ready — not that software never needs maintenance.",
  prepareHeading: "Before we talk",
  prepareSupporting:
    "You do not need every answer written down. Bring what you know; the conversation can fill gaps.",
  prepareItems: [
    {
      id: "prep-goal",
      text: "The business goal you want to improve",
    },
    {
      id: "prep-users",
      text: "Who will use the result (customers, staff, or both)",
    },
    {
      id: "prep-tools",
      text: "Current tools, website, or spreadsheets involved",
    },
    {
      id: "prep-examples",
      text: "Examples of the problem or friction today",
    },
    {
      id: "prep-must-have",
      text: "Must-have outcomes for a first useful version",
    },
    {
      id: "prep-brand",
      text: "Brand or content material you already have",
    },
    {
      id: "prep-budget",
      text: "Approximate budget range, if known",
    },
    {
      id: "prep-timing",
      text: "Preferred timing or constraints",
    },
  ],
  prepareSensitiveNote:
    "Do not email passwords, private keys, customer records, or confidential business files to start. Sensitive access can be arranged through an appropriate channel later when the work is scoped.",
  faqHeading: "Common questions",
  faqs: [
    {
      id: "process-faq-small-first",
      question: "Can we start with a small first version?",
      answer:
        "Yes. We usually prefer a first useful release with clear exclusions, then expand once the early version is working for real users.",
    },
    {
      id: "process-faq-incomplete-spec",
      question: "What if we do not have a complete specification?",
      answer:
        "That is normal. Share the business problem and constraints you know. We use early conversations and the Understand / Define stages to turn that into a shared brief and scope.",
    },
    {
      id: "process-faq-review",
      question: "How will we review progress?",
      answer:
        "Through agreed checkpoints on working increments — not a single big reveal. You see progress while change is still affordable.",
    },
    {
      id: "process-faq-change",
      question: "What happens when requirements change?",
      answer:
        "We confirm the change, agree its effect on scope and timing, then continue. Unreviewed changes do not silently expand the build.",
    },
    {
      id: "process-faq-content-access",
      question: "Who supplies content, images, and account access?",
      answer:
        "You usually supply business facts, product details, and approved brand assets. Account access for integrations is arranged securely when needed — not through the public enquiry form.",
    },
    {
      id: "process-faq-handover",
      question: "What do we receive at handover?",
      answer:
        "Access details, documentation appropriate to the scope, and clarity on who maintains what next. Training is included only when it is part of the agreed work.",
    },
    {
      id: "process-faq-support",
      question: "Is support included after launch?",
      answer:
        "Support follows the arrangement we agree for your project. This page does not promise free unlimited changes, 24/7 coverage, or ownership of third-party software.",
    },
  ],
  pageTitle: "Process — Zatroz",
  pageDescription:
    "How Zatroz works with clients — from first conversation through design, build, launch, and handover.",
} as const satisfies ProcessPageRecord;
