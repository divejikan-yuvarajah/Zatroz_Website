# Enquiry form contract

**Version:** 2.0 (Step 47)  
**Transport boundary:** Next.js **Server Action** (`submitEnquiryAction` in `src/server/actions/submit-enquiry.ts`).  
**Current submission readiness:** Controlled by `ENQUIRIES_ENABLED=true` env flag + full readiness gate.

## Field definitions

| Field              | Required                       | Normalization             | Limits / allowlist                                             | Notes                                                                                          |
| ------------------ | ------------------------------ | ------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `name`             | Yes                            | Edge trim                 | 1–100 chars                                                    | Unicode allowed; no letters-only restriction                                                   |
| `email`            | Yes                            | Edge trim                 | Max 254; reasonable syntax                                     | Does not prove deliverability; do not mutate local part                                        |
| `company`          | No                             | Edge trim; blank → `null` | Max 120                                                        |                                                                                                |
| `service`          | Yes                            | Trim                      | `not-sure` + six canonical slugs                               | Prompt empty option is not a valid submit value                                                |
| `message`          | Yes                            | Edge trim only            | 20–5000 (edge-trimmed length)                                  | Preserve internal spaces and line breaks                                                       |
| `timeline`         | No                             | Trim; blank → `null`      | `exploring`, `within-month`, `one-to-three-months`, `flexible` | Preference, not a delivery promise                                                             |
| `requestType`      | No (default `project-enquiry`) | Trim                      | `project-enquiry`, `meeting-request`                           | Meeting request does not book a slot                                                           |
| `preferredContact` | No (default `email`)           | Trim                      | `email`, `whatsapp`, `phone`                                   |                                                                                                |
| `phone`            | Conditional                    | Edge trim                 | Max 40; 7–15 digits after stripping separators                 | Required only for phone/WhatsApp preference; **omitted** from payload when preference is email |
| `budgetRange`      | —                              | —                         | —                                                              | **Absent** until ranges/currency are approved                                                  |

Unknown properties must not pass through into the server payload.

### Message counting rule

`count = message.trim().length` (edge trim only). Counters and validation must use the same rule. Do not announce the counter on every keystroke to screen readers.

## Response contract (`EnquirySubmitResult`)

| `status`           | Meaning                                         | UI                                                                                                            |
| ------------------ | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `accepted`         | Backend durably accepted/stored the enquiry     | “We have received your enquiry.” Optional opaque `reference`. **Not** proof a human read it or email notified |
| `validation-error` | Allowlisted field errors + safe general message | Error summary + field messages; preserve values                                                               |
| `rate-limited`     | Too many attempts                               | Safe retry guidance; optional `retryAfterSeconds`                                                             |
| `unavailable`      | Known processing failure                        | Error + direct contact alternative                                                                            |
| `unknown-outcome`  | Timeout / network / malformed result            | Honest uncertainty; **no automatic retry**; preserve values                                                   |

Customer-facing results must never include MongoDB IDs, stack traces, provider payloads, secrets, raw dumps, or internal diagnostics.

Malformed or unexpected transport payloads coerce to `unknown-outcome`.

## UI state transitions

`idle` → submit → `pending` → one of `accepted` | `invalid` (client or server validation) | `rate-limited` | `unavailable` | `unknown-outcome`.

- One captured attempt while pending (disable submit; ignore duplicate Enter/clicks).
- Preserve values on all non-accepted outcomes.
- Clear sensitive values only after verified `accepted`; offer “Start another enquiry”.
- Development harness labels every accepted result as demo.

## Error message ownership

| Layer                           | Owns                                                            |
| ------------------------------- | --------------------------------------------------------------- |
| Client (`validateEnquiryInput`) | Guidance messages before transport                              |
| Server (future)                 | Independent validation; may return `validation-error` field map |
| Transport coercion              | `unknown-outcome` when shape is invalid                         |

## Schema change strategy

Bump this document’s version when fields, enums, or result statuses change. Keep `EnquiryNormalizedInput` and `EnquirySubmitResult` in sync in `src/lib/enquiries/*`. Prefer additive optional fields; remove fields only with a coordinated server deploy.

## Live-form prerequisites (not done in Step 43)

1. Independent server validation of all submitted values
2. Request-size and abuse controls
3. Approved data-use / privacy notice link when ready
4. Safe MongoDB persistence for enquiries
5. Safe response mapping (no internal leakage)
6. Duplicate / uncertain-outcome handling (idempotency before auto-retry)
7. Monitoring without personal payloads in logs
8. Integration verification without production test spam

Notification delivery is **separate** from enquiry acceptance. Content-editor admin roles must not automatically access private enquiries.

