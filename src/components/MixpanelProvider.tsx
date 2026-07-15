"use client";

import { useEffect, type ReactNode } from "react";
import { initMixpanel } from "@/lib/mixpanelClient";

export default function MixpanelProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    initMixpanel();
  }, []);

  return <>{children}</>;
}
