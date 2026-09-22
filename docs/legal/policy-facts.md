# Policy facts inventory (Step 54)

**Date recorded:** 2026-09-22  
**Branch:** `feature/54-privacy-terms`  
**Status:** Internal fact record for draft Privacy/Terms. **Not** a legal opinion and **not** publication approval.

## Operator identity

| Fact                               | Status                     | Source / note                                                   |
| ---------------------------------- | -------------------------- | --------------------------------------------------------------- |
| Public brand name                  | Confirmed in repo          | `siteRecord.name` → **Zatroz**                                  |
| Legal / trading entity name        | **Unresolved**             | Brand alone does not prove incorporation                        |
| Company registration / number      | **Unresolved**             | Do not invent                                                   |
| Registered office / postal address | **Unresolved**             | Do not publish personal home/student addresses                  |
| Appointed data-protection officer  | **Unresolved**             | None recorded; do not invent                                    |
| Primary public contact channel     | Confirmed email            | `zatroz.co@gmail.com` (`contactRecord.email`, status confirmed) |
| WhatsApp enquiry channel           | Confirmed                  | Digits in `contactRecord.whatsapp` (confirmed)                  |
| Voice phone on public surfaces     | Unconfirmed                | Must stay omitted from live footer until confirmed              |
| Instagram / LinkedIn               | Unconfirmed / missing URLs | Omitted from public links                                       |

**Owner decision needed:** Confirm the legal/trading name that should appear on Privacy and Terms (and whether a registration number or address may be published).

## What the site actually collects / processes

### Visitor-provided enquiry fields (when form submission is later enabled)

From `EnquiryFormValues` / normalised input:

- name, email, company (optional), service, message
- timeline (optional), request type, preferred contact
- phone (required only when preferred contact is phone or WhatsApp)

**Current gate:** `contactPageRecord.formSubmissionReady === false` — public live form is **not** mounted. Email/WhatsApp channels remain available.

### Technical / abuse-control information

- Trusted client IP (where the host provides it) is turned into an **HMAC identity hash** for rate limiting (`hashTrustedIdentity`). That hash is **not** anonymous/personal-data-free by default; it is a pseudonymised operational identifier.
- Payload fingerprint HMAC over **business fields only** (Turnstile tokens and similar transport metadata excluded).
- Idempotency keys bound to an accepted attempt (not a public lookup capability).
- Cloudflare Turnstile: server-side siteverify for enquiry submits when configured (`expected action` enquiry-submit). Challenge widgets may use Cloudflare cookies/storage per Cloudflare’s behaviour.
- Request safeguards: origin allowlisting, payload size limits, method checks (Step 46+).

### Notification / email path

- Durable enquiry + embedded notification intent in MongoDB Atlas.
- Internal notification to allowlisted operator recipient(s) via capture adapter or Resend (when enabled).
- Frozen provider identity / template snapshot for retries; Resend idempotency window documented as 24 hours.
- Webhook delivery events at `/api/webhooks/resend` when configured.
- Visitor email is never used as From. No newsletter, marketing send, or public email relay.

### Staff administration

- Better Auth staff sessions (cookies) under `/admin`.
- MFA (two-factor plugin) for elevated staff flows.
- Owner permissions for enquiries read/manage and notification recovery.
- Media library: Cloudinary-backed private assets + optional public derivatives for published work; admin preview uses authenticated paths.

### Public content

- Marketing pages, approved project/media when published.
- Draft editorial bodies stay gallery-only (`/dev/ui`) until `publicationState === "approved"`.

### Analytics / marketing cookies

| Item                                                              | Repo status                                                       |
| ----------------------------------------------------------------- | ----------------------------------------------------------------- |
| `@vercel/analytics` / Speed Insights / gtag / Plausible / PostHog | **Not found** in source                                           |
| Decorative cookie-consent banner                                  | **Not present** (correct — do not add without functional control) |
| Staff session cookies                                             | Present for `/admin` via Better Auth `nextCookies`                |

## Recipients / processors (categories)

| Category                                       | Role in this codebase                                                          | Notes                                                                   |
| ---------------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| Hosting (planned/used: Vercel-style Node host) | Serves the site and Server Actions                                             | Exact production account/region is an operator config fact              |
| MongoDB Atlas                                  | Application database (enquiries, intents, rate-limit buckets, auth/admin data) | Cluster region chosen by operator; not hard-coded as a compliance claim |
| Cloudflare Turnstile                           | Bot challenge verification                                                     | Processes challenge tokens; may process request metadata per Cloudflare |
| Resend                                         | Transactional email API (when enabled)                                         | Provider logs + team mailbox copies are separate from Mongo deletion    |
| Cloudinary                                     | Media binaries for admin/public derivatives                                    | Distinct from Mongo document deletion                                   |
| Google (Gmail) / WhatsApp                      | Operator inboxes / chat when visitors use those channels                       | Outside the app database                                                |

