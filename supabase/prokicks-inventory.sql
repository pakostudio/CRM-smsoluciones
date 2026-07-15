-- SM OS - Inventario ProKicks
-- Ejecutar en Supabase SQL Editor. No pegar llaves privadas en este archivo.

begin;

create extension if not exists pgcrypto;

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
  movement_type text not null check (movement_type in (
    'alta',
    'salida',
    'entrada',
    'devolucion',
    'asignacion_cliente',
    'mantenimiento',
    'cambio_estado',
    'importacion',
    'ajuste'
  )),
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

create index if not exists inventory_devices_status_idx on public.inventory_devices(status);
create index if not exists inventory_devices_cliente_idx on public.inventory_devices(cliente_id);
create index if not exists inventory_devices_responsable_idx on public.inventory_devices(responsable_id);
create index if not exists inventory_devices_devolucion_idx on public.inventory_devices(fecha_devolucion_prevista);
create index if not exists inventory_movements_device_idx on public.inventory_movements(device_id, created_at desc);
create index if not exists inventory_movements_code_idx on public.inventory_movements(code);

create or replace function public.set_inventory_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_inventory_devices_updated_at on public.inventory_devices;
create trigger trg_inventory_devices_updated_at
before update on public.inventory_devices
for each row
execute function public.set_inventory_updated_at();

insert into public.inventory_devices (code, status, notas)
select 'PK-' || lpad(gs::text, 4, '0'), 'Disponible', 'Carga inicial de 200 dispositivos ProKicks.'
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

create or replace function public.sm_next_inventory_code()
returns text
language sql
stable
as $$
  select 'PK-' || lpad((coalesce(max(substring(code from 4)::int), 0) + 1)::text, 4, '0')
  from public.inventory_devices
  where code ~ '^PK-[0-9]{4,}$';
$$;

alter table public.inventory_devices enable row level security;
alter table public.inventory_movements enable row level security;

-- Compatibilidad operativa:
-- La app actual usa login interno por PIN y llama PostgREST con llave anon.
-- Estas politicas mantienen el modulo funcional sin llaves privadas en frontend.
-- Cuando se migre a Supabase Auth, reemplazar por politicas estrictas basadas en auth.uid().
drop policy if exists inventory_devices_read_current_app on public.inventory_devices;
create policy inventory_devices_read_current_app
on public.inventory_devices
for select
to anon, authenticated
using (true);

drop policy if exists inventory_movements_read_current_app on public.inventory_movements;
create policy inventory_movements_read_current_app
on public.inventory_movements
for select
to anon, authenticated
using (true);

drop policy if exists inventory_devices_write_current_app on public.inventory_devices;
create policy inventory_devices_write_current_app
on public.inventory_devices
for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists inventory_movements_write_current_app on public.inventory_movements;
create policy inventory_movements_write_current_app
on public.inventory_movements
for all
to anon, authenticated
using (true)
with check (true);

-- Politicas objetivo por rol para Supabase Auth.
-- Se activan al remover las politicas *_current_app y poblar app_metadata.role.
create or replace function public.sm_auth_role()
returns text
language sql
stable
as $$
  select coalesce(
    nullif(auth.jwt() -> 'app_metadata' ->> 'role', ''),
    nullif(auth.jwt() ->> 'role', ''),
    'anon'
  );
$$;

-- Roles esperados: admin, responsable, colaborador, lectura.
-- admin: todo; responsable/colaborador: operar; lectura: solo consulta.
-- Estas politicas quedan listas para Supabase Auth. Mientras existan las
-- politicas *_current_app, la app actual por PIN conserva compatibilidad.
drop policy if exists inventory_devices_read_by_role on public.inventory_devices;
create policy inventory_devices_read_by_role
on public.inventory_devices
for select
to authenticated
using (public.sm_auth_role() in ('admin', 'responsable', 'colaborador', 'lectura'));

drop policy if exists inventory_devices_write_by_role on public.inventory_devices;
create policy inventory_devices_write_by_role
on public.inventory_devices
for all
to authenticated
using (public.sm_auth_role() in ('admin', 'responsable', 'colaborador'))
with check (public.sm_auth_role() in ('admin', 'responsable', 'colaborador'));

drop policy if exists inventory_movements_read_by_role on public.inventory_movements;
create policy inventory_movements_read_by_role
on public.inventory_movements
for select
to authenticated
using (public.sm_auth_role() in ('admin', 'responsable', 'colaborador', 'lectura'));

drop policy if exists inventory_movements_write_by_role on public.inventory_movements;
create policy inventory_movements_write_by_role
on public.inventory_movements
for insert
to authenticated
with check (public.sm_auth_role() in ('admin', 'responsable', 'colaborador'));

commit;
