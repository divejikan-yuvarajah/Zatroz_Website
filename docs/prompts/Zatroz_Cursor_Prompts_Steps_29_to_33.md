# Zatroz — Enhanced Cursor AI prompts: Steps 29–33

Prepared for Divejikan and the Zatroz founding team · 18 September 2026

This pack continues the existing 72-step roadmap. Build the Services overview, a reusable service detail template, and the first three service pages in five separate, reviewable steps.

**Current database decision:** MongoDB Atlas with the official MongoDB Node.js driver replaces the earlier Supabase plan for future enquiry storage. Website content remains in repository-managed typed records. These five page-building steps need no database connection, MongoDB account, or credentials.

## Execution order

| Step | Deliverable | Route | Suggested branch |
| --- | --- | --- | --- |
| 29 | Services overview | `/services` | `feature/29-services-overview` |
| 30 | Reusable service detail template and routing | Shared detail infrastructure | `feature/30-service-template` |
| 31 | Websites and E-commerce page | `/services/websites-ecommerce` | `feature/31-websites-ecommerce` |
| 32 | Web and Mobile Applications page | `/services/web-mobile-apps` | `feature/32-web-mobile-apps` |
| 33 | Business Systems page | `/services/business-systems` | `feature/33-business-systems` |

Steps 34–36 will fill the remaining service pages: AI and Automation, Custom Software, and UI/UX Design. Do not silently implement those pages during this pack.

## Before starting

Open the existing `zatroz-website` repository in Cursor. Steps 01–28 should provide the shared design system, layout, navigation, footer, typed content, publication rules, route registry, contact resolver, and homepage components. Inspect the actual repository rather than assuming every earlier step succeeded.

Read `docs/progress.md` and existing planning/design/content records. Retain established component names and APIs where practical. A missing screenshot, project story, or business approval should become a visible documentation task, not an excuse to stop implementing the reusable page.

Run one prompt at a time. Review its appearance and behaviour, complete the checks, commit, and merge before starting the next. Attach this file and ask: **“Follow the session instruction and execute Step 29 only.”**

### Session instruction

```text
Act as my senior frontend engineer, service-content designer, and patient mentor for Zatroz. Read existing AGENTS.md, .cursor/rules/, the relevant project documents, installed versions, current code, and Git status before editing.

Execute only the numbered step I select. Explain the short plan, then implement the authorized local changes. Preserve user edits, existing Git history, working components, design tokens, and established content contracts. Do not recreate or upgrade the project. Use our existing Next.js App Router, React, TypeScript, Tailwind CSS, and npm setup.

The owner has selected MongoDB Atlas with the official MongoDB Node.js driver for future enquiry persistence. This supersedes earlier Supabase instructions for that future feature. Keep marketing content in repository files. Do not provision MongoDB, install a database driver, migrate data, remove working integrations, or add a database dependency to page rendering during Steps 29–33. If stale database assumptions appear in task-relevant planning documents, record the confirmed MongoDB decision without exposing or editing private credentials.

Follow the shared service-page contract in this pack. Keep route composition and content preparation server-side. Use small client boundaries only for justified local interactions. Do not import editorial drafts, internal evidence, secrets, or full content stores into client components.

Create useful business-focused content with concrete deliverables. Proposed copy remains draft until the owner confirms it. Do not invent service capacity, clients, results, prices, timelines, guarantees, legal compliance, supported integrations, hardware compatibility, or founder credentials.

These are pages describing services offered to clients. Do not build a checkout, customer account system, working mobile app, POS system, admin dashboard, enquiry backend, live AI, or payment integration inside the Zatroz marketing website for these steps. No external account changes, purchases, messages, or deployment.

Reuse the established warm-white, charcoal, and orange visual system. Preserve semantic HTML, readable contrast, keyboard operation, visible focus, mobile layouts, reduced motion, and useful server-rendered content. No decorative loader, scroll hijacking, animation gate, or new GSAP/Motion dependency in this pack.

Run meaningful existing content/quality/build checks and inspect the page when tools permit. Mark results Passed, Failed, or Not run with evidence. Do not claim browser, screen-reader, metadata, performance, or production checks you did not perform. Provide precise manual checks where tools are unavailable.

Finish with what changed and why, files changed, actual checks, pending inputs, suggested commit, and next step. Prepare the Git checkpoint for my review; do not commit/push unless I explicitly authorize it. Stop after the selected step.
```

## Shared service-page contract

### Six canonical services

| Service name | Slug | Primary business purpose |
| --- | --- | --- |
| Websites and E-commerce | `websites-ecommerce` | Explain the business and support enquiries or online orders |
| Web and Mobile Applications | `web-mobile-apps` | Help customers or staff complete a focused digital task |
| Business Systems | `business-systems` | Organise sales, stock, reporting, and internal workflows |
| AI and Automation | `ai-automation` | Reduce repetitive work with appropriate rules, AI, and review |
| Custom Software | `custom-software` | Address requirements and integrations that need a tailored solution |
| UI/UX Design | `ui-ux-design` | Clarify user journeys and design usable interfaces |

