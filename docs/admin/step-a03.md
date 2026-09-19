# Admin step A03 — Protected shell, roles, dashboard counts

**Branch:** `feature/a03-admin-shell` (from `feature/a02-admin-auth`)  
**Status:** Admin console shell **Implemented**. Live Mongo counts / staff list with real credentials **Not run** until operators supply secrets.

## Goal

Protected `/admin` console with role-aware navigation, owner staff role management, and **real** MongoDB dashboard counts (no invented traffic/sales charts).

## Delivered

| Artifact                  | Path / note                                                 |
| ------------------------- | ----------------------------------------------------------- |
| Marketing vs admin chrome | `AppChrome` skips public header/footer under `/admin`       |
| Protected console layout  | `src/app/admin/(console)/layout.tsx` — MFA + permissions    |
| Dashboard                 | `/admin` — drafts, published, attention jobs, recent audits |
| Staff roles (owner)       | `/admin/staff` — list + update `staffRole`                  |
| Nav / shortcuts           | `src/lib/admin/nav.ts` — filtered by permissions            |
| Count helpers + loader    | `src/lib/admin/dashboard-counts.ts`, `src/server/admin/*`   |
| Unit tests                | `npm run test:admin-shell`                                  |

## Behaviour

- Unauthenticated / auth-unavailable → `/admin/login`
- Authenticated without MFA → `/admin/mfa`
- Editors never see Staff or Featured nav (permission-gated)
- Future routes (projects, media) appear as “coming later” labels — no fake CRUD pages
- Dashboard: empty collections → **0**; Mongo missing/down → **unavailable** (not fake zeros from a stub store)
- Staff: no invitations; cannot demote the last owner; editors redirected away from `/admin/staff`

## Explicitly not done (later steps)

- Media uploads (**done in A04**)
- Project list/forms (A05)
- Case-study editor (A06)
- Publish / featured Mongo switch (A08–A09)
- Enquiry inbox UI (later; owners have permission but no route yet)

## Checks

Recorded in `docs/progress.md` when the step is closed.
