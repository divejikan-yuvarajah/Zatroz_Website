# Admin step A04 — Media provider, safe uploads, private previews, records

**Branch:** `feature/a04-admin-media` (from `feature/a03-admin-shell`)  
**Status:** Media library foundation **Implemented**. Live Cloudinary upload/preview with real credentials **Not run** until operators supply secrets.

## Goal

Cloudinary-backed private media uploads with MongoDB `media_assets` records, format/size/pixel checks, signed private previews, replace-as-new-version, and archive — without treating folder names as access control.

## Delivered

| Artifact                          | Path / note                                               |
| --------------------------------- | --------------------------------------------------------- |
| `cloudinary@2.10.0`               | Official Node SDK                                         |
| Policy + magic-byte checks        | `src/lib/media/policy.ts` (JPEG/PNG/WebP, 10 MiB, pixels) |
| Cloudinary config                 | `src/lib/media/config.ts` + env placeholders              |
| Upload / replace / archive / meta | `src/server/media/actions.ts` (permission-gated)          |
| Mongo media repository            | `src/server/media/repository.ts`                          |
| Admin library UI                  | `/admin/media`                                            |
| Signed private preview            | `GET /api/admin/media/[mediaId]/preview` (auth + MFA)     |
| Unit tests                        | `npm run test:admin-media`                                |

## Behaviour

- New uploads default to **private** `visibility` and Cloudinary `type: authenticated`
- Preview requires staff session + MFA; responds with a short-lived signed redirect
- Replace creates a new `versionId`, archives the previous head; does not overwrite in place
- SVG/HTML/script uploads rejected by magic-byte detection
- Without Cloudinary/Mongo secrets: marketing build still succeeds; uploads fail closed with a clear message

## Explicitly not done (later steps)

- Attaching media to project drafts / gallery reorder (A05–A06)
- Making assets public on publish (A08)
- Permanent Cloudinary deletion / usage dependency checks (A11)
- Live provider proof with production credentials (**Not run**)

## Operator setup

1. Create a Cloudinary product environment capable of **authenticated** assets and signed delivery.
2. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` in `.env.local` / host secrets.
3. Ensure `media_assets` indexes exist (`npm run db:apply` when migration credentials are available).
4. Sign in as staff with MFA, open `/admin/media`, upload a small JPEG/PNG/WebP, open signed preview.

## Checks

Recorded in `docs/progress.md` when the step is closed.
