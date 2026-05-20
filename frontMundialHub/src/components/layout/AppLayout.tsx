import { Outlet, useLocation, NavLink } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Home, CalendarDays, Trophy, Sticker as StickerIcon, User } from "lucide-react";

const titles: Record<string, string> = {
  "/": "Inicio",
  "/agenda": "Agenda",
  "/pollas": "Pollas",
  "/album": "Álbum digital",
  "/notificaciones": "Notificaciones",
  "/perfil": "Perfil",
  "/onboarding": "Preferencias",
  "/auth": "Acceso",
};

const mobileNav = [
  { url: "/", icon: Home, label: "Inicio" },
  { url: "/agenda", icon: CalendarDays, label: "Agenda" },
  { url: "/pollas", icon: Trophy, label: "Pollas" },
  { url: "/album", icon: StickerIcon, label: "Álbum" },
  { url: "/perfil", icon: User, label: "Perfil" },
];

export default function AppLayout() {
  const { pathname } = useLocation();
  const title =
    titles[pathname] ??
    (pathname.startsWith("/partido") ? "Partido en vivo" : "Mundial 2026");

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/80 px-3 backdrop-blur md:px-6">
            <SidebarTrigger className="text-foreground" />
            <div className="hidden md:block">
              <h1 className="font-display text-2xl tracking-wide">{title}</h1>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative hidden md:block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar equipo, partido, jugador…"
                  className="h-10 w-72 rounded-full border-border/60 bg-secondary pl-9 focus-visible:ring-primary"
                />
              </div>
              <NavLink to="/notificaciones">
                <Button variant="ghost" size="icon" className="relative rounded-full">
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary shadow-glow" />
                </Button>
              </NavLink>
              <NavLink
                to="/perfil"
                className="grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground shadow-glow"
              >
                AM
              </NavLink>
            </div>
          </header>

          <main className="min-w-0 flex-1 pb-20 md:pb-0">
            <Outlet />
          </main>

          {/* Mobile bottom nav */}
          <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border/60 bg-background/95 backdrop-blur md:hidden">
            {mobileNav.map((item) => {
              const active =
                item.url === "/" ? pathname === "/" : pathname.startsWith(item.url);
              return (
                <NavLink
                  key={item.url}
                  to={item.url}
                  className={`flex flex-col items-center gap-1 py-2 text-[10px] uppercase tracking-wider transition-colors ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>
    </SidebarProvider>
  );
}
