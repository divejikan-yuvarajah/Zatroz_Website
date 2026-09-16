# Page layout

**Step:** 14  
**Status:** Shared shell implemented. Navigation is Step 15. Mobile menu is Step 16. Footer is Step 17.

This document describes how the document, shell, and page pieces fit together. Do not add a second `main`, a second `h1` from the shell, or a site-wide Container around `main`.

---

## Layers

| Layer       | File                                          | Owns                                                                                 | Must not                                       |
| ----------- | --------------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------- |
| Root layout | `src/app/layout.tsx`                          | `html` / `body`, `lang="en"`, Manrope, global CSS, `SiteShell`                       | Become a Client Component                      |
| Skip link   | `src/components/layout/skip-link.tsx`         | First keyboard control; native `#main-content`                                       | Custom scroll libraries; autofocus on load     |
| SiteShell   | `src/components/layout/site-shell.tsx`        | Canvas background, min-height, optional header/footer slots, one `main#main-content` | Fake `header`/`footer`/`nav` when slots empty  |
| Page        | `src/app/page.tsx`, `src/app/dev/ui/page.tsx` | One H1, sections, content                                                            | A second `main`                                |
| Section     | `src/components/ui/section.tsx`               | Full-bleed surface and vertical spacing                                              | Horizontal gutters (those belong on Container) |
| Container   | `src/components/ui/container.tsx`             | Horizontal max-width and gutters (`default` ≈ 1280px, `reading` ≈ 65ch)              | Wrapping the whole `main`                      |

The root layout stays a **Server Component**. Future mobile-menu state belongs in a small Client Component (Step 16), not here. No layout-wide theme provider, route-transition loader, or custom scrolling.

Metadata on the starter remains honest (`title: "Zatroz"` plus a development description). Production domain and full SEO are later steps.

---

## Skip link

- Markup: `<a href="#main-content">Skip to content</a>`
- Visually hidden until `:focus` / `:focus-visible`, then shown at the top using brand + ink (same primary pair as buttons).
- `main` has `id="main-content"` and `tabIndex={-1}` so the browser can move focus there. No `autofocus`. No `useEffect` that steals focus on every render.
- Future **sticky** SiteHeader must not cover this target or other focused controls. When that lands, add enough `scroll-margin-top` (or equivalent) on `#main-content` and focused fields so they stay in view.

---

## Height and scrolling

`.site-shell` (and `body`) use `min-height: 100vh` with `min-height: 100dvh` as a newer fallback. Short pages fill the window. Long pages grow. **Do not** set a fixed `height: 100vh` on the shell or `overflow: hidden` on `html`/`body` to fake a frame. The **document** scrolls. `main` is `flex-1` so it uses spare height; it is not an inner scroll pane.

---

## How pages compose

```tsx
<Section as="section" surface="light" aria-labelledby="page-heading">
  <Container>
    <SectionHeading level={1} id="page-heading">
      Page title
    </SectionHeading>
    {/* content */}
  </Container>
</Section>
```

- Use `as="section"` only with an accessible heading. Use `as="div"` for visual grouping.
- Put Container **inside** Section so backgrounds stay full-bleed.
- Use `width="reading"` for long prose; `width="default"` for wider grids.
- Do not nest Container in Container (double gutters).
- Do not wrap `main` in Container.

---

## Future header and footer (not built in this step)

When Step 15/17 exist, pass them into the root layout:

```tsx
<SiteShell header={<SiteHeader />} footer={<SiteFooter />}>
  {children}
</SiteShell>
```

- `SiteHeader` should own the `<header>` / `<nav>` landmarks.
- `SiteFooter` should own the `<footer>` landmark.
- Until then, omit the props. Empty landmarks and spacer blocks are not allowed.

Header/footer should reuse the same `px-gutter` / Container widths so they line up with page content.

---

## Current routes

| Route     | H1                   | Notes                                                                 |
| --------- | -------------------- | --------------------------------------------------------------------- |
| `/`       | Zatroz               | Minimal starter. No hero, no fake service/contact links.              |
| `/dev/ui` | Zatroz design tokens | Development gallery + layout specimen. Guarded; `notFound()` in prod. |

Interactive `/dev/ui` demos need JavaScript. The skip link, shell, and starter home remain readable with JavaScript off.

---

## Checks (Step 14)

- `npm run check`: passed (2026-09-17).
- `npm run build`: passed (Next.js 16.3.5).
- Production `next start` on **http://localhost:3014**: `/` HTTP 200; HTML has skip link, exactly one `main#main-content`, exactly one `h1`; `/dev/ui` HTTP **404**.
- Viewport (320/375/390/768/1024/1440), 200% zoom, skip-link keyboard path, and JavaScript-off visual review: **not run** by the agent. Please check `/` and `/dev/ui` in `npm run dev`.
