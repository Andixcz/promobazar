"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { syncCreatorsHashScroll } from "@/lib/landing-nav";
import { scrollToSection } from "@/lib/scroll-to-section";

/** Scroll na hash po navigaci (App Router). */
export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const id = window.location.hash.replace("#", "");
    if (!id) return;

    if (pathname === "/") {
      scrollToSection(id);
      return;
    }

    syncCreatorsHashScroll();
  }, [pathname]);

  useEffect(() => {
    const onHashChange = () => {
      const id = window.location.hash.replace("#", "");
      if (id) scrollToSection(id);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [pathname]);

  return null;
}

/** @deprecated Use `HashScroll`. */
export const LandingHashScroll = HashScroll;
