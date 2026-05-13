"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lock, Mail, Sparkles, User, CheckCircle2 } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import { Spinner } from "@/frontend/components/ui/spinner";

const benefits = [
  "Gestão completa de compromissos, clientes e espaços",
  "Detecção automática de conflitos e bloqueios",
  "Calendário moderno e responsivo",
  "Lembretes simulados e exportação para Google Agenda",
];

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const raw = await res.text();
      const data = raw ? JSON.parse(raw) : {};
      if (!res.ok) {
        setError(data.error || "Falha no cadastro");
        return;
      }
      router.push("/login");
    } catch {
      setError("Erro inesperado ao cadastrar. Verifique as variáveis do Supabase.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden animate-fade-in-left overflow-hidden bg-gradient-to-br from-indigo-700 via-brand-600 to-purple-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute -left-20 top-1/3 h-72 w-72 animate-float rounded-full bg-white/10 blur-3xl" />
        <div
          className="absolute -right-10 bottom-10 h-64 w-64 animate-float rounded-full bg-pink-400/20 blur-3xl"
          style={{ animationDelay: "-2.5s" }}
        />
        <Link href="/" className="relative flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/15 backdrop-blur transition-transform duration-300 hover:scale-110 hover:rotate-6">
            <Sparkles size={18} />
          </span>
          <span className="text-base font-semibold">AgendaFlow</span>
        </Link>

        <div className="relative max-w-md">
          <h2 className="animate-fade-in-up text-3xl font-semibold tracking-tight">
            Sua agenda profissional começa aqui
          </h2>
          <p className="mt-3 animate-fade-in-up text-white/80 animate-delay-100">
            Crie sua conta gratuita e tenha tudo o que precisa para organizar
            atendimentos, espaços e horários em um só lugar.
          </p>
          <ul className="stagger mt-8 space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm">
                <CheckCircle2 size={16} className="mt-0.5 text-emerald-300" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/60">
          © {new Date().getFullYear()} AgendaFlow — Projeto acadêmico Fullstack.
        </p>
      </section>

      <section className="flex animate-fade-in-right items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 lg:hidden"
          >
            <Sparkles size={16} className="text-brand-600" /> AgendaFlow
          </Link>
          <h1 className="animate-fade-in-up text-2xl font-semibold tracking-tight text-slate-900">
            Criar sua conta
          </h1>
          <p className="mt-1 animate-fade-in-up text-sm text-slate-500 animate-delay-100">
            Já tem conta?{" "}
            <Link href="/login" className="font-medium text-brand-600 hover:text-brand-700">
              Entrar
            </Link>
          </p>

          <form onSubmit={onSubmit} className="stagger mt-8 space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <div className="relative">
                <User
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <Input
                  id="name"
                  placeholder="Seu nome completo"
                  className="pl-9"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <p className="animate-fade-in-down rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="group w-full" disabled={loading}>
              {loading ? (
                <>
                  <Spinner /> Cadastrando...
                </>
              ) : (
                <>
                  Criar conta
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </>
              )}
            </Button>

            <p className="text-center text-xs text-slate-500">
              Ao continuar, você concorda em usar AgendaFlow para fins acadêmicos.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
