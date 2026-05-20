import { useMemo, useState } from "react";
import { MATCHES, CITIES } from "@/data/mock";
import { MatchCard } from "@/components/match/MatchCard";
import { SectionHeader } from "@/components/ui-bits/SectionHeader";
import { cn } from "@/lib/utils";
import { Star, MapPin } from "lucide-react";

function groupByDay(matches: typeof MATCHES) {
  const map = new Map<string, typeof MATCHES>();
  matches.forEach((m) => {
    const key = new Date(m.date).toISOString().slice(0, 10);
    if (!map.has(key)) map.set(key, [] as any);
    map.get(key)!.push(m);
  });
  return Array.from(map.entries()).sort();
}

export default function Agenda() {
  const [city, setCity] = useState<string>("Todas");
  const [onlyImportant, setOnlyImportant] = useState(false);

  const filtered = useMemo(
    () =>
      MATCHES.filter((m) => (city === "Todas" || m.city === city) && (!onlyImportant || m.important)),
    [city, onlyImportant]
  );

  const days = groupByDay(filtered);

  return (
    <div className="container mx-auto animate-fade-in space-y-8 px-4 py-6 md:py-10">
      <SectionHeader title="Agenda personal" subtitle="Tu calendario mundialista por día y ciudad" />

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {["Todas", ...CITIES.map((c) => c.name)].map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
                city === c
                  ? "border-primary bg-primary text-primary-foreground shadow-glow"
                  : "border-border/60 bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              <MapPin className="mr-1 inline h-3 w-3" />
              {c}
            </button>
          ))}
        </div>
        <button
          onClick={() => setOnlyImportant(!onlyImportant)}
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors",
            onlyImportant ? "border-primary bg-primary/15 text-primary" : "border-border/60 text-muted-foreground"
          )}
        >
          <Star className="h-3 w-3" /> Solo destacados
        </button>
      </div>

      {/* Days */}
      {days.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-8">
          {days.map(([day, list]) => {
            const d = new Date(day);
            return (
              <section key={day}>
                <div className="mb-3 flex items-baseline gap-3">
                  <div className="font-display text-3xl tracking-wide">
                    {d.toLocaleDateString("es-MX", { day: "numeric" })}
                  </div>
                  <div>
                    <div className="font-display text-lg uppercase tracking-wider">
                      {d.toLocaleDateString("es-MX", { weekday: "long" })}
                    </div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      {d.toLocaleDateString("es-MX", { month: "long", year: "numeric" })}
                    </div>
                  </div>
                  <div className="ml-auto text-xs text-muted-foreground">{list.length} partidos</div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {list.map((m) => (
                    <MatchCard key={m.id} match={m} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-secondary text-primary">
        <Star className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-display text-2xl">Sin partidos en este filtro</h3>
      <p className="text-sm text-muted-foreground">Prueba cambiando la ciudad o quitar los destacados.</p>
    </div>
  );
}