Environment flags or an installed MongoDB driver alone are **not** evidence that public submission works. Keep `contactPage.formSubmissionReady` false until the gates above are satisfied.

## Step 46 safeguards (integrated in Step 47)

Transport is a **Server Action**. Step 46's origin allowlisting, payload budgets, MongoDB rate-limit helpers, safe error mapping, readiness checks, and repository boundaries are now wired into `submitEnquiryAction`. See `src/server/actions/submit-enquiry.ts`.

## Step 47 implementation

The real Server Action pipeline:

1. `ENQUIRIES_ENABLED` env flag check
2. Request header extraction (origin, fetch-metadata)
3. Full policy gate: origin → fetch-metadata → payload budget → server-owned field rejection → independent validation
4. Secret resolution (abuse HMAC + idempotency HMAC)
5. MongoDB connection + full readiness check (migration ledger, critical indexes, Turnstile env)
6. Distributed rate limiting (per-source + global)
7. Turnstile Siteverify (server-only; tokens never stored)
8. Idempotency key processing (SHA-256 digest of client key)
9. Payload fingerprint (HMAC with versioned secret; business fields only)
10. Atomic insert with majority write concern
11. Duplicate-key resolution (same key + same payload → replay; different payload → conflict)

Client wrapper: `useSubmitEnquiry` hook manages idempotency keys per captured attempt. Fresh key for each new/changed submission; retained across uncertain retries. Fresh Turnstile tokens are passed as transport metadata and do not change the business fingerprint.

Production activation requires: `ENQUIRIES_ENABLED=true`, valid `MONGODB_URI`, `ABUSE_HASH_SECRET`, `ENQUIRY_IDEMPOTENCY_SECRET`, `APP_ORIGIN`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` (non-test keys in production), applied schema migration, and critical indexes.

## Step 48 — Duplicate-submission hardening

**Key fix:** Idempotency keys are now passed as a direct parameter to `submitEnquiryAction(input, idempotencyKey)` instead of via request headers (which Server Actions cannot receive from the client).

### Business-field projection

Only business fields participate in the canonical payload fingerprint. Transport-only metadata (Turnstile tokens, trace IDs, retry counters) is excluded so a retry with a fresh token still matches the same business enquiry.

Business fields: `name`, `email` (lowercased), `company`, `service`, `message`, `timeline`, `requestType`, `preferredContact`, `phone`.

### Attempt lifecycle

| Event                         | Key behaviour                               |
| ----------------------------- | ------------------------------------------- |
| New submission                | Fresh cryptographic key generated           |
| Retry (same business fields)  | Same key retained                           |
| Changed business fields       | New key generated                           |
| Accepted result               | Key cleared; next submission gets fresh key |
| Unknown-outcome / unavailable | Key retained for deliberate retry           |
| Page refresh                  | Key lost (documented limitation)            |

### Documented limitations

1. Page refresh loses the in-memory key — a retry after refresh may create a second enquiry
2. Cross-device deduplication is not supported
3. Not "exactly-once" — guarantee scoped to retained keys within a single page session

## Step 49 — Turnstile spam protection

**Status result:** `challenge-failed` when Siteverify rejects a token (or the client submits without a usable token while the widget is required).

| Concern         | Behaviour                                                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Transport field | `EnquirySubmitTransport.turnstileToken` — not part of business fingerprint                                                         |
| Server verify   | After rate limits; before insert; 5s timeout; expected action `enquiry-submit`                                                     |
| Production      | Cloudflare documented test keys refused                                                                                            |
| Retry           | Uncertain / challenge failure resets the widget for a fresh token; enquiry attempt key retained when business fields are unchanged |
| Rate limits     | Existing Mongo buckets unchanged — Turnstile does not replace them                                                                 |
| Fallback        | Email / WhatsApp remain available when the challenge is blocked or fails                                                           |

See `docs/setup/turnstile.md` and `docs/backend/step-49.md`.

## Step 50 — Transactional email foundation (not wired yet)

Internal team notification template and Resend adapter exist (`enquiry-internal/v1`, capture/provider transports). **Enquiry submission does not send mail yet** — that is Step 51. Email failure must never mean the stored enquiry was rejected. See `docs/setup/transactional-email.md` and `docs/backend/step-50.md`.

## Step 51 — Durable notification intents

Each newly accepted enquiry embeds a `notificationIntent` in the same MongoDB document. Acceptance does not wait on email. A protected dispatcher claims intents with a lease and calls the Step 50 adapter. Replay returns the original intent and does not enqueue a second notice. See `docs/backend/step-51.md`.
