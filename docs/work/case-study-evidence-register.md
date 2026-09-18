# Case-study evidence register (Step 39)

**Date:** 2026-09-18  
**Rule:** Separate plan statements, independently checked evidence, and unknowns. Do not treat candidates as approved or published.

**Catalog status:** `src/content/projects.ts` remains **empty** (0 published summaries, 0 published stories). No screenshots exist under `public/images/projects/` except the labelled gallery fixture `specimen-ui-frame.svg`.

---

## Selection decision

| Outcome                          | Detail                                                                                          |
| -------------------------------- | ----------------------------------------------------------------------------------------------- |
| Stories selected for publication | **None**                                                                                        |
| Reason                           | No candidate has verified contribution, permission, screenshots, and publishable facts together |
| Public `/work`                   | Honest empty state (already implemented)                                                        |
| Public `/work/[slug]`            | All candidate slugs continue to **404** until approved stories exist                            |

One complete truthful story later is preferable to three invented ones (D-028).

---

## Candidate A — FlowPilot AI

| Field                     | Value                                                                                           | Evidence class    |
| ------------------------- | ----------------------------------------------------------------------------------------------- | ----------------- |
| Proposed ID               | `proj-flowpilot-ai`                                                                             | Proposed identity |
| Proposed slug             | `flowpilot-ai`                                                                                  | Proposed identity |
| Actual project name       | FlowPilot AI (plan/candidate name only)                                                         | Plan statement    |
| Work status               | **Unverified** — plan suggests Prototype; confirm                                               | Unknown           |
| Ownership / attribution   | Plan mentions Team ZeroDB + founder contribution **if correct** — **not independently checked** | Unverified        |
| Problem                   | Unknown                                                                                         | Unknown           |
| Target users              | Unknown                                                                                         | Unknown           |
| Actual contribution       | Unknown — do not invent scope                                                                   | Unknown           |
| Implemented features      | Unknown                                                                                         | Unknown           |
| Verified technologies     | Unknown                                                                                         | Unknown           |
| Available artifacts       | None in repository                                                                              | Checked (absent)  |
| Measured outcomes         | Any FinTech/competition result **blocked** until event, category, placing, and rights confirmed | Unknown / blocked |
| Source references         | `docs/content/project-story-template.md`, website plan § portfolio notes                        | Plan only         |
| Screenshot permissions    | Unknown — `A-PROJ-FP-01` Missing                                                                | Unknown           |
| Publication permission    | Unknown                                                                                         | Unknown           |
| Prepared for publication? | **No**                                                                                          | —                 |

### Shot list (when capture is authorized)

1. Overview of the primary workflow screen (synthetic demo data only).
2. One focused state that shows the founder’s actual contribution (not the whole product).
3. Optional: empty/error or review state if it explains the work.
4. Minimum readable resolution ~1600px wide; redacted pixels before `public/`.

### Owner decisions needed

1. Confirm work status label (client work / live product / prototype / research concept).
2. Confirm Team ZeroDB attribution and Divejikan’s actual contribution in one sentence.
3. Approve which features were truly implemented vs planned.
4. Confirm or deny any award/event claim with exact name, track, placing, and permission.
5. Approve screenshots + public paths (or keep story text-first).
6. Explicitly approve summary and story for `publicationState: approved`.

---

## Candidate B — InvoiceX AI

| Field                     | Value                                  | Evidence class    |
| ------------------------- | -------------------------------------- | ----------------- |
| Proposed ID               | `proj-invoicex-ai`                     | Proposed identity |
| Proposed slug             | `invoicex-ai`                          | Proposed identity |
| Actual project name       | InvoiceX AI (plan/candidate name only) | Plan statement    |
| Work status               | Unknown                                | Unknown           |
| Ownership / attribution   | Unknown                                | Unknown           |
| Problem / users           | Unknown                                | Unknown           |
| Actual contribution       | Unknown                                | Unknown           |
| Implemented features      | Unknown                                | Unknown           |
| Verified technologies     | Unknown                                | Unknown           |
| Available artifacts       | None in repository                     | Checked (absent)  |
| Measured outcomes         | None recorded                          | Unknown           |
| Source references         | Project story template candidate B     | Plan only         |
| Screenshot permissions    | Unknown — `A-PROJ-IX-01` Missing       | Unknown           |
| Publication permission    | Unknown                                | Unknown           |
| Prepared for publication? | **No**                                 | —                 |

### Shot list (when capture is authorized)

1. Overview of the invoice/workflow surface with synthetic data.
2. One focused create/review state tied to the real contribution.
3. Optional: export or status screen if it is part of what was built.
4. Redact customer names, amounts, emails, and credentials in the export.

### Owner decisions needed

1. Confirm whether InvoiceX AI is in scope for launch.
2. Confirm status, attribution, and contribution sentence.
3. List 3–5 implemented capabilities with source (repo, demo, design file).
4. Approve media or accept text-first draft until media exists.
5. Explicit approval of summary + story publication.

---

## Candidate C — third web / business-system story

| Field                     | Value                                                                 | Evidence class |
| ------------------------- | --------------------------------------------------------------------- | -------------- |
| Proposed ID               | `proj-launch-third` (rename when real project chosen)                 | Placeholder    |
| Proposed slug             | TBD                                                                   | Unknown        |
| Actual project name       | **Not selected** — prefer a permissioned client or live product story | Unknown        |
| Prepared for publication? | **No**                                                                | —              |

### Owner decisions needed

1. Name a real candidate with permission to publish.
2. Or confirm launch ships with zero or one story only until evidence arrives.

---

## Not selected (without careful labelling)

| Name    | Note                                                               | Prepared? |
| ------- | ------------------------------------------------------------------ | --------- |
| INFRAOS | Plan: unfinished concept — only as Research concept if ever useful | No        |
| NEXORA  | Plan: unfinished concept — same rule                               | No        |

---

## Independently checked in this step

| Check                                          | Result        |
| ---------------------------------------------- | ------------- |
| `projectRecords` length                        | 0             |
| `mediaRecords` length                          | 0             |
| `featuredProjectIds`                           | `[]`          |
| Project screenshots in asset register          | All Missing   |
| Public demo/repo URLs supplied in content docs | None recorded |
| Founder-approved story prose in repository     | None          |

No private repositories were logged into. No screenshots were captured (no authorized app/export supplied).

---

## Counts (honest)

| Kind                         | Count |
| ---------------------------- | ----- |
| Published project summaries  | 0     |
| Published case studies       | 0     |
| Draft catalog project rows   | 0     |
| Editorial outline docs       | 3     |
| Approved public media assets | 0     |
