# SEO route policy (Step 59)

**Purpose:** Indexing, canonical, sitemap, and share-image rules for existing routes only.  
**Production origin:** `SITE_URL` via `getSiteUrl()` / `resolveSiteUrl()` — never from `Host` or forwarded-host headers.  
**Indexing gate:** `APP_ENV=production` and, when set, `VERCEL_ENV=production`. `NODE_ENV=production` alone is not enough (preview builds can be production-mode).

## Environment

| Deployment                                                | Index HTML?     | robots.txt                                         | Sitemap                             |
| --------------------------------------------------------- | --------------- | -------------------------------------------------- | ----------------------------------- |
| Local / development / test                                | No              | Disallow `/`                                       | Empty (intentional)                 |
| Vercel preview (`VERCEL_ENV=preview`)                     | No              | Disallow `/`                                       | Empty                               |
| Production (`APP_ENV=production` + production Vercel env) | Per-route below | Allow public; disallow `/admin/`, `/api/`, `/dev/` | Marketing + eligible published work |

Preview access protection (platform auth) stays in place. This step does not connect Search Console, change DNS, or add analytics.

## Route table

| Route                              | Index                                   | Canonical          | Metadata source                                              | Sitemap            | Share image                    |
| ---------------------------------- | --------------------------------------- | ------------------ | ------------------------------------------------------------ | ------------------ | ------------------------------ |
| `/`                                | Yes (prod)                              | `/`                | Root + home defaults                                         | Yes                | `/opengraph-image`             |
| `/services`                        | Yes (prod)                              | `/services`        | Page metadata                                                | Yes                | Default                        |
| `/services/[slug]` (eligible only) | Yes (prod)                              | `/services/{slug}` | Published service detail DTO                                 | Yes when eligible  | Default                        |
| `/work` (no filters)               | Yes (prod)                              | `/work`            | Work listing copy                                            | Yes                | Default                        |
| `/work?service=&status=&page=`     | No                                      | `/work`            | Same + `noindex,follow`                                      | No                 | Default                        |
| `/work/[slug]` published story     | Yes (prod)                              | `/work/{slug}`     | Published case-study DTO                                     | Yes                | `/work/{slug}/opengraph-image` |
| `/work/[slug]` missing / draft     | No                                      | n/a (`notFound`)   | Generic not-found; no draft leak                             | No                 | Generic brand fallback         |
| `/work/[slug]` former slug         | Redirect                                | Target slug        | `noindex` during redirect metadata                           | Target only        | Target                         |
| `/about`, `/process`, `/contact`   | Yes (prod)                              | Clean path         | Public selectors when approved; honest fallbacks when sparse | Yes                | Default                        |
| `/contact?service=`                | Yes body; canonical `/contact`          | `/contact`         | Contact page; query ignored for SEO                          | `/contact` only    | Default                        |
| `/privacy`, `/terms`               | Only when approved public policy exists | Clean path         | Policy DTO or sparse noindex placeholder                     | Only when approved | Default                        |
| `/admin/**`, login, MFA            | No                                      | n/a                | `noindex` + auth                                             | No                 | n/a                            |
| `/api/**`                          | n/a                                     | n/a                | Not HTML marketing                                           | No                 | n/a                            |
| `/dev/ui`                          | No (dev-only guard)                     | n/a                | `noindex`                                                    | No                 | n/a                            |
| `not-found` / system errors        | No                                      | n/a                | Step 55 states                                               | No                 | n/a                            |

## Query / attribution

UTM and click-id query keys are not part of canonical URLs. Contact service prefills and Work filter combinations do not mint extra indexable URLs.

## Sitemap failure

If the published-work catalogue is **unavailable**, sitemap generation **throws** (transient failure) instead of returning a successful empty URL set. Draft content is never used as a fallback.

## Production origin follow-up

Final public domain must be set in trusted `SITE_URL` before launch (planned later deployment steps). Local/example origins are labelled for development only.
