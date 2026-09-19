# Step 48 — Harden duplicate-submission protection

**Date:** 2026-09-20  
**Branch:** `feature/48-submission-protection`  
**Prerequisite:** Step 47 (durable enquiry submission).

## Audit findings

### Gap 1 — Client idempotency key never reached the server (CRITICAL)

The Step 47 `useSubmitEnquiry` hook generated cryptographic idempotency keys but called `submitEnquiryAction(input)` without passing them. The Server Action tried to read `x-idempotency-key` from request headers, but Next.js Server Actions do not support custom client-set headers. The server always fell back to `randomBytes(32)`, meaning **every retry created a new enquiry** — deduplication was entirely non-functional.

**Fix:** Changed the Server Action signature to `submitEnquiryAction(input, idempotencyKey?)` accepting the key as a direct parameter. The client hook now passes `currentKey.current` on every call.

### Gap 2 — Payload signature used JSON.stringify (non-deterministic)

The client compared payloads using `JSON.stringify(input)` which is sensitive to property ordering. While JavaScript objects typically maintain insertion order, this is not guaranteed across different code paths.

**Fix:** Introduced `businessPayloadSignature()` that sorts keys alphabetically and lowercases email — matching the server's `businessFieldsProjection()` canonicalization exactly.

### Gap 3 — No explicit business-field projection type

The fingerprint included all normalized input fields without a documented separation from transport metadata. Future steps (e.g. Step 49 Turnstile tokens) could accidentally leak transport details into the fingerprint.

**Fix:** Extracted `businessFieldsProjection()` as a named function in the Server Action that explicitly selects only business fields. Transport metadata (challenge tokens, trace IDs, etc.) is excluded by design.

### Already correct (no change needed)

- **Synchronous submit lock:** `submitLock.current` prevents rapid double-clicks before React re-renders
- **UI pending state:** `isPending` check in `onSubmit` prevents concurrent submissions
- **Server-side unique index:** `uniq_enquiries_idempotency_digest` on MongoDB handles true concurrency
- **Duplicate-key resolution:** Repository catches `11000` and does bounded primary lookup with fingerprint comparison
- **Conflict detection:** Same key + different fingerprint → conflict (never mutation)
- **Value preservation:** All non-accepted outcomes preserve form values
- **Key clear on acceptance:** Only confirmed `accepted` clears the key and form

## Files changed

| File                                         | Change                                                                                           |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `src/server/actions/submit-enquiry.ts`       | Accept key as parameter; add `businessFieldsProjection`; key validation; export constants        |
| `src/components/forms/use-submit-enquiry.ts` | Pass key to server action; use canonical `businessPayloadSignature`; document refresh limitation |
| `scripts/test-enquiry-submission.ts`         | 15 tests covering key lifecycle, business fingerprint, conflict scenarios, refresh limitation    |
| `docs/backend/step-48.md`                    | This file                                                                                        |
| `docs/contact/enquiry-contract.md`           | Updated idempotency implementation notes                                                         |
| `docs/progress.md`                           | Step 48 entry                                                                                    |

## Retry/retention limitations (documented honestly)

1. **Page refresh loses the in-memory key.** A retry after refresh generates a new key and may create a second enquiry if the first was already stored.
2. **Cross-device dedup is not supported.** Keys are in component memory only.
3. **Key retention depends on the supported fingerprint secret version.** If the HMAC secret rotates and the old version is removed, fingerprint comparison on replay may fail safely (no second enquiry created, but the retry returns unavailable rather than the original accepted result).

## Checks

- `npm run test:enquiry-submission` — 15 checks (was 11)
- `npm run check` — full quality suite
- `npm run build` — production build
- Live MongoDB concurrent insert tests — **Not run** (requires active DB)
