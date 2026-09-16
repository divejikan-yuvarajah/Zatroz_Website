# Zatroz — Cursor AI prompt pack: Steps 01–10

Prepared for Divejikan and the Zatroz founding team · 16 September 2026

This file turns the first ten steps of our 72-step website roadmap into separate implementation prompts. By the end, you should have the project decisions documented, assets inventoried, a GitHub workflow, a working Next.js starter, quality checks, a clear folder structure, Cursor rules, and safe environment configuration.

The actual design system starts at Step 11. Database provisioning and schema creation remain in Steps 44–46; this pack prepares their configuration without creating a database or asking for credentials early.

## How to use this file

1. Install and open Cursor if you have not already done so. Step 4 checks the rest of your development tools.
2. Create or open your intended `zatroz-website` project folder. Keep this file there as a reference. You can place it under `docs/prompts/`.
3. If available, also attach `Zatroz_Website_Development_Plan.docx`, or export its text into `docs/reference/website-development-plan.md`. Do not pretend Cursor has read a file it cannot access.
4. Start a Cursor Agent conversation and paste the **session instruction** below, then **only one numbered prompt**. Alternatively, attach this file and say: “Read this file and execute Step 01 only, using the session instruction.”
5. Review the changed files, complete the checks, and save the checkpoint before requesting the next step. Start a fresh chat for a new step when useful; the repository documents preserve context.
6. Replace any `YOUR_...` values in manual commands before running them. Do not paste private credentials into chat.

Steps 1–3 create planning documents and need no Node.js installation. Step 5 makes the first Git checkpoint for those documents. From Step 6 onward, use one branch and review cycle per step. A missing logo or founder photo is a recorded content task, not a reason to block technical setup.

### Session instruction — paste once per new Cursor conversation

```text
You are my senior full-stack engineer and patient mentor for the Zatroz website. I am learning React and will review your work in Cursor.

Execute only the step I select from this prompt pack. Read existing project instructions and relevant repository files first. Explain the short implementation plan, then do the authorized local work. Do not simply describe code that you could write.

Preserve existing files and user changes. Never replace the repository, erase Git history, force-push, or discard unrelated work. Reuse the installed stack and lockfile. Before new dependencies, explain their concrete purpose and use versions compatible with this project. Do not upgrade the framework during unrelated steps.

Use easy English. Distinguish completed work, proposed decisions, missing inputs, and checks you actually ran. If you cannot run something, give the exact manual check and label it not run. Never claim a successful build, browser review, commit, or push without evidence.

Keep sensitive values out of chat, source code, screenshots, logs, and commits. Use placeholders in examples. Do not read or print private environment-file contents. Do not buy services, deploy the website, change account permissions, or publish business claims as part of these steps.

Create a focused implementation. Do not build future pages, a database, authentication, admin dashboards, animation systems, or fake integrations ahead of their step.

At completion, report: what changed and why; files changed; checks with actual results; unresolved items; manual actions; and the suggested Git commit. Do not automatically advance to the next step. Prepare the Git checkpoint for my review; I will commit and push after checking it unless I explicitly ask you to do that for me.
```

## Shared project decisions

These are the working baseline from the website plan. Step 1 records their status and any changes.

| Topic | Baseline |
| --- | --- |
| Company | Zatroz, a service-based IT startup with three founders |
| Audience | SMEs and local businesses in Sri Lanka, with room for international clients |
| Main goal | Generate qualified project enquiries |
| Primary CTA | Start a project |
| Secondary CTAs | Explore our work; Chat on WhatsApp |
| Launch language | English; keep content suitable for later Tamil/Sinhala expansion |
| Frontend | Next.js App Router, React, TypeScript, Tailwind CSS |
| Content | Repository-managed content; no CMS at launch |
| Backend later | Next.js server endpoint, Supabase PostgreSQL enquiries, Resend notifications |
| Spam protection later | Turnstile verification and rate limiting |
| Hosting later | GitHub and Vercel, with a plan suitable for business use |
| Design direction | Warm-white editorial layout, charcoal sections, original business workflow illustrations |
| Main colours | Orange `#FF3B10`, charcoal `#111111`, warm white `#F7F5F2` |
| Typography later | Manrope; optional IBM Plex Mono for limited labels |
| Hero direction | “Connected business” with three labelled business examples |
| Motion later | CSS first; limited GSAP; respect reduced-motion preferences |
| Launch exclusions | Customer login, sign-up, custom admin, payments on Zatroz's own site, live AI chatbot, file uploads |

The company may build commerce and AI tools **for clients**; this does not mean the Zatroz marketing website needs its own checkout or AI service.

Use dark text on the bright orange primary button. Do not assume white small text on `#FF3B10` is accessible. Final token and contrast checks belong in Step 11.

### Step map

