import "server-only";

import {
  DEFAULT_EDITOR_PERMISSIONS,
  OWNER_ENQUIRY_PERMISSIONS,
  requireAdmin as requireAdminPure,
  requirePermission as requirePermissionPure,
  type AuthContext,
  type AuthGateDenied,
  type AuthGateOk,
  type Permission,
} from "@/lib/security/auth-gate";
import { resolveStaffAuthContext } from "@/server/auth/session";

export {
  DEFAULT_EDITOR_PERMISSIONS,
  OWNER_ENQUIRY_PERMISSIONS,
  type AuthContext,
  type Permission,
};

/** Sync pure gate — pass a resolved AuthContext. */
export const requireAdmin = requireAdminPure;
export const requirePermission = requirePermissionPure;

/**
 * Load the current request session and require content-admin access.
 * Use from Server Components / Server Actions / Route Handlers.
 */
export async function requireAdminSession(
  requestHeaders?: Headers,
): Promise<AuthGateOk | AuthGateDenied> {
  const context = await resolveStaffAuthContext(requestHeaders);
  return requireAdminPure(context);
}

export async function requirePermissionSession(
  permission: Permission,
  requestHeaders?: Headers,
): Promise<AuthGateOk | AuthGateDenied> {
  const context = await resolveStaffAuthContext(requestHeaders);
  return requirePermissionPure(permission, context);
}
