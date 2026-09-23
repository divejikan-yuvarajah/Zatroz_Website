import { JsonLdScript } from "@/components/seo/json-ld-script";
import {
  buildBreadcrumbListJsonLd,
  type JsonLdBreadcrumbItem,
} from "@/lib/seo/json-ld";
import { absolutePublicUrl } from "@/server/seo/metadata";

export type BreadcrumbJsonLdItem = Readonly<{
  label: string;
  /** Site-relative path when the crumb is a link. */
  href?: string;
}>;

type BreadcrumbJsonLdProps = {
  items: readonly BreadcrumbJsonLdItem[];
};

/**
 * BreadcrumbList JSON-LD aligned with visible PageBreadcrumb trails.
 */
export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  if (items.length === 0) {
    return null;
  }

  const list: JsonLdBreadcrumbItem[] = items.map((item, index) => {
    const isLast = index === items.length - 1;
    if (!isLast && item.href) {
      return {
        name: item.label,
        item: absolutePublicUrl(item.href),
      };
    }
    return { name: item.label };
  });

  return (
    <JsonLdScript
      id="zatroz-breadcrumb"
      data={buildBreadcrumbListJsonLd(list)}
    />
  );
}
