import { packageStatusLabel } from "@/lib/dashboard/package-display";
import type { CreatorPackageStatus } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

function statusTone(status: CreatorPackageStatus) {
  if (status === "published") {
    return "border-transparent bg-cyan text-void";
  }
  if (status === "private") {
    return "border-white/[0.14] bg-void/90 text-white/90 backdrop-blur-[6px]";
  }
  return "border-white/[0.12] bg-void/90 text-zinc-200 backdrop-blur-[6px]";
}

export function PackageStatusBadge({
  status,
  className,
}: {
  status: CreatorPackageStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-1 text-[11px] font-medium leading-none",
        statusTone(status),
        className,
      )}
    >
      {packageStatusLabel(status)}
    </span>
  );
}

export function packageStatusDotClass(status: CreatorPackageStatus) {
  if (status === "published") return "bg-cyan";
  if (status === "private") return "bg-white/35";
  return "bg-white/25";
}

export function packageStatusHeadline(status: CreatorPackageStatus) {
  if (status === "published") return "Aktivní v tržišti";
  if (status === "private") return "Neaktivní (soukromý)";
  return "Koncept";
}

export function packageStatusDetail(status: CreatorPackageStatus) {
  if (status === "published") {
    return "Zákazníci balíček uvidí a můžou ho objednat.";
  }
  if (status === "private") {
    return "Balíček není v tržišti. Obsah si uložíš a kdykoli ho znovu aktivuješ.";
  }
  return "Zatím ho vidíš jen ty. Po kontrole balíček publikuj.";
}

export function packagePublicPreviewQuery(
  status: CreatorPackageStatus,
): { preview?: boolean } {
  if (status === "draft") return { preview: true };
  return {};
}
