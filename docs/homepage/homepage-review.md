# Homepage integration review (Steps 19–28)

**Date:** 2026-09-18  
**Branch:** `feature/28-home-cta`

This review separates **technical completion** from **content approval** and **launch readiness**. Homepage components being built does **not** mean the website is ready to launch.

---

## Section matrix

| Section            | ID                   | Technical | Content approval       | Destination readiness                        | Manual checks | Blockers                                                            |
| ------------------ | -------------------- | --------- | ---------------------- | -------------------------------------------- | ------------- | ------------------------------------------------------------------- |
| Hero               | `home-hero`          | Done      | Draft                  | CTAs omit until Contact/email/WhatsApp ready | Pending       | Approve hero copy; confirm contacts or implement `/contact`         |
| Evidence           | `home-evidence`      | Done      | Intro draft; 0 items   | N/A                                          | Pending       | Verified claims                                                     |
| Selected work      | `selected-work`      | Done      | Empty features         | `/work` unimplemented                        | Pending       | Approved featured projects + media                                  |
| Service explorer   | `services-explorer`  | Done      | Draft needs            | Service routes unimplemented                 | Pending       | Approve needs; implement service pages                              |
| Automation example | `automation-example` | Done      | Draft                  | AI route unimplemented                       | Pending       | Approve copy                                                        |
| Process            | `how-we-work`        | Done      | Draft                  | `/process` unimplemented                     | Pending       | Approve steps; optional process page                                |
| People             | `people`             | Done      | Draft; 0 founders      | `/about` unimplemented                       | Pending       | Approve company intro; founder cards                                |
| Feedback / FAQs    | `questions`          | Done      | Draft FAQs; 0 feedback | Enquiry fallbacks gated                      | Pending       | Approve framing + FAQs; optional testimonial                        |
| Final invitation   | `start-a-project`    | Done      | Draft                  | **No usable action**                         | Pending       | Confirm email/WhatsApp **or** implement `/contact`; approve framing |

---

## Composition audit (code review)

| Check                                    | Result                                                  |
| ---------------------------------------- | ------------------------------------------------------- |
| One `<main>` via SiteShell               | Pass (layout owns main)                                 |
| One public H1                            | Pass while draft placeholder / hero H1 when approved    |
| Unique section IDs                       | Pass (`home-hero` … `start-a-project`)                  |
| Anchors only for rendered sections       | Pass (`getHomeComposition`)                             |
| Draft gallery fixtures not on public `/` | Pass (public getters require approval + content gates)  |
| No page-wide client boundary             | Pass (client islands only where interaction needs them) |
| Native FAQs without JS                   | Pass (`FaqDisclosure` details/summary)                  |
| Final CTA self-link avoided              | Pass                                                    |
| `/contact` not auto-enabled              | Pass (`implemented: false`)                             |

---

## Remaining assets and decisions

1. Confirm email and/or WhatsApp (or ship Contact page) — **blocks public final invitation**.
2. Approve homepage framing copy for each draft section.
3. Supply verified evidence, featured projects, founder profiles, permitted feedback.
4. Implement later pages: services, work, about, process, contact, privacy, terms.
5. Enquiry form + backend remain future steps — not claimed here.

---

## Future page dependencies

| Need                        | Depends on                                  |
| --------------------------- | ------------------------------------------- |
| Live “Start a project” path | `/contact` or confirmed email/WhatsApp      |
| Service deep-links          | Service overview + detail routes (Step 29+) |
| Work stories                | `/work` + approved projects                 |
| About / Meet Zatroz         | `/about` + approved founders                |
| Process detail              | `/process`                                  |
| Policies                    | `/privacy`, `/terms`                        |

---

## Manual / lab checks

| Check                                                        | Status                                      |
| ------------------------------------------------------------ | ------------------------------------------- |
| Desktop/mobile nav, Services disclosure, sticky header focus | **Not run** (browser review pending)        |
| Hero scenarios, explorer, automation walkthrough, FAQ open   | **Not run**                                 |
| Viewports 320/390/768/1024/1440 + 200% zoom + reduced motion | **Not run**                                 |
| Production `/` smoke after `next start`                      | Recorded with Step 28 checks when run       |
| `/dev/ui` unavailable under `next start`                     | Recorded with Step 28 checks when run       |
| Lighthouse / Core Web Vitals                                 | **Not claimed** — deferred to release steps |

---

## Verdict

**Homepage components (Steps 19–28) are technically complete** for the current content model and publication gates.

**The website is not launch-ready.** Public `/` correctly stays sparse until content is approved and a usable enquiry channel exists.
