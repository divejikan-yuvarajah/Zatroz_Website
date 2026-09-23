import "server-only";

import { JsonLdScript } from "@/components/seo/json-ld-script";
import { siteContact } from "@/config/brand";
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from "@/lib/seo/json-ld";
import { defaultSiteDescription, siteName } from "@/lib/seo/site-copy";
import { absolutePublicUrl } from "@/server/seo/metadata";

function verifiedSameAs(): string[] {
  const profiles = [siteContact.social.instagram, siteContact.social.linkedin];
  return profiles
    .filter((profile) => profile.status === "confirmed" && profile.href)
    .map((profile) => profile.href as string);
}

/**
 * Organization + WebSite JSON-LD for the public document shell.
 * Omits inventable ratings, addresses, and unverified social profiles.
 */
export function SiteJsonLd() {
  const origin = absolutePublicUrl("/");
  const name = siteName();
  const description = defaultSiteDescription();
  const sameAs = verifiedSameAs();

  return (
    <>
      <JsonLdScript
        id="zatroz-organization"
        data={buildOrganizationJsonLd({
          name,
          url: origin,
          logoUrl: absolutePublicUrl("/icon"),
          sameAs,
        })}
      />
      <JsonLdScript
        id="zatroz-website"
        data={buildWebSiteJsonLd({
          name,
          url: origin,
          description,
        })}
      />
    </>
  );
}
