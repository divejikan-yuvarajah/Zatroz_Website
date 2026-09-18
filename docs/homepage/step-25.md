# Homepage Step 25 — Delivery process section

**Branch:** `feature/25-home-process`  
**Status:** Implemented

## What changed

| File                                           | Role                                            |
| ---------------------------------------------- | ----------------------------------------------- |
| `src/content/process.ts`                       | Draft four-step process + customer outputs      |
| `src/content/catalog.ts`                       | Includes process for validation                 |
| `src/lib/content-validate.ts`                  | Approved-field checks for process steps         |
| `src/server/home.ts`                           | Public/gallery projections; `#how-we-work` gate |
| `src/components/sections/home-process.tsx`     | Calm light section; all steps always visible    |
| `src/components/dev/home-process-specimen.tsx` | Gallery specimens                               |
| `docs/homepage/step-25.md`                     | This note                                       |

## Behaviour

- Editorial intro beside an ordered four-step timeline (stacks on mobile).
- Each step shows number, title, description, and “You leave with” customer output.
- No click-to-reveal, sticky storytelling, scroll progress, or counters.
- CTA prefers ready `/process`, else contact/email with a truthful label; never a self-link to `#how-we-work`.
- Hero `explore-work` may fall back to `#how-we-work` when that section renders and work/selected-work are unavailable.
- Public `/` omits the section while copy stays draft.

## Content readiness

| Item                     | State                  |
| ------------------------ | ---------------------- |
| Process copy             | Draft (C-HOME-05)      |
| Public `/` process block | Omitted until approved |

## Checks

Recorded in `docs/progress.md` after the commands for this step.

## Next

Step 26 — team and company introduction.
