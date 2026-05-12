import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center p-6 text-center">
      <h1 className="mb-3 text-4xl font-bold text-blue-600">AgendaFlow</h1>
      <p className="mb-6 text-slate-600">Gestão de agenda, clientes, espaços, bloqueios e lembretes.</p>
      <div className="flex gap-3">
        <Link href="/login" className="btn-primary">Entrar</Link>
        <Link href="/signup" className="btn-secondary">Criar conta</Link>
      </div>
    </main>
  );
}

