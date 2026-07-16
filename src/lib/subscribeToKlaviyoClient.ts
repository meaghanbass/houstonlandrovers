import type { KlaviyoSubscribePayload } from "@/lib/klaviyoTypes";

/**
 * Best-effort client call — Formspree remains the source of truth for UX.
 * Failures are logged and never thrown to the form submit path.
 */
export async function subscribeToKlaviyoClient(
  payload: KlaviyoSubscribePayload
) {
  try {
    const res = await fetch("/api/klaviyo/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error(
        "[klaviyo] subscribe request failed:",
        res.status,
        await res.text().catch(() => "")
      );
    }
  } catch (err) {
    console.error("[klaviyo] subscribe request error:", err);
  }
}
