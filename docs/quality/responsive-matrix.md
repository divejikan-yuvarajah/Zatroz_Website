# Responsive matrix (Step 57)

Audit of public and admin layouts across target widths. Emulation only unless noted. **iOS Safari / Android Chrome on real devices: Not run.**

Widths inspected in layout review: **320, 390, 768, 1024, 1440** (plus component breakpoints around `sm`/`lg`).

Severity: **Blocker** (task fails) · **Major** (awkward but usable) · **Minor** (polish) · **OK**

| Route / state                                  | Viewport              | Issue                                                   | Severity | Fix / notes                                                                        | Evidence    |
| ---------------------------------------------- | --------------------- | ------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------- | ----------- |
| Global sticky header + skip/anchors            | 320–1440              | Notch / home-indicator overlap risk                     | Major    | `pt-[env(safe-area-inset-top)]` on site header; existing `scroll-padding-top` kept | Code        |
| Global media / long tokens                     | 320                   | Intrinsic images or unbroken strings can force overflow | Major    | `img, video { max-width:100% }`; `overflow-wrap: anywhere` on text blocks          | Code        |
| `/` selected-work reveal (Step 56)             | ≤640 / coarse pointer | Scroll choreography not useful on phones                | Minor    | GSAP reveal limited to fine pointer + `min-width: 640px`                           | Code        |
| `/` project media hover scale                  | Touch                 | Hover scale on coarse pointers                          | Minor    | Hover scale gated to `(hover:hover) and (pointer:fine)`                            | Code        |
| `/work` filters                                | 320–640               | `min-w-[12rem]` fields in a row risk squeeze            | Major    | Fields `min-w-0 w-full` stacking; `sm:min-w-[12rem]` when side-by-side             | Code        |
| `/work` cards / empty / no-match / unavailable | 320–1440              | Hierarchy already stacks                                | OK       | Existing grid + states retained                                                    | Code review |
| `/work/[slug]` TOC sticky                      | 320–1024              | Sticky TOC desktop-only                                 | OK       | `lg:sticky` already                                                                | Code review |
| `/services` grids + six detail pages           | 320–1440              | Grids collapse; comparison tables have card fallback    | OK       | Mobile card lists already for software guide                                       | Code        |
| Software guide comparison table                | ≥1024                 | Wide table needs labelled scroll                        | Minor    | `role="region"` + `aria-label` + keyboard focusable scroll                         | Code        |
| `/process`, `/about`, `/privacy`, `/terms`     | 320–1440              | Reading measure + wrap                                  | OK       | Reading containers                                                                 | Code review |
| `/contact` methods + form                      | 320–390               | Primary actions should be easy to tap                   | Major    | Method CTAs `w-full sm:w-auto`; form controls already `text-base` / `min-h-11`     | Code        |
| `/contact` form state                          | any                   | Responsive remount must not wipe fields                 | OK       | Single form instance; no breakpoint remount                                        | Code review |
| Mobile nav open/close                          | 320–1023              | Body lock + focus already handled                       | OK       | Dialog `showModal`; breakpoint close                                               | Code review |
| Admin shell nav                                | 320–768               | Many links need horizontal scroll                       | Major    | Touch overscroll + labelled scroll region styling                                  | Code        |
| Admin `/admin/projects` table                  | 320–768               | Wide table unavoidable                                  | Major    | Labelled focusable `role="region"` scroll; filters full-width on small             | Code        |
| Admin draft / story / media / publish          | 320–1440              | Forms stack; media cards column→row                     | OK       | Existing `flex-col` / `lg:flex-row`                                                | Code review |
| Admin MFA recovery codes                       | 320                   | Long codes                                              | OK       | `break-all` + overflow-x                                                           | Code review |
| System not-found / error / loading             | 320–1440              | Reading width                                           | OK       | Step 55 shells                                                                     | Code review |
| 200% text / 400% zoom                          | —                     | Reflow                                                  | Not run  | Emulation only                                                                     | —           |
| Landscape phone + virtual keyboard             | —                     | Field obscuring                                         | Not run  | Real-device                                                                        | —           |

## Priority fixes shipped in this step

1. Safe-area padding on the sticky public header.
2. Intrinsic media + long-token wrapping to reduce page-level overflow.
3. Work and admin filter fields that no longer force awkward min-widths on narrow viewports.
4. Labelled, touch-friendly horizontal scroll for admin project table and comparison tables.
5. Motion hover/reveal limited so touch/small layouts are not tied to desktop choreography.
6. Contact method buttons full-width on small screens.

## Remaining / out of scope

- Real-device iOS Safari and Android Chrome passes.
- Pixel screenshots before/after (private-data-safe capture Not run).
- Full admin editor landscape keyboard testing.
- Step 58 accessibility review (separate).

## Method note

Findings come from static layout inspection of the App Router tree and component CSS, plus production build verification. Desktop DevTools emulation was **not** automated in this agent session; treat the matrix as an engineering audit until a human confirms on devices.
