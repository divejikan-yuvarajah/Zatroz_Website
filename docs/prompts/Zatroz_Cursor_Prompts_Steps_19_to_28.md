# Zatroz — Enhanced Cursor AI prompts: Steps 19–28

Prepared for Divejikan and the Zatroz founding team · 16 September 2026

Build the complete homepage in ten focused steps using the foundation from Steps 01–18. This pack includes design direction, content contracts, interaction behaviour, responsive requirements, verification, and Git checkpoints. It supplies prompts for your local Cursor project; it does not claim that the website or tests have already been implemented.

## Execution order

| Step | Deliverable                                       | Suggested branch                |
| ---- | ------------------------------------------------- | ------------------------------- |
| 19   | Homepage hero composition                         | `feature/19-home-hero`          |
| 20   | Hero scenario interactions                        | `feature/20-hero-interactions`  |
| 21   | Credibility and evidence section                  | `feature/21-home-evidence`      |
| 22   | Featured projects                                 | `feature/22-featured-projects`  |
| 23   | Business-needs service explorer                   | `feature/23-service-explorer`   |
| 24   | Practical automation example                      | `feature/24-automation-example` |
| 25   | Delivery process section                          | `feature/25-home-process`       |
| 26   | Team and company introduction                     | `feature/26-home-team`          |
| 27   | Approved feedback and FAQs                        | `feature/27-home-faq`           |
| 28   | Final enquiry CTA and homepage integration review | `feature/28-home-cta`           |

Execute one numbered prompt, review its changes, verify it, and merge its checkpoint before starting the next. Do not paste all ten prompts and ask Cursor to build everything at once.

## Before starting

Open the existing `zatroz-website` root in Cursor. Check `docs/progress.md`, Git status, project rules, and the actual code. Steps 01–18 should provide the design tokens, reusable UI/form components, shared layout, desktop/mobile navigation, footer, typed content, route-readiness rules, and content validation command.

Use the existing files as the authority. If a component already exists under another sensible name, extend it instead of creating a duplicate. Missing business assets should become documented content tasks, while reusable implementation continues.

Attach this file, then say: **“Follow the session instruction and execute Step 19 only.”** In a fresh chat, use the same instruction with the next step number.

### Session instruction

```text
Act as my senior frontend engineer, product designer, and patient mentor for Zatroz. Read AGENTS.md, .cursor/rules/, relevant planning/design/content documents, installed versions, current source, and Git status before editing.

Execute only the selected numbered step. Explain the short plan, then implement the authorized local changes. Preserve user edits, working behaviour, existing Git history, and established component APIs where practical. Use our Next.js App Router, React, TypeScript, Tailwind, and npm setup; do not recreate or upgrade the project.

Follow the shared homepage contract in this pack. Prefer Server Components and narrow public content projections. Use small Client Components only for interactions. Keep internal evidence, drafts, and secrets out of client props and bundles. Never read or print private environment-file contents.

Use clear, specific business language. Do not invent clients, awards, founder details, testimonials, project outcomes, numerical claims, service commitments, live integrations, or prices. Proposed copy stays draft until the owner approves it. Technical completeness and content approval are separate statuses.

Build the current section with existing tokens and primitives. Do not build later service/about/contact pages, a real form endpoint, database integration, authentication, analytics, live AI, CMS, or deployment. Do not install GSAP or Motion in this pack; the dedicated motion step comes later. Small functional state changes and restrained CSS feedback are sufficient now.

Use real semantic elements, keyboard support, readable focus, responsive layouts, and reduced-motion behaviour. Keep primary text visible on first render; no entrance-animation opacity gates, forced scrolling, decorative loader, or fixed-height hero.

Run the relevant quality/content/build checks and inspect the result where tools permit. Report Passed, Failed, or Not run truthfully, with actual evidence. If a browser or screen reader is unavailable, give precise manual checks and record them as pending. Do not disable checks to claim success.

Finish with: what changed and why; files changed; real verification results; unresolved content/technical items; a suggested commit; and the next step number. Prepare the Git checkpoint for my review, but do not commit/push unless I explicitly ask. Stop after this step.
```

## Shared homepage contract

### One visual story

The homepage should show how Zatroz connects a business need to a useful digital result. Use warm-white editorial sections, confident Manrope headings, charcoal feature areas, authentic project media, and a restrained orange connection motif. Let layout, typography, and relevant evidence create quality; do not turn every section into the same rounded-card grid.

Keep `#FF3B10` as the brand accent, with dark text on bright orange buttons. Reuse the Step 11 semantic colours, surfaces, spacing, radii, and focus treatments. Use tested inverse tokens in charcoal sections. Keep maximum width near the established 1280px token, readable paragraph widths, and fluid gutters. The existing design system wins over new arbitrary pixel values.

Suggested rhythm: light hero → compact evidence → generous selected work → needs-based explorer → charcoal automation example → calm delivery process → authentic people → readable questions → warm-white final invitation → existing charcoal footer.

### Composition and responsibilities

`src/app/page.tsx` remains a thin Server Component that gets public content and composes sections. SiteShell continues to own the one main landmark; do not add a second main or duplicate header/footer. The hero owns the only page H1. Later section headings are H2, with H3 for items where appropriate.

