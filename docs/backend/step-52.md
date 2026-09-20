# Step 52 — Notification retries and recovery

**Date:** 2026-09-21  
**Branch:** `feature/52-notification-recovery`  
**Prerequisite:** Step 51 (durable notification intents + protected dispatcher).

## Goal

Recover safely from provider and worker failures, track verified delivery outcomes separately from dispatch state, and give the owner a practical recovery surface — without turning enquiry acceptance into an email-dependent path and without building an enquiry CRM.

## Design decisions

| Area               | Choice                                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Dispatch states    | `pending`, `paused`, `leased`, `provider-accepted`, `retry-scheduled`, `uncertain`, `rejected`, `permanently-failed`, `needs-review` |
| Delivery facts     | Separate field `deliveryFact`: `delivered` \| `bounced` \| `complained` \| `suppressed` \| `null`                                    |
| Retry policy       | Max **8** attempts, max age **72h**, exponential backoff with deterministic jitter                                                   |
| Resend idempotency | **24h** retention (verified 2026-09-21 against Resend docs). Conservative local horizon = 24h − 1h − lease − provider budget         |
| Beyond window      | Automatic send stops → `needs-review`. Owner may authorize a **new** intent/key after review                                         |
| Worker             | Existing `POST /api/jobs/enquiry-notifications` (`CRON_SECRET`). Production schedule remains **off** until explicitly activated      |
| Webhooks           | `POST /api/webhooks/resend` — raw body + Resend SDK signature verify; durable `email_delivery_events` receipt before apply           |
| Owner recovery     | `/admin/notifications` — requires `enquiries.read` (view) / `enquiries.manage` (mutate) + completed MFA. Editors denied              |
| Alerts             | Local dashboard indicators (oldest pending age, needs-review count). No new paid alerting service                                    |

## What was implemented

| Area                             | Path                                                                                 |
| -------------------------------- | ------------------------------------------------------------------------------------ |
| Retry / idempotency helpers      | `src/lib/enquiries/notification-intent.ts`                                           |
| Dispatcher scheduling            | `src/server/jobs/enquiry-notifications.ts`                                           |
| Claim includes `retry-scheduled` | `src/server/repositories/enquiries.ts`                                               |
| Delivery event intake            | `src/server/email/process-resend-webhook.ts`, `src/app/api/webhooks/resend/route.ts` |
| Owner ops UI                     | `src/app/admin/(console)/notifications/page.tsx`                                     |
| Recovery actions                 | `src/server/jobs/notification-recovery-actions.ts`                                   |
| Schema / migration               | `email_delivery_events` + intent state/fact fields; `MIGRATION_ID` → step-52         |
| Tests                            | Extended `npm run test:enquiry-notifications`                                        |

## Operational settings

| Setting                             | Value                                                              |
| ----------------------------------- | ------------------------------------------------------------------ |
| `ENQUIRY_NOTIFICATION_MAX_ATTEMPTS` | 8                                                                  |
| `ENQUIRY_NOTIFICATION_MAX_AGE_MS`   | 72 hours                                                           |
| `RESEND_IDEMPOTENCY_WINDOW_MS`      | 24 hours (provider)                                                |
| Backoff schedule                    | 1m → 2m → 5m → 15m → 30m → 1h → 2h → 4h (+/−20% jitter)            |
| Stale-pending indicator             | 30 minutes                                                         |
| Worker heartbeat indicator          | 20 minutes without successful dispatch counts as stale in ops docs |

## Env additions

| Variable                | Role                                                         |
| ----------------------- | ------------------------------------------------------------ |
| `RESEND_WEBHOOK_SECRET` | Svix signing secret for `/api/webhooks/resend` (server only) |

Webhook URL shape: `https://<host>/api/webhooks/resend`  
Configure allowlisted event types in Resend: delivered, bounced, complained, failed/suppressed, delivery_delayed (delayed is stored; no fact downgrade).

## Owner recovery actions

| Action               | Effect                                                                                                    |
| -------------------- | --------------------------------------------------------------------------------------------------------- |
| Retry now            | Sets `retry-scheduled` with `nextAttemptAt = now` (same provider key)                                     |
| Pause / Resume       | Stops or re-queues eligible work                                                                          |
| Mark reviewed        | Parks `needs-review` as paused after human review                                                         |
| Authorize new resend | Mints a **new** intent id + idempotency key (audited). Does not silently reset the original send identity |

Optimistic `recoveryVersion` prevents duplicate concurrent owner mutations. Active leases block recovery writes.

## Not done / Not run

| Item                                 | Status                             |
| ------------------------------------ | ---------------------------------- |
| Production cron activation           | Off — explicit activation required |
| Live Resend webhook + inbox delivery | Not run                            |
| Full enquiry CRM                     | Out of scope                       |
| Step 53 end-to-end journey           | Not started                        |

## Checks

- `npm run test:enquiry-notifications` — passed (retry policy + delivery-fact merge)
- `npm run format` / `npm run check` / `npm run build` — record after final run
- Live Mongo concurrency / live webhook signature against Resend — **Not run**
