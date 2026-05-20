import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon,
  accent,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  icon?: ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/60 bg-gradient-card p-5 shadow-card",
        accent && "border-primary/40"
      )}
    >
      {accent && <div className="absolute inset-x-0 top-0 h-px bg-gradient-primary" />}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
          <div className="mt-2 font-display text-3xl">{value}</div>
          {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
        </div>
        {icon && (
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-secondary text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
