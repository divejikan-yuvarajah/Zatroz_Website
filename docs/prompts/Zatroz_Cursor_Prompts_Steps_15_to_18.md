# Zatroz — Cursor AI prompt pack: Steps 15–18

Prepared for Divejikan and the Zatroz founding team · 16 September 2026

Continue in the existing `zatroz-website` repository. This pack builds the header, mobile navigation, footer, and structured content foundation using the design system and components from Steps 11–14.

| Step | Deliverable                                | Suggested branch                |
| ---- | ------------------------------------------ | ------------------------------- |
| 15   | Desktop navigation and Services disclosure | `feature/15-desktop-navigation` |
| 16   | Accessible mobile navigation               | `feature/16-mobile-navigation`  |
| 17   | Responsive company footer                  | `feature/17-footer`             |
| 18   | Typed, validated shared content            | `feature/18-content-structure`  |

Run one step at a time. Review and merge its checkpoint before the next step. This file supplies instructions; the website changes and tests have not been executed in your local project.

## Before you start

Steps 01–14 should be implemented and reviewed. The repository should have:

- A working Next.js App Router application, TypeScript, Tailwind, and npm lockfile.
- Project rules, planning documents, and `docs/progress.md`.
- Zatroz colour and typography tokens.
- Button, ButtonLink, TextLink, Container, Section, and related primitives.
- Form primitives and a local-only `/dev/ui` gallery.
- A server-rendered root layout and `SiteShell`, with one main landmark, skip navigation, and optional header/footer slots.
- Working `npm run check` and `npm run build` scripts.

If your repository differs, ask Cursor to inspect it and adapt existing components rather than recreate them. A missing approved logo or social URL can remain an explicit content task; it does not block the component implementation.

Paste the session instruction below and then the selected numbered prompt. Alternatively, attach this file and say: **“Follow the session instruction and execute Step 15 only.”**

### Session instruction

```text
Act as my senior frontend engineer and patient mentor for the Zatroz website. Read AGENTS.md, .cursor/rules/, relevant planning/design/architecture documents, installed versions, and the current Git diff before editing.

Execute only the selected step. Explain a short plan, then implement the authorized local changes. Preserve working code, user edits, existing component APIs where practical, and Git history. Use our existing Next.js App Router, React, TypeScript, Tailwind, and npm configuration. Do not upgrade frameworks or add libraries without a concrete need.

Use easy English. Keep root layouts, content preparation, and static rendering on the server. Limit client code to the interactions that need it. Pass serializable public data to client components; never send private content records, credentials, or internal evidence to the browser. Do not read private environment-file contents.

Follow confirmed repository decisions. Do not invent founder identities, logos, clients, awards, social URLs, service capacity, addresses, prices, registration status, or testimonials. Preserve missing inputs as documented TODOs. Missing business content should not prevent finishing reusable technical work.

Do not build later marketing pages, enquiry submission, database integration, authentication, analytics, or animation systems in this pack. No purchases, invitations, account changes, or deployment. Keep /dev/ui development-only using the existing server guard and noindex metadata.

Run relevant checks and inspect interactions if your tools permit. Report Passed, Failed, or Not run accurately. An automated accessibility scan does not establish full conformance. If you cannot use a browser or screen reader, provide precise manual checks and mark them not run.

At the end, report what changed, files changed, actual verification, pending inputs, and a suggested commit. Prepare the checkpoint for my review; do not commit/push unless I explicitly request it. Stop after this step.
```

## Shared decisions for this pack

### Navigation destinations

| Item                        | Canonical destination          |
| --------------------------- | ------------------------------ |
| Logo / Home                 | `/`                            |
| Services overview           | `/services`                    |
| Websites and E-commerce     | `/services/websites-ecommerce` |
| Web and Mobile Applications | `/services/web-mobile-apps`    |
| Business Systems            | `/services/business-systems`   |
| AI and Automation           | `/services/ai-automation`      |
| Custom Software             | `/services/custom-software`    |
| UI/UX Design                | `/services/ui-ux-design`       |
| Work                        | `/work`                        |
| About                       | `/about`                       |
| Process                     | `/process`                     |
| Start a project / Contact   | `/contact`                     |
| Privacy                     | `/privacy`                     |
| Terms                       | `/terms`                       |

