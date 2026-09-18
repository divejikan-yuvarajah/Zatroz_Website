# Contact Step 42 — page layout and channels

**Branch:** `feature/42-contact-layout` (from `feature/41-process-page`)  
**Status:** Implemented (route live; framing copy **draft**; form submission **not ready**)

## Channel audit

| Channel   | Prompt / owner value  | Code value                               | Decision (Step 42)                                  |
| --------- | --------------------- | ---------------------------------------- | --------------------------------------------------- |
| Email     | `zatroz.co@gmail.com` | Same                                     | **Confirmed** — matches owner-supplied; no conflict |
| Phone     | `+94 768098068`       | `+94 76 809 8068` / E.164 `+94768098068` | Display kept; voice calls stay **unconfirmed**      |
| WhatsApp  | Same number           | Digits `94768098068`                     | **Confirmed** for business enquiries                |
| Instagram | handle `zatroz.co`    | `href: null`                             | Unconfirmed — exact profile URL still missing       |
| LinkedIn  | display name `Zatroz` | `href: null`                             | Unconfirmed — exact URL unknown; do not invent      |

## What changed

| File                                           | Role                                          |
| ---------------------------------------------- | --------------------------------------------- |
| `src/content/contact-page.ts`                  | Contact page record + form option lists       |
| `src/content/site.ts`                          | Email + WhatsApp confirmed                    |
| `src/server/contact.ts`                        | Public + gallery selectors                    |
| `src/lib/contact-service-query.ts`             | Safe `?service=` parser                       |
| `src/app/contact/page.tsx`                     | Thin route + metadata canonical `/contact`    |
| `src/components/sections/contact-page.tsx`     | Page composition                              |
| `src/components/forms/enquiry-form-layout.tsx` | Shared form layout (gallery / future Step 43) |
| `src/components/dev/contact-specimen.tsx`      | Gallery specimen                              |
| `scripts/test-contact-service-query.ts`        | Parser tests                                  |

## Behaviour

- `/contact` implemented; nav/footer CTA can link here.
- Public page shows **confirmed** email and WhatsApp actions (never loops to `/contact`).
- Framing sections (include list, FAQs, data-use) stay off public HTML while copy is draft; gallery shows the full draft.
- `?service=<slug>` accepts one allowlisted slug; unknown/repeated/oversized → no context. Metadata stays canonical `/contact`.
- Enquiry form layout exists in `/dev/ui` only; `formSubmissionReady: false`.
- No office address, map, hours, or response-time promise.
- Optional conversation illustration **not acquired**.

## Readiness

| Gate                | State                           |
| ------------------- | ------------------------------- |
| Page route          | Ready                           |
| Contact channels    | Email + WhatsApp confirmed      |
| Page framing copy   | Draft                           |
| Form layout         | Specimen only                   |
| Form submission     | Not ready (Step 43 + backend)   |
| Privacy policy link | Omitted until `/privacy` exists |

## Checks

- `npm run validate:content` — passed (16 readiness warnings including `draft-contact-page`)
- `npm run check` — passed (includes `test:contact-service-query`)
- `npm run build` — passed (Next.js 16.3.5)
- Production smoke port **3042**: `/contact` 200 with email + WhatsApp; no form; service context works; `/dev/ui` 404
- Gallery keyboard/viewport review — **not run**

## Next

Step 43 — Enquiry form validation and interactions.
