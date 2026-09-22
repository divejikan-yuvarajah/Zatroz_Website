# Motion specification (Step 56)

Restrained motion that improves feedback without hiding content, delaying controls, or adding a second animation stack.

**Stack:** CSS for control/menu/hero accent feedback. **GSAP 3** + **`@gsap/react`** only for a coordinated below-the-fold selected-work reveal (ScrollTrigger + `matchMedia` cleanup). No Framer Motion, Lenis, or custom cursor.

## Tokens

| Token              | Value                          | Use                               |
| ------------------ | ------------------------------ | --------------------------------- |
| `--duration-fast`  | 150ms                          | Control colour / press feedback   |
| `--duration-base`  | 220ms                          | Mobile menu open, short UI motion |
| `--duration-enter` | 420ms                          | Hero decorative accent            |
| `--ease-standard`  | cubic-bezier(0.2, 0.8, 0.2, 1) | General UI                        |
| `--ease-out`       | cubic-bezier(0.16, 1, 0.3, 1)  | Entrances                         |

## Chosen effects

### 1. Button / link press and colour feedback

| Field             | Detail                                                                        |
| ----------------- | ----------------------------------------------------------------------------- |
| Purpose           | Confirm activation without moving the hit target away from the pointer        |
| Trigger           | Hover / focus-visible / `:active`                                             |
| Elements          | `.ds-pressable` buttons and button links; `.ds-transition` text and nav links |
| Duration / easing | 150ms / `--ease-standard`                                                     |
| Reduced motion    | Transitions disabled; no scale on press                                       |
| Cleanup           | CSS only                                                                      |

### 2. Mobile menu open

| Field             | Detail                                                                 |
| ----------------- | ---------------------------------------------------------------------- |
| Purpose           | Orient the drawer without delaying focus or `aria-expanded`            |
| Trigger           | Native `<dialog showModal()>` open                                     |
| Elements          | `.mobile-nav-dialog::backdrop`, `.mobile-nav-panel`                    |
| Duration / easing | 220ms / `--ease-out`; panel translates ~12px                           |
| Reduced motion    | No animation; panel appears immediately                                |
| Cleanup           | Close remains immediate (no exit delay) so focus restore stays correct |

### 3. Hero decorative accent

| Field             | Detail                                            |
| ----------------- | ------------------------------------------------- |
| Purpose           | Soft brand cue above the hero copy                |
| Trigger           | First paint (CSS animation)                       |
| Elements          | `.hero-motion-accent` (`aria-hidden`)             |
| Duration / easing | 420ms / `--ease-out`; scaleX only                 |
| Reduced motion    | Static bar, no animation                          |
| Cleanup           | CSS only; **never** hides headline, body, or CTAs |

### 4. Selected-work card reveal (GSAP)

| Field             | Detail                                                              |
| ----------------- | ------------------------------------------------------------------- |
| Purpose           | Light below-the-fold attention when the section enters view         |
| Trigger           | ScrollTrigger `top 88%`, once                                       |
| Elements          | `[data-reveal-item]` articles inside `RevealOnScroll`               |
| Duration / easing | 450ms / power2.out; stagger 90ms; **transform only** (no opacity:0) |
| Reduced motion    | `gsap.matchMedia` skips the timeline                                |
| Cleanup           | `useGSAP` + `matchMedia.revert()`; `clearProps: transform`          |

**Why GSAP:** one scroll-linked stagger with preference-aware revert and ScrollTrigger lifecycle. CSS alone does not cleanly coordinate that without opacity hiding or permanent `will-change`.

## Progressive enhancement rules

- Server-rendered copy and links are usable before JS.
- No global `opacity: 0` on reveal targets.
- Failed GSAP load / no-JS leaves content fully visible.
- Enquiry / admin forms are not animated for success, reset, or entrance.
- Admin screens intentionally excluded from decorative motion.

## Measurement notes

Recorded after Step 56 build in `docs/quality/step-56.md` (client chunk size for the reveal module). Main-thread scroll profiling on a throttled mobile device: **Not run** by the agent.
