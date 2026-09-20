/**
 * Email template inventory — versions used by future notification intents.
 */

import { ENQUIRY_INTERNAL_TEMPLATE_VERSION } from "@/lib/email/templates/enquiry-internal";

export type EmailTemplateRecord = Readonly<{
  id: string;
  version: string;
  purpose: string;
  audience: "internal-team" | "visitor";
}>;

export const EMAIL_TEMPLATE_CATALOG: readonly EmailTemplateRecord[] = [
  {
    id: "enquiry-internal",
    version: ENQUIRY_INTERNAL_TEMPLATE_VERSION,
    purpose: "Notify the Zatroz team that a new enquiry was stored",
    audience: "internal-team",
  },
] as const;
