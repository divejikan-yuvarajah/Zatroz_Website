# Work Step 38 — Reusable project case-study template

**Branch:** `feature/38-case-study` (from `feature/37-work-page`)  
**Status:** Implemented (template ready; **0** published stories)

## What changed

| File                                         | Role                                               |
| -------------------------------------------- | -------------------------------------------------- |
| `src/content/projects.ts`                    | `ProjectStoryRecord` + controlled blocks; limits   |
| `src/lib/public-case-study.ts`               | Pure case-study projection                         |
| `src/server/public-projects.ts`              | `getPublishedCaseStudyBySlug`; story links enabled |
| `src/app/work/[slug]/page.tsx`               | Dynamic story route (`notFound` when ineligible)   |
| `src/components/sections/case-study-*.tsx`   | Hero, facts, sections, gallery, page               |
| `src/components/dev/case-study-specimen.tsx` | Short + long gallery fixtures                      |
| `scripts/test-public-case-studies.ts`        | Focused eligibility / DTO tests                    |
| `docs/work/step-38.md`                       | This note                                          |
| `docs/architecture/admin-content-plan.md`    | Story selector + cache notes                       |

## Behaviour

- `/work/[slug]` returns **404** for unknown, archived, draft story, or summary-only projects.
- Public stories require approved project summary **and** approved story body.
- `workStoriesImplemented` follows `publicRoutes.work.implemented` so cards can offer “Read case study” when a story is approved.
- `generateStaticParams` prerenders known slugs only as an optimization; it is **not** a permanent allowlist (`dynamicParams` remains default true for future admin slugs).
- Review notes and draft media never enter public DTOs.
- No fabricated launch stories were added — catalog stories remain empty until Step 39.

## Screenshot requests (when real stories arrive)

For each approved story, supply redacted exports with: screen/state, purpose, suggested crop, minimum readable resolution, and confirmation that credentials/PII are removed. Register provenance in `docs/content/image-register.md`.

## A09–A11 note

MongoDB publication must resolve new slugs without a rebuild and refresh listing/featured/related/metadata. Repository adapter remains until that switch; database failure must not fall back to draft repository content.

## Checks

Recorded in `docs/progress.md` after the commands for this step.

## Next

Step 39 — initial project stories, screenshots, and evidence review (editorial; no inventing clients).
