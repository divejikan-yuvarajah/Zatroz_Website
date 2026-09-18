# Services Step 36 — UI/UX Design

**Branch:** `feature/36-ui-ux-design` (from `feature/35-custom-software`)  
**Status:** Implemented (draft content; public route gated)

## What changed

| File                                                    | Role                                    |
| ------------------------------------------------------- | --------------------------------------- |
| `src/content/service-detail-ui-ux-design.ts`            | Full draft detail copy                  |
| `src/content/services.ts`                               | Wires detail onto `svc-ui-ux-design`    |
| `src/content/faqs.ts`                                   | Six draft UI/UX FAQs                    |
| `src/config/routes.ts`                                  | `uiUxDesign.implemented: true`          |
| `src/components/sections/ui-ux-form-states-example.tsx` | Enquiry flow + form states illustration |
| `src/components/sections/service-browser-frame.tsx`     | Wireframe-stack hero strip              |
| `src/components/sections/service-detail-page.tsx`       | Renders new hero/example variants       |
| `src/components/dev/ui-ux-design-specimen.tsx`          | Gallery draft preview                   |
| `docs/services/step-36.md`                              | This note                               |
| `docs/content/image-register.md`                        | Pending optional hero raster brief      |
| `docs/services/readiness.md`                            | Six-service matrix updated              |

## Behaviour

- Public `/services/ui-ux-design` returns **404** while overview and detail stay draft.
- Route flag is implemented; shared eligibility keeps nav/overview from linking drafts.
- Enquiry CTA label: **Discuss a design engagement**; slug `ui-ux-design` when Contact is ready.
- Form-state example is static HTML — nothing is submitted. Focus style is demonstrated on a sample primary control.
- Optional raster hero recorded as not acquired; HTML illustration is primary.
- Related work omitted. Related Websites and Web/Mobile show in gallery without public links when not eligible.
- Six-service consistency: all six detail drafts use the shared template; canonical slugs unchanged.

## Content readiness

| Item                 | State                            |
| -------------------- | -------------------------------- |
| Detail copy          | Draft                            |
| Overview summary     | Draft                            |
| Service FAQs         | Draft                            |
| Delivery capacity    | Still needs founder confirmation |
| Optional hero raster | Not acquired                     |
| Public URL           | Unavailable until approved       |

## Checks

Recorded in `docs/progress.md` after the commands for this step.

## Next

Step 37 — Work page, project cards, and public selectors.
