import "server-only";

import {
  getEnquiryMailtoHref,
  getWhatsAppHref,
  siteContact,
} from "@/config/brand";
import { publicRoutes } from "@/config/routes";
import { businessNeedRecords } from "@/content/business-needs";
import { homeFinalCtaRecord } from "@/content/home-final-cta";
import type { PublicCta } from "@/content/home";
import { contentCatalog } from "@/content/catalog";
import {
  servicesOverviewRecord,
  type PublicOverviewGuideItem,
  type PublicOverviewNeed,
  type PublicOverviewService,
  type PublicServicesOverview,
} from "@/content/services-overview";
import type { ServiceRecord } from "@/content/services";
import type { ServiceSlug } from "@/types/content";
import { siteRecord } from "@/content/site";
import { listPublishedProjects } from "@/server/public-projects";

export type { PublicServicesOverview };

function serviceAnchorId(slug: string): string {
  return `service-${slug}`;
}

/**
 * Enquiry destination for services pages.
 * Prefer Contact with optional ?service=; never use a same-page #start-a-project.
 * May link to `/#start-a-project` when the homepage invitation is public.
 */
export function resolveServicesEnquiryCta(options?: {
  serviceSlug?: ServiceSlug;
  label?: string;
}): PublicCta | null {
  const label = options?.label ?? siteRecord.cta.primaryLabel;

  if (publicRoutes.contact.implemented) {
    const href = options?.serviceSlug
      ? `${publicRoutes.contact.path}?service=${options.serviceSlug}`
      : publicRoutes.contact.path;
    return { label, href };
  }

  if (siteContact.email.status === "confirmed") {
    return {
      label: options?.label ?? "Email Zatroz",
      href: getEnquiryMailtoHref(siteContact.email),
    };
  }

  if (siteContact.whatsapp.status === "confirmed") {
    return {
      label: options?.label ?? siteRecord.cta.secondaryWhatsAppLabel,
      href: getWhatsAppHref(siteContact.whatsapp),
    };
  }

  if (hasPublicHomeInvitation()) {
    return {
      label,
      href: "/#start-a-project",
    };
  }

  return null;
}

function hasPublicHomeInvitation(): boolean {
  if (homeFinalCtaRecord.publicationState !== "approved") {
    return false;
  }

  return (
    publicRoutes.contact.implemented ||
    siteContact.email.status === "confirmed" ||
    siteContact.whatsapp.status === "confirmed"
  );
}

function resolveDetailAction(service: ServiceRecord): PublicCta | null {
  const route = publicRoutes[service.routeId];
  const detailReady =
    service.publicationState === "approved" &&
    service.detail?.publicationState === "approved" &&
    route.implemented;

  if (detailReady) {
    return {
      label: `Explore ${service.title}`,
      href: route.path,
    };
  }

  return resolveServicesEnquiryCta({
    serviceSlug: service.slug,
    label: siteRecord.cta.primaryLabel,
  });
}

function projectOverviewService(service: ServiceRecord): PublicOverviewService {
  return {
    id: service.id,
    slug: service.slug,
    anchorId: serviceAnchorId(service.slug),
    title: service.title,
    whoItSuits: service.whoItSuits,
    outcome: service.summary,
    deliverables: service.deliverables.slice(0, 3),
    detailAction: resolveDetailAction(service),
  };
}

function projectNeeds(
  services: readonly PublicOverviewService[],
): PublicOverviewNeed[] {
  const byId = new Map(
    contentCatalog.services.map((service) => [service.id, service]),
  );

  return businessNeedRecords
    .filter((need) => need.publicationState === "approved")
    .map((need) => {
      const serviceAnchors = need.serviceIds.flatMap((serviceId) => {
        const record = byId.get(serviceId);
        if (!record || record.publicationState !== "approved") {
          return [];
        }
        const projected = services.find((row) => row.id === serviceId);
        if (!projected) {
          return [];
        }
        return [
          {
            id: projected.id,
            title: projected.title,
            anchorId: projected.anchorId,
          },
        ];
      });

      return {
        id: need.id,
        title: need.title,
        explanation: need.explanation,
        serviceAnchors,
      };
    })
    .filter((need) => need.serviceAnchors.length > 0);
}

function projectNotSureItems(
  includeDraftServices: boolean,
): PublicOverviewGuideItem[] {
  const byId = new Map(
    contentCatalog.services.map((service) => [service.id, service]),
  );

  return servicesOverviewRecord.notSureItems.map((item) => {
    const serviceLabels = item.serviceIds.flatMap((serviceId) => {
      const service = byId.get(serviceId);
      if (!service) {
        return [];
      }
      if (!includeDraftServices && service.publicationState !== "approved") {
        return [];
      }
      return [service.title];
    });

    return {
      id: item.id,
      situation: item.situation,
      guidance: item.guidance,
      serviceLabels,
    };
  });
}

