# Environment variables

**Step:** 10  
**Purpose:** Safe configuration boundaries for local development and later integrations.

Ignore files (`.gitignore`, `.prettierignore`, `.cursorignore`) reduce accidental commits or indexing of secrets. **They are not access control.** Do not print `.env.local` in chat, screenshots, or logs. If a real secret is ever committed, the owner must **rotate** it; fixing `.gitignore` alone does not remove history.

---

## Files (repository root)

| File              | Tracked? | Role                                                         |
| ----------------- | -------- | ------------------------------------------------------------ |
| `.env.example`    | Yes      | Documented names + blank/safe defaults                       |
| `.env.local`      | No       | Your private local values (Next.js loads this automatically) |
| `.env` / `.env.*` | No       | Ignored, except `.env.example`                               |

Do **not** set `NODE_ENV` in these files. Do **not** put server secrets behind `NEXT_PUBLIC_`. Do **not** expose secrets via `next.config` `env`.

### Copy without overwriting

PowerShell (only if `.env.local` is missing):

```powershell
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
```

After changing `.env.local`, **restart** `npm run dev` so Next.js reloads values.

`NEXT_PUBLIC_*` values are embedded at **build** time for browser bundles. Treat them as public.

---

## Variable contract

| Variable                         | Classification              | Required when                                    |
| -------------------------------- | --------------------------- | ------------------------------------------------ |
| `SITE_URL`                       | Public-safe, read on server | Absolute URLs / metadata; localhost during setup |
| `APP_ENV`                        | Server policy marker        | MongoDB / later policy (default development)     |
| `MONGODB_URI`                    | Server secret               | Database operations (Step 44+)                   |
| `MONGODB_DB_NAME`                | Server config               | Explicit `zatroz_<label>` database name          |
| `MONGODB_MIGRATION_URI`          | Maintenance secret          | Schema/index tooling only (Step 45+)             |
| `MONGODB_TEST_URI`               | Test secret                 | Disposable integration tests                     |
| `MONGODB_TEST_DB_NAME`           | Test config                 | Explicit test database name                      |
| `APP_ORIGIN`                     | Non-secret config           | Later request origin policy                      |
| `ENQUIRIES_ENABLED`              | Server switch               | Later live form activation (not sole readiness)  |
| `ABUSE_HASH_SECRET`              | Server secret               | Later abuse controls                             |
| `ENQUIRY_IDEMPOTENCY_SECRET`     | Server secret               | Later idempotency fingerprints                   |
| `SUPABASE_URL`                   | Legacy unused               | Do not provision — MongoDB replaced this plan    |
| `SUPABASE_SECRET_KEY`            | Legacy unused               | Do not provision                                 |
| `RESEND_API_KEY`                 | Server secret               | Email delivery (later)                           |
| `ENQUIRY_FROM_EMAIL`             | Server config               | Verified notification sender (later)             |
| `ENQUIRY_NOTIFICATION_EMAIL`     | Server config               | Team notification recipient (later)              |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public                      | Contact spam widget (later)                      |
| `TURNSTILE_SECRET_KEY`           | Server secret               | Server Turnstile verify (later)                  |
| `CRON_SECRET`                    | Server secret               | Protected notification retry job (later)         |

MongoDB Atlas is the **application database**. See `docs/setup/mongodb-atlas.md`. Importing Mongo helpers does not require secrets during a marketing-page build; validate/connect lazily when a DB operation runs.

---

## What is implemented now

| Item                                                                            | Status              |
| ------------------------------------------------------------------------------- | ------------------- |
| `.env.example` with blank / safe defaults                                       | Done                |
| `getSiteUrl()` in `src/server/env.ts` (`server-only`)                           | Done                |
| MongoDB config + lazy connection (`src/lib/mongodb/*`, `src/server/mongodb.ts`) | Done (Step 44)      |
| `npm run db:check` connectivity diagnostic                                      | Done (Step 44)      |
| Collection schemas, indexes, `db:plan` / `db:apply`                             | Done (Step 45)      |
| Localhost fallback when `SITE_URL` is empty                                     | Done                |
| Reject malformed / non-http(s) `SITE_URL`                                       | Done                |
| Enquiry API / live form / privilege matrix                                      | **Not** implemented |
| Eager Resend / Turnstile / cron clients                                         | **Not** implemented |

`getSiteUrl()` is server-only and is **not** wired into the home page yet (avoids forcing client or fully dynamic rendering). Call it later from server code (metadata, absolute links, emails).

**Production URL:** Before any public release, planned **Step 67** must set and verify the real production `SITE_URL`. Localhost fallback is for setup only and is not automatic production enforcement.

---

## Future lazy validation (implement per integration)

When each feature is built, validate only what that feature needs, on use:

| Concern                  | Rule (later)                                                                    |
| ------------------------ | ------------------------------------------------------------------------------- |
| Missing required secret  | Clear error naming the **variable**, never printing the value                   |
| Preview / Vercel preview | Use **test** notification recipients and non-production data                    |
| Production               | Separate credentials and data from preview/local                                |
| Account dashboards       | Manual setup (Supabase, Resend, Turnstile, host cron) — **not** done in Step 10 |

---

## Environments

| Environment | Expectation                                            |
| ----------- | ------------------------------------------------------ |
| Local       | `.env.local`; `SITE_URL=http://localhost:3000` is fine |
| Preview     | Separate secrets; test inboxes only for notifications  |
| Production  | Real domain in `SITE_URL`; production secrets only     |

---

## Helper location

- `src/server/resolve-site-url.ts` — pure URL normalisation
- `src/server/env.ts` — `import "server-only"` + `getSiteUrl()`

Do not create a barrel that mixes public and private env objects. No client env helper until a browser feature needs one.
