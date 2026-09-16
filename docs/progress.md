# Zatroz progress — Steps 01–10

Track setup progress honestly. Mark a step **Implemented** only when its deliverable files exist. Business decisions may remain pending.

| Step | Result                         | Status                                         | Date       | Evidence                                                                                                                  |
| ---- | ------------------------------ | ---------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------- |
| 01   | Scope and decision register    | **Implemented**                                | 2026-09-16 | `docs/planning/01-project-scope.md`, `docs/planning/decision-register.md`                                                 |
| 02   | Content and asset inventory    | **Implemented**                                | 2026-09-16 | `docs/content/*` files listed in Step 02 notes below                                                                      |
| 03   | Sitemap and visitor journeys   | **Implemented**                                | 2026-09-16 | `docs/planning/03-sitemap.md`, `visitor-journeys.md`, `navigation-spec.md`                                                |
| 04   | Verified local toolchain       | **Implemented**                                | 2026-09-16 | `docs/setup/local-environment.md` — node/npm/git checks passed                                                            |
| 05   | Local Git and GitHub workflow  | **Implemented**                                | 2026-09-16 | Local commit + merge with remote initial README; push to `origin/main`                                                    |
| 06   | Working Next.js starter        | **Implemented**                                | 2026-09-16 | Next.js 16.3.5 starter; `npm run build` + localhost 200 + hot reload verified; see `docs/setup/project-initialization.md` |
| 07   | Repeatable quality checks      | **Implemented** (on branch `setup/07-quality`) | 2026-09-16 | Prettier + ESLint CLI scripts; `npm run check` and `npm run build` passed; see `docs/setup/quality-checks.md`             |
| 08   | Documented folder structure    | Not started                                    | —          | —                                                                                                                         |
| 09   | Cursor project rules           | Not started                                    | —          | —                                                                                                                         |
| 10   | Safe environment configuration | Not started                                    | —          | —                                                                                                                         |

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

---

## Pending founder inputs (high priority)

1. Confirm or correct service delivery capacity for all six groups.
2. Supply approved founder profiles (especially the two unnamed founders).
3. Confirm contact details and provide missing LinkedIn URL / production domain.
4. Provide logo files and portrait/project publication permissions.
5. Choose and approve 2–3 launch project stories with honest status labels.
