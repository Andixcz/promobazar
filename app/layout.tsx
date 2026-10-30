import type { Metadata } from "next";
import { JetBrains_Mono, Stack_Sans_Text } from "next/font/google";
import "./globals.css";
import { rootMetadataTitle } from "@/lib/site-metadata";
import { cn } from "@/lib/utils";

const stackSansText = Stack_Sans_Text({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "600"],
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: rootMetadataTitle,
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
      data-scroll-behavior="smooth"
      className={cn(
        "dark font-sans",
        stackSansText.variable,
        jetbrains.variable,
      )}
    >
      <body className="grain antialiased">{children}</body>
    </html>
  );
}
