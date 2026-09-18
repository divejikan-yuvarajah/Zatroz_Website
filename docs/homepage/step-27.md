# Homepage Step 27 — Feedback and FAQs

**Branch:** `feature/27-home-faq` (from `feature/26-home-team`)  
**Status:** Implemented

## What changed

| File                                                | Role                                                     |
| --------------------------------------------------- | -------------------------------------------------------- |
| `src/content/faqs.ts`                               | Six draft enquiry FAQs (conditional answers)             |
| `src/content/feedback.ts`                           | Empty feedback collection (no invented quotes)           |
| `src/content/home-questions.ts`                     | Draft section framing + public projection types          |
| `src/content/catalog.ts`                            | Includes feedback + questions framing                    |
| `src/lib/content-validate.ts`                       | Feedback rules + draft-home-questions warning            |
| `src/server/home.ts`                                | Public/gallery projections; `questions` composition gate |
| `src/components/ui/faq-disclosure.tsx`              | Reusable native details/summary FAQ row                  |
| `src/components/sections/home-feedback-faq.tsx`     | Editorial section (quote optional; multi-open FAQs)      |
| `src/components/dev/home-feedback-faq-specimen.tsx` | Gallery fixtures (labelled specimens)                    |
| `docs/homepage/step-27.md`                          | This note                                                |

## Behaviour

- Public section renders only when framing is `approved` **and** at least one approved FAQ or feedback item exists.
- FAQs use native `<details>` / `<summary>` via `FaqDisclosure` — multiple open, no JS required.
- Approved testimonial (when present): one quote with attribution; no stars, stock faces, or carousels.
- Approved project lesson (when present): labelled “Zatroz lesson”, not customer endorsement.
- No approved feedback → quote area omitted (no empty chrome).
- CTA “Ask us about your project” only when contact route, confirmed email, or confirmed WhatsApp is usable.
- Public `/` omits the section while framing and FAQ/feedback stay draft/empty.

## Content readiness

| Item                   | State                                                    |
| ---------------------- | -------------------------------------------------------- |
| Section framing        | Draft (C-HOME-07)                                        |
| FAQ records            | Six draft answers — no prices, SLAs, or legal guarantees |
| Testimonials / lessons | Empty                                                    |
| Public `/` FAQ section | Omitted until framing + approved content                 |

## Checks

Recorded in `docs/progress.md` after the commands for this step.

## Next

Step 28 — final enquiry CTA and homepage integration review.
