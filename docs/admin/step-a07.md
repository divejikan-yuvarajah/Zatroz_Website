# Admin step A07 — Authenticated project/case-study preview

**Branch:** `feature/a07-admin-preview` (from `feature/a06-admin-case-study`)  
**Status:** Authenticated draft preview **Implemented**. Live Mongo + Cloudinary preview with real credentials **Not run** until operators supply secrets.

## Goal

Staff with MFA can preview a project draft using the **same** public Work card and case-study page components, without publishing and without exposing drafts to anonymous visitors.

## Delivered

| Artifact                          | Path / note                                     |
| --------------------------------- | ----------------------------------------------- |
| Pure draft → public DTO mappers   | `src/lib/admin/preview.ts`                      |
| Server preview loader             | `src/server/projects/preview.ts`                |
| Preview route                     | `/admin/projects/[id]/preview`                  |
| Media via auth preview API        | `/api/admin/media/[mediaId]/preview` (existing) |
| Image `unoptimized` for admin src | Case study hero/gallery + project card          |
| Unit tests                        | `npm run test:admin-preview`                    |

## Behaviour

- Requires staff session + MFA + `admin.content.read` (write not required to view)
- Renders `ProjectCard` + `CaseStudyPage` from draft summary/story snapshots
- Private media uses same-origin authenticated preview paths so the **browser** loads images with cookies (Next image optimizer is not used for these srcs)
- Draft testimonials are included in preview; `reviewNotes` are never projected
- Story link on the card stays disabled (public `/work/[slug]` may still 404 until A08)
- `robots: noindex`; route is `force-dynamic`
- Missing media is reported honestly; empty story body shows card-only preview

## Explicitly not done (later steps)

- Publish / unpublish / archive / slug redirects (A08)
- Public featured selection (A08–A09)
- Switching public selectors to Mongo (A09–A10)

## Operator setup

1. Create/edit a draft (A05–A06) and attach library media (A04) if images are needed.
2. Open **Preview draft** from the project list, summary edit, or case-study editor.
3. Confirm card + case-study layout; confirm signed media loads while signed in; confirm signed-out access redirects to login.

## Checks

Recorded in `docs/progress.md` when the step is closed.
