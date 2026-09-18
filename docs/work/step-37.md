# Work Step 37 — Work page and public project selectors

**Branch:** `feature/37-work-page` (from `feature/36-ui-ux-design`)  
**Status:** Implemented (live `/work` with zero published projects)

## What changed

| File                                        | Role                                                   |
| ------------------------------------------- | ------------------------------------------------------ |
| `src/lib/public-projects.ts`                | Pure eligibility, filters, pagination, DTOs            |
| `src/server/public-projects.ts`             | Repository adapter + async selectors                   |
| `src/content/projects.ts`                   | Extended model (summary, services, story state, order) |
| `src/app/work/page.tsx`                     | Thin Work route with GET filters                       |
| `src/components/sections/work-page.tsx`     | Listing composition                                    |
| `src/components/sections/project-card.tsx`  | Card (text-first without cover)                        |
| `src/components/sections/work-filters.tsx`  | Native GET filters + pagination                        |
| `src/components/dev/work-page-specimen.tsx` | Gallery specimen cards                                 |
| `scripts/test-public-projects.ts`           | Focused selector tests                                 |
| `docs/architecture/admin-content-plan.md`   | Interface / A09–A10 migration notes                    |
| `docs/work/step-37.md`                      | This note                                              |

## Behaviour

- `/work` is implemented and linked from navigation when routes allow.
- Published project count: **0** (no invented portfolio).
- Empty state explains preparation and offers the shared enquiry CTA when available.
- Filters use `service`, `status`, and `page` via GET; invalid/repeated values default safely.
- Filter/paginated URLs use `noindex,follow` metadata; clean `/work` remains indexable.
- Case-study links stay off until `storyPublicationState === "approved"` and Step 38 enables story routes (`workStoriesImplemented` is currently false).
- Homepage selected-work and service related-work use the public selector; they no longer treat every slug as a story URL.

## Adapter note

Repository content backs selectors until admin steps **A09–A10** switch to MongoDB published revisions. A database outage must not fall back to draft repository records.

## Checks

Recorded in `docs/progress.md` after the commands for this step.

## Next

Step 38 — reusable project case-study template at `/work/[slug]`.
