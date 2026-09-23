import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";
import { securityHeaderList } from "./src/lib/security/response-headers";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Keep Turbopack rooted in this repo (avoids picking up a parent lockfile).
  turbopack: {
    root: projectRoot,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaderList(),
      },
    ];
  },
};

export default nextConfig;
