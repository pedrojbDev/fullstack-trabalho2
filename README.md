# AgendaFlow

Sistema acadêmico fullstack para gestão de agenda, clientes, espaços, bloqueios e lembretes.

## Objetivo
Entregar um MVP funcional e apresentável para disciplina de Desenvolvimento FullStack.

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + Auth + RLS)
- Zod + React Hook Form
- FullCalendar

## Funcionalidades
- Autenticação (login/signup)
- Dashboard protegido
- CRUD de clientes
- CRUD de espaços
- CRUD de compromissos com status
- Bloqueio de horários
- Calendário dia/semana/mês com cores por status
- Lembretes simulados
- Exportação para Google Agenda (link)
- Configurações da agenda

## Estrutura
- `src/app`: páginas e APIs
- `src/components`: componentes UI/layout
- `src/lib`: supabase, validações, utilitários
- `src/services`: regras de negócio
- `src/types`: tipos do domínio
- `supabase/migrations`: SQL de schema e RLS
- `supabase/seed.sql`: dados iniciais
- `docs/`: manual e entrega

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

