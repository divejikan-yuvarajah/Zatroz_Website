# Admin migration inventory (projects / stories / media)

**Purpose:** Preserve stable identities for A10 MongoDB migration and ongoing admin IDs.  
**This file is documentation only** — not a live data store. Do not import drafts as published.

**Adapter today (A09+):** `src/server/public-projects.ts` → Mongo published revisions.  
**A10 tooling:** `npm run migrate:repo-portfolio` (dry-run default; `--apply` with `--target`).  
**Public / repo counts (2026-09-20):** 0 published summaries, 0 published stories, 0 featured IDs, 0 media records in both repository catalogs and (until operators apply) Mongo.

---

## Identity map (proposed)

| Project ID          | Slug           | Summary state | Story state | Attribution (proposed)       | Service refs (proposed)    | Media IDs (proposed)             | Featured order | Notes                                     |
| ------------------- | -------------- | ------------- | ----------- | ---------------------------- | -------------------------- | -------------------------------- | -------------- | ----------------------------------------- |
| `proj-flowpilot-ai` | `flowpilot-ai` | not created   | not created | TBD (Team ZeroDB unverified) | TBD — likely AI/automation | `media-fp-overview-v1` (missing) | —              | Blocked on evidence                       |
| `proj-invoicex-ai`  | `invoicex-ai`  | not created   | not created | TBD                          | TBD                        | `media-ix-overview-v1` (missing) | —              | Blocked on evidence                       |
| `proj-launch-third` | TBD            | not created   | not created | TBD                          | TBD                        | TBD                              | —              | Placeholder until a real project is named |

When records are first created in **admin** (or added to `projectRecords` only for a deliberate A10 import), **reuse these IDs/slugs** unless a redirect decision is documented.

---

## Publication rules for A10

1. Importing a draft must **never** auto-publish.
2. Only explicitly approved revisions and approved public media derivatives become published.
3. Summary and story publication remain independent.
4. Featured order is editorial (`featuredProjectIds` in Mongo settings), not “newest first.”
5. General service/homepage copy stays repository-managed.
6. Reruns are **idempotent** (skip existing `editorialId` / `mediaId`).
7. After a verified apply, do **not** maintain a parallel live portfolio in `projectRecords` / `mediaRecords`.

---

## Media provenance template (per asset)

| Field              | Example                         |
| ------------------ | ------------------------------- |
| Media ID           | `media-fp-overview-v1`          |
| Project ID         | `proj-flowpilot-ai`             |
| Versioned filename | `flowpilot-ai-overview-v1.webp` |
| Public path        | `public/images/projects/...`    |
| Provenance         | Exported from … / captured on … |
| Rights             | Owner permission recorded on …  |
| Screenshot state   | Overview / empty / error / …    |
| Redaction          | Confirm PII removed in pixels   |
| Dimensions         | width × height                  |
| Alt + caption      | Task/decision explained         |
| Approval           | draft / approved                |

No public project media was created in Step 39. A10 imports approved repo media as `provider: repository` with `storageHint` = public path when present.

---

## Featured selection

Repository `featuredProjectIds`: `[]`.  
Live featured order: Mongo `site_content_settings` (`featured_projects`) via `/admin/settings/featured`.  
Do not auto-feature a project when it is first added. Propose featured order after at least one summary is published.
