import { TEAMS } from "@/data/mock";
import { SectionHeader } from "@/components/ui-bits/SectionHeader";
import { Button } from "@/components/ui/button";
import { Trophy, Sticker, Goal, Edit, LogOut } from "lucide-react";

const activity = [
  { icon: Goal, text: "Acertaste el marcador de Argentina vs Uruguay (3-0)", time: "ayer", color: "text-primary" },
  { icon: Sticker, text: "Recibiste 3 stickers nuevos (BRA, FRA, ESP)", time: "hace 2 días", color: "text-primary" },
  { icon: Trophy, text: "Subiste al puesto #3 en 'Amigos del Azteca'", time: "hace 3 días", color: "text-warning" },
  { icon: Goal, text: "Predijiste empate en Brasil vs Colombia (1-1)", time: "hace 4 días", color: "text-primary" },
];

export default function Profile() {
  return (
    <div className="container mx-auto animate-fade-in space-y-8 px-4 py-6 md:py-10">
      {/* Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-hero p-6 md:p-10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
          <div className="grid h-24 w-24 place-items-center rounded-2xl bg-gradient-primary font-display text-4xl text-primary-foreground shadow-glow">
            AM
          </div>
          <div className="flex-1">
            <h1 className="font-display text-4xl tracking-wide">Andrés Mora</h1>
            <p className="text-muted-foreground">andres@mundialhub.app · Miembro desde abril 2026</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Stat label="Pollas" value="3" />
              <Stat label="Stickers" value="12/30" />
              <Stat label="Predicciones" value="48" />
              <Stat label="Aciertos" value="32" />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-border/70 bg-background/40">
              <Edit className="mr-1 h-4 w-4" /> Editar
            </Button>
            <Button variant="ghost" className="text-muted-foreground">
              <LogOut className="mr-1 h-4 w-4" /> Salir
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Preferences */}
        <section className="lg:col-span-1">
          <SectionHeader title="Mis preferencias" />
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Equipos favoritos</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {TEAMS.slice(0, 4).map((t) => (
                <span key={t.code} className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm">
                  <span>{t.flag}</span> {t.name}
                </span>
              ))}
            </div>

            <div className="mt-5 text-xs uppercase tracking-wider text-muted-foreground">Ciudades</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {["Ciudad de México", "Los Ángeles", "Toronto"].map((c) => (
                <span key={c} className="rounded-full bg-secondary px-3 py-1 text-sm">{c}</span>
              ))}
            </div>

            <div className="mt-5 text-xs uppercase tracking-wider text-muted-foreground">Notificaciones</div>
            <ul className="mt-2 space-y-1 text-sm">
              <li>Goles de mis equipos</li>
              <li>Inicio de partido</li>
              <li>Alineaciones</li>
              <li>Noticias y rumores</li>
            </ul>
          </div>
        </section>

        {/* Activity */}
        <section className="lg:col-span-2">
          <SectionHeader title="Historial de actividad" />
          <div className="space-y-3">
            {activity.map((a, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 shadow-card">
                <div className={`grid h-10 w-10 place-items-center rounded-lg bg-secondary ${a.color}`}>
                  <a.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{a.text}</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-background/40 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-display text-xl">{value}</div>
    </div>
  );
}
