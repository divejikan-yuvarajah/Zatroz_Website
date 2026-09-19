import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AdminProjectStoryForm } from "@/components/admin/admin-project-story-form";
import { ButtonLink } from "@/components/ui/button-link";
import { formValuesFromStory } from "@/lib/admin/story";
import { listMediaLibrary } from "@/server/media/repository";
import { loadProjectDraft } from "@/server/projects/repository";
import { requirePermissionSession } from "@/server/security/auth-gate";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Case study ${id} — Zatroz admin`,
    robots: { index: false, follow: false },
  };
}

export default async function AdminProjectStoryPage({ params }: PageProps) {
  const gate = await requirePermissionSession("admin.content.write");
  if (!gate.ok) {
    const readGate = await requirePermissionSession("admin.content.read");
    if (!readGate.ok) {
      redirect("/admin/login");
    }
  }

  const { id } = await params;
  const loaded = await loadProjectDraft(id);
  if (!loaded.ok) {
    if (loaded.reason === "not-found") notFound();
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Case study
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
  const initial = formValuesFromStory(loaded.story, loaded.project.draftTitle);

  const media = await listMediaLibrary({ limit: 100 });
  const mediaOptions = media.ok
    ? media.items.map((item) => ({
        mediaId: item.mediaId,
        label: `${item.mediaId}${item.caption ? ` — ${item.caption}` : ""}`,
      }))
    : [];

  const knownIds = new Set(mediaOptions.map((m) => m.mediaId));
  for (const item of initial.gallery) {
    if (item.mediaId && !knownIds.has(item.mediaId)) {
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
            Case-study editor
          </h1>
          <p className="mt-2 max-w-prose text-text-body">
            Structured sections for{" "}
            <code className="text-sm">{loaded.project.editorialId}</code>.
            Summary may publish before this story (A08). Preview ships in A07.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink
            href={`/admin/projects/${loaded.project.editorialId}`}
            variant="secondary"
            size="compact"
          >
            Edit summary
          </ButtonLink>
          <ButtonLink href="/admin/projects" variant="quiet" size="compact">
            Back to list
          </ButtonLink>
        </div>
      </header>

      {canWrite ? (
        <AdminProjectStoryForm
          editorialId={loaded.project.editorialId}
          concurrencyVersion={loaded.project.concurrencyVersion}
          initial={initial}
          mediaOptions={mediaOptions}
        />
      ) : (
        <p className="ds-support" role="status">
          You can view this route but need write permission to save case-study
          drafts.
        </p>
      )}
    </div>
  );
}
