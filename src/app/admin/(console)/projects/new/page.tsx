import type { Metadata } from "next";
import { AdminProjectDraftForm } from "@/components/admin/admin-project-draft-form";
import { serviceRecords } from "@/content/services";
import { DRAFT_PLACEHOLDER } from "@/lib/admin/projects";
import { listMediaLibrary } from "@/server/media/repository";
import { requirePermissionSession } from "@/server/security/auth-gate";
import { redirectForAuthDenial } from "@/server/security/admin-redirect";
import type { WorkStatus } from "@/types/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New project — Zatroz admin",
  robots: { index: false, follow: false },
};

export default async function AdminNewProjectPage() {
  const gate = await requirePermissionSession("admin.content.write");
  if (!gate.ok) {
    redirectForAuthDenial(gate.reason);
  }

  const media = await listMediaLibrary({ limit: 100 });
  const mediaOptions = media.ok
    ? media.items.map((item) => ({
        mediaId: item.mediaId,
        label: `${item.mediaId}${item.caption ? ` — ${item.caption}` : ""}`,
      }))
    : [];

  const defaultWorkStatus: WorkStatus = "client-work";

  return (
    <div className="flex flex-col gap-10">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Create project
        </h1>
        <p className="mt-2 max-w-prose text-text-body">
          Starts a MongoDB draft with a summary-and-story revision stub.
          Continue with the case-study editor, preview, then owner publish when
          ready.
        </p>
      </header>

      <AdminProjectDraftForm
        mode="create"
        services={serviceRecords.map((s) => ({ id: s.id, title: s.title }))}
        mediaOptions={mediaOptions}
        initial={{
          title: "",
          slug: "",
          summary: "",
          workStatus: defaultWorkStatus,
          serviceIds: [],
          technologies: [],
          contributors: [],
          publicLinks: [],
          coverMediaId: null,
          gallery: [],
          featuredEligible: false,
          editorialOrder: null,
          zatrozContribution: DRAFT_PLACEHOLDER,
          problem: DRAFT_PLACEHOLDER,
          approach: DRAFT_PLACEHOLDER,
          deliverables: [],
          verifiedOutcomes: [],
        }}
      />
    </div>
  );
}
