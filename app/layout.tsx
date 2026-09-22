import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Strichpunkt_Sans, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const strichpunktSans = Strichpunkt_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-strichpunkt-sans",
  display: "swap",
  // Next.js has no size-adjust metrics for this font yet (build warning otherwise).
  adjustFontFallback: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "promobazar.cz — Tržiště influencerů a UGC tvůrců. Vyber si promo, nastav rozpočet, získej prodeje.",
  description:
    "Tržiště influencerů a UGC tvůrců pro firmy a tvůrce. Vyber promo, nastav rozpočet a získej prodeje.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="cs"
      className={cn(
        "dark font-sans",
        strichpunktSans.variable,
        inter.variable,
        jetbrains.variable,
        geist.variable,
      )}
    >
      <body className="grain antialiased">{children}</body>
    </html>
  );
}
