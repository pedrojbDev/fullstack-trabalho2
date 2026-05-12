"use client";

import { useEffect, useState } from "react";
import { Archive, Mail, Phone, Plus, Search, Users } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { PageHeader } from "@/shared/components/ui/page-header";
import { EmptyState } from "@/shared/components/ui/empty-state";

type ClientItem = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
};

export default function ClientsPage() {
  const [items, setItems] = useState<ClientItem[]>([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  async function load() {
    const r = await fetch("/api/clients");
    const d = await r.json();
    setItems(Array.isArray(d) ? d : []);
  }
  useEffect(() => {
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!r.ok) {
      const d = await r.json();
      setError(d.error || "Erro");
      return;
    }
    setError("");
    setForm({ name: "", email: "", phone: "", notes: "" });
    load();
  }

  async function remove(id: string) {
    await fetch("/api/clients", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  const filtered = items.filter((c) =>
    !query ||
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.email?.toLowerCase().includes(query.toLowerCase()) ||
    c.phone?.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description="Cadastre e gerencie seus contatos."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus size={16} className="text-brand-600" /> Novo cliente
            </CardTitle>
            <CardDescription>
              Mantenha o cadastro atualizado para vincular a compromissos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-3">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
              {error && (
                <p className="animate-fade-in-down rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
                  {error}
                </p>
              )}
              <Button type="submit" className="w-full">
                Salvar cliente
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Lista de clientes</CardTitle>
            <CardDescription>
              {items.length} {items.length === 1 ? "cliente cadastrado" : "clientes cadastrados"}
            </CardDescription>
            <div className="relative mt-3 max-w-sm">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Input
                placeholder="Buscar cliente…"
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <EmptyState
                icon={Users}
                title="Nenhum cliente"
                description={query ? "Tente outra busca." : "Adicione seu primeiro cliente."}
              />
            ) : (
              <ul className="stagger divide-y divide-slate-100">
                {filtered.map((c) => (
                  <li
                    key={c.id}
                    className="group flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-slate-50/60"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700 transition-transform duration-200 group-hover:scale-110">
                        {c.name.slice(0, 1).toUpperCase()}
                      </span>
                      <div>
                        <p className="font-medium text-slate-900">{c.name}</p>
                        <div className="mt-0.5 flex flex-wrap gap-3 text-xs text-slate-500">
                          {c.email && (
                            <span className="inline-flex items-center gap-1">
                              <Mail size={12} /> {c.email}
                            </span>
                          )}
                          {c.phone && (
                            <span className="inline-flex items-center gap-1">
                              <Phone size={12} /> {c.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(c.id)}
                      title="Arquivar"
                    >
                      <Archive size={14} /> Arquivar
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
