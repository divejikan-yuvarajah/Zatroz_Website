# Zatroz website

Company marketing site for **Zatroz** — a service-based IT studio helping SMEs improve how they sell, serve customers, and manage everyday work.

**Current stage:** Planning and local setup (Steps 01–05). No public website is deployed yet. No Next.js application has been scaffolded in this repository yet.

## Goal

Generate qualified project enquiries through a clear English launch site (eight general pages, six service pages, and two or three verified project stories).

## Stack (planned)

Next.js App Router, React, TypeScript, Tailwind CSS. Public content stays in the repository. Enquiries later use a Next.js server route with durable storage and email notification — not started in this stage.

## Document map

| Area | Path |
| --- | --- |
| Progress checklist | [`docs/progress.md`](docs/progress.md) |
| Launch scope | [`docs/planning/01-project-scope.md`](docs/planning/01-project-scope.md) |
| Decision register | [`docs/planning/decision-register.md`](docs/planning/decision-register.md) |
| Sitemap / journeys / nav | [`docs/planning/03-sitemap.md`](docs/planning/03-sitemap.md), [`visitor-journeys.md`](docs/planning/visitor-journeys.md), [`navigation-spec.md`](docs/planning/navigation-spec.md) |
| Content & assets | [`docs/content/`](docs/content/) |
| Local environment | [`docs/setup/local-environment.md`](docs/setup/local-environment.md) |
| Git workflow | [`docs/setup/git-workflow.md`](docs/setup/git-workflow.md) |
| Prompt pack (Steps 01–10) | [`docs/prompts/Zatroz_Cursor_Prompts_Steps_01_to_10.md`](docs/prompts/Zatroz_Cursor_Prompts_Steps_01_to_10.md) |

## Setup status

| Item | Status |
| --- | --- |
| Scope, content inventory, sitemap | Documented |
| Local Node / npm / Git | Verified (see local-environment doc) |
| GitHub remote | `origin` → `https://github.com/divejikan-yuvarajah/Zatroz_Website.git` |
| Next.js app | Not started (Step 06) |
| Production deployment | Not started |

## Local tools

See [`docs/setup/local-environment.md`](docs/setup/local-environment.md). After Step 06 you will use `npm run dev` and open `http://localhost:3000`.

## Contributing workflow

See [`docs/setup/git-workflow.md`](docs/setup/git-workflow.md). Prefer small per-step branches and pull requests after the initial checkpoint.
