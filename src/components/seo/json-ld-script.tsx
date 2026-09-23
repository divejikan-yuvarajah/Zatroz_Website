import { serializeJsonLd } from "@/lib/seo/json-ld";

type JsonLdScriptProps = {
  data: unknown;
  id?: string;
};

/**
 * Server JSON-LD script. Uses serializeJsonLd so `<` cannot break out of the tag.
 */
export function JsonLdScript({ data, id }: JsonLdScriptProps) {
  return (
    <script
      id={id}
      type="application/ld+json"
      // Safe: serializeJsonLd escapes U+003C; no raw HTML interpolation.
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
