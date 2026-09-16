# Zatroz website — launch scope

**Document status:** Draft for founder review  
**Created:** 16 September 2026  
**Sources used:**

- `docs/prompts/Zatroz_Cursor_Prompts_Steps_01_to_10.md` (shared decisions)
- `docs/prompts/Zatroz_Website_Development_Plan.docx` via text export `docs/reference/website-development-plan.md`

This file is the working source of truth for launch scope before website code is generated. It does not claim that business decisions are already approved by the founders.

---

## 1. Company overview and audience

Zatroz is a service-based IT startup with three founders. It presents itself as a software studio that helps smaller businesses improve how they sell, serve customers, and manage everyday work through design and custom software.

**Primary audience:** SMEs and local businesses in Sri Lanka.  
**Secondary audience:** international clients where a remote engagement is realistic.  
**Also expected visitors:** startup founders assessing an MVP path, organisations needing systems or integrations, and people evaluating the team for collaboration or hiring.

**Launch language:** English. Content structure should allow later Tamil and Sinhala expansion without requiring a full rewrite on day one.

---

## 2. Business goal

The website exists to generate **qualified project enquiries**: a real person, a relevant business need, and enough context for a useful follow-up.

It is not enough to attract visual attention alone. Success measures later should distinguish:

| Signal                         | Meaning                                      |
| ------------------------------ | -------------------------------------------- |
| Enquiry submitted and stored   | Primary conversion                           |
| Enquiry fits offered services  | Lead quality                                 |
| Meeting confirmed              | Follow-up progress (not automatic from form) |
| Proposal requested             | Sales progress                               |
| WhatsApp click                 | Interest only, not a confirmed conversation  |
| Meeting preference on the form | A request, not a booked appointment          |

---

## 3. Main visitor questions

The site should answer these quickly:

1. **What do you build?** — websites, apps, business systems, automation, custom software, and UI/UX design.
2. **Who does it help?** — smaller businesses and startups with practical selling, service, and operations problems.
3. **Where is the proof?** — verified project stories with honest status labels.
4. **How do you deliver?** — milestones, feedback, handover, and support explained on Process.
5. **How do I start?** — Start a project / Contact, plus WhatsApp as a secondary path.

---

## 4. Launch scope (counts)

| Item                  | Launch count | Notes                                                         |
| --------------------- | ------------ | ------------------------------------------------------------- |
| General pages         | **8**        | Home, About, Services, Work, Process, Contact, Privacy, Terms |
| Service detail pages  | **6**        | One page per service group below                              |
| Project stories       | **2 or 3**   | Only verified, permissioned stories                           |
| Case-study URL scheme | **One**      | Use `/work/[slug]` only; no parallel `/case-studies` routes   |

Utility routes planned later in implementation (404, sitemap, robots, icons) are technical necessities, not extra marketing pages in this count.

---

## 5. General pages

| Page     | Purpose                                              | Primary next action     |
| -------- | ---------------------------------------------------- | ----------------------- |
| Home     | Explain the offer, show evidence, help choose a path | Start a project         |
| About    | Company story, founders, values, approach            | Enquire / meet the team |
| Services | Compare the six capability groups                    | Open a relevant service |
| Work     | Present projects with accurate status                | Read a project story    |
| Process  | Milestones, feedback, handover, support              | Start a project         |
| Contact  | Enquiry form and direct contact options              | Send project enquiry    |
| Privacy  | What information is collected and how it is handled  | Contact privacy owner   |
| Terms    | Website use and relevant limitations                 | Contact Zatroz          |

---

## 6. Service groups and delivery capacity

Publish only services the team can deliver now or support through an identified collaborator. **Actual delivery capacity needs founder confirmation** (status: Needs input).

| Service group               | Intended route                 | Plain description                                                            | Delivery capacity                                        |
| --------------------------- | ------------------------------ | ---------------------------------------------------------------------------- | -------------------------------------------------------- |
| Websites and E-commerce     | `/services/websites-ecommerce` | Business sites, catalogues, and commerce-related builds                      | **Needs input** — TODO: confirm in-house vs collaborator |
| Web and Mobile Applications | `/services/web-mobile-apps`    | Browser tools and mobile experiences around clear tasks                      | **Needs input**                                          |
| Business Systems            | `/services/business-systems`   | POS, stock, reporting, internal operations software                          | **Needs input** — POS hardware/support boundaries TBD    |
| AI and Automation           | `/services/ai-automation`      | Practical AI features and workflow automation with human review where needed | **Needs input**                                          |
| Custom Software             | `/services/custom-software`    | Unusual requirements, integrations, phased improvement                       | **Needs input**                                          |
| UI/UX Design                | `/services/ui-ux-design`       | Discovery, journeys, wireframes, interface design                            | **Needs input**                                          |

Do not publish fixed package prices, unlimited scope, fixed delivery times, or compliance guarantees without a project-specific basis.

---

## 7. Planned enquiry flow (requirement only — not built in Steps 01–02)

Future implementation must:

1. Validate the submission on the server (even if the browser already validated).
2. Save the enquiry **durably** before reporting success.
3. Report success to the visitor only after storage succeeds; include a short reference and next steps.
4. Notify the team (transactional email).
5. Recover notification failures through bounded retries and an alert path for manual attention.

Spam protection (for example Turnstile) and rate limiting are part of the later secure endpoint design. Public content does not need a database at launch; enquiries do.

---

## 8. Quality requirements (future measurable checks)

These are launch requirements. Steps 01–02 do **not** claim current compliance.

