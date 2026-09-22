"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import {
  syncCreatorsHashScroll,
  syncJobBoardFromHash,
} from "@/lib/landing-nav";
import { scrollToSection } from "@/lib/scroll-to-section";

/** Scroll na hash po navigaci (Next.js + plné reloady z app.js). */
export function LandingHashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (!id) return;

    if (pathname === "/") {
      syncJobBoardFromHash(pathname);
      if (id !== "job-board") scrollToSection(id);
      return;
    }

    syncCreatorsHashScroll();
  }, [pathname]);

  useEffect(() => {
    const onHashChange = () => {
      const id = window.location.hash.replace("#", "");
      if (id) scrollToSection(id);
      if (pathname === "/") syncJobBoardFromHash(pathname);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [pathname]);

  return null;
}
