import { NextResponse } from "next/server";
import { createInviteEvent } from "@/lib/klaviyo";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;
const MAX_REQUEST_BYTES = 1_024;
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60 * 60 * 1_000;

type AttemptWindow = {
  count: number;
  resetsAt: number;
};

// Best-effort protection for each running server instance. Production should
// also enforce a distributed limit at the hosting/firewall layer.
const inviteAttempts = new Map<string, AttemptWindow>();

function clientIp(request: Request) {
  return (
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const current = inviteAttempts.get(ip);

  if (!current || current.resetsAt <= now) {
    inviteAttempts.set(ip, { count: 1, resetsAt: now + RATE_WINDOW_MS });
    return null;
  }

  if (current.count >= RATE_LIMIT) {
    return Math.max(1, Math.ceil((current.resetsAt - now) / 1_000));
  }

  current.count += 1;
  return null;
}

function registrationUrl(request: Request) {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (configuredSiteUrl) {
    try {
      return new URL("/events", configuredSiteUrl).toString();
    } catch {
      // Fall back to the request origin when the configured URL is invalid.
    }
  }

  return new URL("/events", request.url).toString();
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  }

  let body: { email?: unknown; website?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  // Honeypot fields should remain empty. Return success so bots do not retry.
  if (typeof body.website === "string" && body.website.trim()) {
    return NextResponse.json({ ok: true });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (
    !email ||
    email.length > MAX_EMAIL_LENGTH ||
    !EMAIL_RE.test(email)
  ) {
    return NextResponse.json(
      { error: "A valid email is required." },
      { status: 400 }
    );
  }

  const retryAfter = checkRateLimit(clientIp(request));
  if (retryAfter !== null) {
    return NextResponse.json(
      { error: "Too many invitations. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfter) },
      }
    );
  }

  try {
    await createInviteEvent({
      email,
      registrationUrl: registrationUrl(request),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[klaviyo/invite]", error);
    return NextResponse.json(
      { error: "We couldn't send the invitation. Please try again." },
      { status: 502 }
    );
  }
}
