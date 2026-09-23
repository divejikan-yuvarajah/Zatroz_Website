# Performance optimization report (Step 60)

## Prioritized costs

| Route / task    | Measured problem                                        | Change                                          | Expected effect                                          | Risk                                                                                              |
| --------------- | ------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `/` and `/work` | Every request waited ~8.1s on a failed Mongo connect    | 15s cooldown on public catalogue failures only  | Repeat views skip the driver timeout                     | A recovered database is not retried until the window ends. Admin writes do not use this helper    |
| Home render     | Several selectors each loaded the published catalogue   | `React.cache` around the public repository read | One catalogue load per request when the database answers | Same-request reads share the first result. Publish runs in a later request after `revalidatePath` |
| Home client JS  | GSAP was imported with the featured-work section module | `next/dynamic` for `RevealOnScroll`             | Motion chunk loads only when that section renders        | Section still server-renders content; motion stays optional                                       |

Images already use `next/image` with `sizes`, and the case-study hero sets `priority`. Manrope stays on the Next font pipeline (weights 400–700, latin, `swap`, size-adjust meta). No new remote image hosts. No analytics added. Turnstile still loads only with the enquiry form.

## After (same method)

**Revision:** `feature/60-performance` production build, same machine, port 3010, warmup then three runs.

| Route       | HTML bytes | Run ms           | Median ms | Baseline median |
| ----------- | ---------- | ---------------- | --------- | --------------- |
| `/`         | 30697      | 38.3, 30.1, 50.4 | 38.3      | 8093.1          |
| `/services` | 32935      | 6.7, 10.0, 9.7   | 9.7       | 8.0             |
| `/work`     | 36003      | 38.0, 28.4, 27.1 | 28.4      | 8100.5          |
| `/contact`  | 37293      | 55.2, 53.3, 44.4 | 53.3      | 29.4            |

Home and Work dropped by seconds, outside run variance. Services stayed in the same few-millisecond band. Contact moved from 29ms to 53ms; that is small local variance, not treated as a regression to fix. Work HTML was smaller (38464 → 36003) while still rendering the unavailable catalogue state.

The first request after an outage still pays the driver timeout. Later requests within 15 seconds do not. A successful read clears the next failure window only after a later failure.

## Budgets (this measurement method only)

Full HTML response elapsed on this PC, production `next start`, after one warmup:

| Route                   | Budget                                                                          |
| ----------------------- | ------------------------------------------------------------------------------- |
| `/`                     | median under 1000 ms when the catalogue is ready or inside the failure cooldown |
| `/work`                 | median under 1000 ms under the same conditions                                  |
| `/services`, `/contact` | median under 250 ms (static/content routes; no catalogue connect)               |

Not a Lighthouse score gate. Field p75 LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 remain goals and are **unverified**.

## Publication cache

Public catalogue data is request-scoped (`React.cache`), not a long-lived shared cache of drafts. Publish/unpublish still calls `revalidatePublicPortfolioPaths` (pages, sitemap, OG). The 15s cooldown applies only after a failed public read. Private admin routes stay `force-dynamic`.

## Still open

- Field CrUX / Lighthouse: **Not run**
- Authenticated admin interaction timings: **Not run**
- A published work detail with real media: **Not run** in this environment
- Healthy-database query time (this lab only saw connection failure): **Not measured**
