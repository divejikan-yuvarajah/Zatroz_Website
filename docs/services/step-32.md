# Services Step 32 — Web and Mobile Applications

**Branch:** `feature/32-web-mobile-apps` (from `feature/31-websites-ecommerce`)  
**Status:** Implemented (draft content; public route gated)

## What changed

| File                                                     | Role                                    |
| -------------------------------------------------------- | --------------------------------------- |
| `src/content/service-detail-web-mobile-apps.ts`          | Full draft detail copy                  |
| `src/content/services.ts`                                | Wires detail onto `svc-web-mobile-apps` |
| `src/content/faqs.ts`                                    | Five draft application FAQs             |
| `src/config/routes.ts`                                   | `webMobileApps.implemented: true`       |
| `src/components/sections/service-browser-frame.tsx`      | Phone frame + device-pair hero          |
| `src/components/sections/web-mobile-task-comparison.tsx` | Browser vs phone task illustration      |
| `src/components/sections/service-detail-page.tsx`        | Renders new hero/example variants       |
| `src/components/dev/web-mobile-apps-specimen.tsx`        | Gallery draft preview                   |
| `docs/services/step-32.md`                               | This note                               |

## Behaviour

- Public `/services/web-mobile-apps` returns **404** while overview and detail stay draft.
- Route flag is implemented; nav/overview/explorer only link when the detail is publicly eligible.
- Enquiry CTA label: **Discuss your application**; slug `web-mobile-apps` when Contact is ready.
- Illustration is sample-labelled HTML — no signup, login, credentials, notifications, or submitted booking.
- Related work omitted (no approved relevant projects). Related Websites/E-commerce, UI/UX, and Custom Software appear in the gallery preview without public links (those pages are not publicly eligible yet).

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

Step 33 — Business Systems detail page.
