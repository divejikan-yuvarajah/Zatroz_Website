# Asset register

**Purpose:** Track real and missing visual assets for launch.  
**Rule:** Inventory supplied files honestly. Missing assets stay `Missing` — never imply they are in `public/`.

**Statuses:** `Missing` · `Supplied (private)` · `Needs review` · `Approved for public/`

Publication permission: `Unknown` · `Denied` · `Approved`

Inspected repository on 2026-09-16: no logo, portrait, or project image files were present under the project folder (only planning docs).

---

## Brand

| Asset ID  | Proposed filename         | Intended page / use                    | Supplied source path | Proposed public path                       | Owner        | Publication permission | Caption / alt requirement                              | Status  |
| --------- | ------------------------- | -------------------------------------- | -------------------- | ------------------------------------------ | ------------ | ---------------------- | ------------------------------------------------------ | ------- |
| A-LOGO-01 | `zatroz-logo.svg`         | Nav, footer, metadata                  | —                    | `public/brand/zatroz-logo.svg`             | Brand owner  | Unknown                | Alt: “Zatroz” (or empty if adjacent text repeats name) | Missing |
| A-LOGO-02 | `zatroz-logo-mark.svg`    | Compact / favicon source               | —                    | `public/brand/zatroz-logo-mark.svg`        | Brand owner  | Unknown                | Decorative or “Zatroz mark”                            | Missing |
| A-LOGO-03 | `zatroz-wordmark.svg`     | Footer / charcoal sections if supplied | —                    | `public/brand/zatroz-wordmark.svg`         | Brand owner  | Unknown                | “Zatroz”                                               | Missing |
| A-OG-01   | `og-default.png`          | Default social share ~1200×630         | —                    | `public/brand/og-default.png`              | Design owner | Unknown                | Not used as on-page image; still needs safe text area  | Missing |
| A-ICON-01 | `favicon.ico` / app icons | Browser icons                          | —                    | `public/` icons per Next conventions later | Design owner | Unknown                | N/A                                                    | Missing |

---

## Team

| Asset ID  | Proposed filename       | Intended page      | Supplied source path | Proposed public path                       | Owner     | Publication permission | Caption / alt requirement                      | Status                 |
| --------- | ----------------------- | ------------------ | -------------------- | ------------------------------------------ | --------- | ---------------------- | ---------------------------------------------- | ---------------------- |
| A-TEAM-01 | `founder-divejikan.jpg` | About, Home people | —                    | `public/images/team/founder-divejikan.jpg` | Divejikan | Unknown                | Descriptive alt with name + role once approved | Missing                |
| A-TEAM-02 | `founder-02.jpg`        | About              | —                    | `public/images/team/founder-02.jpg`        | Founder 2 | Unknown                | Name + role                                    | Missing — identity TBD |
| A-TEAM-03 | `founder-03.jpg`        | About              | —                    | `public/images/team/founder-03.jpg`        | Founder 3 | Unknown                | Name + role                                    | Missing — identity TBD |
| A-TEAM-04 | `team-photo.jpg`        | About (optional)   | —                    | `public/images/team/team-photo.jpg`        | Founders  | Unknown                | Honest group photo alt; no stock office        | Missing                |

---

## Project stories (placeholders until stories chosen)

| Asset ID     | Proposed filename            | Intended page                    | Supplied source path | Proposed public path                               | Owner         | Publication permission | Caption / alt requirement     | Status  |
| ------------ | ---------------------------- | -------------------------------- | -------------------- | -------------------------------------------------- | ------------- | ---------------------- | ----------------------------- | ------- |
| A-PROJ-FP-01 | `flowpilot-ai-overview.png`  | `/work/flowpilot-ai` (if chosen) | —                    | `public/images/projects/flowpilot-ai-overview.png` | Project owner | Unknown                | UI purpose caption; strip PII | Missing |
| A-PROJ-IX-01 | `invoicex-ai-overview.png`   | `/work/invoicex-ai` (if chosen)  | —                    | `public/images/projects/invoicex-ai-overview.png`  | Project owner | Unknown                | UI purpose caption; strip PII | Missing |
| A-PROJ-XX-01 | `project-third-overview.png` | Third launch story if selected   | —                    | `public/images/projects/...`                       | Project owner | Unknown                | Depends on chosen story       | Missing |

Do not place raw unapproved screenshots in `public/`. Keep private source packs outside Git if the repository may become public.

---

## Illustrations (later design/build)

| Asset ID       | Proposed filename                            | Intended use | Status                           |
| -------------- | -------------------------------------------- | ------------ | -------------------------------- |
| A-ILLUS-HERO   | Original connected-business workflow graphic | Home hero    | Missing — create in design steps |
| A-ILLUS-SERV-* | Service explorer visuals                     | Services     | Missing                          |

---

## Summary

| Category               | Supplied in repo | Missing               |
| ---------------------- | ---------------- | --------------------- |
| Brand logos            | 0                | All listed brand rows |
| Team photos            | 0                | All team rows         |
| Project screenshots    | 0                | All project rows      |
| Original illustrations | 0                | Planned for later     |

**Highest-priority assets to supply:** vector logo, three founder portraits (with consent), and screenshots for the chosen 2–3 project stories.
