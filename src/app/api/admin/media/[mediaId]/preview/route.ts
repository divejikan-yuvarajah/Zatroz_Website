import { NextResponse } from "next/server";
import { createAuthenticatedPreviewUrl } from "@/server/media/cloudinary";
import { findLatestMediaVersion } from "@/server/media/repository";
import { requireAdminSession } from "@/server/security/auth-gate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ mediaId: string }>;
};

/**
 * Auth-gated private preview. Redirects to a short-lived signed Cloudinary URL.
 * Never returns a durable public URL for private assets.
 */
export async function GET(_request: Request, context: RouteContext) {
  const gate = await requireAdminSession();
  if (!gate.ok) {
    return NextResponse.json(
      { error: "unauthorized", message: "Staff session with MFA required." },
      { status: 401 },
    );
  }

  const { mediaId: rawId } = await context.params;
  const mediaId = decodeURIComponent(rawId ?? "").trim();
  if (!mediaId) {
    return NextResponse.json(
      { error: "bad-request", message: "Missing media id." },
      { status: 400 },
    );
  }

  const found = await findLatestMediaVersion(mediaId);
  if (!found.ok) {
    const status = found.reason === "not-found" ? 404 : 503;
    return NextResponse.json(
      { error: found.reason, message: found.detail },
      { status },
    );
  }

  if (found.item.visibility === "public") {
    // Future public CDN path — still go through signed helper if authenticated type.
  }

  const signed = createAuthenticatedPreviewUrl({
    publicId: found.item.providerAssetId,
  });
  if (!signed.ok) {
    return NextResponse.json(
      { error: "preview-unavailable", message: signed.message },
      { status: 503 },
    );
  }

  return NextResponse.redirect(signed.url, 302);
}
