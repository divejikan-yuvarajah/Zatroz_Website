"use client";

import { useState, useSyncExternalStore } from "react";
import type {
  AutomationStage,
  SampleInvoiceField,
} from "@/content/automation-example";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

function subscribe() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

function SampleInvoiceCard({
  title,
  caption,
  fields,
  emphasizeReview,
}: {
  title: string;
  caption: string;
  fields: readonly SampleInvoiceField[];
  emphasizeReview: boolean;
}) {
  return (
    <aside
      className="rounded-md border border-border-inverse bg-surface-inverse/40 p-4"
      aria-label={title}
    >
      <p className="m-0 text-sm font-semibold text-text-inverse">{title}</p>
      <p className="mt-1 m-0 text-sm text-text-inverse-muted">{caption}</p>
      <dl className="mt-4 m-0 space-y-3">
        {fields.map((field) => (
          <div key={field.id} className="min-w-0">
            <dt className="m-0 text-sm text-text-inverse-muted">
              {field.label}
            </dt>
            <dd className="mt-1 m-0 flex flex-wrap items-center gap-2">
              <span className="text-base text-text-inverse">{field.value}</span>
              {field.needsReview ? (
                <span
                  className={cn(
                    "inline-flex rounded-sm px-2 py-0.5 text-sm font-medium",
                    emphasizeReview
                      ? "bg-brand text-ink ring-2 ring-inset ring-text-inverse"
                      : "bg-brand-soft text-brand-strong",
                  )}
                >
                  Needs review
                </span>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

function StageList({
  stages,
  activeIndex,
  idPrefix,
}: {
  stages: readonly AutomationStage[];
  activeIndex: number | null;
  idPrefix: string;
}) {
  return (
    <ol
      className={cn(
        "m-0 list-none p-0",
        "flex flex-col gap-0",
        "lg:grid lg:grid-cols-4 lg:gap-4",
      )}
    >
      {stages.map((stage, index) => {
        const active = activeIndex === index;
        const showConnector = index < stages.length - 1;

        return (
          <li key={stage.id} className="min-w-0 lg:flex lg:flex-col">
            <div
              className={cn(
                "rounded-sm border px-3 py-3",
                active
                  ? "border-brand bg-surface-inverse ring-2 ring-inset ring-brand"
                  : "border-border-inverse bg-surface-inverse/30",
              )}
            >
              <p
                id={`${idPrefix}${stage.id}-label`}
                className="m-0 text-sm font-semibold text-text-inverse"
              >
                <span className="text-text-inverse-muted">{index + 1}. </span>
                {stage.label}
              </p>
              <p className="mt-2 m-0 text-sm text-text-inverse-body">
                {stage.detail}
              </p>
            </div>

            {showConnector ? (
              <div
                className="flex items-center justify-center py-2 lg:hidden"
                aria-hidden="true"
              >
                <svg
                  width="12"
                  height="28"
                  viewBox="0 0 12 28"
                  className="text-brand"
                >
                  <path
                    d="M6 2 v18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3 16 L6 22 L9 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

export type AutomationWorkflowPanelProps = {
  stages: readonly AutomationStage[];
  sampleInvoice: {
    title: string;
    caption: string;
    fields: readonly SampleInvoiceField[];
  };
  completionMessage: string;
  idPrefix?: string;
};

/**
 * Static workflow plus optional manual walkthrough.
 * Explanatory stages remain visible; walkthrough only highlights progress.
 */
export function AutomationWorkflowPanel({
  stages,
  sampleInvoice,
  completionMessage,
  idPrefix = "",
}: AutomationWorkflowPanelProps) {
  const ready = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const [walking, setWalking] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [complete, setComplete] = useState(false);
  const [status, setStatus] = useState("");

  const activeIndex = walking ? stepIndex : null;
  const reviewActive = walking && stages[stepIndex]?.id === "review";

  function startWalkthrough() {
    setWalking(true);
    setStepIndex(0);
    setComplete(false);
    setStatus(`Step 1: ${stages[0]!.label}`);
  }

  function nextStep() {
    if (stepIndex >= stages.length - 1) {
      setComplete(true);
      setStatus(completionMessage);
      return;
    }
    const next = stepIndex + 1;
    setStepIndex(next);
    setComplete(false);
    setStatus(`Step ${next + 1}: ${stages[next]!.label}`);
  }

  function reset() {
    setWalking(false);
    setStepIndex(0);
    setComplete(false);
    setStatus("Example reset to the full overview.");
  }

  return (
    <div className="min-w-0">
      <StageList
        stages={stages}
        activeIndex={activeIndex}
        idPrefix={idPrefix}
      />

      <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
        <SampleInvoiceCard
          title={sampleInvoice.title}
          caption={sampleInvoice.caption}
          fields={sampleInvoice.fields}
          emphasizeReview={Boolean(reviewActive)}
        />

        <div className="min-w-0">
          {ready ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {!walking ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={startWalkthrough}
                  className="border-border-inverse bg-transparent text-text-inverse hover:bg-surface-inverse/50"
                >
                  Step through example
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={nextStep}
                    disabled={complete}
                    className="border-border-inverse bg-transparent text-text-inverse hover:bg-surface-inverse/50 disabled:opacity-60"
                  >
                    Next step
                  </Button>
                  <Button
                    type="button"
                    variant="quiet"
                    onClick={reset}
                    className="text-text-inverse hover:bg-surface-inverse/50"
                  >
                    Reset
                  </Button>
                </>
              )}
            </div>
          ) : null}

          <p className="sr-only" aria-live="polite">
            {status}
          </p>

          {complete ? (
            <p
              className="mt-4 m-0 rounded-sm border border-border-inverse bg-surface-inverse/40 px-3 py-3 text-sm font-medium text-text-inverse"
              role="status"
            >
              {completionMessage}
            </p>
          ) : null}

          {walking && !complete && stages[stepIndex] ? (
            <p className="mt-4 m-0 text-sm text-text-inverse-body">
              <span className="font-semibold text-text-inverse">
                Now showing.{" "}
              </span>
              {stages[stepIndex]!.detail}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
