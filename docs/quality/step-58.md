# Quality Step 58 — Accessibility review

**Branch:** `feature/58-accessibility` (from `feature/57-responsive`)  
**Status:** Targeted fixes **Done**. Screen-reader / full keyboard / live axe browser sweeps **Not run**.

## What changed

| Area          | Detail                                                                                 |
| ------------- | -------------------------------------------------------------------------------------- |
| Audit log     | `docs/quality/accessibility-audit.md`                                                  |
| Brand links   | Visible name kept in accessibility tree (home + footer)                                |
| Error summary | `role="group"` + labelled heading                                                      |
| Focus         | `scroll-margin-top` under sticky header; FAQ summary focus ring; forced-colors outline |
| Admin reorder | Descriptive `aria-label` on move/remove controls                                       |
| Automated     | ESLint jsx-a11y via existing `npm run lint` — no new browser harness                   |

## Checks

| Check                 | Result                   |
| --------------------- | ------------------------ |
| `npm run format`      | Recorded after run       |
| `npm run check`       | Recorded after run       |
| `npm run build`       | Recorded after run       |
| Live axe / Playwright | **Not run** (no harness) |
| Screen reader session | **Not run**              |

## Honesty

| Claim                              | Status          |
| ---------------------------------- | --------------- |
| Concrete barriers fixed in code    | Done            |
| WCAG 2.2 AA certification          | **Not claimed** |
| Full assistive-technology coverage | **Not claimed** |

## Next

Step 59 — SEO and social sharing. Do not start automatically.
