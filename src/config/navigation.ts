import { publicRoutes, type RouteId } from "@/config/routes";

export type NavDestination = {
  id: string;
  label: string;
  path: string;
  implemented: boolean;
};

export type ServicesNav = {
  overview: NavDestination | null;
  categories: NavDestination[];
};

export type HeaderNavigation = {
  items: NavDestination[];
  services: ServicesNav | null;
  cta: NavDestination | null;
};

const SERVICE_ITEMS: { id: RouteId; label: string }[] = [
  { id: "websitesEcommerce", label: "Websites and E-commerce" },
  { id: "webMobileApps", label: "Web and Mobile Applications" },
  { id: "businessSystems", label: "Business Systems" },
  { id: "aiAutomation", label: "AI and Automation" },
  { id: "customSoftware", label: "Custom Software" },
  { id: "uiUxDesign", label: "UI/UX Design" },
];

const PRIMARY_ITEMS: { id: RouteId; label: string }[] = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "process", label: "Process" },
];

export function destination(id: RouteId, label: string): NavDestination {
  const route = publicRoutes[id];
  return {
    id: route.id,
    label,
    path: route.path,
    implemented: route.implemented,
  };
}

/** Home appears in the mobile panel even though the wordmark already links Home. */
export function getHomeDestination(): NavDestination {
  return destination("home", "Home");
}

function hasUsableServices(services: ServicesNav): boolean {
  return (
    Boolean(services.overview?.implemented) || services.categories.length > 0
  );
}

/** Destinations eligible for the live SiteHeader (implemented routes only). */
export function getHeaderNavigation(): HeaderNavigation {
  const overview = destination("services", "Services");
  const categories = SERVICE_ITEMS.map((item) =>
    destination(item.id, item.label),
  ).filter((item) => item.implemented);

  const services: ServicesNav = {
    overview: overview.implemented ? overview : null,
    categories,
  };

  return {
    items: PRIMARY_ITEMS.map((item) => destination(item.id, item.label)).filter(
      (item) => item.implemented,
    ),
    services: hasUsableServices(services) ? services : null,
    cta: publicRoutes.contact.implemented
      ? destination("contact", "Start a project")
      : null,
  };
}

/**
 * Full intended desktop nav for the local gallery.
 * Interactive examples use existing routes or in-page ids only.
 */
export function getDesktopNavSpecimen(): HeaderNavigation {
  return {
    items: [
      destination("work", "Work"),
      destination("about", "About"),
      destination("process", "Process"),
      {
        id: "long-label",
        label:
          "A deliberately long navigation label for zoom and wrapping checks",
        path: "/",
        implemented: true,
      },
    ],
    services: {
      overview: {
        id: "services-example",
        label: "Services",
        path: "#layout-specimen-heading",
        implemented: true,
      },
      categories: [
        {
          id: "example-in-page",
          label: "Example in-page target",
          path: "#colour-heading",
          implemented: true,
        },
        {
          id: "example-home",
          label: "Home (existing route)",
          path: "/",
          implemented: true,
        },
        ...SERVICE_ITEMS.map((item) => destination(item.id, item.label)),
      ],
    },
    cta: destination("contact", "Start a project"),
  };
}

/**
 * Gallery-only extra labels so the mobile panel must scroll.
 * Reuses the desktop specimen; does not invent a second route list.
 */
export function getMobileNavSpecimen(): HeaderNavigation {
  const specimen = getDesktopNavSpecimen();
  return {
    ...specimen,
    items: [
      ...specimen.items,
      {
        id: "mobile-scroll-a",
        label:
          "Long panel example A — extra copy so the dialog must scroll on a short phone screen",
        path: "#layout-specimen-heading",
        implemented: true,
      },
      {
        id: "mobile-scroll-b",
        label:
          "Long panel example B — another wrapping label for landscape and 200 percent zoom",
        path: "#colour-heading",
        implemented: true,
      },
    ],
  };
}

/** Implemented destinations for the no-JavaScript header list. */
export function getImplementedNavDestinations(
  nav: HeaderNavigation,
): NavDestination[] {
  const list: NavDestination[] = [];
  const home = getHomeDestination();
  if (home.implemented) {
    list.push(home);
  }
  if (nav.services?.overview?.implemented) {
    list.push(nav.services.overview);
  }
  for (const category of nav.services?.categories ?? []) {
    if (category.implemented) {
      list.push(category);
    }
  }
  for (const item of nav.items) {
    if (item.implemented) {
      list.push(item);
    }
  }
  if (nav.cta?.implemented) {
    list.push(nav.cta);
  }
  return list;
}