| Section            | Stable ID            | Public rendering condition                                         |
| ------------------ | -------------------- | ------------------------------------------------------------------ |
| Hero               | `home-hero`          | Approved headline/copy; approved illustrative scenario             |
| Evidence           | `home-evidence`      | At least one approved evidence item, or approved introductory copy |
| Selected work      | `selected-work`      | At least one approved, useful project feature                      |
| Service explorer   | `services-explorer`  | Approved need descriptions and their approved capabilities         |
| Automation example | `automation-example` | Approved illustrative workflow content                             |
| Process            | `how-we-work`        | Approved delivery descriptions                                     |
| People             | `people`             | Approved company/team introduction or founder profiles             |
| FAQ                | `questions`          | Approved questions and answers, or approved feedback content       |
| Final invitation   | `start-a-project`    | Approved invitation and a valid contact action                     |

Use a small server-side homepage composition model derived from these conditions. Do not duplicate render eligibility in several components. An anchor link is eligible only if its target section actually renders. Omitted sections should leave no empty headings, spacers, or dead links.

### Approval and preview policy

The prompts include proposed copy to speed up design. Store it with the Step 18 publication model as draft unless the owner has explicitly approved that exact content. Do not silently mark it approved. Implement reusable sections fully even when content is pending.

Show draft examples in the existing guarded `/dev/ui` gallery, with clear review labels. Add a homepage composition specimen there if useful, reusing section components and safe fixture data. The actual `/` uses approved projections only; while approval is missing it may remain sparse or retain an honest development placeholder. Keep a content-readiness list explaining why. Do not show internal “awaiting approval” labels to future customers.

Do not loosen the development-only server guard or treat noindex as protection. Do not import confidential evidence into a development fixture. When repeated sections appear in the gallery, pass an ID prefix so there are no duplicate IDs. Use a neutral wrapper and demote the specimen hero to H2 so the gallery itself still has one main and one H1.

### CTA destination policy

Reuse the route registry and contact approval rules from Steps 15–18. Resolve destinations on the server using public-ready data. Keep labels truthful to the chosen destination.

| Intended action    | Preferred destination         | Interim option if preferred page is unbuilt                                                                                 |
| ------------------ | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Start a project    | Ready `/contact`              | Approved email labelled Email Zatroz, or confirmed WhatsApp labelled Chat on WhatsApp; otherwise omit action in public view |
| Explore our work   | Ready `/work`                 | `#selected-work` only if that section renders                                                                               |
| Read project story | Ready `/work/[slug]`          | Approved external demo/repository with its actual label, or a nonlinked useful summary                                      |
| Explore service    | Ready canonical service route | Existing relevant homepage section with a truthful label, or no link                                                        |
| See our process    | Ready `/process`              | `#how-we-work` only when rendered                                                                                           |
| Meet Zatroz        | Ready `/about`                | `#people` when rendered and useful, otherwise omit                                                                          |

Do not link a section to itself as its CTA. Do not ship disabled-looking fake buttons, empty hrefs, or future route links that return 404. If the final invitation has a working contact method, earlier sections may link to `#start-a-project`. Before Step 28 exists, that anchor must not be generated. Keep this as one shared policy rather than scattered conditional strings. A valid fallback does not mean the final Contact page is complete.

### Standard verification for every step

- Run `npm run validate:content`, `npm run check`, and `npm run build` as available from the earlier setup; explain if a script is absent rather than silently skipping it.
- Inspect the affected section at 320, 390, 768, 1024, and 1440px, plus 200% zoom. Inspect intermediate widths where the layout changes.
- Check keyboard use, focus, heading order, long copy, missing optional content, and no horizontal overflow.
- Check reduced motion and slow loading where relevant; do not claim overall performance targets from a development-server impression.
- Verify existing navigation/footer and the production exclusion of `/dev/ui` after shared changes.
- Update `docs/progress.md` and a concise `docs/homepage/step-XX.md` with changed files, actual checks, missing inputs, and acceptance status. Do not generate dozens of repetitive reports.

## Step 19 — Build the homepage hero

**Goal:** Explain Zatroz's offer immediately and establish its original “Connected business” visual identity.

**Before starting:** Step 18 is reviewed. The hero is static in this step; scenario selection is Step 20.

### Copy into Cursor

