# Sitemap — launch routes

**Status:** Draft for implementation (no route files created yet)  
**Created:** 16 September 2026  
**Sources:** `docs/planning/01-project-scope.md`, content inventory, prompt pack Step 03

Canonical launch routes only. Do not add a parallel `/case-studies` scheme. `/work/[slug]` is the single project-story address.

`[slug]` is a real project’s URL segment. Two approved stories produce two detail pages; three produce three. Unknown slugs later get a useful 404 — not invented projects.

---

## Route catalogue

### Home — `/`

| Field              | Detail                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| Purpose            | Explain the offer, show evidence, help visitors choose a path                                     |
| Audience           | First-time business visitors                                                                      |
| Core sections      | Nav, hero, evidence, selected work, services-by-need, process/people teasers, closing CTA, footer |
| Content dependency | Hero copy; 2–3 verified proof/work items; service summaries                                       |
| Main CTA           | Start a project → `/contact`                                                                      |
| Related routes     | `/work`, `/services`, `/process`, `/about`, `/contact`                                            |

### About — `/about`

| Field              | Detail                                                                           |
| ------------------ | -------------------------------------------------------------------------------- |
| Purpose            | Introduce company, founders, values, approach                                    |
| Audience           | Visitors evaluating the people and trust                                         |
| Core sections      | Story, mission/vision, founder profiles, values, timeline, future direction, CTA |
| Content dependency | Three approved founder profiles; honest milestones                               |
| Main CTA           | Start a project → `/contact`                                                     |
| Related routes     | `/process`, `/work`, `/contact`                                                  |

### Services overview — `/services`

| Field              | Detail                                                               |
| ------------------ | -------------------------------------------------------------------- |
| Purpose            | Help visitors compare the six capability groups                      |
| Audience           | Visitors unsure which service fits                                   |
| Core sections      | Intro, service explorer / need-based rows, links to six details, CTA |
| Content dependency | Capacity-aligned service blurbs                                      |
| Main CTA           | Open a relevant service detail, or Contact with Not sure             |
| Related routes     | Six `/services/...` pages, `/contact`, `/work`                       |

### Websites and E-commerce — `/services/websites-ecommerce`

| Field              | Detail                                                                                                      |
| ------------------ | ----------------------------------------------------------------------------------------------------------- |
| Purpose            | Explain business websites, catalogues, and commerce-related builds                                          |
| Audience           | Owners needing a clearer web presence or online selling path                                                |
| Core sections      | Shared service schema (who it suits, problems, deliverables, example, steps, inputs, boundaries, FAQs, CTA) |
| Content dependency | Service copy + optional related project                                                                     |
| Main CTA           | Discuss a website → `/contact?service=websites-ecommerce`                                                   |
| Related routes     | `/services`, `/work`, `/contact`                                                                            |

### Web and Mobile Applications — `/services/web-mobile-apps`

| Field              | Detail                                                   |
| ------------------ | -------------------------------------------------------- |
| Purpose            | Explain web platforms and mobile apps around clear tasks |
| Audience           | Teams needing tools, portals, or mobile workflows        |
| Core sections      | Shared service schema                                    |
| Content dependency | Service copy; role/scope honesty                         |
| Main CTA           | `/contact?service=web-mobile-apps`                       |
| Related routes     | `/services`, `/work`, `/contact`                         |

### Business Systems — `/services/business-systems`

| Field              | Detail                                                        |
| ------------------ | ------------------------------------------------------------- |
| Purpose            | Explain POS, stock, reporting, and operations software        |
| Audience           | Businesses reducing manual administration                     |
| Core sections      | Shared service schema; hardware/support boundaries when known |
| Content dependency | Capacity and support boundary confirmation                    |
| Main CTA           | `/contact?service=business-systems`                           |
| Related routes     | `/services`, `/process`, `/contact`                           |

### AI and Automation — `/services/ai-automation`

| Field              | Detail                                                                       |
| ------------------ | ---------------------------------------------------------------------------- |
| Purpose            | Explain practical AI features and workflow automation with review boundaries |
| Audience           | Teams with repetitive interpretation or routing work                         |
| Core sections      | Shared service schema; human-review honesty                                  |
| Content dependency | Realistic examples; no overclaim                                             |
| Main CTA           | `/contact?service=ai-automation`                                             |
| Related routes     | `/services`, `/work`, `/contact`                                             |

### Custom Software — `/services/custom-software`

| Field              | Detail                                                       |
| ------------------ | ------------------------------------------------------------ |
| Purpose            | Cover unusual requirements, integrations, phased improvement |
| Audience           | Organisations whose needs do not fit off-the-shelf tools     |
| Core sections      | Shared service schema                                        |
| Content dependency | Clear scope/phasing language                                 |
| Main CTA           | `/contact?service=custom-software`                           |
| Related routes     | `/services`, `/process`, `/contact`                          |

### UI/UX Design — `/services/ui-ux-design`

