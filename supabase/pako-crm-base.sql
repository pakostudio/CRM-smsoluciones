-- SM OS / CRM SM Soluciones - Base limpia para proyecto Supabase PAKO
-- Objetivo: crear un Supabase propio y controlado, sin depender del proyecto viejo.
-- Ejecutar como owner en un proyecto Supabase nuevo.

begin;

create extension if not exists pgcrypto;

create table if not exists public.usuarios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  username text unique,
  pin text,
  pin_hash text,
  rol text not null default 'responsable' check (rol in ('admin','responsable','colaborador','lectura','user')),
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  contacto text,
  email text,
  telefono text,
  drive_url text,
  dia_pago integer,
  dia_factura integer,
  estado text not null default 'activo',
  notas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.proyectos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references public.clientes(id) on delete set null,
  owner_id uuid references public.usuarios(id) on delete set null,
  nombre text not null,
  descripcion text,
  estado text not null default 'activo',
  prioridad text not null default 'media',
  presupuesto numeric default 0,
  drive_url text,
  fecha_inicio date,
  fecha_vencimiento date,
  pipeline text default 'prospecto',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tareas (
  id uuid primary key default gen_random_uuid(),
  proyecto_id uuid references public.proyectos(id) on delete cascade,
  owner_id uuid references public.usuarios(id) on delete set null,
  titulo text not null,
  descripcion text,
  prioridad text not null default 'media',
  estado text not null default 'pendiente',
  fecha_inicio date,
  fecha_vencimiento date,
  horas_estimadas numeric default 0,
  horas_reales numeric default 0,
  etapa_crm text,
  siguiente_accion text,
  fecha_proximo_seguimiento date,
  ultima_actividad timestamptz,
  probabilidad numeric,
  monto_estimado numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subtareas (
  id uuid primary key default gen_random_uuid(),
  tarea_id uuid not null references public.tareas(id) on delete cascade,
  owner_id uuid references public.usuarios(id) on delete set null,
  titulo text not null,
  estado text not null default 'pendiente',
  fecha_vencimiento date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.comentarios (
  id uuid primary key default gen_random_uuid(),
  tarea_id uuid not null references public.tareas(id) on delete cascade,
  usuario_id uuid references public.usuarios(id) on delete set null,
  texto text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.entregables (
  id uuid primary key default gen_random_uuid(),
  tarea_id uuid not null references public.tareas(id) on delete cascade,
  usuario_id uuid references public.usuarios(id) on delete set null,
  nombre text not null,
  url text,
  tipo text,
  version text,
  created_at timestamptz not null default now()
);

create table if not exists public.pagos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references public.clientes(id) on delete cascade,
  proyecto_id uuid references public.proyectos(id) on delete set null,
  concepto text not null,
  monto numeric not null default 0,
  estado text not null default 'pendiente',
  fecha_vencimiento date,
  fecha_pago date,
  notas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reuniones (
  id uuid primary key default gen_random_uuid(),
  proyecto_id uuid references public.proyectos(id) on delete cascade,
  titulo text not null,
  fecha date,
  hora text,
  asistentes text,
  notas text,
  acuerdos text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.prokicks_records (
  id uuid primary key default gen_random_uuid(),
  proyecto_id uuid references public.proyectos(id) on delete cascade,
  owner_id uuid references public.usuarios(id) on delete set null,
  tipo text not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.prokicks_settings (
  proyecto_id uuid primary key references public.proyectos(id) on delete cascade,
  owner_id uuid references public.usuarios(id) on delete set null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.usuarios(id) on delete set null,
  event_name text not null,
  properties jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

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
  status text not null check (status in ('sent','skipped','failed')),
  error text,
  sent_on date not null default current_date,
  sent_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

-- Inventario ProKicks formal
do $$
begin
  if not exists (select 1 from pg_type where typname = 'inventory_device_status') then
    create type public.inventory_device_status as enum (
      'Disponible',
      'En demostración',
      'Prestado',
      'En comodato',
      'Vendido',
      'Mantenimiento',
      'Dañado',
      'Extraviado',
      'Baja'
    );
  end if;
end $$;

create table if not exists public.inventory_devices (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^PK-[0-9]{4,}$'),
  status public.inventory_device_status not null default 'Disponible',
  proyecto_id uuid references public.proyectos(id) on delete set null,
  cliente_id uuid references public.clientes(id) on delete set null,
  cliente_nombre text,
  responsable_id uuid references public.usuarios(id) on delete set null,
  ubicacion text,
  fecha_salida date,
  fecha_devolucion_prevista date,
  fecha_entrada date,
  notas text,
  qr_payload text generated always as (code) stored,
  created_by uuid references public.usuarios(id) on delete set null,
  updated_by uuid references public.usuarios(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references public.inventory_devices(id) on delete cascade,
  code text not null,
  movement_type text not null check (movement_type in ('alta','salida','entrada','devolucion','asignacion_cliente','mantenimiento','cambio_estado','importacion','ajuste')),
  previous_status public.inventory_device_status,
  new_status public.inventory_device_status,
  cliente_id uuid references public.clientes(id) on delete set null,
  cliente_nombre text,
  responsable_id uuid references public.usuarios(id) on delete set null,
  fecha_movimiento timestamptz not null default now(),
  fecha_devolucion_prevista date,
  notas text,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references public.usuarios(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists proyectos_cliente_idx on public.proyectos(cliente_id);
create index if not exists tareas_proyecto_idx on public.tareas(proyecto_id);
create index if not exists tareas_owner_idx on public.tareas(owner_id);
create index if not exists subtareas_tarea_idx on public.subtareas(tarea_id);
create index if not exists comentarios_tarea_idx on public.comentarios(tarea_id, created_at desc);
create index if not exists prokicks_records_tipo_idx on public.prokicks_records(tipo);
create index if not exists inventory_devices_status_idx on public.inventory_devices(status);
create index if not exists inventory_devices_code_idx on public.inventory_devices(code);
create index if not exists inventory_movements_device_idx on public.inventory_movements(device_id, created_at desc);

create or replace view public.usuarios_publicos as
select id, nombre, username, rol, activo, created_at
from public.usuarios
where activo is true;

create or replace function public.sm_verify_pin(p_user_id uuid, p_pin text)
returns table (id uuid, nombre text, username text, rol text, activo boolean)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select u.id, u.nombre, u.username, u.rol, u.activo
  from public.usuarios u
  where u.id = p_user_id
    and u.activo is true
    and (
      (u.pin_hash is not null and u.pin_hash = crypt(p_pin, u.pin_hash))
      or (u.pin_hash is null and u.pin::text = p_pin)
    )
  limit 1;
end;
$$;

create or replace function public.sm_next_inventory_code()
returns text
language sql
stable
as $$
  select 'PK-' || lpad((coalesce(max(substring(code from 4)::int), 0) + 1)::text, 4, '0')
  from public.inventory_devices
  where code ~ '^PK-[0-9]{4,}$';
$$;

insert into public.usuarios (id, nombre, username, rol, activo)
values ('c9813255-ce7c-4bf6-aef9-47345ea6ea8e', 'Administrador', 'admin', 'admin', true)
on conflict (id) do nothing;

insert into public.proyectos (id, owner_id, nombre, descripcion, estado, prioridad, fecha_inicio)
values ('ec1a1a6d-6f2f-4235-b9c4-76110caf1206', 'c9813255-ce7c-4bf6-aef9-47345ea6ea8e', 'PROKICKS', 'Proyecto ProKicks migrado a Supabase PAKO.', 'activo', 'alta', current_date)
on conflict (id) do nothing;

insert into public.inventory_devices (code, status, proyecto_id, notas)
select 'PK-' || lpad(gs::text, 4, '0'), 'Disponible', 'ec1a1a6d-6f2f-4235-b9c4-76110caf1206', 'Carga inicial de 200 dispositivos ProKicks.'
from generate_series(1, 200) as gs
on conflict (code) do nothing;

insert into public.inventory_movements (device_id, code, movement_type, new_status, notas)
select d.id, d.code, 'alta', d.status, 'Carga inicial de inventario ProKicks.'
from public.inventory_devices d
where d.code between 'PK-0001' and 'PK-0200'
  and not exists (
    select 1
    from public.inventory_movements m
    where m.device_id = d.id
      and m.movement_type = 'alta'
  );

alter table public.usuarios enable row level security;
alter table public.clientes enable row level security;
alter table public.proyectos enable row level security;
alter table public.tareas enable row level security;
alter table public.subtareas enable row level security;
alter table public.comentarios enable row level security;
alter table public.entregables enable row level security;
alter table public.pagos enable row level security;
alter table public.reuniones enable row level security;
alter table public.prokicks_records enable row level security;
alter table public.prokicks_settings enable row level security;
alter table public.usage_events enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.notification_logs enable row level security;
alter table public.inventory_devices enable row level security;
alter table public.inventory_movements enable row level security;

-- Compatibilidad temporal con el login actual por PIN.
-- No expone llaves privadas; permite que el frontend actual opere.
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'usuarios','clientes','proyectos','tareas','subtareas','comentarios','entregables','pagos','reuniones',
    'prokicks_records','prokicks_settings','usage_events','notification_preferences','inventory_devices','inventory_movements'
  ]
  loop
    execute format('drop policy if exists sm_current_app_read on public.%I', tbl);
    execute format('create policy sm_current_app_read on public.%I for select to anon, authenticated using (true)', tbl);
    execute format('drop policy if exists sm_current_app_write on public.%I', tbl);
    execute format('create policy sm_current_app_write on public.%I for all to anon, authenticated using (true) with check (true)', tbl);
  end loop;
end $$;

grant select on public.usuarios_publicos to anon, authenticated;
grant execute on function public.sm_verify_pin(uuid, text) to anon, authenticated;
grant execute on function public.sm_next_inventory_code() to anon, authenticated;

commit;
