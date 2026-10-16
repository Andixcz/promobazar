/** Barvy promobazar.cz pro e-maily (inline styly, bez Tailwind). */
export const emailColors = {
  void: "#08070d",
  panel: "#13111e",
  ink: "#0e0c17",
  foreground: "#f2f0fa",
  mist: "#a5a0be",
  cyan: "#00e5ff",
  violet: "#7c3aed",
  border: "rgba(255, 255, 255, 0.12)",
} as const;

export const emailFonts = {
  body: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  display:
    'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  mono: 'ui-monospace, "Cascadia Code", "Segoe UI Mono", monospace',
} as const;
