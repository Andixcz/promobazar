import { packageStatusLabel } from "@/lib/dashboard/package-display";
import type { CreatorPackageStatus } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

function statusTone(status: CreatorPackageStatus) {
  if (status === "published") {
    return "border-cyan/30 bg-cyan/[0.08] text-cyan";
  }
  if (status === "private") {
    return "border-white/[0.12] bg-white/[0.05] text-zinc-300";
  }
  return "border-white/[0.1] bg-white/[0.04] text-mist";
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
        "inline-flex items-center rounded-sm border px-2 py-0.5 text-[11px] font-medium leading-none",
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
