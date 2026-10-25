"use client";

import { useEffect, useRef } from "react";

import { authClient } from "@/lib/auth-client";
import { invokeAppGlobal } from "@/lib/app-global";

/** Po přihlášení přes React synchronizuje stav do `public/app.js` (gating na Pro tvůrce). */
export function AppSessionSync() {
  const { data: session, isPending } = authClient.useSession();
  const previousUserId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (isPending) return;

    const userId = session?.user?.id;
    if (userId) {
      invokeAppGlobal("restoreLandingSession");
    } else if (previousUserId.current) {
      invokeAppGlobal("handleLogout");
    }
    previousUserId.current = userId;
  }, [isPending, session?.user?.id]);

  return null;
}
