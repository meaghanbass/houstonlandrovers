import type { KlaviyoSubscribePayload } from "@/lib/klaviyoTypes";

const KLAVIYO_API_BASE = "https://a.klaviyo.com/api";
const KLAVIYO_REVISION = "2025-07-15";

function klaviyoHeaders(apiKey: string) {
  return {
    Authorization: `Klaviyo-API-Key ${apiKey}`,
    accept: "application/json",
    "content-type": "application/json",
    revision: KLAVIYO_REVISION,
  };
}

async function readKlaviyoError(res: Response) {
  try {
    const body = await res.json();
    return JSON.stringify(body);
  } catch {
    return await res.text().catch(() => res.statusText);
  }
}

/** Upsert profile properties, then subscribe the email to the configured list. */
export async function upsertAndSubscribeProfile(
  payload: KlaviyoSubscribePayload
) {
  const apiKey = process.env.KLAVIYO_PRIVATE_API_KEY;
  const listId = process.env.KLAVIYO_LIST_ID;

  if (!apiKey || !listId) {
    throw new Error(
      "Missing KLAVIYO_PRIVATE_API_KEY or KLAVIYO_LIST_ID environment variables."
    );
  }

  const email = payload.email.trim().toLowerCase();
  const properties: Record<string, string> = {
    form_source: payload.source,
  };
  if (payload.vehicle?.trim()) properties.vehicle = payload.vehicle.trim();
  if (payload.instagram?.trim())
    properties.instagram = payload.instagram.trim();
  if (payload.message?.trim()) properties.contact_message = payload.message.trim();

  const attributes: Record<string, unknown> = {
    email,
    properties,
  };
  if (payload.firstName?.trim()) attributes.first_name = payload.firstName.trim();
  if (payload.lastName?.trim()) attributes.last_name = payload.lastName.trim();
  if (payload.city?.trim()) {
    attributes.location = { city: payload.city.trim() };
  }

  const importRes = await fetch(`${KLAVIYO_API_BASE}/profile-import/`, {
    method: "POST",
    headers: klaviyoHeaders(apiKey),
    body: JSON.stringify({
      data: {
        type: "profile",
        attributes,
      },
    }),
  });

  if (!importRes.ok) {
    throw new Error(
      `Klaviyo profile-import failed (${importRes.status}): ${await readKlaviyoError(importRes)}`
    );
  }

  const subscribeRes = await fetch(
    `${KLAVIYO_API_BASE}/profile-subscription-bulk-create-jobs/`,
    {
      method: "POST",
      headers: klaviyoHeaders(apiKey),
      body: JSON.stringify({
        data: {
          type: "profile-subscription-bulk-create-job",
          attributes: {
            custom_source: `houstonlandrovers_${payload.source}`,
            profiles: {
              data: [
                {
                  type: "profile",
                  attributes: {
                    email,
                    subscriptions: {
                      email: {
                        marketing: {
                          consent: "SUBSCRIBED",
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
          relationships: {
            list: {
              data: {
                type: "list",
                id: listId,
              },
            },
          },
        },
      }),
    }
  );

  // 202 Accepted is the usual success response for async subscribe jobs
  if (!subscribeRes.ok && subscribeRes.status !== 202) {
    throw new Error(
      `Klaviyo subscribe failed (${subscribeRes.status}): ${await readKlaviyoError(subscribeRes)}`
    );
  }
}
