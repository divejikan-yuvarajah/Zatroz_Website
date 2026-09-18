# Homepage Step 19 — Connected-business hero

**Branch:** `feature/19-home-hero`  
**Status:** Implemented (static hero; scenario switching is Step 20)

## What changed

| File                                                   | Role                                                            |
| ------------------------------------------------------ | --------------------------------------------------------------- |
| `src/content/home.ts`                                  | Draft hero copy + Sell online scenario (typed for Step 20)      |
| `src/server/home.ts`                                   | Composition flags, CTA resolver, public vs specimen projections |
| `src/components/sections/home-hero.tsx`                | Server-rendered hero section                                    |
| `src/components/sections/business-workflow-visual.tsx` | Three-stage illustrative workflow                               |
| `src/components/dev/home-hero-specimen.tsx`            | `/dev/ui` draft review (0/1/2 CTAs)                             |
| `src/app/page.tsx`                                     | Renders approved hero only; otherwise honest starter            |
| `docs/homepage/step-19.md`                             | This note                                                       |

## Content readiness

| Item                                        | Status                                    |
| ------------------------------------------- | ----------------------------------------- |
| Proposed headline / supporting copy         | **draft** — not on public `/`             |
| Sell online workflow                        | Draft scenario data; shown in gallery     |
| Primary CTA → `/contact`                    | Route not implemented; omitted publicly   |
| Email / WhatsApp fallbacks                  | Contact channels unconfirmed; omitted     |
| Secondary CTA → `/work` or `#selected-work` | Work route and section not ready; omitted |

To publish the hero on `/`, set `homeHeroRecord.publicationState` to `"approved"` after founder sign-off, and enable CTA destinations per the shared policy.

## Design notes

- Desktop: two columns — copy left, workflow right.
- Mobile: copy → actions (when present) → workflow.
- Content-based height; no full-viewport lock; no GSAP/client state.
- Decorative SVG connectors are `aria-hidden`; one figcaption explains the figure.

## Checks

Recorded in `docs/progress.md` after the commands for this step.

## Next

Step 20 — hero scenario interactions (Sell online / Run operations / Automate tasks).
