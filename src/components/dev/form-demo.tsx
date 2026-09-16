"use client";

import { useRef, useState, type FormEvent } from "react";
import { flushSync } from "react-dom";
import { CheckboxField } from "@/components/forms/checkbox-field";
import {
  ErrorSummary,
  type ErrorSummaryItem,
} from "@/components/forms/error-summary";
import { FormField } from "@/components/forms/form-field";
import {
  InlineStatus,
  type InlineStatusTone,
} from "@/components/forms/inline-status";
import { SelectField } from "@/components/forms/select-field";
import { TextArea } from "@/components/forms/text-area";
import { TextInput } from "@/components/forms/text-input";
import { Button } from "@/components/ui/button";

const NAME_ID = "demo-name";
const EMAIL_ID = "demo-email";
const SERVICE_ID = "demo-service";
const MESSAGE_ID = "demo-message";
const OPTIONAL_ID = "demo-optional";
const SUMMARY_ID = "demo-error-summary";
const STATUS_ID = "demo-status";

const SERVICE_OPTIONS = [
  { value: "not-sure", label: "Not sure" },
  { value: "websites-ecommerce", label: "Websites and ecommerce" },
  { value: "web-mobile-apps", label: "Web and mobile applications" },
  { value: "business-systems", label: "Business systems" },
  { value: "ai-automation", label: "AI and automation" },
  { value: "custom-software", label: "Custom software" },
  { value: "ui-ux-design", label: "UI and UX design" },
] as const;

type DemoValues = {
  name: string;
  email: string;
  service: string;
  message: string;
};

type ReportedField = keyof DemoValues;

function collectErrors(
  values: DemoValues,
  emailTypeMismatch: boolean,
): Record<ReportedField, string | undefined> {
  const nameError = values.name.trim() ? undefined : "Enter a name.";

  let emailError: string | undefined;
  if (!values.email.trim()) {
    emailError = "Enter an email address.";
  } else if (emailTypeMismatch) {
    emailError =
      "Enter an email address in a valid format, such as name@example.com.";
  }

  const serviceError = values.service
    ? undefined
    : "Choose a service, or pick Not sure.";
  const messageError = values.message.trim() ? undefined : "Enter a message.";

  return {
    name: nameError,
    email: emailError,
    service: serviceError,
    message: messageError,
  };
}

function visibleErrorList(
  errors: Record<ReportedField, string | undefined>,
  reported: Set<ReportedField>,
): ErrorSummaryItem[] {
  const order: { field: ReportedField; id: string }[] = [
    { field: "name", id: NAME_ID },
    { field: "email", id: EMAIL_ID },
    { field: "service", id: SERVICE_ID },
    { field: "message", id: MESSAGE_ID },
  ];

  return order.flatMap(({ field, id }) => {
    const message = errors[field];
    if (!message || !reported.has(field)) return [];
    return [{ id, message }];
  });
}

