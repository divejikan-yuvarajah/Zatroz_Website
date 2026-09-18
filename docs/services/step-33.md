# Services Step 33 — Business Systems

**Branch:** `feature/33-business-systems` (from `feature/32-web-mobile-apps`)  
**Status:** Implemented (draft content; public route gated)

## What changed

| File                                                | Role                                       |
| --------------------------------------------------- | ------------------------------------------ |
| `src/content/service-detail-business-systems.ts`    | Full draft detail copy                     |
| `src/content/services.ts`                           | Wires detail onto `svc-business-systems`   |
| `src/content/faqs.ts`                               | Six draft business-system FAQs             |
| `src/config/routes.ts`                              | `businessSystems.implemented: true`        |
| `src/components/sections/business-ops-panel.tsx`    | Sales / Inventory / Reporting sample panel |
| `src/components/sections/service-browser-frame.tsx` | Ops-summary hero strip                     |
| `src/components/sections/service-detail-page.tsx`   | Renders new hero/example variants          |
| `src/components/dev/business-systems-specimen.tsx`  | Gallery draft preview                      |
| `docs/services/step-33.md`                          | This note                                  |
| `docs/services/readiness.md`                        | Pack readiness matrix                      |

## Behaviour

- Public `/services/business-systems` returns **404** while overview and detail stay draft.
- Route flag is implemented; shared eligibility keeps nav/overview from linking drafts.
- Enquiry CTA label: **Discuss your business system**; slug `business-systems` when Contact is ready.
- Ops panel uses fictional consistent quantities — no POS, MongoDB, payment, print, or hardware access.
- Related work omitted (no approved relevant projects). Related Custom Software and AI/Automation show in gallery without public links.

## Content readiness

| Item              | State                            |
| ----------------- | -------------------------------- |
| Detail copy       | Draft                            |
| Overview summary  | Draft                            |
| Service FAQs      | Draft                            |
| Delivery capacity | Still needs founder confirmation |
| Public URL        | Unavailable until approved       |

## Checks

Recorded in `docs/progress.md` after the commands for this step. Smoke includes prior two detail slugs through the shared template.

## Next

Step 34 — AI and Automation detail page. Stop here for this pack segment.
