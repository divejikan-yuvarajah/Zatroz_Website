/**
 * Illustrative automation path with a human review step and exception branch.
 * Semantic text + CSS only — not a form, chatbot, or live runner.
 */
export function AiAutomationWorkflow() {
  const steps = [
    {
      id: "receive",
      title: "Request received",
      detail: "Sample enquiry or document arrives for the agreed workflow.",
    },
    {
      id: "check",
      title: "Required fields checked",
      detail:
        "Rules confirm whether enough information is present to continue.",
    },
    {
      id: "draft",
      title: "Draft prepared",
      detail:
        "A draft extraction, label, or reply is prepared for review — not sent automatically.",
    },
    {
      id: "review",
      title: "Person reviews",
      detail:
        "A named reviewer accepts, edits, or rejects. This step is required, not optional decoration.",
    },
    {
      id: "action",
      title: "Approved action",
      detail:
        "Only after review does the agreed next action happen in your process.",
    },
  ] as const;

  return (
    <div className="mt-8">
      <p className="m-0 text-sm text-text-muted">
        Illustrative workflow — not a functioning customer form or production
        integration. No model API or upload runs on this page.
      </p>

      <ol className="mt-4 list-none space-y-0 p-0">
        {steps.map((step, index) => (
          <li key={step.id} className="relative flex gap-4 pb-6 last:pb-0">
            {index < steps.length - 1 ? (
              <span
                aria-hidden="true"
                className="absolute top-8 bottom-0 left-[0.95rem] w-px bg-border-subtle"
              />
            ) : null}
            <span
              aria-hidden="true"
              className={
                step.id === "review"
                  ? "relative z-[1] flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-ink"
                  : "relative z-[1] flex size-8 shrink-0 items-center justify-center rounded-full border border-border-control bg-canvas text-sm font-semibold text-ink"
              }
            >
              {index + 1}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="m-0 font-semibold text-ink">{step.title}</p>
              <p className="mt-1 m-0 text-sm text-text-body">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-2 rounded-md border border-border-subtle bg-surface-muted p-4">
        <p className="m-0 text-sm font-semibold text-ink">
          Exception path — missing information
        </p>
        <p className="mt-2 m-0 text-sm text-text-body">
          If required fields are missing after the check step, the workflow
          stops for a person to request clarification. It does not invent facts
          or grant the system new permissions from the document text.
        </p>
      </div>
    </div>
  );
}
