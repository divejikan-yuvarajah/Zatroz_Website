# Zatroz progress — Steps 01–10

Track setup progress honestly. Mark a step **Implemented** only when its deliverable files exist. Business decisions may remain pending.

| Step | Result                          | Status                                                                              | Date       | Evidence                                                                                                                  |
| ---- | ------------------------------- | ----------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------- |
| 01   | Scope and decision register     | **Implemented**                                                                     | 2026-09-16 | `docs/planning/01-project-scope.md`, `docs/planning/decision-register.md`                                                 |
| 02   | Content and asset inventory     | **Implemented**                                                                     | 2026-09-16 | `docs/content/*` files listed in Step 02 notes below                                                                      |
| 03   | Sitemap and visitor journeys    | **Implemented**                                                                     | 2026-09-16 | `docs/planning/03-sitemap.md`, `visitor-journeys.md`, `navigation-spec.md`                                                |
| 04   | Verified local toolchain        | **Implemented**                                                                     | 2026-09-16 | `docs/setup/local-environment.md` — node/npm/git checks passed                                                            |
| 05   | Local Git and GitHub workflow   | **Implemented**                                                                     | 2026-09-16 | Local commit + merge with remote initial README; push to `origin/main`                                                    |
| 06   | Working Next.js starter         | **Implemented**                                                                     | 2026-09-16 | Next.js 16.3.5 starter; `npm run build` + localhost 200 + hot reload verified; see `docs/setup/project-initialization.md` |
| 07   | Repeatable quality checks       | **Implemented**                                                                     | 2026-09-16 | Prettier + ESLint CLI scripts; `npm run check` and `npm run build` passed; see `docs/setup/quality-checks.md`             |
| 08   | Documented folder structure     | **Implemented**                                                                     | 2026-09-17 | Merged via PR #3; `docs/architecture/folder-structure.md` + organisational dirs                                           |
| 09   | Cursor project rules            | **Implemented** (on branch `setup/09-cursor-rules`; merge may be pending)           | 2026-09-17 | `.cursor/rules/*.mdc` + `docs/setup/cursor-workflow.md`; Cursor UI activation **not verified** by agent                   |
| 10   | Safe environment configuration  | **Implemented**                                                                     | 2026-09-17 | `.env.example`, `src/server/env.ts`, `docs/setup/environment-variables.md`; check/build with blank integrations           |
| 11   | Design system                   | **Implemented** (on branch `feature/11-design-system`)                              | 2026-09-17 | Tokens + `/dev/ui` preview; `docs/design/design-system.md`, `contrast-checks.md`                                          |
| 12   | Reusable UI primitives          | **Implemented** (on branch `feature/12-ui-components`; merge may be pending)        | 2026-09-17 | `src/components/ui/*`, `src/lib/cn.ts`, `/dev/ui` gallery, `docs/design/ui-components.md`                                 |
| 13   | Accessible form components      | **Implemented** (on branch `feature/13-form-components`; merge may be pending)      | 2026-09-17 | `src/components/forms/*`, `src/components/dev/form-demo.tsx`, `docs/design/form-components.md`                            |
| 14   | Shared website layout           | **Implemented**                                                                     | 2026-09-17 | `src/components/layout/site-shell.tsx`, `skip-link.tsx`, `docs/architecture/page-layout.md`                               |
| 15   | Desktop navigation              | **Implemented**                                                                     | 2026-09-17 | `src/config/routes.ts`, `navigation.ts`, `SiteHeader`, `docs/design/navigation.md`; merged via PR #9                      |
| 16   | Accessible mobile navigation    | **Implemented**                                                                     | 2026-09-18 | Merged via PR #10; native `dialog` mobile menu                                                                            |
| 17   | Responsive company footer       | **Implemented**                                                                     | 2026-09-18 | Merged via PR #11; `SiteFooter`, `brand`/`contact` config                                                                 |
| 18   | Typed shared content            | **Implemented**                                                                     | 2026-09-18 | Merged via PR #12                                                                                                         |
| 19   | Homepage hero                   | **Implemented**                                                                     | 2026-09-18 | Merged via PR #13; static connected-business hero; see `docs/homepage/step-19.md`                                         |
| 20   | Hero scenario interactions      | **Implemented**                                                                     | 2026-09-18 | Merged via PR #14; three-scenario selector; see `docs/homepage/step-20.md`                                                |
| 21   | Homepage credibility / evidence | **Implemented**                                                                     | 2026-09-18 | Merged via PR #15; empty evidence + draft intro; see `docs/homepage/step-21.md`                                           |
| 22   | Homepage selected work          | **Implemented**                                                                     | 2026-09-18 | Merged via PR #16; featured IDs + project feature; see `docs/homepage/step-22.md`                                         |
| 23   | Homepage service explorer       | **Implemented**                                                                     | 2026-09-18 | Merged via PR #17; four draft business needs + disclosure explorer; see `docs/homepage/step-23.md`                        |
| 24   | Homepage automation example     | **Implemented**                                                                     | 2026-09-18 | Merged via PR #18; charcoal illustrative workflow + walkthrough; see `docs/homepage/step-24.md`                           |
| 25   | Homepage delivery process       | **Implemented** (on branch `feature/25-home-process`; merge may be pending)         | 2026-09-18 | Four draft process steps + calm timeline; see `docs/homepage/step-25.md`                                                  |
| 26   | Homepage people / team          | **Implemented** (on branch `feature/26-home-team`; merge may be pending)            | 2026-09-18 | Draft company intro; no invented founders; see `docs/homepage/step-26.md`                                                 |
| 27   | Homepage feedback / FAQs        | **Implemented** (on branch `feature/27-home-faq`; merge may be pending)             | 2026-09-18 | Six draft FAQs + empty feedback; native disclosures; see `docs/homepage/step-27.md`                                       |
| 28   | Homepage final CTA + review     | **Implemented** (on branch `feature/28-home-cta`; merge may be pending)             | 2026-09-18 | Draft invitation; no usable enquiry action yet; see `docs/homepage/step-28.md`                                            |
| 29   | Services overview               | **Implemented** (on branch `feature/29-services-overview`; merge may be pending)    | 2026-09-18 | `/services` route + draft overview; see `docs/services/step-29.md`                                                        |
| 30   | Service detail template         | **Implemented** (on branch `feature/30-service-template`; merge may be pending)     | 2026-09-18 | Dynamic `[slug]` + shared template; zero public details; see `docs/services/step-30.md`                                   |
| 31   | Websites and E-commerce         | **Implemented** (on branch `feature/31-websites-ecommerce`; merge may be pending)   | 2026-09-18 | Draft detail + gallery preview; public URL gated; see `docs/services/step-31.md`                                          |
| 32   | Web and Mobile Applications     | **Implemented** (on branch `feature/32-web-mobile-apps`; merge may be pending)      | 2026-09-18 | Draft detail + gallery preview; public URL gated; see `docs/services/step-32.md`                                          |
| 33   | Business Systems                | **Implemented** (on branch `feature/33-business-systems`; merge may be pending)     | 2026-09-18 | Draft detail + gallery preview; readiness matrix; see `docs/services/step-33.md`                                          |
| 34   | AI and Automation               | **Implemented** (on branch `feature/34-ai-automation`; merge may be pending)        | 2026-09-18 | Draft detail + gallery preview; HTML workflow; see `docs/services/step-34.md`                                             |
| 35   | Custom Software                 | **Implemented** (on branch `feature/35-custom-software`; merge may be pending)      | 2026-09-18 | Draft detail + gallery preview; decision guide; see `docs/services/step-35.md`                                            |
| 36   | UI/UX Design                    | **Implemented** (on branch `feature/36-ui-ux-design`; merge may be pending)         | 2026-09-18 | Draft detail + gallery preview; form-state illustration; see `docs/services/step-36.md`                                   |
| 37   | Work page + public selectors    | **Implemented** (on branch `feature/37-work-page`; merge may be pending)            | 2026-09-18 | `/work` live with 0 published projects; public selectors; see `docs/work/step-37.md`                                      |
| 38   | Case-study template             | **Implemented** (on branch `feature/38-case-study`; merge may be pending)           | 2026-09-18 | `/work/[slug]` template + story model; 0 published stories; see `docs/work/step-38.md`                                    |
| 39   | Initial project stories         | **Implemented** (on branch `feature/39-initial-case-studies`; merge may be pending) | 2026-09-18 | Evidence register + drafts; **0** published stories (blocked on facts); see `docs/work/step-39.md`                        |
| 40   | About page                      | **Implemented** (on branch `feature/40-about-page`; merge may be pending)           | 2026-09-18 | `/about` live; draft copy gated; gallery specimen; see `docs/pages/step-40.md`                                            |
| 41   | Process / How We Work           | **Implemented** (on branch `feature/41-process-page`; merge may be pending)         | 2026-09-18 | `/process` live; six draft stages; gallery specimen; see `docs/pages/step-41.md`                                          |
| 42   | Contact layout + channels       | **Implemented** (on branch `feature/42-contact-layout`; merge may be pending)       | 2026-09-18 | `/contact` live; email+WhatsApp confirmed; form specimen only; see `docs/contact/step-42.md`                              |

