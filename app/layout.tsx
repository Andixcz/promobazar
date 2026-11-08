import type { Metadata } from "next";
import "./globals.css";
import { rootBodyClassName, rootHtmlClassName } from "@/lib/root-fonts";
import { rootMetadataTitle } from "@/lib/site-metadata";

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
      className={rootHtmlClassName}
    >
      <body className={rootBodyClassName}>{children}</body>
    </html>
  );
}
