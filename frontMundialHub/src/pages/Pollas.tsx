import { useState } from "react";
import { POOLS, RANKING, MATCHES } from "@/data/mock";
import { SectionHeader } from "@/components/ui-bits/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trophy, Users, Plus, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Pollas() {
  const [picks, setPicks] = useState<Record<string, { h: string; a: string }>>({});
  const open = MATCHES.filter((m) => m.status === "scheduled").slice(0, 4);

  return (
    <div className="container mx-auto animate-fade-in space-y-10 px-4 py-6 md:py-10">
      <SectionHeader
        title="Pollas y predicciones"
        subtitle="Únete a grupos, predice marcadores y sube en el ranking"
        action={
          <Button className="bg-gradient-primary shadow-glow">
            <Plus className="mr-1 h-4 w-4" /> Crear polla
          </Button>
        }
      />

      {/* My pools */}
      <section className="grid gap-4 md:grid-cols-3">
        {POOLS.map((p) => (
          <div
            key={p.id}
            className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/50"
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
            <div className="flex items-center justify-between">
              <Trophy className="h-6 w-6 text-primary" />
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                <Users className="mr-1 inline h-3 w-3" /> {p.members}
              </span>
            </div>
            <h3 className="mt-3 font-display text-2xl">{p.name}</h3>
            <div className="mt-1 text-xs text-muted-foreground">Premio: {p.prize}</div>

            <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-background/40 p-3">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Posición</div>
                <div className="font-display text-2xl">#{p.myRank}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Mis pts</div>
                <div className="font-display text-2xl text-primary">{p.myPoints}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Líder</div>
                <div className="font-display text-2xl">{p.topPoints}</div>
              </div>
            </div>
          </div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Predictions */}
        <section className="lg:col-span-2">
          <SectionHeader title="Tus predicciones" subtitle="Marcadores para los próximos partidos" />
          <div className="space-y-3">
            {open.map((m) => {
              const pick = picks[m.id] || { h: "", a: "" };
              return (
                <div key={m.id} className="rounded-xl border border-border/60 bg-card p-4 shadow-card">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="uppercase tracking-wider">{m.stage}</span>
                    <span>
                      {new Date(m.date).toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" })}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{m.home.flag}</span>
                      <div className="font-display text-lg">{m.home.name}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        value={pick.h}
                        onChange={(e) => setPicks({ ...picks, [m.id]: { ...pick, h: e.target.value } })}
                        className="h-12 w-14 bg-secondary text-center font-display text-2xl"
                        placeholder="-"
                      />
                      <span className="font-display text-2xl text-muted-foreground">:</span>
                      <Input
                        type="number"
                        min={0}
                        value={pick.a}
                        onChange={(e) => setPicks({ ...picks, [m.id]: { ...pick, a: e.target.value } })}
                        className="h-12 w-14 bg-secondary text-center font-display text-2xl"
                        placeholder="-"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-3 text-right">
                      <div className="font-display text-lg">{m.away.name}</div>
                      <span className="text-3xl">{m.away.flag}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            <Button
              onClick={() => toast.success("Predicciones guardadas")}
              className="w-full bg-gradient-primary shadow-glow"
            >
              Guardar predicciones
            </Button>
          </div>
        </section>

        {/* Ranking */}
        <section>
          <SectionHeader title="Ranking" subtitle="Amigos del Azteca" />
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card">
            {RANKING.map((r, i) => (
              <div
                key={r.name}
                className={cn(
                  "flex items-center gap-3 border-b border-border/40 px-4 py-3 last:border-0",
                  r.isMe && "bg-primary/10"
                )}
              >
                <div
                  className={cn(
                    "grid h-8 w-8 place-items-center rounded-lg font-display text-sm",
                    i === 0 ? "bg-gradient-primary text-primary-foreground" : "bg-secondary"
                  )}
                >
                  {i === 0 ? <Crown className="h-4 w-4" /> : i + 1}
                </div>
                <div className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-xs font-bold">
                  {r.avatar}
                </div>
                <div className="flex-1 font-semibold">{r.name}</div>
                <div className="font-display text-xl tabular-nums text-primary">{r.points}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
