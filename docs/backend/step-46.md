# Backend Step 46 — Database access and enquiry request safeguards

**Branch:** `feature/46-db-request-safeguards` (from `feature/45-mongodb-models`)  
**Status:** Safeguards and repositories implemented; live Atlas privilege / cross-process limiter proofs **Not run**  
**Transport:** Server Action (Step 43) — no live enquiry endpoint in this step  
**Next agreed work:** A01–A12 admin sequence — do not treat schemas as an admin panel

## Decision

| Topic                               | Record                                                               |
| ----------------------------------- | -------------------------------------------------------------------- |
| Public enquiry write                | Still disabled (`formSubmissionReady: false`, readiness fail-closed) |
| Fake admin auth                     | Denied — `requireAdmin` always fails until A02–A03                   |
| MongoDB privileges vs website roles | Collection ACLs ≠ owner/editor permissions                           |
| Atlas backups                       | Verify tier in UI — do not assume                                    |

## What changed

| Area                                                | Location                                    |
| --------------------------------------------------- | ------------------------------------------- |
| Privilege matrix                                    | `docs/security/database-access.md`          |
| Request policy                                      | `docs/security/request-policy.md`           |
| Readiness / recovery                                | `docs/security/readiness.md`, `recovery.md` |
| Origin / body / errors                              | `src/lib/security/*`                        |
| Server Action gate, rate limit, identity, readiness | `src/server/security/*`                     |
| Enquiry repository                                  | `src/server/repositories/enquiries.ts`      |
| Unit tests                                          | `scripts/test-request-safeguards.ts`        |

## Implemented vs future

| Implemented now                              | Future                                            |
| -------------------------------------------- | ------------------------------------------------- |
| Origin allowlist + Fetch Metadata supplement | Live Server Action wiring (Step 47 after A01–A12) |
| 32 KiB budget helpers                        | Turnstile / CAPTCHA                               |
| MongoDB rate-limit consumer (fail closed)    | Dedicated Redis store if traffic requires         |
| Safe error/log mapping                       | Production monitoring sinks                       |
| Readiness evaluator                          | Public/debug readiness route (never)              |
| Auth gate stubs (always deny)                | Real Better Auth permissions                      |

## Checks

| Check | Result |
| ----- | ------ |
| `npm run format` | Passed |
| `npm run check` (incl. `test:request-safeguards`) | Passed |
| `npm run build` | Passed (Next.js 16.3.5) |
| Production smoke (`next start` :3046) | `/` `/contact` `/work` 200; `/dev/ui` 404 |
| Live Atlas privilege probes / cross-process limiter | **Not run** — awaiting disposable DB |

## Admin handoff

Schemas and safeguards exist; **admin panel is not complete**. Next: **A01** (admin foundations) through **A12**, then return to Step 47 for durable enquiry submission.
