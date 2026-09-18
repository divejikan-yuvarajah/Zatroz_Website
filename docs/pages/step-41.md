# Pages Step 41 — Process / How We Work

**Branch:** `feature/41-process-page` (from `feature/40-about-page`)  
**Status:** Implemented (route live; **page copy draft** — public body sparse)

## What changed

| File                                       | Role                                              |
| ------------------------------------------ | ------------------------------------------------- |
| `src/content/process-page.ts`              | Draft six-stage Process page record + FAQs        |
| `src/content/process.ts`                   | Homepage summary vocabulary aligned (Understand…) |
| `src/server/process.ts`                    | Public + gallery selectors                        |
| `src/app/process/page.tsx`                 | Thin route                                        |
| `src/components/sections/process-page.tsx` | Page composition (ordered list stages)            |
| `src/components/dev/process-specimen.tsx`  | Gallery draft preview                             |
| `src/config/routes.ts`                     | `process.implemented: true`                       |
| `docs/pages/step-41.md`                    | This note                                         |

## Behaviour

- `/process` is implemented and linked from nav.
- While `processPageRecord.publicationState` is **draft**, the public page shows an honest sparse placeholder.
- Full draft (stages, collaboration, prepare checklist, FAQs) is reviewable on `/dev/ui`.
- Stages use a semantic ordered list — all six readable without accordions or animation.
- No optional raster illustration acquired; text-first layout.
- Enquiry CTA uses shared resolver; Work secondary link when Work is implemented.
- Homepage process section (still draft) now uses aligned labels and can link “See our process” when the home section is approved.

## Content readiness

| Item                         | State                                   |
| ---------------------------- | --------------------------------------- |
| Page implementation          | Done                                    |
| Process page copy            | Draft                                   |
| Homepage process summary     | Draft (4-step summary)                  |
| Timelines / support promises | Conditional — not claimed as guarantees |
| Decorative illustration      | Not acquired                            |

## Checks

- `npm run validate:content` — passed (17 readiness warnings including `draft-process-page`)
- `npm run check` — passed
- `npm run build` — passed (Next.js 16.3.5)
- Production smoke port **3041**: `/process` 200 sparse; `/` links Process; `/about` 200; `/dev/ui` 404
- Gallery keyboard/viewport review — **not run**

## Next

Step 42 — Contact page layout and channels.
