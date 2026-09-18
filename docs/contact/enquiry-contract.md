# Enquiry form contract

**Version:** 1.0 (Step 43)  
**Transport boundary:** Future **Next.js Server Action** (not a parallel Route Handler).  
**Current submission readiness:** `false` — frontend complete; backend gates remain.

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
