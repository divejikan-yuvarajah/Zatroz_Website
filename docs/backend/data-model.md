# Backend data model (Step 45)

**Status:** Schema definitions and migration tooling implemented. Live `db:apply` / Atlas insert proofs **Not run** until maintenance credentials exist.  
**Public portfolio adapter:** MongoDB published revisions via `src/server/public-projects.ts` (A09). Repository `projectRecords` / `mediaRecords` are retired as a parallel live source after A10 tooling (empty catalogs; import via `migrate:repo-portfolio` only when approved rows exist).

Application validation (TypeScript) and MongoDB `$jsonSchema` share limits and enums but are **not interchangeable**: BSON dates must be real `Date` values; integers should be BSON int/long where validators require `int`/`long`; string length rules may differ slightly at edges. Prefer validating in application code before insert, then rely on collection validators as a safety net.

---

## Collections overview

| Collection               | Purpose                                         | Public?                                                          |
| ------------------------ | ----------------------------------------------- | ---------------------------------------------------------------- |
| `enquiries`              | Normalized visitor enquiries + server metadata  | **No** — owner permission separate; editors have none by default |
| `projects`               | Stable editorial identity + draft/live pointers | Published projection only via selectors (later)                  |
| `project_revisions`      | Immutable summary/story snapshots               | Published revision bodies only                                   |
| `media_assets`           | Versioned media metadata (no binaries/secrets)  | Public derivatives only when visibility=public and approved      |
| `site_content_settings`  | Allowlisted settings (featured project order)   | Featured IDs → public cards only if eligible                     |
| `admin_audit_events`     | Minimal actor/action/target/outcome             | **No**                                                           |
| `content_jobs`           | Bounded recovery jobs (no worker in Step 45)    | **No**                                                           |
| `rate_limit_buckets`     | Step 46 abuse counters                          | **No**                                                           |
| `_schema_migrations`     | Migration ledger                                | Maintenance only                                                 |
| `_schema_migration_lock` | Single-flight apply lock                        | Maintenance only                                                 |

Better Auth (or similar) user/session collections are **library-owned** — do not apply these validators to them.

---

## Common fields

| Field                     | Rule                                                                                                           |
| ------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `schemaVersion`           | Integer `1` for Step 45 documents                                                                              |
| `createdAt` / `updatedAt` | Server-generated UTC `Date` instants                                                                           |
| `_id`                     | MongoDB ObjectId (internal). Public/editorial IDs remain strings (`editorialId`, `mediaId`, `publicReference`) |
| References                | Soft references (string IDs). **Not** foreign keys — application code must enforce integrity                   |

---

## `enquiries`

**Visitor fields (allowlisted from Step 43):** `name`, `email`, `company`, `service`, `message`, `timeline`, `requestType`, `preferredContact`, `phone`.

**Server-owned metadata:** `schemaVersion`, `createdAt`, `updatedAt`, `status` (`new` → `reviewed` → `archived`), `publicReference`, `idempotencyDigest`, `fingerprintVersion`, `keyVersion`, `payloadFingerprint`, optional `notificationIntent` (Step 51 — durable team notification work; absent on legacy pre-51 rows).

**Must not store:** raw headers, full IP, full user agent, cookies, arbitrary JSON, unvalidated payloads, attachments.

| Index                                 | Type             | Why                              |
| ------------------------------------- | ---------------- | -------------------------------- |
| `uniq_enquiries_idempotency_digest`   | unique ordinary  | Idempotent accept on same digest |
| `uniq_enquiries_public_reference`     | unique           | Opaque confirmation lookup       |
| `idx_enquiries_status_createdAt`      | compound         | Owner workflow listing           |
| `idx_enquiries_notification_dispatch` | partial compound | Step 51 notification claim queue |

Email is **not** unique. Acceptance/idempotency fields live on the **same** inserted document. `notificationIntent` is created with new accepts; historical documents without it are never auto-selected for send.

**Public projection:** `{ reference }` only (see `toPublicEnquiryAcceptance`). Never expose digests, status, or `_id`.

---

## `projects`

