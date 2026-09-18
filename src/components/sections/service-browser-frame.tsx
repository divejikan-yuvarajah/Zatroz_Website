import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ServiceBrowserFrameProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Light labelled browser chrome for service illustrations.
 * Decorative sample content only — not a live product UI.
 */
export function ServiceBrowserFrame({
  title = "sample.site",
  children,
  className,
}: ServiceBrowserFrameProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-border-subtle bg-canvas shadow-sm",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border-subtle bg-surface-muted px-3 py-2">
        <span aria-hidden="true" className="flex gap-1">
          <span className="size-2 rounded-full bg-border-control" />
          <span className="size-2 rounded-full bg-border-control" />
          <span className="size-2 rounded-full bg-border-control" />
        </span>
        <p className="m-0 min-w-0 flex-1 truncate text-center text-xs text-text-muted">
          {title}
        </p>
      </div>
      <div className="p-4 text-sm text-text-body">{children}</div>
    </div>
  );
}

/** Compact hero decoration — sample labels only. */
export function ServiceHeroBrowserVisual({
  className,
}: {
  className?: string;
}) {
  return (
    <figure className={cn("m-0 min-w-0", className)}>
      <ServiceBrowserFrame title="your-business.example">
        <p className="m-0 text-xs font-medium text-text-muted">Sample page</p>
        <p className="mt-2 m-0 font-semibold text-ink">What we offer</p>
        <p className="mt-1 m-0 text-text-body">
          Clear summary and a next step for visitors.
        </p>
        <p className="mt-3 m-0 text-sm font-medium text-ink">Contact us →</p>
      </ServiceBrowserFrame>
      <figcaption className="mt-2 m-0 text-xs text-text-muted">
        Illustrative layout only — not a live website preview.
      </figcaption>
    </figure>
  );
}

/** Sample phone chrome for application illustrations. */
export function ServicePhoneFrame({
  title = "Sample app",
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[14rem] overflow-hidden rounded-[1.25rem] border border-border-subtle bg-canvas shadow-sm",
        className,
      )}
    >
      <div className="border-b border-border-subtle bg-surface-muted px-3 py-2 text-center">
        <p className="m-0 text-xs font-medium text-text-muted">{title}</p>
      </div>
      <div className="p-3 text-sm text-text-body">{children}</div>
    </div>
  );
}

/** Compact hero decoration — browser beside phone, sample only. */
export function ServiceHeroDevicePairVisual({
  className,
}: {
  className?: string;
}) {
  return (
    <figure className={cn("m-0 min-w-0", className)}>
      <div className="grid items-end gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
        <ServiceBrowserFrame title="app.example">
          <p className="m-0 text-xs font-medium text-text-muted">
            Sample workspace
          </p>
          <p className="mt-2 m-0 font-semibold text-ink">Request list</p>
          <p className="mt-1 m-0 text-text-body">Open · Review · Decide</p>
        </ServiceBrowserFrame>
        <ServicePhoneFrame title="Sample phone">
          <p className="m-0 text-xs font-medium text-text-muted">Sample task</p>
          <p className="mt-2 m-0 font-semibold text-ink">New request</p>
          <p className="mt-1 m-0 text-xs text-text-body">Short form fields</p>
        </ServicePhoneFrame>
      </div>
      <figcaption className="mt-2 m-0 text-xs text-text-muted">
        Illustrative devices only — not a live application or login screen.
      </figcaption>
    </figure>
  );
}

/** Compact hero decoration — sample sales / stock / report strip. */
export function ServiceHeroOpsSummaryVisual({
  className,
}: {
  className?: string;
}) {
  return (
    <figure className={cn("m-0 min-w-0", className)}>
      <div className="overflow-hidden rounded-md border border-border-subtle bg-canvas">
        <div className="border-b border-border-subtle bg-surface-muted px-3 py-2">
          <p className="m-0 text-xs font-medium text-text-muted">
            Sample operations strip
          </p>
        </div>
        <ul className="m-0 grid list-none gap-0 p-0 sm:grid-cols-3">
          <li className="border-b border-border-subtle p-3 sm:border-b-0 sm:border-r">
            <p className="m-0 text-xs font-medium text-text-muted">Sales</p>
            <p className="mt-1 m-0 text-sm font-semibold text-ink">
              2 × Blue Notebook
            </p>
          </li>
          <li className="border-b border-border-subtle p-3 sm:border-b-0 sm:border-r">
            <p className="m-0 text-xs font-medium text-text-muted">Stock</p>
            <p className="mt-1 m-0 text-sm font-semibold text-ink">10 → 8</p>
          </li>
          <li className="p-3">
            <p className="m-0 text-xs font-medium text-text-muted">Report</p>
            <p className="mt-1 m-0 text-sm font-semibold text-ink">
              1 sample line
            </p>
          </li>
        </ul>
      </div>
      <figcaption className="mt-2 m-0 text-xs text-text-muted">
        Sample labels only — not live totals, payments, or inventory storage.
      </figcaption>
    </figure>
  );
}

