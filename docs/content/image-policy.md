# Image selection and sourcing policy

**Status:** A01 policy — no new image assets are claimed created by this document.  
**Register:** Provenance and approval for concrete files stay in `docs/content/image-register.md`.

---

## Choose the right asset type

| Website need                                                       | Preferred approach                                     |
| ------------------------------------------------------------------ | ------------------------------------------------------ |
| Abstract brand artwork, atmospheres, generic service illustrations | Generate original raster artwork when useful           |
| General business/context photography                               | Licensed stock or original photograph                  |
| Exact workflows, labels, icons, responsive panels                  | HTML/CSS/SVG or existing icon system                   |
| Project screenshots / case-study results                           | Real approved project assets; label conceptual mockups |
| Founder / team photographs                                         | Real approved photos of the actual people              |
| Customer logos, badges, testimonials                               | Authentic approved material only                       |

Do **not** generate a fake team, client screenshot, endorsement, award, or office and present it as real. Generated artwork may support design; it cannot substitute for evidence of work.

---

## Sourcing rules

- Unsplash / Pexels (or similar) only with a checked licence; record source page, creator, licence link, attribution needs.
- Do not imply photographed people/brands endorse Zatroz.
- No competitor scraping, random image-search hotlinks, or watermark removal.
- Prefer stable paths or provider IDs once the media library exists (A04).
- Paid assets require a separate purchase decision — availability is not assumed.

---

## Every image task must specify

1. Placement and purpose
2. Source type: real supplied / generated / licensed stock / code-native
3. Subject, composition, brand colours, crop/aspect, text-safe space
4. Sizes/responsive variants for the real layout
5. Proposed filename or media ID, alt or decorative treatment, caption, provenance
6. How it enters the admin media library or `public/` repository folder
7. Honest text/layout fallback if the asset is pending

If generation or download is unavailable: write the exact brief, mark **Pending**, use a clean fallback. Never claim a file exists until it is created or retrieved.

---

## Admin media (when A04 exists)

- Formats (initial): JPEG, PNG, WebP
- Initial size policy example: 10 MiB byte cap + decoded pixel limit + real format verification
- Reject SVG/HTML/scripts through the admin uploader; reviewed repository logos may use a separate path
- Private/authenticated delivery for unpublished media; folder name ≠ ACL
- Replacing an asset creates a new immutable version

---

## Brand direction

Warm white / charcoal / orange (`#F7F5F2` / `#111111` / `#FF3B10`) without forcing orange into every photograph. Prefer live accessible text over baking headlines into generated images.
