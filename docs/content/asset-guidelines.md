# Asset guidelines

Rules for naming, exporting, describing, and storing Zatroz website assets.

---

## Filenames

- Use **lowercase** descriptive names with **hyphens**: `founder-divejikan.jpg`, `flowpilot-ai-overview.png`.
- Include intended use when helpful: `zatroz-logo.svg`, `og-default.png`.
- Avoid spaces, personal ID numbers, and client-internal codenames in public filenames.

---

## Where files live

| Location | Allowed content |
| --- | --- |
| Outside Git / private owner storage | Raw camera files, unapproved screenshots, private customer data, signed permission docs |
| Repository private docs (if ever used) | Registers and notes — not secrets |
| `public/` | **Approved** assets only |

Anything in `public/` may later be reachable by direct URL. Do not put unapproved or private material there.

---

## Formats

| Asset type | Preferred export |
| --- | --- |
| Logos / icons | SVG when possible; otherwise PNG with transparency |
| Photographs / screenshots | JPEG or WebP for photos; PNG/WebP for UI screenshots |
| Social share image | PNG or JPEG ≈ 1200×630 |
| Fonts (later) | Self-hosted WOFF2 with retained licence files |

Record **actual pixel dimensions** from real files when they are supplied (width × height). Do not invent dimensions.

---

## Accessibility descriptions

- Meaningful images need useful **alt text** (what the image shows for understanding the page).
- Decorative images use empty alt when adjacent text already conveys the meaning.
- Screenshots should describe the UI purpose, not “image1”.
- Never rely on colour alone to carry meaning in graphics.

---

## Privacy in screenshots

**Do not** embed private customer information in published screenshots:

- personal names/emails/phones from real customers
- credentials, API keys, internal URLs
- unpaid invoices with real payer details
- private addresses or ID documents

Replace with clearly labelled sample data when a UI demo needs content.

---

## Publication permission

Before moving an asset to `public/`:

1. Confirm ownership or client/founder permission.
2. Update the asset register permission column to Approved.
3. Keep the approval record with the owner (outside public Git if sensitive).

---

## Related documents

- `docs/content/asset-register.md` — inventory and status
- `docs/content/brand-and-contact.md` — colours and contacts
- `docs/content/project-story-template.md` — screenshot expectations per story
