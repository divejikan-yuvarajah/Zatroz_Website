"use client";

import { ButtonLink, type ButtonLinkProps } from "@/components/ui/button-link";
import { captureBrowserEvent } from "@/lib/observability/capture";
import type { PublicEventDraft } from "@/lib/observability/public-events";

type TrackedButtonLinkProps = ButtonLinkProps & {
  event: PublicEventDraft;
};

/**
 * Click tracking is a no-op while browser analytics are disabled.
 * The link still navigates if capture throws.
 */
export function TrackedButtonLink({
  event,
  onClick,
  ...props
}: TrackedButtonLinkProps) {
  return (
    <ButtonLink
      {...props}
      onClick={(clickEvent) => {
        try {
          captureBrowserEvent(event);
        } catch {
          // Analytics must not block the link.
        }
        onClick?.(clickEvent);
      }}
    />
  );
}
