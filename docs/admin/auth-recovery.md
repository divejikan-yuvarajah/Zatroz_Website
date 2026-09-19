# Staff auth recovery and session revocation (A02)

**Rule:** Never paste passwords, TOTP seeds, backup codes, `BETTER_AUTH_SECRET`, or connection strings into chat, tickets, or commits.

---

## First owner (bootstrap)

1. Put values only in ignored `.env.local` (or the host secret store):
   - `MONGODB_URI`, `MONGODB_DB_NAME`
   - `BETTER_AUTH_SECRET` (≥ 32 random characters)
   - `ADMIN_BOOTSTRAP_EMAIL`, `ADMIN_BOOTSTRAP_PASSWORD` (≥ 12), `ADMIN_BOOTSTRAP_NAME`
2. Run `npm run admin:bootstrap-owner` privately.
3. Sign in at `/admin/login`, complete MFA at `/admin/mfa`, store backup codes offline.
4. Remove `ADMIN_BOOTSTRAP_*` from the environment.
5. Do **not** invent founder emails or passwords in source or docs.

If the email already exists, the script fails safely — resolve in Mongo with an authorized operator; do not reset by guessing.

---

## MFA lockout (lost authenticator)

| Option                        | Action                                                                                                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Backup codes remaining        | Use a backup code on `/admin/mfa`, then enroll a new authenticator                                                                                                  |
| No backup codes, second owner | Second owner revokes sessions / disables the account via planned A03 staff tools, then re-bootstrap carefully                                                       |
| Sole owner, total lockout     | Rotate `BETTER_AUTH_SECRET` only as last resort (invalidates all sessions); recover via Mongo + documented Better Auth user/2FA collections with two-person control |

Do not disable MFA in production without a written owner decision.

---

## Session revocation

Better Auth exposes:

| Endpoint / client                      | Effect                                   |
| -------------------------------------- | ---------------------------------------- |
| `POST /api/auth/revoke-sessions`       | Revoke all sessions for the current user |
| `POST /api/auth/revoke-other-sessions` | Keep current; revoke others              |
| `POST /api/auth/revoke-session`        | Revoke one session by token id           |
| `POST /api/auth/sign-out`              | End the current session                  |

Until A03 adds UI, operators may call these with an authenticated browser session (devtools) or documented client helpers — never by editing session documents by hand unless Better Auth docs for the installed version require it.

Password reset (when email is wired later) uses `revokeSessionsOnPasswordReset: true` in the A02 config.

---

## Secret rotation

1. Generate a new `BETTER_AUTH_SECRET` (and optional `BETTER_AUTH_SECRETS` version list if using Better Auth multi-secret rotation).
2. Deploy / restart so all instances pick up the new value.
3. Expect existing cookies/sessions to fail closed — users sign in again + MFA.
4. If the old secret leaked, treat it as compromised immediately; rotate Mongo credentials if they shared a vault incident.

---

## Password reset email

**Not wired in A02.** Resend + verified sender remain future work. Until then, recovery is MFA backup codes + owner-assisted account repair, not self-serve email reset.

---

## Related

- `docs/admin/step-a02.md`
- `docs/security/recovery.md` (Mongo / abuse secrets)
- `docs/setup/environment-variables.md`
