-- AgendaFlow schema
create extension if not exists "uuid-ossp";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists clients (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  notes text,
  is_archived boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists spaces (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  capacity int,
  location text,
  is_active boolean not null default true,
  is_archived boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists appointments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid not null references clients(id),
  space_id uuid not null references spaces(id),
  title text not null,
  description text,
  date date not null,
  start_time time not null,
  end_time time not null,
  status text not null check (status in ('scheduled','confirmed','pending','cancelled','completed','blocked')),
  category_color text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists blocked_times (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  space_id uuid references spaces(id),
  title text not null,
  reason text,
  date date not null,
  start_time time not null,
  end_time time not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists reminders (
  id uuid primary key default uuid_generate_v4(),
  appointment_id uuid not null references appointments(id) on delete cascade,
  type text not null default 'email',
  scheduled_for timestamptz not null,
  status text not null default 'pending' check (status in ('pending','sent','failed')),
  sent_at timestamptz,
  message text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists agenda_settings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  opening_time time not null,
  closing_time time not null,
  appointment_duration_minutes int not null,
  interval_minutes int not null,
  default_view text not null check (default_view in ('day','week','month')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_clients_user on clients(user_id);
create index if not exists idx_spaces_user on spaces(user_id);
create index if not exists idx_appointments_user on appointments(user_id);
create index if not exists idx_appointments_date on appointments(date);
create index if not exists idx_appointments_space on appointments(space_id);
create index if not exists idx_appointments_status on appointments(status);
create index if not exists idx_blocked_user on blocked_times(user_id);

alter table profiles enable row level security;
alter table clients enable row level security;
alter table spaces enable row level security;
alter table appointments enable row level security;
alter table blocked_times enable row level security;
alter table reminders enable row level security;
alter table agenda_settings enable row level security;

create policy "profiles own" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "clients own" on clients for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "spaces own" on spaces for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "appointments own" on appointments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "blocked own" on blocked_times for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "settings own" on agenda_settings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "reminders own by appt" on reminders for all using (
  exists(select 1 from appointments a where a.id = reminders.appointment_id and a.user_id = auth.uid())
) with check (
  exists(select 1 from appointments a where a.id = reminders.appointment_id and a.user_id = auth.uid())
);

