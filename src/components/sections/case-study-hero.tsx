import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { isAdminMediaPreviewSrc } from "@/lib/admin/preview";
import type { PublicCaseStudy } from "@/lib/public-case-study";
import { cn } from "@/lib/cn";

export type CaseStudyHeroProps = {
  study: PublicCaseStudy;
  headingLevel?: 1 | 2;
  idPrefix?: string;
  className?: string;
};

export function CaseStudyHero({
  study,
  headingLevel = 1,
  idPrefix = "",
  className,
}: CaseStudyHeroProps) {
  const HeadingTag = headingLevel === 1 ? "h1" : "h2";
  const titleId = `${idPrefix}hero-heading`;
  const isSvg = study.cover?.src.toLowerCase().endsWith(".svg") ?? false;
  const unoptimized =
    isSvg || (study.cover ? isAdminMediaPreviewSrc(study.cover.src) : false);

  return (
    <div className={cn("min-w-0", className)}>
      <div className="flex flex-wrap gap-2">
        <Badge variant="neutral">{study.workStatusLabel}</Badge>
        {study.facts.services.slice(0, 3).map((service) => (
          <Badge key={service.id} variant="accent">
            {service.title}
          </Badge>
        ))}
      </div>

      <HeadingTag id={titleId} className="ds-h1 mt-4 m-0 max-w-reading">
        {study.title}
      </HeadingTag>
      <p className="mt-4 m-0 max-w-reading text-lg text-text-body">
        {study.intro}
      </p>
      {study.facts.attribution ? (
        <p className="mt-3 m-0 text-sm text-text-muted">
          {study.facts.attribution}
        </p>
      ) : null}

      {study.cover ? (
        <figure className="mt-10 m-0 min-w-0">
          <div className="overflow-hidden rounded-md border border-border-subtle bg-surface-muted">
            <Image
              src={study.cover.src}
              alt={study.cover.alt}
              width={study.cover.width}
              height={study.cover.height}
              priority
              sizes="(max-width: 1023px) 100vw, 72rem"
              className="h-auto w-full object-contain object-top"
              unoptimized={unoptimized}
            />
          </div>
          {study.cover.caption ? (
            <figcaption className="mt-2 text-sm text-text-muted">
              {study.cover.caption}
            </figcaption>
          ) : null}
        </figure>
      ) : null}
    </div>
  );
}

export type CaseStudyFactsProps = {
  study: PublicCaseStudy;
  className?: string;
};

export function CaseStudyFacts({ study, className }: CaseStudyFactsProps) {
  const rows: { label: string; value: string }[] = [];
  if (study.facts.contribution) {
    rows.push({ label: "Contribution", value: study.facts.contribution });
  }
  rows.push({ label: "Work type", value: study.facts.workStatusLabel });
  if (study.facts.services.length > 0) {
    rows.push({
      label: "Related services",
      value: study.facts.services.map((service) => service.title).join(", "),
    });
  }
  if (study.facts.technologies.length > 0) {
    rows.push({
      label: "Technologies",
      value: study.facts.technologies.join(", "),
    });
  }
  if (study.facts.attribution) {
    rows.push({ label: "Attribution", value: study.facts.attribution });
  }

  if (rows.length === 0) {
    return null;
  }

  return (
    <dl className={cn("m-0 grid gap-4 sm:grid-cols-2", className)}>
      {rows.map((row) => (
        <div key={row.label} className="min-w-0">
          <dt className="m-0 text-sm font-medium text-text-muted">
            {row.label}
          </dt>
          <dd className="mt-1 m-0 text-text-body">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
