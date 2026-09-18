# Admin content plan (portfolio)

Planning notes for the future MongoDB admin panel and the public project interface introduced in Steps 37–38. This is not a claim that admin, auth, or MongoDB are implemented.

## Public selector interface (Steps 37–39)

Components consume typed public DTOs only. They must not import `projectRecords` or other raw catalog arrays.

| Operation                          | Module                                                       | Notes                                 |
| ---------------------------------- | ------------------------------------------------------------ | ------------------------------------- |
| `listPublishedProjects`            | `src/server/public-projects.ts`                              | Filters, page size 9, hard max 24     |
| `getPublishedProjectSummaryBySlug` | same                                                         | Summary card / metadata               |
| `getPublishedCaseStudyBySlug`      | same                                                         | Full story DTO or null                |
| `listPublishedFeaturedProjects`    | same                                                         | Homepage featured order               |
| `listPublishedRelatedProjects`     | same                                                         | Related-work blocks                   |
| Pure helpers / tests               | `src/lib/public-projects.ts`, `src/lib/public-case-study.ts` | Eligibility, query parse, DTO mapping |

`PublicProjectCard` fields are bounded: id, slug, title, summary, work status + label, approved service refs, approved cover, story-link eligibility, safe links, attribution, and story path (use only when eligible).

`PublicCaseStudy` adds structured sections, gallery derivatives, outcomes, optional testimonial, related cards, and page metadata. Draft revision bodies, `reviewNotes`, and unpublished media must never appear.

## Story model

Projects keep a separately publishable `story` body (`ProjectStoryRecord`) with controlled paragraph/list blocks. Summary publication can exist without a story. Approved stories require title, intro, context, contribution, and solution. Gallery items reference media IDs with captions; concept screens must be labelled.

## Repository adapter (current)

`src/server/public-projects.ts` reads `contentCatalog`. Story routes are live under `/work/[slug]`; eligibility still requires an approved story body. `generateStaticParams` may prerender known slugs but must not permanently block request-time lookup of new admin-created slugs.

## MongoDB switch (A09–A11)

When admin publishing is live:

1. Replace the repository adapter with queries against published project revisions.
2. Keep the same DTO shapes so Work listing, case-study pages, homepage, and related-work UI stay unchanged.
3. On database failure, show an unavailable/recovery state — **do not** fall back to draft repository files as a second source of truth.
4. Newly published slugs must resolve without a production rebuild; refresh Work listing, featured homepage items, related-work blocks, metadata, and sitemap eligibility as applicable.
5. Migrate approved repository projects/media once (A10); stop editing repository project records as a parallel live source afterward.
6. Authenticated private previews remain A07 — out of scope for public routes.

## Related docs

- Addendum: `docs/prompts/Zatroz_Admin_and_Image_Plan_Addendum.md` (untracked prompt pack may also exist locally)
- Step notes: `docs/work/step-37.md`, `docs/work/step-38.md`
- Image provenance: `docs/content/image-register.md`
