import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb/connection";
import { dispatchEnquiryNotificationBatch } from "@/server/jobs/enquiry-notifications";

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
 * Protected enquiry-notification dispatcher (Step 51).
 * Authorization: `Authorization: Bearer <CRON_SECRET>` or `x-cron-secret`.
 * Returns counts only. Does not enable production scheduling by itself.
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

  let db;
  try {
    db = await getDb();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Database unavailable." },
      { status: 503 },
    );
  }

  const counts = await dispatchEnquiryNotificationBatch({ db, limit: 10 });
  return NextResponse.json({ ok: true, ...counts });
}

export async function GET(request: Request) {
  return POST(request);
}
