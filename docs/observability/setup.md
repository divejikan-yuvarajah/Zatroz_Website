# Observability setup (Step 62)

## What is implemented

- Typed public events in `src/lib/observability/public-events.ts`.
- A disabled-by-default capture path and an in-memory `local` sink for tests.
- Browser capture always returns `browser-disabled`. No SDK, cookie, local queue, session replay, or form-field capture.
- Server note after a **new** enquiry insert. Replays are ignored. A logging failure does not change the accepted response.
- `GET /api/health` returns `{ "ok": true }` and does not touch the database.
- Redacted error-boundary logs (name and digest only).
- Signal evaluation in `src/lib/observability/signals.ts` for local tests. It does not send alerts.

## What is not configured

- No analytics or error-reporting vendor.
- No production or preview export.
- No consent control, because optional browser tracking is off.
- No external uptime monitor.

## Environment

`ANALYTICS_SINK` in `.env.example` must stay blank for deployed environments. The only recognised value is `local`, for the in-memory test sink. Do not set `NEXT_PUBLIC_` analytics keys. There are none.

## Decision still required

Before any browser event is sent, record whether optional analytics needs consent, the provider, and the retention period. Until that decision, leave browser tracking disabled. The published privacy notice still says the marketing pages do not ship an analytics package. That sentence matches this step.

## Checks

`npm run test:observability`
