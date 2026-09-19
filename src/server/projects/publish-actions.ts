"use server";

import { revalidatePath } from "next/cache";
import {
  archiveProject,
  publishProjectStory,
  publishProjectSummary,
  restoreArchivedProject,
  unpublishProjectStory,
  unpublishProjectSummary,
} from "@/server/projects/publish";
import { writeProjectAuditEvent } from "@/server/projects/repository";
import { requirePermissionSession } from "@/server/security/auth-gate";
import { isMongoRuntimeConfigured } from "@/lib/mongodb/config";

export type PublishActionState =
  | {
      ok: true;
      message: string;
      editorialId?: string;
      concurrencyVersion?: number;
    }
  | { ok: false; message: string };

function readConcurrency(formData: FormData): number | null {
  const raw = String(formData.get("concurrencyVersion") ?? "").trim();
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : null;
}

function readEditorialId(formData: FormData): string {
  return String(formData.get("editorialId") ?? "").trim();
}

async function gatePublish() {
  return requirePermissionSession("admin.content.publish");
}

async function gateArchive() {
  // Editors may archive within scope; owners too (via write or publish).
  const write = await requirePermissionSession("admin.content.write");
  if (write.ok) return write;
  return requirePermissionSession("admin.content.publish");
}

export async function publishSummaryAction(
  _prev: PublishActionState | null,
  formData: FormData,
): Promise<PublishActionState> {
  const gate = await gatePublish();
  if (!gate.ok || !gate.context.userId) {
    return { ok: false, message: "Only owners can publish." };
  }
  if (!isMongoRuntimeConfigured()) {
    return { ok: false, message: "MongoDB is not configured." };
  }

  const editorialId = readEditorialId(formData);
  const concurrency = readConcurrency(formData);
  if (!editorialId || concurrency === null) {
    return { ok: false, message: "Missing project or concurrency version." };
  }

  const result = await publishProjectSummary({
    editorialId,
    expectedConcurrencyVersion: concurrency,
    actorId: gate.context.userId,
  });

  await writeProjectAuditEvent({
    actorId: gate.context.userId,
    action: "project.publish_summary",
    targetId: editorialId,
    outcome: result.ok ? "succeeded" : "failed",
  });

  if (!result.ok) return { ok: false, message: result.detail };

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${editorialId}`);
  revalidatePath(`/admin/projects/${editorialId}/preview`);

  return {
    ok: true,
    message: result.message,
    editorialId,
    concurrencyVersion: result.concurrencyVersion,
  };
}

export async function publishStoryAction(
  _prev: PublishActionState | null,
  formData: FormData,
): Promise<PublishActionState> {
  const gate = await gatePublish();
  if (!gate.ok || !gate.context.userId) {
    return { ok: false, message: "Only owners can publish." };
  }
  if (!isMongoRuntimeConfigured()) {
    return { ok: false, message: "MongoDB is not configured." };
  }

  const editorialId = readEditorialId(formData);
  const concurrency = readConcurrency(formData);
  if (!editorialId || concurrency === null) {
    return { ok: false, message: "Missing project or concurrency version." };
  }

  const result = await publishProjectStory({
    editorialId,
    expectedConcurrencyVersion: concurrency,
    actorId: gate.context.userId,
  });

  await writeProjectAuditEvent({
    actorId: gate.context.userId,
    action: "project.publish_story",
    targetId: editorialId,
    outcome: result.ok ? "succeeded" : "failed",
  });

  if (!result.ok) return { ok: false, message: result.detail };

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${editorialId}`);
  revalidatePath(`/admin/projects/${editorialId}/story`);
  revalidatePath(`/admin/projects/${editorialId}/preview`);

  return {
    ok: true,
    message: result.message,
    editorialId,
    concurrencyVersion: result.concurrencyVersion,
  };
}