| Area            | Requirement                                                          | Example future checks                                                      |
| --------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Responsive      | Useful layout from ~320px upward; content-driven breakpoints         | Manual width checks at 320, 375, 768, 1024, 1280, 1440; real phone test    |
| Accessibility   | Target WCAG 2.2 Level AA intent                                      | Keyboard pass, focus visibility, automated scan + screen-reader spot check |
| Performance     | Fast enough on ordinary mobile connections                           | Production build LCP/INP/CLS review on Home, service, project, Contact     |
| Security        | Protect enquiry endpoint; keep secrets server-only                   | Validation, rate limits, Turnstile verify, no PII in logs                  |
| SEO             | Unique titles/descriptions, canonical URLs, sitemap for public pages | Metadata review; Search Console after domain is live                       |
| Maintainability | Clear folders, typed content, reviewed Git changes                   | Quality scripts (`lint`, `typecheck`, `build`) once the app exists         |

---

## 9. Explicit later features (out of launch)

Add only when content or operations justify them:

| Later item                                         | Trigger (high level)                                            |
| -------------------------------------------------- | --------------------------------------------------------------- |
| CMS                                                | Nontechnical editors need frequent publishing                   |
| Custom admin dashboard                             | Lead volume or multi-staff workflows require it                 |
| Customer accounts / login                          | Product or client portal need is real                           |
| Booking integration                                | Someone owns availability and confirmation process              |
| Insights / blog                                    | Publishing owner + enough useful articles                       |
| Products / Labs pages                              | Real demos with maturity labels and support paths               |
| Live AI chatbot on this marketing site             | Not required for launch; company may still build AI for clients |
| Public package pricing page                        | Founders agree stable inclusions, exclusions, and costs         |
| Careers / Support / Accessibility standalone pages | Real openings, support process, or accessibility contact exists |

**Launch exclusions for Zatroz’s own marketing site:** customer login/sign-up, custom admin, payments/checkout on this site, live AI chatbot, file uploads on the enquiry form.

Building commerce or AI tools **for clients** does not require those features on the Zatroz marketing website.

---

## 10. Technical baseline

| Topic                   | Baseline choice                                            | Why                                                              |
| ----------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------- |
| Frontend                | Next.js App Router, React, TypeScript, Tailwind CSS        | One codebase for pages, metadata, and a small server endpoint    |
| Content                 | Repository-managed typed content / Markdown                | Simple review via Git; no CMS at launch                          |
| Enquiries later         | Next.js route + Supabase PostgreSQL + Resend               | Durable save before email; no separate CRM required              |
| Spam protection later   | Turnstile + host rate limiting                             | Layered protection for a public form                             |
| Hosting later           | GitHub + Vercel (business-suitable plan)                   | Managed Next.js hosting and previews                             |
| Design direction        | Warm-white editorial, charcoal sections, orange brand      | From shared decisions / plan                                     |
| Main colours            | Orange `#FF3B10`, charcoal `#111111`, warm white `#F7F5F2` | Use **dark text** on the bright orange primary button            |
| Typography later        | Manrope; optional IBM Plex Mono for limited labels         | Step 11+ design system                                           |
| Motion later            | CSS first; limited GSAP; respect reduced motion            | Distinctive but restrained                                       |
| Separate Express server | **Not needed**                                             | Node runs behind the Next.js route; Supabase supplies PostgreSQL |

---

## 11. Content and business dependencies

| Dependency                                                           | Owner (role)                      | Status                                                     |
| -------------------------------------------------------------------- | --------------------------------- | ---------------------------------------------------------- |
| Confirm three founder display names, roles, bios, portraits, consent | Founders                          | Partially known — Divejikan named in plan; others **TODO** |
| Vector logo and approved brand variants                              | Brand owner / Divejikan           | **TODO** — not present in this repository yet              |
| Two or three verified project stories + publication permission       | Project owners                    | Candidates noted in content docs; not approved             |
| Final contact URLs (LinkedIn full URL, domain)                       | Founders                          | Partial contacts known; LinkedIn URL and domain **TODO**   |
| Response-time public promise                                         | Enquiry monitor owner             | Do not publish until monitored                             |
| Privacy/terms legal review for actual operations                     | Founders + legal advice if needed | **TODO**                                                   |
| Production domain and commercial hosting budget                      | Founders                          | Later setup steps                                          |
| Who monitors enquiries each business day                             | Named founder (TBD)               | **TODO**                                                   |
| Delivery capacity per service group                                  | Founders                          | **Needs input**                                            |

---

## 12. Launch readiness and scope-change procedure

### Launch readiness (definition)

Launch is ready when:

1. All eight general pages and six service pages publish honest, reviewed content (no invented proof).
2. Two or three project stories are verified, permissioned, and correctly labelled.
3. Contact enquiry flow validates, stores durably, shows honest success/failure, notifies the team, and recovers notification failures.
4. Privacy and Terms match actual data handling.
5. Responsive, accessibility, performance, security, and SEO checks for the release checklist are recorded with owners for any remaining gaps.
6. No launch-excluded features are half-implemented in a misleading way.

### Scope-change procedure

1. Write the proposed change in `docs/planning/decision-register.md` with status **Proposed**.
2. Note impact on pages, content, timeline, and risk.
3. Founders set status to **Confirmed** or reject it.
4. Update this scope document and `docs/progress.md` in the same change set.
5. Do not implement large scope additions inside an unrelated coding step.

---

## Consistency check (Step 01)

| Check                             | Result                                                                                           |
| --------------------------------- | ------------------------------------------------------------------------------------------------ |
| Launch vs later scope contradict? | No — later items have clear triggers; launch exclusions are explicit                             |
| Page counts                       | 8 general + 6 services + 2–3 stories match the plan and this pack                                |
| Missing business facts            | Listed as TODO / Needs input; not invented                                                       |
| Source limitation                 | Plan `.docx` was readable via text export; formatting-only details may differ from the Word file |
