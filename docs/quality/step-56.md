# Quality Step 56 — Motion and micro-interactions

**Branch:** `feature/56-motion` (from `feature/55-system-pages`)  
**Status:** Implementation **Done**. Interactive reduced-motion / device profiling partially documented below.

## What changed

| Area          | Detail                                                         |
| ------------- | -------------------------------------------------------------- |
| Spec          | `docs/design/motion.md`                                        |
| Tokens        | `--duration-enter`, `--ease-out`; clarified control durations  |
| CSS           | `.ds-pressable`, mobile-nav open motion, `.hero-motion-accent` |
| GSAP          | `gsap` + `@gsap/react` for `RevealOnScroll` only               |
| Hero          | Decorative accent; LCP copy stays visible                      |
| Selected work | Transform-only stagger reveal when in view                     |
| Docs          | This note + `docs/progress.md`                                 |

## Checks

| Check                                             | Result               |
| ------------------------------------------------- | -------------------- |
| `npm run format`                                  | Passed               |
| `npm run check`                                   | Passed               |
| `npm run build`                                   | Passed               |
| GSAP client chunk size                            | ~123 KB (`0a6rwvb6eml_u.js` with ScrollTrigger) |
| Manual reduced-motion toggle / no-JS / rapid menu | **Not run**          |
| Throttled mobile main-thread scroll profile       | **Not run**          |

## Honesty

| Claim                                    | Status                    |
| ---------------------------------------- | ------------------------- |
| Content readable without animation       | Done by design            |
| Reduced-motion skips nonessential motion | Done (CSS + `matchMedia`) |
| No form / admin decorative motion        | Done                      |
| Device scroll performance proven         | **Not claimed**           |

## Next

Step 57 — responsive audit. Do not start automatically.
