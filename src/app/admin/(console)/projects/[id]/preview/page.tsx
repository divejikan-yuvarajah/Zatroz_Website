import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CaseStudyPage } from "@/components/sections/case-study-page";
import { ProjectCard } from "@/components/sections/project-card";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { loadProjectPreview } from "@/server/projects/preview";
import { requirePermissionSession } from "@/server/security/auth-gate";
import { resolveServicesEnquiryCta } from "@/server/services";

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
    title: `Preview ${id} — Zatroz admin`,
    robots: { index: false, follow: false },
    other: {
      // Hint to intermediaries; page is force-dynamic and staff-only.
      "Cache-Control": "private, no-store",
    },
  };
}

export default async function AdminProjectPreviewPage({ params }: PageProps) {
  const gate = await requirePermissionSession("admin.content.read");
  if (!gate.ok) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const preview = await loadProjectPreview(id);

  if (!preview.ok) {
    if (preview.reason === "not-found") notFound();
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">
          Draft preview
        </h1>
        <div
          className="rounded-md border border-border-subtle bg-warning-soft p-4 text-warning"
          role="status"
        >
          <p className="font-medium">Preview unavailable</p>
          <p className="mt-1 text-sm">{preview.detail}</p>
        </div>
        <ButtonLink href="/admin/projects" variant="secondary" size="compact">
          Back to list
        </ButtonLink>
      </div>
    );
  }

  const canWrite = gate.context.permissions.includes("admin.content.write");
  const enquiryAction = resolveServicesEnquiryCta({
    serviceSlug:
      preview.study?.facts.services.length === 1
        ? preview.study.facts.services[0]?.slug
        : preview.card.services.length === 1
          ? preview.card.services[0]?.slug
          : undefined,
    label: "Discuss a similar project",
  });

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-4 border-b border-border-subtle pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium tracking-wide text-text-muted uppercase">
            Authenticated draft preview
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-ink">
            {preview.draftTitle || preview.draftSlug}
          </h1>
          <p className="mt-2 max-w-prose text-text-body">
            Renders the same public case-study and card components staff will
            ship after publish. This page is not public, not indexed, and does
            not change live{" "}
            <code className="text-sm">/work/{preview.draftSlug}</code>.
          </p>
          <p className="ds-support mt-2">
            <code>{preview.editorialId}</code> · concurrency v
            {preview.concurrencyVersion}
            {preview.study?.testimonial ? " · includes draft testimonial" : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {canWrite ? (
            <>
              <ButtonLink
                href={`/admin/projects/${preview.editorialId}`}
                variant="secondary"
                size="compact"
              >
                Edit summary
              </ButtonLink>
              <ButtonLink
                href={`/admin/projects/${preview.editorialId}/story`}
                variant="secondary"
                size="compact"
              >
                Edit case study
              </ButtonLink>
            </>
          ) : null}
          <ButtonLink href="/admin/projects" variant="quiet" size="compact">
            Back to list
          </ButtonLink>
        </div>
      </header>

      {preview.mediaNotes.length > 0 ? (
        <div
          className="rounded-md border border-border-subtle bg-warning-soft p-4 text-warning"
          role="status"
        >
          <p className="font-medium">Some media could not be resolved</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {preview.mediaNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <Section
        as="section"
        surface="muted"
        aria-labelledby="preview-card-heading"
      >
        <Container>
          <h2
            id="preview-card-heading"
            className="text-lg font-semibold text-ink"
          >
            Work card preview
          </h2>
          <p className="ds-support mt-1">
            Summary card as it would appear on Work listings after publish.
            Story link stays disabled until A08 publishes an approved story.
          </p>
          <div className="mt-6 max-w-md">
            <ProjectCard
              project={preview.card}
              headingLevel={3}
              idPrefix="preview-card-"
            />
          </div>
        </Container>
      </Section>

      {preview.study ? (
        <div>
          <div className="border-b border-border-subtle px-gutter py-4">
            <Container>
              <h2 className="text-lg font-semibold text-ink">
                Case-study page preview
              </h2>
              <p className="ds-support mt-1">
                Uses the public <code>CaseStudyPage</code> template. Private
                media loads through the authenticated preview API (browser
                cookies), not the public image optimizer.
              </p>
            </Container>
          </div>
          <CaseStudyPage
            study={preview.study}
            enquiryAction={enquiryAction}
            headingLevel={2}
            idPrefix="preview-"
            showBreadcrumb={false}
          />
        </div>
      ) : (
        <Section
          as="section"
          surface="light"
          aria-labelledby="preview-empty-story"
        >
          <Container width="reading">
            <h2
              id="preview-empty-story"
              className="text-lg font-semibold text-ink"
            >
              Case-study body not ready
            </h2>
            <p className="mt-2 text-text-body">
              This draft has no renderable story sections yet. Add content in
              the case-study editor, then return here. Summary card preview
              above still reflects the draft summary.
            </p>
            {canWrite ? (
              <div className="mt-4">
                <ButtonLink
                  href={`/admin/projects/${preview.editorialId}/story`}
                  variant="primary"
                  size="compact"
                >
                  Open case-study editor
                </ButtonLink>
              </div>
            ) : null}
          </Container>
        </Section>
      )}
    </div>
  );
}
