# Admin step A08 — Publish / unpublish / archive + slug redirects

**Branch:** `feature/a08-admin-publish` (from `feature/a07-admin-preview`)  
**Status:** Publish controls **Implemented**. Live Mongo publish with real credentials **Not run** until operators supply secrets. Public Work still uses repository selectors until A09.

## Goal

Owners can publish and unpublish summary and story independently; editors/owners can soft-archive within scope; slug changes record redirects; former slugs stay reserved; mutations write audit events and best-effort refresh jobs.

## Delivered

| Artifact                        | Path / note                                                  |
| ------------------------------- | ------------------------------------------------------------ |
| Pure readiness / status helpers | `src/lib/admin/publish.ts`                                   |
| Soft archive flags              | `src/server/projects/admin-state.ts` (`project_admin_state`) |
| Publish / unpublish / archive   | `src/server/projects/publish.ts`                             |
| Server actions + audit          | `src/server/projects/publish-actions.ts`                     |
| Publication panel UI            | `src/components/admin/admin-project-publish-panel.tsx`       |
| Edit page wiring                | `/admin/projects/[id]`                                       |
| Archived list filter            | `/admin/projects?archived=1`                                 |
| Slug routes (app-managed)       | `project_routes` (`redirect` / `reserved`)                   |
| Refresh jobs (best-effort)      | `content_jobs` deduped queue                                 |
| Unit tests                      | `npm run test:admin-publish`                                 |

## Behaviour

- **Publish summary** (owner / `admin.content.publish`): sets `publishedSummaryRevisionId` to the current draft revision and `canonicalPublishedSlug` to the draft slug; rejects invalid/placeholder title/summary/slug; concurrency-checked
- **Publish story**: requires summary already published and a renderable story body; sets `publishedStoryRevisionId`
- **Unpublish summary**: clears summary + story pointers; keeps `canonicalPublishedSlug` and writes a `reserved` route so the slug is not silently reused
- **Unpublish story**: clears story pointer only
- **Archive**: soft flag in `project_admin_state`, clears live pointers, reserves slug; editors with write (or publish) may archive/restore
- **Slug change on re-publish**: writes `project_routes` redirect from previous canonical → new slug
- Public `/work` **unchanged** until A09 Mongo selectors

## Explicitly not done (later steps)

- Featured selection UI + public-ready featured IDs (A09)
- Switching public project selectors to Mongo (A09–A10)
- Cache refresh worker / sitemap automation (A11)
- Permanent delete (owner, after dependency checks)

## Operator setup

1. Sign in as owner (MFA) with publish permission.
2. Open a draft project → confirm readiness messages if title/summary/story incomplete.
3. Publish summary → confirm status flips; optional slug-change redirect warning when draft slug differs from canonical.
4. Publish story after summary is live.
5. Unpublish / archive / restore from the same panel; use list **Archived** filter to find archived projects.

## Checks

Recorded in `docs/progress.md` when the step is closed.
