# Homepage Step 26 — Team and company introduction

**Branch:** `feature/26-home-team` (from `feature/25-home-process`)  
**Status:** Implemented

## What changed

| File                                        | Role                                                     |
| ------------------------------------------- | -------------------------------------------------------- |
| `src/content/people.ts`                     | Draft company intro + working principles                 |
| `src/content/catalog.ts`                    | Includes people record for validation                    |
| `src/lib/content-validate.ts`               | Approved people fields + team photo media ref            |
| `src/server/home.ts`                        | Public/gallery projections; `people` composition gate    |
| `src/components/sections/home-team.tsx`     | Editorial section (text-led / profiles / team photo)     |
| `src/components/dev/home-team-specimen.tsx` | Gallery fixtures (labelled specimens, not real founders) |
| `docs/homepage/step-26.md`                  | This note                                                |

## Behaviour

- Public section renders only when the people record is `approved` (company story). Founder cards and team photo are optional extras from approved records.
- Layout: `team-photo` when an approved group image exists; else `profiles` when approved founders exist; else `text-led`.
- No silhouettes, Person 2 placeholders, invented names, or fake headcount.
- Working principles are proposals (clear scope, visible progress, careful handover) until founders confirm.
- CTA prefers ready `/about` (“Meet Zatroz”), else contact/email; never a self-link to `#people`.
- Public `/` omits the section while copy stays draft. Founder collection remains empty.

## Content readiness

| Item                       | State                                    |
| -------------------------- | ---------------------------------------- |
| Company intro / principles | Draft (C-HOME-06)                        |
| Founder cards              | Empty — Divejikan not approved as a card |
| Team / portrait media      | Missing                                  |
| Public `/` people section  | Omitted until approved                   |

## Checks

Recorded in `docs/progress.md` after the commands for this step.

## Next

Step 28 — final enquiry CTA and homepage integration review.
