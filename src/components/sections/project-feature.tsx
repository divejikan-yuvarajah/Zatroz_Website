import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { TextLink } from "@/components/ui/text-link";
import type { PublicProjectFeature } from "@/server/home";
import { cn } from "@/lib/cn";

export type ProjectFeatureProps = {
  feature: PublicProjectFeature;
  /** Lead gets more vertical space; secondary is compact for a three-item layout. */
  emphasis?: "lead" | "secondary" | "standard";
  headingLevel?: 2 | 3;
  idPrefix?: string;
  className?: string;
};

/**
 * Reusable project feature for homepage selected work (and later Work page reuse).
 * Server Component — no client interaction required.
 */
export function ProjectFeature({
  feature,
  emphasis = "standard",
  headingLevel = 3,
  idPrefix = "",
  className,
}: ProjectFeatureProps) {
  const HeadingTag = headingLevel === 2 ? "h2" : "h3";
  const titleId = `${idPrefix}${feature.id}-title`;
  const isLead = emphasis === "lead";
  const isSvg = feature.media?.src.toLowerCase().endsWith(".svg") ?? false;

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        "min-w-0",
        isLead ? "lg:grid lg:grid-cols-2 lg:items-start lg:gap-12" : null,
        className,
      )}
    >
      {feature.media ? (
        <figure className={cn("min-w-0", isLead ? "lg:order-none" : null)}>
          <div
            className={cn(
              "overflow-hidden rounded-md border border-border-subtle bg-surface-muted",
              "aspect-[16/10]",
              "motion-safe:transition-transform motion-safe:duration-200",
              "motion-safe:hover:scale-[1.01] motion-safe:focus-within:scale-[1.01]",
            )}
          >
            <Image
              src={feature.media.src}
              alt={feature.media.alt}
              width={feature.media.width}
              height={feature.media.height}
              sizes={
                isLead
                  ? "(max-width: 1023px) 100vw, 50vw"
                  : "(max-width: 1023px) 100vw, 33vw"
              }
              className="size-full object-cover object-top"
              unoptimized={isSvg}
            />
          </div>
          {feature.media.caption ? (
            <figcaption className="mt-2 text-sm text-text-muted">
              {feature.media.caption}
            </figcaption>
          ) : null}
        </figure>
      ) : null}

      <div
        className={cn(
          "min-w-0 max-w-reading",
          feature.media ? "mt-6 lg:mt-0" : null,
        )}
      >
        <Badge variant="neutral">{feature.workStatusLabel}</Badge>
        <HeadingTag id={titleId} className="ds-h3 mt-3 m-0">
          {feature.title}
        </HeadingTag>
        <p className="mt-3 m-0 text-text-body">
          <span className="font-medium text-ink">Problem. </span>
          {feature.problem}
        </p>
        <p className="mt-3 m-0 text-text-body">
          <span className="font-medium text-ink">Contribution. </span>
          {feature.contribution}
        </p>
        <p className="mt-3 m-0 text-text-body">
          <span className="font-medium text-ink">Result. </span>
          {feature.result}
        </p>
        {feature.link ? (
          <p className="mt-5 m-0">
            <TextLink href={feature.link.href}>{feature.link.label}</TextLink>
          </p>
        ) : null}
      </div>
    </article>
  );
}
