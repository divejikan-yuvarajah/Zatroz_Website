/**
 * Illustrative enquiry flow + form states.
 * Static demonstration — not client work, not a live submission.
 */
export function UiUxFormStatesExample() {
  return (
    <div className="mt-8">
      <p className="m-0 text-sm text-text-muted">
        Illustrative design example — not client work. Sample text only; nothing
        is sent or stored.
      </p>

      <ol className="mt-4 flex list-none flex-wrap gap-2 p-0 text-sm">
        {(
          [
            { n: "1", label: "Start enquiry" },
            { n: "2", label: "Add details" },
            { n: "3", label: "Confirm" },
          ] as const
        ).map((step, index, all) => (
          <li key={step.n} className="flex items-center gap-2">
            <span className="inline-flex size-7 items-center justify-center rounded-full border border-border-control text-xs font-semibold text-ink">
              {step.n}
            </span>
            <span className="font-medium text-ink">{step.label}</span>
            {index < all.length - 1 ? (
              <span aria-hidden="true" className="text-text-muted">
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <figure className="m-0 min-w-0 rounded-md border border-border-subtle bg-canvas p-4">
          <p className="m-0 text-xs font-medium text-text-muted">
            Empty state · sample
          </p>
          <p className="mt-3 m-0 text-base font-semibold text-ink">
            Tell us what you need
          </p>
          <p className="mt-1 m-0 text-sm text-text-body">
            A short description is enough to start the conversation.
          </p>
          <div className="mt-4 space-y-3">
            <div>
              <p className="m-0 text-sm font-medium text-ink">Your name</p>
              <div
                className="mt-1 min-h-11 rounded-sm border border-border-control bg-surface px-3 py-2 text-sm text-text-muted"
                aria-hidden="true"
              >
                Sample name
              </div>
            </div>
            <div>
              <p className="m-0 text-sm font-medium text-ink">
                What should we help with?
              </p>
              <div
                className="mt-1 min-h-20 rounded-sm border border-border-control bg-surface px-3 py-2 text-sm text-text-muted"
                aria-hidden="true"
              >
                Sample: clearer enquiry form on our site
              </div>
            </div>
            <p className="m-0 inline-flex min-h-11 items-center rounded-sm bg-brand px-4 text-sm font-semibold text-ink ring-2 ring-ink ring-offset-2 ring-offset-canvas">
              Continue
              <span className="sr-only">
                {" "}
                — sample button showing a visible focus style; not interactive
              </span>
            </p>
          </div>
          <figcaption className="mt-3 m-0 text-xs text-text-muted">
            Clear labels and a visible focus treatment — decorative sample
            controls only.
          </figcaption>
        </figure>

        <figure className="m-0 min-w-0 rounded-md border border-border-subtle bg-canvas p-4">
          <p className="m-0 text-xs font-medium text-text-muted">
            Error state · sample
          </p>
          <p className="mt-3 m-0 text-base font-semibold text-ink">
            Check the highlighted fields
          </p>
          <p className="mt-1 m-0 text-sm text-text-body" role="status">
            Enter an email address in a format like name@example.com. Nothing
            was sent.
          </p>
          <div className="mt-4 space-y-3">
            <div>
              <p className="m-0 text-sm font-medium text-ink">Email</p>
              <div
                className="mt-1 min-h-11 rounded-sm border border-brand bg-surface px-3 py-2 text-sm text-ink"
                aria-hidden="true"
              >
                sample@
              </div>
              <p className="mt-1 m-0 text-sm text-text-body">
                Include the part after @, such as example.com.
              </p>
            </div>
            <p className="m-0 text-sm text-text-muted">
              Loading state (not shown as a spinner here): keep the previous
              content visible and tell the person work is in progress.
            </p>
          </div>
          <figcaption className="mt-3 m-0 text-xs text-text-muted">
            Useful error copy beats a vague “invalid input” message.
          </figcaption>
        </figure>
      </div>

      <figure className="mt-6 m-0 rounded-md border border-border-subtle bg-surface-muted p-4">
        <p className="m-0 text-xs font-medium text-text-muted">
          Success state · sample
        </p>
        <p className="mt-2 m-0 font-semibold text-ink">Details look ready</p>
        <p className="mt-1 m-0 text-sm text-text-body">
          In a real product, the next step would confirm what happens next. This
          sample does not submit an enquiry or book a meeting.
        </p>
        <figcaption className="mt-3 m-0 text-xs text-text-muted">
          Conceptual illustration only — not a measured before/after result.
        </figcaption>
      </figure>
    </div>
  );
}
