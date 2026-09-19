# Security recovery runbook (Step 46)

**Rule:** Never paste secrets, connection strings, or personal enquiry payloads into chat, tickets, or commits.

---

## Credential rotation / revocation

1. Create a new Atlas database user (or rotate password) in the password manager.
2. Update hosting secrets (`MONGODB_URI` / maintenance URI as appropriate).
3. Redeploy / restart so processes pick up the new value.
4. Disable or delete the old Atlas user after verifying connectivity (`npm run db:check` privately).
5. If a URI was exposed: rotate immediately; treat `.gitignore` fixes as insufficient alone.

---

## Secret exposure (ABUSE / idempotency HMAC)

| Secret                                                  | Effect of rotation                                                                                            |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `ABUSE_HASH_SECRET` (+ optional `ABUSE_HASH_SECRET_V2`) | New identity hashes → rate-limit buckets effectively reset for prior identities                               |
| `ENQUIRY_IDEMPOTENCY_SECRET` (+ optional `_V2`)         | New payload fingerprints use the current key version; retained verification keys must cover in-flight retries |

Store secrets in the approved env/secret manager — **not** in MongoDB documents or source.

Replay rule (Step 47): select the stored record’s fingerprint version; if its verification key is unavailable, fail safely without creating another record. Idempotency **digest** (SHA-256 of the client key) stays stable across fingerprint secret rotation.

---

## Temporary network access

1. Prefer short-lived Atlas IP allowlist entries for operator IPs.
2. Remove temporary entries after maintenance.
3. Do not leave `0.0.0.0/0` open.

---

## Database / limiter outage

1. Enquiry path returns `unavailable` (fail closed).
2. Contact page continues to show email / WhatsApp.
3. Do not fail open into unrestricted writes.
4. After recovery, re-run readiness; drain any operator notes (no PII in logs).

---

## Backups / restores

| Claim                       | Status                                                                                                                           |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| “Atlas means backups exist” | **Do not claim** — verify the selected cluster tier’s backup capability in Atlas UI                                              |
| Restore test                | Restore synthetic data into a **separate** authorized target when supported, or record **Not run** with the exact remaining test |

Never restore over production to “test”. Never copy production enquiries into development casually.

---

## Admin auth gap

Until A02–A03, `requireAdmin` / `requirePermission` always deny. No cookie/header role trust. Private admin and enquiry inbox endpoints must remain absent.
