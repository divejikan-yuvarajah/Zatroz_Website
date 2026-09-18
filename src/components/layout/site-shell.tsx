import type { ReactNode } from "react";
import { SkipLink } from "@/components/layout/skip-link";

export type SiteShellProps = {
  children: ReactNode;
  /** SiteHeader from Step 15. Omit rather than passing an empty landmark. */
  header?: ReactNode;
  /** SiteFooter from Step 17. Omit rather than passing an empty landmark. */
  footer?: ReactNode;
};

/**
 * Shared page chrome. Root layout stays a Server Component and passes children here.
 * Header/footer slots render the node as given; those components should own header/footer landmarks.
 */
export function SiteShell({ children, header, footer }: SiteShellProps) {
  return (
    <div className="site-shell relative flex flex-col bg-canvas text-text-body">
      <SkipLink />
      {header}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex min-h-0 flex-1 flex-col scroll-mt-[5.75rem] focus:outline focus:outline-[3px] focus:outline-offset-[3px] focus:[outline-color:var(--ink)]"
      >
        {children}
      </main>
      {footer}
    </div>
  );
}