The logo links Home. Desktop navigation contains Services, Work, About, Process, and the project CTA. The Services area has an overview link plus a separate disclosure button for the six service groups. The mobile panel also includes Home explicitly. Policies belong in the footer.

### Routes that have not been implemented yet

Most destinations above will not exist at Step 15. Build the navigation components now without shipping broken links or generating future pages early.

Maintain a small route registry with canonical paths and an explicit `implemented` status, initially based on inspected page files and working routes. Content approval is separate from route implementation. A link becomes eligible for the real shared header/footer only when its destination exists and its public content is ready. Do not treat a folder name alone as proof of a completed page.

Keep the full intended design visible in the guarded gallery: show unavailable destinations as clearly labelled, noninteractive “Planned” text. Use existing routes or real in-page anchors for interactive link examples. Do not use `href="#"`, fake destinations, or disabled-looking links that still navigate. The actual header/footer may be sparse until subsequent page steps are completed; document this honestly and keep Home usable. The final launch checklist must require enabling all intended launch destinations.

Step 15 can introduce a minimal typed navigation/route module. Step 18 extends it into the shared content structure; it must reuse that source rather than creating a second conflicting menu definition.

### Presentation

- Use the existing warm-white header, orange CTA with dark text, and charcoal footer direction.
- Align header/footer content with the shared Container.
- Header height starts around 72px desktop and 64px mobile; allow content growth at zoom rather than clipping it.
- Use a content-driven breakpoint, initially around 1024px, and test intermediate widths. CSS visibility and any JavaScript breakpoint cleanup must agree.
- Preserve the supplied logo. If no approved asset exists, render a simple text “Zatroz” home link and record the asset gap; do not invent a replacement logo.
- Do not add a theme toggle, mega-menu, search, language switcher, sign-in link, or decorative loader.

## Step 15 — Build desktop navigation

**Goal:** Integrate a consistent desktop header with active states, a usable Services disclosure, and the main project CTA when its destination is ready.

**Before starting:** Review the Step 14 shell and navigation specification from Step 3. Start `feature/15-desktop-navigation` from updated `main`.

