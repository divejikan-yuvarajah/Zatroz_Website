# Transactional email (Resend) — setup runbook

**Step:** 50  
**Purpose:** Document how Zatroz prepares a verified sending identity, restricted API access, and safe local/provider-test modes **before** enquiry events trigger mail (Step 51).

This runbook does **not** change production DNS. Proposed DNS values come from the Resend dashboard after a domain you control is added. Compile/tests never prove domain verification or inbox delivery.

---

## Roles and boundaries

| Role                          | Address / identity                                                             | Notes                                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| **From (sending identity)**   | Mailbox on a **verified Resend domain/subdomain** Zatroz controls              | Example shape only: `Zatroz <notifications@updates.example.com>` — replace with the real domain |
| **Team notification To**      | Fixed allowlist via `ENQUIRY_NOTIFICATION_EMAIL`                               | May be Gmail (receive-only). Gmail is **not** a domain Zatroz can verify for From               |
| **Reply-To (optional later)** | Validated visitor mailbox when the approved workflow needs a direct reply path | Never put the visitor in From                                                                   |
| **Auth / password-reset**     | Separate future template + permissions                                         | A02 recovery email is **not** wired; do not mix enquiry and auth templates                      |

`zatroz.co@gmail.com` (or any other approved contact Gmail) may be an approved **receiving** inbox. It is **not** a sending domain.

---

## Account and API key

1. Use (or create) the approved Resend account owned by Zatroz operators.
2. Create a **restricted** API key scoped to sending only for this product (no broader admin keys in app env).
3. Store the key only in server env (`RESEND_API_KEY`). Never `NEXT_PUBLIC_`. Never commit real values.
4. Rotate the key if it is ever exposed in chat, screenshots, or Git history.

---

## Sending domain / DNS (operator checklist)

Add a domain or subdomain you control in Resend (for example a dedicated `updates.` subdomain). Resend then issues DNS records. Typical categories:

| Record purpose | Who owns it                      | Rule                                                                                          |
| -------------- | -------------------------------- | --------------------------------------------------------------------------------------------- |
| SPF            | Existing mail DNS for that zone  | Prefer **one** SPF TXT; merge includes — do not publish competing SPF records                 |
| DKIM           | Resend-provided CNAME/TXT set    | Publish exactly as Resend shows for the chosen domain                                         |
| DMARC          | Existing org policy for the zone | **Do not invent** a DMARC policy here; note the zone’s current DMARC and propose changes only |

**Before any DNS edit:** export the current zone records, paste Resend’s proposed values into a change ticket, and get authorization. Do not overwrite MX or unrelated mail records for the apex unless an authorized operator directs it.

Verification status lives in the Resend dashboard. Code that compiles with placeholders does **not** mean the domain is verified.

---

## Approved sender and recipients

| Env var                       | Meaning                                                              |
| ----------------------------- | -------------------------------------------------------------------- |
| `ENQUIRY_FROM_EMAIL`          | Verified From identity (`Name <mailbox@verified-domain>`)            |
| `ENQUIRY_NOTIFICATION_EMAIL`  | Comma-separated team allowlist (production To)                       |
| `EMAIL_AUTHORIZED_TEST_INBOX` | Optional single non-production inbox explicitly authorized for tests |
| `EMAIL_TRANSPORT`             | `capture` (default) or `provider`                                    |
| `EMAIL_NOTIFICATIONS_ENABLED` | Must be `true` for any send path to run; otherwise rejected          |
| `RESEND_API_KEY`              | Required when `EMAIL_TRANSPORT=provider`                             |

Production provider sends may only target the configured team allowlist.  
Non-production provider sends may only target Resend’s documented `@resend.dev` test addresses or `EMAIL_AUTHORIZED_TEST_INBOX`. Team Gmail is **blocked** in development/provider mode unless that address is explicitly set as the authorized test inbox (prefer `@resend.dev` instead).

---

## Transport modes

| Mode       | Behaviour                                                           | Is it “live”?                                      |
| ---------- | ------------------------------------------------------------------- | -------------------------------------------------- |
| `capture`  | Records synthetic messages in an in-memory test sink                | **No** — local harness only; not an ops channel    |
| `provider` | Calls Resend; returns typed accept / reject / transient / uncertain | Only when domain + key + recipients are authorized |

Capture acceptance must never be presented as operational notification delivery.

---

## Provider test destinations

Resend documents test addresses such as `delivered@resend.dev`, `bounced@resend.dev`, `complained@resend.dev`, and `suppressed@resend.dev` (plus `+label` forms). These count toward account quota. Use them for bounded integration checks with **synthetic** content only.

Do **not** send a test to the team’s real inbox without explicit authorization.

---

## Idempotency window

Resend retains idempotency keys for **24 hours** (`RESEND_IDEMPOTENCY_WINDOW_HOURS` in code). Caller-supplied provider keys are distinct from browser enquiry keys. Durable local notification state (Step 51+) is required beyond that window; the adapter alone does not claim eternal exactly-once delivery.

---

## Privacy / data-flow notes (enquiry notifications)

| Stage                        | Data                                                                                                          | Retention / visibility                          |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Enquiry stored (Steps 47–49) | Business fields in MongoDB                                                                                    | Independent of email success                    |
| Template render (Step 50)    | Reference, frozen received-at display, approved labels, contact/message fields covered by the data-use notice | Pure render; no remote images from visitor URLs |
| Capture mode                 | Synthetic harness records only                                                                                | Not application logs with real PII              |
| Provider send                | Rendered HTML/text to allowlisted recipients                                                                  | Subject to Resend + team inbox policies         |

Visitor email is never used as From. No newsletter footer, tracking pixels, or public relay endpoint that accepts arbitrary to/from/body.

---

## Local development defaults

```text
EMAIL_TRANSPORT=capture
EMAIL_NOTIFICATIONS_ENABLED=true
ENQUIRY_FROM_EMAIL=Zatroz <notifications@updates.example.com>
ENQUIRY_NOTIFICATION_EMAIL=delivered@resend.dev
RESEND_API_KEY=
```

Replace placeholders with operator-owned values before any provider send. Keep `EMAIL_TRANSPORT=capture` until domain verification and a deliberate test plan exist.

---

## Verification evidence (distinguish carefully)

| Evidence                            | Proves                                          | Does not prove                        |
| ----------------------------------- | ----------------------------------------------- | ------------------------------------- |
| `npm run test:transactional-email`  | Adapter + template behaviour with mocks/capture | Domain verification or inbox delivery |
| Resend API accept for `@resend.dev` | Provider accepted a synthetic message           | Team inbox delivery                   |
| Resend dashboard “domain verified”  | DNS/setup for that domain                       | Enquiry form wiring (Step 51)         |

---

## Related files

| Path                                    | Role                            |
| --------------------------------------- | ------------------------------- |
| `src/lib/email/*`                       | Pure config, templates, adapter |
| `src/server/email/send-notification.ts` | Server-only Resend wiring       |
| `docs/backend/step-50.md`               | Step completion notes           |
| `scripts/test-transactional-email.ts`   | Capture + mock provider tests   |

## Delivery events and recovery (Step 52)

- Webhook endpoint: `POST /api/webhooks/resend` (raw body + `RESEND_WEBHOOK_SECRET`).
- Durable receipts: `email_delivery_events` (unique `providerEventId`).
- Dispatch state and destination `deliveryFact` remain separate.
- After Resend’s 24h idempotency window, automatic retries stop at `needs-review`.
- Owner recovery: `/admin/notifications` (`enquiries.manage`).
