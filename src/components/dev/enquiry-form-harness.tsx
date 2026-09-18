"use client";

import { useMemo, useState } from "react";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import {
  createMalformedSubmitEnquiry,
  createSimulatedSubmitEnquiry,
  type EnquirySimulateScenario,
} from "@/lib/enquiries/simulate";
import {
  coerceEnquirySubmitResult,
  type SubmitEnquiryFn,
} from "@/lib/enquiries/transport";
import type { ServiceSlug } from "@/types/content";

const SCENARIOS: readonly {
  value: EnquirySimulateScenario;
  label: string;
}[] = [
  { value: "accepted", label: "Accepted (demo)" },
  { value: "validation-error", label: "Server validation error" },
  { value: "rate-limited", label: "Rate limited" },
  { value: "unavailable", label: "Service unavailable" },
  { value: "unknown-outcome", label: "Unknown outcome / timeout" },
  { value: "malformed", label: "Malformed response" },
  { value: "delayed", label: "Delayed (double-click test)" },
] as const;

const SAMPLE_HINT =
  "Use sample values such as name “Alex Reviewer”, email review@example.com, and a short project description. Nothing is stored or sent.";

export type EnquiryFormHarnessProps = {
  initialService?: ServiceSlug | null;
  directContactHref?: string | null;
};

/**
 * Guarded development harness for enquiry form states.
 * Must not mount on public /contact.
 */
export function EnquiryFormHarness({
  initialService = "ui-ux-design",
  directContactHref = "mailto:zatroz.co@gmail.com",
}: EnquiryFormHarnessProps) {
  const [scenario, setScenario] = useState<EnquirySimulateScenario>("accepted");
  const [formKey, setFormKey] = useState(0);

  const submitEnquiry: SubmitEnquiryFn = useMemo(() => {
    if (scenario === "malformed") {
      const malformed = createMalformedSubmitEnquiry(200);
      return async () => coerceEnquirySubmitResult(await malformed());
    }
    return createSimulatedSubmitEnquiry({ scenario });
  }, [scenario]);

  return (
    <div className="space-y-8">
      <div className="max-w-reading space-y-3">
        <h3 className="ds-h3 m-0">Enquiry form harness</h3>
        <p className="m-0 text-sm text-text-body">{SAMPLE_HINT}</p>
        <p className="m-0 text-sm text-text-muted">
          Every accepted result is marked demo. Production <code>/contact</code>{" "}
          does not mount this form while submission readiness is false.
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <label className="block text-sm font-medium text-ink">
            Simulated response
            <select
              className="mt-2 block w-full min-w-56 rounded-md border border-border-subtle bg-canvas px-3 py-2 text-base text-ink"
              value={scenario}
              onChange={(event) => {
                setScenario(event.target.value as EnquirySimulateScenario);
                setFormKey((key) => key + 1);
              }}
            >
              {SCENARIOS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            className="rounded-md border border-border-subtle px-3 py-2 text-sm font-medium text-ink"
            onClick={() => setFormKey((key) => key + 1)}
          >
            Reset form
          </button>
        </div>
      </div>

      <div className="rounded-md border border-border-subtle p-6">
        <EnquiryForm
          key={formKey}
          idPrefix={`harness-${scenario}-`}
          initialService={initialService}
          submitEnquiry={submitEnquiry}
          directContactHref={directContactHref}
          directContactLabel="Email Zatroz"
          demoMode
        />
      </div>
    </div>
  );
}