export async function unpublishSummaryAction(
  _prev: PublishActionState | null,
  formData: FormData,
): Promise<PublishActionState> {
  const gate = await gatePublish();
  if (!gate.ok || !gate.context.userId) {
    return { ok: false, message: "Only owners can unpublish." };
  }
  if (!isMongoRuntimeConfigured()) {
    return { ok: false, message: "MongoDB is not configured." };
  }

  const editorialId = readEditorialId(formData);
  const concurrency = readConcurrency(formData);
  if (!editorialId || concurrency === null) {
    return { ok: false, message: "Missing project or concurrency version." };
  }

  const result = await unpublishProjectSummary({
    editorialId,
    expectedConcurrencyVersion: concurrency,
    actorId: gate.context.userId,
  });

  await writeProjectAuditEvent({
    actorId: gate.context.userId,
    action: "project.unpublish_summary",
    targetId: editorialId,
    outcome: result.ok ? "succeeded" : "failed",
  });

  if (!result.ok) return { ok: false, message: result.detail };

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${editorialId}`);

  return {
    ok: true,
    message: result.message,
    editorialId,
    concurrencyVersion: result.concurrencyVersion,
  };
}

export async function unpublishStoryAction(
  _prev: PublishActionState | null,
  formData: FormData,
): Promise<PublishActionState> {
  const gate = await gatePublish();
  if (!gate.ok || !gate.context.userId) {
    return { ok: false, message: "Only owners can unpublish." };
  }
  if (!isMongoRuntimeConfigured()) {
    return { ok: false, message: "MongoDB is not configured." };
  }

  const editorialId = readEditorialId(formData);
  const concurrency = readConcurrency(formData);
  if (!editorialId || concurrency === null) {
    return { ok: false, message: "Missing project or concurrency version." };
  }

  const result = await unpublishProjectStory({
    editorialId,
    expectedConcurrencyVersion: concurrency,
    actorId: gate.context.userId,
  });

  await writeProjectAuditEvent({
    actorId: gate.context.userId,
    action: "project.unpublish_story",
    targetId: editorialId,
    outcome: result.ok ? "succeeded" : "failed",
  });

  if (!result.ok) return { ok: false, message: result.detail };

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${editorialId}`);

  return {
    ok: true,
    message: result.message,
    editorialId,
    concurrencyVersion: result.concurrencyVersion,
  };
}

export async function archiveProjectAction(
  _prev: PublishActionState | null,
  formData: FormData,
): Promise<PublishActionState> {
  const gate = await gateArchive();
  if (!gate.ok || !gate.context.userId) {
    return {
      ok: false,
      message: "You do not have permission to archive projects.",
    };
  }
  if (!isMongoRuntimeConfigured()) {
    return { ok: false, message: "MongoDB is not configured." };
  }

  const editorialId = readEditorialId(formData);
  const concurrency = readConcurrency(formData);
  if (!editorialId || concurrency === null) {
    return { ok: false, message: "Missing project or concurrency version." };
  }

  const result = await archiveProject({
    editorialId,
    expectedConcurrencyVersion: concurrency,
    actorId: gate.context.userId,
  });

  await writeProjectAuditEvent({
    actorId: gate.context.userId,
    action: "project.archive",
    targetId: editorialId,
    outcome: result.ok ? "succeeded" : "failed",
  });

  if (!result.ok) return { ok: false, message: result.detail };

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${editorialId}`);

  return {
    ok: true,
    message: result.message,
    editorialId,
    concurrencyVersion: result.concurrencyVersion,
  };
}

export async function restoreProjectAction(
  _prev: PublishActionState | null,
  formData: FormData,
): Promise<PublishActionState> {
  const gate = await gateArchive();
  if (!gate.ok || !gate.context.userId) {
    return {
      ok: false,
      message: "You do not have permission to restore projects.",
    };
  }
  if (!isMongoRuntimeConfigured()) {
    return { ok: false, message: "MongoDB is not configured." };
  }

  const editorialId = readEditorialId(formData);
  const concurrency = readConcurrency(formData);
  if (!editorialId || concurrency === null) {
    return { ok: false, message: "Missing project or concurrency version." };
  }

  const result = await restoreArchivedProject({
    editorialId,
    expectedConcurrencyVersion: concurrency,
    actorId: gate.context.userId,
  });

  await writeProjectAuditEvent({
    actorId: gate.context.userId,
    action: "project.restore",
    targetId: editorialId,
    outcome: result.ok ? "succeeded" : "failed",
  });

  if (!result.ok) return { ok: false, message: result.detail };

  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${editorialId}`);

  return {
    ok: true,
    message: result.message,
    editorialId,
    concurrencyVersion: result.concurrencyVersion,
  };
}
