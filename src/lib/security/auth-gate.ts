/**
 * Admin / permission gates for staff sessions (A02+).
 * Pure helpers — pass an AuthContext from the server session loader.
 * Never trust a role cookie/header alone.
 */

import {
  EDITOR_PERMISSIONS,
  OWNER_PERMISSIONS,
  permissionsForStaffRole,
  type StaffRole,
} from "@/lib/auth/staff-role";

export type Permission =
  | "admin.content.read"
  | "admin.content.write"
  | "admin.content.publish"
  | "admin.staff.manage"
  | "enquiries.read"
  | "enquiries.manage";

export type AuthDenialReason =
  "auth-unavailable" | "unauthenticated" | "mfa-required" | "denied";

/** Where to send the browser after a failed admin gate. */
export function pathForAuthDenial(reason: AuthDenialReason): string {
  if (reason === "mfa-required") return "/admin/mfa";
  if (reason === "denied") return "/admin";
  return "/admin/login";
}

export type AuthContext = Readonly<{
  /** Auth library + Mongo are configured enough to evaluate sessions. */
  authAvailable: boolean;
  authenticated: boolean;
  /** TOTP (or equivalent) enrolled and active on the user. */
  mfaCompleted: boolean;
  staffRole: StaffRole | null;
  userId: string | null;
  email: string | null;
  permissions: readonly Permission[];
}>;

export type AuthGateOk = Readonly<{ ok: true; context: AuthContext }>;
export type AuthGateDenied = Readonly<{
  ok: false;
  reason: AuthDenialReason;
}>;

export const UNAVAILABLE_AUTH_CONTEXT: AuthContext = {
  authAvailable: false,
  authenticated: false,
  mfaCompleted: false,
  staffRole: null,
  userId: null,
  email: null,
  permissions: [],
};

export const UNAUTHENTICATED_AUTH_CONTEXT: AuthContext = {
  authAvailable: true,
  authenticated: false,
  mfaCompleted: false,
  staffRole: null,
  userId: null,
  email: null,
  permissions: [],
};

export function buildAuthContext(input: {
  authAvailable: boolean;
  authenticated: boolean;
  mfaCompleted: boolean;
  staffRole: StaffRole | null;
  userId: string | null;
  email: string | null;
}): AuthContext {
  if (!input.authAvailable) {
    return UNAVAILABLE_AUTH_CONTEXT;
  }
  if (!input.authenticated) {
    return UNAUTHENTICATED_AUTH_CONTEXT;
  }

  const permissions =
    input.mfaCompleted && input.staffRole
      ? permissionsForStaffRole(input.staffRole)
      : [];

  return {
    authAvailable: true,
    authenticated: true,
    mfaCompleted: input.mfaCompleted,
    staffRole: input.staffRole,
    userId: input.userId,
    email: input.email,
    permissions,
  };
}

function hasAnyContentAdminPermission(context: AuthContext): boolean {
  return context.permissions.some(
    (permission) =>
      permission === "admin.content.read" ||
      permission === "admin.content.write" ||
      permission === "admin.content.publish",
  );
}

/**
 * Require an authenticated staff session with MFA complete and any content-admin permission.
 */
export function requireAdmin(
  context?: AuthContext,
): AuthGateOk | AuthGateDenied {
  if (!context || !context.authAvailable) {
    return { ok: false, reason: "auth-unavailable" };
  }
  if (!context.authenticated) {
    return { ok: false, reason: "unauthenticated" };
  }
  if (!context.mfaCompleted) {
    return { ok: false, reason: "mfa-required" };
  }
  if (!hasAnyContentAdminPermission(context)) {
    return { ok: false, reason: "denied" };
  }
  return { ok: true, context };
}

export function requirePermission(
  permission: Permission,
  context?: AuthContext,
): AuthGateOk | AuthGateDenied {
  if (!context || !context.authAvailable) {
    return { ok: false, reason: "auth-unavailable" };
  }
  if (!context.authenticated) {
    return { ok: false, reason: "unauthenticated" };
  }
  if (!context.mfaCompleted) {
    return { ok: false, reason: "mfa-required" };
  }
  if (!context.permissions.includes(permission)) {
    return { ok: false, reason: "denied" };
  }
  return { ok: true, context };
}

/** @deprecated Prefer EDITOR_PERMISSIONS from staff-role — kept for existing imports. */
export const DEFAULT_EDITOR_PERMISSIONS = EDITOR_PERMISSIONS;

/** @deprecated Prefer OWNER_PERMISSIONS enquiry subset — kept for existing imports. */
export const OWNER_ENQUIRY_PERMISSIONS: readonly Permission[] = [
  "enquiries.read",
  "enquiries.manage",
] as const;

export { EDITOR_PERMISSIONS, OWNER_PERMISSIONS, permissionsForStaffRole };
