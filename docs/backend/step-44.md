# Backend Step 44 — MongoDB foundation

**Branch:** `feature/44-mongodb-foundation` (from `feature/43-enquiry-form-ui`)  
**Status:** Connection architecture implemented; live Atlas ping **Not run** until local credentials exist

## Decision

| Topic                            | Record                                                               |
| -------------------------------- | -------------------------------------------------------------------- |
| Application database             | **MongoDB Atlas** + official `mongodb` Node.js driver                |
| Marketing copy                   | Remains repository-managed                                           |
| Enquiries / later admin projects | Will use Atlas (not implemented in this step)                        |
| Supabase                         | Superseded for new work; no active Supabase client existed to delete |

## Compatibility

| Package   | Version           |
| --------- | ----------------- |
| `mongodb` | 6.21.x (lockfile) |
| Node      | >=24 <25          |
| Next.js   | 16.3.5            |

## What changed

| File                                 | Role                                        |
| ------------------------------------ | ------------------------------------------- |
| `src/lib/mongodb/config.ts`          | Pure env validation + sanitized errors      |
| `src/lib/mongodb/connection.ts`      | Lazy client singleton, pool/timeouts, ping  |
| `src/server/mongodb.ts`              | `server-only` re-export for App Router      |
| `scripts/db-check.ts`                | `npm run db:check` diagnostic               |
| `scripts/test-mongodb-foundation.ts` | Unit tests (no live cluster required)       |
| `docs/setup/mongodb-atlas.md`        | Operator runbook                            |
| `.env.example`                       | MongoDB placeholders + legacy Supabase note |

## Behaviour

- Importing Mongo modules does **not** connect and does **not** require secrets during `next build`.
- `getMongoClient` / `getDb` validate and connect lazily; rejected init promises reset for retry.
- Hot reload reuses `globalThis` client promise in development.
- `db:check` prints Passed/Failed + non-secret label only.
- Public pages and repository project adapter unchanged; Contact form stays off.

## Pool / timeouts

Documented in `docs/setup/mongodb-atlas.md` (`maxPoolSize` 5, selection/connect 8s).

## Checks

| Check | Result |
| ----- | ------ |
| `npm run format` | Passed |
| `npm run check` (incl. `test:mongodb-foundation`) | Passed |
| `npm run build` | Passed (Next.js 16.3.5) |
| `npm run db:check` | Failed — no Atlas credentials in ignored `.env.local` (expected); live ping **Not run** |
| Production smoke (`next start` :3044) | `/` `/contact` `/work` 200; `/dev/ui` 404 |

## Remaining operator actions

1. Create Atlas project/cluster/user and IP allowlist (runbook).
2. Fill ignored `.env.local` with `MONGODB_URI`, `MONGODB_DB_NAME=zatroz_dev`, `APP_ENV=development`.
3. Run `npm run db:check` and keep the result private.

## Next

Step 45 — application collections, validators, and migration tooling.
