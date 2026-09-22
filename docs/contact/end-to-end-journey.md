# End-to-end enquiry journey

**Step:** 53  
**Date:** 2026-09-22  
**Branch:** `feature/53-enquiry-journey`  
**Purpose:** Map the real wired path from public CTA → durable enquiry → notification worker → delivery/recovery, and separate what is proven locally from what remains Not run.

## Journey map (actual modules)

| Stage                           | What happens                                                       | Actual route / module                                                                      | Evidence status                                                          |
| ------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| 1. Eligible CTA                 | Service / home CTAs deep-link to Contact with optional `?service=` | `src/server/services.ts` → `publicRoutes.contact.path`; `parseContactServiceParam`         | Unit: `test:contact-service-query`, `test:enquiry-journey`               |
| 2. Contact context              | Confirmed email/WhatsApp channels render; framing copy stays gated | `/contact` → `src/app/contact/page.tsx`, `getPublicContactPage`                            | Page available; draft framing omitted when not approved                  |
| 3. Form validation              | Client + server independent field rules                            | `validateEnquiryInput`, `LiveEnquiryForm`, gallery harness                                 | Unit: `test:enquiry-input`                                               |
| 4. Challenge                    | Cloudflare Turnstile siteverify (server-only)                      | `TURNSTILE_*` env; `src/server/security/turnstile-verify.ts`                               | Unit: `test:turnstile-verification`; live siteverify **Not run**         |
| 5. Guarded request              | Origin / payload / rate-limit / readiness gates                    | `gateEnquiryServerActionInput`, `evaluateEnquiryReadiness`                                 | Unit: `test:request-safeguards`, `test:enquiry-submission`               |
| 6. Durable enquiry + intent     | Atomic insert of enquiry + embedded `notificationIntent`           | `submitEnquiryAction` → `insertEnquiryDocument`                                            | Unit mock path: `test:enquiry-submission`; live Atlas insert **Not run** |
| 7. Independent worker           | Lease + fencing token; frozen provider identity                    | `POST /api/jobs/enquiry-notifications` (`CRON_SECRET`); `dispatchEnquiryNotificationBatch` | Unit: `test:enquiry-notifications`; production cron **off**              |
| 8. Provider acceptance          | Capture or Resend adapter                                          | `sendNotification` / Step 50 adapter                                                       | Capture unit: `test:transactional-email`; live Resend **Not run**        |
| 9. Verified delivery / recovery | Webhook receipts + owner ops                                       | `POST /api/webhooks/resend`; `/admin/notifications`                                        | Unit: retry/delivery matrix; live webhook **Not run**                    |
| 10. Authorized owner review     | Owner MFA + `enquiries.read` / `enquiries.manage`                  | AuthZ matrix + recovery actions                                                            | Unit: `test:admin-authz`, `test:enquiry-journey`                         |

## Layer distinctions (do not conflate)

| Layer                      | Current truth                                                                           |
| -------------------------- | --------------------------------------------------------------------------------------- |
| Page availability          | `/contact` is implemented and linked                                                    |
| Form submission acceptance | `contactPageRecord.formSubmissionReady === false` — public Live form is **not** mounted |
| Notification dispatch      | Worker + capture adapter exist; production schedule remains **off**                     |
| Event tracking             | Resend webhook route exists; signing secret required                                    |
| Policy approval            | Privacy/Terms pages are Step 54 (routes still `implemented: false`)                     |

## Failure matrix (Step 53)

| Risk                                           | Expected behaviour                                 | Covered by                                           |
| ---------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------- |
| Required / conditional field errors            | Clear correction; no insert                        | `test:enquiry-input`, journey                        |
| Missing / failed Turnstile                     | Retained input; direct-contact fallback            | `test:turnstile-verification`, contact channels      |
| Origin / body / rate-limit rejection           | No write; safe feedback                            | `test:request-safeguards`, `test:enquiry-submission` |
| Rapid duplicate / concurrent retries           | One enquiry + one notification intent              | `test:enquiry-submission` (idempotency)              |
| Database unavailable before accept             | No false success                                   | `test:enquiry-submission` / readiness                |
| Stored enquiry, response lost                  | Same-key retry; no duplicate                       | `test:enquiry-submission`                            |
| Email provider unavailable after storage       | Visitor still received; ops sees pending/failure   | Intent states + dispatcher unit                      |
| Provider accepts, local update fails           | Same provider key inside 24h horizon               | `decideNotificationRetry` + Step 52                  |
| Uncertainty beyond dedupe horizon              | `needs-review`; no automatic new key               | journey + `test:enquiry-notifications`               |
| Worker overlap / webhook replay / out-of-order | Lease fencing + durable event receipt + fact merge | Step 51–52 units + journey                           |
| Owner recovery vs editor / anonymous           | Denied at permission gate                          | `test:admin-authz`, journey                          |
| Sending disabled / missing config              | Readiness / paused intent — not silent drop        | readiness + initial intent states                    |

## UX / accessibility notes (what was actually checked)

| Check                                           | Result                                                              |
| ----------------------------------------------- | ------------------------------------------------------------------- |
| Keyboard / labels / status via form components  | Covered by existing form + gallery harness tests; no new raster art |
| Service query does not put personal data in URL | Only allowlisted `?service=` slug                                   |
| Submit guarding / no-JS channels                | Mailto / WhatsApp remain when form gated                            |
| Viewport / screen-reader sweep                  | **Not run** in this step (no interactive browser session)           |

## Privacy / operational boundaries

- Public pages must not expose enquiry bodies, delivery logs, recovery actions, or signed previews.
- Recipient allowlist is server-owned (`ENQUIRY_NOTIFICATION_EMAIL`); test mode cannot relay to arbitrary addresses.
- Expected processors: MongoDB Atlas, Cloudflare Turnstile, Resend (when enabled) — match data-flow inventory; do not claim “no data leaves the server.”
- AuthZ inventory now includes `/admin/notifications`, `notificationRecoveryAction`, `POST /api/jobs/enquiry-notifications`, and `POST /api/webhooks/resend`.

## Readiness matrix

| Area                           | Status                                | Evidence                                                   |
| ------------------------------ | ------------------------------------- | ---------------------------------------------------------- |
| Implementation (code path)     | Ready for controlled activation       | Steps 42–52 modules + Step 53 wiring inventory             |
| Mock / unit journey matrix     | Passed                                | `npm run test:enquiry-journey` (+ prior suite)             |
| Real database concurrency      | Not run                               | Requires Atlas credentials                                 |
| Provider-test Resend + webhook | Not run                               | Requires authorized test inbox + webhook secret            |
| Owner workflow (UI)            | Implemented; live MFA session Not run | `/admin/notifications`                                     |
| Production readiness           | **Not ready**                         | Form flag false; cron off; Privacy/Terms pending (Step 54) |

## Activation checklist (owner; not done here)

1. Apply Mongo migration `MIGRATION_ID` (step-52) in the target database.
2. Set `ENQUIRIES_ENABLED=true` and Turnstile / abuse / idempotency secrets.
3. Flip `formSubmissionReady` only after policy + ops approval.
4. Configure Resend domain + `RESEND_WEBHOOK_SECRET`; point webhook at `/api/webhooks/resend`.
5. Schedule `POST /api/jobs/enquiry-notifications` with `CRON_SECRET` — keep disabled until deliberately activated.
6. Complete Step 54 Privacy/Terms publication before claiming public legal readiness.
