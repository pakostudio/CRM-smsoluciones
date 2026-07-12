-- SM CRM security hardening
-- Run in Supabase SQL Editor as database owner.
-- Purpose:
-- 1) Stop exposing PIN values to the browser/API.
-- 2) Validate PIN through a SECURITY DEFINER function.
-- 3) Normalize roles: admin, responsable, colaborador, lectura.
-- 4) Prepare the database for real RLS enforcement.

begin;

create extension if not exists pgcrypto;

-- Normalize role names without breaking existing "user" accounts.
update public.usuarios
set rol = 'responsable'
where lower(coalesce(rol, '')) in ('', 'user', 'usuario');

alter table public.usuarios
  drop constraint if exists usuarios_rol_check;

alter table public.usuarios
  add constraint usuarios_rol_check
  check (rol in ('admin', 'responsable', 'colaborador', 'lectura'));

-- Store hashed PINs. Keep the old pin column temporarily for migration/fallback,
-- but revoke direct read access below.
alter table public.usuarios
  add column if not exists pin_hash text;

update public.usuarios
set pin_hash = crypt(pin::text, gen_salt('bf'))
where pin_hash is null
  and pin is not null
  and pin::text <> '';

create or replace function public.sm_hash_user_pin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.pin is not null and new.pin::text <> '' then
    if tg_op = 'INSERT' then
      new.pin_hash = crypt(new.pin::text, gen_salt('bf'));
      new.pin = null;
    elsif new.pin is distinct from old.pin then
      new.pin_hash = crypt(new.pin::text, gen_salt('bf'));
      new.pin = null;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_sm_hash_user_pin on public.usuarios;
create trigger trg_sm_hash_user_pin
before insert or update of pin on public.usuarios
for each row
execute function public.sm_hash_user_pin();

-- Remove plaintext PINs after hashing existing values.
update public.usuarios
set pin = null
where pin_hash is not null;

-- Public-safe user directory for the login selector.
create or replace view public.usuarios_publicos as
select id, nombre, username, rol, activo, created_at
from public.usuarios
where activo is true;

-- Validate PIN without returning or exposing the PIN/hash.
create or replace function public.sm_verify_pin(p_user_id uuid, p_pin text)
returns table (
  id uuid,
  nombre text,
  username text,
  rol text,
  activo boolean
)
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

revoke all on function public.sm_verify_pin(uuid, text) from public;
grant execute on function public.sm_verify_pin(uuid, text) to anon, authenticated;

grant select on public.usuarios_publicos to anon, authenticated;

-- Column-level protection. The app should use usuarios_publicos + sm_verify_pin.
revoke select (pin) on public.usuarios from anon, authenticated;
revoke select (pin_hash) on public.usuarios from anon, authenticated;

-- RLS base switch. WARNING:
-- Full per-user RLS needs Supabase Auth or signed server-issued sessions.
-- With the current static PIN-only app, Postgres cannot reliably know which
-- app user is making a direct REST request. Do not enable restrictive policies
-- for proyectos/tareas until the frontend uses Supabase Auth or RPC-only access.
alter table public.usuarios enable row level security;

drop policy if exists usuarios_public_directory on public.usuarios;
create policy usuarios_public_directory
on public.usuarios
for select
to anon, authenticated
using (activo is true);

-- Recommended next stage after moving to Supabase Auth:
-- 1) Add auth_user_id uuid to usuarios, linked to auth.users(id).
-- 2) Replace localStorage PIN session with Supabase auth session.
-- 3) Enable RLS on proyectos/tareas/subtareas/comentarios/entregables/pagos.
-- 4) Use policies like:
--
-- create policy proyectos_admin_all on public.proyectos
-- for all to authenticated
-- using (
--   exists (
--     select 1 from public.usuarios u
--     where u.auth_user_id = auth.uid()
--       and u.rol = 'admin'
--   )
-- )
-- with check (
--   exists (
--     select 1 from public.usuarios u
--     where u.auth_user_id = auth.uid()
--       and u.rol = 'admin'
--   )
-- );
--
-- create policy proyectos_visible_to_assigned on public.proyectos
-- for select to authenticated
-- using (
--   owner_id in (select id from public.usuarios where auth_user_id = auth.uid())
--   or exists (
--     select 1
--     from public.tareas t
--     join public.usuarios u on u.id = t.owner_id
--     where t.proyecto_id = proyectos.id
--       and u.auth_user_id = auth.uid()
--   )
-- );

commit;
