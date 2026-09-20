import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb/connection";
import {
  RESEND_WEBHOOK_MAX_BODY_BYTES,
  resolveResendWebhookSecret,
  verifyResendWebhookPayload,
} from "@/lib/email/resend-webhook";
import { processVerifiedResendDeliveryEvent } from "@/server/email/process-resend-webhook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Resend delivery webhook (Step 52).
 * Signature policy is Svix/Resend — not browser Origin / Turnstile.
 * Returns only safe status categories; never enquiry content.
 */
export async function POST(request: Request) {
  const webhookSecret = resolveResendWebhookSecret();
  if (!webhookSecret) {
    return NextResponse.json(
      { ok: false, error: "Webhook secret is not configured." },
      { status: 503 },
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > RESEND_WEBHOOK_MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Payload too large." },
      { status: 413 },
    );
  }

  const payload = await request.text();
  if (payload.length > RESEND_WEBHOOK_MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Payload too large." },
      { status: 413 },
    );
  }

  const verified = verifyResendWebhookPayload({
    payload,
    headers: request.headers,
    webhookSecret,
  });
  if (!verified.ok) {
    return NextResponse.json(
      { ok: false, error: "Invalid webhook." },
      { status: 400 },
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

  const result = await processVerifiedResendDeliveryEvent(db, verified.event);
  if (result.status === "storage-failed") {
    return NextResponse.json(
      { ok: false, error: "Storage unavailable." },
      { status: 503 },
    );
  }

  return NextResponse.json({
    ok: true,
    status: result.status,
    deliveryFact: result.deliveryFact,
  });
}
