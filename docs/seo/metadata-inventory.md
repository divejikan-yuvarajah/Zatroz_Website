# Metadata inventory (Step 59)

| Surface         | Title / description                                                       | Canonical                      | Robots                          | Notes                          |
| --------------- | ------------------------------------------------------------------------- | ------------------------------ | ------------------------------- | ------------------------------ |
| Root layout     | Template `%s — Zatroz`; default description from brand or honest fallback | `metadataBase` from `SITE_URL` | Env gate                        | Organization + WebSite JSON-LD |
| Home            | `Zatroz` + default description                                            | `/`                            | Env gate                        |                                |
| Services        | Services listing copy                                                     | `/services`                    | Env gate                        |                                |
| Service detail  | `pageTitle` / `pageDescription` from public detail                        | `/services/{slug}`             | noindex if missing              |                                |
| Work list       | Work copy; filters force noindex                                          | `/work`                        | noindex when filtered/paginated |                                |
| Work detail     | Published `pageTitle` / `pageDescription`                                 | `/work/{slug}`                 | noindex if missing              | Per-slug OG image              |
| About / Process | Approved page fields or sparse fallbacks                                  | Clean paths                    | Env gate                        |                                |
| Contact         | Contact copy                                                              | Always `/contact`              | Env gate                        | Prefill query ignored          |
| Privacy / Terms | Policy fields when approved; else sparse + noindex                        | Clean paths                    | Index only when approved        |                                |
| Admin / auth    | Console titles                                                            | n/a                            | noindex                         | Auth is access control         |
| not-found       | Generic                                                                   | n/a                            | noindex                         | No path echo                   |

## Structured data

| Graph          | Where            | Contents                                                            |
| -------------- | ---------------- | ------------------------------------------------------------------- |
| Organization   | Root             | Name, URL, logo (`/icon`), `sameAs` only for confirmed social hrefs |
| WebSite        | Root             | Name, URL, description                                              |
| BreadcrumbList | `PageBreadcrumb` | Matches visible crumbs; `<` escaped in JSON-LD                      |

No Product, Review, AggregateRating, or invented address/credential fields.

## Social images

| Image                          | Size     | Source                                              |
| ------------------------------ | -------- | --------------------------------------------------- |
| `/opengraph-image` (+ twitter) | 1200×630 | Code-rendered brand card (#111 / #F7F5F2 / #FF3B10) |
| `/icon`                        | 32×32    | Code-rendered mark                                  |
| `/work/[slug]/opengraph-image` | 1200×630 | Published title only; generic brand if unpublished  |

## External validation

Search Console, live crawler fetches, and rich-result eligibility claims: **Not run** in this step.
