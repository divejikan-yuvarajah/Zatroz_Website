# Admin Atlas backup and restore checks (A12)

**Status:** Checklist **documented**. Live restore rehearsal against Atlas with real credentials **Not run** in this repository session.

**Rule:** Never paste connection strings, passwords, or enquiry payloads into chat, tickets, or commits. Never restore over production to “test”.

---

## Why this exists

Admin-managed projects, revisions, media metadata, featured order, audit events, and content jobs live in MongoDB Atlas. Marketing copy remains repository-managed. Losing Atlas without a tested restore path blocks portfolio updates even when Git is healthy.

---

## Pre-checks (operator)

| Check                                          | How                                                    | Status to record          |
| ---------------------------------------------- | ------------------------------------------------------ | ------------------------- |
| Cluster tier supports backups                  | Atlas UI → cluster → Backup / Cloud Backup             | Pass / Fail / N/A         |
| Continuous or snapshot schedule enabled        | Atlas backup policy for the environment                | Pass / Fail / Not run     |
| Retention meets owner policy                   | Compare Atlas retention to owner decision              | Pass / Fail / Needs input |
| Separate restore target available              | Disposable `zatroz_*` database or clone project        | Pass / Fail / Not run     |
| Credentials for restore are maintenance-scoped | Prefer `MONGODB_MIGRATION_URI` user, not browser login | Pass / Fail               |

“Atlas is hosted” is **not** proof that backups are on or that restore was practiced.

---

## Restore rehearsal (when authorized)

1. Pick a **non-production** restore target (new cluster or new database name).
2. Restore the latest snapshot / PITR window into that target only.
3. Point a private `.env.local` (or throwaway host) at the restored DB — never production URIs.
4. Smoke:
   - `npm run db:check` (privately)
   - Sign in to `/admin/login` + MFA on the restored environment only if using a disposable auth DB
   - Confirm published project pointers still resolve in admin list
5. Record outcome in the table below. Destroy the disposable restore when finished.

| Environment | Snapshot / PITR id | Restored to | Smoke result | Date | Operator |
| ----------- | ------------------ | ----------- | ------------ | ---- | -------- |
| —           | —                  | —           | **Not run**  | —    | —        |

---

## Related recovery

| Topic                          | Doc                                |
| ------------------------------ | ---------------------------------- |
| Staff MFA / session revocation | `docs/admin/auth-recovery.md`      |
| Mongo / abuse secret rotation  | `docs/security/recovery.md`        |
| Atlas network and users        | `docs/setup/mongodb-atlas.md`      |
| Schema apply                   | `docs/setup/mongodb-migrations.md` |

---

## Content-job / media failure recovery (application-level)

These are not Atlas restores; they are A11 operational recoveries:

| Failure                    | Recoverable state                          | Operator action                                                          |
| -------------------------- | ------------------------------------------ | ------------------------------------------------------------------------ |
| Publish refresh job failed | `content_jobs.state = failed`              | Admin → Jobs → Re-queue, then Process due jobs                           |
| Duplicate refresh          | Same `dedupeKey`                           | Requeue reuses the row — do not insert a second job                      |
| Orphaned / failed upload   | `processingState` failed/archived + unused | Media → Safe cleanup → Permanent delete (owner)                          |
| Cloudinary outage          | Upload/preview returns unavailable         | Retry after provider recovery; do not paste signed URLs into public HTML |

---

## Explicit honesty

Until a row is filled in the restore rehearsal table with a real operator name and date, claim **Not run**. Do not invent pass results for launch checklists.
