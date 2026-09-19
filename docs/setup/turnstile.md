# Cloudflare Turnstile setup (Step 49)

**Purpose:** Server-verified challenge for the Contact enquiry form.  
**Provider docs:** [Siteverify](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/), [Testing](https://developers.cloudflare.com/turnstile/troubleshooting/testing/).

This runbook prepares configuration. It does **not** buy Cloudflare services, alter production DNS, or enable production submission automatically.

---

## Variables

| Name                             | Where used                         | Notes                                                    |
| -------------------------------- | ---------------------------------- | -------------------------------------------------------- |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Browser widget (`LiveEnquiryForm`) | Public; embedded at **build** time                       |
| `TURNSTILE_SECRET_KEY`           | Server Siteverify only             | Never `NEXT_PUBLIC_`; never log or persist               |
| `APP_ORIGIN` / `SITE_URL`        | Expected hostname check            | Hostname extracted and compared to Siteverify `hostname` |
| `APP_ENV`                        | Production guard                   | `production` rejects Cloudflare documented test keys     |

Widget `action` (client + server): `enquiry-submit` (`TURNSTILE_ENQUIRY_ACTION`).

---

## Cloudflare dashboard checklist

1. Create a Turnstile widget for the Zatroz site.
2. Limit hostnames to the intended production (and staging) hosts — do not allow arbitrary preview wildcards unless separately reviewed.
3. Copy the **site key** into `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (and rebuild for production).
4. Copy the **secret key** into `TURNSTILE_SECRET_KEY` (server env only).
5. Confirm the widget can use an explicit action label matching `enquiry-submit`.

Rotation: issue a new widget/keys, update both env values, redeploy, then retire the old secret in the dashboard.

---

## Development / test keys

Official always-pass / always-fail dummy keys may be used when `APP_ENV` is **not** `production` (for example `development` or `test`).

| Site key                   | Secret key                            | Behaviour           |
| -------------------------- | ------------------------------------- | ------------------- |
| `1x00000000000000000000AA` | `1x0000000000000000000000000000000AA` | Always passes       |
| `2x00000000000000000000AB` | `2x0000000000000000000000000000000AA` | Always fails        |
| `3x00000000000000000000FF` | `3x0000000000000000000000000000000AA` | Interactive / spent |

Production (`APP_ENV=production`) **refuses** these test keys at readiness and Siteverify. Do not ship a pass-all fallback.

CI uses mocked `fetch` in `scripts/test-turnstile-verification.ts` — no live Cloudflare account required for `npm run check`.

---

## Application behaviour

1. Cheap gates run first: origin, fetch-metadata, payload budget, validation, distributed rate limits.
2. Then Siteverify (5s timeout). Failures → `challenge-failed` or `unavailable` (config/provider). No enquiry insert.
3. Tokens are **transport-only** — excluded from the business payload fingerprint and never stored on the enquiry document.
4. Same-attempt retries after uncertain outcomes keep the enquiry idempotency key but obtain a **fresh** Turnstile token (widget reset).
5. Rate-limit counters still consume on rejected attempts (same Step 46 policy). Turnstile does not replace rate limiting.

Direct email / WhatsApp contact remains available when the widget script is blocked or verification fails.

---

## CSP note (full policy in Step 61)

When Content-Security-Policy is enforced, allow:

- Script: `https://challenges.cloudflare.com`
- Frame: `https://challenges.cloudflare.com`
- Connect (Siteverify is server-side only): no browser call to Siteverify

Until Step 61, document these origins; do not invent a loose production CSP here.

---

## Verification steps (human / staging)

1. Set test keys locally → widget loads on Contact when `formSubmissionReady` is true.
2. Submit with always-pass keys → durable enquiry when Mongo readiness is met.
3. Always-fail keys → `challenge-failed`, form values retained, no insert.
4. Production env with test keys → readiness / verify refuse.
5. Real provider Siteverify against staging hostnames — **Not run** until account access exists.

**Real Cloudflare account check:** Not run (no production Turnstile widget provisioned in this step).
