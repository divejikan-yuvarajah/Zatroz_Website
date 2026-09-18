# Homepage Step 22 — Selected work / featured projects

**Branch:** `feature/22-selected-work`  
**Status:** Implemented

## What changed

| File                                                 | Role                                                          |
| ---------------------------------------------------- | ------------------------------------------------------------- |
| `src/content/home.ts`                                | `homeSelectedWorkRecord` + ordered `featuredProjectIds`       |
| `src/content/catalog.ts`                             | Exposes `featuredProjectIds` for validation                   |
| `src/lib/content-validate.ts`                        | Rejects missing/duplicate/draft featured refs                 |
| `src/server/home.ts`                                 | Public/gallery selected-work projections; composition gate    |
| `src/components/sections/project-feature.tsx`        | Reusable feature (status, problem, contribution, result)      |
| `src/components/sections/home-featured-work.tsx`     | Section layouts for 1 / 2 / 3 features                        |
| `src/components/dev/home-selected-work-specimen.tsx` | Gallery cases including text-led and nonlinked                |
| `public/images/projects/specimen-ui-frame.svg`       | Gallery-only specimen illustration (not a product screenshot) |
| `src/app/page.tsx`                                   | Renders selected work only when projection exists             |
| `docs/homepage/step-22.md`                           | This note                                                     |

## Behaviour

- Public section renders only when `featuredProjectIds` resolve to at least one **approved** project.
- Layout: one lead feature; two equal editorial features; or one lead + two secondary when three exist. No empty grid slots.
- Work-status badge uses Client work / Live product / Prototype / Research concept.
- Media uses `next/image` with width/height and responsive `sizes`; SVGs use `unoptimized`. No eager preload. Missing media → text-led feature.
- Story link prefers a ready `/work/[slug]` route; otherwise an approved public link label; otherwise a nonlinked feature (no fake “Read story”).
- Composition sets `selected-work` so hero “explore work” can fall back to `#selected-work` when the section actually renders.
- Gallery fixtures are labelled specimens and are never public portfolio evidence.

## Content readiness

| Item                     | State                                    |
| ------------------------ | ---------------------------------------- |
| Project records          | Empty (C-HOME-03 / C-WORK gap)           |
| `featuredProjectIds`     | Empty                                    |
| Public `/` selected-work | Omitted until approved featured projects |

## Checks

Recorded in `docs/progress.md` after the commands for this step.

## Next

Step 23 — business-needs service explorer.
