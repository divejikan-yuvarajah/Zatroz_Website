# Content inventory

**Purpose:** List required launch content, owners, and honest status.  
**Statuses:** `Missing` · `Draft` · `Needs review` · `Approved`  
**Rule:** Generated planning copy is never marked Approved. Only founder-reviewed publishable text earns Approved.

Owners use roles until names are confirmed.

---

## Site-wide shared content

| ID     | Content item              | Required sections / fields                                | Source material          | Owner         | Status | Missing inputs                                                                       |
| ------ | ------------------------- | --------------------------------------------------------- | ------------------------ | ------------- | ------ | ------------------------------------------------------------------------------------ |
| C-NAV  | Primary navigation labels | Services, Work, About, Process, Start a project           | Prompt pack / plan       | Content owner | Draft  | Final label wording                                                                  |
| C-FOOT | Footer                    | Short blurb, contact links, services list, Privacy, Terms | Brand/contact + services | Content owner | Draft  | Approved blurb; confirm phone/email/WhatsApp; exact social URLs; Privacy/Terms pages |
| C-CTA  | Shared CTA copy           | Start a project; Explore our work; Chat on WhatsApp       | Decision register        | Content owner | Draft  | Confirmation of labels                                                               |
| C-META | Default SEO defaults      | Site name, default description pattern                    | Plan examples            | Content owner | Draft  | Production domain; final taglines                                                    |

---

## General pages

### Home (`/`)

| ID        | Section                   | Required content                                              | Source                     | Owner          | Status  | Missing inputs                                                                                            |
| --------- | ------------------------- | ------------------------------------------------------------- | -------------------------- | -------------- | ------- | --------------------------------------------------------------------------------------------------------- |
| C-HOME-01 | Hero                      | Headline, supporting sentence, 2 CTAs, optional location line | Plan draft headline exists | Content owner  | Draft   | Founder-approved headline; location accuracy                                                              |
| C-HOME-02 | Evidence introduction     | Short intro + 2–3 verified proof items                        | Project/founder evidence   | Founders       | Missing | Verified claims only; section code ready, public strip omitted until approval                             |
| C-HOME-03 | Selected work             | 2–3 featured projects with status                             | Project stories            | Project owners | Missing | Approved stories + screenshots; section ready, public strip omitted until featured approved projects      |
| C-HOME-04 | Services by business need | Four need rows linking to services                            | Service descriptions       | Content owner  | Draft   | Capacity-aligned wording; explorer code ready, public strip omitted until approved                        |
| C-HOME-05 | Process teaser            | Short delivery summary + link                                 | Process page               | Content owner  | Draft   | Founder-approved process wording; section code ready, public strip omitted until approved                 |
| C-HOME-06 | People teaser             | Honest team intro                                             | Founder profiles           | Founders       | Missing | Profiles + portraits; section code ready, public strip omitted until company intro approved               |
| C-HOME-07 | Feedback and FAQs         | Approved questions + optional authentic feedback              | FAQ / feedback records     | Content owner  | Draft   | Approve FAQ answers; supply permitted testimonials only; section ready, public strip omitted              |
| C-HOME-08 | Closing CTA               | Invite to enquire + secondary contacts                        | Brand/contact              | Content owner  | Draft   | Confirm email/WhatsApp or implement `/contact`; approve framing; section ready, public invitation omitted |

### About (`/about`)

| ID         | Section             | Required content                          | Source              | Owner    | Status  | Missing inputs                               |
| ---------- | ------------------- | ----------------------------------------- | ------------------- | -------- | ------- | -------------------------------------------- |
| C-ABOUT-01 | Company story       | Why Zatroz exists; founding context       | Plan proposed story | Founders | Draft   | Founding date; specific real example         |
| C-ABOUT-02 | Mission / vision    | Short statements                          | Plan proposals      | Founders | Draft   | Approval or rewrite                          |
| C-ABOUT-03 | Founder profiles ×3 | Name, role, bio, portrait, links, consent | Founder template    | Founders | Missing | Two unnamed founders; Divejikan role wording |
| C-ABOUT-04 | Values              | Observable behaviours                     | Plan draft values   | Founders | Draft   | Confirmation                                 |
| C-ABOUT-05 | Timeline            | Real milestones with dates                | Company history     | Founders | Missing | Verified milestone list                      |
| C-ABOUT-06 | Future direction    | Growth direction without fake products    | Plan                | Founders | Draft   | Approval                                     |

### Services overview (`/services`)

