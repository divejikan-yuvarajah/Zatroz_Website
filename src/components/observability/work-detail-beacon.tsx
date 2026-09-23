"use client";

import { useEffect, useRef } from "react";
import { captureBrowserEvent } from "@/lib/observability/capture";

/**
 * One view signal per mount. Disabled browser capture stores nothing.
 */
export function WorkDetailBeacon() {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    try {
      captureBrowserEvent(
        {
          name: "work_detail_viewed",
          routePath: "/work/[slug]",
          properties: {
            routeTemplate: "/work/[slug]",
            placement: "work-detail",
            outcome: "view",
          },
        },
        "work_detail_viewed",
      );
    } catch {
      // Viewing the page must not depend on telemetry.
    }
  }, []);

  return null;
}