Use existing IDs and slug unions. Do not rename routes, add overlapping service categories, or duplicate the same case study across URLs. “Digital transformation” may be explained within Custom Software later; it is not a seventh launch service page.

### Page design and composition

Each page should answer: **Is this relevant to my business? What could I receive? What is outside the scope? What do you need from me? What is the next step?**

Use one shared structure with distinctive content and original illustrative examples. Keep the established warm-white canvas, charcoal emphasis sections, Manrope typography, generous responsive spacing, and restrained `#FF3B10` accents. Primary orange buttons retain dark text. Do not create three unrelated visual systems or clone identical generic paragraphs onto every service page.

The shared SiteShell continues to own header, footer, skip link, and the single main landmark. Pages provide one H1 and a logical H2/H3 hierarchy. Page files remain thin Server Components. Do not add another main, shell, global provider, or layout-wide client boundary.

| Page section | Purpose | Handling |
| --- | --- | --- |
| Breadcrumb and hero | Identify the service and business outcome | Essential |
| Who it suits / problems | Help a visitor recognise relevance | Essential |
| Scope options / deliverables | Explain what may be built | Essential; distinguish options from agreed scope |
| Illustrative example | Make an unfamiliar service understandable | Optional, explicitly labelled |
| Relevant work | Supply evidence | Only genuine approved records; omit when unavailable |
| Delivery approach | Explain checkpoints and client involvement | Essential, based on approved practices |
| Inputs needed | Help the client prepare | Essential |
| Boundaries and ongoing costs | Avoid misunderstandings | Essential |
| FAQs | Answer service-specific questions | Optional approved records |
| Related services | Offer relevant alternatives | Only approved records; links require ready destinations |
| Final enquiry action | Make the next step clear | Must use a real eligible destination |

Use approximately 600–900 words as an editorial guide for a detail page when the subject needs it. Clarity and completeness matter more than hitting a word count. Keep optional sections out of the page when they lack useful content; do not fill space with placeholders.

### Content approval and route readiness

Preserve Step 18's distinction between approved content and an implemented route. A service summary can be approved for the overview before the full detail page is approved. If the existing model cannot represent that, add a small `detail` object with its own publication state rather than changing the meaning of the existing summary approval flag.

Recommended distinction:

- Existing service-level approval controls its summary and basic capability description.
- `detail.publicationState` controls the new long-form service copy.
- The route registry's implementation state records whether the page has actually been built and checked.
- Public detail rendering and links require all applicable conditions, not merely a matching slug.

Do not automatically approve generated copy. Build complete draft specimens in the existing guarded `/dev/ui` gallery, with clear review labels and non-confidential data. Public routes must not expose draft copy through a query parameter, client filtering, metadata, HTML, or generated page data. Keep the development-only guard and production exclusion intact.

If a page is technically ready but awaiting content approval, record those two statuses separately. Testing its full draft in the gallery and its public route's unavailable behaviour is valid; do not falsely report a publicly complete page. Do not change content to approved just to make a route test pass.

Gallery page specimens need unique ID prefixes, a neutral wrapper, and a heading level that preserves the gallery's own single H1/main. Reuse the actual template rather than writing a second mock layout.

### CTA and link behaviour

Preferred enquiry destination: `/contact?service=<canonical-slug>`, but only when the Contact page is implemented and public-ready. Build the query safely from the slug allowlist. Never include names, email addresses, messages, or other visitor data in query strings.

Until Contact exists, use the shared approved email/WhatsApp fallback with a truthful label, or a real homepage invitation at `/#start-a-project` if that section is present and has a usable action. A fragment such as `#start-a-project` on a service page would target the wrong document unless that page itself owns the anchor. Avoid self-links and circular fallbacks.

Use real links for navigation and buttons for actions. Do not create `href="#"`, inaccessible disabled anchors, or links to unfinished service/project pages. Keep related projects as useful nonlinked evidence or use an approved external demonstration with the correct label if their case-study route is not ready.

### Publication does not need the future database

All five steps must build and render public content while `MONGODB_URI`, `MONGODB_DB_NAME`, email keys, and anti-spam credentials are absent. These environment names are for the later backend work. Do not add them as required build-time variables for services pages, and do not create MongoDB collections for service copy.

### Standard checks for every step

```sh
npm run validate:content
npm run check
npm run build
```

Use the actual existing script names if the repository differs, and document the difference. Inspect 320, 390, 768, 1024, and 1440px widths, 200% zoom, keyboard use, long text, missing optional content, and JS-disabled reading where relevant. Do not hide overflow to conceal a layout defect.

Keep progress notes in `docs/services/step-XX.md` and `docs/progress.md`. Record technical completion, content approval, route readiness, and checks separately. After shared changes, smoke-test homepage navigation, mobile menu, footer, and the production exclusion of `/dev/ui`.

## Step 29 — Build the Services overview

