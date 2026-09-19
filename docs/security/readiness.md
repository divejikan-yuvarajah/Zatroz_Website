# Enquiry readiness check (Step 46)

**Purpose:** Bounded server-side prerequisite check before enabling enquiry writes.  
**Public exposure:** Do **not** mount an unauthenticated route that returns internal readiness details.

---

## Checked items

| ID                            | Requirement                                |
| ----------------------------- | ------------------------------------------ |
| `env-mongodb`                 | `MONGODB_URI` + `MONGODB_DB_NAME` valid    |
| `env-abuse-secret`            | `ABUSE_HASH_SECRET` present                |
| `env-origin`                  | `APP_ORIGIN` or `SITE_URL` present         |
| `enquiries-enabled-flag`      | `ENQUIRIES_ENABLED=true`                   |
| `migration-ledger`            | Step 45 migration marked `applied`         |
| `index-enquiries-idempotency` | `uniq_enquiries_idempotency_digest` exists |
| `index-rate-limit-ttl`        | `ttl_rate_limit_buckets_expiresAt` exists  |

Implementation: `evaluateEnquiryReadiness` in `src/server/security/readiness.ts`.

When any item fails, submission stays disabled / returns `unavailable`. Marketing pages and mailto/WhatsApp remain usable.

`ENQUIRIES_ENABLED` alone is **not** proof of readiness — all items must pass.

---

## Operator procedure

1. Apply schema (`npm run db:apply -- --target development`) on a non-production DB.
2. Set runtime secrets in the host secret store / ignored `.env.local`.
3. Call readiness from a private operator script or future protected admin tool.
4. Only then consider enabling the live Server Action path (after A01–A12 + Step 47 gates).
