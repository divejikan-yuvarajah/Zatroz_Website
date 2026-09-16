# Contrast checks

**Step:** 11  
**Method:** Relative luminance (sRGB) and contrast ratio per WCAG 2.2.  
**Targets:** Normal text ≥ **4.5:1**. Large text ≥ **3:1**. Meaningful UI boundaries / focus ≥ **3:1** (non-text contrast). Decorative `border-subtle` is not a control identifier.

Ratios were computed from the token hex values in `src/styles/tokens.css` (2026-09-17). Isolated hex values are not enough; these are **pairs**.

---

## Text and button pairs

| Foreground                     | Background                  | Ratio   | Role                         | Target | Result                |
| ------------------------------ | --------------------------- | ------- | ---------------------------- | ------ | --------------------- |
| `ink` `#111111`                | `brand` `#FF3B10`           | 5.29:1  | Primary button text          | 4.5:1  | **Pass**              |
| `ink` `#111111`                | `brand-hover` `#FF572E`     | 5.98:1  | Primary hover text           | 4.5:1  | **Pass**              |
| `text-inverse` `#FFFFFF`       | `brand` `#FF3B10`           | 3.57:1  | White on primary (forbidden) | 4.5:1  | **Fail — do not use** |
| `brand-strong` `#C42B0A`       | `canvas` `#F7F5F2`          | 5.22:1  | Small link on page           | 4.5:1  | **Pass**              |
| `brand-strong` `#C42B0A`       | `surface` `#FFFFFF`         | 5.68:1  | Small link on panel          | 4.5:1  | **Pass**              |
| `ink` `#111111`                | `canvas` `#F7F5F2`          | 17.35:1 | Heading on page              | 4.5:1  | **Pass**              |
| `ink` `#111111`                | `surface` `#FFFFFF`         | 18.88:1 | Heading on panel             | 4.5:1  | **Pass**              |
| `text-body` `#3F3D3A`          | `canvas` `#F7F5F2`          | 9.95:1  | Body                         | 4.5:1  | **Pass**              |
| `text-body` `#3F3D3A`          | `surface` `#FFFFFF`         | 10.83:1 | Body on panel                | 4.5:1  | **Pass**              |
| `text-muted` `#68645F`         | `canvas` `#F7F5F2`          | 5.40:1  | Supporting text              | 4.5:1  | **Pass**              |
| `text-muted` `#68645F`         | `surface` `#FFFFFF`         | 5.87:1  | Supporting on panel          | 4.5:1  | **Pass**              |
| `text-inverse` `#FFFFFF`       | `ink` `#111111`             | 18.88:1 | Heading on charcoal          | 4.5:1  | **Pass**              |
| `text-inverse` `#FFFFFF`       | `surface-inverse` `#1C1C1C` | 17.04:1 | Heading on inverse panel     | 4.5:1  | **Pass**              |
| `text-inverse-body` `#D6D6D6`  | `ink` `#111111`             | 12.99:1 | Body on charcoal             | 4.5:1  | **Pass**              |
| `text-inverse-body` `#D6D6D6`  | `surface-inverse` `#1C1C1C` | 11.73:1 | Body on inverse panel        | 4.5:1  | **Pass**              |
| `text-inverse-muted` `#A8A8A8` | `ink` `#111111`             | 7.94:1  | Supporting on charcoal       | 4.5:1  | **Pass**              |
| `text-inverse-muted` `#A8A8A8` | `surface-inverse` `#1C1C1C` | 7.17:1  | Supporting on inverse panel  | 4.5:1  | **Pass**              |
| `success` `#166534`            | `success-soft` `#F0FDF4`    | 6.81:1  | Status text                  | 4.5:1  | **Pass**              |
| `warning` `#854D0E`            | `warning-soft` `#FFFBEB`    | 6.61:1  | Status text                  | 4.5:1  | **Pass**              |
| `error` `#B91C1C`              | `error-soft` `#FEF2F2`      | 5.91:1  | Status text                  | 4.5:1  | **Pass**              |

Primary **brand** colour is unchanged. White-on-orange fails, so primary buttons use **ink** on brand (and on brand-hover). No token hex was altered for a fail in an intended pair.

---

## Controls and focus

| Foreground                       | Background          | Ratio   | Role              | Target | Result   |
| -------------------------------- | ------------------- | ------- | ----------------- | ------ | -------- |
| `border-control` `#817B74`       | `surface` `#FFFFFF` | 4.18:1  | Input boundary    | 3:1    | **Pass** |
| `border-control` `#817B74`       | `canvas` `#F7F5F2`  | 3.85:1  | Input on page     | 3:1    | **Pass** |
| `ink` outline `#111111`          | `canvas` `#F7F5F2`  | 17.35:1 | Focus on light    | 3:1    | **Pass** |
| `ink` outline `#111111`          | `brand` `#FF3B10`   | 5.29:1  | Focus on primary  | 3:1    | **Pass** |
| `text-inverse` outline `#FFFFFF` | `ink` `#111111`     | 18.88:1 | Focus on charcoal | 3:1    | **Pass** |

`border-subtle` is decorative. Do not use it as the only way to find a white input.

---

## CSS match

| Documented pair      | CSS                                                     |
| -------------------- | ------------------------------------------------------- |
| Ink on brand button  | `.bg-brand` + `text-ink` on the preview primary example |
| Strong link on light | `text-brand-strong` on canvas/surface                   |
| Inverse copy         | `text-text-inverse*` on `bg-ink`                        |
| Focus                | `:focus-visible` outline `ink` / inverse on dark        |

These checks are **not** a full WCAG conformance claim.