```text
Execute Step 19 only: build the static Zatroz homepage hero.

Read the session instruction, shared homepage contract, existing design system, public-content selectors, route/contact readiness, and the original hero plan. Inspect the actual home route before replacing its development placeholder.

Create a focused home-hero component under src/components/sections/ and a small business-workflow visual component where useful. Add a typed homepage content module through the existing Step 18 conventions. Create docs/homepage/step-19.md and extend progress. Keep page.tsx a server composition file.

Proposed copy for review:
Headline: Digital solutions. Built around your business.
Supporting copy: We design websites, applications, and automation that help your business sell, serve customers, and manage everyday work.
Intended primary action: Start a project.
Intended secondary action: Explore our work.
Treat this as proposed copy unless explicitly approved. Use the shared CTA resolver and approval policy; never fabricate a working /contact or /work destination.

Desktop: create a balanced editorial two-column layout, with a strong left headline and a right original business workflow illustration. Use deliberate whitespace, limited line length, and a small optional brand/category eyebrow without unverified location or award claims. Keep the text column optically aligned with the visual. Do not copy a reference website's graphics, headline treatment, or exact composition.

Visual: three compact, purposeful panels connected by a restrained orange path, illustrating request -> system action -> reviewed outcome. Use HTML/CSS and a small inline SVG for decorative connectors. All meaningful labels must remain real readable text outside decorative graphics. Use clearly labelled sample data, never actual personal/customer data. Avoid tiny dashboard text, fake financial metrics, excessive nested cards, glowing gradients, stock robot art, or unsupported vendor logos.

Use Sell online as the first static example: customer request -> organised order details -> ready for the business to review. Do not display a real payment confirmation, successful transaction, or live status. Label it Illustrative workflow. This is a service explanation, not an operational product demo. Prepare a typed scenario input so Step 20 can extend the visual without rebuilding it, but do not add nonfunctional scenario controls now.

Mobile: text first, actions second, compact vertical workflow third. Allow headline wrapping naturally with fluid type; do not force desktop line breaks or use nowrap. Controls may become full width where useful. Keep the illustration legible rather than shrinking a desktop dashboard. Use content-based height, not a mandatory full-screen hero. Decorative connectors cannot create horizontal overflow or overlap text.

Render headline, copy, and default visual on the server with no animation gate. No GSAP, carousel, autoplay, LLM request, canvas, or video background. Decorative SVG must be hidden from assistive technology; provide an adjacent concise text explanation of the workflow. Do not expose multiple duplicate descriptions of the same figure.

Use existing Container, Section, typography, ButtonLink, and focus styles. Avoid adding client state to the whole hero. If approved media is used instead of code-native illustration, reserve dimensions and use the project's image conventions; the hero must not depend on downloading a huge external asset.

Add a full hero review specimen to /dev/ui using draft-safe data, an ID prefix, and an H2 specimen heading. Public / uses approved content only. Build the server-side homepage render/anchor conditions needed for honest CTA fallbacks, but avoid a generic page-builder framework.

Verify first render with JS disabled, narrow layouts, zoom, long headline/copy, zero/one/two available CTA destinations, no missing anchors, and no unintended client bundle expansion. Run the standard checks and record the real result. Suggested commit: feat: build connected business hero.
```

**Accept when:** The offer is readable immediately; the visual explains a business task; mobile has a natural reading order; no CTA points to an unbuilt destination; draft copy has not been silently published.

## Step 20 — Add hero scenario interactions

**Goal:** Let visitors explore three practical service examples without changing the headline or turning the hero into an application.

| Scenario       | Three-stage illustration                             | Relevant service        |
| -------------- | ---------------------------------------------------- | ----------------------- |
| Sell online    | Customer request → organised order → business review | Websites and E-commerce |
| Run operations | Stock update → shared record → team overview         | Business Systems        |
| Automate tasks | Invoice received → extracted draft → human review    | AI and Automation       |

### Copy into Cursor

```text
Execute Step 20 only: add accessible scenario selection to the existing hero.

Read the session instruction, homepage contract, Step 19 implementation, and the scenario table. Preserve the server-rendered headline, main actions, visual design, and content approval rules.

Extend the typed scenario data with the three labelled examples. Each record needs a stable ID, title, short explanation, three stage labels, safe illustrative details, and an optional eligible service destination. Keep sample data explicitly illustrative. No scenario should imply live inventory, payments, banking integration, or AI processing.

Place selection state in a small Client Component covering the selector and changing illustration only. Pass the public scenario projection from the server. Keep all data local; no API call, query-string update, storage, analytics, or timer-based cycling. The initial selection must match the server render to avoid hydration shifts.

Use a labelled group of three ordinary buttons with aria-pressed indicating the single selected choice. This is a simple scenario selector, not an incomplete tabs implementation. All buttons use normal Tab navigation and activate with Enter/Space; do not add tab roles or half-implemented arrow-key rules. Keep focus on the activated button while content changes. The selected state must be visible beyond colour, with clear shape/border/text treatment.

Keep the initial example visible before hydration. Do not expose apparently interactive controls that cannot yet work: enable the selector when ready, with a sensible static/no-JS explanation and access to the other scenario summaries when JS is unavailable. Avoid showing duplicated descriptions during normal operation. Do not blank the illustration during hydration.

Update stage labels, sample details, explanation, and related action coherently from one selected ID. Use a short polite status message if needed to announce the selected example, not an aria-live region around the entire graphic. Avoid moving focus, repeated verbose announcements, or recreating every element with random keys.

Maintain enough visual stability to avoid jarring vertical jumps, while allowing long text, zoom, and mobile layouts to grow. Never use a fixed height that clips alternate examples. At narrow widths, stack or wrap readable button labels; do not hide options off-screen without a clear affordance. Do not require swiping or hovering.

A brief colour/opacity state transition is optional, but content must remain immediately available and reduced motion must show the final state. No GSAP, autoplay, progress countdown, decorative sound, or fake processing loader. Later animation work can enhance this stable implementation.

Check all three selections, repeated rapid activation, keyboard focus, selected-state semantics, missing related service routes, 320px width, enlarged labels, reduced motion, and JS-disabled rendering. Use existing test tools for selected scenario/content consistency where available. Ensure switching never changes the main hero headline or scrolls the page. Run the standard checks, update step-20.md/progress, and suggest: feat: add hero scenario interactions.
```

