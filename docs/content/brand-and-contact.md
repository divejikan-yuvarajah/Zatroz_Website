# Brand and contact record

**Purpose:** Preserve supplied brand/contact facts and flag them for launch confirmation.  
**Rule:** Do not guess missing LinkedIn URL, domain, street address, opening hours, or response-time promises.

Last updated: 2026-09-18 (Step 17 footer wiring)

---

## Brand colours (from shared decisions / plan)

| Token                   | Value     | Launch note                                                      |
| ----------------------- | --------- | ---------------------------------------------------------------- |
| Orange                  | `#FF3B10` | Primary accent; use **dark text** on primary buttons             |
| Orange link (plan note) | `#C42B0A` | Candidate for small orange text links — confirm in design system |
| Charcoal                | `#111111` | Dark sections / strong text                                      |
| Warm white              | `#F7F5F2` | Page background direction                                        |

Logo redrawing is out of scope here. Record supplied logo variants in the asset register when files arrive.

---

## Contact details (supplied — confirm before launch)

Code mirror: `src/config/brand.ts` (`siteContact`, `siteBrand`). Live pages only link channels marked **confirmed**.

| Channel                       | Supplied value        | Code status   | Launch confirmation                                               |
| ----------------------------- | --------------------- | ------------- | ----------------------------------------------------------------- |
| Phone / WhatsApp display      | `+94 76 809 8068`     | `unconfirmed` | Needs input                                                       |
| WhatsApp international digits | `94768098068`         | `unconfirmed` | Needs input — test phone + desktop; do not infer from phone alone |
| Email                         | `zatroz.co@gmail.com` | `unconfirmed` | Needs input — monitoring owner TBD                                |
| Instagram handle              | `zatroz.co`           | URL `null`    | Needs input — full profile URL **TODO**                           |
| LinkedIn display name         | `Zatroz`              | URL `null`    | Needs input — full profile/company URL **unknown**                |
| Footer short description      | Draft line in code    | `unconfirmed` | Needs founder-approved blurb before publishing                    |

### Explicitly unknown (do not invent)

- Production website domain
- Physical business address
- Opening hours
- Public response-time promise
- Exact LinkedIn URL
- Exact Instagram URL (handle only is known)

### Step 17 live footer behaviour

- No `tel:`, `mailto:`, WhatsApp, or social links are rendered on the public site yet.
- No Privacy/Terms links until those routes are implemented.
- Copyright uses brand name **Zatroz** only (no invented registered company name).

---

## Social and messaging rules (for later implementation)

- WhatsApp links may use a short generic message about discussing a project.
- Do not put visitor form fields into a WhatsApp URL automatically.
- A WhatsApp click is not proof a conversation happened.
- When founders confirm WhatsApp, set `whatsapp.status` to `confirmed` in `brand.ts`. The helper builds `https://wa.me/94768098068?text=…` with URL-encoding.

---

## Logo variants

| Variant                    | Status                |
| -------------------------- | --------------------- |
| Primary logo               | Missing in repository |
| Mark / icon                | Missing               |
| Wordmark                   | Missing               |
| Dark-background logo       | Missing               |
| Social share default image | Missing               |

Footer uses the documented text “Zatroz” fallback until an approved dark-capable logo is supplied. See `docs/content/asset-register.md`.
