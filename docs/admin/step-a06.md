# Admin step A06 — Case-study editor and gallery order

**Branch:** `feature/a06-admin-case-study` (from `feature/a05-admin-projects`)  
**Status:** Case-study draft editor **Implemented**. Live Mongo story save with real credentials **Not run** until operators supply secrets.

## Goal

Staff can edit structured case-study sections on the same project editorial identity, with controlled **paragraph** and **list** blocks only, ordered gallery items (media + caption + optional concept label), and explicit **Save draft** with optimistic concurrency — without publishing or authenticated preview.

## Delivered

| Artifact                  | Path / note                   |
| ------------------------- | ----------------------------- |
| Pure story parse/validate | `src/lib/admin/story.ts`      |
| Story save in repository  | `saveProjectStoryDraft`       |
| Server action             | `saveProjectStoryDraftAction` |
| Case-study editor UI      | `/admin/projects/[id]/story`  |
| Link from summary edit    | `/admin/projects/[id]`        |
| Unit tests                | `npm run test:admin-story`    |

## Behaviour

- Story save preserves the current summary snapshot and writes a new immutable `summary_and_story` revision
- Blocks accept only `paragraph` and `list` (bulleted/numbered); HTML/MDX/scripts rejected
- Gallery rows support add/remove and move up/down for order
- Optional testimonial requires both quote and attribution, or neither
- `reviewNotes` stored on the story snapshot and never projected publicly
- Empty intro is stored as the shared draft placeholder to satisfy schema minLength
- Without Mongo credentials: marketing build still succeeds; editor fails closed with a clear message

## Explicitly not done (later steps)

- Authenticated preview via public components (A07)
- Publish / unpublish / archive / slug redirects (A08)
- Public featured selection (A08–A09)
- Switching public selectors to Mongo (A09–A10)

## Operator setup

1. Create or open a project draft (A05).
2. Open **Case-study editor** from the project edit page.
3. Add sections/gallery, Save draft, reload, confirm concurrency bumps and order persists.

## Checks

Recorded in `docs/progress.md` when the step is closed.
