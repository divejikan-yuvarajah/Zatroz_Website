# MongoDB Atlas setup runbook (Step 44)

**Purpose:** Create an environment-separated Atlas project and connect the Zatroz server with the official MongoDB Node.js driver.  
**Rule:** Never paste connection strings, passwords, or `.env.local` contents into chat, commits, or docs.

MongoDB Atlas is the **selected application database**. Marketing/About/Process/Contact/service copy stays in repository records. Enquiries and later admin-managed projects will use Atlas. Older Supabase env placeholders remain unused transition notes — do not provision Supabase for new work.

---

## Compatibility (this repository)

| Item    | Value                                           |
| ------- | ----------------------------------------------- |
| Node    | `>=24 <25` (`package.json` engines)             |
| Next.js | 16.3.5                                          |
| Driver  | `mongodb` npm package (official Node.js driver) |
| ORM     | None — do not add Mongoose/Prisma for this app  |

---

## 1. Atlas project and environment

1. Sign in to [MongoDB Atlas](https://cloud.mongodb.com/).
2. Create or select an **organization** and **project** dedicated to Zatroz development (prefer a separate project from production later).
3. Record which environment the project serves: `development`, `test`, `preview`, or `production`.
4. Prefer **distinct Atlas projects** (and credentials) for production vs development when account capability allows.

---

## 2. Cluster

1. Create a cluster in a region close to your hosting/users.
2. Choose a tier available on your account after checking Atlas UI limits, backups, and connection capacity. Do **not** assume free-tier numbers from outdated blogs.
3. Wait until the cluster is idle/ready before creating users or copying the URI.

Replica-set topology is the Atlas default and is required later for majority write concern / transactions. Standalone local MongoDB is not proof of Atlas behaviour.

---

## 3. Database users (not your Atlas login)

1. **Database Access** → add a user for the **application** runtime (`MONGODB_URI`).
   - Strong unique password.
   - Least privilege for later collections (read/write only on the app database). Atlas website login ≠ DB user.
2. Optionally create a **separate maintenance user** for schema/index work (`MONGODB_MIGRATION_URI`) — **do not** put this credential in the web runtime.
3. Store passwords in a password manager. When embedding in a URI, URL-encode special characters (`@`, `:`, `/`, `#`, etc.).

---

## 4. Network access

1. **Network Access** → IP access list.
2. For local development, add your current public IP (temporary entry preferred).
3. For hosting later, use the provider’s documented egress IPs or private connectivity — **do not** open `0.0.0.0/0` as a casual workaround.
4. If the host has no stable egress, document that constraint before production activation; do not guess IPs.

---

## 5. Connection string and local env

1. **Database** → Connect → Drivers → Node.js → copy the URI template.
2. Locally (PowerShell), only if `.env.local` is missing:

```powershell
if (-not (Test-Path .env.local)) { Copy-Item .env.example .env.local }
```

3. Edit **ignored** `.env.local` privately:

| Variable          | Example shape (not a real secret)          |
| ----------------- | ------------------------------------------ |
| `APP_ENV`         | `development`                              |
| `MONGODB_URI`     | `mongodb+srv://…` (password URL-encoded)   |
| `MONGODB_DB_NAME` | `zatroz_dev` (must match `zatroz_<label>`) |

4. Leave `MONGODB_MIGRATION_URI` / `MONGODB_TEST_*` blank until Steps 45–46 need them.
5. Restart `npm run dev` after changes. Never commit `.env.local`.

### Database naming policy

Allowed: `zatroz_dev`, `zatroz_test`, `zatroz_preview`, `zatroz_prod`, etc.  
Rejected: bare `test`, `admin`, `local`, or names outside `zatroz_[a-z0-9_]+`.

---

## 6. Connectivity check

```powershell
npm run db:check
```

**Passed** means ping + authentication succeeded for the labelled `APP_ENV` / database name.  
It does **not** prove collection privileges, validators, indexes, durable enquiry writes, backups, or application authorization.

**Failed — common causes (sanitized):**

| Symptom area      | What to check                                                              |
| ----------------- | -------------------------------------------------------------------------- |
| DNS / SRV         | `mongodb+srv` host spelling; local DNS/VPN filters                         |
| Network / IP list | Current public IP allowlisted; corporate firewall                          |
| Auth              | DB username/password; URI encoding of special characters                   |
| TLS               | Do not disable certificate verification to “fix” setup                     |
| Database name     | Explicit `MONGODB_DB_NAME`; wrong name does not create isolation by itself |

Do not paste the failing URI or full driver stack into chat.

---

## 7. Pool and timeout defaults (code)

| Setting                    | Value | Why                                                           |
| -------------------------- | ----- | ------------------------------------------------------------- |
| `minPoolSize`              | `0`   | Avoid holding idle sockets on serverless/dev                  |
| `maxPoolSize`              | `5`   | Per Node process — multiply by instance count vs Atlas limits |
| Server selection / connect | 8s    | Bounded vs request budget                                     |
| Wait queue                 | 5s    | Fail under pool exhaustion instead of hanging                 |

One process singleton ≠ one pool for the whole site when many serverless instances run.

---

## 8. What Step 44 does **not** do

- No collections, validators, or enquiry writes (Step 45+)
- No live Contact form enablement (`formSubmissionReady` stays false)
- No public `/api/debug-db`
- No production activation

---

## 9. Transition note (Supabase)

Earlier planning mentioned Supabase for enquiries. **MongoDB Atlas is now authoritative** for application data. Unused `SUPABASE_*` placeholders in `.env.example` are legacy documentation only — remove or ignore them when cleaning env templates; do not provision Supabase for this roadmap.
