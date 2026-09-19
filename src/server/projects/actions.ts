"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { parseProjectDraftFormData } from "@/lib/admin/projects";
import { isMongoRuntimeConfigured } from "@/lib/mongodb/config";
import { serviceRecords } from "@/content/services";
import {
  createProjectDraft,
  saveProjectDraft,
  writeProjectAuditEvent,
} from "@/server/projects/repository";
import { requirePermissionSession } from "@/server/security/auth-gate";

export type ProjectActionState =
  | {
      ok: true;
      message: string;
      editorialId?: string;
      concurrencyVersion?: number;
    }
  | { ok: false; message: string; field?: string };

const ALLOWED_SERVICE_IDS = serviceRecords.map((s) => s.id);

export async function createProjectDraftAction(
  _prev: ProjectActionState | null,
  formData: FormData,
): Promise<ProjectActionState> {
  const gate = await requirePermissionSession("admin.content.write");
  if (!gate.ok || !gate.context.userId) {
    return {
      ok: false,
      message: "You do not have permission to create projects.",
    };
  }

  if (!isMongoRuntimeConfigured()) {
    return {
      ok: false,
      message:
        "Project drafts require MongoDB credentials in this environment.",
    };
  }

  const parsed = parseProjectDraftFormData(formData, {
    allowedServiceIds: ALLOWED_SERVICE_IDS,
  });
  if (!parsed.ok) {
    return { ok: false, message: parsed.message, field: parsed.field };
  }

  const result = await createProjectDraft({
    values: parsed.values,
    actorId: gate.context.userId,
  });

  if (!result.ok) {
    await writeProjectAuditEvent({
      actorId: gate.context.userId,
      action: "project.create_draft",
      targetId: parsed.values.slug,
      outcome: result.reason === "duplicate" ? "failed" : "failed",
    });
    return { ok: false, message: result.detail };
  }

  await writeProjectAuditEvent({
    actorId: gate.context.userId,
    action: "project.create_draft",
    targetId: result.editorialId,
    outcome: "succeeded",
  });

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  redirect(`/admin/projects/${result.editorialId}?saved=1`);
}

export async function saveProjectDraftAction(
  _prev: ProjectActionState | null,
  formData: FormData,
): Promise<ProjectActionState> {
  const gate = await requirePermissionSession("admin.content.write");
  if (!gate.ok || !gate.context.userId) {
    return {
      ok: false,
      message: "You do not have permission to edit projects.",
    };
  }

  if (!isMongoRuntimeConfigured()) {
    return {
      ok: false,
      message:
        "Project drafts require MongoDB credentials in this environment.",
    };
  }

  const editorialId = String(formData.get("editorialId") ?? "").trim();
  const concurrencyRaw = String(
    formData.get("concurrencyVersion") ?? "",
  ).trim();
  const expectedConcurrencyVersion = Number.parseInt(concurrencyRaw, 10);

  if (!editorialId) {
    return { ok: false, message: "Missing project id." };
  }
  if (!Number.isFinite(expectedConcurrencyVersion)) {
    return { ok: false, message: "Missing concurrency version." };
  }

  const parsed = parseProjectDraftFormData(formData, {
    allowedServiceIds: ALLOWED_SERVICE_IDS,
  });
  if (!parsed.ok) {
    return { ok: false, message: parsed.message, field: parsed.field };
  }

  const result = await saveProjectDraft({
    editorialId,
    expectedConcurrencyVersion,
    values: parsed.values,
    actorId: gate.context.userId,
  });

  if (!result.ok) {
    await writeProjectAuditEvent({
      actorId: gate.context.userId,
      action: "project.save_draft",
      targetId: editorialId,
      outcome: "failed",
    });
    return { ok: false, message: result.detail };
  }

  await writeProjectAuditEvent({
    actorId: gate.context.userId,
    action: "project.save_draft",
    targetId: editorialId,
    outcome: "succeeded",
  });

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${editorialId}`);

  return {
    ok: true,
    message: "Draft saved.",
    editorialId,
    concurrencyVersion: result.concurrencyVersion,
  };
}