---

## Step notes

### Step 01 (2026-09-16)

- Created launch scope and decision register from the prompt pack and the readable website plan export.
- Service delivery capacity left as **Needs input**.
- No application code created.
- Checks: page counts (8 + 6 + 2–3) match; launch vs later scope do not contradict; unknowns recorded as TODO.

### Step 02 (2026-09-16)

- Created content inventory, asset register, founder/project templates, brand/contact record, and asset guidelines.
- No logo, portraits, or project screenshots found in the repository; assets marked Missing.
- Known contacts recorded for confirmation; LinkedIn URL and domain left unknown.
- Suggested launch story candidates noted without approval.

### Step 03 (2026-09-16)

- Documented canonical routes, five visitor journeys, desktop/footer/mobile nav behaviour, and `?service=` allowlist.
- No route folders, page components, redirects, forms, or analytics created.
- Checks: route uniqueness OK; 8 general + 6 services + `/work/[slug]` pattern; no `/case-studies` duplicate; every journey has a next action.

### Step 04 (2026-09-16)

- Verified in Cursor terminal: Node `v24.10.0`, npm `11.6.1`, Git `2.47.1.windows.2`.
- Kept existing Node 24 toolchain (Active LTS; satisfies Next.js minimum Node ≥ 20.9 per current install docs).
- No Next.js scaffold, Git remotes, or external services.

### Step 05 (2026-09-16)

- Initialized local Git on `main` (was not a repository before).
- Added `.gitignore`, `README.md`, and `docs/setup/git-workflow.md`.
- Set `origin` to `https://github.com/divejikan-yuvarajah/Zatroz_Website.git` (user-supplied repo).
- Tracked-file review: planning/content/setup docs only; no `.env`, credentials, or raw private asset folders found.
- User created initial local commit `Set up the folder`.
- Remote already had an `Initial commit` with a stub README; merged with `--allow-unrelated-histories`, kept the project README, then pushed to `origin/main`.
- Global Git identity already present on this machine; local identity not modified.

### Step 06 (2026-09-16)

- Branch: `setup/06-nextjs`.
- Scaffolded Next.js App Router + TS + Tailwind + ESLint via temp sibling `zatroz-scaffold-temp`, then merged into this repo without replacing README/docs/Git history.
- Package name `zatroz-website`; Next `16.3.5`, React `19.2.8`, Tailwind `4.3.3`; `.nvmrc` = `24.10.0`; `engines.node` = `>=24 <25`.
- Simple Zatroz starter page; system fonts; no demo marketing links; no `output: "export"`.
- Checks: `npm run build` succeeded (twice); `npm run dev` returned HTTP 200 with “Zatroz”; hot reload confirmed.
- Browser visual review left as a manual check for you.

