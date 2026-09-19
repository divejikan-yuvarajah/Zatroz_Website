# Admin step A11 — Cache refresh, image usage, safe cleanup

**Branch:** `feature/a11-cache-refresh-cleanup` (from `feature/a10-repo-portfolio-migration`)  
**Status:** Worker + usage checks + cleanup UI **Implemented**. Live Cloudinary public-derivative proof and cron against production **Not run**.

## Goal

Turn A08’s best-effort `content_jobs` enqueue into a recoverable refresh/retry path, prepare durable public media delivery for published assets, and allow owner-only permanent delete after dependency checks.

## Delivered

| Artifact                      | Path / note                                                 |
| ----------------------------- | ----------------------------------------------------------- |
| Job helpers (pure)            | `src/lib/admin/content-jobs.ts`                             |
| Media usage helpers (pure)    | `src/lib/admin/media-usage.ts`                              |
| Job enqueue + worker          | `src/server/jobs/content-jobs.ts`                           |
| Owner job actions             | `src/server/jobs/actions.ts`                                |
| Cron/API route                | `POST /api/jobs/content-refresh` (`CRON_SECRET`)            |
| CLI                           | `npm run jobs:content-refresh`                              |
| Public path revalidation      | `src/server/projects/revalidate-public.ts`                  |
| Public Cloudinary derivatives | `src/server/media/public-delivery.ts` + `uploadPublicImage` |
| Usage + permanent delete      | `src/server/media/usage.ts`                                 |
| Admin Jobs UI                 | `/admin/jobs`                                               |
| Media cleanup panel           | `/admin/media` (owner permanent delete)                     |
| Unit tests                    | `npm run test:admin-content-jobs`                           |

## Behaviour

- **Enqueue is idempotent** — unique `dedupeKey` is reused (`insert` / `noop` / `requeue`); retries never insert a second row
- **Worker** leases due jobs, prepares public derivatives on summary/story publish, then `revalidatePath`s public + admin routes
- **Retries** use exponential backoff (30s base), max 5 attempts, then `failed` (owner can Re-queue)
- **Published, refresh pending** shown on the project publish panel while open jobs exist
- **Public catalog** accepts durable `storageHint` that is site-relative (`/…`) or `https://…` (never signed authenticated URLs)
- **Permanent delete** requires `admin.content.publish`, archived/failed latest version, and zero revision references; destroys authenticated + `__pub` public copies

## Operator setup

1. Set `CRON_SECRET` (≥16 chars) in `.env.local` for the HTTP worker.
2. After publish: open **Admin → Jobs** and run **Process due jobs**, or:
   - `npm run jobs:content-refresh -- --limit 20`
   - `POST /api/jobs/content-refresh` with `Authorization: Bearer <CRON_SECRET>`
3. Cleanup candidates appear under Media → Safe cleanup when failed/archived unused assets exist.

## Explicitly not done (A12)

- Full AuthZ / failure suite + handover checklist
- Enquiry write path (Step 47+)

## Checks

Recorded in `docs/progress.md` when the step is closed.
