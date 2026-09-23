# Quality Step 59 — SEO and social sharing

**Branch:** `feature/59-seo` (from `feature/58-accessibility`)  
**Status:** Implementation **Done**. External Search Console / crawler validation **Not run**.

## What shipped

| Area | Detail |
| --- | --- |
| Policy | `docs/seo/route-policy.md`, `docs/seo/metadata-inventory.md` |
| Origin | `SITE_URL` via existing `resolveSiteUrl` / `getSiteUrl` |
| Indexing gate | `APP_ENV=production` + `VERCEL_ENV=production` when present |
| Metadata | Root template, per-route `buildPublicPageMetadata`, Work filter noindex |
| robots / sitemap | `src/app/robots.ts`, `src/app/sitemap.ts` (fail closed on catalogue outage) |
| JSON-LD | Organization, WebSite, BreadcrumbList (escaped) |
| OG images | Default + per published work slug; generic fallback for unknown |
| Invalidation | Publish revalidation includes sitemap + OG paths |
| Tests | `npm run test:seo` |

## Checks

| Check | Result |
| --- | --- |
| `npm run test:seo` | Passed |
| `npm run format` | Passed |
| `npm run check` | Passed |
| `npm run build` | Passed |
| Search Console / live crawler | **Not run** |
| Disposable publish fixture SEO pass | **Not run** (no DB mutation in this step) |

## Honesty

| Claim | Status |
| --- | --- |
| Metadata aligned to public selectors | Done in code |
| Preview non-indexable | Done via env policy |
| Rich results / rankings promised | **Not claimed** |
| Final production domain configured | **Follow-up** — set trusted `SITE_URL` before launch |

## Next

Step 60 — performance. Do not start automatically.
