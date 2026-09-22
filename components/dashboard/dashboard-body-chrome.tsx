"use client";

import { useEffect } from "react";

const BODY_CLASS = "dashboard-app";

/** Na /dashboard vypne landing gradienty a grain na body. */
export function DashboardBodyChrome() {
  useEffect(() => {
    document.body.classList.add(BODY_CLASS);
    return () => document.body.classList.remove(BODY_CLASS);
  }, []);
  return null;
}