async function getApprovedRelatedWork(): Promise<{
  heading: string;
  supporting: string;
  items: readonly { id: string; title: string; href: string | null }[];
} | null> {
  const listed = await listPublishedProjects({ page: 1, pageSize: 3 });
  const items = listed.items.map((card) => ({
    id: card.id,
    title: card.title,
    href: card.storyLinkEligible
      ? card.storyPath
      : publicRoutes.work.implemented
        ? publicRoutes.work.path
        : (card.links.find((link) => /^https:\/\//i.test(link.href))?.href ??
          null),
  }));

  if (items.length === 0) {
    return null;
  }

  return {
    heading: servicesOverviewRecord.workHeading,
    supporting: servicesOverviewRecord.workSupporting,
    items,
  };
}

async function buildPublicServicesOverview(options?: {
  includeDraftServices?: boolean;
  includeDraftFraming?: boolean;
  heading?: string;
  supporting?: string;
}): Promise<PublicServicesOverview | null> {
  const includeDraft = options?.includeDraftServices ?? false;
  const includeDraftFraming = options?.includeDraftFraming ?? false;

  const framingReady =
    includeDraftFraming ||
    servicesOverviewRecord.publicationState === "approved";

  const services = contentCatalog.services
    .filter(
      (service) => includeDraft || service.publicationState === "approved",
    )
    .map(projectOverviewService);

  if (!framingReady && services.length === 0 && !includeDraft) {
    return null;
  }

  const deliveryReady =
    includeDraftFraming ||
    servicesOverviewRecord.deliveryPublicationState === "approved";

  const heading =
    options?.heading ??
    (framingReady ? servicesOverviewRecord.heading : "Services");
  const supporting =
    options?.supporting ??
    (framingReady
      ? servicesOverviewRecord.supporting
      : "These are the service groups Zatroz offers. Choose a group that fits your need, or ask us if you are not sure which path is right.");

  const needs = includeDraft
    ? businessNeedRecords.map((need) => ({
        id: need.id,
        title: need.title,
        explanation: need.explanation,
        serviceAnchors: need.serviceIds.flatMap((serviceId) => {
          const projected = services.find((row) => row.id === serviceId);
          if (!projected) {
            return [];
          }
          return [
            {
              id: projected.id,
              title: projected.title,
              anchorId: projected.anchorId,
            },
          ];
        }),
      }))
    : framingReady
      ? projectNeeds(services)
      : [];

  return {
    id: servicesOverviewRecord.id,
    heading,
    supporting,
    enquiryAction: resolveServicesEnquiryCta(),
    needsHeading: servicesOverviewRecord.needsHeading,
    needsSupporting: servicesOverviewRecord.needsSupporting,
    needs,
    services,
    notSureHeading: servicesOverviewRecord.notSureHeading,
    notSureBody: servicesOverviewRecord.notSureBody,
    notSureItems: framingReady ? projectNotSureItems(includeDraft) : [],
    delivery: deliveryReady
      ? {
          heading: servicesOverviewRecord.deliveryHeading,
          body: servicesOverviewRecord.deliveryBody,
        }
      : null,
    work: includeDraft ? null : await getApprovedRelatedWork(),
    finalAction: resolveServicesEnquiryCta({
      label: siteRecord.cta.primaryLabel,
    }),
  };
}

/**
 * Public `/services` projection. Omits draft framing and draft services.
 * Returns null when there is nothing approved to show — caller may render
 * an honest sparse placeholder instead of leaking proposed marketing copy.
 */
export async function getPublicServicesOverview(): Promise<PublicServicesOverview | null> {
  return buildPublicServicesOverview({
    includeDraftServices: false,
    includeDraftFraming: false,
  });
}

/**
 * Gallery specimen — labelled draft framing and all six service rows.
 * Never used as the public `/services` projection.
 */
export async function getServicesOverviewSpecimen(): Promise<PublicServicesOverview> {
  const overview = await buildPublicServicesOverview({
    includeDraftServices: true,
    includeDraftFraming: true,
    heading: `${servicesOverviewRecord.heading} (specimen)`,
    supporting: `${servicesOverviewRecord.supporting} Gallery specimen — not published until approved.`,
  });
  if (!overview) {
    throw new Error("Services overview specimen should always resolve.");
  }
  return overview;
}