**Transfers:** International processing is likely for SaaS processors. Exact regional routing depends on operator accounts — record in approval notes before claiming a specific country list in a published notice.

## Retention / deletion (honest)

| Store                                          | Current truth                                                                     |
| ---------------------------------------------- | --------------------------------------------------------------------------------- |
| Enquiry retention period                       | **Unresolved owner decision** — data-model marks pending before live collection   |
| Notification intents / delivery event receipts | Operational records with documented recovery ownership; no invented statutory TTL |
| Rate-limit buckets                             | Short TTL counters                                                                |
| Email provider + mailbox copies                | Survive Mongo deletes until those systems’ own retention applies                  |
| Backups                                        | Atlas backup capability depends on tier; untested DR is **Not run**               |
| Idempotent retry window                        | Must remain compatible with any future deletion policy                            |

**Do not** publish a numeric retention period until the owner chooses one. Proposed (non-binding) starting discussion from older planning notes: review unsuccessful enquiries after ~180 days — **proposal only**, not adopted here.

## Cookies / browser storage (audit summary)

| Surface                | Finding                                                                                                              |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Public marketing pages | No first-party analytics package installed                                                                           |
| Contact form           | Does not rely on `localStorage` for the business payload; in-memory attempt/idempotency state can be lost on refresh |
| Turnstile              | Third-party challenge behaviour may set cookies/storage                                                              |
| Admin                  | Session cookies required for staff auth                                                                              |

## Sri Lanka data-protection sources (checked 2026-09-22)

| Source                                                   | Link / citation                                                                     | Use in drafts                                                                                                                                                                      |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Data Protection Authority (home)                         | https://www.dpa.gov.lk/                                                             | Point to official body; not a compliance certificate                                                                                                                               |
| Personal Data Protection Act, No. 9 of 2022              | Linked from DPA site                                                                | Principal statute                                                                                                                                                                  |
| Personal Data Protection (Amendment) Act, No. 22 of 2025 | https://www.dpa.gov.lk/acts/ (PDF linked on DPA site)                               | Commencement by Gazette order                                                                                                                                                      |
| Gazette Extraordinary No. 2498/16 (published 2026-07-22) | Listed on https://documents.gov.lk/view/egz/egz_2026.html — Order under PDPA s.1(3) | Secondary reporting states it appoints **1 January 2027** for Sections 2 and 3, Part I, and Part III; **re-verify the Gazette text before relying on that date in published copy** |
| Part II (data-subject rights) / Part VII (penalties)     | Not named in the secondary summaries of that Order                                  | Treat commencement of those Parts as **unresolved** until an official Order says otherwise                                                                                         |

**Unresolved legal questions (do not invent answers in public copy):**

1. Which exact legal entity is the controller for Zatroz website processing?
2. Does PDPA (as commenced) apply to this operator for the current processing, and which Parts are in force on the publication date?
3. What lawful basis / purpose limitation wording should Sri Lankan counsel approve?
4. What retention and deletion SLA should the public notice state?
5. What governing-law / dispute wording (if any) should appear in website Terms?
6. Should Privacy/Terms publish a physical address?

## Publication / notice integration rules

| Gate                                                                | Current                                                  |
| ------------------------------------------------------------------- | -------------------------------------------------------- |
| Full draft reviewable in `/dev/ui`                                  | Required for Step 54                                     |
| Public `/privacy` and `/terms` show sparse placeholders while draft | Required                                                 |
| `publicRoutes.privacy/terms.implemented`                            | Remain **false** until owner approval                    |
| Footer + Contact `privacyHref`                                      | Stay unlinked until `implemented: true`                  |
| Form short notice                                                   | Keep “link when published” until Privacy is public-ready |
| Effective date on public HTML                                       | **None** while draft — do not guess                      |
| Production form / email activation                                  | Independent; not unlocked by draft files                 |

## Proposed notice identifier (future)

When Privacy is approved and the form is live, use a server-owned notice id such as `privacy-notice-v1` recorded with accepted enquiries as **provenance of which notice text was shown**, not as proof of marketing consent. Keep that metadata out of the business payload fingerprint.
