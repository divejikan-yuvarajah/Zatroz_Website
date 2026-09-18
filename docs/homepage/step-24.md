# Homepage Step 24 — Practical automation example

**Branch:** `feature/24-automation-example`  
**Status:** Implemented

## What changed

| File                                                      | Role                                                |
| --------------------------------------------------------- | --------------------------------------------------- |
| `src/content/automation-example.ts`                       | Draft charcoal example copy, stages, sample invoice |
| `src/content/catalog.ts`                                  | Includes automation example for validation          |
| `src/lib/content-validate.ts`                             | Approved-field + Needs review gate checks           |
| `src/server/home.ts`                                      | Public/gallery projections; composition gate        |
| `src/components/sections/automation-workflow-panel.tsx`   | Client walkthrough (manual Next / Reset only)       |
| `src/components/sections/home-automation-example.tsx`     | Charcoal section + noscript fallback                |
| `src/components/dev/home-automation-example-specimen.tsx` | Gallery specimens                                   |
| `docs/homepage/step-24.md`                                | This note                                           |

## Behaviour

- Full four-stage workflow is always visible (numbered text is the accessible meaning).
- Sample invoice is labelled Sample data; one field is Needs review; approval stage is human, not autonomous posting.
- Optional “Step through example” walkthrough: Next step / Reset only — no timers, uploads, fetch, OCR, or LLM.
- Completion: “Example complete — no document was processed.”
- CTA prefers ready AI/automation route, else `#services-explorer` when that section renders, else contact/email, else omitted.
- Public `/` omits the section while `publicationState` is draft.

## Content readiness

| Item                        | State                  |
| --------------------------- | ---------------------- |
| Automation example copy     | Draft                  |
| Public `/` automation block | Omitted until approved |

## Checks

Recorded in `docs/progress.md` after the commands for this step.

## Next

Step 25 — delivery process section.
