# Contact Step 43 — Enquiry form validation and interactions

**Branch:** `feature/43-enquiry-form-ui` (from `feature/42-contact-layout`)  
**Status:** Frontend form complete in development harness; **submission readiness still false**

## What changed

| File                                          | Role                                          |
| --------------------------------------------- | --------------------------------------------- |
| `src/lib/enquiries/input.ts`                  | Shared validation / normalization             |
| `src/lib/enquiries/transport.ts`              | Result contract + Server Action boundary note |
| `src/lib/enquiries/simulate.ts`               | Gallery-only simulated submit                 |
| `src/components/forms/enquiry-form.tsx`       | Interactive form (production-intended)        |
| `src/components/dev/enquiry-form-harness.tsx` | Scenario harness                              |
| `scripts/test-enquiry-input.ts`               | Validation tests                              |
| `scripts/test-enquiry-transport.ts`           | Transport/simulation tests                    |
| `docs/contact/enquiry-contract.md`            | Integration handoff                           |

## Behaviour

- Public `/contact` still shows confirmed email/WhatsApp only — **no** live form (`formSubmissionReady: false`).
- Full interactive form runs in `/dev/ui` with simulated responses (accepted, validation-error, rate-limited, unavailable, unknown-outcome, malformed, delayed).
- Client validation: blur + submit; error summary focus; pending lock; values preserved on failure; accepted confirmation only after contract `accepted`.
- Demo accepted state always labelled “Demo — no enquiry was sent.”
- No localStorage/cookies/analytics; no production endpoint; no GET of personal fields.

## Readiness

| Gate                        | State                                        |
| --------------------------- | -------------------------------------------- |
| Form layout                 | Done (Step 42)                               |
| Form validation / UI states | Done (this step)                             |
| Form submission             | **Not ready** — backend prerequisites remain |
| Contact channels            | Email + WhatsApp confirmed                   |

## Checks

- `npm run validate:content` — passed (16 readiness warnings)
- `npm run check` — passed (includes `test:enquiry-input` and `test:enquiry-transport`)
- `npm run build` — passed (Next.js 16.3.5)
- Production smoke port **3043**: `/contact` 200 channels only (no form); `/dev/ui` 404
- Gallery keyboard/screen-reader review — **not run**

## Next

Revised Steps 44–46 (MongoDB foundations), then admin/enquiry backend sequence — do not treat this step as live form enablement.
