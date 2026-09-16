# Folder structure

**Step:** 08  
**Status:** Organisational directories created; future pages are documented only (no empty `page.tsx` stubs).

This repository uses Next.js App Router with a `src/` directory and `@/*` → `src/*` (see `tsconfig.json`).

---

## Path → purpose

| Path                       | Purpose                                                  | Now                                                     |
| -------------------------- | -------------------------------------------------------- | ------------------------------------------------------- |
| `src/app/`                 | Route files and route-level composition                  | Exists — home only                                      |
| `src/app/layout.tsx`       | Root document layout (`html` / `body`)                   | Exists                                                  |
| `src/app/page.tsx`         | Minimal home route                                       | Exists                                                  |
| `src/app/globals.css`      | Global styles + Tailwind entry                           | Exists                                                  |
| `src/components/ui/`       | Small reusable UI primitives                             | Step 12 primitives                                      |
| `src/components/dev/`      | Local `/dev/ui` helpers only                             | `ui-interactions.tsx`                                   |
| `src/components/layout/`   | Header, mobile nav, footer later                         | Empty placeholder                                       |
| `src/components/sections/` | Page sections later                                      | Empty placeholder                                       |
| `src/components/forms/`    | Accessible enquiry form pieces later                     | Empty placeholder                                       |
| `src/content/`             | Service, project, founder, FAQ, site copy later          | Empty placeholder                                       |
| `src/config/`              | Public-safe site / navigation settings later             | Empty placeholder                                       |
| `src/lib/`                 | Shared utilities only; **no** secret barrel exports      | `cn.ts` class helper                                    |
| `src/server/`              | Server-only env access and integrations later            | Empty placeholder                                       |
| `src/types/`               | Shared domain types when actually used                   | Empty placeholder                                       |
| `public/brand/`            | Approved logo / brand assets                             | Empty placeholder                                       |
| `public/images/projects/`  | Approved project screenshots                             | Empty placeholder                                       |
| `public/images/team/`      | Approved founder / team photos                           | Empty placeholder                                       |
| `public/fonts/`            | Self-hosted fonts later                                  | Empty placeholder                                       |
| `docs/`                    | Planning, setup, architecture, content, progress         | Exists                                                  |
| `docs/architecture/`       | Structure and architecture notes                         | This file                                               |
| `supabase/migrations/`     | Real SQL migrations starting at DB steps                 | Placeholder only — **no SQL / no Supabase project yet** |
| Root configs               | `package.json`, `next.config.ts`, ESLint, Prettier, etc. | Stay at repo root                                       |

Assets live under root `public/`, **not** `src/public/`.

Empty directories keep a tiny `.gitkeep` so Git retains them. Do not add pretend modules just to fill folders.

---

## Future route locations (not created as files yet)

Documented in `docs/planning/03-sitemap.md`. Implement later as real pages with content — **do not** add empty `page.tsx` files now.

| Route                                | Intended files (later)                                              |
| ------------------------------------ | ------------------------------------------------------------------- |
| `/`                                  | `src/app/page.tsx` (exists)                                         |
| `/about`                             | `src/app/about/page.tsx`                                            |
| `/services`                          | `src/app/services/page.tsx`                                         |
| `/services/[slug]` or fixed segments | e.g. `src/app/services/websites-ecommerce/page.tsx` (match sitemap) |
| `/work`                              | `src/app/work/page.tsx`                                             |
| `/work/[slug]`                       | `src/app/work/[slug]/page.tsx`                                      |
| `/process`                           | `src/app/process/page.tsx`                                          |
| `/contact`                           | `src/app/contact/page.tsx`                                          |
| `/privacy`                           | `src/app/privacy/page.tsx`                                          |
| `/terms`                             | `src/app/terms/page.tsx`                                            |

Enquiry API routes belong under `src/app/api/...` when that step arrives — not in this step.

---

## Import boundaries

| From → To                                                                                   | Allowed?           |
| ------------------------------------------------------------------------------------------- | ------------------ |
| Route (`src/app/...`) → `components`, `content`, `config`, `lib`, `types`                   | Yes                |
| Client component → `src/server/**`                                                          | **No**             |
| Shared `lib` / barrel file → re-export server secrets                                       | **No**             |
| `src/server/**` → used only from Server Components, Route Handlers, or other server modules | Yes                |
| `public/**` URLs in components                                                              | Yes (static paths) |

**Defaults**

- Prefer **server** components and server-loaded content.
- Add `"use client"` only for real browser interaction.
- Keep route files **thin**: compose sections; put reusable UI in `components/`.
- Add server integrations in `src/server/` only when needed (credentials stay server-only).

---

## Naming

| Kind                    | Convention                                                 |
| ----------------------- | ---------------------------------------------------------- |
| App modules / utilities | lowercase kebab-case filenames (`enquiry-schema.ts`)       |
| React components        | PascalCase exports (`EnquiryForm`)                         |
| Framework files         | Keep required names (`page.tsx`, `layout.tsx`, `route.ts`) |

Avoid: global catch-all `index.ts` barrels, unused hooks/providers, Redux, generic repository frameworks, or empty “service layer” scaffolding.

---

## Quick placement guide

| Need                            | Put it here                                                              |
| ------------------------------- | ------------------------------------------------------------------------ |
| Future service description copy | `src/content/` (e.g. services data) + route under `src/app/services/...` |
| Homepage section UI             | `src/components/sections/` composed from `src/app/page.tsx`              |
| Server credential / env helper  | `src/server/` only                                                       |
| Project screenshot              | `public/images/projects/` after approval (see asset guidelines)          |

---

## Alias check

`@/*` maps to `./src/*` in `tsconfig.json`. Example: `@/components/layout/site-header` → `src/components/layout/site-header`.