**Goal:** Help visitors compare Zatroz's six service groups and choose a useful next step.

**Before starting:** Review the homepage service explorer, typed service records, route registry, and contact resolver. Start `feature/29-services-overview` from updated `main`.

### Copy into Cursor

```text
Execute Step 29 only: implement /services, the Zatroz Services overview.

Read the session instruction, shared service-page contract, existing service summaries, homepage service explorer, navigation configuration, design primitives, and route-readiness selectors. Inspect the actual application before adding files.

Create a thin src/app/services/page.tsx and focused overview components under the established sections/services locations. Add overview-specific typed content using Step 18 conventions. Reuse existing components and service records rather than duplicating the homepage explorer's data or creating a second service taxonomy.

Proposed hero copy for review:
H1: Digital services built around your business.
Supporting copy: From a clearer online presence to tools that organise everyday work, we help you define a practical next step and build around it.
Do not publish these claims until the service capacity and wording are approved. Keep the hero concise; the homepage already introduces the brand.

Compose the overview in this order:
1. Breadcrumb Home -> Services, one H1, short introduction, and eligible enquiry action.
2. Four business-need links or a compact guide: Reach more customers; Launch a digital product; Organise daily operations; Reduce repetitive work. Reuse the existing need-to-service mapping. Prefer simple in-page navigation here rather than cloning a second elaborate interactive explorer.
3. All approved service summaries presented as clear editorial rows or a considered two-column layout. Each has its actual name, who it helps, a concise outcome, two or three representative deliverables, and a detail action only when ready.
4. A small “Not sure where to start?” guide explaining which service fits common situations.
5. A short approved delivery approach and relevant approved work, only where it adds evidence.
6. A final invitation using the shared real contact destination policy.

Give service rows stable IDs based on canonical slugs. Any need shortcut should land on an existing service summary or a meaningful group, not a nonexistent anchor. If a need relates to multiple services, show those relationships explicitly rather than implying only one choice is possible.

Describe all six planned categories distinctly. Website/catalogue needs differ from task-driven applications; business systems focus on daily operations; AI/automation is not mandatory for every workflow; custom software covers unusual requirements; UI/UX can be a design engagement without development. Do not add live implementation features to illustrate these offers.

The overview may display an approved service summary while its full detail page is unbuilt. In that case, keep the summary useful and omit its detail link or provide a truthful contact action. Do not hide the whole approved category merely because the long page is pending. In the gallery, show all six proposed rows with review labels; the public page uses approved summary projections only.

Use restrained original visual identifiers, such as a browser outline, application window, operations list, workflow nodes, modular blocks, and wireframe. Prefer lightweight inline SVG/CSS or existing icons, with decorative semantics. Do not install an icon library just for six marks, duplicate reference-site artwork, or turn these into fake product screenshots.

Do not publish old package prices, unlimited scope, free hosting, guaranteed rankings, fixed delivery dates, or unsupported technology claims. Clarify that features and third-party costs are agreed for the actual project. Avoid a pricing calculator or comparison table implying all options are included in every engagement.

Keep essential content server-rendered with ordinary links. Use no JS filter unless a concrete need exists; six categories are easy to scan. Preserve logical reading order, readable line lengths, consistent gutters, clear card/link semantics, and visible focus. Mobile should become a single readable column without hidden descriptions or sideways scrolling.

Add basic honest page title/description through the existing metadata approach. Do not invent a production domain or canonical URL, and do not generate SEO structured data ahead of its dedicated step. If overview approval is incomplete, keep the full design in the guarded gallery and apply the established public-readiness policy rather than leaking drafts.

After implementation, update the /services registry state based on what actually exists and has been checked. Enable header/footer/hero links through existing selectors only if public-ready. The six detail routes remain pending; do not enable them together.

Verify approved-only filtering, zero/partial/full approved summaries, need shortcuts, long labels, unavailable detail routes, valid CTA fallback, one H1/main, keyboard use, no-JS output, and mobile layout. Run the standard checks, record missing content in step-29.md, and suggest: feat: add services overview page.
```

**Accept when:** Visitors can distinguish the service groups; overview summaries remain useful before detail pages exist; no link claims an unfinished destination is ready.

## Step 30 — Build the reusable service detail template

**Goal:** Establish one maintainable detail-page system that supports six distinct service stories and filters drafts consistently.

**Before starting:** Step 29 is reviewed. Start `feature/30-service-template` from updated `main`. This step creates infrastructure and preview fixtures, not six completed service pages.

### Recommended detail content contract

| Field | Purpose |
| --- | --- |
| Service ID and canonical slug | Link to the existing service identity |
| Detail publication state | Separate full-copy approval from overview-summary approval |
| Hero title, introduction, primary CTA intent | State the service and next action |
| Audience/problem items | Describe suitable use cases |
| Scope options | Distinct ways the service may be scoped, without automatic inclusion |
| Deliverable groups | Explain concrete outputs |
| Illustrative example data | Safe, labelled, typed example; no arbitrary HTML |
| Related project IDs | Reuse genuine portfolio records |
| Delivery stages | Reference shared process or approved service-specific variations |
| Client inputs | Explain preparation needed |
| Boundaries and recurring-cost notes | Set realistic expectations |
| FAQ IDs/content and related service IDs | Reuse validated records |
| Page title/description | Accurate service-specific metadata |

