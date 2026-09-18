# Services pack readiness (Steps 29–33)

Compact status after the first three service detail pages. Approval stays separate from route implementation.

| Item                        | Implementation            | Content approval                | Public route                                            | Navigation / overview links                 | Enquiry destination                                                         |
| --------------------------- | ------------------------- | ------------------------------- | ------------------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------- |
| Services overview           | Done (`/services`)        | Draft framing + draft summaries | Live with honest sparse placeholder while draft         | Links to `/services` when implemented       | Shared CTA policy (Contact / email / WhatsApp / home invitation when ready) |
| Shared detail template      | Done (`/services/[slug]`) | N/A                             | Dynamic route ready; empty eligible set until approvals | Links only when detail is publicly eligible | Uses `primaryCtaLabel` + shared CTA resolver                                |
| Websites and E-commerce     | Draft detail + gallery    | Draft (not founder-approved)    | 404 until approved                                      | No public detail link yet                   | Label: Discuss your website · slug `websites-ecommerce`                     |
| Web and Mobile Applications | Draft detail + gallery    | Draft (not founder-approved)    | 404 until approved                                      | No public detail link yet                   | Label: Discuss your application · slug `web-mobile-apps`                    |
| Business Systems            | Draft detail + gallery    | Draft (not founder-approved)    | 404 until approved                                      | No public detail link yet                   | Label: Discuss your business system · slug `business-systems`               |
| AI and Automation           | Pending Step 34           | Draft overview summary only     | Not implemented                                         | —                                           | —                                                                           |
| Custom Software             | Pending Step 35           | Draft overview summary only     | Not implemented                                         | —                                           | —                                                                           |
| UI/UX Design                | Pending Step 36           | Draft overview summary only     | Not implemented                                         | —                                           | —                                                                           |

## Distinction check (first three detail drafts)

| Page                        | Audience focus                             | Example                            | Boundaries emphasis                           |
| --------------------------- | ------------------------------------------ | ---------------------------------- | --------------------------------------------- |
| Websites and E-commerce     | Online presence, catalogue, or store scope | Website vs catalogue comparison    | Not every site is a full checkout             |
| Web and Mobile Applications | Repeated tasks / portals                   | Browser workspace vs phone request | Not every app needs both platforms or offline |
| Business Systems            | Sales, stock, ops, reporting modules       | Sale → stock → report sample panel | Not a complete ERP; hardware/offline scoped   |

## Database note

MongoDB Atlas (official driver) is the planned store for **future website enquiries**. Service page content remains repository-managed typed records. Steps 29–33 do not connect a database.

## Enabling a public detail

1. Approve overview summary and detail copy.
2. Confirm delivery capacity.
3. Keep `implemented: true` on the matching route (already set for the three drafted pages).
4. Public URL, metadata, and nav links appear only when eligibility passes.
