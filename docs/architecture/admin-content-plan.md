# Admin content plan (portfolio)

Planning notes for the future MongoDB admin panel and the public project interface introduced in Step 37. This is not a claim that admin, auth, or MongoDB are implemented.

## Public selector interface (Steps 37–39)

Components consume typed public DTOs only. They must not import `projectRecords` or other raw catalog arrays.

| Operation                          | Module                          | Notes                                 |
| ---------------------------------- | ------------------------------- | ------------------------------------- |
| `listPublishedProjects`            | `src/server/public-projects.ts` | Filters, page size 9, hard max 24     |
| `getPublishedProjectSummaryBySlug` | same                            | Summary card / metadata               |
| `listPublishedFeaturedProjects`    | same                            | Homepage featured order               |
| `listPublishedRelatedProjects`     | same                            | Related-work blocks                   |
| Pure helpers / tests               | `src/lib/public-projects.ts`    | Eligibility, query parse, DTO mapping |

`PublicProjectCard` fields are bounded: id, slug, title, summary, work status + label, approved service refs, approved cover, story-link eligibility, safe links, attribution, and story path (use only when eligible).

Draft revision bodies, unpublished media, and internal notes must never appear on the DTO.

## Repository adapter (current)

`src/server/public-projects.ts` reads `contentCatalog` as a temporary adapter. Story routes are not enabled yet (`workStoriesImplemented: false`) so summary-only cards cannot claim “Read case study.”

## MongoDB switch (A09–A10)

When admin publishing is live:

1. Replace the repository adapter with queries against published project revisions.
2. Keep the same DTO shapes so Work page, homepage, and related-work UI stay unchanged.
3. On database failure, show an unavailable/recovery state — **do not** fall back to draft repository files as a second source of truth.
4. Migrate approved repository projects/media once (A10); stop editing repository project records as a parallel live source afterward.

## Related docs

- Addendum: `docs/prompts/Zatroz_Admin_and_Image_Plan_Addendum.md` (untracked prompt pack may also exist locally)
- Step note: `docs/work/step-37.md`
- Image provenance: `docs/content/image-register.md`
