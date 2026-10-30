import type { CreatorPackageStatus } from "@/lib/db/schema";

export function packageSaveSuccessMessage(
  mode: "create" | "edit",
  previousStatus: CreatorPackageStatus,
  nextStatus: CreatorPackageStatus,
): string {
  if (mode === "create") {
    return "Koncept vytvořen. Doplň ukázky a až budeš ready, publikuj.";
  }
  if (nextStatus === "private" && previousStatus !== "private") {
    return "Balíček deaktivován. V tržišti ho zákazníci neuvidí.";
  }
  if (nextStatus === "published" && previousStatus === "private") {
    return "Balíček je znovu aktivní v tržišti.";
  }
  if (nextStatus === "published" && previousStatus === "draft") {
    return "Balíček publikován. Zákazníci ho teď mohou objednat.";
  }
  if (nextStatus === "draft") {
    return "Koncept uložen.";
  }
  return "Změny uloženy.";
}
