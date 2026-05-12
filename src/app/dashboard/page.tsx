"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { StatusBadge } from "@/components/ui/status-badge";

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [spaces, setSpaces] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/appointments").then((r) => r.json()).then((d) => setAppointments(Array.isArray(d) ? d : []));
    fetch("/api/spaces").then((r) => r.json()).then((d) => setSpaces(Array.isArray(d) ? d : []));
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const summary = useMemo(() => {
    const t = appointments.filter((a) => a.date === today);
    return { totalToday: t.length, confirmed: t.filter((a) => a.status === "confirmed").length, pending: t.filter((a) => a.status === "pending").length, cancelled: t.filter((a) => a.status === "cancelled").length, spacesAvailable: spaces.filter((s) => s.is_active).length };
  }, [appointments, spaces, today]);

  return <div className="space-y-4"><h1 className="text-2xl font-bold">Dashboard</h1><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"><SummaryCard title="Hoje" value={summary.totalToday} /><SummaryCard title="Confirmados" value={summary.confirmed} /><SummaryCard title="Pendentes" value={summary.pending} /><SummaryCard title="Cancelados" value={summary.cancelled} /><SummaryCard title="Espaços disponíveis" value={summary.spacesAvailable} /></div><div className="grid gap-4 lg:grid-cols-3"><section className="card p-4 lg:col-span-2"><h2 className="mb-3 text-lg font-semibold">Próximos compromissos</h2><div className="space-y-2">{appointments.slice(0,8).map((a)=><div key={a.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3"><div><p className="font-medium">{a.title}</p><p className="text-sm text-slate-500">{a.date} {a.start_time}-{a.end_time}</p></div><StatusBadge status={a.status} /></div>)}</div></section><section className="card p-4"><h2 className="mb-3 text-lg font-semibold">Ações rápidas</h2><div className="space-y-2"><Link className="btn-primary w-full justify-center" href="/appointments/new">Novo Compromisso</Link><Link className="btn-secondary w-full justify-center" href="/clients">Novo Cliente</Link><Link className="btn-secondary w-full justify-center" href="/spaces">Novo Espaço</Link><Link className="btn-secondary w-full justify-center" href="/blocked-times">Bloquear Horário</Link></div></section></div></div>;
}

