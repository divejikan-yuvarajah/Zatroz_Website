# Admin content plan (portfolio)

**Status:** Requirements finalized in **A01**. Auth, UI, uploads, and Mongo public switch are **not** implemented yet.  
**Canonical plan addendum:** `docs/planning/admin-and-media-addendum.md`  
**Data foundations:** `docs/backend/data-model.md` (Step 45 collections)

---

## 1. Public selector interface (stable across A09–A10)

Components consume typed public DTOs only. They must not import `projectRecords` or other raw catalog arrays in page UI.

| Operation                          | Module                                                       | Notes                                 |
| ---------------------------------- | ------------------------------------------------------------ | ------------------------------------- |
| `listPublishedProjects`            | `src/server/public-projects.ts`                              | Filters, page size 9, hard max 24     |
| `getPublishedProjectSummaryBySlug` | same                                                         | Summary card / metadata               |
| `getPublishedCaseStudyBySlug`      | same                                                         | Full story DTO or null                |
| `listPublishedFeaturedProjects`    | same                                                         | Homepage featured order               |
| `listPublishedRelatedProjects`     | same                                                         | Related-work blocks                   |
| Pure helpers / tests               | `src/lib/public-projects.ts`, `src/lib/public-case-study.ts` | Eligibility, query parse, DTO mapping |

`PublicProjectCard` / `PublicCaseStudy` shapes stay the contract when the adapter switches from repository → MongoDB published revisions.

**Current adapter:** `src/server/public-projects.ts` → `contentCatalog` / repository records.  
**Target adapter (A09):** same function names; queries published pointers + revisions only. On DB failure: unavailable/recovery — **no** draft-repo fallback.

### Imports to consolidate before/at A09 (impact list)

| Area                         | Today                                                                   | Target                                                      |
| ---------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------- |
| Work / case-study routes     | `@/server/public-projects`                                              | Keep                                                        |
| Home featured                | `@/server/public-projects` (+ some `ProjectRecord` typing in `home.ts`) | Prefer public DTOs only                                     |
| Service detail related       | `@/server/public-projects`                                              | Keep                                                        |
| Dev specimens                | May use `ProjectRecord` fixtures                                        | Gallery-only; never public                                  |
| `content-validate` / catalog | Repository arrays                                                       | Remain for repo validation until A10 retires parallel edits |

Do **not** rewrite working UI in A01.

---

## 2. Content model (aligned with Step 45)

| Collection               | Role                                                                                                                               |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `projects`               | `editorialId`, draft vs published pointers, `draftSlug`/`draftTitle`, `canonicalPublishedSlug`, `workStatus`, `concurrencyVersion` |
| `project_revisions`      | Immutable `revisionId` + `(projectId, revisionNumber)`; summary and/or story snapshots; `mediaRefs`                                |
| `media_assets`           | `mediaId` + immutable `versionId`; provider IDs; dimensions; alt; provenance; processing; visibility                               |
| `site_content_settings`  | Allowlisted keys only (`featured_projects`)                                                                                        |
| `admin_audit_events`     | Actor/action/target/time/outcome — no private payloads                                                                             |
| `content_jobs`           | Bounded publish/media/cache recovery jobs (worker later)                                                                           |
| Auth library collections | Better Auth–owned — do not apply Zatroz content validators                                                                         |
| `enquiries`              | Separate; editors have no access by default                                                                                        |

**Publication independence:** summary publish ≠ story publish. Draft slug/title must not replace live slug until publish + redirect rules (A08).

**Story blocks:** `paragraph` | `list` only. No arbitrary HTML/scripts/MDX.

**Integrity (application-enforced):** media refs exist and are eligible; featured IDs are public-ready; pointers reference revisions of the same project.

Optional later: `project_routes` registry for redirects — reserved; do not dual-store slugs in A01–A08 beyond `canonicalPublishedSlug` + documented redirect records in A08.

---

## 3. Roles and publishing rules

See matrix in `docs/planning/admin-and-media-addendum.md`.

