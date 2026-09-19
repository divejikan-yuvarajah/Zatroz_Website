# Backend Step 45 — Collections, models, validators, migrations

**Branch:** `feature/45-mongodb-models` (from `feature/44-mongodb-foundation`)  
**Status:** Models + validators + migration tooling implemented; live Atlas apply/insert proofs **Not run** until maintenance credentials exist

## Decision

| Topic                        | Record                                    |
| ---------------------------- | ----------------------------------------- |
| Application DB               | MongoDB Atlas + official driver (Step 44) |
| Portfolio source of truth    | Still repository adapter until A09–A10    |
| Enquiry writes / public form | Still off (`formSubmissionReady: false`)  |
| Auth library collections     | Not validated here                        |

## What changed

| Area                               | Location                                                                    |
| ---------------------------------- | --------------------------------------------------------------------------- |
| Data model map                     | `docs/backend/data-model.md`                                                |
| Migration runbook                  | `docs/setup/mongodb-migrations.md`                                          |
| Collection names                   | `src/lib/mongodb/collections.ts`                                            |
| Limits / enums                     | `src/lib/mongodb/limits.ts`, `enums.ts`                                     |
| Document types                     | `src/lib/mongodb/models/types.ts`                                           |
| Application validators             | `src/lib/mongodb/models/validate.ts`                                        |
| MongoDB validators + named indexes | `src/lib/mongodb/schema/definitions.ts`                                     |
| Plan / apply                       | `src/lib/mongodb/migrations/*`, `scripts/db-plan.ts`, `scripts/db-apply.ts` |
| Unit tests                         | `scripts/test-mongodb-models.ts`                                            |

## Collections

`enquiries`, `projects`, `project_revisions`, `media_assets`, `site_content_settings`, `admin_audit_events`, `content_jobs`, `rate_limit_buckets`, plus migration ledger/lock meta collections.

## Behaviour

- Importing model modules does not connect and does not require secrets at build time.
- `db:plan` is read-only; `db:apply` refuses production and requires explicit `--target`.
- Rate-limit TTL is cleanup only; window enforcement is application-side.
- No enquiry API, no admin UI, no worker, no public project adapter switch.

## Checks

| Check                                         | Result                                                                |
| --------------------------------------------- | --------------------------------------------------------------------- |
| `npm run format`                              | Passed                                                                |
| `npm run check` (incl. `test:mongodb-models`) | Passed                                                                |
| `npm run build`                               | Passed (Next.js 16.3.5)                                               |
| `npm run db:plan`                             | Failed — no `MONGODB_MIGRATION_URI` (expected); live plan **Not run** |
| `npm run db:apply` (no `--target`)            | Failed as expected (requires explicit target)                         |
| Production smoke (`next start` :3045)         | `/` `/contact` `/work` 200; `/dev/ui` 404                             |
| Live `db:apply` + synthetic inserts           | **Not run** — awaiting disposable Atlas DB                            |

## Remaining operator actions

1. Provision maintenance user + disposable DB (see Atlas + migrations runbooks).
2. Run `npm run db:plan` then `npm run db:apply -- --target development` (or `test`) privately.
3. Run synthetic insert/uniqueness proofs on the disposable database.
4. Approve enquiry retention policy before live collection (Step 47+).

## Next

Step 46 — database privileges and server request safeguards.
