import { HomeFinalCta } from "@/components/sections/home-final-cta";
import { getHomeFinalCtaSpecimen } from "@/server/home";

/**
 * Gallery specimens for the final enquiry invitation.
 * Fixtures are labelled — not a claim that Contact is live.
 */
export function HomeFinalCtaSpecimen() {
  const withContact = getHomeFinalCtaSpecimen("contact");
  const withEmail = getHomeFinalCtaSpecimen("email");
  const withWhatsApp = getHomeFinalCtaSpecimen("whatsapp");
  const withAlternatives = getHomeFinalCtaSpecimen("alternatives");
  const longCopy = getHomeFinalCtaSpecimen("long-copy");

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h3>Primary → Contact path (specimen)</h3>
        <p className="ds-support mt-2 max-w-reading">
          Preferred when `/contact` is implemented. Public `/` omits this
          section until framing is approved and a usable action exists.
        </p>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeFinalCta
            invitation={withContact}
            headingLevel={2}
            idPrefix="gallery-cta-contact-"
          />
        </div>
      </div>

      <div>
        <h3>Email fallback (specimen)</h3>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeFinalCta
            invitation={withEmail}
            headingLevel={2}
            idPrefix="gallery-cta-email-"
          />
        </div>
      </div>

      <div>
        <h3>WhatsApp fallback (specimen)</h3>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeFinalCta
            invitation={withWhatsApp}
            headingLevel={2}
            idPrefix="gallery-cta-wa-"
          />
        </div>
      </div>

      <div>
        <h3>Primary plus quiet alternatives</h3>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeFinalCta
            invitation={withAlternatives}
            headingLevel={2}
            idPrefix="gallery-cta-alts-"
          />
        </div>
      </div>

      <div>
        <h3>Long heading wrapping</h3>
        <div className="mt-6 overflow-hidden rounded-md border border-border-subtle">
          <HomeFinalCta
            invitation={longCopy}
            headingLevel={2}
            idPrefix="gallery-cta-long-"
          />
        </div>
      </div>
    </div>
  );
}