Use only fields the template actually renders. Avoid a giant generic page-builder schema with arbitrary component names or executable content.

### Copy into Cursor

```text
Execute Step 30 only: implement the reusable service detail template and route infrastructure.

Read the session instruction, shared contract, existing service types/selectors, publication rules, route registry, shared components, and actual Next.js version. Preserve service IDs and public URLs.

Create a server-rendered ServiceDetailPage template with small readable subcomponents where they have a genuine responsibility: breadcrumb/hero, deliverable groups, scope boundaries, related work, FAQs, and final CTA. Reuse homepage/UI primitives where appropriate without forcing full homepage section layouts into this template. Do not build a generalized CMS renderer.

Extend the typed service data with the minimal detail content contract in this pack. Keep summary approval, detail approval, and route implementation separate. Define one server-side selector for a public-ready detail record. The route, metadata, navigation links, and static parameter list must use compatible eligibility logic; do not let metadata reveal a draft that the page itself hides.

Routing preference for this small shared template: src/app/services/[slug]/page.tsx for the six canonical slugs. If the existing project already has well-structured explicit service routes, reuse them with the same template and selector instead of performing an unnecessary migration. Do not create both an explicit and a dynamic implementation for the same URL. Document the actual choice.

For a dynamic route, handle params according to the installed Next.js version; current App Router conventions use awaited params. Resolve only an allowed canonical slug, then its eligible content. Unknown, draft, archived, unimplemented, or incomplete public detail records must use notFound() before rendering service content. Never fall back to the first service, a draft record, or a generic success page. Do not accept a ?preview=true bypass on public routes.

Generate static params from the actual eligible detail records if appropriate to the installed configuration. An empty eligible set at this step is valid and must not require fake published content. Retain a correct request-time guard for arbitrary URLs. Do not enable experimental cache settings, force dynamic rendering, configure static export, or upgrade Next.js to make the template work. If a configuration option changes unknown-slug behaviour, verify it under a production build and record the reason.

Use one shared content resolution function for rendering and service metadata. Set an accurate title and description from the eligible record, preserving existing title templates and metadata conventions. Avoid a duplicate “Zatroz | Zatroz” suffix. Use a canonical path only through the existing valid site-URL setup; do not invent a production origin or add localhost as a claimed public canonical. Full sitemap/structured-data work remains later.

Create a semantic breadcrumb nav with list structure, Home, Services, and the current service. Only link eligible ancestors; show the current page as text with appropriate current-page semantics. The template has one H1 and no extra main/header/footer. Optional sections do not emit empty headings or gaps. Section IDs must be stable and prefixable for gallery specimens.

Use a business-focused hero, readable section rhythm, optional illustrative example, and clear final action. A small in-page contents list is optional if the page length warrants it; it must reference only rendered sections and not become a sticky overlay that obscures content. All important copy must remain server-readable without JS.

Enquiry actions resolve the canonical service slug through the shared CTA policy. Before Contact is ready, use an approved fallback with an accurate label. A link to the homepage invitation must include the root path, /#start-a-project, and only exist if that section actually renders. No fake form, database connection, API, authentication, or live integration.

Keep service-specific examples as explicit typed variants or small known components. Do not store raw JSX, arbitrary HTML, dynamic import paths, or executable strings in the content records. Keep private evidence and draft notes out of public props. Only approved project/FAQ/related-service projections may be rendered.

Extend validate:content for detail requirements, valid related IDs, duplicate section IDs where applicable, canonical slug consistency, allowed link protocols, and field completeness for approved detail records. Draft fixtures may be incomplete but invalid identities/references should still fail. Do not require all six future pages to be approved at Step 30.

Add safe complete/minimal/long-copy fixtures to the existing guarded /dev/ui gallery, with headings adapted to its own single H1. Fixtures are clearly examples and excluded from production exports. Use them to verify optional sections, missing evidence, long deliverables, no available CTA, and all template variants. Do not publish an example as a service page.

Use existing test tooling for unknown-slug rejection, draft/archived filtering, metadata consistency, and valid public records. Add only a small compatible validation check if no harness exists. Verify a genuine eligible case when supplied; otherwise prove the template in the gallery and the public unavailable states without claiming a public service is complete.

Run standard checks and a production route check, including an arbitrary slug and any draft slug. Verify no draft text appears in metadata/HTML or client data. Document the schema, route strategy, and process for enabling a service in docs/services/template.md. Update step-30.md/progress. Suggested commit: feat: add reusable service detail template.
```