**Accept when:** Each selection updates one coherent example; the default remains useful without JS; there are no live service calls, focus jumps, or inaccessible hidden choices.

If you later replace this with actual tabs, implement the full [W3C tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) rather than adding tab roles to these buttons without the required relationships and keyboard behaviour.

## Step 21 — Build the credibility and evidence section

**Goal:** Give visitors specific, traceable reasons to continue reading without exaggerated social proof.

### Copy into Cursor

```text
Execute Step 21 only: implement the homepage credibility/evidence section.

Read the session instruction, homepage contract, content/asset inventory, published project/founder records, and any supplied evidence. Do not treat a project name, draft claim, or event attendance as a verified company achievement.

Create home-evidence under sections/ and an evidence content type/module consistent with Step 18. Suggested fields: stable ID, concise claim, evidence kind, actual subject (company/person/team/project), source reference, public-safe supporting label, approved destination if any, and publication state. Keep private verification notes outside public projections.

Place this section after the hero. Use a compact editorial strip with a brief introduction and up to three strong proof items. Prefer readable text links and short labels over a row of exaggerated statistics. It should connect the offer to evidence, not interrupt the page with another hero-sized block.

Eligible evidence could include an approved project demonstration, a published case story, or a correctly attributed founder/team achievement. A founder's AWS student/community role is not an AWS company partnership. A hackathon team's result is not proof that Zatroz served the sponsoring bank as a client. Preserve original team attribution and describe Zatroz's actual connection only when verified.

Only use customer logos with an actual relationship and permission. Do not invent a logo wall, “trusted by” claim, partner badge, years of experience, number of clients, or percentage improvement. Never multiply individual founder experience into fictional company years.

Provide clear evidence labels and links that reflect the actual destination: View prototype, Read project story, or View achievement source. Use route-ready internal links or exact approved external sources; no guessed URLs. An approved claim without a public URL can remain accurately described without a fake link, but it must still have internal verification recorded.

Handle 0/1/2/3 items intentionally. With no approved evidence, use an approved concise company introduction if available, otherwise omit the public section entirely and record the gap. Do not publish “proof coming soon” cards or fill gaps with made-up testimonials. Gallery specimens can demonstrate layout with clearly labelled generic fixtures that are never public evidence.

Keep the component server-rendered and semantic, with a suitable section heading that can be visually subtle. No counters, moving logo strips, hover-only explanations, or animations. Ensure mobile wraps items into a readable list instead of a cramped row. Do not generate a dead home-evidence anchor when the section is omitted.

Verify attribution, approval filtering, link destinations, empty states, long claim text, reading order, and keyboard focus. Check that private evidence notes do not reach HTML/client data. Run standard checks, update step-21.md and content gaps, and suggest: feat: add verified homepage evidence.
```

**Accept when:** Every public proof item has the correct subject and evidence; empty content produces no fabricated proof or empty visual strip.

## Step 22 — Build featured projects

**Goal:** Show concrete work through genuine media, a clear business problem, and an honest description of the contribution.

### Copy into Cursor

```text
Execute Step 22 only: implement the homepage selected-work section.

Read the session instruction, homepage contract, approved project/media selectors, work-status types, and route registry. Build a reusable project feature component suitable for later reuse without implementing the Work page or case-study routes now.

Create home-featured-work under sections/ and an appropriately located project-feature component. Add typed homepage featuredProjectIds/order references rather than duplicating whole project records. Extend content validation to reject missing/duplicate featured references and prevent draft projects from being exposed.

Prefer two strong projects. Use a generous image-led layout: two considered editorial features, or one lead feature plus two secondary features only if three approved stories actually exist. Do not force a three-card grid when the content is weak. Give each project enough space to explain why it matters.

Each feature should present a real approved image when available, visible work-status label (Client work, Live product, Prototype, or Research concept), title, concise business problem, actual delivered contribution, and an evidence-backed result or honest capability description. Do not replace missing measured outcomes with invented metrics. Clearly distinguish founder/hackathon work from company client work.

Use meaningful crops that retain the important UI, captions where needed, and a stable aspect ratio. Preserve screenshot privacy: no personal data, tokens, real financial details, or unauthorized customer material. Never invent an image path or use a broken placeholder. If media is unavailable, use a purposeful text-led feature or omit that selection; do not present an illustrative mockup as a screenshot of a shipped system.

Use the installed Next.js Image API with intrinsic dimensions or a properly sized fill container and accurate responsive sizes. Do not eagerly preload every below-fold project image. Keep alt text purposeful, and avoid repeating the complete adjacent caption. Restrict any remote image configuration to actual required trusted sources, not broad wildcard access.

Prefer a clear title/story link to a ready case-study route. If the route is unbuilt, an approved external demo or repository can be linked with its actual label; otherwise show a useful nonlinked feature. No fake “Read story” action, mandatory modal, nested links, or clickable div. Optional tiny image emphasis can respond to hover and focus without hiding content, and must respect reduced motion.

Use selected-work as the section ID only when it actually renders. Update eligible hero/work fallback links through the shared composition model. With no approved features, omit public selected work and demonstrate the component in the guarded gallery. Handle one project gracefully and show no empty grid slots.

Verify 0/1/2/3 records, draft exclusion, missing media, long titles, non-numeric results, responsive image sizing, keyboard links, route availability, and page stability as images load. Run standard checks and record any missing project evidence/media. Suggested commit: feat: showcase selected projects.
```

