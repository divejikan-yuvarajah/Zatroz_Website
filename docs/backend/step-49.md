# Step 49 — Enquiry spam protection (Turnstile + rate limits)

**Date:** 2026-09-20  
**Branch:** `feature/49-enquiry-spam-protection`  
**Prerequisite:** Steps 46–48 (distributed rate limits + durable idempotent submission).

## Goal

Add **server-verified** Cloudflare Turnstile to the enquiry Server Action without replacing or double-counting the existing MongoDB rate limiter, and without breaking same-attempt idempotent retries.

## What was implemented

| Area           | Detail                                                                                                             |
| -------------- | ------------------------------------------------------------------------------------------------------------------ |
| Pure helpers   | `src/lib/security/turnstile.ts` — config, test-key detection, token bounds, Siteverify parse/evaluate              |
| Siteverify     | `src/lib/security/turnstile-siteverify.ts` (+ `src/server/security/turnstile-verify.ts` re-export) — 5s timeout     |
| Client widget  | `src/components/forms/turnstile-challenge.tsx` — explicit render, load/expiry/error/reset, shared script promise   |
| Form wiring    | `EnquiryForm` + `LiveEnquiryForm` — transport `turnstileToken`; reset on challenge failure / unknown / unavailable |
| Server Action  | Verify **after** rate limits, **before** insert; map failures to `challenge-failed` / `unavailable`                |
| Readiness      | Turnstile site + secret required; production rejects Cloudflare test keys                                          |
| Transport      | New result status `challenge-failed`; `EnquirySubmitTransport.turnstileToken` excluded from fingerprint            |
| Tests          | `scripts/test-turnstile-verification.ts` + enquiry submission fingerprint exclusion                                |

## Pipeline order (unchanged intent)

1. `ENQUIRIES_ENABLED`
2. Origin / fetch-metadata / budget / validation
3. Secrets + DB + readiness (now includes Turnstile env)
4. Distributed rate limits (per-source + global) — **one** policy
5. Turnstile Siteverify
6. Idempotent insert (business fingerprint only)

## Rate-limit reconciliation

Counters still live in `rate_limit_buckets` via `enforceEnquiryRateLimits`. Retries and challenge failures that reach the Server Action consume quota the same way as other processed attempts. Turnstile is **not** a second limiter and does **not** grant unlimited submissions.

Trusted identity: platform `x-real-ip` (with careful XFF fallback in development only) → HMAC — unchanged from Step 46.

## Retry contract

| Value                        | Role                                                                                                                    |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Enquiry attempt key          | Client-held; retained on uncertain outcomes; SHA-256 digest for Mongo uniqueness                                        |
| Turnstile token              | Single-use transport; fresh token required for each new Siteverify call                                                 |
| Siteverify `idempotency_key` | Optional provider mechanism; **not** the enquiry key (adapter supports it; enquiry path does not reuse the attempt key) |

## Already correct / reused

- Step 46 origin allowlist, body budget, safe errors
- Step 47–48 idempotent insert + business-field projection
- Form submit lock + pending UI
- Direct contact fallbacks on failure phases

## Not done / Not run

| Item                                                             | Status                                                           |
| ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| Real Cloudflare widget + Siteverify against production hostnames | **Not run** — account/hostname setup pending                     |
| Production CSP allowing Turnstile script/frame                   | Deferred to Step 61; origins listed in `docs/setup/turnstile.md` |
| Honeypot field                                                   | Not added (no demonstrated gap beyond Turnstile + rate limits)   |
| Production `ENQUIRIES_ENABLED` / `formSubmissionReady`           | Still gated                                                      |

## Checks

- Targeted: `npm run test:turnstile-verification`, `npm run test:enquiry-submission`, `npm run test:request-safeguards`
- Full: `npm run check`, `npm run build`
- Live provider: **Not run**
