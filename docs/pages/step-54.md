# Pages Step 54 — Privacy and Terms

**Branch:** `feature/54-privacy-terms` (from `feature/53-enquiry-journey`)  
**Status:** Page templates + factual drafts **Implemented**. Public publication **Pending owner approval**. Legal compliance **Not certified**.

## What changed

| Area           | Detail                                                                                                                              |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Fact inventory | `docs/legal/policy-facts.md` — confirmed processing, processors, cookies, unresolved identity/retention/law questions               |
| Policy records | `src/content/legal-policies.ts` — versioned Privacy + Terms drafts (`publicationState: "draft"`, `effectiveOn: null`)               |
| Selectors      | `src/server/legal-policies.ts` — public returns null until approved + effective date; gallery preview for `/dev/ui`                 |
| UI             | `src/components/sections/policy-page.tsx` — reading measure, H1/H2, TOC, print styles, draft chrome for gallery                     |
| Routes         | `/privacy`, `/terms` — sparse public placeholders; full draft only in `/dev/ui`                                                     |
| Linking        | `publicRoutes.privacy/terms.implemented` remain **false** — footer + Contact `privacyHref` stay unlinked                            |
| Form notice    | `EnquiryForm` / `LiveEnquiryForm` accept optional `privacyHref` (wired from Contact when present)                                   |
| Validation     | Content catalog warnings for draft policies; errors if route implemented before approval (or approved without route/effective date) |
| Docs           | This note + `docs/progress.md` + footer design note                                                                                 |

## Publication gates (not done here)

1. Owner confirms legal/trading identity (and optional address/registration) for public copy.
2. Owner/counsel answers retention and Sri Lanka PDPA applicability questions in `policy-facts.md`.
3. Set `effectiveOn` to a real date; set `publicationState` to `approved`.
4. Flip `publicRoutes.privacy.implemented` and `publicRoutes.terms.implemented` to `true`.
5. Align Contact data-use notice with `privacyPolicyRecord.shortDataUseNotice`.
6. Optional: record server-owned `noticeId` with accepted enquiries (provenance, not marketing consent).

## Checks

| Check | Result |
| --- | --- |
| `npm run format` | Passed |
| `npm run check` | Passed |
| `npm run build` | Passed (`/privacy`, `/terms` present) |
| Interactive 320px / 200% zoom / keyboard TOC | **Not run** |

## Honesty rows

| Claim                                            | Status                                               |
| ------------------------------------------------ | ---------------------------------------------------- |
| Reusable policy page templates                   | Done                                                 |
| Factual drafts grounded in Steps 42–53 inventory | Done (draft, not approved)                           |
| Footer / Contact policy links live               | **Not done** — awaits approval + `implemented: true` |
| Legal compliance / PDPA certification            | **Not claimed**                                      |
| Production form / email activation               | Unchanged / still gated                              |

## Next

Step 55 — system pages and states (404, errors, loading, unavailable). Do not start automatically.
