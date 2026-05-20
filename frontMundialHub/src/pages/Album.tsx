import { useMemo, useState } from "react";
import { STICKERS, TEAMS } from "@/data/mock";
import { SectionHeader } from "@/components/ui-bits/SectionHeader";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Repeat, Sparkles } from "lucide-react";
import { toast } from "sonner";

const teamCodes = Array.from(new Set(STICKERS.map((s) => s.team)));

export default function Album() {
  const [team, setTeam] = useState<string>("ALL");
  const filtered = useMemo(
    () => (team === "ALL" ? STICKERS : STICKERS.filter((s) => s.team === team)),
    [team]
  );

  const total = STICKERS.length;
  const owned = STICKERS.filter((s) => s.owned > 0).length;
  const repeated = STICKERS.filter((s) => s.owned > 1).length;
  const progress = Math.round((owned / total) * 100);

  return (
    <div className="container mx-auto animate-fade-in space-y-8 px-4 py-6 md:py-10">
      <SectionHeader title="Álbum digital" subtitle="Colecciona stickers de jugadores y selecciones" />

      {/* Progress hero */}
      <section className="grid gap-4 rounded-2xl border border-border/60 bg-gradient-card p-6 shadow-card md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Tu colección</div>
          <div className="mt-1 font-display text-4xl">
            {owned} <span className="text-muted-foreground">/ {total}</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-gradient-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">{progress}% completado · {repeated} láminas repetidas</div>
        </div>
        <Button className="bg-gradient-primary shadow-glow">
          <Repeat className="mr-2 h-4 w-4" /> Intercambiar repetidas
        </Button>
      </section>

      {/* Team filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <FilterChip active={team === "ALL"} onClick={() => setTeam("ALL")} label="Todos" />
        {teamCodes.map((code) => {
          const t = TEAMS.find((x) => x.code === code)!;
          return (
            <FilterChip
              key={code}
              active={team === code}
              onClick={() => setTeam(code)}
              label={`${t.flag} ${t.name}`}
            />
          );
        })}
      </div>

      {/* Stickers grid */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {filtered.map((s) => {
          const team = TEAMS.find((t) => t.code === s.team)!;
          const missing = s.owned === 0;
          const isRepeat = s.owned > 1;
          return (
            <div
              key={s.id}
              onClick={() => !missing && toast.info(`${s.player} — ${isRepeat ? `${s.owned} copias` : "única"}`)}
              className={cn(
                "group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-xl border p-3 transition-all",
                missing
                  ? "border-dashed border-border/60 bg-secondary/40 opacity-60"
                  : "border-border/60 bg-gradient-card shadow-card hover:-translate-y-0.5 hover:border-primary/50",
                s.shiny && !missing && "ring-1 ring-primary/40"
              )}
            >
              {s.shiny && !missing && (
                <Sparkles className="absolute right-2 top-2 h-4 w-4 text-primary" />
              )}
              {isRepeat && (
                <span className="absolute left-2 top-2 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                  ×{s.owned}
                </span>
              )}
              <div className="flex h-full flex-col">
                <div className="grid flex-1 place-items-center text-5xl">{missing ? "?" : team.flag}</div>
                <div className="border-t border-border/40 pt-2">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    #{String(s.number).padStart(2, "0")} · {team.code}
                  </div>
                  <div className="truncate font-display text-sm leading-tight">
                    {missing ? "Sin obtener" : s.player}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

function FilterChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-glow"
          : "border-border/60 bg-secondary text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}
