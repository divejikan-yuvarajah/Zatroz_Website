"use server";

import { revalidatePath } from "next/cache";
import { requirePermissionSession } from "@/server/security/auth-gate";
import { isStaffRole, type StaffRole } from "@/lib/auth/staff-role";
import { updateStaffMemberRole } from "@/server/admin/staff";

export type StaffRoleActionState =
  { ok: true; message: string } | { ok: false; message: string };

export async function updateStaffRoleAction(
  _prev: StaffRoleActionState | null,
  formData: FormData,
): Promise<StaffRoleActionState> {
  const gate = await requirePermissionSession("admin.staff.manage");
  if (!gate.ok) {
    return {
      ok: false,
      message: "You do not have permission to manage staff roles.",
    };
  }

  const targetUserId = String(formData.get("targetUserId") ?? "").trim();
  const nextRoleRaw = String(formData.get("nextRole") ?? "").trim();

  if (!targetUserId || !isStaffRole(nextRoleRaw)) {
    return { ok: false, message: "Invalid role update request." };
  }

  const nextRole = nextRoleRaw as StaffRole;
  const actorUserId = gate.context.userId;
  if (!actorUserId) {
    return { ok: false, message: "Session is missing a user id." };
  }

  const result = await updateStaffMemberRole({
    actorUserId,
    targetUserId,
    nextRole,
  });

  if (!result.ok) {
    return { ok: false, message: result.detail };
  }

  revalidatePath("/admin/staff");
  return { ok: true, message: "Role updated." };
}
