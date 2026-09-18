# Pages Step 40 — About Zatroz

**Branch:** `feature/40-about-page` (from `feature/39-initial-case-studies`)  
**Status:** Implemented (route live; **page copy draft** — public body sparse)

## What changed

| File                                     | Role                       |
| ---------------------------------------- | -------------------------- |
| `src/content/about.ts`                   | Draft About page record    |
| `src/server/about.ts`                    | Public + gallery selectors |
| `src/app/about/page.tsx`                 | Thin route                 |
| `src/components/sections/about-page.tsx` | Page composition           |
| `src/components/dev/about-specimen.tsx`  | Gallery draft preview      |
| `src/config/routes.ts`                   | `about.implemented: true`  |
| `docs/content/about-evidence.md`         | Fact / approval audit      |
| `docs/pages/step-40.md`                  | This note                  |

## Behaviour

- `/about` is implemented and linked from nav when destinations are implemented.
- While `aboutPageRecord.publicationState` is **draft**, the public page shows an honest sparse placeholder (no unpublished mission/vision/values body).
- Full draft (including proposed mission/vision) is reviewable on `/dev/ui`.
- Founder cards render only from **approved** founder records — currently **0**.
- Evidence uses public project selectors — currently **0** cards; links to Work when available.
- Optional collaboration illustration **not acquired**; text-first layout used.
- Enquiry CTA uses shared resolver (Contact / confirmed email / WhatsApp / home invitation when ready).

## Content readiness

| Item                    | State                               |
| ----------------------- | ----------------------------------- |
| Page implementation     | Done                                |
| About page copy         | Draft                               |
| Mission / vision        | Draft (gallery only until approved) |
| Founder profiles        | Missing / not approved              |
| Project evidence        | Empty                               |
| Decorative illustration | Not acquired                        |

## Checks

- `npm run validate:content` — passed (17 readiness warnings including `draft-about-page`)
- `npm run check` — passed
- `npm run build` — passed (Next.js 16.3.5)
- Production smoke port **3040**: `/about` 200 sparse; `/` links About; `/work` 200; `/dev/ui` 404
- Gallery keyboard/viewport review — **not run**

## Next

Step 41 — Process / How We Work page.
