# Accessibility audit (Step 58)

**Standard target:** WCAG 2.2 Level AA (review target, not a certification claim).  
**Branch:** `feature/58-accessibility`  
**Date:** 2026-09-23

## Scope

| Surface                 | Included                                                                                                 |
| ----------------------- | -------------------------------------------------------------------------------------------------------- |
| Public marketing routes | Home, Services (+ details), Work (+ filters/detail), Process, About, Contact/enquiry, Privacy, Terms     |
| System states           | Not found, error/global-error, loading                                                                   |
| Admin                   | Login, MFA/recovery, shell nav, project list/editor/story gallery reorder, media, publish, notifications |
| Specimens               | `/dev/ui` structure only (not a production claim)                                                        |

## Tools and coverage

| Method                        | Tool / approach                                                  | Result                                                     |
| ----------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------- |
| Automated static              | `eslint-plugin-jsx-a11y` via `npm run lint` (Next ESLint config) | Run with Step 58 checks                                    |
| Automated axe in browser      | No Playwright/Cypress harness in repo                            | **Not run** — deferred until a browser-test harness exists |
| Keyboard task walkthrough     | Agent code-path review                                           | Partial — see issues; interactive pass **Not run**         |
| Screen reader                 | —                                                                | **Not run** (no NVDA/VoiceOver/TalkBack session)           |
| Contrast calculation          | Relative luminance script on design tokens                       | Recorded below                                             |
| Zoom / reflow / forced-colors | Code review + CSS additions                                      | Forced-colors focus rule added; 200%/400% zoom **Not run** |

## Contrast samples (token pairs)

| Pair                                  | Ratio  | AA normal text (4.5:1)                                         |
| ------------------------------------- | ------ | -------------------------------------------------------------- |
| `--text-muted` on `--canvas`          | ~5.4:1 | Pass                                                           |
| `--text-body` on `--canvas`           | ~10:1  | Pass                                                           |
| `--ink` on `--canvas`                 | ~17:1  | Pass                                                           |
| `--brand` on `--ink` (primary button) | ~5.3:1 | Pass                                                           |
| White on `--brand`                    | ~3.6:1 | Fail if used for small text — primary buttons use ink on brand |
| `--border-control` on `--canvas`      | ~3.9:1 | Pass non-text UI (3:1)                                         |

## Issues found

| ID     | Severity | Surface                      | Criterion (indicative)    | Issue                                                                                                                                                             | Fix                                                                                                       | Retest      |
| ------ | -------- | ---------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ----------- |
| A58-01 | Major    | Public/footer home links     | 2.5.3 Label in Name       | Visible brand text was `aria-hidden`, so AT users relied only on `aria-label` while the name still matched; hiding visible text is fragile for future label edits | Removed `aria-hidden` so visible “Zatroz” / brand name remains in the tree; keep descriptive `aria-label` | Code review |
| A58-02 | Major    | Enquiry / forms              | 1.3.1 / 4.1.2             | Error summary container lacked an explicit group name relationship beyond the heading                                                                             | Set `role="group"` + existing `aria-labelledby` on `ErrorSummary`                                         | Code review |
| A58-03 | Major    | Sticky header                | 2.4.11 / 2.4.13 (approx.) | Focused controls could sit under the sticky header after in-page moves                                                                                            | `scroll-margin-top` on `:focus-visible`                                                                   | Code review |
| A58-04 | Minor    | FAQ disclosures              | 2.4.7                     | Summary focus ring less obvious in some browsers                                                                                                                  | Explicit `focus-visible` outline on FAQ summary                                                           | Code review |
| A58-05 | Major    | Admin story gallery / blocks | 4.1.2                     | Repeated “Move up/down/Remove” buttons lacked which item they affect                                                                                              | `aria-label` includes section/gallery index                                                               | Code review |
| A58-06 | Minor    | Forced colours               | 1.4.11                    | Focus/press styles could disappear in forced-colors mode                                                                                                          | `@media (forced-colors: active)` focus outline                                                            | Code review |
| A58-07 | Info     | Whole site                   | —                         | No live axe-core browser sweep                                                                                                                                    | Documented; do not invent a parallel harness solely for this step                                         | Remaining   |
| A58-08 | Info     | Public + admin tasks         | —                         | Screen-reader and full keyboard task matrix                                                                                                                       | Remaining manual list below                                                                               | Remaining   |

## Already in good shape (no change)

- `lang="en"` on root html
- Skip link → `#main-content` (marketing `SiteShell` + admin shell/login/MFA)
- One primary `main` landmark per chrome
- Form fields use explicit labels + `aria-describedby` for hint/error
- Enquiry `ErrorSummary` receives focus after failed submit (no duplicate live-region shout for the same errors)
- Native FAQ `details`/`summary`
- Gallery reorder already had non-drag Move up/down controls
- Loading skeletons expose `role="status"` text for AT
- Step 55/56 reduced-motion and system-state copy avoid private error leakage

## Remaining manual tasks

1. Keyboard: mobile menu open/close/Escape, Work filters, Contact submit/correct, admin login → MFA → project edit → gallery reorder → publish confirm.
2. Screen reader: one desktop pair (e.g. NVDA + Firefox or VoiceOver + Safari) on Home, Contact, Work detail, admin login.
3. Mobile AT: VoiceOver or TalkBack on Contact + mobile menu.
4. 200% text / 400% zoom reflow spot-check on Contact and admin project editor.
5. Optional: add Playwright + `@axe-core/playwright` when a browser regression harness is introduced (later quality steps).

## Conformance statement

**Not claimed.** This step records a targeted review and concrete fixes. It is not WCAG certification, an accessibility statement for production, or proof that every page passes automated axe in a browser.