**Accept when:** Features explain genuine work, media is correctly identified, draft projects stay private, and all visible actions have working destinations. Image implementation should follow [Next.js Image documentation](https://nextjs.org/docs/app/api-reference/components/image) for the installed version.

## Step 23 — Build the business-needs service explorer

**Goal:** Help visitors recognize their problem before choosing a technical service.

| Business need             | Relevant service groups                                    | Illustrative deliverable                     |
| ------------------------- | ---------------------------------------------------------- | -------------------------------------------- |
| Reach more customers      | Websites and E-commerce; UI/UX Design                      | A clear business website or online catalogue |
| Launch a digital product  | Web and Mobile Applications; UI/UX Design; Custom Software | A focused first version of an application    |
| Organise daily operations | Business Systems; Custom Software                          | A stock, POS, or internal workflow system    |
| Reduce repetitive work    | AI and Automation; Custom Software                         | A reviewed workflow connecting routine tasks |

### Copy into Cursor

```text
Execute Step 23 only: implement the homepage service explorer.

Read the session instruction, homepage contract, canonical six-service records, route readiness, and the business-needs table. Do not create service detail pages, pricing packages, or an enquiry form now.

Add typed business-need records referencing existing service IDs and optional approved project IDs. Keep need descriptions and deliverables draft until approved. Extend validation to reject broken relationships; do not duplicate service titles or paths in JSX.

Build home-service-explorer with four large numbered need rows and related explanatory content. Desktop can use rows on the left and a selected preview on the right; mobile should place the selected content directly beneath its trigger. Choose one clear disclosure-based interaction with consistent meaning across breakpoints. Avoid separate duplicated desktop/mobile widgets with conflicting IDs, hidden focusable controls, or two independent selection states.

Use labelled native buttons controlling their associated detail regions, with aria-expanded and aria-controls. Show one expanded need at a time; activating the expanded trigger may collapse it. Define a sensible default first open item while allowing a readable no-JS fallback. Use stable IDs and keep focus on the trigger during selection. Do not label this as tabs while implementing accordion keyboard behaviour. Normal Tab/Enter/Space is sufficient for the disclosure model.

Each detail contains a short business explanation, typical deliverable, referenced approved service capabilities, optional related approved work, and an eligible next action. All useful information must be available by explicit selection; hover can never be the only way to reveal it. Selected/open state needs a readable structural cue beyond orange colour.

Keep content server-derived and local; isolate selection state. Ensure essential service descriptions remain reachable without JavaScript, using a progressively enhanced disclosure or readable static fallback rather than a blank preview. If using a CSS layout that positions a panel beside rows, preserve logical DOM/reading order, allow dynamic height, and prevent panel overlap with the next section.

Service actions should go to their ready canonical detail routes. Future enquiry links may use /contact?service=<canonical-slug> only when Contact is ready, with allowed slugs from shared data. Do not send an invented multi-service slug or put personal information in URLs. For multi-service needs, identify a primary service explicitly or keep the enquiry generic. Without a ready route, use a truthful existing section/contact fallback or omit the action.

Do not add prices, exaggerated AI promises, an automated recommendation engine, chat, modal wizard, or live API. Keep the choice understandable in seconds. Use generous tap targets and restrained separators instead of decorative cards inside every row.

Test each need, open/collapse/rapid switching, keyboard focus, browser resize while open, 320px width, long deliverable text, missing related project, unavailable route, and no-JS behaviour. Hidden panels must contain no reachable links. Check reading order with a screen reader where available. Run standard checks, update step-23.md, and suggest: feat: add business-needs service explorer.
```

**Accept when:** Each business need maps to the correct service records; mobile details appear near their trigger; content remains useful without hover or JS. The [W3C disclosure pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/) describes expanded-state and control behaviour.

## Step 24 — Build the practical automation example

**Goal:** Explain automation through a concrete, human-reviewed workflow without implying a live AI system.

### Copy into Cursor

```text
Execute Step 24 only: implement the homepage automation explanation.

Read the session instruction, homepage contract, shared workflow styles from the hero, and approved AI/automation service content. Reuse small visual primitives where appropriate without creating a generic graph-rendering framework.

Create home-automation-example with a charcoal surface, readable inverse text, restrained orange connection marks, and a visible Illustrative workflow label. Proposed heading for review: Less repetitive work. More room to focus. Proposed explanation: Connect routine tasks while keeping important decisions with your team. Treat both as draft until approved.

Use four explicit stages: Receive a sample invoice; Extract draft fields; Review uncertain details; Approve a record for the business system. Keep a numbered text explanation as the accessible source of meaning. Decorative paths/arrows are not the only explanation. Show one small, readable fictional invoice example labelled Sample data, without a real business name, bank account, person, or claimed processing accuracy.

Make the review gate visible and substantive. An uncertain field should be marked Needs review; the final stage must describe approval as part of the illustration, not imply autonomous posting/payment. Do not claim end-to-end encryption, bank connectivity, legal/tax compliance, zero errors, or a measured time saving without evidence.

The default fully rendered section shows the complete workflow immediately. Optionally add a button labelled Step through example that starts a manual walkthrough with Next step and Reset controls. Manual progression is preferred to timed autoplay: no interval, indefinite loop, live upload, file input, fetch, OCR, LLM, database, or fake network processing. Each stage change may highlight the selected step and update a brief description; retain the overall sequence and context.

If implementing the walkthrough, keep state in a small Client Component, announce only a short stage label when useful, and leave keyboard focus on the activated control. Clearly mark any simulated completion as Example complete — no document was processed. Reset restores the initial view predictably. Do not make the explanatory content depend on entering walkthrough mode.

Desktop may arrange the four stages horizontally only if labels remain readable; mobile uses a vertical numbered flow. Avoid shrinking text to make the diagram fit. Keep connection graphics away from labels. With reduced motion or JS disabled, the complete static description remains useful. No GSAP or reveal animations now.

Use an eligible Explore AI and automation link when its service route is ready, otherwise the already-rendered service explorer or approved contact action with an accurate label. No self-link or future 404.

Verify sample labelling, human-review wording, each optional walkthrough state, reset, keyboard focus, no network requests, dark-surface contrast, narrow layout, reduced motion, and no-JS output. Run standard checks, update step-24.md, and suggest: feat: explain practical automation workflow.
```

**Accept when:** A visitor understands the task and human review step; the example is visibly illustrative; nothing is uploaded, processed, or saved.

## Step 25 — Build the delivery process section

**Goal:** Reduce uncertainty by showing what the customer and Zatroz do at each stage.

### Copy into Cursor

```text
Execute Step 25 only: build the homepage process section.

Read the session instruction, homepage contract, approved company commitments, and original process plan. Create typed process-step content and a home-process component; do not build /process yet.

Use four proposed stages for owner review:
1. Discover — understand the business problem, users, constraints, and priorities; customer output: an agreed initial scope.
2. Design — review the user journey and interface direction; customer output: a reviewed prototype or design appropriate to the project.
3. Build — implement in manageable increments and review working progress; customer output: demonstrated functionality and feedback checkpoints.
4. Launch and support — verify the agreed release, hand over access/documentation, and define ongoing responsibilities; customer output: a launch/handover checklist and an explicit support arrangement.

Do not turn proposed operating practices into published guarantees. Support is subject to agreed scope, not automatically free forever. Avoid fixed delivery durations, unlimited revisions, free hosting, source ownership promises, or payment terms unless supplied and approved.

Create an editorial introduction beside a clear four-step ordered list/timeline on desktop, stacking naturally on mobile. Each step includes its number, title, concise description, and a visible customer-facing output. Use restrained connecting rules as decoration. Keep all four steps visible without clicking, scrolling inside a panel, or waiting for animation.

Use semantic ol/li and headings at the correct level. Keep the DOM order chronological and avoid CSS ordering that changes meaning. Do not add sticky pinned storytelling, scroll progress JS, automatic stage activation, or a giant animated counter. This section should feel calm after the dark automation example.

Use how-we-work only when approved process content renders. An eligible See our process action goes to ready /process; otherwise use an existing contact invitation with a truthful label, or omit the redundant link. Do not link the section to its own anchor. Earlier hero fallbacks may now use the process anchor if applicable through the shared resolver.

Handle long titles/descriptions and absent optional outputs without broken list numbering or empty labels. For public readiness, require the essential description/output fields in approved records; incomplete drafts stay in the guarded gallery. Preserve the distinction between internal task instructions and public-facing copy.

Verify the ordered reading sequence, mobile alignment, long text, 200% zoom, no-JS rendering, missing optional content, and correct CTA destination. Run standard checks, update step-25.md/content approval gaps, and suggest: feat: add delivery process section.
```

**Accept when:** All stages and customer outputs are visible, promises reflect approved practices, and the timeline remains readable as a simple ordered list.

## Step 26 — Build the team and company introduction

**Goal:** Show the real people and working approach behind Zatroz.

### Copy into Cursor

```text
Execute Step 26 only: implement the homepage people/company section.

Read the session instruction, homepage contract, approved founder records, media permissions, and company introduction. There are three founders in the plan, but do not invent missing names, titles, bios, photographs, or profiles. Do not assume everyone has the same contribution.

Create home-team with a documentary/editorial composition: approved team photography or founder portraits on one side, concise company introduction and practical working principles on the other. Use real supplied photography with appropriate permission. No AI-generated substitute faces, unrelated stock staff, unsupported office images, or fake headcount.

Represent available data honestly. With an approved team photo and caption, use it. With only individual approved profiles, use a restrained set of those profiles without implying it is the complete founding team. With no approved photographs but an approved company story, use a strong text-led layout. With neither, omit the public section and show the component only in the guarded gallery. Do not render silhouettes, Person 2 placeholders, empty portraits, or internal missing-asset labels on the public page.

Show approved name, actual role/contribution, short bio, and approved professional links only where useful. Do not duplicate a full About page. Preserve image proportions and use suitable crops; faces must not be cut off by a fixed decorative aspect ratio. Use image alt text and captions without repetitive wording or private details.

Suggested working principles for review are clear scope, visible progress, and careful handover. These are draft proposals until the founders confirm their process supports them. Pair any skill/technology mention with real team capacity or project evidence, not a wall of technology logos or unearned certification badges.

Connect the company story to the customer: who they work with and how communication happens. Avoid vague claims like industry-leading, world-class experts, 24/7 availability, or years of company experience. Do not expose personal phone numbers, student IDs, internal bios, or private profile URLs from the editorial source.

Use an eligible Meet Zatroz action to ready /about; if unavailable, an approved project contribution or contact destination can be linked with an accurate label. Do not link the section to itself. Set the people anchor only when the section renders and update shared anchor eligibility.

Keep the component server-rendered with no card tilt, face animation, carousel, or hover-only biography. Mobile reading order should present the introduction and profiles naturally, with no forced fixed-height photo panel. Check approved external links without sending messages or altering accounts.

Verify zero/one/multiple approved profiles, missing optional portrait, long names, varied image ratios, no private fields in output, accurate attribution, mobile layout, focus, and image loading stability. Run standard checks, update step-26.md and content gaps, and suggest: feat: introduce the Zatroz team.
```

**Accept when:** The section presents real people or an approved company story, respects missing assets, and makes no unsupported claims about team capacity.

## Step 27 — Build feedback and frequently asked questions

**Goal:** Answer practical buying questions and include authentic feedback only when permission and attribution are established.

### Copy into Cursor

```text
Execute Step 27 only: implement homepage feedback and FAQs.

Read the session instruction, homepage contract, existing FAQ records, approved testimonials if any, and current content validation. Create home-feedback-faq and a small reusable FAQDisclosure component only if no suitable equivalent exists.

If an approved testimonial exists, show one complete meaningful quote with approved attribution, role/company context where permitted, and the genuine relationship to Zatroz. Preserve meaning; do not invent a quote, rewrite it into an unsupported stronger claim, attach a stock face, or add a star rating. A comment on a student prototype is not automatically client feedback. Keep private approval evidence out of public props.

If no approved testimonial exists, omit the quote area without leaving empty space. An approved project lesson can be presented as Zatroz's own lesson with that label; it must not look like customer endorsement. Do not add a carousel, rotating quotes, customer-logo strip, or fake review count.

Prepare five or six relevant FAQ records for review, reusing approved records first. Suggested subjects: how to start and what information to share; choosing a suitable service; how scope affects time/cost; who prepares content/assets; how ownership/access are agreed; hosting, maintenance, and third-party costs. Draft answers should be short, useful, and conditional where terms depend on the proposal. Do not publish fabricated prices, legal guarantees, fixed turnaround times, unlimited revisions, or free ongoing support. Do not generate binding legal terms here.

Prefer native details/summary for these short disclosures so they remain usable without JavaScript. Allow multiple questions to be open. Use a visible question as the summary's accessible name, clear expanded-state affordance, and ordinary paragraph/list answer content. Avoid manually duplicating native roles/aria-expanded. Keep links inside the answer, not nested interactive controls inside the summary. Decorative plus/minus icons must not add noisy accessible names.

If the existing project already uses a proven accessible disclosure primitive, reuse it and verify keyboard/state relationships rather than replacing it casually. Do not make a custom accordion solely to animate height. No answer should depend on hover or load from an API.

Use readable width, strong spacing, quiet separators, and the standard focus ring. Long questions and answers must wrap on phones. Keep heading hierarchy coherent: section H2, and semantic question structure appropriate to the chosen native markup without invalid nesting. Content expansion should flow naturally; do not clip answers with fixed max-heights.

Only approved FAQs appear publicly. With zero approved questions and no feedback, omit the section and record the gap; gallery drafts remain labelled. Provide a truthful Ask us about your project action only when its destination is usable. No fake chat widget, unanswered live-chat promise, or FAQ structured data in this step; the SEO step will evaluate markup later.

Check Enter/Space activation, Tab through answer links, multiple open answers, long text, no-JS use, visible focus, screen-reader announcements where available, and zero/one/many content records. Verify testimonial attribution and publication filtering separately from UI tests. Run standard checks, update step-27.md, and suggest: feat: add customer questions and approved feedback.
```

**Accept when:** FAQs are readable and operable without JS, feedback is authentic, and pricing/support/ownership answers reflect approved business terms.

## Step 28 — Build the final enquiry CTA and review the homepage

**Goal:** Give visitors a clear next action and verify that all homepage sections now form one coherent experience.

### Copy into Cursor

```text
Execute Step 28 only: implement the final homepage enquiry invitation and perform a focused integration review of Steps 19–28.

Read the session instruction, homepage contract, public contact configuration, actual section composition, and previous homepage step records. Preserve completed sections; fix concrete integration defects rather than redesigning them all.

Create home-final-cta using existing Section, Container, SectionHeading, ButtonLink, and TextLink components. Proposed heading: Tell us what your business needs next. Proposed supporting copy: Share your idea or the task you want to improve. We can discuss the scope and a suitable next step. Keep these as draft until approved.

Use a warm-white, generous editorial section before the existing footer, with one dominant primary action and at most two quiet alternatives. A strong heading and restrained orange accent are enough; avoid a giant gradient panel, moving background, decorative input fields, or a second competing hero.

Preferred action is Start a project -> ready /contact. Until that page is implemented, use an approved email address labelled Email Zatroz or confirmed business WhatsApp labelled Chat on WhatsApp. Use the canonical contact projection from Step 18, not a second hardcoded phone/email. A generic prefilled message must be URL-encoded and contain no visitor data. Do not claim that clicking an email/WhatsApp link submits an enquiry or books a meeting.

If no approved working contact action exists, complete the component and gallery specimen but omit the public invitation; document this as an important launch blocker. Do not render a dead button or create a fake confirmation screen. No real contact form, backend, booking calendar, analytics event, notification, or database is built in this step.

Use start-a-project as the anchor only when this section renders with a real action. Resolve eligible earlier-section contact fallbacks through the shared server-side composition model. Avoid circular/self-referential links, duplicate contact IDs, and links to omitted sections. Do not automatically enable /contact in the route registry simply because this CTA exists.

Keep the homepage order: hero, evidence, selected work, service explorer, automation example, process, people, feedback/FAQ, final invitation. Header/footer stay owned by the shared shell. Omit unavailable sections cleanly. Make sure each section has a distinct purpose, heading, and visual rhythm; remove redundant repeated text only with a focused documented edit.

Audit the integrated page for one main and one H1, logical H2/H3 order, unique IDs, valid anchors, correct button/link semantics, approved content only, actual image paths, no nested interactive elements, and no page-wide client boundary. Confirm draft gallery data cannot appear on public / through an accidental import or fallback. Inspect the no-JS experience: essential text, useful examples, native FAQs, and valid links should remain available.

Check desktop/mobile navigation, the Services disclosure, mobile modal cleanup, hero selection, service explorer, optional automation walkthrough, FAQ controls, and footer links on the same long page. Pay attention to focus obscured by the sticky header, scroll restoration after closing the mobile menu, and layout movement when panels or images change.

Inspect 320/390/768/1024/1440px and 200% zoom, plus reduced motion. Test an unusually long headline, long project title, missing portrait, absent testimonials, zero featured projects, and unavailable Contact route using safe gallery fixtures, not by corrupting real records. Do not hide overflow to conceal layout defects.

Run content validation, quality checks, and a production build. Inspect the local production page for console errors and obvious loading/layout problems. Use an existing performance tool if available to establish a measured baseline, clearly distinguishing lab results from real-user data. Do not claim Lighthouse scores or Core Web Vitals without running the relevant measurement. Defer the comprehensive performance, SEO, security, and cross-browser release reviews to their roadmap steps.

Create docs/homepage/homepage-review.md with a compact matrix: section, technical completion, content approval, destination readiness, manual checks, and blockers. Record concrete remaining assets/decisions and future page dependencies. “Homepage components complete” must not be reported as “website ready to launch” while required pages, enquiry flow, policies, or content are missing.

Verify /dev/ui is unavailable under npm run start. Update step-28.md and docs/progress.md. Suggested commit: feat: complete homepage enquiry invitation and integration. Stop here; Step 29 is the Services overview page.
```

**Accept when:** There is a truthful usable next action, section links match actual rendered content, the homepage behaves coherently, and the review clearly separates technical completion from content and launch readiness.

## Git checkpoint for each step

After the previous step's PR has been reviewed and merged, start from updated `main`. Preserve unrelated changes and adapt branch names to the selected step.

```sh
git status
git switch main
git pull --ff-only origin main
git switch -c feature/19-home-hero
```

Run the checks for that step, inspect the browser result, and review the actual diff. Stage only reviewed files. The uppercase file list below is a placeholder to replace, not a literal command argument.

```sh
git diff --stat
git diff
git add YOUR_REVIEWED_FILE_PATHS
git diff --cached
git commit -m "feat: build connected business hero"
git push -u origin feature/19-home-hero
```

Use the appropriate branch and commit message for each following step. Review the PR, including its visual/interaction evidence and pending content notes, before merging. Do not stage private environment files, raw confidential evidence, unapproved assets, or generated build output. Do not force-push around unexplained conflicts.

## Focused correction prompt

```text
There is a problem in the current Zatroz homepage step: [describe it and attach a non-sensitive screenshot/error]. Read this step, the shared homepage contract, project rules, and the current diff. Reproduce the issue where possible, explain the cause in easy English, and make the smallest relevant correction. Preserve approved copy, design tokens, component contracts, publication filtering, unrelated work, and installed versions. Do not solve it by inventing content, adding fake links, disabling checks, hiding overflow, removing focus handling, or exposing drafts. Rerun affected checks, report actual results, and stop within this step.
```

## Pack completion checklist

- [ ] All ten homepage components are implemented or have a clearly documented technical blocker.
- [ ] Proposed copy and supplied content have honest approval states.
- [ ] The hero, service explorer, and automation example have useful static fallbacks.
- [ ] Projects, achievements, portraits, and feedback use accurate attribution and approved material.
- [ ] No public link points to an unbuilt page, omitted section, or guessed profile.
- [ ] The final invitation uses a confirmed working contact method.
- [ ] Mobile, keyboard, focus, zoom, and reduced-motion checks are completed or explicitly pending.
- [ ] Content validation, quality checks, and production build results are recorded.
- [ ] The development gallery remains unavailable in production mode.
- [ ] Each step has a reviewed Git checkpoint; the final homepage matrix lists remaining launch work.

Next request: **“Give me the complete Step 29 prompt file: Services overview page.”**
