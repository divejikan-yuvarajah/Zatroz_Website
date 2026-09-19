"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { SkipLink } from "@/components/layout/skip-link";

export type AppChromeProps = {
  children: ReactNode;
  /** Server-rendered marketing header — pass from root layout; do not import here. */
  marketingHeader: ReactNode;
  /** Server-rendered marketing footer — pass from root layout; do not import here. */
  marketingFooter: ReactNode;
};

/**
 * Marketing chrome for public routes; admin owns its own shell.
 * Header/footer must be passed as Server Component slots (not imported here).
 */
export function AppChrome({
  children,
  marketingHeader,
  marketingFooter,
}: AppChromeProps) {
  const pathname = usePathname();
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdmin) {
    return (
      <>
        <SkipLink />
        {children}
      </>
    );
  }

  return (
    <SiteShell header={marketingHeader} footer={marketingFooter}>
      {children}
    </SiteShell>
  );
}
