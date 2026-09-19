"use server";

import { revalidatePath } from "next/cache";
import {
  retryFailedContentJob,
  runContentJobWorker,
} from "@/server/jobs/content-jobs";
import { permanentlyDeleteUnusedMedia } from "@/server/media/usage";
import { requirePermissionSession } from "@/server/security/auth-gate";
import { isMongoRuntimeConfigured } from "@/lib/mongodb/config";

export type JobsActionState =
  { ok: true; message: string } | { ok: false; message: string };

export type MediaCleanupActionState =
  | { ok: true; message: string; mediaId?: string }
  | { ok: false; message: string };

export async function runContentJobsAction(
  prev: JobsActionState | null,
  formData: FormData,
): Promise<JobsActionState> {
  void prev;
  void formData;
  const gate = await requirePermissionSession("admin.content.publish");
  if (!gate.ok) {
    return { ok: false, message: "Only owners can run the refresh worker." };
  }
  if (!isMongoRuntimeConfigured()) {
    return { ok: false, message: "MongoDB is not configured." };
  }

  const result = await runContentJobWorker({ limit: 20 });
  revalidatePath("/admin");
  revalidatePath("/admin/jobs");
  revalidatePath("/admin/media");
  revalidatePath("/");
  revalidatePath("/work");

  return {
    ok: true,
    message: `Processed ${result.processed}: ${result.succeeded} succeeded, ${result.retried} retried, ${result.failed} failed.`,
  };
}

export async function retryContentJobAction(
  _prev: JobsActionState | null,
  formData: FormData,
): Promise<JobsActionState> {
  const gate = await requirePermissionSession("admin.content.publish");
  if (!gate.ok) {
    return { ok: false, message: "Only owners can retry failed jobs." };
  }

  const jobId = String(formData.get("jobId") ?? "").trim();
  if (!jobId) {
    return { ok: false, message: "Missing job id." };
  }

  const result = await retryFailedContentJob({ jobId });
  if (!result.ok) {
    return { ok: false, message: result.detail };
  }

  revalidatePath("/admin/jobs");
  revalidatePath("/admin");
  return { ok: true, message: "Job re-queued. Run the worker to process it." };
}

export async function permanentlyDeleteMediaAction(
  _prev: MediaCleanupActionState | null,
  formData: FormData,
): Promise<MediaCleanupActionState> {
  const gate = await requirePermissionSession("admin.content.publish");
  if (!gate.ok || !gate.context.userId) {
    return {
      ok: false,
      message: "Only owners can permanently delete unused media.",
    };
  }

  const mediaId = String(formData.get("mediaId") ?? "").trim();
  const versionId = String(formData.get("versionId") ?? "").trim();
  if (!mediaId || !versionId) {
    return { ok: false, message: "Missing media version." };
  }

  const result = await permanentlyDeleteUnusedMedia({
    mediaId,
    versionId,
    actorId: gate.context.userId,
  });
  if (!result.ok) {
    return { ok: false, message: result.detail };
  }

  revalidatePath("/admin/media");
  revalidatePath("/admin");
  return {
    ok: true,
    message: "Media permanently deleted after dependency checks.",
    mediaId,
  };
}
