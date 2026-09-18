# Homepage Step 28 — Final enquiry invitation and integration review

**Branch:** `feature/28-home-cta` (from `feature/27-home-faq`)  
**Status:** Implemented

## What changed

| File                                             | Role                                                       |
| ------------------------------------------------ | ---------------------------------------------------------- |
| `src/content/home-final-cta.ts`                  | Draft invitation framing                                   |
| `src/content/catalog.ts`                         | Includes final CTA record                                  |
| `src/config/brand.ts`                            | Enquiry mailto with URL-encoded generic prefill            |
| `src/lib/content-validate.ts`                    | Draft final-CTA + no-usable-enquiry-action warnings        |
| `src/server/home.ts`                             | Final CTA projection; shared enquiry fallback; composition |
| `src/components/sections/home-final-cta.tsx`     | Warm-white editorial invitation                            |
| `src/components/dev/home-final-cta-specimen.tsx` | Gallery contact / email / WhatsApp / alternatives fixtures |
| `docs/homepage/homepage-review.md`               | Steps 19–28 integration matrix                             |
| `docs/homepage/step-28.md`                       | This note                                                  |

## Behaviour

- Public section renders only when framing is `approved` **and** a usable primary action exists (`/contact`, confirmed email, or confirmed WhatsApp).
- Never self-links to `#start-a-project`. Never enables `/contact` in the route registry.
- Earlier sections prefer `#start-a-project` for enquiry fallbacks when this section renders.
- Primary action is dominant; at most two quiet alternatives (work, secondary channel).
- Email/WhatsApp copy states that opening a channel does not submit a form or book a meeting.
- Public `/` currently omits the section (draft framing + unconfirmed channels + unimplemented contact).

## Launch blocker

**No usable enquiry action** until founders confirm email and/or WhatsApp, or `/contact` is implemented. Component and gallery specimens are complete.

## Checks

Recorded in `docs/progress.md` after the commands for this step.

## Next

Step 29 — Services overview page.
