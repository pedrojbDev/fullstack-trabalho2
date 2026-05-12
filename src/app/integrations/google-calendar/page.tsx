export default function GoogleIntegrationPage() {
  return (
    <div className="card space-y-3 p-6">
      <h1 className="text-2xl font-bold">Integração Google Agenda</h1>
      <p className="text-slate-600">Nesta versão acadêmica, a integração funciona por exportação de link de evento no detalhe/lista de compromissos.</p>
      <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
        <li>Status: integração por link ativa</li>
        <li>OAuth real: planejado para evolução futura</li>
        <li>Sem dependência de credenciais Google para o MVP</li>
      </ul>
      <p className="text-sm text-slate-500">Use o botão "Exportar Google" em compromissos para abrir o evento pré-preenchido no Google Calendar.</p>
    </div>
  );
}

