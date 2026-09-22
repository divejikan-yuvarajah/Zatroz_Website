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
  /** Set only when Privacy is approved and publicly linked. */
  privacyHref?: string | null;
};

export function LiveEnquiryForm({
  initialService = null,
  directContactHref = null,
  directContactLabel = "Email or WhatsApp us",
  privacyHref = null,
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
      privacyHref={privacyHref}
      demoMode={false}
    />
  );
}
