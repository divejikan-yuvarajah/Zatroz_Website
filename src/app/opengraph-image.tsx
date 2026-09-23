import { ImageResponse } from "next/og";
import { siteName } from "@/lib/seo/site-copy";

export const runtime = "edge";
export const alt = "Zatroz";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default 1200×630 Open Graph image — code-rendered brand card.
 * Colours: #111111 / #F7F5F2 / #FF3B10. No invented client evidence.
 */
export default function OpenGraphImage() {
  const name = siteName();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#F7F5F2",
        padding: "72px 80px",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "120px",
          height: "8px",
          backgroundColor: "#FF3B10",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          maxWidth: "920px",
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: "#111111",
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 500,
            color: "#111111",
            opacity: 0.72,
            lineHeight: 1.35,
            maxWidth: "820px",
          }}
        >
          Practical digital solutions for everyday work
        </div>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 28,
          fontWeight: 600,
          color: "#FF3B10",
          letterSpacing: "0.02em",
        }}
      >
        zatroz
      </div>
    </div>,
    { ...size },
  );
}
