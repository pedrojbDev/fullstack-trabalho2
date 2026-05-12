# AgendaFlow

Sistema acadêmico fullstack para gestão de agenda, clientes, espaços, bloqueios e lembretes.

## Objetivo
Entregar um MVP funcional e apresentável para disciplina de Desenvolvimento FullStack, organizado em **arquitetura de Monólito Modular** e com interface moderna inspirada em SaaS de referência (Linear, Vercel, Stripe).

## Stack
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 (`@theme` em CSS) + Lucide React (ícones)
- Supabase (PostgreSQL + Auth + RLS)
- Zod + React Hook Form
- FullCalendar

## Funcionalidades
- Autenticação (login/signup) em tela split-screen
- Dashboard protegido com indicadores e próximos compromissos
- CRUD de clientes
- CRUD de espaços
- CRUD de compromissos com status (com detecção de conflitos)
- Bloqueio de horários
- Calendário dia/semana/mês com cores por status
- Lembretes simulados
- Exportação para Google Agenda (link)
- Configurações da agenda

## Arquitetura — Monólito Modular

O código é organizado por **domínio de negócio** (módulos) em vez de camadas técnicas. Cada módulo é autossuficiente — possui suas próprias regras, validações e tipos — e expõe apenas o necessário ao restante do app via seu arquivo `services.ts`.

```
src/
├── app/                       # Camada de roteamento (Next.js App Router)
│   ├── (app)/                 # Grupo de rotas protegidas (compartilha AppShell)
│   │   ├── layout.tsx         # Guard de autenticação + AppShell
│   │   ├── dashboard/
│   │   ├── calendar/
│   │   ├── appointments/
│   │   ├── clients/
│   │   ├── spaces/
│   │   ├── blocked-times/
│   │   ├── settings/
│   │   └── integrations/
│   ├── login/                 # Rotas públicas
│   ├── signup/
│   ├── api/                   # Endpoints REST (delegam para módulos)
│   ├── page.tsx               # Landing page
│   ├── layout.tsx             # Layout raiz
│   └── globals.css            # Tailwind v4 @theme + design tokens
│
├── modules/                   # Módulos de negócio (núcleo do monólito modular)
│   ├── auth/                  # Cada módulo expõe:
│   ├── clients/               #   - services.ts   (regras de negócio)
│   ├── spaces/                #   - validations.ts (Zod schemas)
│   ├── appointments/          #   - types.ts       (tipos do domínio)
│   ├── blocked-times/
│   ├── reminders/
│   ├── settings/
│   └── _shared/               # Helpers entre módulos (ex.: sessão)
│
└── shared/                    # Infra & UI compartilhadas (cross-cutting)
    ├── lib/
    │   ├── supabase/          # Clientes server/browser
    │   └── utils/             # cn(), status tokens
    └── components/
        ├── ui/                # Primitivos (Button, Input, Card, …)
        ├── layout/            # AppShell, sidebar, topbar
        └── dashboard/         # Widgets específicos
```

### Por que Monólito Modular?
- **Coesão por domínio**: tudo de “clients” fica em `modules/clients`, facilitando manutenção.
- **Acoplamento baixo**: módulos se comunicam só via `services`, sem importar entranhas uns dos outros.
- **Evoluível**: cada módulo poderia, no futuro, ser extraído como microsserviço com baixa fricção.
- **Camadas técnicas**: a camada `app/` cuida só de roteamento/UI, a camada `modules/` cuida do negócio, e `shared/` cuida de infra/UI reutilizável.

## Design system
- Cores: paleta `--color-brand-*` (indigo) definida em `globals.css` via `@theme`.
- Tipografia: Inter (via `next/font/google`).
- Componentes: Button, Input, Select, Textarea, Label, Card, Badge, StatusBadge, EmptyState, PageHeader.
- Ícones: Lucide React em toda a UI.

## Variáveis de ambiente
Copie `.env.example` para `.env.local` e configure:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Rodar localmente
```bash
npm install
npm run dev
```

## Banco / Supabase
1. Criar projeto no Supabase.
2. Rodar SQL de `supabase/migrations/20260508_init_agendaflow.sql` no SQL Editor.
3. (Opcional) rodar `supabase/seed.sql` ajustando `USER_ID`.

## Resumo de APIs
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET/POST/PATCH/DELETE /api/clients`
- `GET/POST/PATCH/DELETE /api/spaces`
- `GET/POST/PATCH /api/appointments`
- `GET/POST /api/blocked-times`
- `GET/POST /api/settings`
- `POST /api/reminders`

## Google Agenda
Versão atual usa link de exportação de evento.
Para OAuth real no futuro: criar app Google Cloud, implementar consent screen, callback OAuth e sincronização via Google Calendar API.

## Usuário de teste/demo
- Criar conta pela página `/signup`.
- A conta criada já serve para apresentação.

## Entrega
Ver `docs/ENTREGA.md` para checklist do ZIP.
