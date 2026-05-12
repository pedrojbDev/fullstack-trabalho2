"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";

export default function AppointmentsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/appointments");
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
  }

  useEffect(() => { load(); }, []);

  async function changeStatus(id: string, action: "confirm"|"cancel"|"complete") {
    const res = await fetch("/api/appointments", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action }) });
    if (!res.ok) {
      const d = await res.json();
      setError(d.error || "Erro ao atualizar status");
      return;
    }
    load();
  }

  async function addReminder(appointment_id: string) {
    const scheduled_for = new Date(Date.now() + 3600_000).toISOString();
    const res = await fetch("/api/reminders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ appointment_id, type: "email", scheduled_for }) });
    if (!res.ok) {
      const d = await res.json();
      setError(d.error || "Erro ao criar lembrete");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Compromissos</h1>
        <Link href="/appointments/new" className="btn-primary">Novo Compromisso</Link>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50"><tr><th className="p-3 text-left">Título</th><th>Data</th><th>Horário</th><th>Status</th><th className="p-3 text-right">Ações</th></tr></thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id} className="border-t border-slate-200">
                <td className="p-3">{a.title}</td><td>{a.date}</td><td>{a.start_time}-{a.end_time}</td><td><StatusBadge status={a.status} /></td>
                <td className="p-3 text-right"><div className="flex flex-wrap justify-end gap-2"><button className="btn-secondary" onClick={() => changeStatus(a.id, "confirm")}>Confirmar</button><button className="btn-secondary" onClick={() => changeStatus(a.id, "complete")}>Concluir</button><button className="btn-secondary" onClick={() => changeStatus(a.id, "cancel")}>Cancelar</button><button className="btn-secondary" onClick={() => addReminder(a.id)}>Criar lembrete</button><a className="btn-secondary" target="_blank" href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(a.title)}&dates=${a.date.replaceAll("-", "") + "T" + a.start_time.replace(":", "") + "00"}/${a.date.replaceAll("-", "") + "T" + a.end_time.replace(":", "") + "00"}&details=${encodeURIComponent(a.description || "Compromisso AgendaFlow")}`}>Exportar Google</a></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

