"use client";
import { useEffect, useState } from "react";

export default function SpacesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", description: "", capacity: 1, location: "", is_active: true });

  async function load() { const r = await fetch("/api/spaces"); const d = await r.json(); setItems(Array.isArray(d) ? d : []); }
  useEffect(() => { load(); }, []);

  async function submit(e: React.FormEvent) { e.preventDefault(); await fetch("/api/spaces", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); setForm({ name: "", description: "", capacity: 1, location: "", is_active: true }); load(); }
  async function remove(id: string) { await fetch("/api/spaces", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); load(); }

  return <div className="space-y-4"><h1 className="text-2xl font-bold">Espaços</h1><form onSubmit={submit} className="card grid gap-3 p-4 sm:grid-cols-2"><input className="input" placeholder="Nome" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required /><input className="input" placeholder="Localização" value={form.location} onChange={(e)=>setForm({...form,location:e.target.value})} /><input className="input" type="number" min={1} placeholder="Capacidade" value={form.capacity} onChange={(e)=>setForm({...form,capacity:Number(e.target.value)})} /><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_active} onChange={(e)=>setForm({...form,is_active:e.target.checked})} /> Espaço ativo</label><textarea className="input sm:col-span-2" placeholder="Descrição" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} /><button className="btn-primary sm:col-span-2" type="submit">Salvar Espaço</button></form><div className="card overflow-x-auto"><table className="min-w-full text-sm"><thead className="bg-slate-50"><tr><th className="p-3 text-left">Nome</th><th>Capacidade</th><th>Local</th><th>Status</th><th className="p-3 text-right">Ações</th></tr></thead><tbody>{items.map((s)=><tr key={s.id} className="border-t"><td className="p-3">{s.name}</td><td>{s.capacity}</td><td>{s.location}</td><td>{s.is_active ? "Ativo" : "Inativo"}</td><td className="p-3 text-right"><button className="btn-secondary" onClick={()=>remove(s.id)}>Arquivar</button></td></tr>)}</tbody></table></div></div>;
}

