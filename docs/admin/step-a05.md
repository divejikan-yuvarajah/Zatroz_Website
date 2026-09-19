# Admin step A05 — Project list, search/filter/pagination, draft create/edit

**Branch:** `feature/a05-admin-projects` (from `feature/a04-admin-media`)  
**Status:** Project list and draft forms **Implemented**. Live Mongo create/save with real credentials **Not run** until operators supply secrets.

## Goal

Staff can list MongoDB projects with search, work-status and publication filters, and pagination; create and edit draft summaries (title, slug, summary, services, work status, technologies, contributors, links, cover, gallery, featured eligibility) with explicit **Save draft**, optimistic `concurrencyVersion` checks, validation, and unsaved-change handling.

## Delivered

| Artifact                    | Path / note                                   |
| --------------------------- | --------------------------------------------- |
| Pure parse/validate helpers | `src/lib/admin/projects.ts`                   |
| Mongo repository            | `src/server/projects/repository.ts`           |
| Server actions              | `src/server/projects/actions.ts`              |
| List UI                     | `/admin/projects`                             |
| Create / edit forms         | `/admin/projects/new`, `/admin/projects/[id]` |
| Nav + dashboard shortcuts   | Projects enabled in `src/lib/admin/nav.ts`    |
| Unit tests                  | `npm run test:admin-projects`                 |

## Behaviour

- Create inserts a `projects` document plus an immutable `project_revisions` row (`kind: summary_and_story`) so technologies and gallery can live on the story stub without waiting for A06
- Save draft always inserts a **new** revision and bumps `concurrencyVersion`; mismatch → conflict message (no silent overwrite)
- Draft slug/title never replace `canonicalPublishedSlug` (still null until A08 publish)
- Cover is the first `mediaIds` entry; gallery rows are `mediaId \| caption`
- Featured checkbox sets `editorialOrder` for eligibility ranking only — public featured order remains A08–A09
- Unsaved changes warn via `beforeunload` and an on-page banner
- Without Mongo credentials: marketing build still succeeds; list/forms fail closed with a clear message

## Explicitly not done (later steps)

- Case-study section editor / gallery reorder UI (A06)
- Authenticated public-component preview (A07)
- Publish / unpublish / archive / slug redirects (A08)
- Public featured selection from settings (A08–A09)
- Switching public selectors to Mongo (A09–A10)
- Invented sample projects — operators create real drafts only

## Operator setup

1. Ensure `projects` / `project_revisions` indexes exist (`npm run db:apply` when migration credentials are available).
2. Sign in as staff with MFA, open `/admin/projects`, create a draft, save, reload, and confirm concurrency bumps.
3. Optional: upload cover/gallery media in `/admin/media` (A04) first, then attach media ids on the draft form.

## Checks

Recorded in `docs/progress.md` when the step is closed.
