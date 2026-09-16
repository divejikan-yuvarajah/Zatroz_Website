# Zatroz website

Company marketing site for **Zatroz** — a service-based IT studio helping SMEs improve how they sell, serve customers, and manage everyday work.

**Current stage:** Steps 01–10 foundation complete on branches (env config in Step 10). Design system starts at Step 11. No public deployment yet.

## Goal

Generate qualified project enquiries through a clear English launch site (eight general pages, six service pages, and two or three verified project stories).

## Stack (planned)

Next.js App Router, React, TypeScript, Tailwind CSS. Public content stays in the repository. Enquiries later use a Next.js server route with durable storage and email notification — not started in this stage.

## Document map

| Area                      | Path                                                                                                                                                                               |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Progress checklist        | [`docs/progress.md`](docs/progress.md)                                                                                                                                             |
| Launch scope              | [`docs/planning/01-project-scope.md`](docs/planning/01-project-scope.md)                                                                                                           |
| Decision register         | [`docs/planning/decision-register.md`](docs/planning/decision-register.md)                                                                                                         |
| Sitemap / journeys / nav  | [`docs/planning/03-sitemap.md`](docs/planning/03-sitemap.md), [`visitor-journeys.md`](docs/planning/visitor-journeys.md), [`navigation-spec.md`](docs/planning/navigation-spec.md) |
| Content & assets          | [`docs/content/`](docs/content/)                                                                                                                                                   |
| Local environment         | [`docs/setup/local-environment.md`](docs/setup/local-environment.md)                                                                                                               |
| Project initialization    | [`docs/setup/project-initialization.md`](docs/setup/project-initialization.md)                                                                                                     |
| Quality checks            | [`docs/setup/quality-checks.md`](docs/setup/quality-checks.md)                                                                                                                     |
| Folder structure          | [`docs/architecture/folder-structure.md`](docs/architecture/folder-structure.md)                                                                                                   |
| Cursor workflow           | [`docs/setup/cursor-workflow.md`](docs/setup/cursor-workflow.md)                                                                                                                   |
| Environment variables     | [`docs/setup/environment-variables.md`](docs/setup/environment-variables.md)                                                                                                       |
| Git workflow              | [`docs/setup/git-workflow.md`](docs/setup/git-workflow.md)                                                                                                                         |
| Prompt pack (Steps 01–10) | [`docs/prompts/Zatroz_Cursor_Prompts_Steps_01_to_10.md`](docs/prompts/Zatroz_Cursor_Prompts_Steps_01_to_10.md)                                                                     |

## Setup status

| Item                              | Status                                                                         |
| --------------------------------- | ------------------------------------------------------------------------------ |
| Scope, content inventory, sitemap | Documented                                                                     |
| Local Node / npm / Git            | Verified (see local-environment doc)                                           |
| GitHub remote                     | `origin` → `https://github.com/divejikan-yuvarajah/Zatroz_Website.git`         |
| Next.js app                       | Starter merged to `main` (see `docs/setup/project-initialization.md`)          |
| Quality scripts                   | `npm run check` / `npm run build` documented in `docs/setup/quality-checks.md` |
| Folder structure                  | Documented in `docs/architecture/folder-structure.md`                          |
| Cursor project rules              | `.cursor/rules/` + `docs/setup/cursor-workflow.md`                             |
| Environment example               | `.env.example` (copy to `.env.local`; see environment-variables doc)           |
| Production deployment             | Not started                                                                    |

## Local tools

See [`docs/setup/local-environment.md`](docs/setup/local-environment.md), [`docs/setup/project-initialization.md`](docs/setup/project-initialization.md), [`docs/setup/quality-checks.md`](docs/setup/quality-checks.md), and [`docs/setup/environment-variables.md`](docs/setup/environment-variables.md).

```powershell
npm install
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
npm run check
npm run build
npm run dev
```

Open `http://localhost:3000`. Stop the server with Ctrl+C. Do not commit `.env.local`.

## Contributing workflow

See [`docs/setup/git-workflow.md`](docs/setup/git-workflow.md). Prefer small per-step branches and pull requests after the initial checkpoint.
