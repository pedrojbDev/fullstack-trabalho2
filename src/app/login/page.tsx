"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const raw = await res.text();
      const data = raw ? JSON.parse(raw) : {};
      if (!res.ok) return setError(data.error || "Falha no login");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Erro inesperado ao entrar. Verifique as variáveis do Supabase.");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center p-4">
      <form onSubmit={onSubmit} className="card w-full p-6">
        <h1 className="mb-4 text-2xl font-bold">Entrar</h1>
        <label className="label">E-mail</label>
        <input className="input mb-3" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label className="label">Senha</label>
        <input className="input mb-4" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        <button className="btn-primary w-full" type="submit">Acessar</button>
        <p className="mt-4 text-sm text-slate-600">Não tem conta? <Link href="/signup" className="text-blue-600">Cadastre-se</Link></p>
      </form>
    </main>
  );
}

