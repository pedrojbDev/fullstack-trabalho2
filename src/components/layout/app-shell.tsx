"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Calendar, Home, Users, Building2, Clock3, Settings, CalendarCheck2, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/calendar", label: "Calendário", icon: Calendar },
  { href: "/appointments", label: "Compromissos", icon: CalendarCheck2 },
  { href: "/clients", label: "Clientes", icon: Users },
  { href: "/spaces", label: "Espaços", icon: Building2 },
  { href: "/blocked-times", label: "Bloqueios", icon: Clock3 },
  { href: "/settings", label: "Configurações", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex max-w-7xl gap-4 p-4">
        <aside className="hidden w-64 rounded-xl border border-slate-200 bg-white p-4 md:block">
          <h1 className="mb-4 text-xl font-bold text-blue-600">AgendaFlow</h1>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href} className={cn("flex items-center gap-2 rounded-lg px-3 py-2 text-sm", path.startsWith(link.href) ? "bg-blue-100 text-blue-700" : "text-slate-700 hover:bg-slate-100")}>
                  <Icon size={16} /> {link.label}
                </Link>
              );
            })}
          </nav>
          <button onClick={logout} className="btn-secondary mt-6 w-full justify-center">
            <LogOut size={16} /> Sair
          </button>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

