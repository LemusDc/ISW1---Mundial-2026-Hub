import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Lock, User as UserIcon, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function Auth() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent, signup = false) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(signup ? "¡Cuenta creada!" : "¡Bienvenido de vuelta!");
      navigate(signup ? "/onboarding" : "/");
    }, 800);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left visual */}
      <div className="relative hidden overflow-hidden bg-gradient-hero lg:block">
        <div className="absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-primary shadow-glow">
              <span className="font-display text-xl text-primary-foreground">26</span>
            </div>
            <div>
              <div className="font-display text-xl tracking-wide">MUNDIAL 2026</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Hub oficial</div>
            </div>
          </Link>

          <div className="space-y-6">
            <h2 className="font-display text-6xl leading-none tracking-wide">
              VIVE EL<br />
              <span className="text-gradient-primary">MUNDIAL</span><br />
              COMO NUNCA.
            </h2>
            <p className="max-w-md text-muted-foreground">
              Partidos, pollas, álbum digital y notificaciones en tiempo real para los 3 países anfitriones.
            </p>
            <div className="flex gap-3 text-3xl">🇲🇽 🇺🇸 🇨🇦</div>
          </div>

          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            48 selecciones · 16 ciudades · 1 sueño
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-in">
          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-primary shadow-glow">
              <span className="font-display text-xl text-primary-foreground">26</span>
            </div>
            <div className="font-display text-xl tracking-wide">MUNDIAL 2026 HUB</div>
          </Link>

          <h1 className="font-display text-4xl tracking-wide">Tu acceso al Hub</h1>
          <p className="mt-1 text-sm text-muted-foreground">Inicia sesión o crea tu cuenta para personalizar tu experiencia.</p>

          <Tabs defaultValue="login" className="mt-8">
            <TabsList className="grid w-full grid-cols-2 bg-secondary">
              <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
              <TabsTrigger value="signup">Crear cuenta</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={(e) => submit(e, false)} className="mt-6 space-y-4">
                <Field icon={<Mail className="h-4 w-4" />} label="Correo" type="email" placeholder="tu@correo.com" />
                <PasswordField show={show} setShow={setShow} />
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-muted-foreground">
                    <input type="checkbox" className="accent-primary" /> Recordarme
                  </label>
                  <a href="#" className="text-primary hover:underline">¿Olvidaste tu contraseña?</a>
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-gradient-primary shadow-glow">
                  {loading ? "Ingresando..." : "Entrar al Hub"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={(e) => submit(e, true)} className="mt-6 space-y-4">
                <Field icon={<UserIcon className="h-4 w-4" />} label="Nombre" placeholder="Tu nombre" />
                <Field icon={<Mail className="h-4 w-4" />} label="Correo" type="email" placeholder="tu@correo.com" />
                <PasswordField show={show} setShow={setShow} />
                <p className="text-xs text-muted-foreground">
                  Al crear una cuenta aceptas los términos del Hub.
                </p>
                <Button type="submit" disabled={loading} className="w-full bg-gradient-primary shadow-glow">
                  {loading ? "Creando..." : "Crear cuenta"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Volver al inicio</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ icon, label, type = "text", placeholder }: any) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
        <Input type={type} placeholder={placeholder} required className="h-11 bg-secondary pl-9" />
      </div>
    </div>
  );
}

function PasswordField({ show, setShow }: { show: boolean; setShow: (b: boolean) => void }) {
  return (
    <div className="space-y-1.5">
      <Label>Contraseña</Label>
      <div className="relative">
        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input type={show ? "text" : "password"} placeholder="••••••••" required minLength={6} className="h-11 bg-secondary pl-9 pr-10" />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
