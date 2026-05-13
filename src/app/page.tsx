import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  CalendarCheck2,
  Clock3,
  Building2,
  Users,
  BellRing,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/frontend/components/ui/button";

const features = [
  {
    icon: Calendar,
    title: "Calendário inteligente",
    description:
      "Visualize dia, semana e mês com cores por status e detecção automática de conflitos.",
  },
  {
    icon: Users,
    title: "Gestão de clientes",
    description:
      "Cadastre contatos, mantenha histórico organizado e arquive sem perder dados.",
  },
  {
    icon: Building2,
    title: "Múltiplos espaços",
    description:
      "Crie salas, consultórios ou estúdios e controle a disponibilidade individualmente.",
  },
  {
    icon: Clock3,
    title: "Bloqueio de horários",
    description:
      "Proteja janelas indisponíveis e evite agendamentos em períodos críticos.",
  },
  {
    icon: BellRing,
    title: "Lembretes automáticos",
    description:
      "Programe lembretes por e-mail para reduzir faltas e melhorar a comunicação.",
  },
  {
    icon: ShieldCheck,
    title: "Seguro por padrão",
    description:
      "Autenticação Supabase + Row Level Security garantem isolamento total de dados.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur animate-fade-in-down">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm transition-transform duration-300 hover:scale-110 hover:rotate-6">
              <Sparkles size={18} />
            </span>
            <span className="text-base font-semibold tracking-tight text-slate-900">
              AgendaFlow
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Entrar
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="group">
                Criar conta
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="absolute -left-32 top-10 h-72 w-72 animate-float rounded-full bg-brand-200/40 blur-3xl" />
        <div
          className="absolute -right-32 top-32 h-72 w-72 animate-float rounded-full bg-pink-200/40 blur-3xl"
          style={{ animationDelay: "-3s" }}
        />
        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-20 text-center sm:pt-28">
          <span className="inline-flex animate-fade-in-up items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
            <Sparkles size={12} className="animate-pulse-soft text-brand-600" /> Sistema fullstack acadêmico
          </span>
          <h1 className="mt-6 animate-fade-in-up text-4xl font-semibold tracking-tight text-slate-900 animate-delay-100 sm:text-6xl">
            Sua agenda <span className="gradient-text">organizada</span>,<br className="hidden sm:block" />
            sem dor de cabeça.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl animate-fade-in-up text-base text-slate-600 animate-delay-200 sm:text-lg">
            Gerencie compromissos, clientes, espaços, bloqueios e lembretes em um único
            painel moderno, rápido e responsivo.
          </p>
          <div className="mt-8 flex animate-fade-in-up flex-wrap items-center justify-center gap-3 animate-delay-300">
            <Link href="/signup">
              <Button size="lg" className="group">
                Começar gratuitamente
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Já tenho conta
              </Button>
            </Link>
          </div>

          <div className="stagger mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-6 text-left sm:gap-10">
            {[
              { label: "Compromissos", value: "∞" },
              { label: "Clientes", value: "∞" },
              { label: "Setup", value: "<1 min" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                  {item.value}
                </p>
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 bg-slate-50/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Tudo para sua operação
            </h2>
            <p className="mt-3 text-slate-600">
              Funcionalidades pensadas para profissionais autônomos, consultórios,
              estúdios e pequenas equipes.
            </p>
          </div>
          <div className="stagger mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group hover-lift rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <span className="inline-grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <f.icon size={18} />
                </span>
                <h3 className="mt-4 text-base font-semibold text-slate-900 transition-colors group-hover:text-brand-700">
                  {f.title}
                </h3>
                <p className="mt-1 text-sm text-slate-600">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-100 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <CalendarCheck2 className="mx-auto h-10 w-10 animate-pop text-brand-600" />
          <h2 className="mt-4 animate-fade-in-up text-3xl font-semibold tracking-tight text-slate-900 animate-delay-100 sm:text-4xl">
            Pronto para começar?
          </h2>
          <p className="mt-3 animate-fade-in-up text-slate-600 animate-delay-200">
            Crie sua conta agora e tenha sua agenda funcionando em segundos.
          </p>
          <div className="mt-7 flex animate-fade-in-up justify-center gap-3 animate-delay-300">
            <Link href="/signup">
              <Button size="lg">Criar conta grátis</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Entrar
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-100 py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} AgendaFlow — Projeto acadêmico Fullstack.
        </div>
      </footer>
    </div>
  );
}