/** Compact hero decoration — sample steps ending in a human review marker. */
export function ServiceHeroReviewWorkflowVisual({
  className,
}: {
  className?: string;
}) {
  const labels = ["Request", "Check", "Draft", "Review", "Action"] as const;

  return (
    <figure className={cn("m-0 min-w-0", className)}>
      <div className="overflow-hidden rounded-md border border-border-subtle bg-canvas p-4">
        <p className="m-0 text-xs font-medium text-text-muted">
          Sample path · human review required
        </p>
        <ol className="mt-3 flex list-none flex-wrap items-center gap-2 p-0">
          {labels.map((label, index) => (
            <li key={label} className="flex items-center gap-2">
              <span
                className={
                  label === "Review"
                    ? "inline-flex min-h-9 items-center rounded-sm bg-brand px-2.5 text-sm font-semibold text-ink"
                    : "inline-flex min-h-9 items-center rounded-sm border border-border-control px-2.5 text-sm font-medium text-ink"
                }
              >
                {label}
              </span>
              {index < labels.length - 1 ? (
                <span aria-hidden="true" className="text-text-muted">
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="mt-2 m-0 text-xs text-text-muted">
        Illustrative steps only — not a live automation or chatbot.
      </figcaption>
    </figure>
  );
}

/** Compact hero decoration — sample modular forms linked for tailored software. */
export function ServiceHeroModulesLinkVisual({
  className,
}: {
  className?: string;
}) {
  return (
    <figure className={cn("m-0 min-w-0", className)}>
      <div className="overflow-hidden rounded-md border border-border-subtle bg-canvas p-4">
        <p className="m-0 text-xs font-medium text-text-muted">
          Sample modules · tailored fit
        </p>
        <ul className="mt-3 flex list-none flex-wrap items-center gap-2 p-0">
          {(["Existing tool", "Tailored app", "Report / notify"] as const).map(
            (label, index, all) => (
              <li key={label} className="flex items-center gap-2">
                <span className="inline-flex min-h-9 items-center rounded-sm border border-border-control bg-surface-muted px-2.5 text-sm font-medium text-ink">
                  {label}
                </span>
                {index < all.length - 1 ? (
                  <span aria-hidden="true" className="font-semibold text-brand">
                    —
                  </span>
                ) : null}
              </li>
            ),
          )}
        </ul>
      </div>
      <figcaption className="mt-2 m-0 text-xs text-text-muted">
        Illustrative relationship only — not a live integration or product UI.
      </figcaption>
    </figure>
  );
}

/** Compact hero decoration — blank panels suggesting structure before polish. */
export function ServiceHeroWireframeStackVisual({
  className,
}: {
  className?: string;
}) {
  return (
    <figure className={cn("m-0 min-w-0", className)}>
      <div className="overflow-hidden rounded-md border border-border-subtle bg-canvas p-4">
        <p className="m-0 text-xs font-medium text-text-muted">
          Sample structure · before polish
        </p>
        <ul className="mt-3 flex list-none flex-col gap-2 p-0">
          <li
            className="h-3 max-w-[60%] rounded-sm bg-surface-muted"
            aria-hidden="true"
          />
          <li
            className="h-10 rounded-sm border border-dashed border-border-control bg-surface"
            aria-hidden="true"
          />
          <li className="flex gap-2" aria-hidden="true">
            <span className="h-8 min-w-0 flex-1 rounded-sm border border-dashed border-border-control bg-surface" />
            <span className="h-8 w-[30%] shrink-0 rounded-sm border border-brand bg-surface-muted" />
          </li>
        </ul>
      </div>
      <figcaption className="mt-2 m-0 text-xs text-text-muted">
        Illustrative hierarchy only — not a client wireframe or live product.
      </figcaption>
    </figure>
  );
}
