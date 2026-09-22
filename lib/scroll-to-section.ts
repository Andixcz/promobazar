/** Plynulý scroll na kotvu na aktuální stránce (nahrazuje legacy scrollToId z app.js v Reactu). */
export function scrollToSection(id: string): void {
  if (!id) return;
  window.setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, 60);
}
