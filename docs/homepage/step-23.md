# Homepage Step 23 — Business-needs service explorer

**Branch:** `feature/23-service-explorer`  
**Status:** Implemented

## What changed

| File                                                    | Role                                                    |
| ------------------------------------------------------- | ------------------------------------------------------- |
| `src/content/business-needs.ts`                         | Four draft needs + explorer framing                     |
| `src/content/catalog.ts`                                | Includes business needs for validation                  |
| `src/lib/content-validate.ts`                           | Rejects broken service/project refs and invalid primary |
| `src/server/home.ts`                                    | Public/gallery explorer projections; composition gate   |
| `src/components/sections/service-explorer-panel.tsx`    | Client disclosure (`aria-expanded` / `aria-controls`)   |
| `src/components/sections/home-service-explorer.tsx`     | Section shell + noscript fallback                       |
| `src/components/dev/home-service-explorer-specimen.tsx` | Gallery specimens                                       |
| `src/app/page.tsx`                                      | Renders explorer only when public projection exists     |
| `docs/homepage/step-23.md`                              | This note                                               |

## Behaviour

- Four numbered need rows; one open detail at a time; activating the open trigger collapses it.
- Mobile: detail sits under its trigger. Desktop: open panel moves to the right column via CSS grid (`contents`) — single widget, one selection state.
- Open state uses left border + muted background + “Open” label (not colour alone).
- Before hydration: static need list + default detail. `<noscript>` lists all four needs.
- Service titles/summaries resolved from service records; links only when the route is `implemented`.
- Enquiry `?service=<slug>` only when Contact is ready; otherwise omit or use confirmed email fallback.
- Public `/` omits the section while explorer framing and needs remain draft.

## Content readiness

| Item                | State                  |
| ------------------- | ---------------------- |
| Explorer framing    | Draft                  |
| Four business needs | Draft (C-HOME-04)      |
| Public `/` explorer | Omitted until approved |

## Checks

Recorded in `docs/progress.md` after the commands for this step.

## Next

Step 25 — delivery process section.
