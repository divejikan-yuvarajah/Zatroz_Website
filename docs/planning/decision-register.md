# Decision register

**Purpose:** Track project choices and their approval state.  
**Statuses:** `Proposed` · `Confirmed` · `Needs input`  
**Rule:** Technical defaults from the plan/prompt pack start as **Proposed**. Do not treat them as founder-approved until confirmed.

| ID | Decision | Current choice | Status | Owner | Reason | Evidence needed |
| --- | --- | --- | --- | --- | --- | --- |
| D-001 | Company positioning | Software studio helping SMEs improve sell/serve/operate via design and custom software | Proposed | Founders | Aligns with website plan positioning statement | Founder wording approval |
| D-002 | Primary audience | Sri Lankan SMEs/local businesses; room for international clients | Proposed | Founders | Shared baseline in prompt pack | Confirm geographic claims on site |
| D-003 | Primary website goal | Qualified project enquiries | Proposed | Founders | Business outcome over vanity metrics | Agree success definitions |
| D-004 | Primary CTA label | Start a project → Contact | Proposed | Founders | Plan and pack baseline | UI copy review |
| D-005 | Secondary CTAs | Explore our work; Chat on WhatsApp | Proposed | Founders | Interest paths without fake booking | Confirm WhatsApp number for launch |
| D-006 | Launch language | English first; structure for later Tamil/Sinhala | Proposed | Founders | Capacity and content ownership | Language expansion owner later |
| D-007 | Launch page set | 8 general + 6 service detail + 2–3 project stories | Proposed | Founders | Matches plan architecture | Confirm story count when materials ready |
| D-008 | Case study URLs | `/work/[slug]` only (no `/case-studies`) | Proposed | Engineering lead | Avoid duplicate content | Documented in `docs/planning/03-sitemap.md` (Step 03) |
| D-009 | Service catalogue | Six groups listed in scope doc | Needs input | Founders | Capacity must match public claims | Per-service delivery capacity confirmation |
| D-010 | Frontend stack | Next.js 16.3.5 App Router, React 19.2.8, TypeScript, Tailwind 4.3.3 | Proposed | Engineering | One app for UI + enquiry endpoint | Recorded in `docs/setup/project-initialization.md` |
| D-011 | Public content system | Repository-managed content; no CMS at launch | Proposed | Engineering + founders | Simple review workflow | Confirm who edits content |
| D-012 | Enquiry backend | Next.js server route → durable Supabase store → Resend notify + retry | Proposed | Engineering | Reliable lead capture without Express | Provision accounts in later steps |
| D-013 | Separate Express API | Not used for launch | Proposed | Engineering | Unnecessary duplication with Next.js | Revisit only with concrete need |
| D-014 | Spam protection | Turnstile + rate limiting (later) | Proposed | Engineering | Public form abuse risk | Keys and WAF rules in later steps |
| D-015 | Hosting | GitHub + Vercel commercial-suitable plan | Proposed | Founders | Next.js hosting; Hobby may be non-commercial | Budget and account ownership |
| D-016 | Design direction | Warm-white editorial, charcoal sections, original workflow illustrations | Proposed | Design owner | Distinctive but practical brand | Design system Step 11 |
| D-017 | Brand colours | `#FF3B10`, `#111111`, `#F7F5F2`; dark text on orange primary button | Proposed | Design owner | Pack/plan colours; contrast caution | Contrast check in design system |
| D-018 | Typography | Manrope; optional IBM Plex Mono for limited labels | Proposed | Design owner | Plan recommendation | Licence and self-hosting at typography step |
| D-019 | Hero concept | “Connected business” with three labelled examples | Proposed | Design + founders | Plan hero direction | Final headline/copy approval |
| D-020 | Motion approach | CSS first; limited GSAP; respect `prefers-reduced-motion` | Proposed | Engineering | Restrained distinctive motion | Performance budget after implementation |
| D-021 | Launch exclusions | No customer auth, custom admin, on-site payments, live chatbot, enquiry file uploads | Proposed | Founders | Keep first release focused | Confirm no conflicting marketing promises |
| D-022 | Contact phone | `+94 76 809 8068` (WhatsApp digits `94768098068`) | Needs input | Founders | Supplied in plan; confirm for launch | Live WhatsApp test on phone + desktop |
| D-023 | Contact email | `zatroz.co@gmail.com` | Needs input | Founders | Supplied in plan; confirm for launch | Mailbox monitoring ownership |
| D-024 | Instagram | Handle `zatroz.co` | Needs input | Founders | Supplied handle; full URL still needed | Verified profile URL |
| D-025 | LinkedIn | Display name `Zatroz` | Needs input | Founders | Display name known; URL unknown | Exact public profile/company URL |
| D-026 | Production domain | Not chosen | Needs input | Founders | Required before public SEO/SITE_URL | Registered domain + DNS ownership |
| D-027 | Founder profiles | Three founders; Divejikan referenced; others unnamed here | Needs input | Founders | Do not invent identities | Approved names, roles, bios, portraits, consent |
| D-028 | Launch project stories | Prefer 2 excellent verified stories over many incomplete ones | Needs input | Project owners | Candidates: FlowPilot AI, InvoiceX AI (verify) | Status, contribution, permission, screenshots |
| D-029 | Public response-time promise | Do not publish until monitored | Proposed | Enquiry owner | Plan warns against premature SLA | Named daily monitor |
| D-030 | Public package prices | Not on launch site until inclusions/exclusions stable | Proposed | Founders | Avoid misleading quotations | Reviewed price sheet if ever published |
| D-031 | Primary button contrast | Dark text on `#FF3B10` (do not assume white small text is OK) | Proposed | Design | Accessibility caution in pack | Contrast measurement Step 11 |
| D-032 | Analytics distinctions | WhatsApp click ≠ conversation; meeting request ≠ booking | Proposed | Engineering + founders | Honest measurement | Event naming in analytics step |
| D-033 | Desktop primary nav | Logo→Home; Services; Work; About; Process; Start a project→Contact | Proposed | Engineering + founders | Pack Step 03 | Confirm labels in UI review |
| D-034 | Contact service preselect | `/contact?service=` with six allowlisted slugs; unknown → Not sure | Proposed | Engineering | Safer deep links from services | Implement only with untrusted-query handling |
| D-035 | Node toolchain | Keep installed Node **v24.10.0** (Active LTS) with npm 11.6.1 | Proposed | Engineering | Meets Next.js ≥20.9; matches pack Node 24 baseline | Re-verify at Step 06 scaffold |
| D-036 | GitHub repository | `https://github.com/divejikan-yuvarajah/Zatroz_Website.git` as `origin` | Proposed | Founders | User-created remote for this project | Confirm visibility (private recommended) and first push succeeds |

---

## How to update

1. Change **Status** only when a founder (or named owner) explicitly confirms or rejects.
2. Add a short note in `docs/progress.md` when a decision moves to Confirmed.
3. Never delete unresolved rows; mark them Needs input with a clear TODO.
