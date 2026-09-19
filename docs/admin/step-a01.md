# Admin step A01 — Requirements, model, roles, publishing rules

**Branch:** `feature/a01-admin-requirements` (from `feature/46-db-request-safeguards`)  
**Status:** Planning alignment **Implemented**. No admin UI, auth libraries, media accounts, or endpoints created.

## Goal

Finalize the owner-authorized admin/media plan so A02+ can implement against written requirements without inventing scope.

## Delivered

| Artifact                      | Path                                        |
| ----------------------------- | ------------------------------------------- |
| Plan addendum (tracked)       | `docs/planning/admin-and-media-addendum.md` |
| Admin content plan (expanded) | `docs/architecture/admin-content-plan.md`   |
| Image policy                  | `docs/content/image-policy.md`              |
| Decision register updates     | `docs/planning/decision-register.md`        |
| Scope / progress / rules      | See progress notes                          |

## Explicitly not done (later steps)

- Better Auth / MFA / invitations (A02)
- `/admin` routes or dashboard (A03)
- Cloudinary or uploads (A04)
- Project/case-study editors (A05–A06)
- Previews, publish, featured Mongo switch, migration (A07–A10)
- Step 47 enquiry writes

## Decisions recorded

- First admin scope = projects, case studies, project media, featured order
- Marketing copy stays repository-managed
- `/work/[slug]` remains the only public story URL
- Better Auth + Cloudinary remain **proposed** pending setup verification
- Editors cannot publish or read enquiries by default

## Unresolved operator items

1. Confirm Better Auth package versions against Next.js 16.3.5 when A02 starts
2. Confirm Cloudinary signed upload + private delivery on the chosen plan (A04)
3. Named owner account identity for bootstrap (no invented credentials)
4. Atlas backup tier verification
5. Live `db:apply` / privilege probes still pending from Steps 45–46

## Next

**A02** — Authentication, owner bootstrap, MFA, recovery, and session revocation.
