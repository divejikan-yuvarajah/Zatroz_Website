# Step 47 — Durable enquiry submission and frontend integration

**Date:** 2026-09-20  
**Branch:** `feature/47-enquiry-backend`  
**Prerequisite:** Steps 44–46 + A01–A12 completed and verified.

## Summary

Replaced the development-only simulated form transport with a real Server Action that accepts, validates, rate-limits, and durably stores each enquiry in MongoDB with idempotent duplicate handling.

## Architecture

### Transport: Server Action (not Route Handler)

Per the Step 43 contract decision, the transport boundary is a Next.js Server Action at `src/server/actions/submit-enquiry.ts`. No parallel REST route was created.

### Pipeline order

1. **ENQUIRIES_ENABLED** env flag — fast fail when submission is disabled
2. **Request headers** — extracted via `headers()` for origin/policy checks
3. **Full policy gate** — origin allowlist → fetch-metadata → payload budget → server-owned field rejection → independent server validation (reuses Step 46 `gateEnquiryServerActionInput`)
4. **Secret resolution** — abuse HMAC + idempotency fingerprint secrets
5. **MongoDB connection** + full readiness check (migration ledger, critical indexes)
6. **Distributed rate limiting** — per-source (10/10min) + global (120/10min) via MongoDB `rate_limit_buckets`
7. **Idempotency key** — SHA-256 digest of client-supplied key (stable across rotation)
8. **Payload fingerprint** — HMAC with versioned secret, deterministic canonical form
9. **Atomic insert** — single-document with enquiry data + metadata
10. **Duplicate resolution** — unique index on idempotency digest; same payload → replay accepted; different payload → conflict

### Client integration

- `useSubmitEnquiry` hook manages idempotency keys per captured attempt
- `LiveEnquiryForm` component wraps `EnquiryForm` with the real Server Action
- Contact page route conditionally renders the form when `formSubmissionReady` is true
- Gallery harness continues to use simulated transport for UI testing

## Files changed

| File                                         | Change                                                |
| -------------------------------------------- | ----------------------------------------------------- |
| `src/server/actions/submit-enquiry.ts`       | **New** — Server Action with full pipeline            |
| `src/components/forms/use-submit-enquiry.ts` | **New** — Client hook with idempotency key management |
| `src/components/forms/live-enquiry-form.tsx` | **New** — Production form wrapper                     |
| `src/app/contact/page.tsx`                   | Wire live form when `formSubmissionReady`             |
| `scripts/test-enquiry-submission.ts`         | **New** — Unit tests for submission pipeline          |
| `package.json`                               | Add `test:enquiry-submission` to scripts and `check`  |
| `docs/contact/enquiry-contract.md`           | Updated to v2.0 with implementation details           |
| `docs/backend/step-47.md`                    | This file                                             |
| `docs/progress.md`                           | Step 47 entry                                         |

## What is NOT done

- **`formSubmissionReady` remains `false`** — the live form does not appear on public `/contact` until this flag is set to `true` with all env secrets configured
- **Email/WhatsApp notifications** — separate future step; enquiry acceptance ≠ notification delivery
- **Owner enquiry inbox** — no admin UI for reading enquiries yet
- **Production activation** — requires verified production secrets, networking, and indexes
- **Live MongoDB integration test** — requires `ENQUIRIES_ENABLED=true` + all secrets configured

## Activation checklist

To enable real submission in development:

1. Set `ENQUIRIES_ENABLED=true` in `.env.local`
2. Ensure `ABUSE_HASH_SECRET` is set (generate: `openssl rand -base64 32`)
3. Ensure `ENQUIRY_IDEMPOTENCY_SECRET` is set (generate: `openssl rand -base64 32`)
4. Ensure `APP_ORIGIN=http://localhost:3000` (or actual origin)
5. Run `npm run db:apply -- --target development` if not already done
6. Set `contactPageRecord.formSubmissionReady = true` in `src/content/contact-page.ts`
7. Restart dev server

## Checks

- `npm run test:enquiry-submission` — pipeline unit tests
- `npm run check` — full quality suite including new tests
- `npm run build` — production build
- Live MongoDB enquiry insert — **Not run** (requires activation checklist)
