/**
 * Internal enquiry notification template (HTML + plain text).
 * Pure rendering — no Date.now(), no random IDs, no live site copy fetches.
 */

import type { EnquiryNormalizedInput } from "@/lib/enquiries/input";
import { sanitizeHeaderValue } from "@/lib/email/addresses";
import { boundText, escapeHtml, escapeHtmlWithBreaks } from "@/lib/email/html";

/** Bump only when the frozen render contract intentionally changes. */
export const ENQUIRY_INTERNAL_TEMPLATE_VERSION = "enquiry-internal/v1" as const;

const FIELD_BOUNDS = {
  name: 100,
  email: 254,
  company: 120,
  message: 5000,
  phone: 40,
  reference: 64,
  receivedAt: 64,
} as const;

/**
 * Approved service labels — must match SERVICE_SLUGS + not-sure:
 * websites-ecommerce, web-mobile-apps, business-systems,
 * ai-automation, custom-software, ui-ux-design.
 */
const SERVICE_LABELS: Record<string, string> = {
  "not-sure": "Not sure yet",
  "websites-ecommerce": "Websites and E-commerce",
  "web-mobile-apps": "Web and Mobile Applications",
  "business-systems": "Business Systems",
  "ai-automation": "AI and Automation",
  "custom-software": "Custom Software",
  "ui-ux-design": "UI/UX Design",
};

const REQUEST_TYPE_LABELS: Record<string, string> = {
  "project-enquiry": "Project enquiry",
  "meeting-request": "Meeting request",
};

const TIMELINE_LABELS: Record<string, string> = {
  exploring: "Still exploring",
  "within-month": "Within a month",
  "one-to-three-months": "1–3 months",
  flexible: "Flexible",
};

const CONTACT_LABELS: Record<string, string> = {
  email: "Email",
  whatsapp: "WhatsApp",
  phone: "Phone",
};

export type EnquiryInternalTemplateInput = Readonly<{
  reference: string;
  /** Fixed display string frozen with the notification intent. */
  receivedAtDisplay: string;
  enquiry: EnquiryNormalizedInput;
}>;

export type RenderedEmail = Readonly<{
  templateVersion: typeof ENQUIRY_INTERNAL_TEMPLATE_VERSION;
  subject: string;
  html: string;
  text: string;
}>;

function serviceLabel(slug: string): string {
  return SERVICE_LABELS[slug] ?? "Service";
}

function requestTypeLabel(value: string): string {
  return REQUEST_TYPE_LABELS[value] ?? "Enquiry";
}

function timelineLabel(value: string | null): string {
  if (!value) return "Not specified";
  return TIMELINE_LABELS[value] ?? "Not specified";
}

function contactLabel(value: string): string {
  return CONTACT_LABELS[value] ?? "Email";
}

export function buildEnquiryInternalSubject(input: {
  reference: string;
  service: string;
}): string {
  const reference = sanitizeHeaderValue(
    boundText(input.reference, FIELD_BOUNDS.reference),
  );
  const service = sanitizeHeaderValue(serviceLabel(input.service));
  return `Zatroz enquiry ${reference} — ${service}`;
}

export function renderEnquiryInternalNotification(
  input: EnquiryInternalTemplateInput,
): RenderedEmail {
  const reference = boundText(input.reference, FIELD_BOUNDS.reference);
  const receivedAt = boundText(
    input.receivedAtDisplay,
    FIELD_BOUNDS.receivedAt,
  );
  const name = boundText(input.enquiry.name, FIELD_BOUNDS.name);
  const email = boundText(input.enquiry.email, FIELD_BOUNDS.email);
  const company = input.enquiry.company
    ? boundText(input.enquiry.company, FIELD_BOUNDS.company)
    : null;
  const message = boundText(input.enquiry.message, FIELD_BOUNDS.message);
  const phone = input.enquiry.phone
    ? boundText(input.enquiry.phone, FIELD_BOUNDS.phone)
    : null;
  const service = serviceLabel(input.enquiry.service);
  const requestType = requestTypeLabel(input.enquiry.requestType);
  const timeline = timelineLabel(input.enquiry.timeline);
  const preferredContact = contactLabel(input.enquiry.preferredContact);

  const subject = buildEnquiryInternalSubject({
    reference,
    service: input.enquiry.service,
  });

  const text = [
    "Zatroz — new enquiry",
    "",
    `Reference: ${reference}`,
    `Received: ${receivedAt}`,
    `Service: ${service}`,
    `Request type: ${requestType}`,
    `Timeline: ${timeline}`,
    `Preferred contact: ${preferredContact}`,
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    company ? `Company: ${company}` : null,
    phone ? `Phone: ${phone}` : null,
    "",
    "Message:",
    message,
    "",
    "—",
    "This message is an internal notification only.",
    "It confirms that an enquiry was stored; it does not confirm a meeting or project booking.",
    "Reply to the visitor using the contact details above when appropriate.",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f7f5f2;color:#111111;font-family:Manrope,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7f5f2;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #e6e2dc;">
          <tr>
            <td style="padding:24px 24px 8px 24px;">
              <p style="margin:0 0 4px 0;font-size:12px;letter-spacing:0.04em;text-transform:uppercase;color:#666666;">Zatroz</p>
              <h1 style="margin:0;font-size:22px;line-height:1.3;font-weight:700;color:#111111;">New enquiry</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 16px 24px;font-size:14px;line-height:1.5;color:#333333;">
              <p style="margin:0 0 8px 0;"><strong>Reference:</strong> ${escapeHtml(reference)}</p>
              <p style="margin:0 0 8px 0;"><strong>Received:</strong> ${escapeHtml(receivedAt)}</p>
              <p style="margin:0 0 8px 0;"><strong>Service:</strong> ${escapeHtml(service)}</p>
              <p style="margin:0 0 8px 0;"><strong>Request type:</strong> ${escapeHtml(requestType)}</p>
              <p style="margin:0 0 8px 0;"><strong>Timeline:</strong> ${escapeHtml(timeline)}</p>
              <p style="margin:0;"><strong>Preferred contact:</strong> ${escapeHtml(preferredContact)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 16px 24px;font-size:14px;line-height:1.5;color:#333333;border-top:1px solid #eeeae4;">
              <p style="margin:0 0 8px 0;"><strong>Name:</strong> ${escapeHtml(name)}</p>
              <p style="margin:0 0 8px 0;"><strong>Email:</strong> ${escapeHtml(email)}</p>
              ${company ? `<p style="margin:0 0 8px 0;"><strong>Company:</strong> ${escapeHtml(company)}</p>` : ""}
              ${phone ? `<p style="margin:0 0 8px 0;"><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 24px 24px;font-size:14px;line-height:1.6;color:#333333;border-top:1px solid #eeeae4;">
              <p style="margin:0 0 8px 0;"><strong>Message</strong></p>
              <p style="margin:0;white-space:pre-wrap;">${escapeHtmlWithBreaks(message)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px 24px 24px;font-size:12px;line-height:1.5;color:#666666;border-top:1px solid #eeeae4;">
              <p style="margin:0;">Internal notification only. An enquiry was stored; this is not a booking confirmation. Images are not required to read this message.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return {
    templateVersion: ENQUIRY_INTERNAL_TEMPLATE_VERSION,
    subject,
    html,
    text,
  };
}
