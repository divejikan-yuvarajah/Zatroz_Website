# Quality Step 60 — Performance

**Branch:** `feature/60-performance` (from `feature/59-seo`)  
**Status:** Local production timings **Done**. Field Web Vitals and Lighthouse **Not run**.

## Changes

| Area             | Detail                                                                                   |
| ---------------- | ---------------------------------------------------------------------------------------- |
| Public catalogue | 15s failure cooldown so an unreachable database does not add ~8s to every Home/Work view |
| Request reuse    | `React.cache` on the published repository read                                           |
| Motion           | Featured-work reveal loads GSAP with `next/dynamic`                                      |
| Evidence         | `docs/performance/baseline.md`, `docs/performance/optimization-report.md`                |

## Checks

| Check                                | Result                                       |
| ------------------------------------ | -------------------------------------------- |
| Production HTML timings (warmup + 3) | Passed comparison in the optimization report |
| `npm run check`                      | Passed                                       |
| `npm run build`                      | Passed before the after-timings              |
| Lighthouse                           | **Not run**                                  |
| Field CWV                            | **Unavailable**                              |
| Admin browser flows                  | **Not run**                                  |
| Published work detail timing         | **Not run**                                  |

## Next

Step 61 — application security hardening. Do not start automatically. This pass does not mark the site launch-ready.
