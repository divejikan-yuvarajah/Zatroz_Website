# Zatroz design system

**Step:** 11  
**Status:** Tokens implemented in CSS. Button, Card, and related primitives are Step 12 (`docs/design/ui-components.md`). Form components are a later step.

Raw values live in `src/styles/tokens.css`. Tailwind v4 maps them in `src/app/globals.css` via `@theme inline`. Do not add a second colour palette in components.

The site stays in its designed **light** presentation. Charcoal is an explicit section surface, not an automatic dark theme.

---

## Colour tokens

| Token                      | Hex                   | Role                                             |
| -------------------------- | --------------------- | ------------------------------------------------ |
| `brand`                    | `#FF3B10`             | Primary accent; primary button **with ink text** |
| `brand-hover`              | `#FF572E`             | Primary hover; ink text                          |
| `brand-strong`             | `#C42B0A`             | Small links on light surfaces                    |
| `brand-soft`               | `#FFF0EA`             | Quiet selected surface                           |
| `ink`                      | `#111111`             | Headings; charcoal section background            |
| `canvas`                   | `#F7F5F2`             | Page background                                  |
| `surface`                  | `#FFFFFF`             | Panels and controls                              |
| `surface-muted`            | `#EEEAE4`             | Quiet bands                                      |
| `surface-inverse`          | `#1C1C1C`             | Panels inside dark sections                      |
| `border-subtle`            | `#D8D3CD`             | Decorative separators only                       |
| `border-control`           | `#817B74`             | Meaningful input boundary on light               |
| `border-inverse`           | `#3A3A3A`             | Decorative dark separators                       |
| `text-body`                | `#3F3D3A`             | Body on light                                    |
| `text-muted`               | `#68645F`             | Secondary on light                               |
| `text-inverse`             | `#FFFFFF`             | Headings on charcoal                             |
| `text-inverse-body`        | `#D6D6D6`             | Body on charcoal                                 |
| `text-inverse-muted`       | `#A8A8A8`             | Secondary on charcoal                            |
| `success` / `success-soft` | `#166534` / `#F0FDF4` | Success text / surface                           |
| `warning` / `warning-soft` | `#854D0E` / `#FFFBEB` | Warning text / surface                           |
| `error` / `error-soft`     | `#B91C1C` / `#FEF2F2` | Error text / surface                             |

**Do not** use white text on `brand`. See `docs/design/contrast-checks.md`.

### Allowed pairs (summary)

| Foreground           | Background                           | Use                       |
| -------------------- | ------------------------------------ | ------------------------- |
| `ink`                | `brand`, `brand-hover`               | Primary button            |
| `brand-strong`       | `canvas`, `surface`                  | Small light-surface links |
| `ink`                | `canvas`, `surface`, `surface-muted` | Headings                  |
| `text-body`          | `canvas`, `surface`                  | Body                      |
| `text-muted`         | `canvas`, `surface`                  | Supporting text           |
| `text-inverse`       | `ink`, `surface-inverse`             | Dark headings             |
| `text-inverse-body`  | `ink`, `surface-inverse`             | Dark body                 |
| `text-inverse-muted` | `ink`, `surface-inverse`             | Dark supporting           |
| `success`            | `success-soft`                       | Status                    |
| `warning`            | `warning-soft`                       | Status                    |
| `error`              | `error-soft`                         | Status                    |

Do not place `brand-strong` on charcoal without a new contrast check.

Tailwind utilities: `bg-brand`, `text-ink`, `text-text-body`, `border-border-control`, `bg-canvas`.

---

## Typography

- Family: **Manrope** via `next/font/google` in `src/app/layout.tsx` (weights 400/500/600/700). Variable: `--font-manrope`.
- Fallback: `ui-sans-serif, system-ui, sans-serif`.
- No IBM Plex Mono yet. No Tamil/Sinhala faces yet.
- If Google-font fetch is blocked at build time, keep the fallback and record it in progress.
- Visual sizes: `.ds-h1` / `.ds-h2` / `.ds-h3` (and real `h1`–`h3` defaults). Size does not set heading level.
- Body `16–18px` fluid, line-height `1.6`, normal tracking. Headings use tight tracking.
- No hardcoded line breaks. Headings wrap (`text-wrap: balance` as a hint only).

---

## Spacing and layout tokens

| Token                                   | Approx at 16px root                         |
| --------------------------------------- | ------------------------------------------- |
| `--space-1` … `--space-11`              | 4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 128px |
| `--space-gutter` / `px-gutter`          | 16px → 24–32px                              |
| `--space-section` / `py-section`        | 48px → 96px                                 |
| `--width-container` / `max-w-container` | 1280px                                      |
| `--width-reading` / `max-w-reading`     | 65ch                                        |

Tailwind’s default spacing scale matches this set if you skip `5` (20px). Prefer `4/6/8/12/16/20/24/32` for 16/24/32/48/64/80/96/128px.

Container **components** are Step 12. These tokens are ready for them.

---

## Radius, shadow, z-index, motion

| Token                                 | Value                 | Note                   |
| ------------------------------------- | --------------------- | ---------------------- |
| `rounded-sm/md/lg`                    | 6 / 12 / 20px         | Do not round every box |
| `shadow-soft`, `shadow-lift`          | Subtle elevation      | Optional               |
| `--z-base` … `--z-toast`              | 0 / 10 / 40 / 50 / 60 | Header/menu room later |
| `--duration-fast` / `--duration-base` | 150ms / 220ms         | State changes          |

Use `.ds-transition` for colour/border/shadow only. **No** `transition: all`. No smooth-scroll default. No entrance animations in this step.

**Reduced motion:** `.ds-transition` is disabled when `prefers-reduced-motion: reduce`. Do not globally zero all animations (that can break future functional states).

---

## Focus

`:focus-visible` uses a 3px `ink` outline with 3px offset on light and orange surfaces. On `bg-ink` / `bg-surface-inverse`, the outline is `text-inverse`. `:focus` outline is removed only because `:focus-visible` replaces it.

---

## Local preview

`/dev/ui` is a development token gallery. It calls `notFound()` unless `NODE_ENV === "development"`. Metadata is noindex. It is not in navigation. **Noindex is not access control.**

Check it with `npm run dev`. After `npm run build` + `npm run start` it must 404.
