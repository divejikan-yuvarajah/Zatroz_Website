# Editing guide — shared content

**Step:** 18

This guide is for founders and engineers editing repository content. There is no CMS yet.

---

## Before you edit

1. Read `docs/content/content-model.md` (draft vs approved vs implemented).
2. Prefer a branch per content change; run checks before merge.
3. Never invent client results, founder identities, prices, or social URLs.

---

## Add or update a record

| Domain       | File                        | Steps                                                                                                                                          |
| ------------ | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Service      | `src/content/services.ts`   | Keep the six slugs. Edit draft fields. Do not add a seventh group without sitemap + route updates.                                             |
| Project      | `src/content/projects.ts`   | Add a record only from real evidence. Set honest `workStatus`. Leave `verifiedOutcomes` empty rather than inventing numbers.                   |
| Founder      | `src/content/founders.ts`   | Only approved names/roles/bios/portraits. Missing people stay absent — do not add “Person 2”.                                                  |
| FAQ          | `src/content/faqs.ts`       | Plain text only. No HTML. Avoid deadlines, prices, and support promises until approved.                                                        |
| Evidence     | `src/content/evidence.ts`   | Add only verified claims with correct subject attribution and an internal `sourceReference`. Leave the list empty rather than inventing proof. |
| Media        | `src/content/media.ts`      | Path must exist under `public/`. Require alt text or `decorative: true`.                                                                       |
| Site/contact | `src/content/site.ts`       | Flip `status` to `confirmed` only after founder launch confirmation.                                                                           |
| Nav labels   | `src/content/navigation.ts` | Change labels/order here. Paths stay in `src/config/routes.ts`.                                                                                |

---

## Approve content for the public site

1. Founder/content owner reviews the record.
2. Set `publicationState` to `"approved"` only when required public fields are complete.
3. Run `npm run validate:content`. Incomplete approved records **fail**.
4. Approval alone does **not** create a link. Also implement the page and set `implemented: true` on the matching route in `src/config/routes.ts`.

---

## Enable a completed route

1. Add the real `page.tsx` under `src/app/...`.
2. Set `implemented: true` for that id in `src/config/routes.ts`.
3. For services/projects, ensure the content record is `approved` if it should appear as a public story/card.
4. Header/footer link selectors require **approved + implemented** where that rule applies (`getLinkableServices`, etc.).

---

## Run validation

```powershell
npm run validate:content
```

Included in `npm run check`. The runner:

- Validates the live catalog.
- Runs synthetic fixtures (duplicate slug, bad URL, incomplete approved, unknown refs) that are **not** shipped to the website.

It does not use the network, credentials, or a database.

---

## Client vs server

| Allowed in Client Components                       | Keep server-only                                     |
| -------------------------------------------------- | ---------------------------------------------------- |
| Props already projected (nav destinations, labels) | `src/content/catalog.ts`, draft bodies, full records |
| Types from `src/types/content.ts`                  | `src/server/content.ts`                              |
| Gallery specimens using safe local fixtures        | Approval evidence, private founder contacts          |
