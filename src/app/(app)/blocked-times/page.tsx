"use client";

import { useEffect, useState } from "react";
import { Clock3, Plus, ShieldAlert } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select } from "@/shared/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { PageHeader } from "@/shared/components/ui/page-header";
import { EmptyState } from "@/shared/components/ui/empty-state";

type SpaceOption = { id: string; name: string };
type BlockedItem = {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  space_id: string | null;
  reason?: string | null;
  spaces?: { name?: string };
};

export default function BlockedTimesPage() {
  const [spaces, setSpaces] = useState<SpaceOption[]>([]);
  const [items, setItems] = useState<BlockedItem[]>([]);
  const [form, setForm] = useState({
    space_id: "",
    title: "",
    reason: "",
    date: "",
    start_time: "08:00",
    end_time: "09:00",
  });

  async function load() {
    const [a, b] = await Promise.all([fetch("/api/blocked-times"), fetch("/api/spaces")]);
    const da = await a.json();
    const db = await b.json();
    setItems(Array.isArray(da) ? da : []);
    setSpaces(Array.isArray(db) ? db : []);
  }
  useEffect(() => {
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/blocked-times", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, space_id: form.space_id || null }),
    });
    setForm({
      space_id: "",
      title: "",
      reason: "",
      date: "",
      start_time: "08:00",
      end_time: "09:00",
    });
    load();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bloqueios de horário"
        description="Reserve janelas indisponíveis para evitar agendamentos."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus size={16} className="text-brand-600" /> Novo bloqueio
            </CardTitle>
            <CardDescription>
              Aplique a um espaço específico ou a todos os espaços.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-3">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="space">Espaço</Label>
                <Select
                  id="space"
                  value={form.space_id}
                  onChange={(e) => setForm({ ...form, space_id: e.target.value })}
                >
                  <option value="">Todos os espaços</option>
                  {spaces.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="start">Início</Label>
                  <Input
                    id="start"
                    type="time"
                    value={form.start_time}
                    onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end">Fim</Label>
                  <Input
                    id="end"
                    type="time"
                    value={form.end_time}
                    onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="reason">Motivo</Label>
                <Input
                  id="reason"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Opcional"
                />
              </div>
              <Button type="submit" className="w-full">
                Adicionar bloqueio
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Bloqueios ativos</CardTitle>
            <CardDescription>
              {items.length} {items.length === 1 ? "bloqueio" : "bloqueios"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {items.length === 0 ? (
              <EmptyState
                icon={ShieldAlert}
                title="Nenhum bloqueio"
                description="Crie um bloqueio para impedir agendamentos em períodos específicos."
              />
            ) : (
              <ul className="stagger divide-y divide-slate-100">
                {items.map((b) => (
                  <li
                    key={b.id}
                    className="group flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-slate-50/60"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-lg bg-amber-50 text-amber-700 transition-transform duration-200 group-hover:scale-110">
                        <Clock3 size={16} />
                      </span>
                      <div>
                        <p className="font-medium text-slate-900">{b.title}</p>
                        <p className="text-xs text-slate-500">
                          {b.date} · {b.start_time}–{b.end_time} ·{" "}
                          {b.space_id ? b.spaces?.name || "—" : "Todos os espaços"}
                        </p>
                      </div>
                    </div>
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