### Step 07 (2026-09-16)

- Branch: `setup/07-quality` (from updated `main` after PR #1 merge).
- Added Prettier `3.9.7` and `eslint-config-prettier` `10.1.8`; kept Next Core Web Vitals + TypeScript ESLint via CLI.
- Scripts: `lint`, `lint:fix`, `typecheck` (`next typegen && tsc --noEmit`), `format`, `format:check`, `check`.
- Added `.prettierrc.json`, `.prettierignore`, `.vscode/settings.json`, `docs/setup/quality-checks.md`.
- Ran initial `npm run format` (mostly markdown whitespace/table alignment; business meaning unchanged).
- Checks: `npm run check` passed; `npm run build` passed.
- Did not add Husky, lint-staged, or a test framework.

### Step 08 (2026-09-17)

- Branch: `setup/08-structure` (from `main` after PR #2 merge).
- Documented path purposes, import boundaries, naming, and future routes in `docs/architecture/folder-structure.md`.
- Created empty organisational dirs with `.gitkeep`: `src/components/{ui,layout,sections,forms}`, `src/content`, `src/config`, `src/lib`, `src/server`, `src/types`, `public/brand`, `public/images/{projects,team}`, `public/fonts`, `supabase/migrations`.
- No empty `page.tsx` stubs for future routes; no SQL or Supabase tooling.
- Existing home route and `@/*` alias preserved.

### Step 09 (2026-09-17)

- Branch: `setup/09-cursor-rules` (based on `setup/08-structure` because `origin/main` did not yet include Step 08 at start).
- Added always-on `00-project-core.mdc` and contextual `10-frontend`, `20-content-and-design`, `30-server-and-data` under `.cursor/rules/`.
- Added `docs/setup/cursor-workflow.md` (rules guide only; not a secret store; no `.cursorrules`).
- Left framework `AGENTS.md` unchanged. No application behaviour changes.
- Rule activation in Cursor UI: **not verified** by the agent — open Customize → Rules after pull.

### Step 10 (2026-09-17)

- Branch: `setup/10-environment` (from `setup/09-cursor-rules`).
- Added `.env.example` (safe blanks), `.cursorignore`, `server-only`, `src/server/env.ts` + `resolve-site-url.ts`, `docs/setup/environment-variables.md`.
- Created `.env.local` from the example (blank integrations); file is gitignored — contents not printed.
- `getSiteUrl()` falls back to localhost when unset; rejects bad `SITE_URL`; does not require future service secrets on import.
- Checks: `git check-ignore` OK for `.env.local`; `.env.example` not ignored; no private env in `git ls-files`; `resolveSiteUrl` script passed (localhost, example.com, invalid/ftp); `npm run check` passed; `npm run build` passed with blank integration values; production `next start` on port 3001 returned HTTP 200 with “Zatroz” (port 3000 was already in use).
- Browser look-and-feel beyond HTTP content: **manual** if you want a visual pass.
- No Supabase/Resend/Turnstile/cron clients or enquiry API.

---

## Steps 01–10 summary (evidence)

| Step  | Evidence snapshot                                         |
| ----- | --------------------------------------------------------- |
| 01–03 | Planning docs under `docs/planning/` and `docs/content/`  |
| 04    | `docs/setup/local-environment.md` — Node 24.10.0 verified |
| 05    | GitHub `origin` connected; commits on `main`              |
| 06    | Next.js 16.3.5 starter; build + localhost verified        |
| 07    | `npm run check` / `build` quality scripts                 |
| 08    | Folder architecture + placeholders                        |
| 09    | `.cursor/rules/` + cursor workflow doc                    |
| 10    | Safe env example + server `getSiteUrl()`                  |

**Ready for Step 11 (design system):** Steps 01–10 are merged to `main` (through PR #5).

**Still pending (content/business):** service capacity, founder profiles, logo/assets, LinkedIn URL, production domain, approved project stories, legal Privacy/Terms.

### Step 11 (2026-09-17)

- Branch: `feature/11-design-system` from updated `main`.
- Central tokens in `src/styles/tokens.css`; Tailwind v4 `@theme` mapping in `globals.css`.
- Manrope via `next/font/google` (400/500/600/700). No local WOFF2 was supplied. IBM Plex Mono not added.
- Guarded `/dev/ui` token preview (`notFound()` unless development; noindex).
- Contrast pairs recorded in `docs/design/contrast-checks.md`. Brand hex unchanged; white-on-orange is forbidden.
- Checks: `npm run check` passed; `npm run build` passed; Manrope present in HTML/CSS on `http://localhost:3000` (existing dev server). Production `npm run start` on **http://localhost:3011**: `/` 200, `/dev/ui` **404**. Viewport/zoom/reduced-motion visual pass **not run** (no browser automation); use the manual list in the Step 11 report.
- No Button/Card/Form APIs, navigation, footer, or marketing pages.

### Step 12 (2026-09-17)

- Branch: `feature/12-ui-components` from `feature/11-design-system` (`origin/main` still at Step 10 / PR #5).
- Added primitives: Button, ButtonLink, TextLink, Badge, Card, Container, Section, SectionHeading; shared `button-styles.ts` and `src/lib/cn.ts`.
- Interactive gallery demo only in `src/components/dev/ui-interactions.tsx` (local counter, loading, form default vs submit). Nothing is sent or saved.
- Primary button: ink on brand. Secondary and quiet are **light-surface only** (not used on charcoal).
- `/dev/ui` extended; homepage not turned into a gallery.
- Checks: `npm run check` passed; `npm run build` passed; production `next start` on **http://localhost:3012**: `/` 200, `/dev/ui` **404**. Viewport/keyboard/zoom/reduced-motion visual pass **not run** (no browser automation); use the manual list in the Step 12 report.
- No navigation, footer, hero, dialogs, FAQ, or service/project cards.

### Step 13 (2026-09-17)

- Branch: `feature/13-form-components` from `feature/12-ui-components` (`origin/main` still at Step 10 / PR #5).
- Added FormField (render-prop id sharing), TextInput, TextArea, SelectField, CheckboxField, ErrorSummary, InlineStatus; `src/lib/described-by.ts`.
- Local demo `src/components/dev/form-demo.tsx` on `/dev/ui`: name, email, service (including Not sure), message, optional checkbox. `noValidate`; nothing sent or saved.
- Invalid submit focuses the error summary once. Inline errors are not live regions. Pending/success are polite status; simulated failure is an alert without a competing summary.
- Checks: `npm run check` passed; `npm run build` passed; production `next start` on **http://localhost:3013**: `/` 200, `/dev/ui` **404**. Keyboard, 320px, on-screen keyboard, and screen-reader (NVDA/VoiceOver) passes **not run**.
- No Contact page, enquiry API, storage, email, or analytics.

### Step 14 (2026-09-17)

- Branch: `feature/14-site-layout` from `feature/13-form-components` (`origin/main` still at Step 10 / PR #5).
- `SiteShell` + skip link; root layout stays a Server Component. Optional `header` / `footer` slots are omitted until those steps.
- Home is a short starter inside Section + reading Container (one H1). `/dev/ui` kept its gallery H1 and gained a layout specimen (short/long copy, reading width, dark full-bleed band).
- Checks: `npm run check` passed; `npm run build` passed; production `next start` on **http://localhost:3014**: `/` 200 with one `main#main-content`, skip link, one H1; `/dev/ui` **404**. Viewport, skip-keyboard, 200% zoom, and JS-off visual review **not run** in a browser.
- No SiteHeader, mobile menu, footer, or marketing pages.

### Step 15 (2026-09-17)

- Branch: `feature/15-desktop-navigation` from updated `main` (Steps 11–14 already on `origin/main`).
- Typed `src/config/routes.ts` + `navigation.ts`. Live header links only to implemented routes: **Home**. Services, Work, About, Process, Contact, Privacy, and Terms stay Planned until their pages exist.
- Sticky `SiteHeader` with text wordmark (no logo asset). Desktop nav from 1024px; narrower widths keep the Home link. No hamburger (Step 16).
- Services overview and “Show service categories” are separate controls. Full intended bar is on `/dev/ui` with noninteractive Planned labels.
- Matcher checks: `scripts/verify-navigation.ts`. No broken `/contact` or `/services` links in the live header.
- Checks: `node --experimental-strip-types scripts/verify-navigation.ts` passed; `npm run check` passed; `npm run build` passed; production `next start` on **http://localhost:3015**: `/` 200 with skip link, `<header>`, Home wordmark, **no** `/contact` `/services` `/work` links, one `main`, no empty `<nav>`; `/dev/ui` **404**. Keyboard, 1024/1280/1440, 200% zoom, and screen-reader passes **not run** in a browser.
- No mobile menu, footer, or marketing pages.

### Step 16 (2026-09-18)

- Branch: `feature/16-mobile-navigation` from updated `main` (Step 15 already on `origin/main`).
- `MobileNavigation` Client Component: native `<dialog>.showModal()`, Menu / Close menu (`min-h-11`), Home first, `<details>` for service categories, body `overflow` lock only.
- Live header reuses `getHeaderNavigation()` + `getHomeDestination()`. Menu is `lg:hidden`; the dialog is not inside a hidden wrapper. CSS and JS share `(min-width: 1024px)`.
- Focus: dismiss restores Menu (`preventScroll`) or Home if Menu is hidden; same-tab navigation and Back/Forward do not restore Menu; crossing to desktop focuses `#site-home-link`.
- Server-rendered `<noscript>` list of implemented routes (Home today). Gallery specimens on `/dev/ui` use unique ids and always-visible triggers.
- Checks: matcher passed; `npm run check` passed; `npm run build` passed; production `next start` on **http://localhost:3016**: `/` 200 with skip link, header, Menu, closed dialog (Home only), noscript Home list, **no** `/contact` `/services` `/work` `/about` `/process` hrefs, one `main`; `/dev/ui` **404**. Keyboard, 320/390/768, landscape, device Safari/Android, and screen-reader passes **not run**.
- No footer, marketing pages, or enquiry flow.

### Step 17 (2026-09-18)

- Branch: `feature/17-footer` from `feature/16-mobile-navigation` (Step 16 not yet on `origin/main` at start of this step).
- `SiteFooter` Server Component on charcoal; reusable `SiteFooterContent` for `/dev/ui` without a second contentinfo landmark.
- `src/config/brand.ts` holds brand/contact with explicit confirmation status. Live footer omits unconfirmed phone/email/WhatsApp and missing social URLs. No guessed LinkedIn/Instagram links. Privacy/Terms omitted until routes exist.
- Copyright: `© {getCopyrightYear()} Zatroz` (server/build-time year). Back-to-top deferred.
- Checks: `npm run check` passed; `npm run build` passed; production `next start` on **http://localhost:3018**: `/` 200 with one charcoal `<footer>`, Explore → Home, `© 2026 Zatroz`, **no** contact/social/policy hrefs, one `main`; `/dev/ui` **404**. Viewport, keyboard, and device dial/mail actions **not run**.
- No marketing pages or enquiry flow.

### Step 18 (2026-09-18)

- Branch: `feature/18-content-structure` from updated `main` (Steps 16–17 already merged).
- Typed content under `src/content/` (site, navigation labels, six draft services, empty projects/founders/media, draft FAQs). Shared unions in `src/types/content.ts`.
- `src/server/content.ts` (`server-only`): `getPublished*` / `getLinkable*` / `getPublicNavigation` projections. Header and footer consume public projections; behaviour unchanged (Home-only live links).
- `npm run validate:content` + fixtures (duplicate slug, unknown ref, bad URL, incomplete approved). Wired into `npm run check`.
- Docs: `docs/content/content-model.md`, `editing-guide.md`. Inventory gaps unchanged: contacts unconfirmed, no approved portfolio/founder cards.
- Checks: `npm run validate:content` passed (15 readiness warnings); `npm run check` passed; `npm run build` passed (Next.js 16.3.5). Production `next start` on **http://localhost:3019**: `/` 200 with header Menu + one footer; no mailto/`/contact` or draft service summaries in HTML; `/dev/ui` **404**. Interactive disclosure/menu keyboard passes **not run**.
- No homepage hero, service pages, or enquiry flow (Step 19+).

### Step 19 (2026-09-18)

- Branch: `feature/19-home-hero` from `feature/18-content-structure` (Step 18 not yet on `origin/main` at start of this step).
- Static `HomeHero` + `BusinessWorkflowVisual` (Sell online illustrative path). Typed scenario ready for Step 20; no scenario controls yet.
- Draft copy in `src/content/home.ts`. Public `/` stays an honest starter until `publicationState` is `approved`. `/dev/ui` shows the full draft specimen (0/1/2 CTA cases).
- Shared CTA resolver never links unimplemented `/contact` or `/work`.
- Checks: `npm run validate:content` passed; `npm run check` passed; `npm run build` passed. Production `next start` on **http://localhost:3020**: `/` 200 with honest starter (no draft headline/workflow); one `h1`/`main`; `/dev/ui` **404**. Viewport, keyboard, and JS-off gallery review **not run**.
- No scenario interactions, evidence section, or later homepage blocks.

### Step 20 (2026-09-18)

- Branch: `feature/20-hero-interactions` from updated `main` (Steps 18–19 merged).
- Three illustrative scenarios with `aria-pressed` selector in `HeroScenarioPanel` (client). Headline/CTAs unchanged on switch.
- Selector enabled after hydration; noscript lists other scenario summaries. Service deep-links omitted until routes exist.
- Checks: `npm run validate:content` passed; `npm run check` passed; `npm run build` passed. Production `next start` on **http://localhost:3021**: `/` 200 with honest starter (no draft hero/scenarios); `/dev/ui` **404**. Keyboard, 320px, reduced-motion, and JS-off gallery passes **not run**.
- No evidence section or later homepage blocks.

### Step 21 (2026-09-18)

- Branch: `feature/21-home-evidence` from updated `main` (Step 20 merged).
- Typed evidence module (`src/content/evidence.ts`): empty proof list, draft company intro. Public projection omits `sourceReference`.
- `HomeEvidence` compact muted strip after the hero; composition sets `home-evidence` only when approved content exists.
- Gallery specimens cover 0/1/2/3 items and long claim text with labelled fixtures (never public evidence).
- Checks: `npm run validate:content` passed (16 readiness warnings including empty-evidence); `npm run check` passed; `npm run build` passed (Next.js 16.3.5). Production browser smoke **not run** in this pass. Gallery keyboard/viewport review **not run**.
- No selected-work section or later homepage blocks (Step 22+).

### Step 22 (2026-09-18)

- Branch: `feature/22-selected-work` from updated `main` (Step 21 merged).
- `homeSelectedWorkRecord.featuredProjectIds` + catalog validation (unknown/duplicate/draft featured refs fail).
- Reusable `ProjectFeature` + `HomeFeaturedWork` (1 / 2 / lead+two layouts). Status labels honest; no invented metrics or fake story links.
- Gallery specimens include image-led (specimen SVG), text-led, long title, and nonlinked cases. Public `/` omits selected work while projects stay empty.
- Checks: `npm run validate:content` passed (17 readiness warnings including empty-featured-work); `npm run check` passed; `npm run build` passed (Next.js 16.3.5). Production browser smoke **not run**. Gallery keyboard/viewport review **not run**.
- No service explorer or later homepage blocks (Step 23+).

### Step 23 (2026-09-18)

- Branch: `feature/23-service-explorer` from updated `main` (Step 22 merged).
- Typed `business-needs` module: four draft needs mapped to canonical service IDs; explorer framing draft.
- Disclosure explorer with `aria-expanded` / `aria-controls`; one open panel; mobile detail under trigger; desktop side panel via CSS grid without a second widget.
- Noscript lists all needs; service links and `?service=` enquiry only when routes are ready.
- Checks: `npm run validate:content` passed (18 readiness warnings including draft-service-explorer); `npm run check` passed; `npm run build` passed (Next.js 16.3.5). Production browser smoke **not run**. Gallery keyboard/viewport/no-JS review **not run**.
- No automation example or later homepage blocks (Step 24+).

### Step 24 (2026-09-18)

- Branch: `feature/24-automation-example` from updated `main` (Step 23 merged).
- Draft charcoal `HomeAutomationExample` with four human-reviewed stages, sample invoice, and optional manual walkthrough.
- No upload, OCR, fetch, or timed autoplay. Completion message states no document was processed.
- Checks: `npm run validate:content` passed (19 readiness warnings including draft-automation-example); `npm run check` passed; `npm run build` passed (Next.js 16.3.5). Production browser smoke **not run**. Gallery keyboard/walkthrough/no-JS review **not run**.
- No process section or later homepage blocks (Step 25+).

### Step 25 (2026-09-18)

- Branch: `feature/25-home-process` from updated `main` (Step 24 merged).
- Draft `HomeProcess` with four always-visible steps and customer outputs; calm light surface after charcoal automation.
- CTA prefers ready `/process`, else contact/email; never a self-link. Hero explore-work may fall back to `#how-we-work` when rendered.
- Checks: `npm run validate:content` passed (20 readiness warnings including draft-home-process); `npm run check` passed; `npm run build` passed (Next.js 16.3.5). Production browser smoke **not run**. Gallery zoom/no-JS review **not run**.
- No people section or later homepage blocks (Step 26+).

### Step 26 (2026-09-18)

- Branch: `feature/26-home-team` from `feature/25-home-process` (Step 25 not yet on `origin/main`).
- Draft `HomeTeam` with company intro, communication note, and proposed working principles. Founder collection stays empty — no invented Person cards.
- Layout adapts: text-led / profiles / team-photo from approved assets only. Gallery uses labelled specimen profiles.
- CTA prefers ready `/about`, else contact/email; never a self-link to `#people`.
- Checks: `npm run validate:content` passed (21 readiness warnings including draft-home-people); `npm run check` passed; `npm run build` passed (Next.js 16.3.5). Production browser smoke **not run**. Gallery layout review **not run**.
- No FAQ/feedback section or later homepage blocks (Step 27+).

### Step 27 (2026-09-18)

- Branch: `feature/27-home-faq` from `feature/26-home-team` (Steps 25–26 not yet on `origin/main`).
- Six draft FAQs with conditional answers; empty feedback collection; draft questions framing.
- `HomeFeedbackFaq` with native `FaqDisclosure` (multi-open, no-JS). Optional authentic quote or labelled Zatroz lesson only when approved.
- CTA “Ask us about your project” only when a usable contact destination exists.
- Checks: `npm run validate:content` passed (22 readiness warnings including draft-home-questions); `npm run check` passed; `npm run build` passed (Next.js 16.3.5). Production browser smoke **not run**. Gallery keyboard/no-JS FAQ review **not run**.
- No final enquiry CTA or homepage integration review (Step 28).

### Step 28 (2026-09-18)

- Branch: `feature/28-home-cta` from `feature/27-home-faq` (Steps 25–27 not yet on `origin/main`).
- Draft `HomeFinalCta` with warm-white invitation; shared enquiry fallback prefers `#start-a-project` when the section renders.
- Public invitation omitted until framing approved **and** Contact/email/WhatsApp is usable — current launch blocker documented.
- Integration matrix in `docs/homepage/homepage-review.md`. Homepage components complete ≠ website launch-ready.
- Checks: `npm run validate:content` passed (24 readiness warnings including draft-home-final-cta and no-usable-enquiry-action); `npm run check` passed; `npm run build` passed (Next.js 16.3.5). Production `next start` on port 3028: `/` HTTP 200; `/dev/ui` HTTP 404. Browser interaction/viewport review **not run**. Lighthouse **not run**.
- No Services overview page (Step 29).

### Step 29 (2026-09-18)

- Branch: `feature/29-services-overview` from `feature/28-home-cta`.
- `/services` page with breadcrumb, need shortcuts, six service rows, not-sure guide, delivery/work slots, and enquiry CTAs.
- Public page omits draft framing and draft service rows (honest sparse placeholder today). Gallery shows all six labelled specimens.
- Route registry: `services.implemented: true`; six detail routes remain false.
- Checks: `npm run validate:content` passed (24 readiness warnings including draft-services-overview; `/services` route no longer unimplemented); `npm run check` passed; `npm run build` passed (Next.js 16.3.5). Dev smoke: `/services` HTTP 200 with honest placeholder (no draft hero); home header links to `/services`. Production browser smoke **not run**. Gallery keyboard/viewport review **not run**.
- No reusable service detail template (Step 30).

### Step 30 (2026-09-18)

- Branch: `feature/30-service-template` from `feature/29-services-overview`.
- Shared `ServiceDetailPage` template + `src/app/services/[slug]/page.tsx` with awaited params, shared eligibility for page/metadata/static params.
- All six `detail` fields remain `null`; detail routes stay `implemented: false`. Empty eligible set is intentional.
- Gallery: complete / minimal / long-copy / missing-optional / no-CTA specimens on `/dev/ui`.
- Docs: `docs/services/template.md`, `docs/services/step-30.md`.
- Checks: `npm run validate:content` passed (24 readiness warnings; detail routes still unimplemented); `npm run check` passed; `npm run build` passed (Next.js 16.3.5). Production `next start` on port 3030: `/services` HTTP 200; `/services/websites-ecommerce`, `/services/web-mobile-apps`, and `/services/not-a-real-service` HTTP 404 with no draft/specimen body text; `/dev/ui` HTTP 404. Gallery keyboard/viewport review **not run**.
- No service-specific public detail pages (Steps 31–36).

### Step 31 (2026-09-18)

- Branch: `feature/31-websites-ecommerce` from `feature/30-service-template`.
- Draft Websites and E-commerce detail (three scope options, deliverables, FAQs, browser/catalogue illustration). Copy remains draft — not founder-approved.
- `websitesEcommerce.implemented: true`; public `/services/websites-ecommerce` still 404 until overview + detail approved. Nav/footer/overview/explorer link only when detail is eligible.
- Gallery: full draft preview on `/dev/ui`. No cart, payment, or live order UI.
- Docs: `docs/services/step-31.md`; template note updated.
- Checks: `npm run validate:content` passed (23 readiness warnings; `websitesEcommerce` no longer unimplemented); `npm run check` passed; `npm run build` passed (Next.js 16.3.5). Production `next start` on port 3031: `/services` and `/` HTTP 200; `/services/websites-ecommerce` HTTP 404 with no draft hero/CTA in body; unknown slug 404; home and `/services` do not link the draft detail URL. Gallery keyboard/viewport review **not run**.
- No web-mobile-apps or other service detail pages (Step 32+).

### Step 32 (2026-09-18)

- Branch: `feature/32-web-mobile-apps` from `feature/31-websites-ecommerce`.
- Draft Web and Mobile Applications detail (web / mobile / phased options, deliverables, FAQs, browser vs phone task illustration). Copy remains draft.
- `webMobileApps.implemented: true`; public `/services/web-mobile-apps` still 404 until overview + detail approved. Shared eligibility keeps nav/overview from linking draft details.
- Gallery: full draft preview on `/dev/ui`. No login, booking submission, or credential collection.
- Docs: `docs/services/step-32.md`; template note updated.
- Checks: `npm run validate:content` passed (22 readiness warnings; `webMobileApps` no longer unimplemented); `npm run check` passed; `npm run build` passed (Next.js 16.3.5). Production `next start` on port 3032: `/services` and `/` HTTP 200; `/services/web-mobile-apps` and `/services/websites-ecommerce` HTTP 404 with no draft hero/CTA; unknown slug 404; home and `/services` do not link draft detail URLs. Gallery keyboard/viewport review **not run**.
- No business-systems or later service detail pages (Step 33+).

### Step 33 (2026-09-18)

- Branch: `feature/33-business-systems` from `feature/32-web-mobile-apps`.
- Draft Business Systems detail (Sales/POS, Inventory, Internal operations, Reporting options; FAQs; ops panel illustration). Copy remains draft — not an ERP product claim.
- `businessSystems.implemented: true`; public `/services/business-systems` still 404 until overview + detail approved.
- Gallery: full draft preview on `/dev/ui`. No live POS, inventory DB, payment, or hardware access.
- Docs: `docs/services/step-33.md`, `docs/services/readiness.md`.
- Checks: `npm run validate:content` passed (21 readiness warnings; `businessSystems` no longer unimplemented); `npm run check` passed; `npm run build` passed (Next.js 16.3.5). Production `next start` on port 3033: `/services` and `/` HTTP 200; `/services/business-systems`, `/services/web-mobile-apps`, and `/services/websites-ecommerce` HTTP 404 with no draft leak; unknown slug 404; overview does not link draft details. Gallery keyboard/viewport review **not run**.
- No AI/Automation or later service detail pages (Step 34+).

### Step 34 (2026-09-18)

- Branch: `feature/34-ai-automation` from `feature/33-business-systems`.
- Draft AI and Automation detail (rules / AI-assisted / retrieval options, FAQs, HTML review workflow). Copy remains draft — no live model or chatbot.
- `aiAutomation.implemented: true`; public `/services/ai-automation` still 404 until overview + detail approved.
- Gallery: full draft preview on `/dev/ui`. Optional hero raster recorded as not acquired in `docs/content/image-register.md`.
- Docs: `docs/services/step-34.md`; readiness matrix updated.
- Checks: `npm run validate:content` passed (20 readiness warnings; `aiAutomation` no longer unimplemented); `npm run check` passed; `npm run build` passed (Next.js 16.3.5). Production `next start` on port 3034: `/services` HTTP 200; `/services/ai-automation` and prior three detail slugs HTTP 404 with no draft leak; unknown slug 404; overview does not link draft details. Gallery keyboard/viewport review **not run**.
- No custom-software or later service detail pages (Step 35+).

### Step 35 (2026-09-18)

- Branch: `feature/35-custom-software` from `feature/34-ai-automation`.
- Draft Custom Software detail (configure/integrate/tailor guide, scope options, FAQs, system relationship map). Copy remains draft — not a client product build.
- `customSoftware.implemented: true`; public `/services/custom-software` still 404 until overview + detail approved.
- Gallery: full draft preview on `/dev/ui`. Optional hero raster recorded as not acquired.
- Docs: `docs/services/step-35.md`; readiness and image register updated.
- Checks: `npm run validate:content` passed (19 readiness warnings; `customSoftware` no longer unimplemented); `npm run check` passed; `npm run build` passed (Next.js 16.3.5). Production `next start` on port 3035: `/services` HTTP 200; `/services/custom-software` and prior drafted detail slugs HTTP 404 with no draft leak; unknown slug 404; overview does not link draft details. Gallery keyboard/viewport review **not run**.
- No UI/UX Design detail page (Step 36).

### Step 36 (2026-09-18)

- Branch: `feature/36-ui-ux-design` from `feature/35-custom-software`.
- Draft UI/UX Design detail (scope options, FAQs, enquiry flow + form states). Copy remains draft — not a client design application or site redesign.
- `uiUxDesign.implemented: true`; public `/services/ui-ux-design` still 404 until overview + detail approved.
- Gallery: full draft preview on `/dev/ui`. Optional hero raster recorded as not acquired.
- Docs: `docs/services/step-36.md`; six-service readiness and image register updated.
- Checks: `npm run validate:content` passed (18 readiness warnings; `uiUxDesign` no longer unimplemented); `npm run check` passed; `npm run build` passed (Next.js 16.3.5). Production `next start` on port 3036: `/services` HTTP 200; `/services/ui-ux-design` and prior five drafted detail slugs HTTP 404 with no draft leak; unknown slug 404; overview and home do not link draft details. Gallery keyboard/viewport review **not run**.
- No Work page or later routes (Step 37+).

### Step 37 (2026-09-18)

- Branch: `feature/37-work-page` from `feature/36-ui-ux-design`.
- Public project selectors (`listPublishedProjects`, featured/related helpers) with repository adapter until A09–A10.
- `/work` implemented: empty honest state (0 published projects), GET filters, pagination helpers, enquiry CTA.
- Homepage/service related-work consumers use the public selector; story links require approved story + Step 38 flag.
- Docs: `docs/work/step-37.md`, `docs/architecture/admin-content-plan.md`; image register notes no Work hero raster.
- Checks: `npm run validate:content` passed (17 readiness warnings; `work` no longer unimplemented); `npm run test:public-projects` passed; `npm run check` passed; `npm run build` passed (Next.js 16.3.5). Production `next start` on port 3037: `/` and `/work` HTTP 200; Work empty-state copy present; home/services link `/work`; `/dev/ui` HTTP 404; unknown `/work/not-a-project` HTTP 404; no specimen/draft leakage on public pages. Gallery keyboard/viewport review **not run**.
- No case-study template (Step 38).

### Step 38 (2026-09-18)

- Branch: `feature/38-case-study` from `feature/37-work-page`.
- Structured `ProjectStoryRecord` with controlled blocks; `getPublishedCaseStudyBySlug` public projection.
- `/work/[slug]` reusable template (hero, facts, sections, gallery, related, enquiry). Empty catalog → all story URLs 404.
- Story link eligibility enabled with Work route; gallery short/long specimens labelled fixtures only.
- Docs: `docs/work/step-38.md`; admin content plan updated for story selector and A09–A11 refresh.
- Checks: `npm run validate:content` passed (17 readiness warnings); `npm run test:public-projects` and `npm run test:public-case-studies` passed; `npm run check` passed; `npm run build` passed (Next.js 16.3.5). Production `next start` on port 3038: `/work` HTTP 200 (empty state); `/work/not-a-real-story` and specimen slugs HTTP 404; `/dev/ui` HTTP 404; no specimen/secret leakage on public pages. Gallery keyboard/viewport review **not run**.
- No initial launch stories written (Step 39).

### Step 39 (2026-09-18)

- Branch: `feature/39-initial-case-studies` from `feature/38-case-study`.
- Audited FlowPilot AI, InvoiceX AI, and third-story placeholder: **no candidate meets publication bar** (status, contribution, permission, screenshots unverified).
- Delivered evidence register, private editorial outlines, admin migration inventory with proposed IDs/slugs. Catalog left empty — no invented projects or fake media.
- Public counts unchanged: 0 published summaries, 0 published stories. `/work` empty state retained.
- Docs: `docs/work/step-39.md`, `case-study-evidence-register.md`, `admin-migration-inventory.md`, `docs/work/drafts/*`.
- Checks: `npm run validate:content` passed (17 readiness warnings including empty-projects); selector tests passed; `npm run check` passed; `npm run build` passed (Next.js 16.3.5). Production `next start` on port 3039: `/work` HTTP 200 with empty-state copy; `/work/flowpilot-ai` and `/work/invoicex-ai` HTTP 404 (not published). Gallery keyboard/viewport review **not run**.
- No About page (Step 40).

### Step 40 (2026-09-18)

- Branch: `feature/40-about-page` from `feature/39-initial-case-studies`.
- About route + draft content model; public page sparse until approval; gallery shows full draft including proposed mission/vision.
- No invented founder cards or portraits. Evidence section uses public project selectors (still empty).
- `about.implemented: true`; nav can link `/about`.
- Docs: `docs/pages/step-40.md`, `docs/content/about-evidence.md`; image register notes optional illustration not acquired.
- Checks: `npm run validate:content` passed (17 readiness warnings including draft-about-page); `npm run check` passed; `npm run build` passed (Next.js 16.3.5). Production `next start` on port 3040: `/about` HTTP 200 sparse placeholder (no draft mission leak); `/` links `/about`; `/work` 200; `/dev/ui` HTTP 404. Gallery keyboard/viewport review **not run**.
- No Process page (Step 41).

### Step 41 (2026-09-18)

- Branch: `feature/41-process-page` from `feature/40-about-page`.
- Process route + six-stage draft content model; public page sparse until approval; gallery shows full draft.
- Collaboration, dependencies, acceptance, prepare checklist, and process FAQs included without unsupported promises.
- Homepage process vocabulary aligned (Understand…); `process.implemented: true` so nav and home can link `/process`.
- No process illustration acquired — ordered list is primary.
- Docs: `docs/pages/step-41.md`; image register notes optional illustration not acquired.
- Checks: `npm run validate:content` passed (17 readiness warnings including draft-process-page); `npm run check` passed; `npm run build` passed (Next.js 16.3.5). Production `next start` on port 3041: `/process` HTTP 200 sparse placeholder (no draft stage leak); `/` links `/process`; `/about` 200; `/dev/ui` HTTP 404. Gallery keyboard/viewport review **not run**.
- No Contact page (Step 42).

### Step 42 (2026-09-18)

- Branch: `feature/42-contact-layout` from `feature/41-process-page`.
- Contact route + draft framing; confirmed email and WhatsApp (owner-supplied values match; no conflict). Phone voice and social URLs remain unconfirmed.
- Public `/contact` shows channels; omits unfinished enquiry form (`formSubmissionReady: false`). Gallery hosts full draft + form layout specimen.
- Safe `?service=` parser with tests; metadata canonical stays `/contact`.
- Site-wide enquiry CTAs resolve to `/contact` (or `?service=`) via existing resolvers — Contact page actions open mailto/WhatsApp only.
- Docs: `docs/contact/step-42.md`, brand-and-contact updated; optional illustration not acquired.
- Checks: `npm run validate:content` passed (16 readiness warnings including draft-contact-page; no-usable-enquiry-action cleared); `npm run check` passed (includes contact service-query tests); `npm run build` passed (Next.js 16.3.5). Production `next start` on port 3042: `/contact` HTTP 200 with mailto + WhatsApp, no form fields, no draft FAQ/hero; `/contact?service=ui-ux-design` shows service context; unknown service does not render interest line; `/` links `/contact`; `/dev/ui` HTTP 404. Gallery keyboard/viewport review **not run**.
- No enquiry form validation (Step 43).

---

## Steps 11–14 summary

| Step | What exists                                              | Production `/dev/ui`  |
| ---- | -------------------------------------------------------- | --------------------- |
| 11   | Tokens, contrast table, guarded gallery                  | 404 when last checked |
| 12   | Button, links, badge, card, container, section, heading  | 404 when last checked |
| 13   | Form fields, error summary, inline status, local demo    | 404 when last checked |
| 14   | Skip link, `SiteShell`, one main, documented composition | 404 (port 3014)       |

These steps 11–24 are merged to `main`. Steps 25–42 are on stacked feature branches (`feature/25-home-process` … `feature/42-contact-layout`).

---

## Pending founder inputs (high priority)

1. Confirm or correct service delivery capacity for all six groups.
2. Supply approved founder profiles (especially the two unnamed founders).
3. Confirm contact details and provide missing LinkedIn URL / production domain. **Email + WhatsApp confirmed in Step 42**; phone voice calls and social URLs still open.
4. Provide logo files and portrait/project publication permissions.
5. Choose and approve 2–3 launch project stories with honest status labels.
