import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

import { sectionAccentIcon, surface } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

type DashboardSectionLinkProps = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
};

export function DashboardSectionLink({
  href,
  title,
  description,
  icon: Icon,
  className,
}: DashboardSectionLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        surface,
        "group flex flex-col gap-4 p-6 transition-colors hover:border-white/[0.16]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <Icon className={sectionAccentIcon} strokeWidth={1.5} aria-hidden />
        <ArrowRight
          className="size-4 shrink-0 text-mist transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-cyan"
          aria-hidden
        />
      </div>
      <div>
        <h3 className="font-display text-base font-semibold text-white">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-200">{description}</p>
      </div>
    </Link>
  );
}
