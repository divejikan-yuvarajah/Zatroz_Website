# UI components

**Step:** 12  
**Tokens:** Use Step 11 values from `docs/design/design-system.md`. Do not add a second palette.

Presentational components are Server Components. Interactive gallery controls live in `src/components/dev/ui-interactions.tsx` and are imported only by the guarded `/dev/ui` page.

---

## Imports

```ts
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { TextLink } from "@/components/ui/text-link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
```

Class names are joined with `cn` in `src/lib/cn.ts`. Shared button look is in `src/components/ui/button-styles.ts`.

---

## Button

**File:** `src/components/ui/button.tsx`  
Native `<button>`. Default `type="button"` so it does not submit a form unless you pass `type="submit"`.

```tsx
<Button>Send</Button>
<Button variant="secondary" size="compact">Compact</Button>
<Button type="submit">Submit</Button>
<Button loading loadingLabel="Loading">Save</Button>
```

| Prop        | Values                                    | Notes                                                                                                    |
| ----------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `variant`   | `primary` (default), `secondary`, `quiet` | Primary is ink on `brand`                                                                                |
| `size`      | `normal` (default), `compact`             | Both at least 44px tall                                                                                  |
| `loading`   | boolean                                   | Sets `disabled` and `aria-busy`; shows “Loading” (or `loadingLabel`) without changing the reserved width |
| `disabled`  | boolean                                   | Preserved; loading also disables                                                                         |
| `className` | string                                    | Extra classes; do not use it to turn a button into a link                                                |

**Misuse:** Do not nest a link inside a button. Do not disable every button on the page because one is loading.

**Surfaces:** Primary works on light and charcoal. **Secondary and quiet are light-surface only.**

---

## ButtonLink

**File:** `src/components/ui/button-link.tsx`  
Looks like Button, behaves as a link. Internal paths (`/...`) use Next.js `Link`. Hash URLs and external URLs use `<a>`.

| Prop               | Notes                                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| `href`             | Required. Do not use `href="#"` as fake navigation; use a real in-page id or route.                   |
| `variant` / `size` | Same maps as Button                                                                                   |
| `newTab`           | Optional. Adds `target="_blank"`, `rel="noopener noreferrer"`, and a visible “opens in a new tab” cue |

No `disabled` or `loading` API. If a destination is unavailable, omit the link or show static text.

---

## TextLink

**File:** `src/components/ui/text-link.tsx`

| Prop      | Notes                                                                                     |
| --------- | ----------------------------------------------------------------------------------------- |
| `surface` | `light` (default): `brand-strong` on canvas/white. `inverse`: white underline on charcoal |
| `newTab`  | Same new-tab rules as ButtonLink                                                          |

Prefer visible text. If the visible content is only an icon, pass `aria-label`.

---

## Badge

**File:** `src/components/ui/badge.tsx`  
Static `<span>`. Variants: `neutral`, `accent`, `success`, `warning`, `error`. Not a button, not `role="status"`.

---

## Card

**File:** `src/components/ui/card.tsx`  
`as="div"` (default) or `as="article"`. Not focusable. Put links _inside_ the card. Never wrap a card of buttons in one big link.

---

## Container

**File:** `src/components/ui/container.tsx`  
Owns **horizontal** max-width and gutters only (`px-gutter`). `width="default"` ≈ 1280px; `width="reading"` ≈ 65ch. Uses `min-w-0` so flex/grid children can shrink. Place it **inside** Section so section backgrounds stay full-bleed. Do not also pad Section horizontally if Container is already used.

---

## Section

**File:** `src/components/ui/section.tsx`

| `surface` | Background      | Foreground                                   |
| --------- | --------------- | -------------------------------------------- |
| `light`   | `canvas`        | `text-body`; headings `ink`                  |
| `muted`   | `surface-muted` | same as light                                |
| `dark`    | `ink`           | `text-inverse-body`; headings `text-inverse` |

`as="section"` only when there is an accessible heading. Use `as="div"` for visual grouping. Do not use Section as `main`.

---

## FaqDisclosure

**File:** `src/components/ui/faq-disclosure.tsx`  
Native `<details>` / `<summary>` for short FAQ answers. Multiple may be open. Works without JavaScript. The visible question is the summary name; decorative +/- icons are `aria-hidden`. Put links in the answer body, not inside the summary.

```tsx
<FaqDisclosure id="faq-how-to-start" question="How do I start?">
  <p>Share the business need…</p>
</FaqDisclosure>
```

---

## SectionHeading

**File:** `src/components/ui/section-heading.tsx`  
Requires `level={1|2|3}`. Optional `visualLevel` if the look should differ from the tag. Optional `eyebrow`, `description`, `id`, `tone="inverse"` on charcoal. Empty eyebrow/description are not rendered. Pages still need exactly one `h1`.

---

## Preview

`/dev/ui` shows variants, long labels, a narrow card, light/dark surfaces, and a local counter (nothing is sent). The gallery is development-only.

---

## Checks (Step 12)

- `npm run format` then `npm run check`: passed (2026-09-17).
- `npm run build`: passed (Next.js 16.3.5).
- Production `next start` on **http://localhost:3012**: `/` HTTP 200; `/dev/ui` HTTP **404**.
- Viewport (320/390/768/1440), keyboard Tab/Shift+Tab/Enter/Space, 200% zoom, and reduced-motion visual review: **not run** by the agent. Please check `/dev/ui` in `npm run dev`.
