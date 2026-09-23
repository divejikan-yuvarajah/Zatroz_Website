import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { TextLink } from "@/components/ui/text-link";
import { cn } from "@/lib/cn";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type PageBreadcrumbProps = {
  items: readonly BreadcrumbItem[];
  className?: string;
};

/**
 * Simple breadcrumb trail. Current page is text only (no self-link).
 * Emits matching BreadcrumbList JSON-LD for crawlers.
 */
export function PageBreadcrumb({ items, className }: PageBreadcrumbProps) {
  return (
    <>
      <BreadcrumbJsonLd items={items} />
      <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
        <ol className="m-0 flex list-none flex-wrap items-center gap-x-2 gap-y-1 p-0 text-text-muted">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li
                key={`${item.label}-${index}`}
                className="flex items-center gap-2"
              >
                {index > 0 ? (
                  <span aria-hidden="true" className="text-text-muted">
                    /
                  </span>
                ) : null}
                {item.href && !isLast ? (
                  <TextLink href={item.href}>{item.label}</TextLink>
                ) : (
                  <span
                    className={isLast ? "font-medium text-ink" : undefined}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
