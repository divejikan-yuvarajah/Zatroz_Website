"use client";

import { useState, type FormEvent } from "react";
import { FormField } from "@/components/forms/form-field";
import { SelectField } from "@/components/forms/select-field";
import { TextArea } from "@/components/forms/text-area";
import { TextInput } from "@/components/forms/text-input";
import { Button } from "@/components/ui/button";
import {
  ENQUIRY_PREFERRED_CONTACT_OPTIONS,
  ENQUIRY_REQUEST_TYPE_OPTIONS,
  ENQUIRY_SERVICE_OPTIONS,
  ENQUIRY_TIMELINE_OPTIONS,
} from "@/content/contact-page";
import type { ServiceSlug } from "@/types/content";
import { cn } from "@/lib/cn";

export type EnquiryFormLayoutProps = {
  idPrefix?: string;
  /** Allowlisted service slug from `?service=` — editable after load. */
  initialService?: ServiceSlug | null;
  /** Development-only labelled invalid sample row. */
  showInvalidSample?: boolean;
  className?: string;
};

/**
 * Shared enquiry form field layout for Step 42 gallery and later Step 43 behaviour.
 * Prevents native GET submission. Does not send, store, or network anything.
 */
export function EnquiryFormLayout({
  idPrefix = "enquiry-",
  initialService = null,
  showInvalidSample = false,
  className,
}: EnquiryFormLayoutProps) {
  const nameId = `${idPrefix}name`;
  const emailId = `${idPrefix}email`;
  const companyId = `${idPrefix}company`;
  const serviceId = `${idPrefix}service`;
  const messageId = `${idPrefix}message`;
  const timelineId = `${idPrefix}timeline`;
  const requestTypeId = `${idPrefix}request-type`;
  const preferredId = `${idPrefix}preferred-contact`;
  const phoneId = `${idPrefix}phone`;

  const [preferredContact, setPreferredContact] = useState("email");
  const showPhone =
    preferredContact === "phone" || preferredContact === "whatsapp";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <form
      className={cn("space-y-6", className)}
      onSubmit={handleSubmit}
      noValidate
      action="#"
      method="post"
    >
      <p className="m-0 text-sm text-text-muted">
        Layout specimen only — submission is disabled. Nothing is sent or
        stored.
      </p>

      <FormField id={nameId} label="Name" required>
        {(control) => (
          <TextInput
            {...control}
            name="name"
            autoComplete="name"
            defaultValue=""
          />
        )}
      </FormField>

      <FormField
        id={emailId}
        label="Email"
        required
        hint="We use this address to reply about your project."
      >
        {(control) => (
          <TextInput
            {...control}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            defaultValue=""
          />
        )}
      </FormField>

      <FormField id={companyId} label="Company" optional>
        {(control) => (
          <TextInput
            {...control}
            name="company"
            autoComplete="organization"
            defaultValue=""
          />
        )}
      </FormField>

      <FormField
        id={serviceId}
        label="Service"
        required
        hint="Choose the closest fit, or Not sure yet."
      >
        {(control) => (
          <SelectField
            {...control}
            name="service"
            defaultValue={initialService ?? ""}
          >
            {ENQUIRY_SERVICE_OPTIONS.map((option) => (
              <option
                key={option.value || "prompt"}
                value={option.value}
                disabled={option.value === ""}
              >
                {option.label}
              </option>
            ))}
          </SelectField>
        )}
      </FormField>

      <FormField
        id={messageId}
        label="Message"
        required
        hint="Describe what you want to improve. Aim for at least a short paragraph."
      >
        {(control) => (
          <TextArea {...control} name="message" defaultValue="" rows={6} />
        )}
      </FormField>

      <FormField id={timelineId} label="Preferred timing" optional>
        {(control) => (
          <SelectField {...control} name="timeline" defaultValue="">
            {ENQUIRY_TIMELINE_OPTIONS.map((option) => (
              <option
                key={option.value || "timeline-prompt"}
                value={option.value}
                disabled={option.value === ""}
              >
                {option.label}
              </option>
            ))}
          </SelectField>
        )}
      </FormField>

      <FormField
        id={requestTypeId}
        label="Request type"
        optional
        hint="A meeting request describes interest only — it does not book a slot."
      >
        {(control) => (
          <SelectField
            {...control}
            name="requestType"
            defaultValue="project-enquiry"
          >
            {ENQUIRY_REQUEST_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
        )}
      </FormField>

      <FormField
        id={preferredId}
        label="Preferred reply channel"
        optional
        hint="Phone appears only when you choose phone or WhatsApp."
      >
        {(control) => (
          <SelectField
            {...control}
            name="preferredContact"
            value={preferredContact}
            onChange={(event) => setPreferredContact(event.target.value)}
          >
            {ENQUIRY_PREFERRED_CONTACT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
        )}
      </FormField>

      {showPhone ? (
        <FormField
          id={phoneId}
          label="Phone or WhatsApp number"
          required
          hint="Include a country code when possible."
        >
          {(control) => (
            <TextInput
              {...control}
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              defaultValue=""
            />
          )}
        </FormField>
      ) : null}

      <p className="m-0 text-sm text-text-muted">
        Budget options are omitted until useful ranges and currency are
        approved. Do not upload files or share passwords here.
      </p>

      <p className="m-0 text-sm text-text-body">
        We use the details you type to respond to this enquiry. A privacy page
        link will appear when that policy is published.
      </p>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="primary">
          Send enquiry
        </Button>
      </div>

      {showInvalidSample ? (
        <div className="border-t border-border-subtle pt-6">
          <h4 className="ds-h3 m-0">Invalid appearance sample</h4>
          <p className="ds-support mt-2">
            Static example of an invalid control for layout review — not live
            validation.
          </p>
          <div className="mt-4">
            <FormField
              id={`${idPrefix}sample-invalid`}
              label="Sample email"
              required
              error="Enter a valid email address."
            >
              {(control) => (
                <TextInput
                  {...control}
                  name="sample-invalid-email"
                  type="email"
                  defaultValue="not-an-email"
                  readOnly
                />
              )}
            </FormField>
          </div>
        </div>
      ) : null}
    </form>
  );
}
