# Homepage Step 20 — Hero scenario interactions

**Branch:** `feature/20-hero-interactions`  
**Status:** Implemented

## What changed

| File                                                   | Role                                                         |
| ------------------------------------------------------ | ------------------------------------------------------------ |
| `src/content/home.ts`                                  | Three scenarios: Sell online, Run operations, Automate tasks |
| `src/server/home.ts`                                   | Passes full scenario list + optional service link map        |
| `src/components/sections/hero-scenario-panel.tsx`      | Client selector (`aria-pressed`) + visual                    |
| `src/components/sections/home-hero.tsx`                | Wires panel; noscript summaries for other examples           |
| `src/components/sections/business-workflow-visual.tsx` | Stable `idPrefix` for caption ids                            |
| `docs/homepage/step-20.md`                             | This note                                                    |

## Behaviour

- Headline and primary/secondary CTAs stay server-rendered and do not change on scenario switch.
- Three ordinary buttons with `aria-pressed`; no tab roles. Selected state uses inset ring as well as colour.
- Selector mounts only after hydration (`ready`) so non-JS users do not see dead controls.
- Default Sell online example is visible before hydration.
- Short `aria-live="polite"` status announces the selected example title.
- Related service links appear only when that service route is `implemented` (none today).
- `<noscript>` lists the other two scenario summaries (hidden when JS runs).

## Content readiness

Unchanged from Step 19: hero copy remains **draft**, so public `/` still shows the honest starter. Review the interactive panel on `/dev/ui`.

## Checks

Recorded in `docs/progress.md` after the commands for this step.

## Next

Step 22 — featured / selected-work section.
