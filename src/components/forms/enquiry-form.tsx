"use client";

import { useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { flushSync } from "react-dom";
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
import { TextLink } from "@/components/ui/text-link";
import {
  ENQUIRY_PREFERRED_CONTACT_OPTIONS,
  ENQUIRY_REQUEST_TYPE_OPTIONS,
  ENQUIRY_SERVICE_OPTIONS,
  ENQUIRY_TIMELINE_OPTIONS,
} from "@/content/contact-page";
import {
  ENQUIRY_FIELD_ORDER,
  ENQUIRY_LIMITS,
  countEnquiryMessage,
  createEmptyEnquiryValues,
  phoneIsRequired,
  validateEnquiryInput,
  type EnquiryFieldErrors,
  type EnquiryFieldName,
  type EnquiryFormValues,
} from "@/lib/enquiries/input";
import { TurnstileChallenge } from "@/components/forms/turnstile-challenge";
import { CUSTOMER_SAFE_MESSAGES } from "@/lib/security/policy";
import {
  coerceEnquirySubmitResult,
  type EnquirySubmitResult,
  type SubmitEnquiryFn,
} from "@/lib/enquiries/transport";
import type { ServiceSlug } from "@/types/content";
import { cn } from "@/lib/cn";

function subscribeNoop() {
  return () => {};
}

function getClientHydrated() {
  return true;
}

function getServerHydrated() {
  return false;
}

export type EnquiryFormProps = {
  idPrefix?: string;
  /** Allowlisted service slug — used once as initial value; edits are preserved. */
  initialService?: ServiceSlug | null;
  /** Injected transport (simulated in gallery; future Server Action in production). */
  submitEnquiry: SubmitEnquiryFn;
  /** Direct-contact fallbacks shown after uncertain outcomes. */
  directContactHref?: string | null;
  directContactLabel?: string;
  /** When true, accepted confirmation is labelled as demo. */
  demoMode?: boolean;
  /** Public Turnstile site key — when set, challenge is required before submit. */
  turnstileSiteKey?: string | null;
  /** Canonical Privacy href once that policy is public-ready; omit while draft. */
  privacyHref?: string | null;
  className?: string;
};

type UiPhase =
  | "idle"
  | "invalid"
  | "pending"
  | "accepted"
  | "rate-limited"
  | "unavailable"
  | "unknown-outcome"
  | "challenge-failed";

function fieldId(prefix: string, field: EnquiryFieldName): string {
  return `${prefix}${field}`;
}

function buildSummaryErrors(
  prefix: string,
  errors: EnquiryFieldErrors,
  reported: ReadonlySet<EnquiryFieldName>,
): ErrorSummaryItem[] {
  return ENQUIRY_FIELD_ORDER.flatMap((field) => {
    const message = errors[field];
    if (!message || !reported.has(field)) return [];
    return [{ id: fieldId(prefix, field), message }];
  });
}

/**
 * Production-intended enquiry form. Mount only when submission readiness
 * allows it, or inside the development harness with a simulated submit.
 */
export function EnquiryForm({
  idPrefix = "enquiry-",
  initialService = null,
  submitEnquiry,
  directContactHref = null,
  directContactLabel = "Email or WhatsApp us",
  demoMode = false,
  turnstileSiteKey = null,
  privacyHref = null,
  className,
}: EnquiryFormProps) {
  const summaryRef = useRef<HTMLDivElement>(null);
  const submitLock = useRef(false);
  const challengeRequired = Boolean(turnstileSiteKey);

  const [values, setValues] = useState<EnquiryFormValues>(() =>
    createEmptyEnquiryValues(initialService),
  );
  const [reported, setReported] = useState<Set<EnquiryFieldName>>(new Set());
  const [phase, setPhase] = useState<UiPhase>("idle");
  const [statusTone, setStatusTone] = useState<InlineStatusTone>("idle");
  const [statusText, setStatusText] = useState("");
  const [serverFieldErrors, setServerFieldErrors] =
    useState<EnquiryFieldErrors>({});
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);
  const hydrated = useSyncExternalStore(
    subscribeNoop,
    getClientHydrated,
    getServerHydrated,
  );
  const clientResult = validateEnquiryInput(values);
  const clientErrors = clientResult.ok ? {} : clientResult.errors;
  const mergedErrors: EnquiryFieldErrors = {
    ...clientErrors,
    ...serverFieldErrors,
  };
  const summaryErrors = buildSummaryErrors(idPrefix, mergedErrors, reported);
  const isPending = phase === "pending";
  const showPhone = phoneIsRequired(values.preferredContact);
  const messageCount = countEnquiryMessage(values.message);
  const summaryId = `${idPrefix}error-summary`;
  const statusId = `${idPrefix}status`;

  function updateField(field: EnquiryFieldName, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (reported.has(field) || Object.keys(serverFieldErrors).length > 0) {
      setServerFieldErrors((current) => {
        if (!current[field]) return current;
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  }

  function markReported(fields: EnquiryFieldName[]) {
    setReported(new Set(fields));
  }

  function onBlurField(field: EnquiryFieldName) {
    if (phase === "pending" || phase === "accepted") return;
    const result = validateEnquiryInput(values);
    if (!result.ok && result.errors[field]) {
      setReported((current) => new Set(current).add(field));
    }
  }

  function resetTurnstileChallenge() {
    setTurnstileToken(null);
    setTurnstileReady(false);
    setTurnstileResetSignal((current) => current + 1);
  }

  function resetForAnotherEnquiry() {
    submitLock.current = false;
    setValues(createEmptyEnquiryValues(initialService));
    setReported(new Set());
    setServerFieldErrors({});
    setPhase("idle");
    setStatusTone("idle");
    setStatusText("");
    resetTurnstileChallenge();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hydrated || submitLock.current || isPending) return;

    const validation = validateEnquiryInput(values);
    if (!validation.ok) {
      const fields = ENQUIRY_FIELD_ORDER.filter(
        (field) => validation.errors[field],
      );
      flushSync(() => {
        markReported(fields);
        setServerFieldErrors({});
        setPhase("invalid");
        setStatusTone("idle");
        setStatusText("");
      });
      summaryRef.current?.focus();
      return;
    }

    if (challengeRequired && !turnstileToken) {
      flushSync(() => {
        setPhase("challenge-failed");
        setStatusTone("error");
        setStatusText(CUSTOMER_SAFE_MESSAGES.challengeRequired);
      });
      return;
    }

    submitLock.current = true;
    setPhase("pending");
    setStatusTone("pending");
    setStatusText("Sending your enquiry…");
    setReported(new Set());
    setServerFieldErrors({});

    let raw: unknown;
    try {
      raw = await submitEnquiry(validation.value, {
        turnstileToken: turnstileToken ?? undefined,
      });
    } catch {
      raw = {
        status: "unknown-outcome",
        message:
          "We could not confirm whether your enquiry was received. Try again later, or email / WhatsApp us using the contact details on this page.",
      } satisfies EnquirySubmitResult;
    }

    const result = coerceEnquirySubmitResult(raw);
    applySubmitResult(result);
  }

  function applySubmitResult(result: EnquirySubmitResult) {
    switch (result.status) {
      case "accepted": {
        flushSync(() => {
          setPhase("accepted");
          setStatusTone("success");
          setStatusText(
            demoMode
              ? "Demo — no enquiry was sent. In production this would confirm receipt only."
              : result.message,
          );
          setValues(createEmptyEnquiryValues(null));
          setReported(new Set());
          setServerFieldErrors({});
        });
        submitLock.current = false;
        return;
      }
      case "validation-error": {
        const fields = ENQUIRY_FIELD_ORDER.filter(
          (field) => result.fieldErrors[field],
        );
        flushSync(() => {
          setServerFieldErrors(result.fieldErrors);
          markReported(fields.length > 0 ? fields : ["message"]);
          setPhase("invalid");
          setStatusTone("idle");
          setStatusText("");
        });
        summaryRef.current?.focus();
        submitLock.current = false;
        return;
      }
      case "rate-limited": {
        setPhase("rate-limited");
        setStatusTone("error");
        setStatusText(
          result.retryAfterSeconds
            ? `${result.message} Try again in about ${result.retryAfterSeconds} seconds.`
            : result.message,
        );
        submitLock.current = false;
        return;
      }
      case "unavailable": {
        setPhase("unavailable");
        setStatusTone("error");
        setStatusText(result.message);
        // Provider/config failures may have spent or invalidated the token.
        if (challengeRequired) {
          resetTurnstileChallenge();
        }
        submitLock.current = false;
        return;
      }
      case "unknown-outcome": {
        setPhase("unknown-outcome");
        setStatusTone("error");
        setStatusText(result.message);
        resetTurnstileChallenge();
        submitLock.current = false;
        return;
      }
      case "challenge-failed": {
        setPhase("challenge-failed");
        setStatusTone("error");
        setStatusText(result.message);
        resetTurnstileChallenge();
        submitLock.current = false;
        return;
      }
      default: {
        setPhase("unknown-outcome");
        setStatusTone("error");
        setStatusText(
          "We could not confirm whether your enquiry was received. Try again later, or email / WhatsApp us using the contact details on this page.",
        );
        submitLock.current = false;
      }
    }
  }

  if (!hydrated) {
    return (
      <div className={cn("max-w-reading", className)}>
        <p className="m-0 text-sm text-text-muted">
          Preparing the enquiry form… If JavaScript is unavailable, use email or
          WhatsApp on the Contact page instead.
        </p>
      </div>
    );
  }

  if (phase === "accepted") {
    return (
      <div className={cn("max-w-reading space-y-6", className)}>
        <InlineStatus id={statusId} tone="success">
          {statusText}
        </InlineStatus>
        {demoMode ? (
          <p className="m-0 text-sm font-medium text-text-muted">
            Demo — no enquiry was sent.
          </p>
        ) : null}
        <Button
          type="button"
          variant="secondary"
          onClick={resetForAnotherEnquiry}
        >
          Start another enquiry
        </Button>
      </div>
    );
  }

  return (
    <form
      className={cn("max-w-reading space-y-6", className)}
      onSubmit={onSubmit}
      noValidate
      method="post"
      action="#"
    >
      <ErrorSummary ref={summaryRef} id={summaryId} errors={summaryErrors} />

      <InlineStatus id={statusId} tone={statusTone}>
        {statusText}
      </InlineStatus>

      {(phase === "rate-limited" ||
        phase === "unavailable" ||
        phase === "unknown-outcome" ||
        phase === "challenge-failed") &&
      directContactHref ? (
        <p className="m-0 text-sm text-text-body">
          Prefer a direct channel:{" "}
          <TextLink
            href={directContactHref}
            newTab={directContactHref.startsWith("https://")}
          >
            {directContactLabel}
          </TextLink>
          .
        </p>
      ) : null}

      <FormField
        id={fieldId(idPrefix, "name")}
        label="Name"
        required
        error={reported.has("name") ? mergedErrors.name : undefined}
      >
        {(control) => (
          <TextInput
            {...control}
            name="name"
            autoComplete="name"
            value={values.name}
            disabled={isPending}
            onChange={(event) => updateField("name", event.target.value)}
            onBlur={() => onBlurField("name")}
          />
        )}
      </FormField>

      <FormField
        id={fieldId(idPrefix, "email")}
        label="Email"
        required
        hint="We use this address to reply about your project."
        error={reported.has("email") ? mergedErrors.email : undefined}
      >
        {(control) => (
          <TextInput
            {...control}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={values.email}
            disabled={isPending}
            onChange={(event) => updateField("email", event.target.value)}
            onBlur={() => onBlurField("email")}
          />
        )}
      </FormField>

      <FormField
        id={fieldId(idPrefix, "company")}
        label="Company"
        optional
        error={reported.has("company") ? mergedErrors.company : undefined}
      >
        {(control) => (
          <TextInput
            {...control}
            name="company"
            autoComplete="organization"
            value={values.company}
            disabled={isPending}
            onChange={(event) => updateField("company", event.target.value)}
            onBlur={() => onBlurField("company")}
          />
        )}
      </FormField>

      <FormField
        id={fieldId(idPrefix, "service")}
        label="Service"
        required
        hint="Choose the closest fit, or Not sure yet."
        error={reported.has("service") ? mergedErrors.service : undefined}
      >
        {(control) => (
          <SelectField
            {...control}
            name="service"
            value={values.service}
            disabled={isPending}
            onChange={(event) => updateField("service", event.target.value)}
            onBlur={() => onBlurField("service")}
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
        id={fieldId(idPrefix, "message")}
        label="Message"
        required
        hint={`Describe what you want to improve. Aim for at least ${ENQUIRY_LIMITS.messageMin} characters (counted after trimming edges).`}
        error={reported.has("message") ? mergedErrors.message : undefined}
      >
        {(control) => (
          <div className="space-y-2">
            <TextArea
              {...control}
              name="message"
              rows={6}
              value={values.message}
              disabled={isPending}
              onChange={(event) => updateField("message", event.target.value)}
              onBlur={() => onBlurField("message")}
            />
            <p className="m-0 text-sm text-text-muted" aria-hidden="true">
              {messageCount} / {ENQUIRY_LIMITS.messageMax}
            </p>
          </div>
        )}
      </FormField>

      <FormField
        id={fieldId(idPrefix, "timeline")}
        label="Preferred timing"
        optional
        error={reported.has("timeline") ? mergedErrors.timeline : undefined}
      >
        {(control) => (
          <SelectField
            {...control}
            name="timeline"
            value={values.timeline}
            disabled={isPending}
            onChange={(event) => updateField("timeline", event.target.value)}
            onBlur={() => onBlurField("timeline")}
          >
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
        id={fieldId(idPrefix, "requestType")}
        label="Request type"
        optional
        hint="A meeting request describes interest only — it does not book a slot."
        error={
          reported.has("requestType") ? mergedErrors.requestType : undefined
        }
      >
        {(control) => (
          <SelectField
            {...control}
            name="requestType"
            value={values.requestType}
            disabled={isPending}
            onChange={(event) => updateField("requestType", event.target.value)}
            onBlur={() => onBlurField("requestType")}
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
        id={fieldId(idPrefix, "preferredContact")}
        label="Preferred reply channel"
        optional
        hint="Phone appears only when you choose phone or WhatsApp."
        error={
          reported.has("preferredContact")
            ? mergedErrors.preferredContact
            : undefined
        }
      >
        {(control) => (
          <SelectField
            {...control}
            name="preferredContact"
            value={values.preferredContact}
            disabled={isPending}
            onChange={(event) => {
              const next = event.target.value;
              updateField("preferredContact", next);
              if (!phoneIsRequired(next)) {
                updateField("phone", "");
              }
            }}
            onBlur={() => onBlurField("preferredContact")}
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
          id={fieldId(idPrefix, "phone")}
          label="Phone or WhatsApp number"
          required
          hint="Include a country code when possible."
          error={reported.has("phone") ? mergedErrors.phone : undefined}
        >
          {(control) => (
            <TextInput
              {...control}
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              value={values.phone}
              disabled={isPending}
              onChange={(event) => updateField("phone", event.target.value)}
              onBlur={() => onBlurField("phone")}
            />
          )}
        </FormField>
      ) : null}

      <p className="m-0 text-sm text-text-muted">
        Budget options are omitted until useful ranges and currency are
        approved. Do not upload files or share passwords here.
      </p>

      <p className="m-0 text-sm text-text-body">
        We use the details you type to respond to this enquiry.
        {privacyHref ? (
          <>
            {" "}
            Read the <TextLink href={privacyHref}>Privacy</TextLink> page for
            more detail.
          </>
        ) : (
          <> A privacy page link will appear when that policy is published.</>
        )}
      </p>

      {challengeRequired && turnstileSiteKey ? (
        <TurnstileChallenge
          siteKey={turnstileSiteKey}
          disabled={isPending}
          resetSignal={turnstileResetSignal}
          onTokenChange={setTurnstileToken}
          onReadyChange={setTurnstileReady}
        />
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          variant="primary"
          disabled={
            isPending ||
            (challengeRequired && !turnstileReady && !turnstileToken)
          }
        >
          {isPending ? "Sending…" : "Send enquiry"}
        </Button>
      </div>
    </form>
  );
}