| Step | Result | Suggested branch after Git setup |
| --- | --- | --- |
| 01 | Scope and decision register | Included in first commit |
| 02 | Content and asset inventory | Included in first commit |
| 03 | Sitemap and visitor journeys | Included in first commit |
| 04 | Verified local toolchain | Included in first commit |
| 05 | Local Git and GitHub workflow | Initial `main` checkpoint |
| 06 | Working Next.js starter | `setup/06-nextjs` |
| 07 | Repeatable quality checks | `setup/07-quality` |
| 08 | Documented folder structure | `setup/08-structure` |
| 09 | Cursor project rules | `setup/09-cursor-rules` |
| 10 | Safe environment configuration | `setup/10-environment` |

## Step 01 — Confirm project scope

**Goal:** Give Cursor a dependable source of truth before generating website code.

**Before starting:** Open the intended project folder. Attach the existing plan if available. No account, database, or framework setup is required.

### Copy into Cursor

```text
Execute Step 01 only: document the Zatroz website launch scope.

Read the session instruction and Shared project decisions in this prompt pack. Inspect existing planning documents and project instructions. If the original website plan is attached and readable, use it. If it is unavailable, use this pack and clearly record that limitation.

Create or carefully update:
- docs/planning/01-project-scope.md
- docs/planning/decision-register.md
- docs/progress.md

In the scope document, include:
1. Company overview and intended audience in plain English.
2. The business goal: useful project enquiries, not just visual attention.
3. The main visitor questions: what we build, who it helps, proof of work, delivery process, and how to start.
4. Launch scope: eight general pages, six service detail pages, and two or three verified project stories.
5. General pages: Home, About, Services, Work, Process, Contact, Privacy, Terms.
6. Service groups: Websites and E-commerce; Web and Mobile Applications; Business Systems; AI and Automation; Custom Software; UI/UX Design. Mark actual delivery capacity for founder confirmation.
7. The planned enquiry flow: validate, save durably, report success, notify the team, and recover notification failures. This is a requirement, not an implementation task now.
8. Responsive, accessibility, performance, security, SEO, and maintainability requirements. Identify measurable future checks without claiming current compliance.
9. Explicit later features: CMS, admin, customer accounts, booking integration, insights, products, and live AI experiences only when justified.
10. Technical baseline from this pack and why a separate Express server is unnecessary for this launch scope.
11. Content and business dependencies, assigned to roles where names are unknown.
12. A clear definition of launch readiness and a small procedure for handling scope changes.

In the decision register, use columns: ID, decision, current choice, status, owner, reason, and evidence needed. Use statuses Proposed, Confirmed, or Needs input. Record reasonable technical defaults as proposed; do not imply the founders approved them.

Do not invent client relationships, founder names, awards, statistics, dates, prices, legal registration, or delivery promises. Record unresolved facts as TODO items. Only ask a question immediately if its answer prevents completing this documentation safely; otherwise finish with explicit assumptions.

Create a progress checklist for Steps 01–10 with dates/evidence fields. Mark Step 01 implemented only after the files exist. Business decisions can remain pending without hiding them.

Do not initialize a framework or create application code. Verify that launch and later scope do not contradict each other, the page counts match, and every missing business fact has a clear status. Finish with a short review summary and the suggested commit message: docs: define Zatroz launch scope.
```

**Your review:** Check the services, audience, launch scope, and CTA. Tell Cursor which proposed decisions you confirm. Keep unknown facts marked as unknown.

**Checkpoint:** The three files exist; all eight general pages and six service groups are accounted for. Save locally now; include them in Step 5's initial commit.

## Step 02 — Prepare content and assets

**Goal:** Identify exactly what the team needs to supply, where it belongs, and whether it can be published.

**Before starting:** Step 1 documents exist. Supply available logos, founder details, and project materials. Missing items may remain TODOs.

### Copy into Cursor

```text
Execute Step 02 only: build Zatroz's content and asset preparation system.

Read the session instruction, shared decisions, docs/planning/01-project-scope.md, and decision-register.md. Inspect only supplied reference and asset files relevant to this task.

Create or update:
- docs/content/content-inventory.md
- docs/content/asset-register.md
- docs/content/founder-profile-template.md
- docs/content/project-story-template.md
- docs/content/brand-and-contact.md
- docs/content/asset-guidelines.md
- docs/progress.md

Content inventory: list each launch page, required sections, source material, owner, status, and missing inputs. Use statuses Missing, Draft, Needs review, Approved. Do not mark generated copy as approved.

Asset register: include asset ID, proposed filename, intended page, supplied source path, proposed public path, owner, publication permission, caption or alt-text requirement, and status. Inventory real supplied files; use an explicit missing status for everything else.

Founder template: approved display name, role, short bio, responsibilities, portrait, public profile links, and consent. There are three founders; do not invent the two missing identities or assume every role.

Project template: title, slug proposal, status (client work/live product/prototype/research concept), problem, audience, actual team and Zatroz contribution, solution, features, stack, screenshots, verified results, links, publication permission, and limitations. Keep individual founder or hackathon work distinguishable from Zatroz client work. Suggest two or three launch stories based on available evidence, not name recognition alone.

Brand/contact record: preserve supplied facts and flag them for launch confirmation. Known working contacts are +94 768098068, zatroz.co@gmail.com, Instagram handle zatroz.co, and LinkedIn display name Zatroz. Do not guess the LinkedIn URL, domain, address, opening hours, or response-time promise. Record supplied logo variants and colours without redrawing the logo.

Asset guidelines: lowercase descriptive filenames with hyphens, intended use, image dimensions recorded from actual files, export formats suited to the asset, accessibility descriptions, and a prohibition on embedding private customer information in screenshots. Original files and unapproved material stay outside public/. Anything placed in public/ may later be directly accessible by URL.

Do not download competitor assets, create fake team portraits, manufacture testimonials, publish package prices, or move unapproved files into public/. Do not write full website pages yet. If the repository may become public, keep private approvals and raw source materials outside Git and reference their owner instead.

Verify coverage of all launch pages, identify the highest-priority missing items, update progress, and report the five most useful next content actions. Suggested commit: docs: prepare content and asset inventory.
```

