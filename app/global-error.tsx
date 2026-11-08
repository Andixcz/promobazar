"use client";

import { useEffect } from "react";
import Link from "next/link";

import { HttpStatusView } from "@/components/shared/http-status-view";
import { BrandMark } from "@/components/ui/brand-mark";
import { LANDING_FIRMS_PATH } from "@/lib/landing-routes";
import { rootBodyClassName, rootHtmlClassName } from "@/lib/root-fonts";

import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="cs" className={rootHtmlClassName}>
      <body className={rootBodyClassName}>
        <title>Chyba | Promobazar.cz</title>
        <header className="border-b border-white/[0.09] px-5 py-4 md:px-8">
          <Link
            href={LANDING_FIRMS_PATH}
            className="inline-flex text-white outline-none focus-visible:ring-3 focus-visible:ring-cyan/35"
          >
            <BrandMark />
          </Link>
        </header>
        <HttpStatusView
          code="500"
          codeDisplay="digits"
          title="Stránku se nepodařilo načíst"
          description="Zkus obnovit. Když to nepomůže, vrať se na úvod."
          onRetry={reset}
          actions={[{ href: LANDING_FIRMS_PATH, label: "Úvod" }]}
        />
      </body>
    </html>
  );
}
