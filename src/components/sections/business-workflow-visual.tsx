import type { HeroScenario } from "@/content/home";
import { cn } from "@/lib/cn";

export type BusinessWorkflowVisualProps = {
  scenario: HeroScenario;
  caption: string;
  idPrefix?: string;
  className?: string;
};

/**
 * Connected-business workflow: three readable panels and a decorative path.
 * Meaningful labels stay in HTML text; SVG connectors are aria-hidden.
 */
export function BusinessWorkflowVisual({
  scenario,
  caption,
  idPrefix = "",
  className,
}: BusinessWorkflowVisualProps) {
  const captionId = `${idPrefix}${scenario.id}-workflow-caption`;

  return (
    <figure
      className={cn(
        "m-0 min-w-0 rounded-md border border-border-subtle bg-surface p-4 sm:p-5",
        className,
      )}
      aria-labelledby={captionId}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="m-0 text-sm font-semibold text-ink">{scenario.title}</p>
        <p className="m-0 text-sm text-text-muted">Illustrative workflow</p>
      </div>

      <ol className="mt-4 list-none space-y-0 p-0">
        {scenario.stages.map((stage, index) => (
          <li key={stage.id} className="min-w-0">
            <div className="rounded-sm border border-border-control bg-canvas px-3 py-3">
              <p className="m-0 text-sm font-medium text-ink">
                <span className="text-text-muted">{index + 1}. </span>
                {stage.label}
              </p>
              <p className="mt-1 text-sm text-text-body">{stage.detail}</p>
            </div>
            {index < scenario.stages.length - 1 ? (
              <div
                className="flex items-center justify-center py-2"
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
        ))}
      </ol>

      <figcaption id={captionId} className="ds-support mt-4">
        {scenario.explanation} {caption}
      </figcaption>
    </figure>
  );
}
