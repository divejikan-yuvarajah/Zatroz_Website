# Step 51 — Connect enquiry notifications

**Date:** 2026-09-21  
**Branch:** `feature/51-enquiry-notifications`  
**Prerequisite:** Steps 47–50 (durable enquiries + Turnstile + transactional email adapter).

## Goal

Every newly accepted enquiry carries a durable notification intent in the same MongoDB document. Form acceptance stays independent of email. A protected dispatcher claims work with a lease and calls the Step 50 adapter.

## Design

| Decision     | Choice                                                                            |
| ------------ | --------------------------------------------------------------------------------- |
| Storage      | Embedded `notificationIntent` on the enquiry document (atomic with insert)        |
| Recipients   | Fixed team allowlist from env — never visitor-chosen                              |
| Provider key | `enquiry-notice/{intentId}/{templateVersion}` — no emails, no browser key         |
| Freeze       | Sender/recipients/reply-to/template fingerprint set before first provider attempt |
| Dispatch     | Lease + fencing token via `findOneAndUpdate`; stale workers cannot finalize       |
| Invocation   | `POST /api/jobs/enquiry-notifications` (`CRON_SECRET`) or CLI script              |
| Legacy rows  | No intent field → never selected for send                                         |

## Intent states

`pending` → `leased` → `provider-accepted` | `rejected` | `uncertain` | `paused`

- `paused`: notifications disabled at accept/dispatch time (durable; not a false delivery)
- `uncertain`: transient/ambiguous provider outcome — same provider key on retry (Step 52)
- Acceptance status of the enquiry is never changed by dispatch outcomes

## What was implemented

| Area            | Path                                                         |
| --------------- | ------------------------------------------------------------ |
| Intent helpers  | `src/lib/enquiries/notification-intent.ts`                   |
| Schema + index  | `notificationIntent` + `idx_enquiries_notification_dispatch` |
| Accept wiring   | `submitEnquiryAction` embeds intent on insert                |
| Claim/finalize  | `src/server/repositories/enquiries.ts`                       |
| Dispatcher      | `src/server/jobs/enquiry-notifications.ts`                   |
| Protected route | `src/app/api/jobs/enquiry-notifications/route.ts`            |
| CLI             | `npm run jobs:dispatch-enquiry-notifications`                |
| Tests           | `npm run test:enquiry-notifications`                         |

## Migration

`MIGRATION_ID` bumped to `2026-09-21-step-51-enquiry-notification-intent`. Apply with existing `db:plan` / `db:apply` tooling before relying on the new index in a live database. Historical enquiries are not backfilled or auto-sent.

## Not done / Not run

| Item                                        | Status                  |
| ------------------------------------------- | ----------------------- |
| Automated retries / webhook delivery events | Step 52                 |
| Production cron schedule                    | Not enabled             |
| Live Resend send to team inbox              | Not run                 |
| Historical backlog send                     | Explicitly out of scope |

## Checks

- `npm run format` — passed
- `npm run check` — passed (includes `test:enquiry-notifications`, 5 checks)
- `npm run build` — passed
- Live Mongo claim concurrency / live Resend / production cron — **Not run**
