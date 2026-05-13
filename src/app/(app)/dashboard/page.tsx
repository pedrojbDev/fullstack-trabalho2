"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarCheck2,
  CheckCircle2,
  Clock,
  XCircle,
  Building2,
  ArrowUpRight,
  Sparkles,
  Plus,
  Users,
  Clock3,
} from "lucide-react";
import { SummaryCard } from "@/frontend/components/dashboard/summary-card";
import { StatusBadge } from "@/frontend/components/ui/status-badge";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { PageHeader } from "@/frontend/components/ui/page-header";
import { EmptyState } from "@/frontend/components/ui/empty-state";

type Appointment = {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
};

type Space = {
  id: string;
  is_active: boolean;
};

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);

  useEffect(() => {
    fetch("/api/appointments")
      .then((r) => r.json())
      .then((d) => setAppointments(Array.isArray(d) ? d : []));
    fetch("/api/spaces")
      .then((r) => r.json())
      .then((d) => setSpaces(Array.isArray(d) ? d : []));
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const summary = useMemo(() => {
    const t = appointments.filter((a) => a.date === today);
    return {
      totalToday: t.length,
      confirmed: t.filter((a) => a.status === "confirmed").length,
      pending: t.filter((a) => a.status === "pending").length,
      cancelled: t.filter((a) => a.status === "cancelled").length,
      spacesAvailable: spaces.filter((s) => s.is_active).length,
    };
  }, [appointments, spaces, today]);

  const upcoming = appointments
    .filter((a) => a.date >= today && a.status !== "cancelled")
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Visão geral da sua agenda em tempo real."
        actions={
          <Link href="/appointments/new">
            <Button>
              <Plus size={16} /> Novo compromisso
            </Button>
          </Link>
        }
      />

      <div className="stagger grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <SummaryCard
          title="Hoje"
          value={summary.totalToday}
          icon={CalendarCheck2}
          hint="Compromissos do dia"
        />
        <SummaryCard
          title="Confirmados"
          value={summary.confirmed}
          icon={CheckCircle2}
          accent="bg-emerald-50 text-emerald-600"
        />
        <SummaryCard
          title="Pendentes"
          value={summary.pending}
          icon={Clock}
          accent="bg-amber-50 text-amber-600"
        />
        <SummaryCard
          title="Cancelados"
          value={summary.cancelled}
          icon={XCircle}
          accent="bg-red-50 text-red-600"
        />
        <SummaryCard
          title="Espaços ativos"
          value={summary.spacesAvailable}
          icon={Building2}
          accent="bg-violet-50 text-violet-600"
        />
      </div>

      <div className="stagger grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Próximos compromissos</CardTitle>
            <Link
              href="/appointments"
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              Ver todos <ArrowUpRight size={14} />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {upcoming.length === 0 ? (
              <EmptyState
                icon={CalendarCheck2}
                title="Nenhum compromisso à vista"
                description="Crie seu primeiro compromisso para começar a organizar sua agenda."
                action={
                  <Link href="/appointments/new">
                    <Button>
                      <Plus size={16} /> Novo compromisso
                    </Button>
                  </Link>
                }
              />
            ) : (
              <ul className="stagger divide-y divide-slate-100">
                {upcoming.map((a) => (
                  <li
                    key={a.id}
                    className="group flex items-center justify-between gap-4 px-5 py-3 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600 transition-transform duration-200 group-hover:scale-110">
                        <CalendarCheck2 size={16} />
                      </span>
                      <div>
                        <p className="font-medium text-slate-900 transition-colors group-hover:text-brand-700">
                          {a.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {a.date} · {a.start_time}-{a.end_time}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={a.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles size={16} className="animate-pulse-soft text-brand-600" /> Ações rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/appointments/new" className="block">
              <Button className="w-full justify-start">
                <CalendarCheck2 size={16} /> Novo compromisso
              </Button>
            </Link>
            <Link href="/clients" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Users size={16} /> Novo cliente
              </Button>
            </Link>
            <Link href="/spaces" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Building2 size={16} /> Novo espaço
              </Button>
            </Link>
            <Link href="/blocked-times" className="block">
              <Button variant="outline" className="w-full justify-start">
                <Clock3 size={16} /> Bloquear horário
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
