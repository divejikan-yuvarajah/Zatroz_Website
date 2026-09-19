# Cloudinary setup (admin media)

**Step:** A04  
**Rule:** Never paste API secrets into chat, tickets, or commits.

## Required capabilities

| Capability                        | Why                                                       |
| --------------------------------- | --------------------------------------------------------- |
| Authenticated (or private) assets | Draft/unpublished media must not be anonymously reachable |
| Signed delivery URLs              | `/api/admin/media/.../preview` issues short-lived links   |
| Server-side signed upload         | API secret never reaches the browser                      |

Folder / prefix names (`CLOUDINARY_FOLDER_PREFIX`) are **organisational hints only**. They are not an ACL.

## Environment

See `.env.example`:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_FOLDER_PREFIX` (optional; default `zatroz`, with `APP_ENV` appended)

## Local verification

1. Copy blanks into `.env.local` and fill privately.
2. Restart `npm run dev`.
3. Sign in at `/admin/login` with MFA complete.
4. Upload a small allowed image on `/admin/media`.
5. Use **Open signed preview** — expect a temporary Cloudinary URL, not a permanent public CDN path for private assets.

Live upload/preview with real credentials remains **operator-owned**; agents must not claim it passed without that evidence.

## Rotation

1. Rotate the Cloudinary API secret in the Cloudinary console / password manager.
2. Update host secrets and restart.
3. Existing authenticated public_ids remain; new signatures use the new secret.
