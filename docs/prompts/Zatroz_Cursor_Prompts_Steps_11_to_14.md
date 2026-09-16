# Zatroz — Cursor AI prompt pack: Steps 11–14

Prepared for Divejikan and the Zatroz founding team · 16 September 2026

This pack continues the 72-step roadmap and the Steps 01–10 prompt file. It creates the visual and component foundation for Zatroz. Execute one numbered prompt at a time, review the result, and commit that step before moving forward.

| Step | Work                                                             | Suggested branch             |
| ---- | ---------------------------------------------------------------- | ---------------------------- |
| 11   | Design system: colours, typography, spacing, focus, surfaces     | `feature/11-design-system`   |
| 12   | Reusable UI: buttons, links, badges, cards, containers, headings | `feature/12-ui-components`   |
| 13   | Accessible form components and local interaction examples        | `feature/13-form-components` |
| 14   | Main website layout and shared page structure                    | `feature/14-site-layout`     |

Navigation is Step 15, mobile navigation Step 16, and the footer Step 17. The complete Contact page and enquiry form come later. Database creation remains Steps 44–46. This pack does not move those features ahead of their agreed order.

## Before starting

Open the existing `zatroz-website` root in Cursor. Do not create a second application. The repository should already contain the Next.js App Router starter, TypeScript, Tailwind, npm lockfile, quality scripts, planning documents, Cursor rules, and safe environment setup from Steps 01–10.

Check `docs/progress.md`, the Git branch, and uncommitted changes. Resolve relevant unfinished setup before implementation. If the actual repository differs from this guide, Cursor should inspect it and adapt the smallest necessary change, explaining the difference.

Paste the session instruction below once in each new Cursor chat, followed by the selected numbered prompt. Alternatively, attach this file and say: **“Follow the session instruction and execute Step 11 only.”**

After every step, review the desktop and mobile appearance yourself. Passing a build does not prove that the page looks right or works with a keyboard.

### Session instruction — use in each new Cursor conversation

```text
You are my senior frontend engineer and patient mentor for the Zatroz website. I am learning React and reviewing the code in Cursor.

Read existing AGENTS.md, .cursor/rules/, the relevant planning documents, and the installed package versions before editing. Execute only the numbered step I select. Explain the short plan, then implement the authorized local changes. Preserve existing code, user edits, Git history, and working configuration.

Use our Next.js App Router, React, TypeScript, Tailwind, and npm setup. Reuse its lockfile and installed versions. Do not upgrade the framework, install a component framework, or rewrite the project for this task. Add a dependency only when it solves a concrete need that the existing stack cannot reasonably handle.

Treat docs/planning/decision-register.md and approved project documents as the source of truth. Use sensible defaults for reversible implementation details. Record missing business facts instead of inventing them. Do not turn proposed decisions into approved claims.

Build only the current foundation. No navigation/footer implementation before their steps, live enquiry submission, database calls, authentication, analytics, marketing claims, GSAP, or deployment in this pack. Never print or read private environment-file contents.

Keep server-rendered components where possible. Put browser state, effects, and handlers in small client boundaries. Do not mark the entire layout or preview page as a client component merely for one example. Never pass an ordinary event callback from a Server Component into a Client Component.

Use semantic HTML, typed props, visible keyboard focus, and the shared design tokens. Explain unfamiliar choices in easy English. Do not claim full accessibility conformance based on an automated scan.

Run relevant existing checks and inspect the changed experience when tools permit. Report checks as Passed, Failed, or Not run with evidence. If browser access is unavailable, provide an exact manual checklist. Do not invent test results or silently disable checks to pass them.

Finish with: what changed and why; files changed; checks and results; remaining limitations; a suggested commit message; and the next step number. Prepare the checkpoint but let me review before committing/pushing unless I explicitly authorize you to do it. Stop after the selected step.
```

## Common implementation decisions

