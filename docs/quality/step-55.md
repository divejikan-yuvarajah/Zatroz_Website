# Quality Step 55 — System pages and states

**Branch:** `feature/55-system-pages` (from `feature/54-privacy-terms`)
**Status:** Implementation **Done**. Interactive browser / production-status probes partially documented below.

## What changed

| Area             | Detail                                                                                                                 |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| State inventory  | `docs/quality/state-inventory.md`                                                                                      |
| Shared UI        | `src/components/system/system-state.tsx`, `page-loading-skeleton.tsx`                                                  |
| Safe logging     | `src/lib/system/log-boundary-error.ts` — digest + error name only                                                      |
| Not found        | `src/app/not-found.tsx` — text-first; no path echo; `robots: noindex`                                                  |
| Errors           | `src/app/error.tsx`, `src/app/global-error.tsx`, `src/app/admin/error.tsx` — fixed copy + `retry` (no mutation replay) |
| Loading          | `loading.tsx` on `/work`, `/work/[slug]`, `/services/[slug]` only                                                      |
| Catalogue health | `PublicCatalogAvailability` on list results; Mongo catch → `unavailable`                                               |
| Work UI          | Empty / no-match / unavailable remain distinct (`InlineUnavailableNotice`)                                             |
| Tests            | `test:public-projects` asserts ready vs unavailable                                                                    |

## Status / publication behaviour

| Scenario                             | Expected                                   | Evidence                                                  |
| ------------------------------------ | ------------------------------------------ | --------------------------------------------------------- |
| Unmatched public path                | Not-found UI; prefer HTTP 404              | Build includes `not-found`; live status probe **Not run** |
| Unknown / draft work or service slug | `notFound()` → same UI                     | Code path verified; live status **Not run**               |
| Mongo catalogue throw                | `availability: "unavailable"`; Work notice | Unit fixture + catch in `public-catalog.ts`               |
| Empty ready catalogue                | Honest empty copy                          | Existing Work empty branch                                |
| Filter no-match                      | Clear filters                              | Existing Work no-match branch                             |
| Segment exception                    | Safe error + manual retry                  | `error.tsx` / admin error                                 |
| Root layout exception                | Self-contained global fallback             | `global-error.tsx`                                        |
| Enquiry boundary retry               | Does not resubmit                          | Copy + `retry` only re-renders                            |

Experimental `globalNotFound` was **not** enabled. Optional not-found illustration was **not** generated (text-first layout).

## Checks

| Check                                                     | Result      |
| --------------------------------------------------------- | ----------- |
| `npm run format`                                          | Passed      |
| `npm run check`                                           | Passed      |
| `npm run build`                                           | Passed      |
| Interactive 320px / 200% zoom / keyboard / reduced-motion | **Not run** |
| Production-mode HTTP status for random path / draft slug  | **Not run** |

## Honesty

| Claim                                                     | Status                          |
| --------------------------------------------------------- | ------------------------------- |
| Distinct empty / no-match / unavailable / error / loading | Done                            |
| No private `Error.message` in UI or boundary logs         | Done (digest + name only)       |
| Retry does not replay mutations                           | Done by design                  |
| Every not-found UI proven as HTTP 404 under streaming     | **Not claimed** — probe Not run |
| Illustration asset                                        | Not shipped                     |

## Next

Step 56 — animation / motion work. Do not start automatically.
