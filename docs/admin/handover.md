# Admin handover (A12)

**Audience:** Owners and editors operating the portfolio CMS after A01–A12.  
**Status:** Guide **documented**. Live teammate walkthrough with real Atlas/Cloudinary credentials **Not run** (self-check of docs + unit AuthZ suite only).

Never invent founder passwords, paste TOTP seeds, or commit `.env.local`.

---

## What this system is

| Layer                 | Role                                                                             |
| --------------------- | -------------------------------------------------------------------------------- |
| Public marketing site | Next.js App Router; services/about/process/contact copy stay in the repository   |
| Portfolio CMS         | MongoDB projects, revisions, media metadata, featured order, content jobs        |
| Media binaries        | Cloudinary — drafts authenticated/private; publish may create public derivatives |
| Staff auth            | Better Auth + MFA; roles `owner` / `editor`                                      |

Enquiry **write** path (Step 47+) is **not** enabled by completing A12. Contact still uses confirmed channels until that work lands.

---

## Roles (quick)

| Capability                                                  | Owner                           | Editor           |
| ----------------------------------------------------------- | ------------------------------- | ---------------- |
| Create/edit drafts + media                                  | Yes                             | Yes              |
| Authenticated preview                                       | Yes                             | Yes              |
| Publish / unpublish / feature / run jobs / permanent delete | Yes                             | No               |
| Manage staff roles                                          | Yes                             | No               |
| Enquiry inbox                                               | Owner when Step 47+ surfaces it | Never by default |

Full matrix: `src/lib/admin/authz-matrix.ts` (tested by `npm run test:admin-authz`).

---

## First-time owner setup

1. Configure ignored `.env.local` (see `.env.example` + `docs/setup/environment-variables.md`).
2. Apply schema: `npm run db:apply -- --target development` (maintenance URI).
3. Bootstrap owner: `npm run admin:bootstrap-owner` — then **remove** `ADMIN_BOOTSTRAP_*`.
4. Sign in `/admin/login` → enroll MFA `/admin/mfa` → store backup codes offline.
5. Optional: set `CRON_SECRET` (≥16 chars) for `/api/jobs/content-refresh`.
6. Optional: Cloudinary keys for uploads (A04).

Recovery: `docs/admin/auth-recovery.md`. Backups: `docs/admin/backup-restore.md`.

---

## Editor day-to-day

1. `/admin/projects` — create or open a draft.
2. Save summary draft (new immutable revision; live pointers unchanged).
3. Case-study editor for story blocks + gallery.
4. `/admin/media` — upload, alt/caption, replace (new version), archive.
5. **Preview draft** — uses private signed media; never copy preview URLs into public pages.
6. Ask an owner to publish when ready.

---

## Owner publish path

1. Confirm summary readiness on the project Publication panel.
2. **Publish summary** → Mongo pointer updates; content job queued.
3. Optionally **Publish story** after summary is live.
4. **Admin → Jobs** → Process due jobs (or `npm run jobs:content-refresh` / cron with `CRON_SECRET`).
5. Confirm public `/work` (and story URL when published). Status may show **Published, refresh pending** until the job succeeds.
6. **Featured** (`/admin/settings/featured`) — public-ready IDs only.
7. Unpublish / archive as needed; former slugs stay reserved/redirected per A08.

---

## Failure drills (safe)

| Drill                                           | Expected                                          |
| ----------------------------------------------- | ------------------------------------------------- |
| Editor tries Featured / Publish controls        | UI hidden or action denied                        |
| Open `/api/admin/media/.../preview` logged out  | 401                                               |
| Concurrent save with stale `concurrencyVersion` | Conflict message; reload                          |
| Failed content job                              | Re-queue then run worker; no duplicate dedupe row |
| Permanent delete of in-use media                | Denied with usage message                         |

Automated coverage: `npm run test:admin-authz`. Live browser drill: record below.

| Drill                          | Result      | Date | Operator |
| ------------------------------ | ----------- | ---- | -------- |
| Editor denied publish          | **Not run** | —    | —        |
| Anonymous media preview denied | **Not run** | —    | —        |
| Publish → job → public page    | **Not run** | —    | —        |

---

## Handover checklist

Use `docs/admin/handover-checklist.md` for a short isolated exercise. Do not practice on live customer enquiry data (none yet) or production Atlas without an explicit owner decision.

---

## Related step notes

| Step             | Doc                      |
| ---------------- | ------------------------ |
| Auth / MFA       | `docs/admin/step-a02.md` |
| Shell            | `docs/admin/step-a03.md` |
| Media            | `docs/admin/step-a04.md` |
| Publish          | `docs/admin/step-a08.md` |
| Public selectors | `docs/admin/step-a09.md` |
| Migration        | `docs/admin/step-a10.md` |
| Jobs / cleanup   | `docs/admin/step-a11.md` |
| This checkpoint  | `docs/admin/step-a12.md` |
