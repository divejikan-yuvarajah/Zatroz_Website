/**
 * Admin / permission gate stubs for future A02–A03.
 * Until real auth exists, private admin operations must be unavailable.
 */

export type Permission =
  | "admin.content.read"
  | "admin.content.write"
  | "admin.content.publish"
  | "enquiries.read"
  | "enquiries.manage";

export type AuthContext = Readonly<{
  authenticated: boolean;
  permissions: readonly Permission[];
}>;

export function requireAdmin(_context?: AuthContext): {
  ok: false;
  reason: "auth-unavailable";
} {
  void _context;
  return { ok: false, reason: "auth-unavailable" };
}

export function requirePermission(
  _permission: Permission,
  _context?: AuthContext,
): { ok: false; reason: "auth-unavailable" | "denied" } {
  void _permission;
  void _context;
  return { ok: false, reason: "auth-unavailable" };
}

export const DEFAULT_EDITOR_PERMISSIONS: readonly Permission[] = [
  "admin.content.read",
  "admin.content.write",
] as const;

export const OWNER_ENQUIRY_PERMISSIONS: readonly Permission[] = [
  "enquiries.read",
  "enquiries.manage",
] as const;
