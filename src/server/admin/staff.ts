import "server-only";

import { getDb } from "@/lib/mongodb/connection";
import { isMongoRuntimeConfigured } from "@/lib/mongodb/config";
import { sanitizeMongoError } from "@/lib/mongodb/config";
import { isStaffRole, type StaffRole } from "@/lib/auth/staff-role";
import { getAuth } from "@/server/auth";

/** Better Auth default user collection name (singular). */
const AUTH_USER_COLLECTION = "user";

export type StaffMemberSummary = Readonly<{
  id: string;
  name: string;
  email: string;
  staffRole: StaffRole;
  twoFactorEnabled: boolean;
}>;

export type StaffListResult =
  | { ok: true; members: readonly StaffMemberSummary[] }
  | { ok: false; reason: "unavailable"; detail: string };

export async function listStaffMembers(): Promise<StaffListResult> {
  if (!isMongoRuntimeConfigured()) {
    return {
      ok: false,
      reason: "unavailable",
      detail: "MongoDB is not configured.",
    };
  }

  try {
    const db = await getDb();
    const users = db.collection(AUTH_USER_COLLECTION);
    const docs = await users
      .find(
        {
          $or: [
            { staffRole: "owner" },
            { staffRole: "editor" },
            // Legacy / default field may be missing on edge rows — exclude those.
          ],
        },
        {
          projection: {
            id: 1,
            name: 1,
            email: 1,
            staffRole: 1,
            twoFactorEnabled: 1,
          },
        },
      )
      .sort({ email: 1 })
      .toArray();

    const members: StaffMemberSummary[] = [];
    for (const doc of docs) {
      const rawId = doc.id ?? doc._id;
      const id =
        typeof rawId === "string"
          ? rawId
          : rawId != null
            ? String(rawId)
            : null;
      const email = typeof doc.email === "string" ? doc.email : null;
      const name = typeof doc.name === "string" ? doc.name : "";
      const staffRole = isStaffRole(doc.staffRole) ? doc.staffRole : null;
      if (!id || !email || !staffRole) continue;
      members.push({
        id,
        name,
        email,
        staffRole,
        twoFactorEnabled: doc.twoFactorEnabled === true,
      });
    }

    return { ok: true, members };
  } catch (error) {
    return {
      ok: false,
      reason: "unavailable",
      detail: sanitizeMongoError(error),
    };
  }
}

export type UpdateStaffRoleResult =
  | { ok: true }
  | {
      ok: false;
      reason:
        "unavailable" | "not-found" | "invalid-role" | "last-owner" | "denied";
      detail: string;
    };

/**
 * Change a staff member's role. Refuses to demote the last owner.
 * Does not invent invitations — existing accounts only.
 */
export async function updateStaffMemberRole(input: {
  actorUserId: string;
  targetUserId: string;
  nextRole: StaffRole;
}): Promise<UpdateStaffRoleResult> {
  if (!isStaffRole(input.nextRole)) {
    return {
      ok: false,
      reason: "invalid-role",
      detail: "Role must be owner or editor.",
    };
  }

  if (!isMongoRuntimeConfigured()) {
    return {
      ok: false,
      reason: "unavailable",
      detail: "MongoDB is not configured.",
    };
  }

  try {
    const auth = await getAuth();
    const ctx = await auth.$context;
    const target = await ctx.internalAdapter.findUserById(input.targetUserId);
    if (!target) {
      return {
        ok: false,
        reason: "not-found",
        detail: "Staff member was not found.",
      };
    }

    const targetFields = target as unknown as { staffRole?: unknown };
    const currentRole = isStaffRole(targetFields.staffRole)
      ? targetFields.staffRole
      : null;

    if (currentRole === "owner" && input.nextRole !== "owner") {
      const listed = await listStaffMembers();
      if (!listed.ok) {
        return {
          ok: false,
          reason: "unavailable",
          detail: listed.detail,
        };
      }
      const owners = listed.members.filter((m) => m.staffRole === "owner");
      if (owners.length <= 1) {
        return {
          ok: false,
          reason: "last-owner",
          detail: "Cannot demote the last owner account.",
        };
      }
    }

    await ctx.internalAdapter.updateUser(input.targetUserId, {
      staffRole: input.nextRole,
    });

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      reason: "unavailable",
      detail: sanitizeMongoError(error),
    };
  }
}
