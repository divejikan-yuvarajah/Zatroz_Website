import type { Metadata } from "next";
import { AdminDashboardView } from "@/components/admin/admin-dashboard-view";
import { visibleAdminShortcuts } from "@/lib/admin/nav";
import { loadAdminDashboardData } from "@/server/admin/dashboard";
import { requireAdminSession } from "@/server/security/auth-gate";

export const metadata: Metadata = {
  title: "Admin dashboard — Zatroz",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const gate = await requireAdminSession();
  if (!gate.ok) {
    // Layout already redirects; narrow for types.
    return null;
  }

  const [data, shortcuts] = await Promise.all([
    loadAdminDashboardData(),
    Promise.resolve(visibleAdminShortcuts(gate.context)),
  ]);

  return <AdminDashboardView data={data} shortcuts={shortcuts} />;
}
