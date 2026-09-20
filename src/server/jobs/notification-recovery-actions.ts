"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/mongodb/connection";
import { requirePermissionSession } from "@/server/security/auth-gate";
import { applyNotificationOwnerAction } from "@/server/repositories/enquiries";

export type NotificationRecoveryActionState =
  { ok: true; message: string } | { ok: false; message: string };

export async function notificationRecoveryAction(
  _prev: NotificationRecoveryActionState | null,
  formData: FormData,
): Promise<NotificationRecoveryActionState> {
  const gate = await requirePermissionSession("enquiries.manage");
  if (!gate.ok || !gate.context.userId) {
    return { ok: false, message: "Owner permission with MFA is required." };
  }

  const publicReference = String(formData.get("publicReference") ?? "").trim();
  const action = String(formData.get("action") ?? "").trim() as
    "pause" | "resume" | "retry-now" | "mark-reviewed" | "authorize-resend";
  const reason = String(formData.get("reason") ?? "").trim();
  const expectedRecoveryVersion = Number(
    formData.get("expectedRecoveryVersion") ?? NaN,
  );

  if (!publicReference) {
    return { ok: false, message: "Missing public reference." };
  }
  if (
    ![
      "pause",
      "resume",
      "retry-now",
      "mark-reviewed",
      "authorize-resend",
    ].includes(action)
  ) {
    return { ok: false, message: "Unknown recovery action." };
  }
  if (reason.length < 3 || reason.length > 200) {
    return {
      ok: false,
      message: "Provide a short reason (3–200 characters).",
    };
  }
  if (
    !Number.isInteger(expectedRecoveryVersion) ||
    expectedRecoveryVersion < 0
  ) {
    return { ok: false, message: "Missing recovery version." };
  }

  let db;
  try {
    db = await getDb();
  } catch {
    return { ok: false, message: "Database unavailable." };
  }

  const result = await applyNotificationOwnerAction(db, {
    publicReference,
    expectedRecoveryVersion,
    action,
    actorId: gate.context.userId,
    reason,
  });

  if (!result.ok) {
    const message =
      result.reason === "version-conflict"
        ? "This row changed. Refresh and try again."
        : result.reason === "lease-active"
          ? "A worker lease is still active. Wait for it to expire."
          : result.reason === "not-found"
            ? "Notification intent not found."
            : "Recovery action failed.";
    return { ok: false, message };
  }

  revalidatePath("/admin/notifications");
  revalidatePath("/admin");
  return { ok: true, message: `Action “${action}” recorded.` };
}
