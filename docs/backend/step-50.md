# Step 50 — Transactional email foundation

**Date:** 2026-09-21  
**Branch:** `feature/50-transactional-email`  
**Prerequisite:** Steps 47–49 (durable enquiries + Turnstile). Auth password-reset email remains unwired (A02).

## Goal

Prepare Resend configuration docs, a safe server email adapter (capture + provider), and a versioned internal enquiry notification template **without** connecting form submission to mail (Step 51).

## What was implemented

| Area           | Detail                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------- |
| Setup runbook  | `docs/setup/transactional-email.md` — domain/DNS/API/recipient modes                                    |
| Pure email lib | `src/lib/email/*` — addresses, HTML escape, config, destinations, capture sink, templates, send adapter |
| Server wrapper | `src/server/email/send-notification.ts` — `server-only` + Resend SDK                                    |
| Template       | `enquiry-internal/v1` — HTML + plain text; escaped visitor fields; text wordmark                        |
| Catalog        | `EMAIL_TEMPLATE_CATALOG` for future notification intents                                                |
| Dependency     | `resend` (lockfile updated)                                                                             |
| Tests          | `npm run test:transactional-email` — capture, config, escaping, mock provider, recipient gate           |

## Adapter contract

`sendNotification` returns one of:

- `accepted` — capture id or Resend message id (`transport: capture | provider`)
- `rejected` — disabled, missing config, invalid payload, recipient not allowed, provider 4xx
- `transient-failure` — rate limit, timeout, 5xx / unavailable
- `uncertain` — network loss or ambiguous provider response

SDK `error` objects are treated as failures even when no exception is thrown.

## Env (server only)

| Variable                      | Role                                   |
| ----------------------------- | -------------------------------------- |
| `EMAIL_TRANSPORT`             | `capture` (default) or `provider`      |
| `EMAIL_NOTIFICATIONS_ENABLED` | Must be `true` to send                 |
| `ENQUIRY_FROM_EMAIL`          | Verified From identity                 |
| `ENQUIRY_NOTIFICATION_EMAIL`  | Team allowlist (production To)         |
| `RESEND_API_KEY`              | Required for `provider`                |
| `EMAIL_AUTHORIZED_TEST_INBOX` | Optional non-prod provider destination |

## Recipient safety

| `APP_ENV`      | Provider To allowlist                                                |
| -------------- | -------------------------------------------------------------------- |
| `production`   | `ENQUIRY_NOTIFICATION_EMAIL` only                                    |
| Non-production | `@resend.dev` test destinations and/or `EMAIL_AUTHORIZED_TEST_INBOX` |

## Template inventory

| Id                 | Version               | Audience      |
| ------------------ | --------------------- | ------------- |
| `enquiry-internal` | `enquiry-internal/v1` | internal-team |

No `/admin/enquiries` links. No visitor HTML, attachments, or remote images from submitted URLs.

## Idempotency

Caller may supply `providerIdempotencyKey` (≠ enquiry attempt key). Resend window: **24 hours** (`RESEND_IDEMPOTENCY_WINDOW_HOURS`). Durable local notification state is Step 51+.

## Not done / Not run

| Item                                              | Status                                  |
| ------------------------------------------------- | --------------------------------------- |
| Wire notifications from enquiry submission        | Step 51                                 |
| Production DNS publish / domain verification      | Operator — **Not run**                  |
| Live Resend send to `@resend.dev` or team inbox   | **Not run** (no unsolicited real sends) |
| Auth / password-reset email templates             | Still unwired                           |
| Public HTTP relay accepting arbitrary mail fields | Intentionally absent                    |

## Checks

- `npm run format` — passed
- `npm run check` — passed (includes `test:transactional-email`)
- `npm run build` — passed
- Live Resend / DNS verification / form-triggered mail — **Not run**
