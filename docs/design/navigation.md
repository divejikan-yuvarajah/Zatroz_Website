# Desktop navigation

**Step:** 15  
**Mobile menu:** Step 16. **Footer:** Step 17.

The live header only links to **implemented** routes. Today that is Home (`/`). Other destinations stay in the typed config as `implemented: false` until their `page.tsx` exists and content is ready. Flip that flag in `src/config/routes.ts` at the page step — do not add broken header links earlier.

---

## Files

| File                                            | Role                                      |
| ----------------------------------------------- | ----------------------------------------- |
| `src/config/routes.ts`                          | Canonical paths + `implemented`           |
| `src/config/navigation.ts`                      | Labels, order, header vs gallery lists    |
| `src/lib/navigation.ts`                         | Path matching (pure)                      |
| `src/components/layout/site-header.tsx`         | Server `<header>` + Container             |
| `src/components/layout/home-link.tsx`           | Home wordmark; `aria-current` when on `/` |
| `src/components/layout/desktop-navigation.tsx`  | Client primary nav (`usePathname`)        |
| `src/components/layout/services-disclosure.tsx` | Overview link + separate toggle           |

There is **no approved logo file**. The header uses a text “Zatroz” home link (`aria-label="Zatroz home"`). Do not invent a mark.

---

## Live header (now)

- Sticky, opaque `canvas`, subtle bottom border (no scroll listener).
- Skip link stays above it (`z-index` 60 vs header 40). `html` has `scroll-padding-top` so skip/main are not hidden under the bar.
- Desktop nav from **1024px** (`lg`). Below that, the Home wordmark is the usable fallback. No hamburger in this step.
- Primary CTA **Start a project** is omitted until `/contact` is implemented. It is not replaced with email or a dead `/contact` link.
- Services disclosure is omitted until `/services` or a service detail page is implemented.

---

## Intended destinations (gallery)

Shown on `/dev/ui` with **(Planned)** text for unfinished routes. Interactive examples use `/` or in-page ids only. Never `href="#"`.

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

## Services disclosure

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
