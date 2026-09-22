# Enquiry operations runbook

**Step:** 53  
**Audience:** Site owner / operator  
**Secrets:** Never paste real API keys, webhook secrets, or personal enquiry content into this file.

## Who monitors new enquiries

- **Owner** (MFA-complete) with `enquiries.read` / `enquiries.manage`.
- Editors must not see enquiry or notification recovery surfaces.
- Day-to-day monitoring: MongoDB enquiry documents (status `new`) plus `/admin/notifications` for notification queue health.

## Where pending / failed notifications appear

| Place                                 | What you see                                                                      |
| ------------------------------------- | --------------------------------------------------------------------------------- |
| `/admin/notifications`                | Queue counts, ages, safe state/category, recovery actions                         |
| Enquiry document `notificationIntent` | Embedded intent state, attempts, next attempt, provider message id, delivery fact |
| `email_delivery_events` collection    | Durable webhook receipts (applied / unmatched / ignored)                          |

Visitor acceptance is **independent** of email. A received confirmation means the enquiry was stored — not that the team inbox was notified.

## When automatic retries stop

Automatic retries stop when any of these hold:

- Attempt count reaches **8**
- Intent age exceeds **72 hours**
- Resend idempotency horizon is exceeded (provider window **24h**, minus safety margin for lease + in-flight budget)
- Destination facts `bounced` / `complained` / `suppressed` push the intent to owner review
- Notifications are paused / disabled

Terminal / review states: `permanently-failed`, `needs-review`, `paused`.

## How an owner reconciles or resends

On `/admin/notifications` (requires `enquiries.manage` + MFA):

| Action               | Use when                                                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Retry now            | Confirmed retryable failure inside the provider horizon (same provider key)                                                     |
| Pause / Resume       | Temporarily stop or re-queue eligible work                                                                                      |
| Mark reviewed        | Human reviewed `needs-review` and parked the intent                                                                             |
| Authorize new resend | Intentional new send after review — mints a **new** intent id + idempotency key (audited). Does not silently reset the original |

Optimistic `recoveryVersion` blocks stale concurrent clicks. Active leases block recovery writes until expiry.

## How to pause sending

1. Set `EMAIL_NOTIFICATIONS_ENABLED=false` (or omit provider config) — new accepts get `paused` intents.
2. Or use Pause on `/admin/notifications` for specific intents.
3. Do **not** delete enquiry documents to “stop email.”

## How to detect a stopped scheduler

- Production cron for `POST /api/jobs/enquiry-notifications` starts **off**.
- Ops signal: growing oldest-pending age on `/admin/notifications` (stale threshold ~30 minutes once cron is enabled).
- Invoke manually with `Authorization: Bearer <CRON_SECRET>` or `npm run jobs:dispatch-enquiry-notifications` in a configured environment.
- Never put `CRON_SECRET` in the browser bundle or a query string.

## How to escalate a provider outage

1. Confirm visitor accepts still succeed (form/Mongo path).
2. Check Resend status / domain verification / API key scope.
3. Leave intents in `uncertain` / `retry-scheduled` / `needs-review` — do not mint new keys to “force” sends.
4. After outage, run the worker; reconcile `needs-review` items manually.
5. Avoid alert loops through the same failing email pipeline.

## Webhook configuration (Resend)

- Endpoint: `POST /api/webhooks/resend`
- Secret: `RESEND_WEBHOOK_SECRET` (server only)
- Verify against the **raw** body; do not require browser Origin or Turnstile
- Allowlisted events: delivered, bounced, complained, failed/suppressed, delivery delayed (delayed stored; no fact downgrade)

## Related docs

- Journey + readiness matrix: `docs/contact/end-to-end-journey.md`
- Contract: `docs/contact/enquiry-contract.md`
- Steps 50–52: `docs/backend/step-50.md` … `step-52.md`
- AuthZ / handover: `docs/admin/step-a12.md`, `docs/admin/handover.md`
