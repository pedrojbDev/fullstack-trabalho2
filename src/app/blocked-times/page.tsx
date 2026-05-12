"use client";
import { useEffect, useState } from "react";

export default function BlockedTimesPage() {
  const [spaces, setSpaces] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ space_id: "", title: "", reason: "", date: "", start_time: "08:00", end_time: "09:00" });

  async function load() {
    const [a,b] = await Promise.all([fetch("/api/blocked-times"), fetch("/api/spaces")]);
    const da = await a.json(); const db = await b.json();
    setItems(Array.isArray(da) ? da : []);
    setSpaces(Array.isArray(db) ? db : []);
  }
  useEffect(() => { load(); }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/blocked-times", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, space_id: form.space_id || null }) });
    setForm({ space_id: "", title: "", reason: "", date: "", start_time: "08:00", end_time: "09:00" });
    load();
  }

  return <div className="space-y-4"><h1 className="text-2xl font-bold">Bloqueios de Horário</h1><form onSubmit={submit} className="card grid gap-3 p-4 sm:grid-cols-3"><input className="input" placeholder="Título" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} required /><select className="input" value={form.space_id} onChange={(e)=>setForm({...form,space_id:e.target.value})}><option value="">Todos os espaços</option>{spaces.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select><input className="input" type="date" value={form.date} onChange={(e)=>setForm({...form,date:e.target.value})} required /><input className="input" type="time" value={form.start_time} onChange={(e)=>setForm({...form,start_time:e.target.value})} required /><input className="input" type="time" value={form.end_time} onChange={(e)=>setForm({...form,end_time:e.target.value})} required /><input className="input" placeholder="Motivo" value={form.reason} onChange={(e)=>setForm({...form,reason:e.target.value})} /><button className="btn-primary sm:col-span-3" type="submit">Adicionar bloqueio</button></form><div className="card overflow-x-auto"><table className="min-w-full text-sm"><thead className="bg-slate-50"><tr><th className="p-3 text-left">Título</th><th>Data</th><th>Horário</th><th>Espaço</th></tr></thead><tbody>{items.map((b)=><tr key={b.id} className="border-t"><td className="p-3">{b.title}</td><td>{b.date}</td><td>{b.start_time}-{b.end_time}</td><td>{b.space_id ? (b.spaces?.name || "-" ) : "Todos"}</td></tr>)}</tbody></table></div></div>;
}

