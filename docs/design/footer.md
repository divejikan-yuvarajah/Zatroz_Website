# Site footer

**Step:** 17  
**Header / mobile:** Steps 15–16. **Shared content model:** Step 18.

The live footer only links to **implemented** routes and **confirmed** contact destinations. Today that is the Home wordmark plus Explore → Home, and a copyright line. Phone, email, WhatsApp, Instagram, LinkedIn, Privacy, Terms, and the short blurb stay out of the live footer until founders confirm them or the pages exist.

---

## Files

| File                                     | Role                                                 |
| ---------------------------------------- | ---------------------------------------------------- |
| `src/config/brand.ts`                    | Brand name, draft blurb, contact, confirmation       |
| `src/config/navigation.ts`               | `getFooterNavigation` / gallery specimen             |
| `src/components/layout/site-footer.tsx`  | `SiteFooter` landmark + reusable `SiteFooterContent` |
| `src/components/dev/footer-specimen.tsx` | Guarded `/dev/ui` examples                           |
| `src/app/layout.tsx`                     | Passes `footer={<SiteFooter />}` into `SiteShell`    |

There is **no approved logo file** for dark backgrounds. The footer uses a text “Zatroz” home link (`aria-label="Zatroz home"`). Do not invent or recolour a mark.

`SiteFooter` and `SiteFooterContent` are **Server Components**. Ordinary links do not need client state.

---

## Layout and colour

- Charcoal `bg-ink` with inverse body, muted, and heading tokens (contrast checked in `docs/design/contrast-checks.md`).
- Inverse `TextLink` for destinations; `:focus-visible` uses the inverse outline on ink.
- Shared `Container` and `py-section` rhythm.
- Responsive grid: identity, Explore, Services, Contact/Policies. Empty groups are omitted. Lists stay visible (no accordion-only footer).
- Footer navigation uses the label **Explore** so it is distinct from the header’s **Primary** nav.

---

## Live footer (now)

| Block       | Content                                                            |
| ----------- | ------------------------------------------------------------------ |
| Identity    | Text “Zatroz” → `/`                                                |
| Description | Omitted (`description.status` is unconfirmed)                      |
| Explore     | Home                                                               |
| Services    | Omitted (no implemented service routes)                            |
| Contact     | Omitted (phone/email/WhatsApp/socials unconfirmed or missing URLs) |
| Policies    | Omitted (`/privacy` and `/terms` not implemented)                  |
| Copyright   | `© {year} Zatroz`                                                  |

### Year strategy

`getCopyrightYear()` runs in the Server Component using `new Date().getFullYear()`. On statically generated pages the year is fixed at **build** time and needs a rebuild after a year change. No client component is used for the year.

### Back to top

Deferred. The short starter does not need it; sticky header would also need a stable target check later.

---

## Contact and social rules

Values live in `src/config/brand.ts`. `getPublicContactLinks()` returns only channels with `status: "confirmed"` and a real `href`.

| Channel   | Supplied value        | Live link now | Blocker                                     |
| --------- | --------------------- | ------------- | ------------------------------------------- |
| Phone     | `+94 76 809 8068`     | No            | Mark `confirmed` after launch check         |
| Email     | `zatroz.co@gmail.com` | No            | Mark `confirmed` after monitoring owner set |
| WhatsApp  | digits `94768098068`  | No            | Confirm WhatsApp use separately from phone  |
| Instagram | handle `zatroz.co`    | No            | Exact profile URL missing                   |
| LinkedIn  | display name `Zatroz` | No            | Exact company URL unknown — do not guess    |

When WhatsApp is confirmed, the URL shape is `https://wa.me/94768098068?text=` plus a URL-encoded generic message with **no** visitor data.

Same-tab links by default. New tabs must announce “(opens in a new tab)” via `TextLink`.

---

## Gallery

`/dev/ui` shows:

1. Complete intended footer (Planned labels for unfinished routes; sample confirmed phone/email/WhatsApp).
2. Missing-social notes (no empty or `#` social anchors).
3. Long email wrapping fixture (`@example.com` only).

Specimens call `SiteFooterContent` inside a neutral wrapper — **one** `footer` landmark remains on the real page.

---

## Launch content gaps (footer)

1. Confirm phone, email, and WhatsApp for public pages; flip `status` to `confirmed` in `brand.ts`.
2. Supply exact Instagram and LinkedIn URLs (or keep them omitted).
3. Approve a short footer description; set `description.status` to `confirmed`.
4. Implement `/privacy` and `/terms`, then set `implemented: true` on those routes.
5. Implement service and explore pages so footer lists can fill in.

Step 18 should reuse `brand.ts` and footer navigation helpers rather than inventing a second contact list.

---

## Checks (Step 17)

- `npm run check`: passed (2026-09-18).
- `npm run build`: passed (Next.js 16.3.5).
- Production `next start` on **http://localhost:3018**: `/` HTTP 200; one `<footer class="bg-ink">`; Explore → Home only; copyright `© 2026 Zatroz`; no `mailto:`, `tel:`, `wa.me`, `/privacy`, `/terms`, `/contact`, or `/services` hrefs; one `main`; `/dev/ui` HTTP **404**.
- Viewport 320/390/768/1440, keyboard focus on inverse links, and real device dial/mail/WhatsApp actions: **not run** by the agent. Inspect hrefs in `/dev/ui` when contacts are confirmed.
