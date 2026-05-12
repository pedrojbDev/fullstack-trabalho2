"use client";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [form, setForm] = useState({ opening_time: "08:00", closing_time: "18:00", appointment_duration_minutes: 60, interval_minutes: 15, default_view: "week" });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((d) => { if (d?.opening_time) setForm(d); });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const d = await res.json();
    if (!res.ok) return setMsg(d.error || "Erro ao salvar");
    setMsg("Configurações salvas com sucesso");
  }

  return <form onSubmit={submit} className="card mx-auto max-w-2xl space-y-3 p-4"><h1 className="text-2xl font-bold">Configurações da Agenda</h1><div className="grid gap-3 sm:grid-cols-2"><div><label className="label">Abertura</label><input className="input" type="time" value={form.opening_time} onChange={(e)=>setForm({...form,opening_time:e.target.value})} /></div><div><label className="label">Fechamento</label><input className="input" type="time" value={form.closing_time} onChange={(e)=>setForm({...form,closing_time:e.target.value})} /></div><div><label className="label">Duração padrão (min)</label><input className="input" type="number" value={form.appointment_duration_minutes} onChange={(e)=>setForm({...form,appointment_duration_minutes:Number(e.target.value)})} /></div><div><label className="label">Intervalo (min)</label><input className="input" type="number" value={form.interval_minutes} onChange={(e)=>setForm({...form,interval_minutes:Number(e.target.value)})} /></div><div className="sm:col-span-2"><label className="label">Visualização padrão</label><select className="input" value={form.default_view} onChange={(e)=>setForm({...form,default_view:e.target.value})}><option value="day">Dia</option><option value="week">Semana</option><option value="month">Mês</option></select></div></div><button className="btn-primary" type="submit">Salvar configurações</button>{msg && <p className="text-sm text-slate-600">{msg}</p>}</form>;
}

