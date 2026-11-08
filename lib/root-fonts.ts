import { JetBrains_Mono, Stack_Sans_Text } from "next/font/google";

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

/** Třídy na `<html>` v root layoutu a `global-error`. */
export const rootHtmlClassName = cn(
  "dark font-sans",
  stackSansText.variable,
  jetbrains.variable,
);

export const rootBodyClassName = "grain antialiased";