| Field                                                     | Notes                                                               |
| --------------------------------------------------------- | ------------------------------------------------------------------- |
| `editorialId`                                             | Stable string identity (e.g. `proj-flowpilot-ai`)                   |
| `draftSlug` / `draftTitle`                                | Desired draft — **must not** replace live slug/title before publish |
| `canonicalPublishedSlug`                                  | Live slug; null until summary published                             |
| `draftRevisionId`                                         | Editable draft pointer                                              |
| `publishedSummaryRevisionId` / `publishedStoryRevisionId` | Independent publish pointers                                        |
| `workStatus`                                              | Same taxonomy as content types                                      |
| `concurrencyVersion`                                      | Optimistic concurrency                                              |

**Published projection:** Resolve summary/story from published revision pointers only. Never mix draft slug/title with live revision bodies on a public page.

| Index                                  | Type           | Why                                       |
| -------------------------------------- | -------------- | ----------------------------------------- |
| `uniq_projects_editorialId`            | unique         | Stable identity                           |
| `uniq_projects_canonicalPublishedSlug` | partial unique | Unique live slugs; null drafts may repeat |

### Slug / redirect reservation (A08)

Uniqueness of `canonicalPublishedSlug` alone does **not** prevent an old URL from being reused incorrectly after a rename. A later `project_routes` registry (redirect + reservation policy) is reserved; do **not** implement a second conflicting slug store in Step 45.

---

## `project_revisions`

Immutable `revisionId` + unique `(projectId, revisionNumber)`.

| `kind`              | Contents                                  |
| ------------------- | ----------------------------------------- |
| `summary`           | `summary` snapshot required; `story` null |
| `story`             | `story` snapshot required; `summary` null |
| `summary_and_story` | both present                              |

Story blocks remain **paragraph** and **list** only (Step 38). No HTML/MDX/scripts.

`reviewNotes` may exist on story snapshots — **never** public.

Application must verify `mediaRefs` / gallery `mediaId` values exist and are eligible; the database does not enforce foreign keys.

---

## `media_assets`

Stable `mediaId` + immutable `versionId` (replacement = new version). Store provider IDs, dimensions, mime, size, alt/decorative, caption, provenance/licence/generation brief, `processingState`, `visibility`.

**Must not store:** provider secrets, short-lived signed URLs, base64 bodies. Folder/`storageHint` is **not** access control.

| Index                                    | Why                |
| ---------------------------------------- | ------------------ |
| `uniq_media_assets_media_version`        | Version uniqueness |
| `idx_media_assets_visibility_processing` | Admin queues       |

---

## `site_content_settings`

Only allowlisted keys (currently `featured_projects` → ordered `featuredProjectIds`). No arbitrary key-value editor.

---

## `admin_audit_events`

`actorId`, `action`, `targetType`, `targetId`, `outcome`, `createdAt`. No full private payloads or secrets.

---

## `content_jobs`

`jobId`, unique `dedupeKey`, `state`, `attempts`, `nextRunAt`, lease fields. Worker **not** implemented in Step 45.

---

## `rate_limit_buckets` (Step 46 foundation)

Deterministic unique `bucketId` (policy/version + keyed identifier + window). Integer `count`, `windowStart`/`windowEnd`, `expiresAt`.

TTL index on `expiresAt` cleans up asynchronously. **Enforcement must use window times in queries/calculation** — delayed TTL must not govern a new window or reset a current limit early.

**Do not** add TTL deletion to enquiries, revisions, audits, or live media.

---

## Retention (pending decisions)

| Data                               | Owner           | Policy                                                                                                                                                                         |
| ---------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Enquiries                          | Owner / privacy | **Pending** — approve retention/cleanup before live collection. Idempotent retries must remain supported for a documented window. Do not invent a legal retention period here. |
| Audit events                       | Owner           | Retain for operational review; no TTL                                                                                                                                          |
| Project revisions / media versions | Editorial       | Append-oriented; delete only via explicit reviewed process                                                                                                                     |
| Rate-limit buckets                 | System          | TTL + application window checks                                                                                                                                                |
| Content jobs                       | System          | Bound attempts; succeeded/cancelled cleanup later                                                                                                                              |

---

## Integrity checklist (application-enforced)

1. Published pointers reference existing revision IDs of the same `projectId`.
2. Featured IDs exist and are publicly eligible when rendered.
3. Gallery/cover media IDs resolve to public-ready versions.
4. Draft slug never written over `canonicalPublishedSlug` without A08 publish + redirect rules.
5. Visitor payloads cannot set server-owned enquiry fields.

Code: `src/lib/mongodb/models/validate.ts`, schemas in `src/lib/mongodb/schema/definitions.ts`.
