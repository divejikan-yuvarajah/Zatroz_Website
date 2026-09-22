"use client";

import { useEffect } from "react";
import { logBoundaryError } from "@/lib/system/log-boundary-error";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

/**
 * Last-resort UI when the root layout fails.
 * Self-contained document — no SiteShell, DB, auth, or image CDN.
 * Retry re-renders the boundary children only (not a mutation replay).
 */
export default function GlobalError({ error, retry }: GlobalErrorProps) {
  useEffect(() => {
    logBoundaryError("app/global-error", error);
  }, [error]);

  const digest = error.digest?.trim() || null;

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
          background: "#f7f5f2",
          color: "#171717",
          lineHeight: 1.5,
        }}
      >
        <main
          style={{
            maxWidth: "40rem",
            margin: "0 auto",
            padding: "3rem 1.25rem",
          }}
        >
          <h1 style={{ fontSize: "1.75rem", lineHeight: 1.2, margin: 0 }}>
            Something went wrong
          </h1>
          <p style={{ marginTop: "1rem" }}>
            The site shell could not load. Your enquiry was not sent again by
            this message. You can try once more or return home.
          </p>
          {digest ? (
            <p
              style={{
                marginTop: "0.75rem",
                fontSize: "0.875rem",
                color: "#525252",
              }}
            >
              Reference: <code>{digest}</code>
            </p>
          ) : null}
          <p
            style={{
              marginTop: "1.5rem",
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => {
                retry();
              }}
              style={{
                minHeight: "2.75rem",
                padding: "0.5rem 1.25rem",
                border: "none",
                borderRadius: "0.125rem",
                background: "#ff3b10",
                color: "#171717",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            {/* Plain anchor: global-error must stay free of next/link and SiteShell. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- self-contained fallback */}
            <a
              href="/"
              style={{
                minHeight: "2.75rem",
                padding: "0.5rem 1.25rem",
                borderRadius: "0.125rem",
                border: "1px solid #d4d4d4",
                background: "#fff",
                color: "#171717",
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              Home
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
