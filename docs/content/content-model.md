# Content model

**Step:** 18  
**Status:** Typed repository content structure in place. Launch pages are not built yet.

`approved` is a **founder / content-owner decision**. A successful build does not approve content. Route `implemented` is a third, separate concern: a record can be approved and still unlinked until its `page.tsx` exists.

---

## Three readiness axes

| Axis               | Meaning                                                                      | Example                                   |
| ------------------ | ---------------------------------------------------------------------------- | ----------------------------------------- |
| `publicationState` | draft / approved / archived                                                  | Service copy approved for the public site |
| `workStatus`       | Project nature only (client-work, live-product, prototype, research-concept) | Prototype story that is still publishable |
| `implemented`      | Route registry flag on `src/config/routes.ts`                                | `/services` page file exists and is ready |

**Published content** ≠ **linkable content**. Selectors:

- `getPublishedServices()` — approved records (may lack a page).
- `getLinkableServices()` — approved **and** route implemented. Use this for live links.

The same idea applies to projects (`getPublishedProjects` / `getLinkableProjects`).

---

## File map

| Path                                | Holds                                               |
| ----------------------------------- | --------------------------------------------------- |
| `src/types/content.ts`              | Shared unions (`PublicationState`, service slugs)   |
| `src/content/site.ts`               | Brand name, draft blurb, CTA labels, contact        |
| `src/content/navigation.ts`         | Nav labels + `routeId` order (no duplicated URLs)   |
| `src/content/services.ts`           | Exactly six service records                         |
| `src/content/home.ts`               | Homepage hero, scenarios, selected-work feature IDs |
| `src/content/business-needs.ts`     | Four homepage business needs + explorer framing     |
| `src/content/automation-example.ts` | Charcoal automation illustration (draft)            |
| `src/content/projects.ts`           | Project stories (empty until verified)              |
| `src/content/founders.ts`           | Founder profiles (empty until approved)             |
| `src/content/faqs.ts`               | Draft enquiry FAQs                                  |
| `src/content/evidence.ts`           | Homepage proof items + intro (empty / draft)        |
| `src/content/media.ts`              | Public media records (empty until assets exist)     |
| `src/content/catalog.ts`            | Aggregate for validation + server access            |
| `src/config/routes.ts`              | Canonical paths + `implemented`                     |
| `src/config/navigation.ts`          | Public nav projections for header/footer/gallery    |
| `src/config/brand.ts`               | Public contact helpers (reads `site.ts`)            |
| `src/server/content.ts`             | `server-only` selectors / public projections        |
| `src/lib/content-validate.ts`       | Pure validator                                      |

Do **not** import `src/content/catalog.ts` or draft collections into Client Components. Header/footer Server Components call `@/server/content`. Client nav receives serializable props only.

---

## Current seed state (honest)

| Domain   | Count | Publication            | Notes                                        |
| -------- | ----- | ---------------------- | -------------------------------------------- |
| Services | 6     | All `draft`            | Conservative summaries; capacity unconfirmed |
| Projects | 0     | —                      | Documented gap; no fiction                   |
| Founders | 0     | —                      | Divejikan named in docs only; no card yet    |
| FAQs     | 3     | All `draft`            | No prices, SLAs, or ownership promises       |
| Evidence | 0     | Intro `draft`          | C-HOME-02 gap; public strip omitted          |
| Needs    | 4     | All `draft`            | Explorer framing draft; public strip omitted |
| Media    | 0     | —                      | No approved public assets in repo            |
| Contact  | —     | Channels `unconfirmed` | Live footer omits links                      |

The sparse marketing chrome (Home-only header/footer links) is **not launch-ready**. Launch still needs implemented routes, confirmed contacts, approved copy, and enough verified work/founder material.

---

## Service slugs (canonical)

`websites-ecommerce` · `web-mobile-apps` · `business-systems` · `ai-automation` · `custom-software` · `ui-ux-design`
