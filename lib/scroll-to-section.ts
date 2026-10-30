/** Plynulý scroll na kotvu na aktuální stránce. */
export function scrollToSection(id: string): void {
  if (!id) return;
  window.setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, 60);
}
