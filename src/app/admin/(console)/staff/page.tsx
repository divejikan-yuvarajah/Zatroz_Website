import type { Metadata } from "next";
import { AdminStaffPanel } from "@/components/admin/admin-staff-panel";
import { redirectForAuthDenial } from "@/server/security/admin-redirect";
import { requirePermissionSession } from "@/server/security/auth-gate";
import { listStaffMembers } from "@/server/admin/staff";

export const metadata: Metadata = {
  title: "Staff — Zatroz admin",
  robots: { index: false, follow: false },
};

export default async function AdminStaffPage() {
  const gate = await requirePermissionSession("admin.staff.manage");
  if (!gate.ok) {
    redirectForAuthDenial(gate.reason);
  }

  const listed = await listStaffMembers();

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Staff
        </h1>
        <p className="mt-2 max-w-prose text-text-body">
          Owner-only role management for existing accounts. There is no public
          registration. Invitations are not sent from this screen — bootstrap
          the first owner from the env script, then adjust roles here.
        </p>
      </header>
      <AdminStaffPanel
        members={listed.ok ? listed.members : null}
        unavailableDetail={listed.ok ? null : listed.detail}
        currentUserId={gate.context.userId}
      />
    </div>
  );
}
