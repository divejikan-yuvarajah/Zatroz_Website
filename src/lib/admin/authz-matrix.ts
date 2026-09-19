/**
 * A12 authorization matrix — which staff operations require which permissions.
 * Pure data for unit tests and handover docs. Server actions remain the real enforcement.
 */

import type { Permission } from "@/lib/security/auth-gate";
import {
  buildAuthContext,
  requirePermission,
  type AuthContext,
} from "@/lib/security/auth-gate";

export type AdminOperationId =
  | "media.upload"
  | "media.replace"
  | "media.update_meta"
  | "media.archive"
  | "media.permanent_delete"
  | "media.preview"
  | "project.create_draft"
  | "project.save_draft"
  | "project.save_story"
  | "project.preview"
  | "project.publish_summary"
  | "project.publish_story"
  | "project.unpublish_summary"
  | "project.unpublish_story"
  | "project.archive"
  | "project.restore"
  | "featured.update"
  | "jobs.run_worker"
  | "jobs.retry_failed"
  | "staff.manage_roles"
  | "enquiries.read"
  | "enquiries.manage";

export type AdminOperation = Readonly<{
  id: AdminOperationId;
  /** Human label for handover docs. */
  label: string;
  /** Permission checked by the corresponding server gate. */
  permission: Permission;
  /**
   * When true, editors must never gain this via role mapping.
   * (Owner-only operational surface.)
   */
  ownerOnly: boolean;
}>;

/**
 * Canonical staff operation → permission map.
 * Keep in sync when adding admin server actions.
 */
export const ADMIN_OPERATION_MATRIX: readonly AdminOperation[] = [
  {
    id: "media.upload",
    label: "Upload media",
    permission: "admin.content.write",
    ownerOnly: false,
  },
  {
    id: "media.replace",
    label: "Replace media version",
    permission: "admin.content.write",
    ownerOnly: false,
  },
  {
    id: "media.update_meta",
    label: "Edit media metadata",
    permission: "admin.content.write",
    ownerOnly: false,
  },
  {
    id: "media.archive",
    label: "Archive media version",
    permission: "admin.content.write",
    ownerOnly: false,
  },
  {
    id: "media.permanent_delete",
    label: "Permanently delete unused media",
    permission: "admin.content.publish",
    ownerOnly: true,
  },
  {
    id: "media.preview",
    label: "Open private media preview",
    permission: "admin.content.read",
    ownerOnly: false,
  },
  {
    id: "project.create_draft",
    label: "Create project draft",
    permission: "admin.content.write",
    ownerOnly: false,
  },
  {
    id: "project.save_draft",
    label: "Save project summary draft",
    permission: "admin.content.write",
    ownerOnly: false,
  },
  {
    id: "project.save_story",
    label: "Save case-study story draft",
    permission: "admin.content.write",
    ownerOnly: false,
  },
  {
    id: "project.preview",
    label: "Authenticated draft preview",
    permission: "admin.content.read",
    ownerOnly: false,
  },
  {
    id: "project.publish_summary",
    label: "Publish summary",
    permission: "admin.content.publish",
    ownerOnly: true,
  },
  {
    id: "project.publish_story",
    label: "Publish story",
    permission: "admin.content.publish",
    ownerOnly: true,
  },
  {
    id: "project.unpublish_summary",
    label: "Unpublish summary",
    permission: "admin.content.publish",
    ownerOnly: true,
  },
  {
    id: "project.unpublish_story",
    label: "Unpublish story",
    permission: "admin.content.publish",
    ownerOnly: true,
  },
  {
    id: "project.archive",
    label: "Archive project",
    permission: "admin.content.write",
    ownerOnly: false,
  },
  {
    id: "project.restore",
    label: "Restore archived project",
    permission: "admin.content.write",
    ownerOnly: false,
  },
  {
    id: "featured.update",
    label: "Update featured order",
    permission: "admin.content.publish",
    ownerOnly: true,
  },
  {
    id: "jobs.run_worker",
    label: "Run content-job worker",
    permission: "admin.content.publish",
    ownerOnly: true,
  },
  {
    id: "jobs.retry_failed",
    label: "Re-queue failed content job",
    permission: "admin.content.publish",
    ownerOnly: true,
  },
  {
    id: "staff.manage_roles",
    label: "Manage staff roles",
    permission: "admin.staff.manage",
    ownerOnly: true,
  },
  {
    id: "enquiries.read",
    label: "Read enquiry inbox",
    permission: "enquiries.read",
    ownerOnly: true,
  },
  {
    id: "enquiries.manage",
    label: "Manage enquiry workflow",
    permission: "enquiries.manage",
    ownerOnly: true,
  },
] as const;

export function operationById(id: AdminOperationId): AdminOperation {
  const found = ADMIN_OPERATION_MATRIX.find((op) => op.id === id);
  if (!found) {
    throw new Error(`Unknown admin operation: ${id}`);
  }
  return found;
}

export function ownerOnlyOperations(): readonly AdminOperation[] {
  return ADMIN_OPERATION_MATRIX.filter((op) => op.ownerOnly);
}

export function editorAllowedOperations(): readonly AdminOperation[] {
  return ADMIN_OPERATION_MATRIX.filter((op) => !op.ownerOnly);
}

export function evaluateOperationAccess(
  operationId: AdminOperationId,
  context: AuthContext,
): { ok: true } | { ok: false; reason: string } {
  const op = operationById(operationId);
  const gate = requirePermission(op.permission, context);
  if (!gate.ok) {
    return { ok: false, reason: gate.reason };
  }
  return { ok: true };
}

export function sampleEditorContext(): AuthContext {
  return buildAuthContext({
    authAvailable: true,
    authenticated: true,
    mfaCompleted: true,
    staffRole: "editor",
    userId: "editor-sample",
    email: "editor@example.com",
  });
}

export function sampleOwnerContext(): AuthContext {
  return buildAuthContext({
    authAvailable: true,
    authenticated: true,
    mfaCompleted: true,
    staffRole: "owner",
    userId: "owner-sample",
    email: "owner@example.com",
  });
}

/**
 * Acceptance: editors never receive publish / staff / enquiry permissions.
 */
export function editorForbiddenPermissions(): readonly Permission[] {
  return [
    "admin.content.publish",
    "admin.staff.manage",
    "enquiries.read",
    "enquiries.manage",
  ];
}

/**
 * Surfaces that must deny unauthenticated callers (route/action inventory).
 * Cron uses CRON_SECRET instead of staff session — listed separately.
 */
export const STAFF_PROTECTED_SURFACES: readonly string[] = [
  "/admin",
  "/admin/projects",
  "/admin/media",
  "/admin/jobs",
  "/admin/settings/featured",
  "/admin/staff",
  "/api/admin/media/[mediaId]/preview",
  "publishSummaryAction",
  "publishStoryAction",
  "unpublishSummaryAction",
  "unpublishStoryAction",
  "archiveProjectAction",
  "restoreProjectAction",
  "createProjectAction",
  "saveProjectDraftAction",
  "saveProjectStoryAction",
  "uploadMediaAction",
  "replaceMediaAction",
  "updateMediaMetaAction",
  "archiveMediaAction",
  "permanentlyDeleteMediaAction",
  "runContentJobsAction",
  "retryContentJobAction",
  "saveFeaturedProjectsAction",
  "updateStaffRoleAction",
] as const;

export const CRON_PROTECTED_SURFACES: readonly string[] = [
  "POST /api/jobs/content-refresh",
] as const;
