import { CalendarRange, CheckCircle2, ExternalLink, Plug } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { PageHeader } from "@/shared/components/ui/page-header";

export default function GoogleIntegrationPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Integração com Google Agenda"
        description="Exporte seus compromissos diretamente para o Google Calendar."
      />

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600">
              <CalendarRange size={18} />
            </span>
            <div>
              <CardTitle>Google Calendar</CardTitle>
              <CardDescription>Exportação por link de evento</CardDescription>
            </div>
          </div>
          <Badge className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Ativo
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600">
          <p>
            Nesta versão acadêmica, a integração funciona por exportação direta
            via link pré-preenchido. Cada compromisso possui um botão "Exportar"
            que abre o evento no Google Agenda do usuário.
          </p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={14} className="mt-0.5 text-emerald-600" />
              Sem necessidade de credenciais Google para o MVP.
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={14} className="mt-0.5 text-emerald-600" />
              Status, título, descrição e horários são exportados.
            </li>
            <li className="flex items-start gap-2">
              <Plug size={14} className="mt-0.5 text-slate-400" />
              OAuth real planejado para versões futuras (Google Calendar API).
            </li>
          </ul>
          <a
            href="https://calendar.google.com"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            Abrir Google Calendar <ExternalLink size={14} />
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
