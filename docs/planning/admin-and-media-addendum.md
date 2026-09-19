# Admin and media addendum (owner-authorized)

**Status:** Adopted for planning (A01) — not a claim that admin, auth, Cloudinary, or Better Auth are implemented.  
**Source:** Owner addendum 18 September 2026; finalized in admin step **A01**.  
**Supersedes (scoped):** earlier “no custom admin at launch” and “all project content stays only in repository files” for **projects / case studies / project media / featured order** only.

General marketing copy (services, homepage sections, process, founders, FAQs, design tokens) remains **repository-managed** unless a later expansion is authorized.

---

## Architecture choices

| Area                  | Choice                                                   | Confirmation needed                                                   |
| --------------------- | -------------------------------------------------------- | --------------------------------------------------------------------- |
| Public site           | Existing Next.js App Router app                          | —                                                                     |
| Admin UI              | Protected `/admin` in the same app                       | —                                                                     |
| Application DB        | MongoDB Atlas + official driver (Steps 44–46)            | Live credentials / `db:apply` still operator-owned                    |
| First admin scope     | Projects, case studies, project images, featured order   | —                                                                     |
| Media files           | **Proposed:** Cloudinary                                 | Account plan, signed upload, private delivery must be verified in A04 |
| Auth                  | **Proposed:** Better Auth + MongoDB adapter + MFA plugin | Compatible versions verified in A02; no homemade sessions             |
| Public story URL      | `/work/[slug]` only                                      | —                                                                     |
| Enquiry notifications | Resend plan unchanged; separate from content admin       | —                                                                     |

Do not install Better Auth or Cloudinary SDKs in A01. Do not create accounts, invitations, or upload endpoints yet.

---

## First-release admin product

### Dashboard (A03)

Real counts only: drafts, published projects, items needing review, recent edits. Shortcuts to create project, edit, manage media. No invented traffic/sales charts.

### Projects (A05)

Title, slug, summary, services, work status, technologies, contributors, links, cover, gallery, featured eligibility/order. Explicit **Save draft**; optimistic concurrency via `concurrencyVersion`. Search, filters, pagination, validation, unsaved-change handling.

### Case studies (A06)

Structured sections on the same editorial identity as the project. Summary may publish before story. Controlled **paragraph** and **list** blocks only (Step 38/45). No arbitrary HTML/MDX/scripts.

### Media (A04)

Upload/preview/search/choose/reorder/replace/archive. Alt, caption, provenance, decorative vs evidential. Replace = new immutable version. Folder names are not access control.

### Publishing (A08)

Draft → authenticated preview (A07) → publish / unpublish / archive. Live page unchanged until a new revision is published. Featured order: owner only; public-ready IDs only.

---

## Roles (first release)

| Action                           | Owner                                    | Editor |
| -------------------------------- | ---------------------------------------- | ------ |
| Create/edit drafts + draft media | Yes                                      | Yes    |
| Authenticated preview            | Yes                                      | Yes    |
| Publish / unpublish / feature    | Yes                                      | **No** |
| Archive within scope             | Yes                                      | Yes    |
| Permanent delete unused          | Yes (after dependency checks)            | No     |
| Manage staff roles               | Yes                                      | No     |
| View private enquiries           | Separate permission; owner only if added | **No** |

No public registration, shared passwords, or client-editable roles. MFA required before content admin (A02). Editors never gain enquiry read by default.

---

## Roadmap placement

```
Steps 44–46 (MongoDB foundations) → A01–A12 (admin) → Step 47+ (enquiry write path)
```

| Step | Deliverable                                                                |
| ---- | -------------------------------------------------------------------------- |
| A01  | Final requirements, content model, roles, publishing rules (**this step**) |
| A02  | Auth, owner bootstrap, MFA, recovery, revocation                           |
| A03  | Admin shell, role enforcement, real dashboard counts                       |
| A04  | Media provider, safe uploads, private previews, media records              |
| A05  | Project list/forms                                                         |
| A06  | Case-study editor + gallery order                                          |
| A07  | Authenticated preview via public components                                |
| A08  | Publish/unpublish/archive, audit, slug redirects                           |
| A09  | Featured selection + MongoDB public selectors                              |
| A10  | One-time approved repository→Mongo migration                               |
| A11  | Cache refresh/retry, image usage, cleanup                                  |
| A12  | AuthZ/failure tests, backup/restore, handover                              |

---

## Launch checklist additions

Before public launch (in addition to existing marketing/enquiry gates):

1. Admin authorization on every protected read/mutation/upload-sign/preview/publish
2. Draft and private media not anonymously reachable
3. Media safety (type/size/pixel limits; no arbitrary URL fetch)
4. Backups/restore tested for the selected Atlas tier
5. Publish refresh: new slugs resolve without rebuild; featured/Work/sitemap updated
6. Owner operational path to review enquiries before live form activation (Step 47+)

The earlier website-only effort estimate **does not** include A01–A12.

---

## Related docs

- `docs/architecture/admin-content-plan.md` — selectors, routes, model, impact
- `docs/content/image-policy.md` — sourcing / generation rules
- `docs/backend/data-model.md` — MongoDB collections (Step 45)
- `docs/admin/step-a01.md` — A01 checkpoint
