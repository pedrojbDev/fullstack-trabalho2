# Pedro Bastista
# Breno Sa
# Pedro Pina
# Kim Sameshima

# Link Vercel : https://fullstack-trabalho2.vercel.app/

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

## Arquitetura — Frontend, Backend e App (Next.js)

O projeto separa claramente **frontend** (UI e cliente browser), **backend** (regras de negócio e Supabase server) e **`app/`** (roteamento Next.js + APIs HTTP). Continua sendo um **monólito modular**: o backend agrupa módulos por domínio; o frontend agrupa componentes e utilitários de interface.

### Onde fica cada coisa

| Pasta | Responsabilidade |
|--------|------------------|
| `src/frontend/` | Páginas importam daqui: componentes (`components/`), utilitários de UI (`lib/utils`), cliente Supabase **browser** (`lib/supabase/client.ts`). |
| `src/backend/` | Serviços usados pelas rotas `app/api`: módulos de negócio (`modules/`), Supabase **server** (`lib/supabase/server.ts`), sessão compartilhada entre módulos. |
| `src/app/` | Rotas (`page.tsx`, `layout.tsx`), `globals.css` e **adaptadores HTTP** em `app/api/*/route.ts` (finais; delegam para `src/backend`). |

```
src/
├── app/                          # Next.js App Router (roteamento + API)
│   ├── (app)/                    # Rotas protegidas + layout com AppShell
│   ├── login/  signup/  page.tsx
│   ├── api/                      # Handlers HTTP → importam @/backend/modules/...
│   ├── layout.tsx
│   └── globals.css
│
├── backend/                      # “Servidor” / domínio (não importar em "use client")
│   ├── lib/supabase/server.ts    # createClient() com cookies (SSR / Route Handlers)
│   └── modules/                  # Monólito modular por domínio
│       ├── auth/
│       ├── clients/
│       ├── spaces/
│       ├── appointments/
│       ├── blocked-times/
│       ├── reminders/
│       ├── settings/
│       └── _shared/session.ts    # getCurrentUserOrThrow()
│
└── frontend/                     # UI e código orientado ao browser
    ├── lib/
    │   ├── supabase/client.ts    # createBrowserClient
    │   └── utils/                # cn(), tokens de status para badges
    └── components/
        ├── ui/
        ├── layout/               # AppShell
        └── dashboard/
```

### Imports sugeridos

- Do **frontend**: `@/frontend/components/...`, `@/frontend/lib/...`
- Do **backend** (apenas em Server Components, `route.ts`, `middleware` se aplicável): `@/backend/modules/...`, `@/backend/lib/...`
- **Evite** importar `src/backend` dentro de componentes com `"use client"` (acoplamento e risco de vazar código server).

### Por que Monólito Modular no backend?
- **Coesão por domínio**: tudo de “clients” fica em `backend/modules/clients`.
- **Acoplamento baixo**: módulos expõem `services.ts`; o app só chama essas funções nas APIs.
- **Evoluível**: os mesmos `services` podem virar chamadas a um servidor separado no futuro, trocando apenas a camada `app/api`.

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
