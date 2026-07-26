import { NextRequest, NextResponse } from "next/server";
import { parseLead, type LeadInput } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * Generic, non-revealing error message returned to the client for every
 * failure mode (validation, honeypot trip, delivery failure). Per
 * 07-codex-technical-spec.md, "Return generic public errors" — no
 * field-level internals or stack traces ever cross the response boundary.
 */
const GENERIC_ERROR = "We could not submit your request. Please try again, or call Admissions directly.";
const RATE_LIMIT_ERROR = "Too many requests. Please wait a few minutes and try again.";

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown";
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  const { allowed, retryAfterSeconds } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { ok: false, error: RATE_LIMIT_ERROR },
      {
        status: 429,
        headers: retryAfterSeconds ? { "Retry-After": String(retryAfterSeconds) } : undefined,
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: GENERIC_ERROR }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ ok: false, error: GENERIC_ERROR }, { status: 400 });
  }

  const record = body as Record<string, unknown>;

  // Hidden honeypot field ("company", see components/sections/Assessment.tsx).
  // Real visitors never fill this in. Reject without revealing that spam
  // detection happened.
  const honeypot = typeof record.company === "string" ? record.company.trim() : "";
  if (honeypot.length > 0) {
    return NextResponse.json({ ok: false, error: GENERIC_ERROR }, { status: 400 });
  }

  const { company: _honeypot, ...rest } = record;
  void _honeypot;
  const parsed = parseLead(rest);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: GENERIC_ERROR }, { status: 400 });
  }

  const lead = parsed.data;

  const delivered = await deliverLead(lead);
  if (!delivered) {
    return NextResponse.json({ ok: false, error: GENERIC_ERROR }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

/**
 * Delivery, in the priority order from 07-codex-technical-spec.md:
 * 1. LEAD_WEBHOOK_URL — POST the validated lead as JSON.
 * 2. RESEND_API_KEY + ADMISSIONS_EMAIL — send a plain-text email via the
 *    Resend REST API directly (no `resend` SDK dependency is installed in
 *    package.json, so this calls their HTTP API with `fetch` instead of
 *    adding a new package).
 * 3. Neither configured — in development only, log a REDACTED summary
 *    (no name/phone/email) so local testing has visible feedback; in any
 *    other environment this is a hard failure, since a lead would otherwise
 *    silently vanish.
 */
async function deliverLead(lead: LeadInput): Promise<boolean> {
  const webhookUrl = process.env.LEAD_WEBHOOK_URL?.trim();
  if (webhookUrl) {
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
      if (response.ok) return true;
      console.error("[lead] webhook delivery failed", { status: response.status });
      return false;
    } catch (error) {
      console.error("[lead] webhook delivery error", error instanceof Error ? error.message : "unknown error");
      return false;
    }
  }

  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const admissionsEmail = process.env.ADMISSIONS_EMAIL?.trim();
  if (resendApiKey && admissionsEmail) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Must be an address on a domain verified in Resend. The
          // onboarding@resend.dev fallback only delivers to the account
          // owner's own address — fine for a smoke test, useless in
          // production. Set LEAD_FROM_EMAIL before launch.
          from: process.env.LEAD_FROM_EMAIL?.trim() || "European Recovery Access <onboarding@resend.dev>",
          to: admissionsEmail,
          subject: `New ${lead.source === "assessment" ? "assessment" : "hero form"} lead`,
          text: formatLeadEmail(lead),
        }),
      });
      if (response.ok) return true;
      console.error("[lead] Resend delivery failed", { status: response.status });
      return false;
    } catch (error) {
      console.error("[lead] Resend delivery error", error instanceof Error ? error.message : "unknown error");
      return false;
    }
  }

  if (process.env.NODE_ENV === "development") {
    console.log("[lead] no delivery integration configured — redacted summary:", {
      source: lead.source,
      country: lead.country ?? "unset",
      concern: lead.concern ?? "unset",
      urgency: lead.urgency ?? "unset",
      hasPhone: Boolean(lead.phone),
      hasEmail: Boolean(lead.email),
    });
    return true;
  }

  console.error("[lead] no delivery integration configured (LEAD_WEBHOOK_URL / RESEND_API_KEY+ADMISSIONS_EMAIL)");
  return false;
}

function formatLeadEmail(lead: LeadInput): string {
  return [
    `Source: ${lead.source}`,
    `Name: ${lead.fullName}`,
    lead.phone ? `Phone: ${lead.phone}` : undefined,
    lead.email ? `Email: ${lead.email}` : undefined,
    lead.country ? `Country: ${lead.country}` : undefined,
    lead.patientAge ? `Patient age: ${lead.patientAge}` : undefined,
    lead.concern ? `Main concern: ${lead.concern}` : undefined,
    lead.urgency ? `Urgency: ${lead.urgency}` : undefined,
    lead.relationship ? `Relationship: ${lead.relationship}` : undefined,
    lead.callbackTime ? `Best time to call: ${lead.callbackTime}` : undefined,
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");
}
