import type { ServiceSlug } from "@/types/content";
import { cn } from "@/lib/cn";

const markClass = "h-10 w-10 text-ink";

/**
 * Lightweight decorative marks for service overview rows.
 * aria-hidden — titles carry the accessible name.
 */
export function ServiceMark({
  slug,
  className,
}: {
  slug: ServiceSlug | string;
  className?: string;
}) {
  const classes = cn(markClass, className);

  switch (slug) {
    case "websites-ecommerce":
      return (
        <svg
          className={classes}
          viewBox="0 0 40 40"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="4"
            y="8"
            width="32"
            height="24"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M4 14h32" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="8" cy="11" r="1" fill="currentColor" />
          <circle cx="12" cy="11" r="1" fill="currentColor" />
        </svg>
      );
    case "web-mobile-apps":
      return (
        <svg
          className={classes}
          viewBox="0 0 40 40"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="12"
            y="4"
            width="16"
            height="32"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M18 8h4" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="20" cy="30" r="1.5" fill="currentColor" />
        </svg>
      );
    case "business-systems":
      return (
        <svg
          className={classes}
          viewBox="0 0 40 40"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M8 12h24M8 20h24M8 28h16"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <rect
            x="6"
            y="8"
            width="28"
            height="24"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      );
    case "ai-automation":
      return (
        <svg
          className={classes}
          viewBox="0 0 40 40"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="10"
            cy="20"
            r="3"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle
            cx="20"
            cy="12"
            r="3"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle
            cx="20"
            cy="28"
            r="3"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle
            cx="30"
            cy="20"
            r="3"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M13 20h4M23 14l4 4M23 26l4-4"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      );
    case "custom-software":
      return (
        <svg
          className={classes}
          viewBox="0 0 40 40"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="6"
            y="6"
            width="12"
            height="12"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <rect
            x="22"
            y="6"
            width="12"
            height="12"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <rect
            x="6"
            y="22"
            width="12"
            height="12"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <rect
            x="22"
            y="22"
            width="12"
            height="12"
            rx="1"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      );
    case "ui-ux-design":
      return (
        <svg
          className={classes}
          viewBox="0 0 40 40"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="6"
            y="8"
            width="28"
            height="20"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="3 2"
          />
          <path d="M10 14h12M10 18h8" stroke="currentColor" strokeWidth="1.5" />
          <rect
            x="10"
            y="22"
            width="10"
            height="3"
            rx="0.5"
            fill="currentColor"
          />
        </svg>
      );
    default:
      return (
        <svg
          className={classes}
          viewBox="0 0 40 40"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="8"
            y="8"
            width="24"
            height="24"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      );
  }
}
