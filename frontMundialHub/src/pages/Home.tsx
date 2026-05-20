import { MATCHES, NOTIFICATIONS } from "@/data/mock";
import { MatchCard } from "@/components/match/MatchCard";
import { StatCard } from "@/components/ui-bits/StatCard";
import { SectionHeader } from "@/components/ui-bits/SectionHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Trophy, Sticker, Flame, Bell, ChevronRight, Goal, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const live = MATCHES.filter((m) => m.status === "live");
const upcoming = MATCHES.filter((m) => m.status === "scheduled").slice(0, 4);
const recent = MATCHES.filter((m) => m.status === "finished").slice(0, 3);

const notifIcon = (t: string) =>
  t === "goal" ? Goal : t === "alert" ? AlertTriangle : t === "important" ? Flame : Info;

export default function Home() {
  return (
    <div className="container mx-auto animate-fade-in space-y-10 px-4 py-6 md:py-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-hero p-6 md:p-10">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <span className="live-dot" /> Tu hub mundialista
            </div>
            <h1 className="mt-4 font-display text-4xl leading-none tracking-wide md:text-6xl">
              Vive cada minuto del <span className="text-gradient-primary">Mundial 2026</span>
            </h1>
            <p className="mt-3 max-w-xl text-base text-muted-foreground">
              Sigue a tus equipos, gana tus pollas y completa el álbum digital. Todo en un solo lugar.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/agenda">
                <Button size="lg" className="bg-gradient-primary shadow-glow hover:opacity-95">
                  Ver mi agenda
                </Button>
              </Link>
              <Link to="/pollas">
                <Button size="lg" variant="outline" className="border-border/70 bg-background/40">
                  <Trophy className="mr-2 h-4 w-4" /> Entrar a pollas
                </Button>
              </Link>
            </div>
          </div>

          {live[0] && (
            <Link
              to={`/partido/${live[0].id}`}
              className="glass relative block rounded-2xl p-5 transition-transform hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between text-xs uppercase tracking-wider text-muted-foreground">
                <span>{live[0].stage}</span>
                <span className="live-dot font-semibold text-live">EN VIVO {live[0].minute}'</span>
              </div>
              <div className="mt-4 grid grid-cols-3 items-center">
                <div className="text-center">
                  <div className="text-5xl">{live[0].home.flag}</div>
                  <div className="mt-1 font-display text-lg">{live[0].home.code}</div>
                </div>
                <div className="text-center font-display text-5xl tabular-nums text-primary">
                  {live[0].homeScore}-{live[0].awayScore}
                </div>
                <div className="text-center">
                  <div className="text-5xl">{live[0].away.flag}</div>
                  <div className="mt-1 font-display text-lg">{live[0].away.code}</div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>{live[0].stadium}</span>
                <span className="font-semibold text-primary">Ver en vivo →</span>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Partidos hoy" value="3" hint="2 importantes" icon={<Flame className="h-5 w-5" />} accent />
        <StatCard label="Mi ranking" value="#3" hint="Amigos del Azteca" icon={<Trophy className="h-5 w-5" />} />
        <StatCard label="Stickers" value="12/30" hint="3 repetidos" icon={<Sticker className="h-5 w-5" />} />
        <StatCard label="Notificaciones" value="5" hint="2 sin leer" icon={<Bell className="h-5 w-5" />} />
      </section>

      {/* Upcoming */}
      <section>
        <SectionHeader
          title="Próximos partidos"
          subtitle="Según tus equipos y ciudades favoritas"
          action={
            <Link to="/agenda" className="text-sm font-semibold text-primary hover:underline">
              Ver todo <ChevronRight className="inline h-4 w-4" />
            </Link>
          }
        />
        <div className="grid gap-4 md:grid-cols-2">
          {upcoming.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      </section>

      {/* Two columns */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionHeader title="Resultados recientes" />
          <div className="space-y-4">
            {recent.map((m) => (
              <MatchCard key={m.id} match={m} compact />
            ))}
          </div>
        </div>

        <div>
          <SectionHeader
            title="Feed"
            action={
              <Link to="/notificaciones" className="text-sm font-semibold text-primary hover:underline">
                Ver todo
              </Link>
            }
          />
          <div className="space-y-3">
            {NOTIFICATIONS.slice(0, 5).map((n) => {
              const Icon = notifIcon(n.type);
              return (
                <div
                  key={n.id}
                  className="flex gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-card"
                >
                  <div
                    className={cn(
                      "grid h-10 w-10 shrink-0 place-items-center rounded-lg",
                      n.type === "goal" && "bg-primary/15 text-primary",
                      n.type === "alert" && "bg-warning/15 text-warning",
                      n.type === "important" && "bg-primary/15 text-primary",
                      n.type === "info" && "bg-secondary text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold leading-tight">{n.title}</div>
                    <div className="line-clamp-2 text-sm text-muted-foreground">{n.body}</div>
                    <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                      {n.time}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick access */}
      <section className="grid gap-4 md:grid-cols-2">
        <Link
          to="/pollas"
          className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-card p-6 transition-all hover:border-primary/50"
        >
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/15 blur-2xl transition-opacity group-hover:opacity-80" />
          <Trophy className="h-7 w-7 text-primary" />
          <h3 className="mt-3 font-display text-2xl">Pollas y predicciones</h3>
          <p className="text-sm text-muted-foreground">Vence a tus amigos con tus marcadores.</p>
          <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary">
            Entrar <ChevronRight className="h-4 w-4" />
          </span>
        </Link>
        <Link
          to="/album"
          className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-card p-6 transition-all hover:border-primary/50"
        >
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
          <Sticker className="h-7 w-7 text-primary" />
          <h3 className="mt-3 font-display text-2xl">Álbum digital</h3>
          <p className="text-sm text-muted-foreground">Colecciona, pega e intercambia stickers.</p>
          <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary">
            Abrir álbum <ChevronRight className="h-4 w-4" />
          </span>
        </Link>
      </section>
    </div>
  );
}
