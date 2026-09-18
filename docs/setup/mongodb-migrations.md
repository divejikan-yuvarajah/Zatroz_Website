# MongoDB migrations runbook (Step 45)

**Purpose:** Plan and apply collection validators/indexes safely.  
**Rule:** Never paste connection strings or document bodies into chat or commits. Maintenance credentials must not ship in the web runtime.

---

## Credentials

| Variable                | Role                                                                                         |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| `MONGODB_MIGRATION_URI` | Maintenance user — create/alter validators and indexes on the **approved** app database only |
| `MONGODB_DB_NAME`       | Explicit `zatroz_<label>`                                                                    |
| `APP_ENV`               | Must match the explicit `--target` on apply                                                  |
| `MONGODB_URI`           | Runtime app user — **not** used by `db:plan` / `db:apply`                                    |

Do not grant schema-maintenance privileges to the web process user (refined in Step 46).

---

## Commands

```bash
npm run db:plan
npm run db:apply -- --target development
npm run db:apply -- --target test
npm run db:apply -- --target preview
```

- **Plan** is read-only: prints target label, collection/validator/index actions, checksum, ledger status.
- **Apply** requires `--target development|test|preview`, refuses `production`, uses a migration lock + ledger (`_schema_migrations`).
- Re-runs are **no-ops** when the schema/indexes already match.
- Partial failure: re-run inspects actual state and resumes; DDL is **not** one all-or-nothing transaction.
- On duplicate values, incompatible validators, or conflicting index options: **stop** with a sanitized report. Never drop indexes, delete records, or reset the database to force success.

---

## What apply does

1. Acquire `_schema_migration_lock`.
2. Mark ledger `in_progress` for migration `2026-09-18-step-45-application-collections`.
3. Create collections or `collMod` validators for application collections.
4. Create missing named indexes (skip matches; fail on conflicts).
5. Mark ledger `applied` with checksum; release lock.

Rollback notes per collection are printed in the plan and stored in `docs/backend/data-model.md` / schema definitions. Reverting a validator does **not** restore modified data.

---

## Runtime policy

- Do **not** run migrations from `getDb`, page render, route startup, or every request.
- Normal runtime should fail safely if essential schema readiness is absent — it must not self-create critical indexes or self-grant permissions (Step 46 readiness checks).

---

## Integration verification

When a disposable Atlas/test database is available:

1. Set ignored `.env.local` maintenance + test variables privately.
2. `npm run db:plan` → review.
3. `npm run db:apply -- --target test` (or development).
4. Insert synthetic valid/invalid enquiry and revision documents; confirm unique conflicts.
5. Confirm production target refusal.
6. Delete tagged synthetic test records only.

Until then, record live apply/insert evidence as **Not run**.
