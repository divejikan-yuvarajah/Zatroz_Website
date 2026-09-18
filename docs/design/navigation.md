# Site navigation

**Step:** 16 (desktop from 15)  
**Footer:** Step 17.

The live header only links to **implemented** routes. Today that is Home (`/`). Other destinations stay in the typed config as `implemented: false` until their `page.tsx` exists and content is ready. Flip that flag in `src/config/routes.ts` at the page step — do not add broken header links earlier.

---

## Files

| File                                                | Role                                              |
| --------------------------------------------------- | ------------------------------------------------- |
| `src/config/routes.ts`                              | Canonical paths + `implemented`                   |
| `src/config/navigation.ts`                          | Labels, order, header vs gallery lists            |
| `src/lib/navigation.ts`                             | Path matching (pure) + desktop media query string |
| `src/components/layout/site-header.tsx`             | Server `<header>` + Container + noscript list     |
| `src/components/layout/home-link.tsx`               | Home wordmark; `aria-current` when on `/`         |
| `src/components/layout/desktop-navigation.tsx`      | Client primary nav (`usePathname`)                |
| `src/components/layout/services-disclosure.tsx`     | Overview link + separate toggle                   |
| `src/components/layout/mobile-navigation.tsx`       | Client Menu + native `dialog.showModal()`         |
| `src/components/dev/mobile-navigation-specimen.tsx` | Guarded `/dev/ui` examples                        |

There is **no approved logo file**. The header uses a text “Zatroz” home link (`aria-label="Zatroz home"`). Do not invent a mark.

The root layout stays a Server Component. Menu open state lives only in `MobileNavigation`.

---

## Live header (now)

- Sticky, opaque `canvas`, subtle bottom border (no scroll listener).
- Skip link stays above it (`z-index` 60 vs header 40). `html` has `scroll-padding-top` so skip/main are not hidden under the bar.
- Desktop nav from **1024px** (`lg` / `(min-width: 1024px)`). CSS hide/show and the mobile dialog cleanup use the same breakpoint.
- Below 1024px: Home wordmark plus a **Menu** button. Desktop nav is `hidden` so it is not in the tab order.
- From 1024px: desktop nav is visible; Menu is `lg:hidden` so it is not in the tab order. The dialog is **not** inside a hidden ancestor.
- Primary CTA **Start a project** is omitted until `/contact` is implemented. It is not replaced with email or a dead `/contact` link.
- Services disclosure is omitted until `/services` or a service detail page is implemented.

---

## Mobile panel

Native `<dialog>` opened with `showModal()` (not by toggling the `open` attribute). Title: **Site navigation**. Close control: **Close menu**. Both Menu and Close menu are visible text on `min-h-11` targets. Menu uses `aria-expanded`, `aria-controls`, and `aria-haspopup="dialog"`. No extra focus trap on top of the native modal.

Order inside the panel: **Home**, then Services (overview + `<details>` for categories), then Work / About / Process, then the CTA when eligible. Labels come from `getHeaderNavigation()` / `getHomeDestination()` — not a second route list.

Service groups use `<details>`, not a nested modal.

The panel scrolls internally (`overflow-y: auto`, safe-area padding). Background page scrolling is locked by setting `document.body.style.overflow` to `hidden` and restoring **only** that property.

### Close and focus

| Path                                      | Close panel | Focus after close                                                               |
| ----------------------------------------- | ----------- | ------------------------------------------------------------------------------- |
| Close menu, Escape, backdrop              | Yes         | Menu button, `preventScroll`. If that button is not visible, the Home wordmark. |
| Same-tab link or CTA                      | Yes         | Do **not** return to Menu (avoids fighting Next.js after a route change).       |
| Modified click / new tab                  | No          | Leave the panel open; native link behaviour is unchanged.                       |
| `usePathname` change (incl. Back/Forward) | Yes         | Same as same-tab navigation: do not restore Menu.                               |
| Viewport crosses to 1024px+               | Yes         | Home wordmark (`#site-home-link`), because Menu is then `lg:hidden`.            |

Backdrop close only when `event.target === dialog` (the dimmed area). Clicks on panel padding do not close.

