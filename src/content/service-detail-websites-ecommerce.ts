import type { ServiceDetailRecord } from "@/content/service-detail";

/**
 * Draft Websites and E-commerce detail copy for review.
 * Not public until overview approval, detail approval, and route readiness align.
 * Capability claims remain draft until founders confirm delivery capacity.
 */
export const websitesEcommerceDetail = {
  publicationState: "draft",
  heroTitle: "A website that helps customers understand, enquire, and buy",
  introduction:
    "Build a clear online presence and an ordering experience suited to how your business actually works. Choose a business website, a catalogue with assisted ordering, or a full online store — then agree scope before build work starts.",
  primaryCtaLabel: "Discuss your website",
  heroVisual: "browser-frame",
  audienceItems: [
    {
      id: "wec-aud-first-site",
      text: "A business that needs a first credible website so customers can understand what you offer and how to get in touch.",
    },
    {
      id: "wec-aud-hard-to-use",
      text: "A company whose current site is difficult to use, incomplete, or no longer matches how the business sells.",
    },
    {
      id: "wec-aud-catalogue",
      text: "A seller moving from scattered messages and shared files toward a more organised catalogue or order flow.",
    },
  ],
  problemItems: [
    {
      id: "wec-prob-unclear",
      text: "Visitors cannot tell what you sell, who it is for, or what to do next.",
    },
    {
      id: "wec-prob-messages",
      text: "Product questions and orders arrive through informal channels that are hard to track.",
    },
    {
      id: "wec-prob-overbuilt",
      text: "A full checkout setup would be more process than the business is ready to run day to day.",
    },
  ],
  scopeOptions: [
    {
      id: "wec-scope-business-website",
      title: "Business website",
      purpose:
        "Explain the company clearly and generate useful enquiries — not guarantee leads or sales.",
      examples: [
        "Service or offer pages",
        "Project or work gallery when you have approved stories",
        "Contact or enquiry path",
      ],
      notIncluded:
        "A product catalogue, cart, checkout, payment provider setup, or customer accounts unless agreed separately.",
    },
    {
      id: "wec-scope-catalogue",
      title: "Catalogue / assisted ordering",
      purpose:
        "Help people browse products or services and ask about an order through an agreed channel.",
      examples: [
        "Product information and categories",
        "Clear item detail pages",
        "WhatsApp or form-based order enquiries",
      ],
      notIncluded:
        "An automatic confirmed sale. A WhatsApp order message is a conversation starter until your team confirms stock, price, and fulfilment.",
    },
    {
      id: "wec-scope-online-store",
      title: "Online store",
      purpose:
        "Support a defined purchase and fulfilment journey when the business can run payments, stock, and delivery rules.",
      examples: [
        "Cart and checkout for agreed products",
        "Payment provider connection when a suitable account exists",
        "Order management and delivery rules as scoped",
      ],
      notIncluded:
        "Every advanced store feature, unlimited catalogue entry, or a guarantee that any payment provider will approve your account.",
    },
  ],
  deliverableGroups: [
    {
      id: "wec-del-structure",
      title: "Structure and content paths",
      items: [
        "Agreed page or catalogue structure for the chosen scope",
        "Clear enquiry or order journeys for the main visitor tasks",
        "Basic discoverability foundations (titles, headings, sensible URLs) — not a ranking guarantee",
      ],
    },
    {
      id: "wec-del-build",
      title: "Design and build",
      items: [
        "Responsive page design and build for the agreed screens",
        "Product or catalogue presentation where that scope is included",
        "Testing of key journeys before launch",
      ],
    },
    {
      id: "wec-del-handover",
      title: "Editing and handover",
      items: [
        "Agreed editing tools or update path for content you will maintain",
        "Access notes and short instructions for ongoing updates",
        "Handover of agreed accounts and environments",
      ],
    },
  ],
  illustrativeExample: {
    id: "wec-ex-comparison",
    label: "Illustrative example",
    title: "Business website beside a catalogue order journey",
    description:
      "Sample labels only — not a live shop, cart, or payment screen. This illustration is not portfolio evidence.",
    points: [
      "Website path: visitor reads what you offer, then sends an enquiry",
      "Catalogue path: visitor browses items, then asks about an order for your team to confirm",
    ],
    visualVariant: "websites-catalogue-comparison",
  },
  relatedProjectIds: [],
  deliveryStages: [
    {
      id: "wec-stage-clarify",
      title: "Agree audience, content, and scope",
      description:
        "Confirm who the site is for, which scope option fits, and what content or product information you can supply. Exact timelines depend on that scope.",
    },
    {
      id: "wec-stage-structure",
      title: "Review page structure and design",
      description:
        "Agree the information architecture and key layouts while change is still affordable.",
    },
    {
      id: "wec-stage-build",
      title: "Implement and review key journeys",
      description:
        "Build the agreed pages and enquiry or order paths, then review them with real sample content where possible.",
    },
    {
      id: "wec-stage-handover",
      title: "Test, launch, and hand over",
      description:
        "Check the agreed journeys, launch when ready, and leave access plus update instructions explicit. Fuller collaboration detail lives on /process when that page copy is approved; the homepage summary (/#how-we-work) applies when that section is published.",
    },
  ],
  clientInputs: [
    "Brand assets you have permission to use (logo, colours, photography)",
    "Approved page or product information, with a named content owner",
    "Existing domain and hosting ownership details when they already exist",
    "Product images and stock or pricing rules where a catalogue or store is in scope",
    "Agreed ordering, payment, and delivery requirements for the chosen scope",
    "Sensitive account access is coordinated through a suitable secure process — do not send passwords in an enquiry message",
  ],
  boundaries: [
    "Admin or CMS setup, product data entry, copywriting, and photography depend on the proposal — they are not automatic with every website",
    "Payment integration, customer accounts, and delivery integrations are only included when scoped and when suitable provider accounts exist",
    "SEO foundations support clear pages; they do not guarantee search rankings",
    "Zatroz cannot promise that every third-party provider will open or approve an account for your business",
  ],
  recurringCostNotes: [
    "Domain and hosting renewals continue after launch when you use those services",
    "Paid plugins, themes, or SaaS tools you choose remain separate unless the proposal says otherwise",
    "Payment providers charge their own fees when an online store is in scope",
    "Maintenance and content updates are scoped explicitly — not assumed as unlimited free changes",
    "Who supplies and manages ongoing content should be clear before launch",
  ],
  faqIds: [
    "faq-wec-which-type",
    "faq-wec-assisted-ordering",
    "faq-wec-update-content",
    "faq-wec-what-to-provide",
    "faq-wec-hosting-costs",
  ],
  relatedServiceIds: ["svc-ui-ux-design", "svc-custom-software"],
  pageTitle: "Websites and E-commerce — Zatroz",
  pageDescription:
    "Choose a business website, catalogue with assisted ordering, or online store — and discuss a scope that matches how your business actually works.",
} as const satisfies ServiceDetailRecord;
