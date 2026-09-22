import type { Metadata } from "next";
import { PublicNotFoundState } from "@/components/system/system-state";

export const metadata: Metadata = {
  title: "Page not found — Zatroz",
  description: "That address is not available on the Zatroz website.",
  robots: { index: false, follow: false },
};

/**
 * Root not-found UI for unmatched routes and `notFound()` calls.
 * Does not echo the requested path or query string.
 */
export default function NotFoundPage() {
  return <PublicNotFoundState />;
}
