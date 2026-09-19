"use server";

import { revalidatePath } from "next/cache";
import {
  assertFeaturedIdsArePublicReady,
  parseFeaturedProjectIdsForm,
} from "@/lib/admin/featured";
import { isMongoRuntimeConfigured } from "@/lib/mongodb/config";
import {
  loadFeaturedSettings,
  saveFeaturedProjectIds,
} from "@/server/projects/featured";
import { writeProjectAuditEvent } from "@/server/projects/repository";
import { requirePermissionSession } from "@/server/security/auth-gate";

export type FeaturedActionState =
  | {
      ok: true;
      message: string;
      concurrencyVersion?: number;
    }
  | { ok: false; message: string };

export async function saveFeaturedSettingsAction(
  _prev: FeaturedActionState | null,
  formData: FormData,
): Promise<FeaturedActionState> {
  const gate = await requirePermissionSession("admin.content.publish");
  if (!gate.ok || !gate.context.userId) {
    return { ok: false, message: "Only owners can change featured order." };
  }
  if (!isMongoRuntimeConfigured()) {
    return { ok: false, message: "MongoDB is not configured." };
  }

  const parsed = parseFeaturedProjectIdsForm(formData);
  if (!parsed.ok) {
    return { ok: false, message: parsed.message };
  }

  const concurrencyRaw = String(
    formData.get("concurrencyVersion") ?? "",
  ).trim();
  const expectedConcurrencyVersion = Number.parseInt(concurrencyRaw, 10);
  if (!Number.isFinite(expectedConcurrencyVersion)) {
    return { ok: false, message: "Missing concurrency version." };
  }

  const loaded = await loadFeaturedSettings();
  if (!loaded.ok) {
    return { ok: false, message: loaded.detail };
  }

  const readyCheck = assertFeaturedIdsArePublicReady({
    featuredProjectIds: parsed.featuredProjectIds,
    publicReadyIds: new Set(loaded.candidates.map((c) => c.editorialId)),
  });
  if (!readyCheck.ok) {
    return { ok: false, message: readyCheck.message };
  }

  const result = await saveFeaturedProjectIds({
    featuredProjectIds: parsed.featuredProjectIds,
    expectedConcurrencyVersion,
    actorId: gate.context.userId,
  });

  await writeProjectAuditEvent({
    actorId: gate.context.userId,
    action: "settings.featured_save",
    targetId: "featured_projects",
    outcome: result.ok ? "succeeded" : "failed",
  });

  if (!result.ok) {
    return { ok: false, message: result.detail };
  }

  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/admin");
  revalidatePath("/admin/settings/featured");

  return {
    ok: true,
    message: result.message,
    concurrencyVersion: result.concurrencyVersion,
  };
}
