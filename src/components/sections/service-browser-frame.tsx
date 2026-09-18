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
