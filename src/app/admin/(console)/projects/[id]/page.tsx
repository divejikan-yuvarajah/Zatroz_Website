import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AdminProjectDraftForm } from "@/components/admin/admin-project-draft-form";
import { serviceRecords } from "@/content/services";
import { formValuesFromDraft } from "@/lib/admin/projects";
import { listMediaLibrary } from "@/server/media/repository";
import { loadProjectDraft } from "@/server/projects/repository";
import { requirePermissionSession } from "@/server/security/auth-gate";
import { ButtonLink } from "@/components/ui/button-link";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string | string[] }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Edit ${id} — Zatroz admin`,
    robots: { index: false, follow: false },
  };
}

export default async function AdminEditProjectPage({
  params,
  searchParams,
}: PageProps) {
  const gate = await requirePermissionSession("admin.content.write");
  if (!gate.ok) {
    const readGate = await requirePermissionSession("admin.content.read");
    if (!readGate.ok) {
      redirect("/admin/login");
    }
  }

  const { id } = await params;
  const sp = await searchParams;
  const savedRaw = sp.saved;
  const justSaved = (Array.isArray(savedRaw) ? savedRaw[0] : savedRaw) === "1";

  const loaded = await loadProjectDraft(id);
  if (!loaded.ok) {
    if (loaded.reason === "not-found") notFound();
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Edit project
        </h1>
        <div
          className="rounded-md border border-border-subtle bg-warning-soft p-4 text-warning"
          role="status"
        >
          <p className="font-medium">Draft unavailable</p>
          <p className="mt-1 text-sm">{loaded.detail}</p>
        </div>
        <ButtonLink href="/admin/projects" variant="secondary" size="compact">
          Back to list
        </ButtonLink>
      </div>
    );
  }

  const canWrite = gate.ok;
  const initial = formValuesFromDraft({
    project: loaded.project,
    summary: loaded.summary,
    story: loaded.story,
  });

  const media = await listMediaLibrary({ limit: 100 });
  const mediaOptions = media.ok
    ? media.items.map((item) => ({
        mediaId: item.mediaId,
        label: `${item.mediaId}${item.caption ? ` — ${item.caption}` : ""}`,
      }))
    : [];

  // Ensure current cover/gallery ids appear even if archived from library list
  const knownIds = new Set(mediaOptions.map((m) => m.mediaId));
  if (initial.coverMediaId && !knownIds.has(initial.coverMediaId)) {
    mediaOptions.push({
      mediaId: initial.coverMediaId,
      label: `${initial.coverMediaId} (current)`,
    });
  }
  for (const item of initial.gallery) {
    if (!knownIds.has(item.mediaId)) {
      mediaOptions.push({
        mediaId: item.mediaId,
        label: `${item.mediaId} (current)`,
      });
      knownIds.add(item.mediaId);
    }
  }

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-ink">
            Edit draft
          </h1>
          <p className="mt-2 max-w-prose text-text-body">
            Saves a new immutable revision. Story sections beyond technologies
            and gallery are preserved for A06. Publish remains owner-only (A08).
          </p>
        </div>
        <ButtonLink href="/admin/projects" variant="secondary" size="compact">
          Back to list
        </ButtonLink>
      </header>

      {canWrite ? (
        <AdminProjectDraftForm
          mode="edit"
          editorialId={loaded.project.editorialId}
          concurrencyVersion={loaded.project.concurrencyVersion}
          initial={initial}
          services={serviceRecords.map((s) => ({
            id: s.id,
            title: s.title,
          }))}
          mediaOptions={mediaOptions}
          justSaved={justSaved}
        />
      ) : (
        <p className="ds-support" role="status">
          You can view project metadata but need write permission to save
          drafts.
        </p>
      )}
    </div>
  );
}
