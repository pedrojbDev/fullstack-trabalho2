"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarCheck2 } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import { Select } from "@/frontend/components/ui/select";
import { Textarea } from "@/frontend/components/ui/textarea";
import { Spinner } from "@/frontend/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/frontend/components/ui/card";

type Option = { id: string; name: string; is_active?: boolean };

export default function NewAppointmentPage() {
  const [clients, setClients] = useState<Option[]>([]);
  const [spaces, setSpaces] = useState<Option[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    client_id: "",
    space_id: "",
    title: "",
    description: "",
    date: "",
    start_time: "08:00",
    end_time: "09:00",
    status: "scheduled",
    category_color: "#4f46e5",
  });

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then((d) => setClients(Array.isArray(d) ? d : []));
    fetch("/api/spaces")
      .then((r) => r.json())
      .then((d) =>
        setSpaces((Array.isArray(d) ? d : []).filter((x: Option) => x.is_active)),
      );
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) => {
        if (s?.opening_time) {
          setForm((f) => ({ ...f, start_time: s.opening_time }));
        }
      });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erro ao criar compromisso");
        return;
      }
      router.push("/appointments");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link
        href="/appointments"
        className="group inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
      >
        <ArrowLeft
          size={14}
          className="transition-transform duration-200 group-hover:-translate-x-0.5"
        />
        Voltar para compromissos
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck2 size={18} className="text-brand-600" />
            Novo Compromisso
          </CardTitle>
          <CardDescription>
            Preencha os dados abaixo. Validamos conflitos com bloqueios e outros agendamentos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="stagger space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Ex: Consulta inicial"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="client">Cliente</Label>
                <Select
                  id="client"
                  value={form.client_id}
                  onChange={(e) => setForm({ ...form, client_id: e.target.value })}
                  required
                >
                  <option value="">Selecione um cliente</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="space">Espaço</Label>
                <Select
                  id="space"
                  value={form.space_id}
                  onChange={(e) => setForm({ ...form, space_id: e.target.value })}
                  required
                >
                  <option value="">Selecione um espaço</option>
                  {spaces.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
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
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Observações, contexto ou objetivos"
              />
            </div>

            {error && (
              <p className="animate-fade-in-down rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
                {error}
              </p>
            )}

            <div className="flex items-center justify-end gap-2">
              <Link href="/appointments">
                <Button type="button" variant="ghost">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner /> Salvando...
                  </>
                ) : (
                  "Salvar compromisso"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