**Your review:** Confirm contact details and identify the owner of each missing item. Review project attribution carefully.

**Checkpoint:** Every launch page has content requirements; no missing asset is presented as supplied or approved. Include these documents in Step 5's initial commit.

## Step 03 — Define the sitemap and visitor journeys

**Goal:** Set the route names and navigation before creating page files.

**Before starting:** Steps 1–2 are documented.

### Copy into Cursor

```text
Execute Step 03 only: document the route map and visitor journeys.

Read the session instruction and the planning/content documents from Steps 01–02.

Create:
- docs/planning/03-sitemap.md
- docs/planning/visitor-journeys.md
- docs/planning/navigation-spec.md
Update docs/progress.md and the decision register if necessary.

Use these canonical launch routes:
/ — Home
/about — About
/services — Services overview
/services/websites-ecommerce
/services/web-mobile-apps
/services/business-systems
/services/ai-automation
/services/custom-software
/services/ui-ux-design
/work — Work overview
/work/[slug] — individual project story
/process — Process
/contact — Contact
/privacy — Privacy
/terms — Website terms

For each route, document purpose, audience, core sections, content dependency, main CTA, and related routes. Explain that [slug] represents a real project's URL segment; two or three project entries produce two or three detail pages. Use /work/[slug] as the single case study address; do not add duplicate /case-studies routes.

Define desktop navigation with Services, Work, About, Process, and Start a project. The logo links Home. Keep Privacy and Terms in the footer. Plan a simple mobile menu with all primary destinations, a visible close control, Escape support, focus return, and appropriate modal behaviour if implemented as an overlay. Do not implement the menu now.

Document at least these journeys:
1. Business owner: Home -> relevant service -> Contact.
2. Visitor evaluating capability: Home/Work -> project story -> Contact.
3. Visitor evaluating the people: About -> Process -> Contact.
4. Visitor unsure what they need: service explorer -> Contact with Not sure available.
5. Returning visitor: direct contact/WhatsApp option.

Use /contact?service=websites-ecommerce as the proposed service preselection pattern and document all six allowed slug values. Unknown query values must later fall back safely to an unselected/Not sure state; the query must never be treated as trusted server input. Never place names, emails, or descriptions in query strings.

Specify links versus buttons: navigation changes destination; buttons perform actions. A WhatsApp click is not proof of a conversation. A meeting preference is a request, not a booking. Keep those distinctions in future measurement requirements.

Add a compact Mermaid journey diagram only if it clarifies branching, and include a text explanation. Mark Labs, Products, Insights, Careers, Pricing, and Support as later additions with clear content/operational triggers.

Do not create route folders, page components, redirects, metadata, forms, or analytics yet. Check route uniqueness, page counts, CTA destinations, and that every journey has a useful next action. Suggested commit: docs: map routes and visitor journeys.
```

**Your review:** Read the journey as a business owner: can you identify a service, assess evidence, and reach contact?

**Checkpoint:** Route names are consistent and no duplicate case-study URL scheme is planned. Include these files in the initial Git commit.

## Step 04 — Set up your local development environment

**Goal:** Ensure the terminal inside Cursor can run the tools required by this project.

**Manual setup:** Use Windows 11 with PowerShell unless you deliberately choose Ubuntu. Keep one working checkout per operating environment; do not reuse the same `node_modules` between Windows and Linux.

