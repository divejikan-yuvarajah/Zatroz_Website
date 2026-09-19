# Admin step A02 — Authentication, MFA, recovery, revocation

**Branch:** `feature/a02-admin-auth` (from `feature/a01-admin-requirements`)  
**Status:** Auth foundation **Implemented**. Live Atlas login / MFA with real credentials **Not run** until operators supply secrets.

## Goal

Staff authentication with Better Auth + MongoDB adapter + official 2FA plugin. No homemade sessions. No public registration. MFA required before content-admin permissions.

## Delivered

| Artifact                      | Path / note                                             |
| ----------------------------- | ------------------------------------------------------- |
| Better Auth + Mongo adapter   | `better-auth@1.7.5`, `@better-auth/mongo-adapter@1.7.5` |
| Lazy auth factory             | `src/lib/auth/create-auth.ts`, `src/server/auth/*`      |
| API catch-all                 | `src/app/api/auth/[...all]/route.ts`                    |
| Browser client                | `src/lib/auth-client.ts`                                |
| Permission gates              | `src/lib/security/auth-gate.ts` (+ session loaders)     |
| Login / MFA pages             | `/admin/login`, `/admin/mfa`                            |
| Owner bootstrap script        | `npm run admin:bootstrap-owner` (env-only identity)     |
| Unit tests                    | `npm run test:admin-auth`                               |
| Recovery / revocation runbook | `docs/admin/auth-recovery.md`                           |

## Compatibility (verified in package graph)

| Item             | Version / note                                             |
| ---------------- | ---------------------------------------------------------- |
| Next.js          | 16.3.5 (Better Auth peer allows 14–16)                     |
| better-auth      | 1.7.5                                                      |
| mongo-adapter    | 1.7.5 (`mongodbAdapter` from `@better-auth/mongo-adapter`) |
| twoFactor plugin | `better-auth/plugins`                                      |
| nextCookies      | `better-auth/next-js` (last plugin)                        |

## Behaviour

- Public email sign-up **disabled** (`emailAndPassword.disableSignUp: true`) on the HTTP auth instance.
- Bootstrap uses a **script-only** auth instance with sign-up enabled; sets `staffRole: "owner"` after create. Credentials come only from `ADMIN_BOOTSTRAP_*` env vars.
- Editors never receive enquiry permissions by default.
- `requireAdmin` / `requirePermission` require: configured auth, authenticated session, `twoFactorEnabled`, and role-mapped permissions.
- Marketing builds without `BETTER_AUTH_SECRET` / Mongo still compile; auth routes return 503.

## Explicitly not done (later steps)

- Admin dashboard shell and navigation (**done in A03**)
- Staff role management UI (**done in A03**; invitations still not emailed)
- Password-reset email delivery (needs Resend + verified domain — later)
- Live Mongo bootstrap / MFA proof with production secrets (**Not run**)

## Operator next actions

1. Set `BETTER_AUTH_SECRET` (≥32 chars), Mongo vars, and optional `BETTER_AUTH_URL`.
2. Set `ADMIN_BOOTSTRAP_EMAIL` / `PASSWORD` / `NAME` privately; run `npm run admin:bootstrap-owner`.
3. Sign in at `/admin/login`, enroll TOTP at `/admin/mfa`, store backup codes offline.
4. Clear `ADMIN_BOOTSTRAP_*` from the environment after success.
5. Follow `docs/admin/auth-recovery.md` for lockout, rotation, and session revocation.

## Checks

Recorded in `docs/progress.md` when the step is closed.
