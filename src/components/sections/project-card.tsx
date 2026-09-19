import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { TextLink } from "@/components/ui/text-link";
import { isAdminMediaPreviewSrc } from "@/lib/admin/preview";
import type { PublicProjectCard } from "@/lib/public-projects";
import { cn } from "@/lib/cn";

export type ProjectCardProps = {
  project: PublicProjectCard;
  headingLevel?: 2 | 3;
  idPrefix?: string;
  className?: string;
};

/**
 * Work listing card — text-first when cover is missing.
 * Never wraps the whole card in a single link when multiple actions exist.
 */
export function ProjectCard({
  project,
  headingLevel = 3,
  idPrefix = "",
  className,
}: ProjectCardProps) {
  const HeadingTag = headingLevel === 2 ? "h2" : "h3";
  const titleId = `${idPrefix}${project.id}-title`;
  const isSvg = project.cover?.src.toLowerCase().endsWith(".svg") ?? false;
  const unoptimized =
    isSvg ||
    (project.cover ? isAdminMediaPreviewSrc(project.cover.src) : false);
  const primaryLink = project.storyLinkEligible
    ? { label: "Read case study", href: project.storyPath }
    : (project.links[0] ?? null);

  return (
    <article aria-labelledby={titleId} className={cn("min-w-0", className)}>
      {project.cover ? (
        <figure className="m-0 min-w-0">
          <div className="aspect-[16/10] overflow-hidden rounded-md border border-border-subtle bg-surface-muted">
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              width={project.cover.width}
              height={project.cover.height}
              sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
              className="size-full object-cover object-top"
              unoptimized={unoptimized}
            />
          </div>
          {project.cover.caption ? (
            <figcaption className="mt-2 text-sm text-text-muted">
              {project.cover.caption}
            </figcaption>
          ) : null}
        </figure>
      ) : (
        <div
          className="flex aspect-[16/10] items-end rounded-md border border-dashed border-border-control bg-surface-muted p-4"
          aria-hidden="true"
        >
          <p className="m-0 text-sm font-medium text-text-muted">
            Text summary · cover pending
          </p>
        </div>
      )}

      <div className={cn("min-w-0", project.cover ? "mt-5" : "mt-5")}>
        <div className="flex flex-wrap gap-2">
          <Badge variant="neutral">{project.workStatusLabel}</Badge>
          {project.services.slice(0, 2).map((service) => (
            <Badge key={service.id} variant="accent">
              {service.title}
            </Badge>
          ))}
        </div>

        <HeadingTag id={titleId} className="ds-h3 mt-3 m-0">
          {project.storyLinkEligible ? (
            <TextLink
              href={project.storyPath}
              className="text-inherit no-underline hover:underline"
            >
              {project.title}
            </TextLink>
          ) : (
            project.title
          )}
        </HeadingTag>

        <p className="mt-3 m-0 text-text-body">{project.summary}</p>

        {project.attribution ? (
          <p className="mt-2 m-0 text-sm text-text-muted">
            {project.attribution}
          </p>
        ) : null}

        {primaryLink ? (
          <p className="mt-4 m-0">
            <TextLink href={primaryLink.href}>{primaryLink.label}</TextLink>
          </p>
        ) : (
          <p className="mt-4 m-0 text-sm text-text-muted">
            Case study not published yet.
          </p>
        )}
      </div>
    </article>
  );
}
