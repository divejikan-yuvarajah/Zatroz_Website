import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { runContentJobWorker } from "@/server/jobs/content-jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cronSecretConfigured(): string | null {
  const value = process.env.CRON_SECRET?.trim() ?? "";
  return value.length >= 16 ? value : null;
}

function authorize(request: Request): boolean {
  const expected = cronSecretConfigured();
  if (!expected) return false;

  const header =
    request.headers.get("authorization") ??
    request.headers.get("x-cron-secret") ??
    "";
  const bearer = header.toLowerCase().startsWith("bearer ")
    ? header.slice(7).trim()
    : header.trim();

  if (!bearer || bearer.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(bearer), Buffer.from(expected));
  } catch {
    return false;
  }
}

/**
 * Protected content-job worker endpoint (A11).
 * Authorization: `Authorization: Bearer <CRON_SECRET>` or `x-cron-secret`.
 */
export async function POST(request: Request) {
  if (!cronSecretConfigured()) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET is not configured." },
      { status: 503 },
    );
  }
  if (!authorize(request)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401 },
    );
  }

  const result = await runContentJobWorker({ limit: 20 });
  return NextResponse.json({ ok: true, ...result });
}

export async function GET(request: Request) {
  return POST(request);
}
