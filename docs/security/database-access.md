# Database access privileges (Step 46)

**Status:** Privilege matrix and repository boundaries documented. Live Atlas privilege probes **Not run** until isolated credentials exist.  
**Important:** MongoDB collection privileges do **not** implement website roles, published-only field filtering, or editor/owner authorization. Those remain application checks (A02–A03 / public selectors).

---

## Credential classes

| Credential                     | Env                     | Deployed with web app? | Scope                                                                        |
| ------------------------------ | ----------------------- | ---------------------- | ---------------------------------------------------------------------------- |
| Runtime (enquiries + counters) | `MONGODB_URI`           | Yes                    | Least privilege on app DB collections listed below                           |
| Maintenance                    | `MONGODB_MIGRATION_URI` | **No**                 | Create/alter validators & indexes on approved DB only                        |
| Disposable test                | `MONGODB_TEST_URI`      | No                     | Non-production test DB only                                                  |
| Future auth adapter            | library-managed         | Separate               | Better Auth (or chosen library) collections — do not apply Zatroz validators |

Keep production and development credentials distinct. Never grant `atlasAdmin`, `root`, `readWriteAnyDatabase`, or schema-maintenance rights to the web runtime user.

---

## Runtime privilege matrix (intended)

| Collection                                               | insert                     | find                                     | update                                  | delete        | collMod / createIndex |
| -------------------------------------------------------- | -------------------------- | ---------------------------------------- | --------------------------------------- | ------------- | --------------------- |
| `enquiries`                                              | Yes (normalized docs)      | Yes — **idempotency digest lookup only** | No (workflow updates later, owner-only) | No            | No                    |
| `rate_limit_buckets`                                     | Yes (upsert)               | Yes (via upsert return)                  | Yes (`$inc` count)                      | No (TTL only) | No                    |
| `projects` / revisions / media / settings / audit / jobs | No (content runtime later) | No for enquiry user                      | No                                      | No            | No                    |
| `_schema_migrations`                                     | No                         | Optional read for readiness              | No                                      | No            | No                    |

### Enquiry service operations (exact)

1. `insertOne` normalized enquiry document
2. `findOne` by `idempotencyDigest` with fixed projection (`publicReference`, `payloadFingerprint`, `fingerprintVersion`)
3. Rate-limit bucket upsert / `$inc`
4. Optional readiness: read migration ledger status + `listIndexes` on critical collections

This credential is **not** insert-only: duplicate/idempotency resolution requires reads. Application code must not expose those reads publicly.

### Connection pools

One Next.js server process may use a single runtime pool (`getMongoClient`). Separate content-runtime credentials may be introduced later if privilege separation requires it — do not add pools merely for appearances. Document residual risk if the plan only allows broader `readWrite` on the whole database.

---

## Platform / plan residual risk

| Desired control             | If Atlas custom roles unavailable       | Residual risk                                                                                                   |
| --------------------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Collection-level privileges | Database `readWrite` on `zatroz_*` only | Runtime could theoretically touch other app collections — mitigate with repository discipline + no admin routes |
| Deny `dropCollection`       | Role without DDL                        | Maintenance credential still isolated from web                                                                  |

Record the closest supported scope before production activation; do not claim finer isolation than exists.

---

## Verification (when authorized)

On an isolated target with synthetic records only:

| Check                                        | Expected                |
| -------------------------------------------- | ----------------------- |
| Insert enquiry + idempotency find            | Allowed                 |
| Increment rate-limit bucket                  | Allowed                 |
| `dropCollection` / `collMod` as runtime user | **Denied**              |
| Read production from test URI                | **Denied** / impossible |

Record actual denied database operations. No destructive probing against real data. Live evidence: **Not run** until credentials exist.

---

## Application boundaries (code)

- Repositories: `src/server/repositories/enquiries.ts` — fixed queries only
- Rate limiter: `src/server/security/rate-limit.ts`
- Auth gates (A02): `src/lib/security/auth-gate.ts` + `src/server/auth/session.ts` — require Better Auth session, MFA, and role permissions; no cookie/header role trust.
- Editors have **no** enquiry read permission by default

Public project selectors remain published-only (`src/server/public-projects.ts`).
