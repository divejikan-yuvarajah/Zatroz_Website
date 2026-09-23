# Performance baseline (Step 60)

**Date:** 2026-09-24  
**Revision measured:** `3b6d966` (Step 59 tip), production `next start` on port 3010  
**Machine:** Windows 10, local loopback, no CPU/network throttle, default Node for this repo (`>=24 <25`)  
**Browser / Lighthouse:** **Not run**  
**Field Core Web Vitals (p75):** **Unavailable**  
**Dataset:** Local `SITE_URL` / Mongo settings from the developer environment. The public catalogue did not connect within the driver server-selection budget (about 8 seconds). No production customer data. No published case-study URL was available to time.

## Method

One warmup request per route, then three `Invoke-WebRequest` calls. Time is full response elapsed (milliseconds), not Lighthouse LCP/INP/TBT. HTML size is `RawContentLength`.

| Route                       | HTML bytes | Run ms                 | Median ms                                      |
| --------------------------- | ---------- | ---------------------- | ---------------------------------------------- |
| `/`                         | 30697      | 8129.6, 8093.1, 8084.4 | 8093.1                                         |
| `/services`                 | 32935      | 8.9, 7.2, 8.0          | 8.0                                            |
| `/work`                     | 38464      | 8100.5, 8083.7, 8104.6 | 8100.5                                         |
| `/contact`                  | 37293      | 24.2, 29.4, 39.2       | 29.4                                           |
| `/work/[slug]` published    | —          | —                      | **Not run** (catalogue unavailable)            |
| Admin list / editor / media | —          | —                      | **Not run** (no authenticated browser session) |

Home and Work matched the MongoDB `serverSelectionTimeoutMS` (8000). Services and Contact do not load the published catalogue.

## Lab vs field

These numbers are local server timings during an unreachable catalogue. They are not field LCP, INP, or CLS.
