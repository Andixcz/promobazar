import { surface } from "@/lib/ui-surfaces";
import { cn } from "@/lib/utils";

type DashboardStatProps = {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
};

export function DashboardStat({ label, value, hint, accent }: DashboardStatProps) {
  return (
    <div className={cn(surface, "p-5 md:p-6")}>
      <p className="font-body text-[11px] font-medium uppercase tracking-wide text-mist">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 font-display text-3xl font-extrabold tabular-nums",
          accent ? "text-cyan" : "text-white",
        )}
      >
        {value}
      </p>
      {hint ? <p className="mt-2 text-xs leading-relaxed text-zinc-200">{hint}</p> : null}
    </div>
  );
}
