"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import { Select } from "@/frontend/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/frontend/components/ui/card";
import { PageHeader } from "@/frontend/components/ui/page-header";

export default function SettingsPage() {
  const [form, setForm] = useState({
    opening_time: "08:00",
    closing_time: "18:00",
    appointment_duration_minutes: 60,
    interval_minutes: 15,
    default_view: "week",
  });
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d?.opening_time) setForm(d);
      });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const d = await res.json();
    if (!res.ok) {
      setMsg({ kind: "error", text: d.error || "Erro ao salvar" });
      return;
    }
    setMsg({ kind: "ok", text: "Configurações salvas com sucesso" });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Configurações da agenda"
        description="Ajuste horários, duração padrão e visualização do calendário."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon size={16} className="text-brand-600" /> Preferências
          </CardTitle>
          <CardDescription>
            Estas configurações são usadas como padrão ao criar novos compromissos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="stagger grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="opening">Abertura</Label>
                <Input
                  id="opening"
                  type="time"
                  value={form.opening_time}
                  onChange={(e) => setForm({ ...form, opening_time: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="closing">Fechamento</Label>
                <Input
                  id="closing"
                  type="time"
                  value={form.closing_time}
                  onChange={(e) => setForm({ ...form, closing_time: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="duration">Duração padrão (min)</Label>
                <Input
                  id="duration"
                  type="number"
                  min={5}
                  max={240}
                  value={form.appointment_duration_minutes}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      appointment_duration_minutes: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="interval">Intervalo (min)</Label>
                <Input
                  id="interval"
                  type="number"
                  min={0}
                  max={120}
                  value={form.interval_minutes}
                  onChange={(e) =>
                    setForm({ ...form, interval_minutes: Number(e.target.value) })
                  }
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="view">Visualização padrão</Label>
                <Select
                  id="view"
                  value={form.default_view}
                  onChange={(e) => setForm({ ...form, default_view: e.target.value })}
                >
                  <option value="day">Dia</option>
                  <option value="week">Semana</option>
                  <option value="month">Mês</option>
                </Select>
              </div>
            </div>

            {msg && (
              <p
                className={
                  msg.kind === "ok"
                    ? "inline-flex animate-fade-in-down items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 ring-1 ring-emerald-200"
                    : "animate-fade-in-down rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200"
                }
              >
                {msg.kind === "ok" && <CheckCircle2 size={14} className="animate-pop" />}{" "}
                {msg.text}
              </p>
            )}

            <div className="flex justify-end">
              <Button type="submit">Salvar configurações</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
