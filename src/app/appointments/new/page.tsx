"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewAppointmentPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [spaces, setSpaces] = useState<any[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  const [form, setForm] = useState({ client_id: "", space_id: "", title: "", description: "", date: "", start_time: "08:00", end_time: "09:00", status: "scheduled", category_color: "#2563EB" });

  useEffect(() => {
    fetch("/api/clients").then((r) => r.json()).then((d) => setClients(Array.isArray(d) ? d : []));
    fetch("/api/spaces").then((r) => r.json()).then((d) => setSpaces((Array.isArray(d) ? d : []).filter((x: any) => x.is_active)));
    fetch("/api/settings").then((r) => r.json()).then((s) => {
      if (s?.opening_time) {
        setForm((f) => ({ ...f, start_time: s.opening_time }));
      }
    });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/appointments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) return setError(data.error || "Erro ao criar compromisso");
    router.push("/appointments");
  }

  return <form onSubmit={submit} className="card mx-auto max-w-2xl space-y-3 p-4"><h1 className="text-2xl font-bold">Novo Compromisso</h1>{error && <p className="text-sm text-red-600">{error}</p>}<div><label className="label">Título</label><input className="input" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} required /></div><div><label className="label">Cliente</label><select className="input" value={form.client_id} onChange={(e)=>setForm({...form,client_id:e.target.value})} required><option value="">Selecione</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div><div><label className="label">Espaço</label><select className="input" value={form.space_id} onChange={(e)=>setForm({...form,space_id:e.target.value})} required><option value="">Selecione</option>{spaces.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></div><div className="grid gap-3 sm:grid-cols-3"><div><label className="label">Data</label><input className="input" type="date" value={form.date} onChange={(e)=>setForm({...form,date:e.target.value})} required /></div><div><label className="label">Início</label><input className="input" type="time" value={form.start_time} onChange={(e)=>setForm({...form,start_time:e.target.value})} required /></div><div><label className="label">Fim</label><input className="input" type="time" value={form.end_time} onChange={(e)=>setForm({...form,end_time:e.target.value})} required /></div></div><div><label className="label">Descrição</label><textarea className="input" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} /></div><button className="btn-primary" type="submit">Salvar compromisso</button></form>;
}

