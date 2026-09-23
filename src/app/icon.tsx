import { ImageResponse } from "next/og";
import { siteName } from "@/lib/seo/site-copy";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Simple brand mark icon — charcoal square with vermilion accent. */
export default function Icon() {
  const name = siteName().slice(0, 1).toUpperCase();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#111111",
        color: "#F7F5F2",
        fontSize: 20,
        fontWeight: 700,
      }}
    >
      {name}
      <div
        style={{
          position: "absolute",
          bottom: 4,
          right: 4,
          width: 6,
          height: 6,
          backgroundColor: "#FF3B10",
        }}
      />
    </div>,
    { ...size },
  );
}
