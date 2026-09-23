"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import type { AdminNavItem } from "@/lib/admin/nav";
import { cn } from "@/lib/cn";

export type AdminShellHeaderProps = {
  email: string | null;
  role: string | null;
  navItems: readonly AdminNavItem[];
};

export function AdminShellHeader({
  email,
  role,
  navItems,
}: AdminShellHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await authClient.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-border-subtle bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-gutter py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-text-muted uppercase">
            Zatroz staff
          </p>
          <p className="truncate text-sm text-text-body">
            {email ?? "Signed in"}
            {role ? <span className="text-text-muted"> · {role}</span> : null}
          </p>
        </div>
        <Button
          type="button"
          variant="quiet"
          size="compact"
          onClick={() => void signOut()}
        >
          Sign out
        </Button>
      </div>
      <nav
        aria-label="Admin"
        className="mx-auto w-full max-w-6xl overflow-x-auto overscroll-x-contain px-gutter pb-3 [-webkit-overflow-scrolling:touch]"
      >
        <ul className="flex min-w-0 gap-1">
          {navItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
            if (item.comingLater) {
              return (
                <li key={item.id}>
                  <span
                    className="inline-flex min-h-11 items-center px-3 text-sm text-text-muted"
                    title={item.comingLaterNote}
                  >
                    {item.label}
                    <span className="sr-only"> (coming later)</span>
                  </span>
                </li>
              );
            }
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={cn(
                    "inline-flex min-h-11 items-center px-3 text-sm font-medium text-ink underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:[outline-color:var(--ink)]",
                    active && "underline",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