Ordinary site navigation uses links and disclosure buttons, not application `menu`/`menubar` roles. The [W3C disclosure navigation example](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/) explains that distinction; its example still requires browser and assistive-technology testing. For route-based state, isolate [Next.js usePathname](https://nextjs.org/docs/app/api-reference/functions/use-pathname) in a small client boundary.

### Copy into Cursor

```text
Execute Step 15 only: implement Zatroz desktop navigation.

Read the session instruction, shared destinations and route-readiness policy in this pack, existing SiteShell, Container/ButtonLink/TextLink APIs, design tokens, and docs/planning/navigation-spec.md. Inspect which actual routes are implemented. Do not create their future page content now.

Create or update focused files such as:
- src/components/layout/site-header.tsx.
- src/components/layout/desktop-navigation.tsx.
- src/components/layout/services-disclosure.tsx, only if separation improves clarity.
- src/config/navigation.ts and src/config/routes.ts for the initial typed public configuration.
- src/lib/navigation.ts for a small pure route-matching helper if useful.
- src/app/layout.tsx to pass the header to SiteShell.
- docs/design/navigation.md and docs/progress.md.

Adapt names to established conventions. Keep SiteHeader server-compatible where possible, with interactive disclosure/current-path state in small Client Components. Keep the root layout as a Server Component. Avoid importing the entire future content store into the client.

Render a semantic site header and a labelled primary nav with a list of links. The logo is a Home link with an appropriate accessible name. Use an approved logo asset with intrinsic dimensions, or the plain text fallback documented in this pack. Avoid duplicate screen-reader names from a logo image and adjacent repeated text.

Use the shared container and an opaque warm-white background. Prefer a stable sticky header that does not shrink or shift when scrolling. Use a restrained border; a permanent subtle border is an acceptable simpler foundation than a scroll listener. If adding a scrolled-state border, isolate the observer, clean it up, and do not introduce layout movement. Set compatible scroll-padding/target offsets so skip navigation and future anchors are not hidden. Verify sticky ancestors do not prevent sticking.

Services must have a real overview link and a distinct button that toggles its submenu; do not make one control both navigate and open. Give the button a clear accessible name such as Show service categories, aria-expanded, and aria-controls pointing to a stable unique panel ID. Use an ordinary list of service links, not role=menu/menuitem. Open by click, Enter, or Space, not hover-only behaviour. Closed content must not remain in the tab order.

Close the disclosure on Escape, an outside pointer interaction, selection, or focus leaving the whole disclosure region. Escape returns focus to the disclosure button. Focus leaving naturally must not be stolen back. Moving focus between the overview link, toggle, and panel must not close it prematurely. Do not add unnecessary arrow-key or roving-tabindex controls. Keep the panel inside the viewport with long labels and zoom.

Implement route matching with segment boundaries: exact /services and children under /services/ belong to Services; /services-old does not. Match /work and /work/[real-slug] similarly. Only an exact current destination receives aria-current=page; a parent section can get a separate visual active state without falsely claiming it is the current page. Normalize trailing slashes consistently and do not consider hash/query strings as different page identities. Home matches only /. Support direct loads and client-side navigation. Consider hydration behaviour if this actual project uses rewrites; do not add rewrites or enable experimental caching features for this step.

Apply the route-readiness policy: show only eligible actual destinations in the shared header, and use labelled noninteractive planned items in the full gallery specimen. Hide the project CTA until /contact is genuinely implemented. Do not replace it with a fabricated email link or broken /contact link. If there are no eligible service destinations, omit the real disclosure until ready; its behaviour can still be exercised in the gallery with safe local fixtures.

Extend /dev/ui with a labelled full desktop specimen, active-state specimens, long labels, and disclosure interaction examples using local existing destinations. Use unique ID prefixes when both the real header and gallery examples exist. Do not add a fake page just to exercise route matching; test the pure matcher with explicit path cases. At narrow widths, provide a simple usable Home fallback in the actual header. The interactive mobile panel is Step 16; do not hide all navigation behind a nonfunctional hamburger now.

Verify mouse and keyboard operation; focus exit; Escape; outside click; submenu link selection; exact/child/unrelated paths; long labels; 1024/1280/1440px widths and 200% zoom. Verify header focus and skip-link visibility with sticky positioning. Use an existing test harness for pure route-matcher cases if available, or a small compatible check without adding a heavy test dependency.

Run npm run check and npm run build. Confirm /dev/ui remains unavailable in production mode and the actual header contains no broken links. Document available versus pending destinations and how future page steps enable them. Update progress. Suggested commit: feat: add desktop navigation.

Stop before building mobile navigation or the footer.
```

**Acceptance checks:**

- [ ] Desktop header aligns with page content and stays readable when enlarged.
- [ ] Services overview and the disclosure toggle have separate behaviours.
- [ ] Disclosure can be operated without a mouse; closed links are not focusable.
- [ ] Escape returns focus, while normal tabbing out does not steal focus.
- [ ] Nested route highlighting does not match unrelated path prefixes.
- [ ] Only exact current destinations use `aria-current="page"`.
- [ ] Planned destinations are not broken clickable links.
- [ ] No additional main landmark or layout-wide client boundary was introduced.

## Step 16 — Build mobile navigation

**Goal:** Add a usable mobile menu with predictable focus, scrolling, closing, and breakpoint behaviour.

**Before starting:** Step 15 is reviewed and merged. Start `feature/16-mobile-navigation` from updated `main`. Reuse its destinations and active-state helper.

Use a modal navigation panel with a native `<dialog>` opened by `showModal()`, provided it works in the project's supported browsers. Native modal behaviour supplies useful focus and background-interaction semantics; it does not remove the need to test closing, scrolling, and route transitions. See [MDN dialog guidance](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog). A modal needs an accessible name, focus inside it while open, and an appropriate focus destination when it closes; see [W3C's modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

### Copy into Cursor

```text
Execute Step 16 only: implement Zatroz mobile navigation.

Read the session instruction, navigation configuration, eligibility rules, active-path helper, SiteHeader, SiteShell, and docs/design/navigation.md. Preserve desktop behaviour and the root Server Component.

Add a focused src/components/layout/mobile-navigation.tsx Client Component and integrate it into SiteHeader. Reuse the existing public navigation data and style tokens. Do not copy a second hand-maintained destination array.

Provide a visible Menu label and a generous button target, with a clear accessible name, aria-expanded, aria-controls, and dialog popup semantics where appropriate. Use a native button; an icon is optional and decorative when visible text already names it. Keep the desktop and mobile breakpoint in sync with CSS and cleanup logic. Only the currently visible navigation controls should be keyboard-accessible.

Implement a native dialog opened via showModal(), with an accessible title such as Site navigation, an explicit Close menu button, and a nav/list of ordinary links. Do not merely toggle the open attribute and assume the result is modal. Do not add a second custom focus trap on top of native behaviour unless testing reveals a concrete need. Do not hide an ancestor containing the dialog with aria-hidden. If the supported browser matrix needs an alternative, explain the concrete limitation and implement one consistent accessible pattern rather than mixing modal and nonmodal behaviours.

Use the shared route eligibility rules. Include Home explicitly; include Services, Work, About, Process, and Start a project as their destinations become ready. The full intended list remains in the guarded gallery as labelled planned text until pages exist. For service categories, use a simple inline disclosure/details region inside the mobile panel if needed; do not create a second nested modal. Navigation labels and order must agree with desktop configuration.

Opening: store the trigger reference, show the modal, and place initial focus on a sensible visible element such as the close button. Never open on initial page load. Keep the panel usable at 320px, in landscape, and with enlarged text. Use an internally scrollable panel when its content is taller than the viewport, accounting for safe-area insets and browser chrome. Its controls must remain reachable without horizontal scrolling.

Closing: handle the close button, Escape/native cancel, and optional backdrop activation. Backdrop logic must distinguish the actual outside-panel area from clicks inside the panel; clicking empty panel padding must not unexpectedly close it. Synchronize React state with native dialog close/cancel events. On ordinary dismissal, restore focus to the visible trigger without scrolling the page unexpectedly.

On selecting a normal same-tab navigation link, close and clean up the panel while preserving native link behaviour. Support modified-click/new-tab behaviour without custom router interception. Also close on actual route changes, including browser Back/Forward, and when the viewport crosses to desktop. Route navigation must not restore focus to an old trigger after Next.js has moved focus into the new page. If the trigger becomes hidden on desktop, choose a sensible visible header target instead. Document and verify these distinct focus policies. Same-page Home/anchor activation must also leave the panel closed when appropriate.

Prevent background page scrolling while open, but allow panel scrolling. Save and restore only the body/style properties you change; preserve the original scroll position and any pre-existing styles. Clean up on close, navigation, unmount, and breakpoint changes. Test repeated open/close and React development effect re-runs so they cannot leave a locked page or duplicate listeners. Avoid a permanent global document handler where a scoped dialog event suffices.

Keep the default appearance immediate and restrained. Do not add GSAP or elaborate slide transitions. If a small CSS transition is used, honour reduced motion and do not delay focus or cleanup until an animation event that might never fire.

Preserve a usable no-JavaScript route to available destinations. A straightforward server-rendered noscript list in the mobile header is acceptable. Do not leave a nonfunctional Menu button as the only navigation fallback. Verify the fallback does not create duplicate visible/tabbable navigation during normal operation.

Extend the guarded gallery with mobile specimens using unique IDs, safe local fixtures, and long-content examples. Ensure any gallery modal has its own named trigger and does not collide with the real header. Do not make root layout stateful for this preview.

Verify opening, Tab/Shift+Tab containment, Escape, close, backdrop, internal clicks, link selection, same-page activation, route changes, viewport changes while open, repeated cycles, scroll restoration, and no-JS fallback. Check at 320/390/768px and landscape; test iPhone Safari/Android when available. Perform a screen-reader pass if possible; list precise pending checks if unavailable. Use existing interaction test tooling where available, focusing on these behaviours rather than snapshots.

Run npm run check and npm run build. Recheck desktop navigation and the production preview guard. Update navigation.md and docs/progress.md with actual results and known limitations. Suggested commit: feat: add accessible mobile navigation.
```

**Acceptance checks:**

- [ ] Menu and Close menu have clear names and comfortable touch targets.
- [ ] Focus enters the panel and remains inside while it is modal.
- [ ] Background interaction and scrolling are blocked, while the panel itself can scroll.
- [ ] Every close path restores usable focus and removes scroll locking.
- [ ] Resizing to desktop while open leaves no invisible modal or locked page.
- [ ] Navigation works without callback hacks that break modified clicks.
- [ ] Repeated open/close causes no duplicate event handling or hydration warnings.
- [ ] Reduced motion and the no-JavaScript fallback are usable.

## Step 17 — Build the footer

**Goal:** Provide consistent company identity, useful navigation, and approved contact options across pages.

**Before starting:** Step 16 is reviewed and merged. Start `feature/17-footer` from updated `main`. Inspect the content/asset inventory from Step 2.

Working contact details from our plan are **+94 768098068**, **zatroz.co@gmail.com**, Instagram handle **zatroz.co**, and LinkedIn display name **Zatroz**. These are inputs awaiting launch confirmation, not proof of approved public links. An exact LinkedIn URL cannot be derived from a display name. Do not guess it.

### Copy into Cursor

```text
Execute Step 17 only: implement Zatroz's responsive footer.

Read the session instruction, approved brand/contact inventory, route-readiness policy, existing navigation module, design tokens, and SiteShell footer slot. Keep the footer a Server Component unless a specific essential interaction proves otherwise; ordinary links do not need client state.

Create or update:
- src/components/layout/site-footer.tsx.
- A minimal public brand/contact configuration module if not already present.
- src/app/layout.tsx to pass the footer into SiteShell.
- docs/design/footer.md.
- docs/content/brand-and-contact.md where actual verification status needs recording.
- docs/progress.md.

Use a charcoal background with inverse text and tested link/focus colours. Align with the shared Container and section spacing. Compose a responsive grid: identity/short approved description, main destinations, services, and contact/social information. Stack naturally on phones. Use ordinary lists and headings, and label footer navigation distinctly from primary navigation. Avoid accordion-only footer content; these short lists can remain visible.

Use the approved logo variant suited to a dark background without arbitrary recolouring. If none exists, use the documented plain Zatroz text fallback. Do not redraw or stretch the logo. An oversized static wordmark is optional only when supplied assets and layout support it; never let decorative branding cause horizontal overflow or compete with readable links.

Share navigation destinations with the header. Include only implemented, public-ready routes in the actual footer. This includes policies: do not link to nonexistent /privacy or /terms and do not invent their legal text. The gallery should show the planned complete footer with noninteractive labels for unfinished routes. Record those omissions as launch blockers to resolve at their later page steps.

Handle contact information with explicit confirmation status. If the repository marks the phone/email as approved, render readable phone and email labels with properly formatted tel/mailto destinations. If WhatsApp use of that business number is confirmed, its URL can use the international digits without +, spaces, or a leading local zero: https://wa.me/94768098068. Keep any generic prefilled message free of visitor information and URL-encode it. Do not infer WhatsApp availability solely because a telephone number exists.

Only render exact approved social URLs. If Instagram's profile URL or LinkedIn's exact company URL is missing/unconfirmed, omit that live link and record the missing input. Do not render empty anchors, href=#, guessed profiles, or unusable icon-only links. Use visible platform names or clear accessible names. Open links in the same tab by default; if a new tab is deliberately selected, signal it and set appropriate rel.

Keep contact configuration public-safe and centralized so Step 18 can extend it. Never move raw approval evidence, personal founder contact details, credentials, or confidential documents into client-importable modules or public assets. Distinguish confirmation metadata used internally from the public fields actually rendered.

Include a simple copyright line using Zatroz as the brand, without inventing a registered company name or legal status. Choose and document a server/build-time year strategy; do not add a client component just to render a year. Note that a statically generated year needs regeneration after a year change. Do not add unsupported partner badges, certifications, guarantees, office addresses, response-time promises, newsletter forms, or client claims.

An optional Back to top link may use a real stable header/top target and native scrolling. Do not add forced smooth scrolling or a decorative floating control. Check that the sticky header does not obscure its target. If it adds no value to the current short starter, defer it and document the choice.

Extend the guarded gallery to show a complete labelled footer specimen, plus missing-social/long-email states. Avoid a second global contentinfo landmark in the specimen: make the presentational footer body reusable so the actual SiteFooter owns the footer landmark while the gallery can use a neutral wrapper.

Verify stacking at 320/390/768/1440px, long email/URL wrapping, contrast on dark surfaces, keyboard focus, link names, and actual destinations. Do not activate phone/email actions or send messages as a test; inspect their href values and give manual device checks. Verify no broken internal links, no guessed socials, and no duplicated landmark names. Run npm run check and npm run build and verify the gallery guard.

Update footer.md, progress, and a concise launch-content gap list. Suggested commit: feat: add responsive site footer.
```

**Acceptance checks:**

- [ ] Footer uses one shared source for navigation and contact values.
- [ ] Charcoal sections have readable body text, links, and focus indicators.
- [ ] Phone/email/WhatsApp links appear only with the appropriate confirmed details.
- [ ] No social URL or legal claim has been guessed.
- [ ] Missing policy pages remain explicit launch tasks.
- [ ] Mobile layout wraps long text without clipping or horizontal scrolling.
- [ ] The actual page has one footer landmark; gallery specimens do not add confusing global landmarks.

## Step 18 — Create the shared content structure

**Goal:** Put services, projects, founders, FAQs, company details, and navigation into typed, maintainable content records before building the homepage sections.

**Before starting:** Step 17 is reviewed and merged. Start `feature/18-content-structure` from updated `main`. Reuse the navigation, route, and contact records created in Steps 15–17.

### Proposed content model

| Record     | Important fields                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------------------------ |
| Site       | Brand name, approved description, CTA labels, approved logo assets                                           |
| Contact    | Display text, canonical destination/value, confirmation state, approved social URLs                          |
| Route      | Stable key, canonical path, implementation state                                                             |
| Navigation | ID, label, route key, order, child references                                                                |
| Service    | Stable ID, one of six approved slugs, title, draft/approved copy, summary, deliverables, related project IDs |
| Project    | ID, slug, title, work status, actual contribution, story fields, media, approved links, publication state    |
| Founder    | ID, approved name/role/bio, portrait, approved professional URLs, publication state                          |
| FAQ        | ID, question, answer, optional service relationship, publication state                                       |
| Media      | Public path, dimensions where known, alt text, optional caption, approval state                              |

Keep **work status** separate from **publication state**. A prototype can be approved for publication; a client project may still be a private draft. Route implementation is a third, separate concern.

### Copy into Cursor

```text
Execute Step 18 only: create and integrate the shared Zatroz content structure.

Read the session instruction, existing content/asset inventories, scope, sitemap, decision register, and the actual configuration and components from Steps 15–17. Inspect before changing; preserve working navigation behaviour and public field names where practical.

Create focused typed content files under src/content/, shared types where genuinely useful under src/types/, and a small server-only access layer if needed. Suggested domains are site, services, projects, founders, FAQs, media, and navigation. The exact number of files should follow the content size. Do not create a CMS, database, admin interface, markdown renderer, MDX pipeline, generic repository framework, or API.

Consolidate the existing navigation/contact records into one authoritative source per domain. Retain the route registry under src/config/routes.ts if that is already clear. Have navigation reference route keys instead of repeating string URLs throughout components. Update imports deliberately; do not leave two independently maintained copies. Keep pure route-matching helpers separate from content records.

Use explicit TypeScript types/unions and satisfies where suitable. Define these different states:
- publicationState: draft, approved, or archived.
- project workStatus: client-work, live-product, prototype, or research-concept.
- route implemented: true/false based on actual working pages, not planned URLs.
Document that approved is a founder/content-owner decision, not an automatic result of successful compilation.

Service slugs must be the six canonical values in this pack. Seed exactly six service records with stable IDs, names, and conservative draft summaries based on the plan. Leave detailed future service-page copy as structured empty/draft fields where unavailable. Do not turn the service list into a promise of capabilities that the founders have not confirmed. Preserve any existing genuinely approved records rather than replacing them with these drafts.

For project records, include honest work status, contributors, Zatroz/founder contribution, problem, approach, deliverables, verified outcomes, media, and public links. Do not silently relabel founder or competition work as Zatroz client work. A missing result is not zero and must not become an invented percentage. Use an empty project collection if no material has been supplied; document the gap. At most create clearly labelled draft records from actual supplied evidence. Do not seed fictional customer stories.

For founder records, do not invent the three founders' missing names or roles. Only use supplied identities and public-approved details. Represent missing founder profiles in the content inventory rather than publishing Person 2/Person 3 cards. Empty collections or draft records are valid when evidence is missing.

For FAQs, seed a small set of plainly labelled draft questions appropriate to enquiries and scope, but do not promise delivery deadlines, prices, support terms, or ownership conditions that have not been approved. Keep answers as structured plain text; do not use dangerouslySetInnerHTML or arbitrary embedded HTML for convenience.

For media, use only supplied public-approved assets with real paths. Record width/height from actual files when available, and require meaningful alt text or an explicit decorative choice. Do not invent screenshot paths to satisfy a type. Keep licences/permissions references in the appropriate documentation; never put confidential evidence in shipped content records. Store private source material outside public/ and outside the repo if it may later become public.

Keep company contacts in their existing confirmed/unconfirmed states. A public contact projection should include only approved values. Do not derive a LinkedIn URL from a name. Route availability and content approval must both be satisfied before rendering an internal link to a service/project/policy page. Implement small selectors for this rule rather than spreading it across header and footer.

Expose server-side functions such as getPublishedServices, getPublishedProjects, getPublishedFounders, getPublishedFaqs, and getPublicNavigation, with names matching existing conventions. Return narrow immutable/read-only public projections where useful. A published-content selector may list approved content, but a link selector must additionally require the destination to be implemented. Document the distinction so approved-but-unbuilt records cannot create broken links.

Mark the content aggregation/access module server-only where it contains drafts or editorial fields. Client navigation should receive only serializable public navigation data prepared on the server. Keep shared public TypeScript types in a safe type-only module. Do not import the whole content store into a client component, re-export server modules through a shared barrel, or use browser-side filtering as the publication boundary.

Create a deterministic content validator and a documented npm run validate:content command using existing compatible tooling or a minimal compatible runner. It must not connect to the internet, read credentials, or need a database. Add it to the existing check chain if it is fast and reliable. Avoid a new heavy validation/test stack. Ensure the runner actually executes the checks with the installed Node/TypeScript setup; do not merely add a script name that cannot load its imports.

Validate unique IDs/slugs, allowed service slugs, valid route references, consistent canonical paths, and relationships such as relatedProjectIds. For approved public records, validate required publishable fields, usable media references, and allowed URL protocols. Permit https for web destinations, approved mailto/tel for corresponding contact fields, and internal paths for internal links; reject javascript/data URLs and malformed entries. Do not use one URL rule indiscriminately for all field types.

Drafts can be incomplete, with clear warnings where appropriate. Structural corruption such as duplicate IDs or invalid references should fail validation even in drafts. Approved records with missing mandatory fields must fail with a record ID and field name, without exposing private values. A deliberate empty portfolio/founder collection at this stage is a documented content gap, not a validator crash. A route intentionally unimplemented is a recorded readiness warning, not permission to publish a link.

Use a few isolated synthetic validation fixtures, excluded from production exports, to prove duplicate slugs, unknown references, invalid URLs, and incomplete approved content are rejected while valid records pass. Do not mutate real content to test errors or include fake fixtures in the website. Reuse the existing test harness if available, or add a small compatible runner with no unnecessary dependencies.

Update header/mobile/footer to consume the public projections and keep their behaviour unchanged. The guarded gallery can show clearly labelled safe demo projections or draft examples, but no confidential material. No homepage sections, service pages, project routes, or founder cards are built in this step.

Create docs/content/content-model.md and docs/content/editing-guide.md explaining field meanings, relationships, file locations, draft versus approved versus implemented states, how to add a record, how to approve real content, how to enable a completed route, and how to run validation. Update the inventory and progress with actual remaining inputs. Document that the final launch requires the intended navigation/policy destinations and sufficient approved content; the current sparse starter is not launch-ready.

Run npm run validate:content, npm run check, and npm run build. Smoke-test desktop disclosure, mobile open/close, footer links, and the gallery guard after the refactor. Verify no draft editorial fields appear in client props, HTML, or client bundles through accidental imports; do not claim this proves all sensitive-data risks are solved. Report actual checks and pending manual review.

Suggested commit: feat: add typed shared content structure. Stop here; Step 19 is the homepage hero.
```

**Acceptance checks:**

- [ ] There is one authoritative definition for routes, navigation, services, and contacts.
- [ ] Work status, publication approval, and route implementation are separate.
- [ ] Six service records use the exact agreed slugs.
- [ ] Missing founders/projects are honest gaps, not fabricated public records.
- [ ] Approved records are validated; incomplete drafts do not masquerade as approved content.
- [ ] Broken relationships, duplicate IDs/slugs, and unsafe URL protocols are detected.
- [ ] Draft/internal fields are excluded from public projections and client imports.
- [ ] Content validation actually runs and has meaningful failure-case checks.
- [ ] Header, mobile menu, and footer still work after consolidation.

## Verification and Git checkpoints

For each step, use the existing scripts and record actual results:

```sh
npm run check
npm run build
```

Step 18 also introduces:

```sh
npm run validate:content
```

Use `npm run dev` for local `/dev/ui` checks. After a successful build, stop the development server and use `npm run start` to confirm the production starter works and `/dev/ui` remains unavailable. Do not change `NODE_ENV` in `.env.local` to simulate modes.

Begin the selected step from a clean, updated branch after the previous PR is merged:

```sh
git status
git switch main
git pull --ff-only origin main
git switch -c feature/15-desktop-navigation
```

After reviewing implementation and verification:

```sh
git diff --stat
git diff
git add YOUR_REVIEWED_FILE_PATHS
git diff --cached
git commit -m "feat: add desktop navigation"
git push -u origin feature/15-desktop-navigation
```

Replace the branch/message for Steps 16–18. `YOUR_REVIEWED_FILE_PATHS` is a placeholder; stage the actual reviewed files, including relevant docs and lockfile changes, without unrelated work or private data. Open and review a PR, merge it, and return to updated `main` for the next step. Do not force-push around an unexplained remote conflict.

## Focused recovery prompt

```text
There is a problem in the current Zatroz step: [describe it and include a non-sensitive error or screenshot]. Read this step's requirements, project rules, and the current diff. Reproduce the problem where possible, explain its cause in easy English, and make the smallest related fix. Preserve shared content contracts, accessibility semantics, user changes, and installed versions. Do not hide the issue with fake links, removed focus handling, disabled validation, leaked drafts, or a relaxed preview guard. Rerun affected checks and stop within this step.
```

## Completion checklist

- [ ] Desktop navigation and Services disclosure are implemented and checked.
- [ ] Mobile menu has reliable focus, closing, scrolling, and breakpoint cleanup.
- [ ] Footer uses approved content and valid destinations.
- [ ] Shared content is typed, validated, and separated from internal/draft material.
- [ ] Public-ready destination filtering is shared rather than duplicated.
- [ ] Full planned designs can be reviewed in the development gallery without broken links.
- [ ] Missing content and unbuilt destinations remain visible in progress documentation.
- [ ] All four steps have reviewed Git checkpoints.

Next request: **“Give me the complete Step 19 prompt file: homepage hero.”**
