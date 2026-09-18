import type { RouteId } from "@/config/routes";

/**
 * Authoritative navigation labels and order.
 * Paths come from `src/config/routes.ts` via routeId — do not duplicate URLs here.
 */

export type NavItemDef = {
  id: string;
  label: string;
  routeId: RouteId;
  order: number;
};

export const serviceNavItems = [
  {
    id: "nav-svc-websites-ecommerce",
    label: "Websites and E-commerce",
    routeId: "websitesEcommerce",
    order: 1,
  },
  {
    id: "nav-svc-web-mobile-apps",
    label: "Web and Mobile Applications",
    routeId: "webMobileApps",
    order: 2,
  },
  {
    id: "nav-svc-business-systems",
    label: "Business Systems",
    routeId: "businessSystems",
    order: 3,
  },
  {
    id: "nav-svc-ai-automation",
    label: "AI and Automation",
    routeId: "aiAutomation",
    order: 4,
  },
  {
    id: "nav-svc-custom-software",
    label: "Custom Software",
    routeId: "customSoftware",
    order: 5,
  },
  {
    id: "nav-svc-ui-ux-design",
    label: "UI/UX Design",
    routeId: "uiUxDesign",
    order: 6,
  },
] as const satisfies readonly NavItemDef[];

export const primaryNavItems = [
  { id: "nav-work", label: "Work", routeId: "work", order: 1 },
  { id: "nav-about", label: "About", routeId: "about", order: 2 },
  { id: "nav-process", label: "Process", routeId: "process", order: 3 },
] as const satisfies readonly NavItemDef[];

export const footerExploreItems = [
  { id: "nav-home", label: "Home", routeId: "home", order: 1 },
  { id: "nav-services", label: "Services", routeId: "services", order: 2 },
  ...primaryNavItems,
  {
    id: "nav-contact",
    label: "Start a project",
    routeId: "contact",
    order: 10,
  },
] as const satisfies readonly NavItemDef[];

export const footerPolicyItems = [
  { id: "nav-privacy", label: "Privacy", routeId: "privacy", order: 1 },
  { id: "nav-terms", label: "Terms", routeId: "terms", order: 2 },
] as const satisfies readonly NavItemDef[];

export const servicesOverviewNav = {
  id: "nav-services-overview",
  label: "Services",
  routeId: "services" as const,
  order: 0,
} as const satisfies NavItemDef;
