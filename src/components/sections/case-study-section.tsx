import Image from "next/image";
import { isAdminMediaPreviewSrc } from "@/lib/admin/preview";
import type {
  PublicCaseStudyGalleryItem,
  PublicCaseStudySection,
  PublicStoryBlock,
} from "@/lib/public-case-study";
import { cn } from "@/lib/cn";

export type CaseStudyBlocksProps = {
  blocks: readonly PublicStoryBlock[];
  className?: string;
};

export function CaseStudyBlocks({ blocks, className }: CaseStudyBlocksProps) {
  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <p key={`p-${index}`} className="m-0 text-text-body">
              {block.text}
            </p>
          );
        }
        const ListTag = block.style === "numbered" ? "ol" : "ul";
        return (
          <ListTag
            key={`l-${index}`}
            className={cn(
              "m-0 space-y-2 pl-5 text-text-body",
              block.style === "numbered" ? "list-decimal" : "list-disc",
            )}
          >
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ListTag>
        );
      })}
    </div>
  );
}

export type CaseStudySectionProps = {
  section: PublicCaseStudySection;
  className?: string;
};

export function CaseStudySection({
  section,
  className,
}: CaseStudySectionProps) {
  const hasBody =
    section.blocks.length > 0 ||
    (section.features && section.features.length > 0);
  if (!hasBody && section.key !== "gallery") {
    return null;
  }

  return (
    <section
      id={section.anchorId}
      aria-labelledby={`${section.anchorId}-heading`}
      className={cn("scroll-mt-28", className)}
    >
      <h2 id={`${section.anchorId}-heading`} className="ds-h2 m-0">
        {section.heading}
      </h2>
      <CaseStudyBlocks blocks={section.blocks} className="mt-4" />
      {section.features && section.features.length > 0 ? (
        <ul className="mt-4 list-disc space-y-2 pl-5 text-text-body">
          {section.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export type CaseStudyGalleryProps = {
  items: readonly PublicCaseStudyGalleryItem[];
  headingId: string;
  anchorId: string;
  className?: string;
};

export function CaseStudyGallery({
  items,
  headingId,
  anchorId,
  className,
}: CaseStudyGalleryProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section
      id={anchorId}
      aria-labelledby={headingId}
      className={cn("scroll-mt-28", className)}
    >
      <h2 id={headingId} className="ds-h2 m-0">
        Screens and evidence
      </h2>
      <ul className="mt-6 grid list-none gap-10 p-0">
        {items.map((item, index) => {
          const isSvg = item.src.toLowerCase().endsWith(".svg");
          const unoptimized = isSvg || isAdminMediaPreviewSrc(item.src);
          return (
            <li key={`${item.src}-${index}`} className="min-w-0">
              <figure className="m-0">
                <div className="overflow-hidden rounded-md border border-border-subtle bg-surface-muted">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    loading="lazy"
                    sizes="(max-width: 1023px) 100vw, 48rem"
                    className="h-auto w-full object-contain object-top"
                    unoptimized={unoptimized}
                  />
                </div>
                <figcaption className="mt-3 text-sm text-text-body">
                  {item.conceptLabel ? (
                    <span className="font-medium text-ink">
                      {item.conceptLabel}.{" "}
                    </span>
                  ) : null}
                  {item.caption}
                </figcaption>
              </figure>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
