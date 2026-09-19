# Enquiry request policy (Step 46)

**Transport decision (Step 43):** Next.js **Server Action** — not a parallel Route Handler.  
**Live endpoint:** None in Step 46. Helpers prepare the Server Action boundary for Step 47 / post-admin work.  
**Public form:** `formSubmissionReady` remains `false`.

---

## Why Server Action (not POST /api/enquiries)

The Step 43 contract selected a Server Action. Step 46 maps equivalent protections to that framework boundary instead of introducing a second JSON API. A future JSON route would reuse the same pure helpers (`origins`, `request-body`, `errors`) but is **not** implemented here.

Native HTML form POST and third-party clients remain out of scope for this JSON/Action path. No-JS visitors keep mailto / WhatsApp.

---

## Policy order (pre-persistence)

1. Origin allowlist (`APP_ORIGIN` / `SITE_URL` — never `Host` / `X-Forwarded-Host`)
2. Fetch Metadata supplement when headers exist (not authentication)
3. Payload byte budget (32 KiB)
4. Reject server-owned fields on raw objects
5. Allowlisted field extraction + independent validation
6. Trusted identity → HMAC → rate limits (fail closed on store errors)
7. Readiness gate (`ENQUIRIES_ENABLED`, schema/indexes, Turnstile env) — Step 47+ wires writes
8. Turnstile Siteverify (Step 49) — after cheap gates + rate limits; before insert

Origin checks do **not** stop a non-browser bot that forges headers; abuse controls remain required. Do not add customer login solely to prevent spam.

---

## Origins

| Rule           | Detail                                                                     |
| -------------- | -------------------------------------------------------------------------- |
| Source         | Trusted deployment config only                                             |
| Reject         | Missing, `null`, foreign origins                                           |
| Non-production | Explicit localhost / configured test origins allowed                       |
| Production     | Exact `APP_ORIGIN` (or verified `SITE_URL`) only                           |
| Forbidden      | Whitelisting all preview subdomains; reflecting arbitrary Origin into CORS |

---

## Body / payload budget

- Budget: **32 KiB** (`ENQUIRY_REQUEST_BODY_BUDGET_BYTES`)
- Content-Length used for early rejection when present; streamed bytes must still be bounded independently for any HTTP path
- Server Action path: estimate serialized payload size with the same budget
- Accept JSON object roots only on HTTP designs; reject arrays / invalid JSON / non-UTF-8

`Cache-Control: no-store` for any enquiry JSON response. Never cache personal content at a shared CDN.

---

## Rate limiting

| Policy               | Default          | Notes                       |
| -------------------- | ---------------- | --------------------------- |
| `enquiry-per-source` | 10 / 10 minutes  | Per HMAC’d trusted identity |
| `enquiry-global`     | 120 / 10 minutes | Circuit breaker             |

Initial operational settings — not universal guarantees. All processed submissions (invalid, idempotent retries, challenge failures that reach the action) must consume the relevant policy when the live path is enabled.

- Trusted identity from platform-verified headers only (e.g. Vercel `x-vercel-forwarded-for` / `x-real-ip`); never leftmost arbitrary `X-Forwarded-For` in production
- Tests inject identity in code — never an HTTP bypass parameter
- Raw IPs are not stored in counters; HMAC with `ABUSE_HASH_SECRET`
- Missing identity → conservative global fallback / fail closed — never silently remove limits
- Fixed windows can burst across boundaries; TTL is cleanup, not the quota clock
- Limiter store failure → `unavailable` (fail closed)
- **Step 49:** Cloudflare Turnstile supplements this policy; it does **not** replace or double-count buckets

---

## Turnstile (Step 49)

| Rule        | Detail                                                              |
| ----------- | ------------------------------------------------------------------- |
| Order       | After rate limits, before enquiry insert                            |
| Verify      | Server Siteverify only — widget success is not acceptance           |
| Action      | `enquiry-submit`                                                    |
| Hostname    | Must match `APP_ORIGIN` / `SITE_URL` hostname                       |
| Production  | Cloudflare documented test keys refused                             |
| Tokens      | Transport-only; never stored; excluded from business fingerprint    |
| Retry       | Fresh token per Siteverify; enquiry attempt key retained separately |
| Fail closed | Missing/invalid/expired/provider errors → no insert                 |

See `docs/setup/turnstile.md`.

---

## Errors and logs

Customer results use fixed messages (`CUSTOMER_SAFE_MESSAGES`), including `challengeFailed` / `challengeRequired`. Logs may include allowlisted `category`, `operation`, `correlationId`, `elapsedMs` only — never emails, messages, idempotency keys, Turnstile tokens, URIs, or driver payloads.

---

## Code map

| Concern                   | Module                                                                                                   |
| ------------------------- | -------------------------------------------------------------------------------------------------------- |
| Origins / Fetch Metadata  | `src/lib/security/origins.ts`                                                                            |
| Body budget / JSON parse  | `src/lib/security/request-body.ts`                                                                       |
| Safe errors / correlation | `src/lib/security/errors.ts`                                                                             |
| Server Action gate        | `src/server/security/enquiry-policy.ts`                                                                  |
| Rate limit                | `src/server/security/rate-limit.ts`                                                                      |
| Trusted identity          | `src/server/security/trusted-identity.ts`                                                                |
| Turnstile pure helpers    | `src/lib/security/turnstile.ts`                                                                          |
| Turnstile Siteverify      | `src/lib/security/turnstile-siteverify.ts` (server re-export: `src/server/security/turnstile-verify.ts`) |
