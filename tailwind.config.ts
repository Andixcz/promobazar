import type { Config } from "tailwindcss";

/** Barvy a fonty jsou v app/globals.css (@theme). */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/app.js",
  ],
};

export default config;