No open-on-load. No GSAP. No delayed cleanup waiting on animation.

### No-JavaScript

`SiteHeader` includes a server-rendered `<noscript>` list of **implemented** destinations (Home today). It is not in the tab order when JavaScript runs. With JavaScript off, the Menu button cannot open the dialog; the noscript list remains the usable route list. Desktop CSS nav still SSR-renders for large viewports.

---

## Intended destinations (gallery)

Shown on `/dev/ui` with **(Planned)** text for unfinished routes. Interactive examples use `/` or in-page ids only. Never `href="#"`. Gallery menus use distinct ids (`gallery-mobile-*`) and always-visible triggers so they can be opened on a desktop gallery view without colliding with the live header.

| Item                   | Path                          | Header now            |
| ---------------------- | ----------------------------- | --------------------- |
| Home                   | `/`                           | Link                  |
| Services               | `/services`                   | Planned               |
| Six service groups     | `/services/...`               | Planned               |
| Work / About / Process | `/work`, `/about`, `/process` | Planned               |
| Start a project        | `/contact`                    | Hidden in live header |
| Privacy / Terms        | `/privacy`, `/terms`          | Footer later          |

Launch checklist: enable each destination when its page is real.

---

## Services disclosure (desktop)

- Overview is a **link**. The toggle is a **button** named “Show service categories”.
- `aria-expanded` and `aria-controls` point at a stable panel id (`{prefix}-services-panel`).
- Panel is an ordinary list, not `role="menu"`.
- Open: click / Enter / Space on the button. Not hover-only.
- Closed: `hidden` so items are not in the tab order.
- Close: Escape (focus returns to the button), pointer outside, choosing a link, or focus leaving the whole group. Tabbing from overview → button → panel does not close it. Tabbing out does not pull focus back.

---

## Active path

`getNavLinkState(current, href)`:

- Ignores `?query` and `#hash`.
- Treats `/services/` as `/services`.
- Home matches **only** `/`.
- `/services` and `/services/websites-ecommerce` belong to Services; `/services-old` does not.
- Same idea for `/work` and `/work/[slug]`.
- **`aria-current="page"`** only on the exact page. A parent can use the section visual (inset ring) without claiming it is the current page.

Check: `node --experimental-strip-types scripts/verify-navigation.ts`

No rewrites are configured, so `usePathname` should match the browser path.

---

## Future page steps

When you add `src/app/services/page.tsx` (and so on), set `implemented: true` on that route. The header will then include the link. Step 18 must reuse `src/config/navigation.ts` / `routes.ts`, not a second menu list.

---

## Checks (Step 15)

- Matcher: `node --experimental-strip-types scripts/verify-navigation.ts` — **passed** (2026-09-17).
- `npm run check`: passed.
- `npm run build`: passed (Next.js 16.3.5).
- Production `next start` on **http://localhost:3015**: `/` HTTP 200; skip link + header + Home only; no `/contact`, `/services`, or `/work` hrefs; one `main`; `/dev/ui` HTTP **404**.
- Mouse/keyboard disclosure, 1024/1280/1440, 200% zoom, skip-under-sticky, and screen-reader: **not run** by the agent. Use `/dev/ui` in `npm run dev` for the full bar.

## Checks (Step 16)

- Matcher: `node --experimental-strip-types scripts/verify-navigation.ts` — **passed** (2026-09-18).
- `npm run check`: passed.
- `npm run build`: passed (Next.js 16.3.5).
- Production `next start` on **http://localhost:3016**: `/` HTTP 200; skip link; `<header>` with Home wordmark, Menu (`aria-haspopup="dialog"`), closed `<dialog id="site-mobile-dialog">` (Home only, no `open` attribute), noscript Home list; no `/contact`, `/services`, `/work`, `/about`, or `/process` hrefs; one `main`; one `h1`; `/dev/ui` HTTP **404**.
- Opening, Tab containment, Escape, backdrop, route-change focus, 320/390/768, landscape, iPhone Safari/Android, and screen-reader: **not run** by the agent. Use `npm run dev` and `/dev/ui` for the full panel.
