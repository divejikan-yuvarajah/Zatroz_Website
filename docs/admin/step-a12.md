# Admin step A12 — AuthZ suite, backup checks, handover

**Branch:** `feature/a12-authz-handover` (from `feature/a11-cache-refresh-cleanup`)  
**Status:** Authorization/failure **unit suite Implemented**. Backup/restore **checklist documented** (live restore **Not run**). Owner handover **documented** (teammate walkthrough **Pending**).

## Goal

Close the A01–A12 admin sequence by verifying authorization and recoverable failure behaviour against the addendum acceptance criteria, documenting Atlas backup/restore expectations honestly, and handing owners a practical operating guide — without enabling Step 47 enquiry writes.

## Delivered

| Artifact                   | Path                               |
| -------------------------- | ---------------------------------- |
| AuthZ operation matrix     | `src/lib/admin/authz-matrix.ts`    |
| AuthZ + failure unit suite | `npm run test:admin-authz`         |
| Backup / restore checklist | `docs/admin/backup-restore.md`     |
| Handover guide             | `docs/admin/handover.md`           |
| Handover exercise          | `docs/admin/handover-checklist.md` |
| This checkpoint            | `docs/admin/step-a12.md`           |

## Acceptance criteria (addendum §8) — verification

| Criterion                                    | How verified                             | Live proof                              |
| -------------------------------------------- | ---------------------------------------- | --------------------------------------- |
| Owner publish path exists                    | Actions + handover guide                 | Not run                                 |
| Draft save ≠ live mutation                   | Pointer model + unit test                | Unit only                               |
| Editor cannot publish / roles / enquiries    | Matrix + `test:admin-authz`              | Unit only                               |
| Unauthenticated / MFA / no-role denied       | Gate tests + source inventory            | Unit only                               |
| Private media preview gated                  | Preview route uses `requireAdminSession` | Unit source check; live Not run         |
| Failed jobs recoverable, no duplicate dedupe | `planContentJobEnqueue` tests            | Unit only                               |
| Concurrent edit conflict                     | Optimistic `concurrencyVersion` contract | Unit message contract; live Not run     |
| Featured only public-ready                   | Featured helpers                         | Unit only                               |
| Delete blocked when in use                   | Media usage eligibility                  | Unit only                               |
| Recovery / backups / handover documented     | Auth recovery, backup-restore, handover  | Docs; restore Not run; teammate Pending |

## Operator next actions (outside this commit)

1. Fill the restore rehearsal table in `docs/admin/backup-restore.md` when Atlas backup tier is confirmed.
2. Walk an owner through `docs/admin/handover-checklist.md` and record real completion.
3. Only then start **Step 47** (enquiry write path) — A12 does not activate enquiries.

## Explicitly not done

- Step 47+ enquiry Server Action / Resend
- Claiming live Atlas restore or Cloudinary ACL proof without operator evidence
- Inventing teammate handover signatures

## Checks

Recorded in `docs/progress.md` when the step is closed.