export function FormDemo() {
  const summaryRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<DemoValues>({
    name: "",
    email: "",
    service: "",
    message: "",
  });
  const [emailTypeMismatch, setEmailTypeMismatch] = useState(false);
  const [optionalFlag, setOptionalFlag] = useState(false);
  const [reported, setReported] = useState<Set<ReportedField>>(new Set());
  const [status, setStatus] = useState<InlineStatusTone>("idle");
  const [statusText, setStatusText] = useState("");

  const allErrors = collectErrors(values, emailTypeMismatch);
  const summaryErrors = visibleErrorList(allErrors, reported);
  const isPending = status === "pending";

  function updateField(field: ReportedField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isPending) return;

    const emailInput = event.currentTarget.elements.namedItem("email");
    const mismatch =
      emailInput instanceof HTMLInputElement &&
      emailInput.validity.typeMismatch;

    const errors = collectErrors(values, mismatch);
    const invalid = (
      Object.entries(errors) as [ReportedField, string | undefined][]
    )
      .filter(([, message]) => Boolean(message))
      .map(([field]) => field);

    if (invalid.length > 0) {
      flushSync(() => {
        setEmailTypeMismatch(mismatch);
        setReported(new Set(invalid));
        setStatus("idle");
        setStatusText("");
      });
      summaryRef.current?.focus();
      return;
    }

    setReported(new Set());
    setEmailTypeMismatch(false);
    setStatus("success");
    setStatusText("Demo validation passed. Nothing was sent or saved.");
  }

  return (
    <div className="max-w-xl min-w-0">
      <h3>Local component demo — nothing is sent or saved</h3>
      <p className="mt-3">
        This is a local check of the form controls. It does not send email,
        store data, or call an API. Values are fake examples only.
      </p>

      <form className="mt-8 flex flex-col gap-6" noValidate onSubmit={onSubmit}>
        <ErrorSummary ref={summaryRef} id={SUMMARY_ID} errors={summaryErrors} />

        <FormField
          id={NAME_ID}
          label="Name"
          required
          error={reported.has("name") ? allErrors.name : undefined}
        >
          {(control) => (
            <TextInput
              {...control}
              name="name"
              autoComplete="name"
              required
              value={values.name}
              onChange={(event) => updateField("name", event.target.value)}
            />
          )}
        </FormField>

        <FormField
          id={EMAIL_ID}
          label="Email"
          required
          hint="Use a format like name@example.com. This demo is not a real inbox."
          error={reported.has("email") ? allErrors.email : undefined}
        >
          {(control) => (
            <TextInput
              {...control}
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              value={values.email}
              onChange={(event) => {
                setEmailTypeMismatch(event.target.validity.typeMismatch);
                updateField("email", event.target.value);
              }}
            />
          )}
        </FormField>

        <FormField
          id={SERVICE_ID}
          label="Service"
          required
          hint="Pick Not sure if you do not know which group fits."
          error={reported.has("service") ? allErrors.service : undefined}
        >
          {(control) => (
            <SelectField
              {...control}
              name="service"
              required
              value={values.service}
              onChange={(event) => updateField("service", event.target.value)}
            >
              <option value="">Select a service</option>
              {SERVICE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>
          )}
        </FormField>

        <FormField
          id={MESSAGE_ID}
          label="Message"
          required
          hint="Example text only. Do not include private project details here."
          error={reported.has("message") ? allErrors.message : undefined}
        >
          {(control) => (
            <TextArea
              {...control}
              name="message"
              required
              value={values.message}
              onChange={(event) => updateField("message", event.target.value)}
            />
          )}
        </FormField>

        <fieldset className="min-w-0 border-0 p-0">
          <legend className="font-medium text-ink">Example extras</legend>
          <div className="mt-3">
            <CheckboxField
              id={OPTIONAL_ID}
              name="optional-demo"
              label="Optional demo checkbox"
              hint="Not required. This is not a marketing consent box."
              checked={optionalFlag}
              onChange={(event) => setOptionalFlag(event.target.checked)}
            />
          </div>
        </fieldset>

        <InlineStatus id={STATUS_ID} tone={status}>
          {statusText}
        </InlineStatus>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" loading={isPending} loadingLabel="Checking">
            Check example form
          </Button>
        </div>
      </form>

      <div className="mt-8 flex flex-col gap-3">
        <p className="ds-support">
          These buttons only change the example status. They do not send a
          request.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setReported(new Set());
              setStatus("pending");
              setStatusText(
                "Checking the example form. Nothing is being sent.",
              );
            }}
          >
            Show pending example
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setReported(new Set());
              setStatus("error");
              setStatusText(
                "The example could not be completed. Nothing was sent or saved.",
              );
            }}
          >
            Show failure example
          </Button>
          <Button
            type="button"
            variant="quiet"
            onClick={() => {
              setStatus("idle");
              setStatusText("");
            }}
          >
            Clear status example
          </Button>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-6">
        <h3>Disabled and read-only examples</h3>
        <FormField
          id="demo-disabled"
          label="Disabled example"
          hint="Cannot be edited. Separate from the demo submit."
        >
          {(control) => (
            <TextInput
              {...control}
              name="disabled-example"
              defaultValue="Example value"
              disabled
            />
          )}
        </FormField>
        <FormField
          id="demo-readonly"
          label="Read-only example"
          hint="Still readable and focusable. Not a submitted field."
        >
          {(control) => (
            <TextInput
              {...control}
              name="readonly-example"
              defaultValue="Example value"
              readOnly
            />
          )}
        </FormField>
      </div>
    </div>
  );
}
