# Services Step 35 — Custom Software

**Branch:** `feature/35-custom-software` (from `feature/34-ai-automation`)  
**Status:** Implemented (draft content; public route gated)

## What changed

| File                                                | Role                                    |
| --------------------------------------------------- | --------------------------------------- |
| `src/content/service-detail-custom-software.ts`     | Full draft detail copy                  |
| `src/content/services.ts`                           | Wires detail onto `svc-custom-software` |
| `src/content/faqs.ts`                               | Six draft custom-software FAQs          |
| `src/config/routes.ts`                              | `customSoftware.implemented: true`      |
| `src/components/sections/custom-software-guide.tsx` | Decision guide + system map             |
| `src/components/sections/service-browser-frame.tsx` | Modules-link hero strip                 |
| `src/components/sections/service-detail-page.tsx`   | Renders new hero/example variants       |
| `src/components/dev/custom-software-specimen.tsx`   | Gallery draft preview                   |
| `docs/services/step-35.md`                          | This note                               |
| `docs/content/image-register.md`                    | Pending optional hero raster brief      |
| `docs/services/readiness.md`                        | Matrix updated                          |

## Behaviour

- Public `/services/custom-software` returns **404** while overview and detail stay draft.
- Route flag is implemented; shared eligibility keeps nav/overview from linking drafts.
- Enquiry CTA label: **Discuss a custom software scope**; slug `custom-software` when Contact is ready.
- Decision guide uses a real table (desktop) and labelled stacked rows (mobile). System map is HTML only — no live APIs or vendor logos.
- Optional raster hero recorded as not acquired; HTML illustration is primary.
- Related work omitted. Related Web/Mobile, Business Systems, and AI/Automation show in gallery without public links when not eligible.

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

Step 36 — UI/UX Design detail page.
