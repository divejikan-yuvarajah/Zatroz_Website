import "server-only";

export {
  DEFAULT_EDITOR_PERMISSIONS,
  OWNER_ENQUIRY_PERMISSIONS,
  requireAdmin,
  requirePermission,
  type AuthContext,
  type Permission,
} from "@/lib/security/auth-gate";