Current framework references: [dynamic route conventions](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes), [static parameter generation](https://nextjs.org/docs/app/api-reference/functions/generate-static-params), and [metadata generation](https://nextjs.org/docs/app/api-reference/functions/generate-metadata). Apply the documentation compatible with the installed version; do not copy outdated synchronous route signatures.

**Accept when:** A single template supports complete and minimal content, unknown/draft services stay unavailable, metadata follows the same publication rules, and the build works with zero public detail records.

## Step 31 — Build Websites and E-commerce

**Goal:** Explain the difference between a business website, a catalogue with assisted ordering, and a full online store, so visitors can discuss the right scope.

**Route:** `/services/websites-ecommerce`  
**CTA intent:** Discuss your website  
**Enquiry slug:** `websites-ecommerce`

### Proposed content direction

| Scope option | Main purpose | Examples to discuss |
| --- | --- | --- |
| Business website | Explain the company and generate useful enquiries | Service pages, project gallery, contact flow |
| Catalogue / assisted ordering | Help people browse and ask about products | Product information, categories, WhatsApp order enquiries |
| Online store | Support a defined purchase and fulfilment journey | Cart/checkout, payment provider, order management, delivery rules |

These are scoping options, not fixed packages. A WhatsApp order message is not an automatic confirmed sale. A payment provider needs its own suitable account and configuration; listing payment integration as a possible deliverable does not mean it is included in every website.

### Copy into Cursor

```text
Execute Step 31 only: implement the Websites and E-commerce service detail page.

Read the session instruction, shared service-page contract, Step 30 template, existing approved service summary, and supplied project evidence. Use canonical slug websites-ecommerce. Do not build an actual store inside Zatroz's website.

Populate the existing service record's detail fields with complete, clear draft copy, preserving already approved facts. Proposed H1: A website that helps customers understand, enquire, and buy. Proposed introduction: Build a clear online presence and an ordering experience suited to how your business actually works. Treat the copy and capability claims as draft until confirmed.

Explain who it suits: a business needing a first credible website, a company whose current site is difficult to use, or a seller moving from scattered messages to a more organised catalogue/order flow. Avoid promising guaranteed leads or sales.

Use the three scope options from this pack. For each, explain the customer task, representative deliverables, decisions needed, and what is not automatically included. Do not present all advanced-store features as part of a simple brochure site. Keep package boundaries understandable without publishing prices or unlimited-page claims.

Deliverable groups may cover content structure, responsive page design/build, product/catalogue presentation where scoped, enquiry or order journeys, basic discoverability foundations, agreed editing tools, testing, and handover. Clarify that an admin/CMS, product entry, copywriting, photography, payment integration, customer accounts, and delivery integrations depend on the proposal. SEO foundations do not guarantee rankings.

Create one small original labelled illustration showing a business website beside an online catalogue/order journey. Prefer a static comparison with real HTML labels. If an existing accessible selector can improve understanding, a two-choice Website/Catalogue button group may update safe sample content locally. Do not add a cart, payment input, real order button, fake transaction success, third-party SDK, or live API call. Clearly label sample data and distinguish the illustration from portfolio evidence.

Describe the delivery sequence in service-specific terms: agree audience/content and scope; review page structure/design; implement and review key journeys; test, launch, and hand over agreed access/instructions. Link to an approved process page if ready, otherwise the actual homepage process anchor /#how-we-work if present. Do not invent fixed turnaround times or unlimited revisions.

Client inputs should include brand assets, approved page/product information, content owner, existing domain/hosting ownership, product images where relevant, and agreed ordering/payment/delivery requirements. Say sensitive account access is coordinated through a suitable secure process; do not ask visitors to send passwords in the enquiry form.

Scope/cost notes should explain domain and hosting renewals, paid plugins/services if chosen, payment-provider fees where applicable, maintenance scope, and who supplies/manages content. Do not quote unverified current provider prices, offer lifetime hosting, or promise that every external account can be opened or approved by Zatroz.

Add five useful draft FAQs: Which type of website do I need? Can we start with assisted ordering? Can I update content? What do I need to provide? How are hosting, maintenance, and ongoing costs handled? Give concise conditional answers based on agreed scope, not vague “yes to everything” claims. Reuse approved FAQ primitives and publication conventions.

Include only relevant approved project evidence with accurate Client work/Prototype/etc. status. Do not relabel a finance or student demo as a delivered e-commerce client project. If no relevant evidence exists, omit the block. Related UI/UX or Custom Software references may appear as approved descriptions; only link their pages when ready.

Use the existing template, not a copied bespoke page. Keep a strong text-first hero with light browser-frame illustration, readable option comparison, clear deliverables, and a real next action. Contact preselection is websites-ecommerce when /contact becomes ready. Use the current approved fallback until then.

Prepare the full draft in the guarded gallery. Make the actual route public only through existing content approval/readiness rules; do not mark copy approved yourself. Update route implementation status after genuine template/route checks, keeping approval separate. Reconcile overview, header Services list, footer, and homepage explorer links through shared selectors instead of editing URL strings in each component.

Verify page identity, no accidental shop functionality, distinctions among the three options, long mobile comparison text, eligible related links, exact enquiry slug, metadata, draft exclusion, and route availability. Run standard checks, update step-31.md and missing business inputs, and suggest: feat: add websites and ecommerce service page.
```

**Accept when:** The page helps a business choose a scope, explains recurring responsibilities, uses relevant proof honestly, and never confuses a marketing illustration with a functioning store.

## Step 32 — Build Web and Mobile Applications

**Goal:** Help visitors understand when a task-driven web application, mobile application, or phased combination makes sense.

**Route:** `/services/web-mobile-apps`  
**CTA intent:** Discuss your application  
**Enquiry slug:** `web-mobile-apps`

### Proposed content direction

| Option | Useful when | Questions that shape scope |
| --- | --- | --- |
| Web application | People need a browser-based task, portal, dashboard, or workflow | Users, roles, supported browsers, integrations |
| Mobile application | The task benefits from a phone-focused experience or device features | Target platforms, connectivity, notifications, device access |
| Phased product | The team needs to test the core workflow before expanding | First user group, essential journey, feedback, next release |

Describe the choices without assuming that every project requires both a website and native apps. The website's own Next.js/MongoDB stack is not automatically the best stack for every future client application.

### Copy into Cursor

```text
Execute Step 32 only: implement the Web and Mobile Applications service detail page.

Read the session instruction, shared contract, Step 30 template, actual service capability approvals, existing application project records, and Step 31 integration patterns. Use canonical slug web-mobile-apps. Do not build a client application, login system, or mobile project in this marketing repository.

Create complete service-specific draft content in the existing record. Proposed H1: Applications built around the tasks that matter. Proposed introduction: Turn a clear customer or team workflow into a usable web or mobile experience, starting with a focused first release. Preserve approval status rather than treating generated copy as a confirmed promise.

Explain the audience: businesses needing a customer/staff portal, teams coordinating bookings or approvals, and founders validating a defined product workflow. Distinguish an application that supports repeated tasks from a marketing website that mainly explains a business. Avoid implying that adding a login alone makes a useful product.

Use the three options in this pack: Web application, Mobile application, and Phased product. Explain practical selection factors with plain language: where users work, target devices, connectivity, device features, user roles, distribution, budget, and maintenance. Do not promise native iOS/Android, offline synchronisation, real-time updates, or app-store publication unless those capabilities are actually agreed and supported.

Deliverable groups may include workflow discovery, user journeys, interface prototype, agreed application screens, backend/data integration, role-aware features when required, validation/error states, testing, and handover. Treat authentication, permissions, push notifications, offline behaviour, reporting, payments, and external APIs as specific scoped requirements, not a free default bundle.

Use one labelled fictional booking/request example to demonstrate the difference between a browser workspace and a phone task screen. Build it from lightweight HTML/CSS and existing primitives with readable text. A static side-by-side example is sufficient; if a view switch adds value, keep it local, keyboard-operable, and clear. Do not implement real signup/login, collect credentials, request browser permissions, trigger notifications, or claim that a booking has actually been submitted.

Explain an MVP as a focused useful first version, not a rushed or knowingly insecure product. Give an example progression: one core user journey; feedback and reliability improvements; additional roles/integrations only when justified. Keep any example separate from a guaranteed delivery schedule.

Service-specific process: clarify roles and critical journeys; prototype the workflow; build reviewed increments; validate behaviour/errors/permissions appropriate to scope; prepare the agreed release and handover. Discuss production readiness as a project responsibility without promising blanket compliance or invulnerability.

Client inputs: target users, task examples, role/responsibility list, sample non-sensitive data, integration documentation/access arrangements, platform preferences, and an owner for feedback. Do not ask for production credentials or personal datasets through public enquiries. Define how sensitive requirements will be scoped separately.

Boundaries/cost notes: third-party hosting/APIs, account ownership, store/distribution requirements where applicable, ongoing maintenance, OS/browser changes, and support scope. Do not quote unstable provider fees or guarantee marketplace approval. State that offline behaviour and synchronisation conflict handling require explicit design; “works everywhere” is not acceptable copy.

Draft five relevant FAQs: Web or mobile first? Can we start with a smaller release? Can an existing system be connected? Will it work without internet? What happens after launch? Answers should explain decisions and scope, not assume every optional feature is included.

Use relevant approved project evidence with accurate contribution and status. Reuse project IDs, do not paste duplicate stories or claim a prototype has active paying users. Related Websites/E-commerce, UI/UX, and Custom Software links must follow actual readiness. The website page built in Step 31 is eligible only if its content is approved; do not assume it is public merely because that step ran.

Keep the common template and style, but use a distinctive application-task illustration and meaningful use-case content. Resolve the application enquiry CTA with web-mobile-apps only when Contact is ready, otherwise use a truthful approved fallback. Update overview/navigation/homepage references through shared data.

Verify distinctions among options, realistic optional-feature wording, no working account/booking simulation, exact slug, metadata, related-link readiness, long text, mobile layout, keyboard controls if present, no-JS readability, and draft/public filtering. Run standard checks, update step-32.md, and suggest: feat: add web and mobile applications service page.
```

**Accept when:** The page explains platform and scope decisions, shows a comprehensible task example, and avoids promising every app capability or platform by default.

## Step 33 — Build Business Systems

**Goal:** Explain how custom operational tools can connect sales, stock, reporting, and everyday staff workflows—with clear implementation boundaries.

**Route:** `/services/business-systems`  
**CTA intent:** Discuss your business system  
**Enquiry slug:** `business-systems`

### Proposed capability groups

| Group | Example business task | Scoping questions |
| --- | --- | --- |
| Sales / POS | Record a sale and produce the agreed receipt | Devices, peripherals, connectivity, corrections/returns |
| Inventory | Track stock movements and replenishment | Locations, units, product identifiers, opening data |
| Internal operations | Coordinate an approval or staff task | Roles, responsibilities, audit needs, workflow exceptions |
| Reporting | Review operational information | Data sources, report definitions, freshness, export needs |

These are possible areas of work, not a claim that Zatroz already has a complete off-the-shelf ERP product. Focus the page on scoped services and practical deliverables.

### Copy into Cursor

```text
Execute Step 33 only: implement the Business Systems service detail page.

Read the session instruction, shared contract, Step 30 template, approved business-system capabilities, and supplied project evidence. Use canonical slug business-systems. Do not build a functioning POS, inventory database, ERP, or internal admin application inside the marketing site.

Create complete draft service content in the existing record. Proposed H1: Bring sales, stock, and daily work into a clearer system. Proposed introduction: Build practical tools around the way your team works, with scope, responsibilities, and support agreed from the start. Keep claims draft until the team confirms its ability to deliver them.

Explain who it suits: a business struggling with repeated data entry, disconnected stock/sales information, manual handoffs, or reports that take too long to assemble. Describe concrete problems without inventing a quantified financial loss, saving, accuracy level, or compliance obligation.

Organise the page around Sales/POS, Inventory, Internal operations, and Reporting. For each, give a task, representative outputs, and essential decisions. Do not portray all four as mandatory modules. A focused improvement to one workflow can be a sensible first project.

Scope examples may include product/customer records, agreed sales/receipt flows, stock movements, role-specific screens, approvals, exports, reporting, and documented backup/recovery arrangements. Distinguish possible deliverables from features already included in every project. State that accounting, payroll, procurement, enterprise-wide ERP, and specialised regulatory requirements require separate scoping rather than implying a universal system.

Create a small labelled illustrative operations panel with Sales, Inventory, and Reporting views. Reuse an existing simple button-group selector if useful, keeping local demo state only. Use fictional sample products and clearly labelled sample quantities. Do not simulate live stock or financial totals, connect MongoDB, print a real receipt, write files, take a payment, or request hardware access. A static view is acceptable when interaction adds little explanation.

Show one understandable workflow, such as recording a sale leading to an inventory movement and a reporting entry. If sample quantities change across views, make them internally consistent and label the flow as illustrative. Include the idea of review/correction and role responsibility without making unsupported claims about tamper-proof auditing or complete fraud prevention.

Explain deployment questions plainly: web or desktop delivery based on the task, supported devices/operating systems, printer/scanner models to be tested, internet expectations, offline requirements, data synchronisation, and support arrangements. Do not claim compatibility with all POS hardware or that offline sales/sync are automatically included. Specific peripherals need explicit validation in an actual engagement.

Client inputs: current workflows, example forms/reports, product and stock data quality, locations/users/roles, existing software, hardware model details, connectivity conditions, and a named operational owner. Request anonymised examples where possible; never invite production passwords or sensitive customer datasets through the public contact channel.

Delivery approach: workflow discovery and data review; prototype the key task; implement the agreed modules; test with representative cases and devices; plan training, rollout, and handover. Data import/migration, reconciliation, pilot operation, and rollback planning should be scoped when needed. Do not promise automatic migration of arbitrary legacy databases or a disruption-free cutover without investigation.

Boundaries/costs: clarify hardware purchases, third-party licences/services, data cleaning/import effort, hosting/backups, maintenance, and support coverage as proposal decisions. Backup existence alone is not proof of recoverability; the actual system's restoration process must be agreed and tested. Do not advertise legal/tax compliance or certifications that have not been established.

Draft five or six FAQs: Can we start with one module? Can you work with our existing printer/scanner? Can the system work offline? What happens to our existing data? Who can access each function? How are backup, training, and support handled? Use conditional, useful answers tied to assessment and agreed scope. Avoid “yes, everything is included” copy.

Use genuine relevant project records, such as approved inventory/POS work, with accurate founder/company contribution and prototype/client status. If no approved evidence exists, omit the block rather than borrow an unrelated finance prototype as proof of a production POS deployment. Related Custom Software and AI/Automation descriptions may be shown if approved, but their routes remain unlinked until implemented and approved.

Use the shared detail template with an operations-focused illustration, clear deliverable groups, realistic boundaries, and the exact business-systems enquiry slug. Keep the site content repository-managed; the newly chosen MongoDB database is for the future website enquiry feature and must not be connected here.

Prepare the draft gallery specimen and update actual route implementation status based on completed checks, keeping approval separate. Reconcile Services overview, header/mobile service lists, footer, and homepage need mappings through shared selectors. Do not enable Steps 34–36 routes merely because this page references their services.

Verify sample-data consistency, optional module distinctions, honest hardware/offline wording, no live POS/storage behaviour, valid links, metadata, draft exclusion, responsive layout, keyboard interaction, and no-JS readable content. Run standard checks and smoke-test the previous two detail pages through the common template. Record step-33.md and a concise pack readiness matrix. Suggested commit: feat: add business systems service page.

Stop here. Step 34 is the AI and Automation service page.
```

**Accept when:** The page describes specific operational tasks, realistic hardware/data/support requirements, and accurately labelled evidence without pretending a complete business system has been deployed.

## Integration review after Step 33

Maintain a compact matrix in `docs/services/readiness.md`:

| Item | Record separately |
| --- | --- |
| Overview | Implementation, approved introduction/summaries, public route, navigation links |
| Shared template | Route strategy, draft filtering, optional sections, metadata, checks |
| Websites and E-commerce | Detail implementation, content approval, route readiness, enquiry destination |
| Web and Mobile Applications | Detail implementation, content approval, route readiness, enquiry destination |
| Business Systems | Detail implementation, content approval, route readiness, enquiry destination |
| Remaining three services | Still pending Steps 34–36; summaries may already exist |

Check that the first three pages feel related but not interchangeable: different audience questions, examples, deliverables, scope boundaries, FAQs, and evidence should justify each page.

The MongoDB decision should be recorded in relevant project planning. The previously delivered prompt files have not been retroactively rewritten by this pack; do not blindly follow their Supabase setup instructions when the database steps arrive.

## Verification commands and Git checkpoints

Before a new step, after the previous PR is merged:

```sh
git status
git switch main
git pull --ff-only origin main
git switch -c feature/29-services-overview
```

Adapt the branch to the selected step. Preserve unrelated uncommitted work rather than discarding it.

After implementation, run:

```sh
npm run validate:content
npm run check
npm run build
```

Use `npm run dev` for gallery review. After a successful build, stop that server and use `npm run start` for public-route, unknown-slug, metadata, and gallery-exclusion checks. Do not edit `NODE_ENV` in `.env.local` to switch modes. No database connection should be necessary.

Review the actual changes, then stage only the files belonging to the step:

```sh
git diff --stat
git diff
git add YOUR_REVIEWED_FILE_PATHS
git diff --cached
git commit -m "feat: add services overview page"
git push -u origin feature/29-services-overview
```

Replace the uppercase file-list placeholder and use the selected step's branch/message. Open and review a PR with implementation notes, visual/interaction checks, and pending content approval. Merge before starting the next branch. Never stage private env files, unpublished confidential source material, or generated build output, and do not force-push around an unexplained conflict.

## Focused correction prompt

```text
There is a problem in the current Zatroz service-page step: [describe it and attach a non-sensitive screenshot/error]. Read this step, the shared service-page contract, project rules, and the current diff. Reproduce the problem where possible and explain its cause in easy English. Make the smallest relevant correction while preserving shared types, design tokens, MongoDB as the future database choice, approved content, draft filtering, route readiness, existing versions, and unrelated changes. Do not fix it by publishing draft copy, inventing evidence, adding fake links, disabling checks, or connecting a database unnecessarily. Rerun affected checks, report actual results, and stop within this step.
```

## Completion checklist

- [ ] Services overview is implemented with useful approved summaries and honest link availability.
- [ ] One reusable detail template supports the six canonical services.
- [ ] Summary approval, detail approval, and route implementation remain distinct.
- [ ] Unknown/draft/archived service content is unavailable through public pages and metadata.
- [ ] The first three detail pages have distinct, complete content drafts and working review specimens.
- [ ] Published service claims reflect confirmed delivery capacity and scope.
- [ ] No actual store, app, POS, or database connection was added to demonstrate a service.
- [ ] Contact links use canonical service slugs or accurate approved fallbacks.
- [ ] Header, mobile menu, footer, overview, and homepage consume the same eligibility rules.
- [ ] Content/quality/build results and manual responsive/accessibility checks are recorded.
- [ ] MongoDB is recorded as the future enquiry database; service content remains repository-managed.
- [ ] Each step has a reviewed Git checkpoint; remaining service pages stay pending.

Next request: **“Give me the complete Step 34 prompt file: AI and Automation service page.”**

This is a prompt deliverable. Implementation and verification happen in your actual Cursor project; no local website code, account setup, or deployment is claimed by providing this file.
