# Services Step 31 — Websites and E-commerce

**Branch:** `feature/31-websites-ecommerce` (from `feature/30-service-template`)  
**Status:** Implemented (draft content; public route gated)

## What changed

| File                                                        | Role                                       |
| ----------------------------------------------------------- | ------------------------------------------ |
| `src/content/service-detail-websites-ecommerce.ts`          | Full draft detail copy                     |
| `src/content/services.ts`                                   | Wires detail onto `svc-websites-ecommerce` |
| `src/content/faqs.ts`                                       | Five draft service FAQs                    |
| `src/config/routes.ts`                                      | `websitesEcommerce.implemented: true`      |
| `src/components/sections/service-browser-frame.tsx`         | Light browser chrome                       |
| `src/components/sections/websites-catalogue-comparison.tsx` | Website vs catalogue illustration          |
| `src/components/sections/service-detail-page.tsx`           | Renders hero visual + comparison           |
| `src/server/service-detail.ts`                              | Gallery draft preview helper               |
| `src/server/content.ts` / `services.ts` / `home.ts`         | Link only when detail is publicly eligible |
| `src/components/dev/websites-ecommerce-specimen.tsx`        | Gallery draft preview                      |
| `docs/services/step-31.md`                                  | This note                                  |

## Behaviour

- Public `/services/websites-ecommerce` returns **404** while overview and detail stay draft (eligibility unchanged).
- Route flag is implemented so the template/route is ready; nav, footer, overview, and explorer only link when the detail is publicly eligible.
- Enquiry CTA label: **Discuss your website**; slug `websites-ecommerce` when Contact is ready.
- Illustration is sample-labelled HTML — no cart, payment, or live order action.
- Related work omitted (no approved relevant projects). Related UI/UX and Custom Software show in the gallery preview without public links.

## Content readiness

| Item              | State                            |
| ----------------- | -------------------------------- |
| Detail copy       | Draft                            |
| Overview summary  | Draft                            |
| Service FAQs      | Draft                            |
| Delivery capacity | Still needs founder confirmation |
| Public URL        | Unavailable until approved       |

## Checks

Recorded in `docs/progress.md` after the commands for this step.

## Next

Step 32 — Web and Mobile Applications detail page.