- Visual direction: warm-white editorial pages, charcoal feature sections, and restrained orange accents. Use original Zatroz content and supplied assets.
- Keep the site in its designed light presentation, with explicit dark sections. Do not add an automatic dark theme or theme toggle now.
- Use Manrope as the main font. IBM Plex Mono is optional and can wait until a real use case exists.
- Keep type and spacing responsive. Content should determine height; avoid fixed viewport-height sections and clipped headlines.
- Use one set of semantic tokens, rather than independent hardcoded colours in each component.
- Form fields will initially be designed on light/white surfaces. A dark section can contain a light form panel; a complete inverse form theme is not required in this pack.
- Preview examples must be labelled as examples. Do not create fictional customer testimonials, success metrics, or project results to fill them.

### Development preview contract

Step 11 creates `/dev/ui` as a local component preview. Steps 12–14 extend it. Use a server-side guard that calls `notFound()` unless `process.env.NODE_ENV === 'development'`. Put the guard before rendering any preview content. Add noindex metadata as a secondary measure, and omit this route from navigation and future sitemaps. Noindex alone is not access control. The preview must contain no private information regardless of its guard.

Check the preview in `npm run dev`, then confirm it is unavailable in `npm run build` followed by `npm run start`. A hosted preview deployment generally runs a production build, so this local development gallery should also be unavailable there. Do not introduce a public environment flag that accidentally exposes it. This guard uses the standard environment value; do not set `NODE_ENV` manually in `.env` files. See [Next.js notFound](https://nextjs.org/docs/app/api-reference/functions/not-found).

### Checks used throughout

Use the scripts created in Step 7:

```sh
npm run check
npm run build
```

Use `npm run dev` for local visual checks, and `npm run start` after a successful build for the production guard check. Stop one server before starting another on the same port. Record the actual URL and port used.

## Step 11 — Create the design system

**Goal:** Establish reusable colours, typography, spacing, layout widths, surface treatments, focus styles, and motion limits.

**Prerequisites:** Steps 01–10 are implemented and reviewed. Read the original website plan's colour and typography sections if available, together with `docs/content/brand-and-contact.md` and the architecture documents.

### Baseline colour tokens

These values come from the Zatroz plan. The token names are proposed implementation names; use equivalent existing semantic names if already established.

| Token                      | Value                 | Purpose                                                   |
| -------------------------- | --------------------- | --------------------------------------------------------- |
| `brand`                    | `#FF3B10`             | Main accent; primary button with dark text                |
| `brand-hover`              | `#FF572E`             | Bright button hover with dark text                        |
| `brand-strong`             | `#C42B0A`             | Small links on light surfaces; optional white-text button |
| `brand-soft`               | `#FFF0EA`             | Quiet selected surface                                    |
| `ink`                      | `#111111`             | Heading text and charcoal sections                        |
| `canvas`                   | `#F7F5F2`             | Page background                                           |
| `surface`                  | `#FFFFFF`             | White panels and controls                                 |
| `surface-muted`            | `#EEEAE4`             | Quiet background areas                                    |
| `surface-inverse`          | `#1C1C1C`             | Panels within dark sections                               |
| `border-subtle`            | `#D8D3CD`             | Decorative separators                                     |
| `border-control`           | `#817B74`             | Meaningful input boundary on light surfaces               |
| `border-inverse`           | `#3A3A3A`             | Decorative dark separators                                |
| `text-body`                | `#3F3D3A`             | Body copy on light surfaces                               |
| `text-muted`               | `#68645F`             | Secondary copy on light surfaces                          |
| `text-inverse`             | `#FFFFFF`             | Headings on charcoal                                      |
| `text-inverse-body`        | `#D6D6D6`             | Body copy on charcoal                                     |
| `text-inverse-muted`       | `#A8A8A8`             | Secondary copy on charcoal                                |
| `success` / `success-soft` | `#166534` / `#F0FDF4` | Success message text / surface                            |
| `warning` / `warning-soft` | `#854D0E` / `#FFFBEB` | Warning message text / surface                            |
| `error` / `error-soft`     | `#B91C1C` / `#FEF2F2` | Error message text / surface                              |

Dark text on the primary orange is intentional. White on `#FF3B10` is about 3.57:1, so it fails normal text contrast; dark `#111111` on that orange is about 5.29:1. Check actual pairs and states, not isolated hex values. Normal text needs at least 4.5:1; eligible large text needs 3:1. See [W3C text contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Meaningful control boundaries need suitable contrast against adjacent colours; pale decorative borders are insufficient for identifying white inputs. See [W3C non-text contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

### Copy into Cursor

```text
Execute Step 11 only: implement the Zatroz design system.

Read the session instruction, common decisions, colour table, development preview contract, existing styles, root layout, package versions, and planning documents. Reuse or carefully extend existing tokens. Do not create a second competing design system.

Create or update:
- src/app/globals.css and, if helpful, one imported src/styles/tokens.css.
- src/app/layout.tsx for font attachment only where needed.
- src/app/dev/ui/page.tsx for a guarded local design preview.
- docs/design/design-system.md.
- docs/design/contrast-checks.md.
- docs/progress.md, adding Steps 11–14 without replacing earlier progress.

Implement the full baseline colour table in this prompt pack. Use semantic names, keep raw colour definitions centralized, and document allowed foreground/background pairs. A dark section needs inverse text tokens; do not place light-surface link colours on dark backgrounds without verification. Define visible focus styles with appropriate contrast on light, dark, and orange surfaces. Use outline/offset or another robust treatment; never remove the outline without a replacement.

Inspect the Tailwind major version before configuration. For a CSS-first version, map the tokens through its supported theme mechanism; for an older installed version, extend the existing configuration appropriately. Do not migrate versions. Avoid dynamically constructed utility names that will not be detected. Preserve the current working Tailwind imports.

Add Manrope through the supported Next.js font setup. Prefer approved local WOFF2 assets with their licence if already supplied. Otherwise use the framework's Google-font integration if build-time access is available, recording its requirement. Do not invent a font file or claim a download succeeded when blocked. If unavailable, retain a documented system-font fallback and mark font installation pending. Do not add IBM Plex Mono or language fonts yet. Retain relevant licences for any distributed local files.

Typography: one font family; weights approximately 400/500/600/700 where supported. Use fluid rem-based sizes with sensible min/max values: H1 about 40–48px on small screens and 72–88px on large screens; H2 30–36px to 44–56px; H3 22–26px to 26–32px; body 16–18px with line height about 1.6; supporting text about 14px. Treat those pixel values as reference sizes at normal zoom, not fixed limits that prevent text scaling. Use narrow heading tracking and normal body tracking. Visual size must not force the HTML heading level. Check long headings and browser zoom; no hardcoded line breaks or fixed text heights.

Spacing: establish a small rem-based scale corresponding to roughly 4, 8, 12, 16, 24, 32, 48, 64, 80, 96, and 128px at the normal root size. Use fluid section spacing about 48px on small screens through 96px on wide screens. Define a max content width near 1280px, reading width around 65ch, and gutters around 16px on narrow screens rising to 24–32px. Container implementation is Step 12; define its tokens now.

Define a restrained radius scale (roughly 6/12/20px), one or two subtle shadows, and simple z-index roles with room for future header/menu layers. These are implementation defaults, not requirements to round or elevate every surface. Define short transition durations around 150/220ms for appropriate state changes. Avoid transition: all, smooth-scroll defaults, entrance animations, and global animation suppression that could break future functional states. Document reduced-motion behaviour for any decorative transitions used now.

Create the /dev/ui page under the development preview contract. Show labelled swatches, type specimens, spacing examples, readable light/dark surface pairs, and focusable native controls for focus inspection. This is a token preview; do not implement the reusable Button/Card/Form APIs yet. Use one H1 and logical headings. Keep its content readable without JS. Do not expose secrets or private assets in this route.

Compute the actual contrast ratios for intended text and control pairs and record foreground, background, ratio, role, and pass/fail target in contrast-checks.md. Include brand button normal/hover, small links, muted body text, inverse copy, status pairs, control border, and focus treatment. Verify actual CSS matches the table. Preserve the primary brand colour; if a state fails, adjust its paired foreground or semantic state token and explain the change.

Inspect /dev/ui and the starter at 320, 390, 768, and 1440px plus 200% zoom and reduced motion. Check readable wrapping, focus, no horizontal overflow, and no forced dark-theme override from scaffold CSS. Verify the development guard in a production build. Run npm run check and npm run build; report actual results and font/network limitations honestly.

Update design docs and progress. Do not build the real hero, navigation, footer, form, or other marketing pages. Suggested commit: feat: establish Zatroz design system.
```

Tailwind's theme mapping depends on the installed version; use [the official theme guide](https://tailwindcss.com/docs/theme) for the current CSS-first mechanism. Next.js supports optimized local and Google fonts; see [its font guide](https://nextjs.org/docs/app/getting-started/fonts).

**Manual acceptance checks:**

- [ ] Orange, warm white, charcoal, and text tokens match the plan.
- [ ] Small white text is not used on the bright orange button background.
- [ ] Text wraps at 320px and remains usable when enlarged.
- [ ] Light and dark examples have clearly visible keyboard focus.
- [ ] Manrope actually renders, or the fallback is explicitly recorded.
- [ ] The preview is available in development and unavailable under `npm run start`.
- [ ] Quality checks and build pass, or a concrete blocker is recorded.

## Step 12 — Create reusable UI components

**Goal:** Build a small set of dependable primitives that later pages can compose.

**Prerequisites:** Step 11 is reviewed and merged. Its tokens and preview exist. Create `feature/12-ui-components` from updated `main`.

### Component contract

| Component        | Purpose                          | Main requirements                                                  |
| ---------------- | -------------------------------- | ------------------------------------------------------------------ |
| `Button`         | Perform an action                | Native button; primary/secondary/quiet; sizes; disabled/loading    |
| `ButtonLink`     | Navigate with button styling     | Real link; shared appearance; no pretend disabled button semantics |
| `TextLink`       | Inline/navigation text link      | Visible affordance; internal and external destinations             |
| `Badge`          | Display a short label            | Static text; not an interactive control or live announcement       |
| `Card`           | Group related content            | Simple semantic wrapper; no automatically clickable div            |
| `Container`      | Set width and gutters            | Default/reading widths; responsive tokens                          |
| `Section`        | Set surface and vertical spacing | Light/dark/muted; semantic choice; no implicit main                |
| `SectionHeading` | Compose heading and introduction | Explicit heading level, optional eyebrow and description           |

### Copy into Cursor

```text
Execute Step 12 only: implement Zatroz's reusable UI primitives.

Read the session instruction, design-system.md, contrast-checks.md, folder-structure.md, existing components, and local preview. Use the component contract in this pack. Preserve the Step 11 tokens.

Create focused files under src/components/ui/ for Button, ButtonLink, TextLink, Badge, Card, Container, Section, and SectionHeading, using existing kebab-case conventions. Keep the public API small, typed, and understandable. Create docs/design/ui-components.md with import paths, props, examples, supported surfaces/states, and misuse notes.

Use native HTML props where appropriate and expose className without allowing overrides to silently destroy semantics. Avoid a complicated polymorphic/asChild system. Reuse existing class-name helpers; a small local utility is enough if none exists. Do not install a UI kit, icon pack, variant framework, or Storybook just for these primitives. Use explicit static variant maps so Tailwind detects all styles.

Button: actual button element, default type="button", explicit type="submit" supported. Implement primary, secondary, and quiet variants, normal and compact sizes with generous hit areas, disabled, and loading. Primary uses brand background with ink text. A loading button must keep a meaningful accessible label, expose busy status, prevent repeated activation, and avoid noticeable width shift. Preserve the caller's disabled state. Keep a loading spinner decorative; provide readable loading text. Ensure an async action can announce status in its own status region later. Respect reduced motion for any spinner. Do not globally disable every button because one is loading.

ButtonLink: link semantics for navigation, using Next.js Link for internal destinations and an ordinary anchor for external URLs as appropriate. Share presentation definitions with Button without nesting an anchor and button. Do not offer a misleading disabled or loading link API; unavailable navigation should be omitted or rendered as clearly labelled static content by its caller. No automatic new tab for every external link; if requested, apply appropriate rel and a visible/accessible new-tab cue. Do not use href="#" for pretend navigation examples.

TextLink: clear visual link affordance, especially in body text; use the strong orange on approved light surfaces and a tested inverse treatment on dark surfaces. Keyboard focus must remain visible. Support accessible names for links whose visible content is only an icon; prefer text labels in this foundation.

Badge: neutral, accent, success, warning, and error examples with readable text. No role="status" or click handler by default. Project status labels are future content, not evidence created here.

Card: neutral presentation with optional semantic article/div choice, padding, border and radius variants only where useful. A card is not automatically focusable or clickable. If an example needs navigation, use an explicit link inside; never nest controls inside an enclosing link.

Container: default max width near 1280px and reading variant near 65ch; consistent fluid gutters; min-width handling so grid/flex children can shrink; allow full-bleed section backgrounds outside the container. Document whether Container owns only horizontal space to avoid double padding.

Section: spacing and light/dark/muted surface variants using tokens. Use section only for a thematic region with an accessible heading; offer div for purely visual grouping. Do not add main, arbitrary heading levels, or page-specific copy. Document foreground tokens for each surface so children do not inherit unreadable colours.

SectionHeading: require a deliberate heading level (h1/h2/h3 within the supported simple API), separate semantic level from visual scale, optional eyebrow and description, and optional id. Page authors remain responsible for one H1 and logical heading hierarchy. Support long text and no description without leaving empty elements.

Keep presentational components server-compatible. Loading/disabled visual props alone do not require hooks. Interactive preview demonstrations belong in a small src/components/dev/ui-interactions.tsx Client Component, imported only by the guarded preview. Respect the installed React version's ref conventions; keep refs usable where needed without unnecessary compatibility wrappers.

Extend /dev/ui to show all variants, supported light/dark contexts, long labels, narrow layouts, disabled/loading examples, and keyboard focus. Real button examples can increment a clearly labelled local demo counter; no fake network request. Test links only to existing routes or real in-page targets. Do not mutate the actual homepage into a component gallery.

Verify that default buttons inside a demo form do not submit, explicit submit buttons do, disabled/loading actions cannot be repeatedly activated, links retain native navigation behaviour, and every demo has an accessible name. Inspect 320/390/768/1440px, keyboard Tab/Shift+Tab/Enter/Space as appropriate, 200% zoom, and reduced motion. Document any surface combination intentionally unsupported. Use existing test tools if present for meaningful behaviour checks; do not add a large test stack for snapshots or implementation-mirroring tests.

Run npm run check and npm run build and verify the preview guard still works. Update ui-components.md and docs/progress.md with actual results. Do not build navigation, footer, hero, dialogs, FAQ, or service/project-specific cards in this step. Suggested commit: feat: add reusable UI components.
```

**Manual acceptance checks:**

- [ ] Actions are buttons; destinations are links.
- [ ] Buttons show visible hover and focus states without layout movement.
- [ ] Loading and disabled examples cannot trigger duplicate actions.
- [ ] Long labels wrap without cutting off content.
- [ ] Cards do not create nested links/buttons or unnecessary tab stops.
- [ ] Surface variants preserve readable text and focus.
- [ ] Token changes propagate to the components.
- [ ] Quality checks and the production guard still pass.

For Zatroz, prefer standalone control hit areas of at least 44×44 CSS pixels. This is a project usability target; WCAG 2.2 AA's target-size criterion uses a 24×24 minimum with specified spacing and other exceptions. Inline links need contextual evaluation rather than forced 44px boxes. See [W3C target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

## Step 13 — Create accessible form components

**Goal:** Build reusable form controls, error presentation, and status presentation before the real enquiry form is assembled.

**Prerequisites:** Step 12 is reviewed and merged. Reuse its Button and tokens. Create `feature/13-form-components` from updated `main`.

### Planned form building blocks

| Component       | Responsibility                                                               |
| --------------- | ---------------------------------------------------------------------------- |
| `TextInput`     | Native text/email/tel input with consistent states                           |
| `TextArea`      | Native resizable multiline control                                           |
| `SelectField`   | Native single-select with an accessible label and empty option               |
| `CheckboxField` | Native checkbox with a clickable visible label                               |
| `FormField`     | Label, required/optional wording, hint, and error association                |
| `ErrorSummary`  | Focusable summary with links to invalid controls                             |
| `InlineStatus`  | Visible idle/loading/demo-success/error feedback with suitable announcements |

Use persistent visible labels, and explain errors in words rather than colour alone. See [W3C control labelling](https://www.w3.org/WAI/tutorials/forms/labels/) and [W3C form validation](https://www.w3.org/WAI/tutorials/forms/validation/).

### Copy into Cursor

```text
Execute Step 13 only: implement accessible form primitives and local demos.

Read the session instruction, design/component docs, existing Button API, and future enquiry requirements in the plan. Follow the building-block table in this pack. This task has no real enquiry submission, storage, email, analytics, or external requests.

Create focused files under src/components/forms/ for TextInput, TextArea, SelectField, CheckboxField, FormField, ErrorSummary, and InlineStatus. Reuse a suitable existing equivalent instead of duplicating it. Document the component API and responsibility boundaries in docs/design/form-components.md.

Use native controls and typed native attributes. Support name, id, required, disabled, readOnly where the native control supports it, autoComplete, inputMode, value/defaultValue, onChange, and refs as appropriate. Do not pass invalid attributes such as readOnly to select/checkbox indiscriminately. Do not switch a component between controlled and uncontrolled behaviour. Avoid a custom dropdown, masked phone field, custom checkbox role, form library, or validation dependency at this stage.

Keep IDs stable and unique across server rendering and hydration. Prefer explicit caller-provided IDs in examples. Associate visible labels with control IDs. Document one simple way FormField shares the control ID and described-by IDs with its child; avoid opaque cloneElement magic. If a helper or context is necessary, keep the API clear and test duplicate instances.

FormField must render a visible label, optional hint, and optional textual error. Include readable required/optional wording. Merge caller-provided aria-describedby with existing hint/error IDs, deduplicate tokens, and reference only elements actually rendered. Set aria-invalid only when an error applies. Label clicks should focus or toggle the intended control. Do not rely on placeholder text as a label, and do not announce all inline errors as separate alerts on every keystroke.

TextInput and TextArea: readable 16px-or-larger normal mobile input text, comfortable height/padding, control-border token, visible focus, and distinct invalid/disabled/read-only states. Preserve read-only text access where supported. Allow textarea vertical resizing and sensible minimum height; long content must not break the page. Use type=email and suitable autocomplete in examples; do not apply a restrictive email regex or alphabet-only name rule.

SelectField: native select, empty prompt option with an empty value, clear required behaviour, and labels that fit narrow screens. Support native keyboard operation. CheckboxField: actual input and associated clickable text; visually small checkbox may sit within a generous label hit area. Use fieldset/legend for related control groups in examples. Do not introduce mandatory marketing consent or a consent policy claim.

ErrorSummary: render only when there are errors, include a heading and descriptive field links, and expose a ref/id for programmatic focus. Its container can use tabIndex=-1. Each error link must reach and focus the associated control, not just change a URL without moving focus. Choose one deliberate submit-time announcement/focus strategy to avoid duplicate screen-reader announcements. Do not steal focus while a person is typing or initially loading the page.

InlineStatus: maintain a suitable stable live region in the interactive parent for asynchronous feedback. Use polite status announcements for progress and completion; urgent failures may need an alert but must not compete with a focused ErrorSummary. Explain the chosen behaviour. Icons alone are insufficient. The status component must not decide that an enquiry was saved; the future real form will rely on the server response.

Create a small Client Component local demo under src/components/dev/form-demo.tsx and add it to the guarded /dev/ui gallery. Include name, email, service select with Not sure, a message textarea, and an optional demo checkbox. Use fake example values only. Add a visible heading: Local component demo — nothing is sent or saved.

The demo must prevent all form network submission. Use noValidate on this demo form so browser validation popups do not intercept the custom submit/error-summary flow; retain native required/type attributes and inspect validity as appropriate. On submit, validate required fields and a practical email validity check, focus the error summary once if invalid, preserve all entered values, and allow correction. After a field has been reported invalid, allow its error to clear on correction without showing new errors on every untouched field. Distinguish this demonstration validation from future server-side validation.

For a valid demo, show: Demo validation passed. Nothing was sent or saved. Use explicit demo controls to exhibit a pending state and a failure state without real fetch calls. Retain input on simulated failure. No localStorage, sessionStorage, cookies, console logging of form values, analytics, API route, or database. Keep loading/disabled prevention aligned with Button from Step 12 and make repeated-submit behaviour predictable. Do not clear the form automatically on error.

Check keyboard-only completion, label associations, duplicate IDs, required markers, described-by references, error links, focus after invalid submit, correction without focus theft, disabled/read-only states, and stable layout for long error messages. Inspect mobile widths and, if available, the on-screen keyboard. Run a screen-reader pass with available tools; otherwise provide specific NVDA/VoiceOver manual checks and mark them not run. A static markup inspection alone is not a screen-reader test.

Use existing tests for the important interaction risks if a harness already exists. Avoid snapshot-only tests and do not add a heavy testing stack for this step. Record reproducible manual behaviour checks when no harness exists. Run npm run check and npm run build; confirm the demo is unavailable in production. Update form-components.md and docs/progress.md. Suggested commit: feat: add accessible form components.
```

**Manual acceptance checks:**

- [ ] Clicking each label reaches the correct control.
- [ ] Tab order matches the visible reading order; native selects work with the keyboard.
- [ ] An empty submission produces understandable errors and moves focus once to the summary.
- [ ] Error links focus their matching fields.
- [ ] Correcting a value does not unexpectedly move focus or erase other entries.
- [ ] Required/invalid states and hints are exposed to assistive technology.
- [ ] The demo visibly says nothing is sent or saved, and the Network panel shows no submission.
- [ ] Pending and failure examples preserve sensible input and button states.
- [ ] At 320px and enlarged text, errors and controls fit the page.
- [ ] Screen-reader checks are completed or explicitly listed as pending.

## Step 14 — Build the main website layout

**Goal:** Compose the shared document and content layout so future navigation, footer, and page sections fit into a consistent structure.

**Prerequisites:** Step 13 is reviewed and merged. Create `feature/14-site-layout` from updated `main`.

### Layout ownership

| Layer       | Owns                                                                                   | Must avoid                                        |
| ----------- | -------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Root layout | `html`, `body`, fonts, global CSS, shared shell                                        | Becoming a client component for future menu state |
| `SiteShell` | Skip link, one main landmark, optional future header/footer slots, minimum page height | Repeated/nested main landmarks or fake navigation |
| Page        | Its H1, sections, content, deliberate heading hierarchy                                | A second main wrapper                             |
| `Section`   | Surface and vertical rhythm                                                            | Forcing all content into a fixed height           |
| `Container` | Horizontal gutters and max width                                                       | Preventing full-width section backgrounds         |

### Copy into Cursor

```text
Execute Step 14 only: implement the shared Zatroz page layout.

Read the session instruction, architecture and design docs, the root layout, current home route, development preview, and UI primitives. Use the layout ownership table in this pack. Do not implement navigation (Step 15), mobile menu (Step 16), or footer (Step 17).

Create or update:
- src/components/layout/site-shell.tsx.
- src/components/layout/skip-link.tsx, if separating it improves readability.
- src/app/layout.tsx.
- src/app/page.tsx, keeping only its honest minimal starter content.
- src/app/dev/ui/page.tsx to compose correctly inside the shared shell.
- docs/architecture/page-layout.md.
- docs/progress.md.

Keep the root layout as a Server Component. It should import global styles once, attach the established font, set lang=en, and compose the shell. Preserve existing safe metadata and environment handling; do not overwrite metadata or set a made-up production domain. Full SEO implementation is a later step.

SiteShell must provide a full-page background, a minimum height that fills a short viewport while allowing long pages to grow, one main with id="main-content", and a visible-on-focus Skip to content link before repeated page chrome. Use robust viewport units/fallbacks where needed; do not fix content to 100vh or introduce nested page scrolling. The main region should flex to use spare space. Support optional ReactNode header/footer slots for the future components without creating fake landmarks or empty spacers when they are absent.

For the skip link, use native navigation to the main target and make the target programmatically focusable with tabIndex=-1 where appropriate. Verify focus actually reaches the main content in supported browsers. The skip link must be clearly visible above page content when focused, using the design system. Do not add a global client effect or autofocus on every render. Document that future sticky navigation must not obscure the target or focused controls.

Move/remove existing page-level main wrappers so the home route and development gallery each render inside exactly one main. Ensure each page has one meaningful H1 and a logical hierarchy. The shell must not inject a second H1, navigation role, or promotional copy. Use sections only where they have a proper thematic heading; use div for visual groupings.

Do not put a universal width-constrained Container around main. Full-bleed section backgrounds should span the page, with Container inside each Section. Reuse the same gutters for future header/footer and page content. Document reading-width versus default-width usage. Avoid double padding, overflowing flex/grid children, hardcoded page heights, and clipping overflow to disguise layout bugs.

Keep the homepage a minimal development placeholder, styled with the established components. Do not design its hero early, add links to nonexistent service/contact pages, invent copy, or fill the page with fake cards. Extend the local gallery with a clearly labelled layout specimen showing short content, long paragraphs, a readable narrow section, and a dark full-width section with an inner container. Use demonstration text without business claims. The main gallery guard must remain effective.

Do not add route-transition loaders, custom scrolling, animation providers, theme providers, or layout-wide client state. The future mobile menu's state belongs in a small client component, not this root. Document the exact future insertion points for SiteHeader and SiteFooter and how page components should compose Section, Container, and SectionHeading.

Verify the root and gallery at 320, 375/390, 768, 1024, and 1440px, plus 200% zoom and a 320px-wide reflow check. Inspect short and long content, keyboard skip navigation, exactly one main, logical headings, no horizontal scrolling, no hidden focus, and natural document scrolling. Check that normal page content remains readable with JavaScript disabled; interactive demos may require JS and should not be confused with marketing content.

Run npm run check and npm run build, load the production starter with npm run start, and confirm /dev/ui stays unavailable. Record actual browser/keyboard results and any unrun checks. Update page-layout.md and docs/progress.md with a Steps 11–14 completion summary. Suggested commit: feat: add shared website layout.

Stop here. Next is Step 15: desktop navigation.
```

**Manual acceptance checks:**

- [ ] The root layout stays server-rendered.
- [ ] Home and the gallery each have one main landmark and one H1.
- [ ] The skip link is the first relevant keyboard stop and reaches the content.
- [ ] Full-width backgrounds and inner containers align correctly.
- [ ] Short pages fill the viewport; long pages grow and scroll naturally.
- [ ] No fixed-height wrapper clips content, and no overflow rule hides a defect.
- [ ] Future header/footer insertion points are documented without building them now.
- [ ] Production still hides the local preview and needs no future database/email credentials.

## Git checkpoint for each step

Use your existing Step 5 workflow. Start from updated `main` after the previous step is merged. Substitute the real branch number/name. Inspect `git status` first; keep unrelated changes intact.

```sh
git status
git switch main
git pull --ff-only origin main
git switch -c feature/11-design-system
```

After implementation and checks, review the diff and stage the actual files for this step. `YOUR_REVIEWED_FILE_PATHS` below is a placeholder, not a literal filename.

```sh
git diff --stat
git diff
git add YOUR_REVIEWED_FILE_PATHS
git diff --cached
git commit -m "feat: establish Zatroz design system"
git push -u origin feature/11-design-system
```

Create a pull request, review the code and visual results, and merge it before the next step branch. Do not stage `.env.local`, private original assets, generated output, or unrelated work. Do not force-push to resolve an unexplained mismatch.

## Focused repair prompt

```text
The current Zatroz step has this problem: [describe the issue and include a non-sensitive error or screenshot]. Read the step requirements, relevant project rules, and current diff. Reproduce the problem if tools allow. Explain the cause in easy English and make the smallest related correction. Preserve the established design tokens, component APIs, unrelated changes, and installed versions. Do not hide errors by removing validation, accessibility semantics, focus styles, or production preview protection. Rerun affected checks, report actual results, and stop within this step.
```

## Ready for Step 15 when

- [ ] Steps 11–14 are implemented and reviewed, with truthful progress records.
- [ ] Design tokens and contrast checks are documented.
- [ ] Reusable UI and form APIs are documented and demonstrated locally.
- [ ] Keyboard, responsive, and form-error behaviour have been checked.
- [ ] The shared shell has correct landmarks, skip navigation, and page sizing.
- [ ] The local preview is unavailable in production mode.
- [ ] Each step has its reviewed Git checkpoint.

Next request: **“Give me the complete Step 15 prompt file: desktop navigation.”**

This is a prompt deliverable. The website implementation and checks described here must be performed in your actual Cursor project; they have not been executed on your computer.
