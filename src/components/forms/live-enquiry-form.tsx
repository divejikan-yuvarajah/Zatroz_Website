/**
 * Live Contact form — wraps EnquiryForm with the real Server Action transport.
 * Mount only when formSubmissionReady is true on the public /contact page.
 */

"use client";

import { EnquiryForm } from "@/components/forms/enquiry-form";
import { useSubmitEnquiry } from "@/components/forms/use-submit-enquiry";
import type { ServiceSlug } from "@/types/content";

export type LiveEnquiryFormProps = {
  initialService?: ServiceSlug | null;
  directContactHref?: string | null;
  directContactLabel?: string;
};

export function LiveEnquiryForm({
  initialService = null,
  directContactHref = null,
  directContactLabel = "Email or WhatsApp us",
}: LiveEnquiryFormProps) {
  const submitEnquiry = useSubmitEnquiry();
  const turnstileSiteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || null;

  return (
    <EnquiryForm
      initialService={initialService}
      submitEnquiry={submitEnquiry}
      turnstileSiteKey={turnstileSiteKey}
      directContactHref={directContactHref}
      directContactLabel={directContactLabel}
      demoMode={false}
    />
  );
}
