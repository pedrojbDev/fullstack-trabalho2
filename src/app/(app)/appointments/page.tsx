"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarCheck2,
  CheckCircle2,
  XCircle,
  Flag,
  BellRing,
  ExternalLink,
  Plus,
  Search,
} from "lucide-react";
import { StatusBadge } from "@/frontend/components/ui/status-badge";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Card } from "@/frontend/components/ui/card";
import { PageHeader } from "@/frontend/components/ui/page-header";
import { EmptyState } from "@/frontend/components/ui/empty-state";

type AppointmentItem = {
  id: string;
  title: string;
  description?: string | null;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  clients?: { name?: string };
  spaces?: { name?: string };
};

function googleHref(a: AppointmentItem) {
  const ymd = a.date.replaceAll("-", "");
  const startUtc = a.start_time.replace(":", "") + "00";
  const endUtc = a.end_time.replace(":", "") + "00";
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(a.title)}&dates=${ymd}T${startUtc}/${ymd}T${endUtc}&details=${encodeURIComponent(a.description || "Compromisso AgendaFlow")}`;
}

export default function AppointmentsPage() {
  const [items, setItems] = useState<AppointmentItem[]>([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  async function load() {
    const res = await fetch("/api/appointments");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  }
  useEffect(() => {
    load();
  }, []);

  async function changeStatus(id: string, action: "confirm" | "cancel" | "complete") {
    const res = await fetch("/api/appointments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    if (!res.ok) {
      const d = await res.json();
      setError(d.error || "Erro ao atualizar status");
      return;
    }
    setError("");
    load();
  }

  async function addReminder(appointment_id: string) {
    const scheduled_for = new Date(Date.now() + 3600_000).toISOString();
    const res = await fetch("/api/reminders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ appointment_id, type: "email", scheduled_for }),
    });
    if (!res.ok) {
      const d = await res.json();
      setError(d.error || "Erro ao criar lembrete");
    }
  }

  const filtered = items.filter(
    (i) =>
      !query ||
      i.title.toLowerCase().includes(query.toLowerCase()) ||
      i.clients?.name?.toLowerCase().includes(query.toLowerCase()) ||
      i.spaces?.name?.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Compromissos"
        description="Acompanhe e atualize o status de cada agendamento."
        actions={
          <Link href="/appointments/new">
            <Button>
              <Plus size={16} /> Novo compromisso
            </Button>
          </Link>
        }
      />

      <Card className="p-3">
        <div className="relative max-w-md">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <Input
            placeholder="Buscar por título, cliente ou espaço…"
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </Card>

      {error && (
        <p className="animate-fade-in-down rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
          {error}
        </p>
      )}

      <Card className="overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={CalendarCheck2}
            title="Nenhum compromisso encontrado"
            description={query ? "Ajuste o filtro de busca." : "Crie o primeiro para começar."}
            action={
              !query && (
                <Link href="/appointments/new">
                  <Button>
                    <Plus size={16} /> Novo compromisso
                  </Button>
                </Link>
              )
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3 text-left font-medium">Compromisso</th>
                  <th className="px-3 py-3 text-left font-medium">Data</th>
                  <th className="px-3 py-3 text-left font-medium">Horário</th>
                  <th className="px-3 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="stagger divide-y divide-slate-100">
                {filtered.map((a) => (
                  <tr
                    key={a.id}
                    className="transition-colors hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-900">{a.title}</p>
                      <p className="text-xs text-slate-500">
                        {a.clients?.name ? `${a.clients.name} · ` : ""}
                        {a.spaces?.name || ""}
                      </p>
                    </td>
                    <td className="px-3 py-3 text-slate-700">{a.date}</td>
                    <td className="px-3 py-3 text-slate-700">
                      {a.start_time}–{a.end_time}
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => changeStatus(a.id, "confirm")}
                          title="Confirmar"
                        >
                          <CheckCircle2 size={14} /> Confirmar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => changeStatus(a.id, "complete")}
                          title="Concluir"
                        >
                          <Flag size={14} /> Concluir
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => changeStatus(a.id, "cancel")}
                          title="Cancelar"
                        >
                          <XCircle size={14} /> Cancelar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => addReminder(a.id)}
                          title="Criar lembrete"
                        >
                          <BellRing size={14} />
                        </Button>
                        <a
                          href={googleHref(a)}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-medium text-slate-700 hover:bg-slate-100"
                          title="Exportar Google Agenda"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
