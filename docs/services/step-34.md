# Services Step 34 — AI and Automation

**Branch:** `feature/34-ai-automation` (from `feature/33-business-systems`)  
**Status:** Implemented (draft content; public route gated)

## What changed

| File                                                 | Role                                  |
| ---------------------------------------------------- | ------------------------------------- |
| `src/content/service-detail-ai-automation.ts`        | Full draft detail copy                |
| `src/content/services.ts`                            | Wires detail onto `svc-ai-automation` |
| `src/content/faqs.ts`                                | Six draft AI/automation FAQs          |
| `src/config/routes.ts`                               | `aiAutomation.implemented: true`      |
| `src/components/sections/ai-automation-workflow.tsx` | Labelled review workflow illustration |
| `src/components/sections/service-browser-frame.tsx`  | Review-workflow hero strip            |
| `src/components/sections/service-detail-page.tsx`    | Renders new hero/example variants     |
| `src/components/dev/ai-automation-specimen.tsx`      | Gallery draft preview                 |
| `docs/services/step-34.md`                           | This note                             |
| `docs/content/image-register.md`                     | Pending optional hero raster brief    |
| `docs/services/readiness.md`                         | Matrix updated                        |

## Behaviour

- Public `/services/ai-automation` returns **404** while overview and detail stay draft.
- Route flag is implemented; shared eligibility keeps nav/overview from linking drafts.
- Enquiry CTA label: **Discuss automation for your workflow**; slug `ai-automation` when Contact is ready.
- Illustration is semantic HTML — no chatbot, model SDK, upload, or automation runner.
- Optional raster hero (`ai-automation-workflow-hero-v1.webp`) recorded as not acquired; HTML workflow is the live illustration.
- Related work omitted. Related Business Systems and Custom Software appear in gallery without public links when those details are not publicly eligible.

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

Step 35 — Custom Software detail page.