| Field              | Detail                                                        |
| ------------------ | ------------------------------------------------------------- |
| Purpose            | Explain discovery, journeys, wireframes, and interface design |
| Audience           | Teams needing clearer product/website experience              |
| Core sections      | Shared service schema                                         |
| Content dependency | Deliverable list                                              |
| Main CTA           | `/contact?service=ui-ux-design`                               |
| Related routes     | `/services`, `/work`, `/contact`                              |

### Work overview — `/work`

| Field              | Detail                                                  |
| ------------------ | ------------------------------------------------------- |
| Purpose            | Present projects with accurate status and scope         |
| Audience           | Visitors evaluating capability and proof                |
| Core sections      | Intro, project cards (All view first), links to stories |
| Content dependency | 2–3 approved stories minimum for a strong launch        |
| Main CTA           | Read a project story                                    |
| Related routes     | `/work/[slug]`, `/contact`, `/services`                 |

### Project story — `/work/[slug]`

| Field              | Detail                                                                        |
| ------------------ | ----------------------------------------------------------------------------- |
| Purpose            | Canonical case study for one real project                                     |
| Audience           | Visitors comparing a similar problem to theirs                                |
| Core sections      | Problem, audience, contribution, solution, stack, results, limits, CTA        |
| Content dependency | Filled project template + permissioned media                                  |
| Main CTA           | Discuss a similar project → `/contact` (optional service preselect if mapped) |
| Related routes     | `/work`, related service, `/contact`                                          |

### Process — `/process`

| Field              | Detail                                              |
| ------------------ | --------------------------------------------------- |
| Purpose            | Explain milestones, feedback, handover, and support |
| Audience           | Visitors evaluating how engagement works            |
| Core sections      | Steps, client outputs, ownership/cost notes, CTA    |
| Content dependency | Founder-confirmed delivery process                  |
| Main CTA           | Start a project → `/contact`                        |
| Related routes     | `/about`, `/contact`, `/services`                   |

### Contact — `/contact`

| Field              | Detail                                                      |
| ------------------ | ----------------------------------------------------------- |
| Purpose            | Collect an enquiry and offer direct contact options         |
| Audience           | Ready-to-talk visitors and “not sure” explorers             |
| Core sections      | Invitation, form, email/WhatsApp/social, privacy note       |
| Content dependency | Confirmed contacts; privacy notice version                  |
| Main CTA           | Send project enquiry (form submit — button, not a nav link) |
| Related routes     | `/privacy`, service pages (via `?service=`), `/work`        |

### Privacy — `/privacy`

| Field              | Detail                                                      |
| ------------------ | ----------------------------------------------------------- |
| Purpose            | Explain what information is collected and how it is handled |
| Audience           | Anyone submitting data or checking trust                    |
| Core sections      | Notice matching real processing                             |
| Content dependency | Legal/ops review                                            |
| Main CTA           | Contact the privacy owner (email/contact path)              |
| Related routes     | `/contact`, `/terms`                                        |

### Website terms — `/terms`

| Field              | Detail                                                                       |
| ------------------ | ---------------------------------------------------------------------------- |
| Purpose            | Explain use of the website and relevant limitations (not a project contract) |
| Audience           | Visitors and partners checking site terms                                    |
| Core sections      | Website-use terms                                                            |
| Content dependency | Legal review                                                                 |
| Main CTA           | Contact Zatroz                                                               |
| Related routes     | `/privacy`, `/contact`                                                       |

---

## Counts and uniqueness

| Category                    | Count     | Routes                                                                            |
| --------------------------- | --------- | --------------------------------------------------------------------------------- |
| General pages               | 8         | `/`, `/about`, `/services`, `/work`, `/process`, `/contact`, `/privacy`, `/terms` |
| Service detail              | 6         | listed above                                                                      |
| Project detail template     | 1 pattern | `/work/[slug]` → 2 or 3 concrete pages at launch                                  |
| Duplicate case-study scheme | **None**  | Do not add `/case-studies`                                                        |

All marketing paths above are unique.

---

## Later routes (not launch)

| Route                           | Add when                                                   |
| ------------------------------- | ---------------------------------------------------------- |
| `/admin/*`                      | Staff admin sequence **A02–A12** (not public marketing)    |
| `/labs`                         | ≥2 documented experiments with maturity labels             |
| `/products`, `/products/[slug]` | Real product with owner, support path, usable demo         |
| `/insights`, `/insights/[slug]` | Publishing owner + enough useful articles                  |
| `/careers`, `/careers/[slug]`   | Real opening or clear EOI process                          |
| `/pricing`                      | Stable packages, inclusions, exclusions, maintenance costs |
| `/support`                      | Documented support contact for existing clients            |

Keep “Technologies” and “Why Zatroz” as sections inside existing pages until there is enough distinct content for standalone pages.

---

## Service preselection query (Contact)

Proposed pattern: `/contact?service=websites-ecommerce`

**Allowed `service` values (exact):**

1. `websites-ecommerce`
2. `web-mobile-apps`
3. `business-systems`
4. `ai-automation`
5. `custom-software`
6. `ui-ux-design`

Rules for later implementation:

- Unknown or missing values fall back to unselected / **Not sure** — never invent a service.
- Treat the query as **untrusted UI hint only**, not trusted server input for security decisions.
- Never put names, emails, or project descriptions in query strings.
