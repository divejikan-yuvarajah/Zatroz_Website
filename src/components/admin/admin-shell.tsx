import type { ReactNode } from "react";
import { AdminShellHeader } from "@/components/admin/admin-shell-header";
import type { AdminNavItem } from "@/lib/admin/nav";

export type AdminShellProps = {
  email: string | null;
  role: string | null;
  navItems: readonly AdminNavItem[];
  children: ReactNode;
};

export function AdminShell({
  email,
  role,
  navItems,
  children,
}: AdminShellProps) {
  return (
    <div className="flex min-h-screen min-h-dvh flex-col bg-canvas text-text-body">
      <AdminShellHeader email={email} role={role} navItems={navItems} />
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl flex-1 px-gutter py-8 focus:outline focus:outline-[3px] focus:outline-offset-[3px] focus:[outline-color:var(--ink)]"
      >
        {children}
      </main>
    </div>
  );
}
