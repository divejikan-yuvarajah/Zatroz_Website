# Service detail template

**Branch:** `feature/30-service-template`  
**Status:** Infrastructure ready — no public detail pages yet

## Route strategy

| Choice          | Decision                                                               |
| --------------- | ---------------------------------------------------------------------- |
| Pattern         | Dynamic `src/app/services/[slug]/page.tsx` for all six canonical slugs |
| Why             | One shared template; avoids six near-identical route files             |
| Params          | Awaited `Promise<{ slug }>` (Next.js 16 App Router)                    |
| Static params   | `generateStaticParams()` from `getEligibleServiceDetailSlugs()`        |
| Empty set       | Valid at Step 30 — no fake published content                           |
| Unknown / draft | `notFound()` before any service copy; no `?preview=` bypass            |

Do **not** add parallel explicit routes (`/services/websites-ecommerce/page.tsx`) while the dynamic segment exists.

## Eligibility (one selector)

Public detail, metadata, and static params all use `isPublicServiceDetailEligible` / `getPublicServiceDetail` in `src/server/service-detail.ts`:

1. Service overview `publicationState === "approved"`
2. `detail` present and `detail.publicationState === "approved"`
3. Matching `publicRoutes[routeId].implemented === true`
4. Required detail fields complete (hero, intro, CTA label, audience, deliverables, inputs, boundaries, page title/description)

Draft, archived, incomplete, or unimplemented details never appear in HTML or metadata.

## Content schema

Typed on `ServiceRecord.detail: ServiceDetailRecord | null` (`src/content/service-detail.ts`).

| Field                                          | Renders as                            |
| ---------------------------------------------- | ------------------------------------- |
| `heroTitle`, `introduction`, `primaryCtaLabel` | Hero + enquiry CTA                    |
| `audienceItems`, `problemItems`                | Who it suits                          |
| `scopeOptions`                                 | Scope options (not packages)          |
| `deliverableGroups`                            | What you may receive                  |
| `illustrativeExample`                          | Optional labelled example             |
| `relatedProjectIds`                            | Related work (approved projects only) |
| `deliveryStages`                               | How delivery usually works            |
| `clientInputs`                                 | What we need from you                 |
| `boundaries`, `recurringCostNotes`             | Boundaries and ongoing costs          |
| `faqIds`                                       | Questions (approved FAQs only)        |
| `relatedServiceIds`                            | Related services                      |
| `pageTitle`, `pageDescription`                 | Metadata                              |

No raw HTML, JSX, or executable strings in content records.

## Enabling a service detail page

1. Write complete detail copy on the service record (`detail: { … }`).
2. Keep `detail.publicationState: "draft"` until founders approve.
3. Ensure overview summary is also approved.
4. Flip the matching route in `src/config/routes.ts` to `implemented: true` when the public URL should resolve (Steps 31–36 populate copy; set implemented when that service is ready to publish).
5. Run `npm run validate:content` — approved details must pass field and reference checks.
6. Confirm `/services/[slug]` returns 200 with approved copy; unknown/draft slugs stay 404.

At Step 30 all six detail routes remain `implemented: false` and all `detail` fields are `null`.

## Template

`ServiceDetailPage` (`src/components/sections/service-detail-page.tsx`) is server-rendered. Optional sections omit empty headings. Gallery specimens use `headingLevel={2}` and unique `idPrefix` values.

Enquiry CTAs use `resolveServicesEnquiryCta` (Contact `?service=`, email, WhatsApp, or `/#start-a-project` when the homepage invitation is public).

## Gallery

`/dev/ui` → Service detail template: complete, minimal, long-copy, missing-optional, and no-CTA specimens. Fixtures are excluded from public routes.
