/**
 * Safe JSON-LD serialization for embedding in a script element.
 * Escapes U+003C so untrusted strings cannot close the script tag.
 */

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export type JsonLdBreadcrumbItem = Readonly<{
  name: string;
  /** Absolute URL when the crumb is a link; omit for the current page. */
  item?: string;
}>;

export function buildBreadcrumbListJsonLd(
  items: readonly JsonLdBreadcrumbItem[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((entry, index) => {
      const element: Record<string, unknown> = {
        "@type": "ListItem",
        position: index + 1,
        name: entry.name,
      };
      if (entry.item) {
        element.item = entry.item;
      }
      return element;
    }),
  };
}

export function buildOrganizationJsonLd(input: {
  name: string;
  url: string;
  logoUrl?: string;
  sameAs?: readonly string[];
}): Record<string, unknown> {
  const graph: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: input.name,
    url: input.url,
  };
  if (input.logoUrl) {
    graph.logo = input.logoUrl;
  }
  if (input.sameAs && input.sameAs.length > 0) {
    graph.sameAs = [...input.sameAs];
  }
  return graph;
}

export function buildWebSiteJsonLd(input: {
  name: string;
  url: string;
  description?: string;
}): Record<string, unknown> {
  const graph: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: input.name,
    url: input.url,
  };
  if (input.description) {
    graph.description = input.description;
  }
  return graph;
}
