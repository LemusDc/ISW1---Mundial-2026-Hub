import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TEAMS, CITIES } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Check, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

const steps = ["Equipos", "Ciudades", "Notificaciones"];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [teams, setTeams] = useState<string[]>(["MEX", "ARG"]);
  const [cities, setCities] = useState<string[]>(["Ciudad de México"]);
  const [notif, setNotif] = useState({ goals: true, start: true, news: false, lineup: true });

  const toggle = (arr: string[], v: string, set: (a: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else {
      toast.success("¡Preferencias guardadas!");
      navigate("/");
    }
  };

  return (
    <div className="container mx-auto max-w-3xl animate-fade-in px-4 py-8 md:py-12">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Paso {step + 1} de {steps.length}
        </div>
        <h1 className="mt-3 font-display text-4xl tracking-wide md:text-5xl">Personaliza tu Mundial</h1>
        <p className="text-muted-foreground">Te mostraremos lo importante según tus gustos.</p>
      </div>

      {/* Progress */}
      <div className="mb-8 flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "grid h-9 w-9 shrink-0 place-items-center rounded-full border text-sm font-semibold transition-colors",
                i <= step ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"
              )}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <div className={cn("hidden text-sm font-semibold sm:block", i <= step ? "text-foreground" : "text-muted-foreground")}>{s}</div>
            {i < steps.length - 1 && <div className={cn("h-px flex-1", i < step ? "bg-primary" : "bg-border")} />}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/60 bg-gradient-card p-6 shadow-card md:p-8">
        {step === 0 && (
          <div>
            <h2 className="font-display text-2xl">Elige tus equipos favoritos</h2>
            <p className="text-sm text-muted-foreground">Verás sus partidos y estadísticas primero.</p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {TEAMS.map((t) => {
                const active = teams.includes(t.code);
                return (
                  <button
                    key={t.code}
                    onClick={() => toggle(teams, t.code, setTeams)}
                    className={cn(
                      "group relative rounded-xl border p-4 text-left transition-all",
                      active
                        ? "border-primary bg-primary/10 shadow-glow"
                        : "border-border/60 bg-secondary hover:border-primary/40"
                    )}
                  >
                    <div className="text-3xl">{t.flag}</div>
                    <div className="mt-2 font-display text-lg">{t.name}</div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Grupo {t.group}</div>
                    {active && (
                      <div className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="font-display text-2xl">Ciudades y estadios</h2>
            <p className="text-sm text-muted-foreground">Filtra partidos por sede.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {CITIES.map((c) => {
                const active = cities.includes(c.name);
                return (
                  <button
                    key={c.name}
                    onClick={() => toggle(cities, c.name, setCities)}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-all",
                      active ? "border-primary bg-primary/10" : "border-border/60 bg-secondary hover:border-primary/40"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-display text-lg">{c.name}</div>
                        <div className="text-xs text-muted-foreground">{c.stadium}</div>
                      </div>
                      <span className="rounded-full bg-background px-2 py-0.5 text-[10px] uppercase tracking-wider">{c.country}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-display text-2xl">Notificaciones</h2>
            <p className="text-sm text-muted-foreground">Solo lo que te importa.</p>
            <div className="mt-6 space-y-3">
              {[
                { k: "goals", label: "Goles de mis equipos", desc: "Vibración + alerta inmediata" },
                { k: "start", label: "Inicio de partido", desc: "5 minutos antes del pitazo" },
                { k: "lineup", label: "Alineaciones", desc: "Cuando se publica el XI inicial" },
                { k: "news", label: "Noticias y rumores", desc: "Resúmenes diarios" },
              ].map((row) => (
                <div key={row.k} className="flex items-center justify-between rounded-xl border border-border/60 bg-secondary p-4">
                  <div>
                    <div className="font-semibold">{row.label}</div>
                    <div className="text-xs text-muted-foreground">{row.desc}</div>
                  </div>
                  <Switch
                    checked={(notif as any)[row.k]}
                    onCheckedChange={(v) => setNotif({ ...notif, [row.k]: v })}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between">
        <Button variant="ghost" disabled={step === 0} onClick={() => setStep(step - 1)}>
          <ChevronLeft className="mr-1 h-4 w-4" /> Atrás
        </Button>
        <Button onClick={next} className="bg-gradient-primary shadow-glow">
          {step === steps.length - 1 ? "Finalizar" : "Continuar"} <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
