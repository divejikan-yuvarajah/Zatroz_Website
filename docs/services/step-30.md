# Services Step 30 — Reusable service detail template

**Branch:** `feature/30-service-template` (from `feature/29-services-overview`)  
**Status:** Implemented (infrastructure only)

## What changed

| File                                              | Role                                            |
| ------------------------------------------------- | ----------------------------------------------- |
| `src/content/service-detail.ts`                   | Detail content contract types                   |
| `src/content/services.ts`                         | `detail: null` on all six services              |
| `src/server/service-detail.ts`                    | Eligibility, public selector, gallery specimens |
| `src/components/sections/service-detail-page.tsx` | Shared detail template                          |
| `src/app/services/[slug]/page.tsx`                | Dynamic route + metadata + static params        |
| `src/components/dev/service-detail-specimen.tsx`  | Gallery fixtures                                |
| `src/app/dev/ui/page.tsx`                         | Gallery section                                 |
| `src/lib/content-validate.ts`                     | Detail field / reference validation             |
| `docs/services/template.md`                       | Schema, routing, enablement process             |
| `docs/services/step-30.md`                        | This note                                       |

## Behaviour

- Unknown, draft, archived, incomplete, or unimplemented slugs → `notFound()`.
- `generateStaticParams` returns an empty list until a detail is eligible (valid).
- Metadata uses the same selector as the page — no draft leak.
- Overview approval, detail approval, and route `implemented` stay separate.
- Six detail routes remain `implemented: false`; no service-specific public copy yet.

## Content readiness

| Item               | State             |
| ------------------ | ----------------- |
| Detail template    | Ready             |
| Detail records     | All `null`        |
| Public detail URLs | Unavailable (404) |
| Gallery specimens  | Present           |

## Checks

Recorded in `docs/progress.md` after the commands for this step.

## Next

Step 31 — Websites and E-commerce detail page (`/services/websites-ecommerce`).
