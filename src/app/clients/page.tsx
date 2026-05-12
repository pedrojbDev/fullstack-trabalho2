"use client";
import { useEffect, useState } from "react";

export default function ClientsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [error, setError] = useState("");

  async function load() { const r = await fetch("/api/clients"); const d = await r.json(); setItems(Array.isArray(d) ? d : []); }
  useEffect(() => { load(); }, []);

  async function submit(e: React.FormEvent) { e.preventDefault(); const r = await fetch("/api/clients", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }); if (!r.ok) { const d = await r.json(); return setError(d.error || "Erro"); } setForm({ name: "", email: "", phone: "", notes: "" }); load(); }
  async function remove(id: string) { await fetch("/api/clients", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); load(); }

  return <div className="space-y-4"><h1 className="text-2xl font-bold">Clientes</h1><form onSubmit={submit} className="card grid gap-3 p-4 sm:grid-cols-2"><input className="input" placeholder="Nome" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required /><input className="input" placeholder="E-mail" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} /><input className="input" placeholder="Telefone" value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} /><input className="input" placeholder="Observações" value={form.notes} onChange={(e)=>setForm({...form,notes:e.target.value})} /><button className="btn-primary sm:col-span-2" type="submit">Salvar Cliente</button>{error && <p className="text-sm text-red-600">{error}</p>}</form><div className="card overflow-x-auto"><table className="min-w-full text-sm"><thead className="bg-slate-50"><tr><th className="p-3 text-left">Nome</th><th>E-mail</th><th>Telefone</th><th className="p-3 text-right">Ações</th></tr></thead><tbody>{items.map((c)=><tr key={c.id} className="border-t"><td className="p-3">{c.name}</td><td>{c.email}</td><td>{c.phone}</td><td className="p-3 text-right"><button className="btn-secondary" onClick={()=>remove(c.id)}>Arquivar</button></td></tr>)}</tbody></table></div></div>;
}