| ID        | Section          | Required content                   | Source               | Owner         | Status | Missing inputs                 |
| --------- | ---------------- | ---------------------------------- | -------------------- | ------------- | ------ | ------------------------------ |
| C-SERV-00 | Explorer / index | Six groups + business-need framing | Plan service section | Content owner | Draft  | Delivery capacity confirmation |

### Service detail pages (shared schema ×6)

Each of the six routes needs:

| Field                                     | Status baseline                    |
| ----------------------------------------- | ---------------------------------- |
| Business-focused heading                  | Missing                            |
| Who it suits                              | Missing                            |
| Problems addressed                        | Draft ideas in plan — Needs review |
| Deliverables                              | Missing                            |
| One relevant example                      | Missing (depends on work)          |
| Delivery steps                            | Missing                            |
| Client inputs required                    | Missing                            |
| Scope boundaries / third-party cost notes | Missing                            |
| FAQs                                      | Missing                            |
| Preselected enquiry CTA                   | Draft pattern                      |

| ID        | Route                          | Owner                    | Status          | Missing inputs                        |
| --------- | ------------------------------ | ------------------------ | --------------- | ------------------------------------- |
| C-SERV-01 | `/services/websites-ecommerce` | Content + delivery owner | Draft (Step 31) | Capacity confirmation + copy approval |
| C-SERV-02 | `/services/web-mobile-apps`    | Content + delivery owner | Draft (Step 32) | Capacity confirmation + copy approval |
| C-SERV-03 | `/services/business-systems`   | Content + delivery owner | Missing         | POS hardware/support boundaries       |
| C-SERV-04 | `/services/ai-automation`      | Content + delivery owner | Missing         | Honest AI limitations wording         |
| C-SERV-05 | `/services/custom-software`    | Content + delivery owner | Missing         | Example boundaries                    |
| C-SERV-06 | `/services/ui-ux-design`       | Content + delivery owner | Missing         | Deliverable list                      |

### Work (`/work` and `/work/[slug]`)

| ID            | Content                                | Required                     | Source            | Owner          | Status  | Missing inputs                           |
| ------------- | -------------------------------------- | ---------------------------- | ----------------- | -------------- | ------- | ---------------------------------------- |
| C-WORK-00     | Work index intro + empty/filter states | Copy for All view            | Plan              | Content owner  | Missing | Final intro                              |
| C-WORK-01..03 | 2–3 project stories                    | Full project template fields | Project materials | Project owners | Missing | Permission, status, screenshots, results |

Suggested candidates (not approved): FlowPilot AI; InvoiceX AI. Unfinished concepts (INFRAOS, NEXORA) only if labelled accurately and useful.

### Process (`/process`)

| ID        | Section                                  | Status  | Missing inputs                     |
| --------- | ---------------------------------------- | ------- | ---------------------------------- |
| C-PROC-01 | Milestone steps + client outputs         | Missing | Founder-confirmed delivery process |
| C-PROC-02 | Feedback / handover / support boundaries | Missing | What support is actually offered   |
| C-PROC-03 | Ownership, third-party costs explanation | Missing | Standard commercial wording        |

### Contact (`/contact`)

| ID           | Section                                  | Status       | Missing inputs                        |
| ------------ | ---------------------------------------- | ------------ | ------------------------------------- |
| C-CONTACT-01 | Invitation copy + what happens next      | Draft        | Public response-time promise decision |
| C-CONTACT-02 | Form field labels/help (per plan schema) | Draft        | Final budget band currency policy     |
| C-CONTACT-03 | Direct email / WhatsApp / social         | Needs review | Launch confirmation of numbers/URLs   |
| C-CONTACT-04 | Privacy notice beside submit             | Missing      | Privacy version text                  |

### Privacy (`/privacy`) and Terms (`/terms`)

| ID         | Page                                    | Status  | Missing inputs                         |
| ---------- | --------------------------------------- | ------- | -------------------------------------- |
| C-LEGAL-01 | Privacy notice matching real processing | Missing | Legal review; data retention decisions |
| C-LEGAL-02 | Website terms (not a service contract)  | Missing | Legal review                           |

---

## Coverage check

| Launch surface                       | Inventory rows present? |
| ------------------------------------ | ----------------------- |
| 8 general pages                      | Yes                     |
| 6 service detail pages               | Yes                     |
| Work index + story template coverage | Yes                     |
| Shared nav/footer/CTA/meta           | Yes                     |

**Highest-priority missing content:** founder profiles, verified project stories, logo/brand assets, legal pages, service capacity-aligned copy.
