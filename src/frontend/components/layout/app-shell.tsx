"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Calendar,
  CalendarCheck2,
  Users,
  Building2,
  Clock3,
  Settings,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Plug,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/frontend/lib/utils/cn";
import { Button } from "@/frontend/components/ui/button";

type NavGroup = { label: string; items: { href: string; label: string; icon: LucideIcon }[] };

const groups: NavGroup[] = [
  {
    label: "Geral",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/calendar", label: "Calendário", icon: Calendar },
    ],
  },
  {
    label: "Operação",
    items: [
      { href: "/appointments", label: "Compromissos", icon: CalendarCheck2 },
      { href: "/clients", label: "Clientes", icon: Users },
      { href: "/spaces", label: "Espaços", icon: Building2 },
      { href: "/blocked-times", label: "Bloqueios", icon: Clock3 },
    ],
  },
  {
    label: "Sistema",
    items: [
      { href: "/integrations/google-calendar", label: "Integrações", icon: Plug },
      { href: "/settings", label: "Configurações", icon: Settings },
    ],
  },
];

function NavList({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                      active
                        ? "bg-brand-50 text-brand-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:translate-x-0.5",
                    )}
                  >
                    <span
                      className={cn(
                        "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-brand-600 transition-all duration-200",
                        active ? "opacity-100" : "opacity-0 group-hover:opacity-40",
                      )}
                    />
                    <Icon
                      size={16}
                      className={cn(
                        "transition-all duration-200",
                        active
                          ? "text-brand-600"
                          : "text-slate-400 group-hover:text-slate-600 group-hover:scale-110",
                      )}
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <Link href="/dashboard" className="group flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
        <Sparkles size={18} />
      </span>
      <span className="text-base font-semibold tracking-tight text-slate-900">
        AgendaFlow
      </span>
    </Link>
  );
}

export function AppShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail?: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 hidden w-64 animate-fade-in-left flex-col border-r border-slate-200 bg-white px-4 py-5 lg:flex">
        <Brand />
        <div className="mt-8 flex-1 overflow-y-auto pr-1">
          <NavList pathname={pathname} />
        </div>
        <div className="mt-4 border-t border-slate-100 pt-4">
          <div className="mb-3 flex items-center gap-3 rounded-lg px-2 py-1.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-900 text-xs font-semibold text-white">
              {(userEmail?.[0] ?? "A").toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">
                {userEmail ?? "Usuário"}
              </p>
              <p className="text-xs text-slate-500">Conta autenticada</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start"
            onClick={logout}
          >
            <LogOut size={16} /> Sair
          </Button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 animate-fade-in bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 animate-[slide-in-left_0.3s_cubic-bezier(0.22,1,0.36,1)_both] flex-col border-r border-slate-200 bg-white px-4 py-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <Brand />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
                aria-label="Fechar menu"
              >
                <X size={18} />
              </Button>
            </div>
            <div className="mt-6 flex-1 overflow-y-auto">
              <NavList pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            </div>
            <Button
              variant="ghost"
              className="mt-4 w-full justify-start"
              onClick={logout}
            >
              <LogOut size={16} /> Sair
            </Button>
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-14 animate-fade-in-down items-center justify-between border-b border-slate-200 bg-white/85 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu size={18} />
            </Button>
            <div className="hidden text-sm text-slate-500 sm:block">
              Olá, gerencie sua agenda com clareza.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/appointments/new">
              <Button size="sm">
                <CalendarCheck2 size={14} /> Novo compromisso
              </Button>
            </Link>
          </div>
        </header>

        <main
          key={pathname}
          className="mx-auto w-full max-w-7xl animate-fade-in-up px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
