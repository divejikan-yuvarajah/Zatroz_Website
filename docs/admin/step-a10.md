# Admin step A10 — One-time repository → Mongo portfolio migration

**Branch:** `feature/a10-repo-portfolio-migration` (from `feature/a09-featured-public-selectors`)  
**Status:** Migration tooling **Implemented**. Live apply against Atlas with real credentials **Not run**. Current repository catalogs contain **0** approved projects and **0** media — dry-run is a verified no-op.

## Goal

Import approved repository portfolio records into Mongo once, preserving IDs/slugs/publication independence, without auto-publishing drafts. After a verified switch, stop treating repository `projectRecords` / `mediaRecords` as a parallel live source.

## Delivered

| Artifact                 | Path / note                                   |
| ------------------------ | --------------------------------------------- |
| Pure planner             | `src/lib/admin/repo-migration.ts`             |
| Maintenance apply runner | `src/lib/mongodb/repo-portfolio-migration.ts` |
| CLI                      | `npm run migrate:repo-portfolio`              |
| Unit tests               | `npm run test:admin-repo-migration`           |
| Inventory update         | `docs/work/admin-migration-inventory.md`      |

## Behaviour

- **Dry-run by default** — requires `--target development|test|preview`; add `--apply` only after reviewing the plan
- Refuses `production` / mismatched `APP_ENV`
- Uses `MONGODB_MIGRATION_URI` + `MONGODB_DB_NAME` (same maintenance credential as schema tooling)
- Draft / non-approved summaries → Mongo drafts only (`published*RevisionId` stay null)
- Approved summary → sets published summary pointer + canonical slug
- Approved story only when summary is also approved
- Archived repository projects are skipped
- Media: approved + path/dims → `visibility=public` / `ready` with `storageHint` = public path; otherwise pending/private
- Idempotent: existing `editorialId` / `mediaId` rows are skipped
- Featured IDs written only when they resolve to approved published summaries in the plan
- Audit event `migration.repo_portfolio_apply` on successful apply

## Current catalog (2026-09-20)

| Source                      | Count |
| --------------------------- | ----- |
| `projectRecords`            | 0     |
| `mediaRecords`              | 0     |
| `featuredProjectIds` (repo) | 0     |

Empty import is intentional and honest — no fiction seeded.

## Operator setup

1. Ensure schema migrations are applied (`npm run db:apply -- --target development`).
2. Dry-run: `npm run migrate:repo-portfolio -- --target development`
3. Review counts/notes. Backup the target database if any approved rows exist.
4. Apply: `npm run migrate:repo-portfolio -- --target development --apply`
5. Spot-check `/work` and admin project list. Do not edit repository portfolio arrays as live content afterward.

## Explicitly not done (later steps)

- Public Cloudinary derivatives / image cleanup (A11)
- Cache refresh worker (A11)
- AuthZ/failure suite + handover (A12)

## Checks

Recorded in `docs/progress.md` when the step is closed.
