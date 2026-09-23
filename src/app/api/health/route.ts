import { NextResponse } from "next/server";
import { livenessPayload } from "@/lib/observability/signals";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Process liveness only. No database, secrets, or provider checks.
 */
export function GET() {
  return NextResponse.json(livenessPayload(), {
    headers: { "cache-control": "no-store" },
  });
}
