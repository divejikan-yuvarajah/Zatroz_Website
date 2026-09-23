import { ImageResponse } from "next/og";
import { siteName } from "@/lib/seo/site-copy";
import { getPublishedCaseStudyBySlug } from "@/server/public-projects";

// Node runtime required — published catalogue uses MongoDB.
export const runtime = "nodejs";
export const alt = "Zatroz project";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type OgImageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Project share image — published title only. Unknown/unpublished slugs get
 * a generic brand card (no private titles or draft media).
 */
export default async function WorkOpenGraphImage({ params }: OgImageProps) {
  const { slug } = await params;
  const study = await getPublishedCaseStudyBySlug(slug);
  const brand = siteName();
  const title = study?.title?.trim() || brand;
  const subtitle = study
    ? "Published project — Zatroz"
    : "Practical digital solutions for everyday work";

  return new ImageResponse(
    (
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
            gap: "28px",
            maxWidth: "960px",
          }}
        >
          <div
            style={{
              fontSize: title.length > 48 ? 56 : 72,
              fontWeight: 700,
              color: "#111111",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 500,
              color: "#111111",
              opacity: 0.7,
              lineHeight: 1.35,
            }}
          >
            {subtitle}
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
          {brand}
        </div>
      </div>
    ),
    { ...size },
  );
}
