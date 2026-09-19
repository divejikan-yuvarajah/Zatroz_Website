import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { visibleAdminNav } from "@/lib/admin/nav";
import { requireAdminSession } from "@/server/security/auth-gate";

export const dynamic = "force-dynamic";

export const metadata = {
  robots: { index: false, follow: false },
};

/**
 * Protected console layout — session + MFA + content-admin permission required.
 * Login and MFA live outside this group.
 */
export default async function AdminConsoleLayout({
  children,
}: {
  children: ReactNode;
}) {
  const gate = await requireAdminSession();

  if (!gate.ok) {
    if (gate.reason === "mfa-required") {
      redirect("/admin/mfa");
    }
    redirect("/admin/login");
  }

  const navItems = visibleAdminNav(gate.context);

  return (
    <AdminShell
      email={gate.context.email}
      role={gate.context.staffRole}
      navItems={navItems}
    >
      {children}
    </AdminShell>
  );
}
