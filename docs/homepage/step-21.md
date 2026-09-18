# Homepage Step 21 — Credibility and evidence section

**Branch:** `feature/21-home-evidence`  
**Status:** Implemented

## What changed

| File                                            | Role                                                           |
| ----------------------------------------------- | -------------------------------------------------------------- |
| `src/content/evidence.ts`                       | Evidence records + intro; empty items, draft intro             |
| `src/content/catalog.ts`                        | Includes evidence in the validation catalog                    |
| `src/lib/content-validate.ts`                   | Validates approved evidence fields and href safety             |
| `src/server/home.ts`                            | Public/gallery evidence projections; composition gate          |
| `src/components/sections/home-evidence.tsx`     | Compact muted editorial strip (server)                         |
| `src/components/dev/home-evidence-specimen.tsx` | 0/1/2/3 + long-claim gallery fixtures                          |
| `src/app/page.tsx`                              | Renders evidence after hero only when public projection exists |
| `src/app/dev/ui/page.tsx`                       | Gallery specimen block                                         |
| `docs/homepage/step-21.md`                      | This note                                                      |

## Behaviour

- Public section renders only when at least one evidence item is `approved`, or the company intro is `approved`.
- With neither approved, the section is omitted entirely — no empty strip, no “proof coming soon”, no dead `#home-evidence` anchor.
- Public props never include `sourceReference` or other private verification notes.
- Links use exact approved https URLs or route-ready internal paths; unsafe schemes and unimplemented routes are omitted.
- Gallery specimens use clearly labelled fixtures only; they are not live catalog evidence.

## Content readiness

| Item                        | State                  |
| --------------------------- | ---------------------- |
| Evidence records            | Empty (C-HOME-02 gap)  |
| Evidence intro              | Draft                  |
| Public `/` evidence section | Omitted until approval |

## Checks

Recorded in `docs/progress.md` after the commands for this step.

## Next

Step 23 — business-needs service explorer.
