import { useState } from "react";
import { NOTIFICATIONS } from "@/data/mock";
import { SectionHeader } from "@/components/ui-bits/SectionHeader";
import { Goal, AlertTriangle, Info, Flame, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const filters = [
  { k: "all", label: "Todas" },
  { k: "important", label: "Importantes" },
  { k: "goal", label: "Goles" },
  { k: "alert", label: "Alertas" },
  { k: "info", label: "Info" },
];

const icon = (t: string) => (t === "goal" ? Goal : t === "alert" ? AlertTriangle : t === "important" ? Flame : Info);

export default function Notifications() {
  const [tab, setTab] = useState("all");
  const list = NOTIFICATIONS.filter((n) => tab === "all" || n.type === tab);

  return (
    <div className="container mx-auto animate-fade-in space-y-6 px-4 py-6 md:py-10">
      <SectionHeader
        title="Notificaciones"
        subtitle="Lo último de tus equipos y partidos"
        action={
          <button className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            <Check className="h-4 w-4" /> Marcar todo como leído
          </button>
        }
      />

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f.k}
            onClick={() => setTab(f.k)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
              tab === f.k
                ? "border-primary bg-primary text-primary-foreground shadow-glow"
                : "border-border/60 bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
          <h3 className="font-display text-2xl">Sin notificaciones</h3>
          <p className="text-sm text-muted-foreground">Te avisaremos cuando haya algo nuevo.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((n) => {
            const Icon = icon(n.type);
            return (
              <div
                key={n.id}
                className={cn(
                  "flex gap-3 rounded-xl border p-4 transition-colors",
                  n.read ? "border-border/40 bg-card/60" : "border-primary/30 bg-card shadow-card"
                )}
              >
                <div
                  className={cn(
                    "grid h-12 w-12 shrink-0 place-items-center rounded-xl",
                    n.type === "goal" && "bg-primary/15 text-primary",
                    n.type === "alert" && "bg-warning/15 text-warning",
                    n.type === "important" && "bg-primary/15 text-primary",
                    n.type === "info" && "bg-secondary text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{n.title}</div>
                    {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
                  </div>
                  <div className="text-sm text-muted-foreground">{n.body}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{n.time}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
