import { Link } from "react-router-dom";
import { Match } from "@/data/mock";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

function fmt(date: string) {
  const d = new Date(date);
  return d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
}

export function StatusPill({ status, minute }: { status: Match["status"]; minute?: number }) {
  if (status === "live")
    return (
      <span className="live-dot inline-flex items-center rounded-full bg-live/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-live">
        En vivo {minute ? `· ${minute}'` : ""}
      </span>
    );
  if (status === "finished")
    return (
      <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Finalizado
      </span>
    );
  return (
    <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-foreground/80">
      Programado
    </span>
  );
}

export function MatchCard({ match, compact = false }: { match: Match; compact?: boolean }) {
  const isLive = match.status === "live";
  const showScore = match.status !== "scheduled";

  return (
    <Link
      to={`/partido/${match.id}`}
      className={cn(
        "group block overflow-hidden rounded-xl border border-border/60 bg-gradient-card shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-elegant",
        match.important && "ring-1 ring-primary/20"
      )}
    >
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2 text-xs text-muted-foreground">
        <span className="uppercase tracking-wider">{match.stage}</span>
        <StatusPill status={match.status} minute={match.minute} />
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-5">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{match.home.flag}</span>
          <div className="min-w-0">
            <div className="truncate font-display text-lg leading-none">{match.home.name}</div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Local</div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          {showScore ? (
            <div className={cn("font-display text-3xl tabular-nums", isLive && "text-primary")}>
              {match.homeScore} <span className="opacity-40">·</span> {match.awayScore}
            </div>
          ) : (
            <div className="font-display text-2xl text-foreground">{fmt(match.date)}</div>
          )}
          {!compact && (
            <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {new Date(match.date).toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 text-right">
          <div className="min-w-0">
            <div className="truncate font-display text-lg leading-none">{match.away.name}</div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Visitante</div>
          </div>
          <span className="text-3xl">{match.away.flag}</span>
        </div>
      </div>

      {!compact && (
        <div className="flex items-center justify-between border-t border-border/50 bg-background/40 px-4 py-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {match.stadium} · {match.city}
          </span>
          <span className="font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
            Ver detalles →
          </span>
        </div>
      )}
    </Link>
  );
}
