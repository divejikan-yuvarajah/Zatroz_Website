# Admin step A09 — Featured selection + MongoDB public selectors

**Branch:** `feature/a09-featured-public-selectors` (from `feature/a08-admin-publish`)  
**Status:** Featured settings + Mongo public selectors **Implemented**. Live Mongo featured/publish proof with real credentials **Not run**. Repository→Mongo content migration remains **A10**.

## Goal

Owners set homepage featured order from public-ready projects only. Public Work, case studies, homepage selected work, and related-work blocks read **Mongo published pointers** (never draft repository fallback on DB failure).

## Delivered

| Artifact                     | Path / note                                                 |
| ---------------------------- | ----------------------------------------------------------- |
| Featured helpers             | `src/lib/admin/featured.ts`                                 |
| Featured settings repository | `src/server/projects/featured.ts` (`site_content_settings`) |
| Featured save action + audit | `src/server/projects/featured-actions.ts`                   |
| Admin UI                     | `/admin/settings/featured`                                  |
| Mongo public catalog loader  | `src/server/projects/public-catalog.ts`                     |
| Public selector adapter      | `src/server/public-projects.ts` (async Mongo)               |
| Slug redirect on case study  | `getPublishedCaseStudyBySlugOrRedirect`                     |
| Unit tests                   | `npm run test:admin-featured`                               |

## Behaviour

- Featured IDs stored under `settingsKey: featured_projects` with optimistic `concurrencyVersion`
- Only projects with a published summary (and not archived) can be featured
- Empty featured list → homepage selected-work section omitted
- Public selectors load published revisions only; archived projects excluded
- Public media covers require `visibility=public`, `processingState=ready`, and a durable site-relative `storageHint` path (Cloudinary public derivatives remain A11 — cards stay text-led until then)
- DB miss/error → empty public catalog (no repository draft fallback)
- Former slugs may `permanentRedirect` via A08 `project_routes`

## Explicitly not done (later steps)

- One-time repository→Mongo migration of approved records (A10)
- Public Cloudinary derivatives / image usage cleanup (A11)
- Cache refresh worker (A11)
- AuthZ/failure suite + handover (A12)

## Operator setup

1. Publish at least one project summary (A08).
2. Open **Featured** in admin → add/reorder → Save.
3. Confirm `/` shows selected work only when featured IDs resolve; `/work` lists Mongo published summaries.

## Checks

Recorded in `docs/progress.md` when the step is closed.
