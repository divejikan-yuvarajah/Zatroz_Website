# Navigation specification

**Status:** Spec only — do not implement the menu in this step  
**Created:** 16 September 2026  
**Related:** `docs/planning/03-sitemap.md`, `docs/planning/visitor-journeys.md`

---

## Desktop navigation

| Item            | Type                                     | Destination / behaviour                 |
| --------------- | ---------------------------------------- | --------------------------------------- |
| Logo (Zatroz)   | Link                                     | `/` (Home)                              |
| Services        | Link (optional disclosure of six groups) | `/services` and/or service detail links |
| Work            | Link                                     | `/work`                                 |
| About           | Link                                     | `/about`                                |
| Process         | Link                                     | `/process`                              |
| Start a project | Primary CTA link                         | `/contact`                              |

Notes:

- Keep labels consistent with content inventory (`C-NAV`).
- Services disclosure (when built) must work with keyboard as well as pointer.
- Do not put Privacy or Terms in the desktop primary bar.

---

## Footer

| Item                             | Destination                 |
| -------------------------------- | --------------------------- |
| Logo / short blurb               | Home / none                 |
| Email, WhatsApp, approved social | Confirmed contact URLs only |
| Services list (optional compact) | Service routes              |
| Process                          | `/process`                  |
| **Privacy**                      | `/privacy`                  |
| **Terms**                        | `/terms`                    |

Privacy and Terms live in the footer for launch.

---

## Mobile menu (behaviour plan — not built yet)

When implemented as an overlay/drawer:

| Requirement     | Detail                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------- |
| Destinations    | All primary destinations: Services, Work, About, Process, Start a project (and Home via logo)                       |
| Open control    | Visible button with accessible name (for example “Menu”)                                                            |
| Close control   | Visible close control                                                                                               |
| Escape          | Closes the menu                                                                                                     |
| Focus           | Move focus into the menu when opened; **return focus** to the open trigger when closed                              |
| Modal behaviour | If overlay traps interaction, use appropriate dialog/modal semantics; do not lose page scroll position unexpectedly |
| Primary CTA     | Start a project remains reachable inside the menu                                                                   |

Do not implement this menu in Step 03.

---

## CTA placement consistency

| Placement          | Control                   | Destination                            |
| ------------------ | ------------------------- | -------------------------------------- |
| Header             | Start a project           | `/contact`                             |
| Service pages      | Discuss…                  | `/contact?service=<allowlisted-slug>`  |
| Project stories    | Discuss a similar project | `/contact` (± mapped service)          |
| Hero secondary     | Explore our work          | `/work`                                |
| Secondary interest | Chat on WhatsApp          | External WhatsApp link (interest only) |

---

## Out of scope for this nav

- Labs, Products, Insights, Careers, Pricing, Support (later triggers in sitemap)
- Floating chatbot + WhatsApp bubble + booking panel stacks
- Fake “booked meeting” controls
