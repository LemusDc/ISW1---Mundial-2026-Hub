import { useParams, Link } from "react-router-dom";
import { MATCHES } from "@/data/mock";
import { StatusPill } from "@/components/match/MatchCard";
import { ArrowLeft, MapPin, Clock, Goal, Square, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MatchView() {
  const { id } = useParams();
  const match = MATCHES.find((m) => m.id === id);

  if (!match) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-4xl">Partido no encontrado</h1>
        <Link to="/agenda" className="mt-4 inline-block text-primary hover:underline">
          ← Volver a la agenda
        </Link>
      </div>
    );
  }

  const stats = [
    { l: "Posesión", h: 58, a: 42 },
    { l: "Tiros", h: 12, a: 7 },
    { l: "Tiros a puerta", h: 5, a: 3 },
    { l: "Córners", h: 6, a: 2 },
    { l: "Faltas", h: 9, a: 14 },
  ];

  return (
    <div className="container mx-auto animate-fade-in space-y-8 px-4 py-6 md:py-10">
      <Link to="/agenda" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Volver a la agenda
      </Link>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-hero p-6 md:p-10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative">
          <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground">
            <span>{match.stage}</span>
            <StatusPill status={match.status} minute={match.minute} />
          </div>

          <div className="mt-6 grid grid-cols-3 items-center gap-4">
            <div className="text-center">
              <div className="text-6xl md:text-7xl">{match.home.flag}</div>
              <div className="mt-2 font-display text-2xl tracking-wide">{match.home.name}</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Grupo {match.home.group}</div>
            </div>

            <div className="text-center">
              {match.status !== "scheduled" ? (
                <div className="font-display text-6xl tabular-nums text-primary md:text-8xl">
                  {match.homeScore}<span className="opacity-30 mx-2">·</span>{match.awayScore}
                </div>
              ) : (
                <div>
                  <div className="font-display text-5xl">
                    {new Date(match.date).toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                    {new Date(match.date).toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })}
                  </div>
                </div>
              )}
            </div>

            <div className="text-center">
              <div className="text-6xl md:text-7xl">{match.away.flag}</div>
              <div className="mt-2 font-display text-2xl tracking-wide">{match.away.name}</div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Grupo {match.away.group}</div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {match.stadium} · {match.city}</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {new Date(match.date).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" })}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button className="bg-gradient-primary shadow-glow">
              <Bell className="mr-2 h-4 w-4" /> Activar alertas
            </Button>
            <Link to="/pollas">
              <Button variant="outline" className="border-border/70 bg-background/40">Hacer mi predicción</Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Events timeline */}
        <section className="lg:col-span-2 rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <h3 className="font-display text-2xl tracking-wide">Eventos del partido</h3>
          {match.events && match.events.length > 0 ? (
            <ol className="mt-4 space-y-3">
              {match.events.map((e, i) => {
                const Icon = e.type === "goal" ? Goal : Square;
                const team = e.team === match.home.code ? match.home : match.away;
                return (
                  <li key={i} className="flex items-center gap-3 rounded-xl border border-border/50 bg-secondary/60 p-3">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 font-display text-lg text-primary">
                      {e.minute}'
                    </div>
                    <div className="text-2xl">{team.flag}</div>
                    <Icon className={`h-4 w-4 ${e.type === "goal" ? "text-primary" : e.type === "yellow" ? "text-warning" : "text-destructive"}`} />
                    <div className="min-w-0">
                      <div className="font-semibold">
                        {e.type === "goal" ? "Gol" : e.type === "yellow" ? "Tarjeta amarilla" : e.type === "red" ? "Tarjeta roja" : e.type.toUpperCase()}
                      </div>
                      <div className="text-sm text-muted-foreground">{e.player} ({team.name})</div>
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-border bg-background/30 p-8 text-center text-sm text-muted-foreground">
              {match.status === "scheduled"
                ? "Los eventos aparecerán cuando inicie el partido."
                : "Sin eventos registrados."}
            </div>
          )}
        </section>

        {/* Stats */}
        <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <h3 className="font-display text-2xl tracking-wide">Estadísticas</h3>
          <div className="mt-4 space-y-4">
            {stats.map((s) => {
              const total = s.h + s.a || 1;
              const hp = (s.h / total) * 100;
              return (
                <div key={s.l}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-semibold tabular-nums">{s.h}</span>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">{s.l}</span>
                    <span className="font-semibold tabular-nums">{s.a}</span>
                  </div>
                  <div className="flex h-2 overflow-hidden rounded-full bg-secondary">
                    <div className="bg-primary" style={{ width: `${hp}%` }} />
                    <div className="bg-muted-foreground/30" style={{ width: `${100 - hp}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
