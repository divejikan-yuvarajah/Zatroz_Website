# Services Step 29 — Services overview

**Branch:** `feature/29-services-overview` (from `feature/28-home-cta`)  
**Status:** Implemented

## What changed

| File                                                | Role                                           |
| --------------------------------------------------- | ---------------------------------------------- |
| `src/app/services/page.tsx`                         | Thin `/services` route + metadata              |
| `src/content/services-overview.ts`                  | Draft overview framing + not-sure guide        |
| `src/content/services.ts`                           | Draft whoItSuits + deliverables for six groups |
| `src/server/services.ts`                            | Public / gallery projections + enquiry CTAs    |
| `src/components/sections/services-overview.tsx`     | Overview composition                           |
| `src/components/sections/service-mark.tsx`          | Lightweight decorative SVG marks               |
| `src/components/ui/page-breadcrumb.tsx`             | Shared breadcrumb                              |
| `src/components/dev/services-overview-specimen.tsx` | Gallery specimen                               |
| `src/config/routes.ts`                              | `services.implemented: true`                   |
| `docs/services/step-29.md`                          | This note                                      |

## Behaviour

- Public `/services` never leaks draft marketing copy. With draft framing and draft services, it shows an honest sparse placeholder.
- Gallery shows all six proposed rows with specimen labels.
- Need shortcuts and not-sure guide appear when framing is approved (gallery uses draft framing).
- Detail links only when the matching service route is implemented; otherwise enquiry fallback (`/contact?service=`, email, WhatsApp, or `/#start-a-project`).
- Six detail routes remain `implemented: false`.
- Header/footer can link to `/services` now that the overview route is public-ready (no draft leak).

## Content readiness

| Item                  | State                                |
| --------------------- | ------------------------------------ |
| Overview framing      | Draft                                |
| Six service summaries | Draft (enriched for overview review) |
| Business needs        | Draft                                |
| Delivery blurb        | Draft                                |
| Related work          | Empty                                |
| Detail service pages  | Not built (Step 30+)                 |

## Checks

Recorded in `docs/progress.md` after the commands for this step.

## Next

Step 30 — reusable service detail template and routing.
