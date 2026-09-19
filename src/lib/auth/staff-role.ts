/**
 * Staff role + permission mapping (pure — safe for unit tests).
 * Roles are application fields on Better Auth users; never trust client-set roles.
 */

import type { Permission } from "@/lib/security/auth-gate";

export const STAFF_ROLES = ["owner", "editor"] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];

export function isStaffRole(value: unknown): value is StaffRole {
  return value === "owner" || value === "editor";
}

export function parseStaffRole(value: unknown): StaffRole | null {
  return isStaffRole(value) ? value : null;
}

/** Editor defaults: content only — never enquiries. */
export const EDITOR_PERMISSIONS: readonly Permission[] = [
  "admin.content.read",
  "admin.content.write",
] as const;

/** Owner content + enquiry inbox (when A03+ surfaces those routes). */
export const OWNER_PERMISSIONS: readonly Permission[] = [
  "admin.content.read",
  "admin.content.write",
  "admin.content.publish",
  "enquiries.read",
  "enquiries.manage",
] as const;

/**
 * Permissions for a staff role after MFA is complete.
 * Unknown / missing roles get nothing.
 */
export function permissionsForStaffRole(
  role: StaffRole | null | undefined,
): readonly Permission[] {
  if (role === "owner") return OWNER_PERMISSIONS;
  if (role === "editor") return EDITOR_PERMISSIONS;
  return [];
}