Install Cursor, Git, and a supported Node.js LTS release through their official installers if absent. Node 24 LTS is the baseline for this pack; record the actual supported patch you install and check compatibility before initialization. npm is included with the standard Node installer. Restart Cursor after installation. See [Node downloads](https://nodejs.org/en/download), [Git installation](https://git-scm.com/downloads), and [Cursor downloads](https://cursor.com/downloads).

### Copy into Cursor

```text
Execute Step 04 only: inspect and document my local development environment.

Read the session instruction and project documents. Identify the actual operating system and active shell. Prefer my existing functioning setup; do not install a second toolchain or switch to WSL automatically.

Run read-only checks for node --version, npm --version, and git --version. Check their executable locations using commands appropriate to the current shell. Report only relevant tool paths and versions, not a full environment dump.

Use Node 24 LTS as the proposed baseline if installing fresh. Verify its current support and the selected Next.js requirements using official documentation. If a different supported LTS is already installed and compatible, explain whether we can keep it. Do not recommend an end-of-life release simply because it meets an old minimum version.

If a tool is missing, give exact manual steps using its official installer for my OS, then explain how to reopen the terminal and recheck it. Do not run unreviewed downloaded scripts, change machine-wide policies, use sudo npm, or silently change my global Git identity. If PowerShell blocks npm.ps1, check whether npm.cmd works before proposing any policy change.

Create docs/setup/local-environment.md with:
- OS and chosen shell, excluding personal machine identifiers.
- Actual verified Node, npm, and Git versions.
- Intended project folder, represented portably in shared documentation.
- Tool installation/check instructions.
- How to open the project folder in Cursor.
- How to open the integrated terminal in the project root.
- What localhost means and how Ctrl+C stops a dev server later.
- Common PATH, wrong-directory, permissions, and Windows/Linux dependency issues.
- Optional editor extensions: ESLint, Prettier, and Tailwind CSS IntelliSense, without installing unrelated extensions.

Update docs/progress.md. Do not scaffold Next.js, create Git remotes, or provision external services. If installation is incomplete, mark the step pending and list only the remaining manual checks. Otherwise mark verified and suggest commit: docs: record local development setup.
```

**Manual verification commands:** These work in PowerShell and Bash when the tools are installed.

```sh
node --version
npm --version
git --version
```

**Checkpoint:** All three commands succeed in Cursor's terminal. Save the document for the initial Git commit.

## Step 05 — Create the GitHub repository and workflow

**Goal:** Protect your planning work and establish small, reviewable checkpoints.

**Before starting:** Step 4 is verified. Create an empty GitHub repository named `zatroz-website` under the correct account or organisation. Private is the working choice for initial development. Leave README, licence, and `.gitignore` initialization unchecked because local files already exist. Use your normal GitHub sign-in flow; credentials do not belong in prompts. This follows [GitHub's existing-code import workflow](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github).

### Copy into Cursor

```text
Execute Step 05 only: prepare local Git and document the GitHub workflow.

Read the session instruction and inspect the project folder. First determine whether Git is already initialized, which repository root applies, whether there are existing changes, and whether a remote exists. Do not initialize inside another repository by accident or overwrite an existing origin.

If this is the intended new standalone project and Git is absent, initialize it with main as the initial branch. If Git identity is missing, explain the local repository identity settings and let me supply the name/email; do not guess my preferred commit email or modify global settings.

Create or merge .gitignore entries for node_modules/, .next/, out/, coverage/, *.tsbuildinfo, local logs, .vercel/, private environment files, and private raw asset material if present. Ignore .env and .env.* but explicitly allow !.env.example. The example will be created at Step 10. Preserve useful existing ignore entries.

Create or update:
- README.md: project purpose, current stage, document links, and setup status. No claim of deployed functionality.
- docs/setup/git-workflow.md: local versus remote, main branch, per-step branch, reviewing diffs, staging specific files, commits, pushes, PR review, merge, and returning to main.
- docs/progress.md.

Inspect the list of files that would be tracked. Identify private documents, secrets, or raw assets by path without opening their sensitive contents. Confirm the chosen .gitignore works. Do not use blanket staging that could include unrelated files.

For a supplied correct repository URL, explain the appropriate remote command. Add origin only when absent; if it exists, report whether it matches. Do not replace or remove an existing remote automatically. Never put a token in the URL.

Prepare exact initial commit and push commands for my review, using explicit actual safe paths and a verified remote. Do not commit or push automatically under this pack's workflow. Suggested initial commit: docs: initialize Zatroz planning and setup.

Explain an initial push to the empty repository, followed by per-step branches and pull requests. No force-push. Do not create a public deployment, change visibility, invite collaborators, add a licence without a business decision, or claim branch protection is enabled when it has not been configured.

Verify Git root, branch, ignore behaviour, and local document completeness. Record remote connection and first push as pending until I actually complete them.
```

**Example manual commands:** Run only after reviewing the staged files and replacing the URL. Skip `git remote add` if the correct remote already exists. Cursor should adapt the file list to your actual checkout.

```sh
git status
git add README.md .gitignore docs/
git diff --cached --stat
git diff --cached
git commit -m "docs: initialize Zatroz planning and setup"
git remote add origin https://github.com/YOUR_ACCOUNT/zatroz-website.git
git push -u origin main
```

Only stage `docs/` after confirming it contains no private material. If Git reports missing identity, set repository-local values using your actual name and chosen GitHub commit email:

```sh
git config --local user.name "YOUR_COMMIT_NAME"
git config --local user.email "YOUR_COMMIT_EMAIL"
```

**Checkpoint:** The first commit is visible in the correct GitHub repository. Update the progress record with the observed result.

## Step 06 — Initialize Next.js, React, TypeScript, and Tailwind CSS

**Goal:** Get a minimal application running while preserving all existing planning files and Git history.

**Before starting:** The local toolchain works and Step 5 has a clean checkpoint. Create `setup/06-nextjs` from the current `main`.

The setup choices below use the official [Next.js installation guide](https://nextjs.org/docs/app/getting-started/installation) and [create-next-app options](https://nextjs.org/docs/app/api-reference/cli/create-next-app). Let Cursor record the actual installed versions rather than relying on an old tutorial's version numbers.

### Copy into Cursor

```text
Execute Step 06 only: initialize the Zatroz Next.js starter safely.

Read the session instruction, planning documents, local-environment.md, git-workflow.md, and any existing AGENTS.md. Inspect package.json, the lockfile, current source, and Git status if they exist.

Target: Next.js App Router, React, TypeScript, Tailwind CSS, ESLint, npm, src/ directory, and @/* alias pointing to src/. Use the current stable compatible scaffold on first initialization and keep its resolved versions afterward. Do not choose canary releases, a separate backend, or experimental features. Keep React Compiler off for this baseline unless the existing approved project already uses it.

If the app already exists, verify and adapt it with a focused diff; do not rerun create-next-app over it.

If no app exists, account for the fact that this repository already has docs/, README.md, and .git/. Generate a fresh scaffold in a new temporary sibling directory with Git initialization disabled. Use a unique non-existing directory; do not overwrite or delete another folder. Consult the CLI help if a flag differs.

Then inspect and transfer only the necessary generated application/configuration files into the actual repository. Do not transfer node_modules, .next, a generated .git directory, or overwrite our README/.gitignore/instructions. Merge useful generated README notes and ignore entries. Preserve generated framework AGENTS.md guidance where applicable by merging with existing instructions; do not silently replace either. Keep the temporary source until the merge and checks are verified.

Ensure the actual package name is zatroz-website. Install dependencies in the real repository and retain one package-lock.json synchronized with package.json. Record the chosen versions and Node compatibility in docs/setup/project-initialization.md. Store the actual Node patch in .nvmrc for developers using nvm and explain that this file alone does not install Node on Windows. Use a supported Node major constraint in package.json engines consistent with our environment.

Keep only a simple semantic starter page showing Zatroz and a short development placeholder. The layout must contain html lang="en" and body. Remove demo marketing links and unnecessary remote font requests. Use a system font temporarily; the typography system comes later. Keep Tailwind's generated configuration for its installed major version; do not paste old configuration blindly.

Do not implement the hero, navigation, footer, services, database, email, analytics, or animations. Preserve a normal server-capable Next.js build; do not configure output: export because later enquiries need a server endpoint.

Verify npm run dev, the localhost page, hot reload, and npm run build. If browser access is unavailable, distinguish terminal checks from the manual browser check I must do. Record actual results, changes, and unresolved issues in docs/progress.md. Suggest commit: chore: initialize Next.js application.
```

**Reference scaffold command:** This is for a new temporary sibling directory, not the already populated project root. Cursor should first verify the directory does not exist and check the current CLI options.

```sh
npx create-next-app@latest zatroz-scaffold-temp --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-react-compiler --disable-git
```

If prompted, use the choices in the prompt. The CLI may include framework agent guidance; preserve applicable instructions during the controlled merge. Run the app commands **in the real `zatroz-website` root after the merge and dependency installation**:

```sh
npm run dev
```

Open the local URL printed in the terminal, normally `http://localhost:3000`. Stop the dev server before the separate production check:

```sh
npm run build
npm run start
```

**Checkpoint:** The app loads, a small edit updates it, the production build passes, and the planning files and original Git history remain intact. Review and commit before merging the branch.

## Step 07 — Configure formatting, linting, type checking, and builds

**Goal:** Make errors visible through a small set of repeatable commands.

**Before starting:** Step 6 is merged. Work on `setup/07-quality`.

Use ESLint directly with Next.js's compatible configuration and integrate Prettier without duplicate style rules. See [Next.js ESLint configuration](https://nextjs.org/docs/app/api-reference/config/eslint). Current Next.js supports generating route types before standalone TypeScript checks; see [the Next.js CLI](https://nextjs.org/docs/app/api-reference/cli/next).

### Copy into Cursor

```text
Execute Step 07 only: configure minimal project quality tools.

Read the session instruction and inspect installed versions, package scripts, TypeScript settings, ESLint configuration, and editor settings. Extend the existing setup rather than replacing it.

Keep ESLint with the Next.js Core Web Vitals and TypeScript configurations compatible with the installed framework. Use the ESLint CLI, not next lint. Add Prettier and eslint-config-prettier as development dependencies if missing; explain their roles. Keep the lockfile current. Do not add Husky, lint-staged, a testing framework, or a second linter in this step.

Provide these npm scripts, adapting the implementation only when installed versions require it:
- dev: next dev
- build: next build
- start: next start
- lint: eslint . --max-warnings=0
- lint:fix: eslint . --fix
- typecheck: next typegen && tsc --noEmit
- format: prettier . --write
- format:check: prettier . --check
- check: npm run format:check && npm run lint && npm run typecheck

Keep TypeScript strict. If next typegen is unavailable in the already installed version, use its documented equivalent without a framework upgrade just for this script. Document the selected behaviour.

Create a small Prettier config with consistent semicolons, quotes, indentation, and line width. Preserve content meaning while formatting. Exclude generated output, dependencies, lockfiles, private .env files, external reference documents, and unsupported binary assets using the appropriate ignore files. Never format or print secrets.

Merge project-level .vscode/settings.json settings for Prettier as the formatter and format-on-save, without overwriting unrelated settings or using machine-specific absolute paths. Document optional extension installation rather than assuming it happened.

Create docs/setup/quality-checks.md explaining each command, expected success, common failures, and the difference between formatting, static checks, builds, and real browser testing. A successful build does not replace linting or accessibility review.

Run a scoped initial formatting pass, then npm run check and npm run build. Fix actual errors; do not disable rules or strictness just to turn checks green. Review the diff for unintended changes. Add actual results to docs/progress.md. Suggested commit: chore: configure formatting and quality checks.
```

**Your verification:** Run `npm run check` and `npm run build`. Both should finish successfully. The `check` script is a convenience; it does not include the build.

**Checkpoint:** The commands exist, their purpose is documented, and the changes do not alter business content. Review and commit this step.

## Step 08 — Create the project folder structure

**Goal:** Establish clear locations for future code without generating unused implementations.

**Before starting:** Step 7 checks pass and the branch is merged. Work on `setup/08-structure`.

### Copy into Cursor

```text
Execute Step 08 only: organise the Zatroz project structure.

Read the session instruction, sitemap, initialization record, installed project structure, and applicable instructions. Preserve Next.js-generated conventions and existing working imports.

Create docs/architecture/folder-structure.md with a path-purpose table, import boundaries, and the proposed future route locations. Use this baseline, adapting only where existing project conventions have a clear advantage:
- src/app/ — Next.js route files and route-level composition.
- src/app/layout.tsx — root document layout.
- src/app/page.tsx — the current minimal home route.
- src/app/globals.css — global styles; preserve the working Tailwind entry.
- src/components/ui/ — small reusable interface components later.
- src/components/layout/ — header, mobile navigation, footer later.
- src/components/sections/ — page sections later.
- src/components/forms/ — accessible enquiry form components later.
- src/content/ — service, project, founder, FAQ, and site copy later.
- src/config/ — public-safe site/navigation settings later.
- src/lib/ — genuinely shared utilities; no secret-bearing barrel exports.
- src/server/ — server-only environment access and integrations later.
- src/types/ — shared domain types only when used.
- public/brand/, public/images/projects/, public/images/team/, public/fonts/ — approved public assets only.
- docs/ — planning, setup, architecture, content, and progress.
- supabase/migrations/ — actual database migrations starting at the database steps.

Create the appropriate non-route organisational directories, using tiny .gitkeep files only where an empty directory needs to survive Git. Do not create pretend modules to fill folders. Document the future supabase/migrations path without generating SQL, a Supabase project, or DB tooling now.

Keep /about, /services, /work, /process, /contact, /privacy, /terms, and detail routes as documented future locations. Do not generate empty page.tsx files or broken links for pages that have not been built. Keep root configuration files in the root and assets under public/ at the root, not src/public/.

Document thin route files, small feature components, server-side content by default, and client components only for browser interaction. Server modules must never be imported by client components or shared re-export files. Do not add an entire server-only integration until it is needed.

Use lowercase kebab-case filenames for application modules and PascalCase exported React component names, respecting required framework filenames. Avoid a global catch-all index.ts, unused hooks, providers, Redux, repositories, or a generic service framework.

Keep the current page working. Check the @/* alias resolves to src/* and no source was duplicated or lost. Run npm run check and npm run build; report any checks not run. Update docs/progress.md. Suggested commit: chore: establish project structure.
```

**Your review:** Ask Cursor where a future service description, homepage section, server credential helper, and project image belong. Its answers should match the architecture document.

**Checkpoint:** The current application still works; folders are understandable and there are no fake page implementations. Review and commit.

## Step 09 — Add Cursor project instructions

**Goal:** Give future Cursor sessions concise, repository-specific guidance.

**Before starting:** Step 8 is merged. Work on `setup/09-cursor-rules`.

Project rules use Markdown content with frontmatter in `.cursor/rules/`. An always-applied rule is suitable for the short core workflow; contextual rules can describe when they apply. Confirm loading in your Cursor installation. See [Cursor's official rules documentation](https://cursor.com/docs/rules).

### Copy into Cursor

```text
Execute Step 09 only: create concise Cursor project rules for Zatroz.

Read the session instruction, existing AGENTS.md and other repository instructions, current Cursor rules if any, planning decisions, folder-structure.md, and quality-checks.md. Verify the rule format against Cursor's official documentation if needed. Do not replace applicable framework-generated guidance or change instructions to bypass a constraint.

Create or merge these .mdc files under .cursor/rules/:
1. 00-project-core.mdc — alwaysApply: true. Short project purpose, one-step scope, read-before-edit workflow, preserve user changes, explain results accurately, inspect dependencies, use documented npm checks, and review before Git publication.
2. 10-frontend.mdc — contextual rule for frontend work. Semantic HTML, responsive layouts, keyboard support, small components, server/client separation, and reduced-motion behaviour when animation is introduced.
3. 20-content-and-design.mdc — contextual rule for UI and content. Approved orange/charcoal/warm-white direction; use the actual logo; no invented proof or client claims; no premature pricing; use existing design tokens once Step 11 creates them; consistent routes and CTAs.
4. 30-server-and-data.mdc — contextual rule for server/data work. Server-only credentials, validation at the boundary, no public enquiry access, no PII in logs, durable save before success, bounded retry requirements, and separate test/production data when integrations are built.

For the contextual rules, use clear descriptions with alwaysApply: false so the agent can select them when relevant. Avoid mixing vague globs and descriptions that imply a loading behaviour we have not verified. Keep each rule focused and brief; link to authoritative local planning documents rather than copying the entire plan.

Create docs/setup/cursor-workflow.md explaining:
- How to select one step and attach relevant files.
- How to start a fresh session using the project docs.
- How to inspect which rules are included in context in the available Cursor UI.
- How to review a diff and ask for a focused correction.
- How to request an explanation of unfamiliar React/TypeScript code.
- How to track a blocked check instead of claiming it passed.
- How to check, commit, push a step branch, and review its PR.

Explicitly say rules guide the agent; they are not a secret vault or an enforcement mechanism. Do not store credentials in rules. Do not create a second legacy .cursorrules file. Do not install MCP servers, skills, agent plugins, or extensions in this step.

Verify the frontmatter is valid and file references resolve. Confirm rule activation in Cursor if that UI is accessible; otherwise give me the exact manual action and label activation not verified. Update docs/progress.md. Do not change application behaviour. Suggested commit: chore: add Cursor project rules.
```

**Your verification:** In a fresh chat, ask: “Which Zatroz rules are in context? What is the current step, and which commands check this project?” Compare the answer with the actual included rules and repository scripts; an answer alone is not proof that automatic loading works.

**Checkpoint:** Core guidance is available, contextual rules are clearly described, and existing framework instructions remain intact. Review and commit.

## Step 10 — Set up environment variables and secret boundaries

**Goal:** Prepare clean configuration while allowing public pages to run with no external service credentials.

**Before starting:** Step 9 is merged. Work on `setup/10-environment`. You do not need to create Supabase, Resend, or Turnstile accounts yet.

Next.js exposes `NEXT_PUBLIC_` variables to browser bundles and freezes those values at build time. Treat them as public information. Keep `.env.local` in the project root. See [Next.js environment variables](https://nextjs.org/docs/app/guides/environment-variables).

### Planned environment contract

| Variable | Classification | Required when |
| --- | --- | --- |
| `SITE_URL` | Public-safe value, read on server | Production metadata and URL generation; localhost during setup |
| `SUPABASE_URL` | Server configuration, not itself a secret | Enquiry persistence in later steps |
| `SUPABASE_SECRET_KEY` | Server secret | Enquiry persistence in later steps |
| `RESEND_API_KEY` | Server secret | Email delivery in later steps |
| `ENQUIRY_FROM_EMAIL` | Server configuration | Verified notification sender is configured |
| `ENQUIRY_NOTIFICATION_EMAIL` | Server configuration | Team notification recipient is confirmed |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public | Contact spam protection is implemented |
| `TURNSTILE_SECRET_KEY` | Server secret | Server verification is implemented |
| `CRON_SECRET` | Server secret | Protected notification retry job is implemented |

`SUPABASE_SECRET_KEY` is our planned application variable name, to be mapped to the supported server credential issued during the later setup. Never put a publishable key there as a substitute. No public Supabase client or login is needed for this marketing-site architecture.

### Copy into Cursor

```text
Execute Step 10 only: prepare safe environment configuration.

Read the session instruction, server/data rule, architecture documents, current imports, and ignore files. Do not open or print an existing private environment file. Inspect filenames and Git tracking status only. If .env.local exists, preserve it and provide manual instructions for missing entries without displaying its values.

Create or update .env.example with helpful comments and exactly these planned variables:
SITE_URL=http://localhost:3000
SUPABASE_URL=
SUPABASE_SECRET_KEY=
RESEND_API_KEY=
ENQUIRY_FROM_EMAIL=
ENQUIRY_NOTIFICATION_EMAIL=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
CRON_SECRET=

Use blank values for unavailable service configuration; never insert real keys or plausible-looking credentials. Explain which values become required in later steps. Do not add NEXT_PUBLIC_ to server credentials or use next.config env to expose them. Do not manually set NODE_ENV in these files.

Ensure .gitignore excludes .env and .env.* while allowing !.env.example. If .env.local does not exist, create a local copy of this blank template. Do not overwrite an existing file. Add matching exclusions to formatting tools. Create or merge a .cursorignore entry for private env files, keeping the example accessible, while documenting that ignore rules do not replace real access control or safe terminal behaviour.

Implement only the configuration needed now:
- src/server/env.ts, protected with import 'server-only' using the supported package if it must be added.
- A small getSiteUrl() helper returning a normalized http/https URL from SITE_URL.
- Permit localhost fallback for development and this foundation's local production-build checks, because the production domain is not yet chosen. Document that Step 67 must set and verify the real production URL before any public release; do not claim automatic enforcement now.
- Reject a supplied malformed or non-http(s) SITE_URL with a clear error mentioning the variable name, never printing sensitive values.

Do not eagerly require Supabase/email/Turnstile/cron credentials on import. Do not initialize external clients, send email, connect a database, add a retry job, or build an enquiry endpoint. Define the future validation rules in docs/setup/environment-variables.md; implement each service's lazy validation only when that integration is introduced. A public-page build must work with all future service variables blank.

Do not create a shared object or barrel export combining public and private variables. There is no need for a client environment helper until an actual browser feature needs one. The site URL helper should remain server-only and should not require a forced client component or dynamic rendering of the entire site.

Create docs/setup/environment-variables.md covering the variable table, root-level file locations, how to copy the example without overwriting an existing file, restarting the dev server after local changes, build-time public values, safe missing-variable messages, and later local/preview/production separation. Explain that preview notifications must use test recipients and data. Record account dashboards as later manual setup, not completed setup.

Verify without exposing values:
1. git check-ignore confirms .env.local is ignored and .env.example is not ignored.
2. The tracked-file list contains no private environment files. If one was already committed, report the affected path and a focused remediation plan; do not claim .gitignore erased history or silently rewrite it. A real leaked credential must be rotated by its owner.
3. npm run check and npm run build work with blank future integration values. If my private env file exists, do not modify it for this test; verify a clean temporary checkout or provide a manual isolated procedure and label it not run.
4. Manually exercise the site URL helper with localhost, a valid example-domain URL, and an invalid URL in an appropriate server-capable check. Record actual results; do not expose secrets or add a dependency-heavy test harness.
5. Open the starter page after the change and confirm it works, or provide the manual browser check if unavailable.

Update docs/progress.md and the README's setup instructions. At the end, summarize Steps 01–10 with evidence, pending content inputs, and readiness for Step 11. Suggest commit: chore: configure environment variables safely.
```

**Your verification:** Keep real credentials out of the example and Git. The starter should still run while all future integration values remain blank. If you already have `.env.local`, preserve it and use an isolated copy for the blank-environment check.

**Checkpoint:** Safe examples exist, the private local file is ignored, the configuration helper stays on the server, and the quality/build checks pass. Review and commit.

## Repeatable Git checkpoint after Steps 06–10

Use the actual step branch and files. Do not run this mechanically if you have unrelated changes or a different branch state. Cursor should adapt commands to the repository it inspected.

Before a new step, after the previous PR is merged:

```sh
git status
git switch main
git pull --ff-only origin main
git switch -c setup/07-quality
```

After the step, inspect first, then stage **only its reviewed files**:

```sh
git diff --stat
git diff
git add YOUR_REVIEWED_FILE_PATHS
git diff --cached
git commit -m "YOUR_STEP_COMMIT_MESSAGE"
git push -u origin setup/07-quality
```

The uppercase entries are placeholders, not literal commands to run. Open a pull request on GitHub, review its changes and verification notes, merge it, and then begin the next branch from updated `main`. If a push is rejected, inspect the remote state; do not use force-push as the default fix.

## Recovery prompt — use if one step fails

```text
The current Zatroz step has a problem. Read its requirements, relevant project instructions, the current diff, and the error I provide. Reproduce the issue if tools permit. Explain the root cause in beginner-friendly English and make the smallest relevant fix. Preserve my unrelated changes and existing versions. Do not disable checks, add fake success responses, overwrite configuration, or proceed to the next step. Rerun the checks affected by the fix and report actual results. Do not ask me to share private keys or environment-file contents.
```

## Completion checklist

- [ ] Launch scope and open decisions are documented.
- [ ] All required content and assets have owners and honest statuses.
- [ ] Routes, navigation, and visitor journeys are consistent.
- [ ] Node, npm, and Git work inside Cursor.
- [ ] Planning files are committed to the correct GitHub repository.
- [ ] The Next.js starter runs locally and builds successfully.
- [ ] Formatting, linting, and type checks pass.
- [ ] Folder responsibilities and server/client boundaries are documented.
- [ ] Cursor project rules are available and their activation is checked.
- [ ] Environment examples contain no real credentials; local env files are ignored.
- [ ] Missing future credentials do not prevent the starter from building.
- [ ] Every completed step has a reviewed checkpoint and truthful progress notes.

**Next request:** “Give me the complete Step 11 prompt file: Zatroz design system.”

This file is a prompt deliverable. The commands and checks above are instructions for your local Cursor project; they have not been executed on your computer.
