import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Unbounded } from "next/font/google";
import "./globals.css";

const unbounded = Unbounded({
  subsets: ["latin", "latin-ext"],
  variable: "--font-unbounded",
  display: "swap",
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
      className={`${unbounded.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body className="grain antialiased">{children}</body>
    </html>
  );
}
