import type { Metadata } from "next";
import { AdminNotificationOpsPanel } from "@/components/admin/admin-notification-ops-panel";
import { getDb } from "@/lib/mongodb/connection";
import { requirePermissionSession } from "@/server/security/auth-gate";
import { redirectForAuthDenial } from "@/server/security/admin-redirect";
import {
  listNotificationOpsRows,
  summarizeNotificationOps,
} from "@/server/repositories/enquiries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Notification recovery — Zatroz admin",
  robots: { index: false, follow: false },
};

export default async function AdminNotificationsPage() {
  const gate = await requirePermissionSession("enquiries.read");
  if (!gate.ok) {
    redirectForAuthDenial(gate.reason);
  }

  const canManage = gate.context.permissions.includes("enquiries.manage");

  let rows = null;
  let summary = null;
  let unavailableDetail: string | null = null;

  try {
    const db = await getDb();
    rows = await listNotificationOpsRows(db, { limit: 50 });
    summary = await summarizeNotificationOps(db);
  } catch {
    unavailableDetail = "MongoDB is not available for notification recovery.";
  }

  return (
    <div className="flex flex-col gap-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Notification recovery
        </h1>
        <p className="mt-2 max-w-prose text-text-body">
          Owner-only operational view for enquiry notification intents. This is
          not an enquiry CRM — it shows queue state, delivery facts, and
          recovery actions only. Editors cannot access this page.
        </p>
      </header>

      <AdminNotificationOpsPanel
        rows={rows}
        summary={summary}
        unavailableDetail={unavailableDetail}
        canManage={canManage}
      />
    </div>
  );
}
