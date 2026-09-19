/**
 * Admin navigation and shortcut definitions (pure).
 * Visibility is filtered by AuthContext permissions — never rely on this alone.
 */

import type { AuthContext, Permission } from "@/lib/security/auth-gate";

export type AdminNavItem = Readonly<{
  id: string;
  label: string;
  href: string;
  /** Required permission; omit for any authenticated content-admin. */
  permission?: Permission;
  /** When true, link is shown but marked unavailable (later step). */
  comingLater?: boolean;
  comingLaterNote?: string;
}>;

export const ADMIN_PRIMARY_NAV: readonly AdminNavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/admin",
  },
  {
    id: "projects",
    label: "Projects",
    href: "/admin/projects",
    permission: "admin.content.read",
    comingLater: true,
    comingLaterNote: "Project list and forms arrive in A05.",
  },
  {
    id: "media",
    label: "Media",
    href: "/admin/media",
    permission: "admin.content.read",
  },
  {
    id: "featured",
    label: "Featured",
    href: "/admin/settings/featured",
    permission: "admin.content.publish",
    comingLater: true,
    comingLaterNote: "Featured ordering arrives in A08–A09.",
  },
  {
    id: "staff",
    label: "Staff",
    href: "/admin/staff",
    permission: "admin.staff.manage",
  },
] as const;

export type AdminShortcut = Readonly<{
  id: string;
  label: string;
  description: string;
  href: string;
  permission?: Permission;
  available: boolean;
}>;

export const ADMIN_DASHBOARD_SHORTCUTS: readonly AdminShortcut[] = [
  {
    id: "new-project",
    label: "Create project",
    description: "Start a new draft project (A05).",
    href: "/admin/projects/new",
    permission: "admin.content.write",
    available: false,
  },
  {
    id: "edit-projects",
    label: "Edit projects",
    description: "Open the project list when it ships (A05).",
    href: "/admin/projects",
    permission: "admin.content.read",
    available: false,
  },
  {
    id: "manage-media",
    label: "Manage media",
    description: "Upload and organise project media.",
    href: "/admin/media",
    permission: "admin.content.write",
    available: true,
  },
  {
    id: "manage-staff",
    label: "Manage staff",
    description: "Review roles for staff accounts.",
    href: "/admin/staff",
    permission: "admin.staff.manage",
    available: true,
  },
] as const;

export function canSeeAdminNavItem(
  item: AdminNavItem,
  context: AuthContext,
): boolean {
  if (!item.permission) {
    return context.permissions.some((p) => p.startsWith("admin.content"));
  }
  return context.permissions.includes(item.permission);
}

export function visibleAdminNav(context: AuthContext): readonly AdminNavItem[] {
  return ADMIN_PRIMARY_NAV.filter((item) => canSeeAdminNavItem(item, context));
}

export function visibleAdminShortcuts(
  context: AuthContext,
): readonly AdminShortcut[] {
  return ADMIN_DASHBOARD_SHORTCUTS.filter((item) => {
    if (!item.permission) return true;
    return context.permissions.includes(item.permission);
  });
}