### State transitions (content)

| From                      | To                             | Who                                     |
| ------------------------- | ------------------------------ | --------------------------------------- |
| (new)                     | draft revision                 | Owner, Editor                           |
| draft                     | authenticated preview          | Owner, Editor                           |
| draft                     | published summary and/or story | **Owner only**                          |
| published                 | unpublished / archived         | **Owner only**                          |
| archived / older revision | restore as **new** draft       | Owner (Editor if granted archive scope) |

Editing a live project writes draft pointers only until publish. Concurrent editors: conflict when `concurrencyVersion` mismatches — no silent overwrite.

### Featured order

Owner sets ordered `featuredProjectIds`. Homepage selected-work shows only eligible published summaries. Empty list → honest empty public UI.

---

## 4. Admin route map (planned — not created in A01)

| Route                          | Purpose                      | From step |
| ------------------------------ | ---------------------------- | --------- |
| `/admin/login`                 | Sign-in + MFA challenge      | A02–A03   |
| `/admin`                       | Dashboard counts + shortcuts | **A03**   |
| `/admin/projects`              | List / search / filter       | **A05**   |
| `/admin/projects/new`          | Create draft                 | **A05**   |
| `/admin/projects/[id]`         | Edit draft summary           | **A05**   |
| `/admin/projects/[id]/story`   | Case-study editor            | **A06**   |
| `/admin/projects/[id]/preview` | Authenticated preview        | **A07**   |
| `/admin/media`                 | Media library                | **A04**   |
| `/admin/settings/featured`     | Featured order               | A08–A09   |
| `/admin/staff`                 | Role management (owner)      | **A03**   |

All `/admin/**` (except login) require verified session + completed MFA + permission checks on **server** for every data operation — not button hiding alone.

---

## 5. Auth and media tool recommendations

| Tool                                              | Role                         | A01 status                                                                                       |
| ------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------ |
| Better Auth + Mongo adapter + official 2FA plugin | Staff auth                   | **A02–A03** — login/MFA + protected shell/dashboard/staff roles                                  |
| Cloudinary                                        | Binary storage + derivatives | **A04 implemented** (2.10.0) — authenticated upload + signed private preview; live proof Not run |
| Resend                                            | Enquiry / recovery email     | Already planned; not content-admin                                                               |

Unresolved until setup: Atlas backup tier capability, Cloudinary plan ACLs, production `APP_ORIGIN`, named owner bootstrap identity (no invented founder accounts). Live MFA proof **Not run** until operators supply secrets.

---

## 6. Publish consistency and cache

1. Validate content + permissions + media readiness + slug uniqueness.
2. Prepare public media derivatives before flipping published pointers.
3. DB pointer change ≠ CDN/cache refresh — use `content_jobs` + explicit “published, refresh pending” when needed (A11).
4. New slugs must resolve without rebuild (revisit SSG-only assumptions).
5. Refresh Work list, featured home, related blocks, metadata/sitemap as applicable.

---

## 7. Impact list

| Area                    | Impact                                                                                  |
| ----------------------- | --------------------------------------------------------------------------------------- |
| Steps 37–39             | Public selectors preserved; empty catalog honest; migration inventory IDs reused in A10 |
| Steps 44–46             | Collections/indexes/safeguards reused; no Step 47 until A12                             |
| A01–A12                 | New critical path before live enquiry writes                                            |
| Launch testing / deploy | Must include admin authZ, draft privacy, media ACL, backups, publish refresh            |
| Effort                  | Website-only estimate **invalid** for total launch scope                                |

---

## 8. Acceptance criteria (later implementation — A12 verifies)

Documented in the addendum §8: owner publish path, draft-without-live-mutation, editor restrictions, unauthenticated denial, private media ACL, recoverable failed jobs, concurrency conflicts, featured eligibility, delete dependency checks, recovery/handover.

---

## Related

- `docs/content/image-policy.md`
- `docs/work/admin-migration-inventory.md`
- `docs/admin/step-a01.md`
