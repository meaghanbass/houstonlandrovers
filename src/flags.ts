import { flag } from "flags/next";
import { vercelAdapter } from "@flags-sdk/vercel";

export const eventsAlert = flag<boolean>({
  key: "events-alert",
  adapter: vercelAdapter(),
});
