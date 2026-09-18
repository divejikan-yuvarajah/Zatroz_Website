import type { ReactNode } from "react";
import { SiteFooterContent } from "@/components/layout/site-footer";
import type { PublicContactLink, SiteBrand, SiteContact } from "@/config/brand";
import {
  getMailtoHref,
  getPublicContactLinks,
  getTelHref,
  getWhatsAppHref,
  siteBrand,
  siteContact,
} from "@/config/brand";
import { getFooterNavSpecimen } from "@/config/navigation";

const specimenNav = getFooterNavSpecimen();

const completeBrand: SiteBrand = {
  ...siteBrand,
  description: {
    text: siteBrand.description.text,
    status: "confirmed",
  },
};

/** Gallery-only: treat supplied channels as confirmed; socials still missing. */
const confirmedChannelsContact: SiteContact = {
  ...siteContact,
  phone: { ...siteContact.phone, status: "confirmed" },
  email: { ...siteContact.email, status: "confirmed" },
  whatsapp: { ...siteContact.whatsapp, status: "confirmed" },
};

const completeContactLinks: PublicContactLink[] = getPublicContactLinks(
  confirmedChannelsContact,
);

const longEmailContactLinks: PublicContactLink[] = [
  {
    id: "phone",
    label: siteContact.phone.display,
    href: getTelHref({ ...siteContact.phone, status: "confirmed" }),
  },
  {
    id: "email",
    label: "very.long.example.contact.address.for.wrapping.checks@example.com",
    href: "mailto:very.long.example.contact.address.for.wrapping.checks@example.com",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: getWhatsAppHref({ ...siteContact.whatsapp, status: "confirmed" }),
  },
];

const missingSocialNote = [
  "Instagram handle zatroz.co is known; exact profile URL is missing — no live link.",
  "LinkedIn display name Zatroz is known; exact company URL is unknown — do not guess.",
];

function SpecimenFrame({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3>{title}</h3>
      <div className="mt-4 overflow-hidden rounded-md border border-border-subtle bg-ink">
        {children}
      </div>
    </div>
  );
}

export function FooterSpecimen() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h3>Complete intended footer</h3>
        <p className="ds-support mt-2 max-w-reading">
          Presentational body only — no second footer landmark. Planned routes
          are labelled and are not links. Phone, email, and WhatsApp are shown
          here as if confirmed for layout checks; the live footer omits them
          until founders mark them confirmed.
        </p>
        <div className="mt-4 overflow-hidden rounded-md border border-border-subtle bg-ink">
          <div className="px-gutter">
            <SiteFooterContent
              idPrefix="gallery-footer-complete"
              brand={completeBrand}
              navigation={specimenNav}
              contactLinks={completeContactLinks}
            />
          </div>
        </div>
        <ul className="ds-support mt-4 list-disc space-y-1 pl-5">
          {missingSocialNote.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>

      <SpecimenFrame title="Missing social URLs">
        <div className="px-gutter">
          <SiteFooterContent
            idPrefix="gallery-footer-missing-social"
            brand={completeBrand}
            navigation={{
              explore: specimenNav.explore.filter((item) => item.implemented),
              services: specimenNav.services.filter((item) => item.implemented),
              policies: [],
            }}
            contactLinks={completeContactLinks}
          />
        </div>
      </SpecimenFrame>

      <SpecimenFrame title="Long email wrapping">
        <div className="px-gutter">
          <SiteFooterContent
            idPrefix="gallery-footer-long-email"
            brand={{
              name: siteBrand.name,
              description: {
                text: siteBrand.description.text,
                status: "confirmed",
              },
            }}
            navigation={{
              explore: [specimenNav.explore[0]!],
              services: [],
              policies: [],
            }}
            contactLinks={longEmailContactLinks}
          />
        </div>
      </SpecimenFrame>

      <div>
        <h3>Live projection note</h3>
        <p className="ds-support mt-2 max-w-reading">
          Mailto example for the supplied address format:{" "}
          <code>{getMailtoHref(siteContact.email)}</code>. WhatsApp digits-only
          URL shape when confirmed:{" "}
          <code>{getWhatsAppHref(siteContact.whatsapp)}</code>. Do not activate
          these as a test from this gallery note.
        </p>
      </div>
    </div>
  );
}
