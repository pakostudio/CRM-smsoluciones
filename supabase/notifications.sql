-- SM OS 2.5 - Alertas por correo con Resend
-- Ejecutar en Supabase SQL Editor. No pegar llaves privadas en este archivo.

create table if not exists public.notification_preferences (
  user_id uuid primary key references public.usuarios(id) on delete cascade,
  email text,
  email_enabled boolean not null default true,
  browser_enabled boolean not null default true,
  daily_digest boolean not null default true,
  digest_hour integer not null default 8 check (digest_hour between 0 and 23),
  timezone text not null default 'America/Mexico_City',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.notification_preferences
  add column if not exists email text,
  add column if not exists email_enabled boolean not null default true,
  add column if not exists browser_enabled boolean not null default true,
  add column if not exists daily_digest boolean not null default true,
  add column if not exists digest_hour integer not null default 8,
  add column if not exists timezone text not null default 'America/Mexico_City',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.notification_logs (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  user_id uuid references public.usuarios(id) on delete set null,
  task_id uuid references public.tareas(id) on delete set null,
  project_id uuid references public.proyectos(id) on delete set null,
  recipient_email text not null,
  subject text not null,
  provider text not null default 'resend',
  provider_message_id text,
  status text not null check (status in ('sent', 'skipped', 'failed')),
  error text,
  sent_on date not null default current_date,
  sent_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists notification_logs_user_type_sent_idx
  on public.notification_logs(user_id, type, sent_on desc);

create index if not exists notification_logs_task_type_sent_idx
  on public.notification_logs(task_id, type, sent_on desc);

alter table public.notification_preferences enable row level security;
alter table public.notification_logs enable row level security;

-- El frontend puede leer preferencias no sensibles para pintar el panel.
drop policy if exists "notification_preferences_read_public" on public.notification_preferences;
create policy "notification_preferences_read_public"
  on public.notification_preferences for select
  using (true);

-- La escritura operativa queda pensada para el backend con service role.
-- Cuando migremos a Supabase Auth se reemplazara por politicas por usuario.
