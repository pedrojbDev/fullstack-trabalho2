"use client";

import { useEffect, useState } from "react";
import { Archive, Building2, MapPin, Plus, Users } from "lucide-react";
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
import { Badge } from "@/shared/components/ui/badge";

type SpaceItem = {
  id: string;
  name: string;
  description?: string | null;
  capacity?: number | null;
  location?: string | null;
  is_active: boolean;
};

export default function SpacesPage() {
  const [items, setItems] = useState<SpaceItem[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    capacity: 1,
    location: "",
    is_active: true,
  });

  async function load() {
    const r = await fetch("/api/spaces");
    const d = await r.json();
    setItems(Array.isArray(d) ? d : []);
  }
  useEffect(() => {
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/spaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", description: "", capacity: 1, location: "", is_active: true });
    load();
  }

  async function remove(id: string) {
    await fetch("/api/spaces", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Espaços" description="Organize salas, consultórios e ambientes." />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus size={16} className="text-brand-600" /> Novo espaço
            </CardTitle>
            <CardDescription>Espaços inativos não recebem agendamentos.</CardDescription>
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
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="capacity">Capacidade</Label>
                <Input
                  id="capacity"
                  type="number"
                  min={1}
                  value={form.capacity}
                  onChange={(e) =>
                    setForm({ ...form, capacity: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm({ ...form, is_active: e.target.checked })
                  }
                />
                Espaço ativo
              </label>
              <Button type="submit" className="w-full">
                Salvar espaço
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Espaços cadastrados</CardTitle>
            <CardDescription>
              {items.length} {items.length === 1 ? "espaço" : "espaços"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {items.length === 0 ? (
              <EmptyState
                icon={Building2}
                title="Nenhum espaço"
                description="Cadastre seu primeiro ambiente para começar a agendar."
              />
            ) : (
              <ul className="stagger divide-y divide-slate-100">
                {items.map((s) => (
                  <li
                    key={s.id}
                    className="group flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-slate-50/60"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-lg bg-violet-50 text-violet-700 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3">
                        <Building2 size={16} />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-900">{s.name}</p>
                          {s.is_active ? (
                            <Badge className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                              Ativo
                            </Badge>
                          ) : (
                            <Badge className="bg-slate-100 text-slate-700 ring-1 ring-slate-200">
                              Inativo
                            </Badge>
                          )}
                        </div>
                        <div className="mt-0.5 flex flex-wrap gap-3 text-xs text-slate-500">
                          {s.location && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin size={12} /> {s.location}
                            </span>
                          )}
                          {s.capacity != null && (
                            <span className="inline-flex items-center gap-1">
                              <Users size={12} /> Cap. {s.capacity}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => remove(s.id)}>
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
