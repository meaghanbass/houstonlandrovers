import { NextResponse } from "next/server";
import { upsertAndSubscribeProfile } from "@/lib/klaviyo";
import type { KlaviyoSubscribePayload } from "@/lib/klaviyoTypes";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Partial<KlaviyoSubscribePayload>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const source = body.source;

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "A valid email is required." },
      { status: 400 }
    );
  }

  if (source !== "contact" && source !== "registration") {
    return NextResponse.json(
      { error: 'source must be "contact" or "registration".' },
      { status: 400 }
    );
  }

  try {
    await upsertAndSubscribeProfile({
      email,
      source,
      firstName: typeof body.firstName === "string" ? body.firstName : undefined,
      lastName: typeof body.lastName === "string" ? body.lastName : undefined,
      city: typeof body.city === "string" ? body.city : undefined,
      vehicle: typeof body.vehicle === "string" ? body.vehicle : undefined,
      instagram: typeof body.instagram === "string" ? body.instagram : undefined,
      message: typeof body.message === "string" ? body.message : undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[klaviyo/subscribe]", err);
    return NextResponse.json(
      { error: "Failed to subscribe profile in Klaviyo." },
      { status: 502 }
    );
  }
}
