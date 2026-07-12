# Seguridad SM CRM

## Estado aplicado en código

- Roles normalizados en frontend:
  - `admin`
  - `responsable`
  - `colaborador`
  - `lectura`
- Los usuarios con rol `lectura` pueden consultar, pero no operar tareas.
- Solo `admin` puede crear, editar o dar de baja proyectos.
- Solo `admin` puede crear, editar, activar o desactivar usuarios.
- El login intenta validar PIN con `sm_verify_pin`, una función segura de Supabase.
- Mientras la función no exista, el CRM conserva compatibilidad con el login anterior para no bloquear acceso.

## Pendiente obligatorio en Supabase

Ejecutar en Supabase SQL Editor:

```text
supabase/security-hardening.sql
```

Ese script:

- Crea `pin_hash`.
- Migra PIN actual a hash.
- Crea vista segura `usuarios_publicos`.
- Crea función `sm_verify_pin`.
- Revoca lectura directa de `pin` y `pin_hash`.
- Normaliza roles.
- Activa RLS base en `usuarios`.

## Siguiente etapa recomendada

Para RLS completo por proyecto/tarea se requiere Supabase Auth o sesiones firmadas por servidor.
Con una app 100% estática y PIN local, Postgres no puede saber de forma confiable qué usuario real hizo cada request directo.

La etapa ideal es:

1. Crear usuarios reales en Supabase Auth.
2. Relacionar `usuarios.auth_user_id` con `auth.users.id`.
3. Activar RLS en `proyectos`, `tareas`, `subtareas`, `comentarios`, `entregables`, `pagos`, `prokicks_records`.
4. Permitir:
   - `admin`: todo.
   - `responsable`: proyectos/tareas donde es responsable.
   - `colaborador`: tareas donde participa o proyectos asignados.
   - `lectura`: solo lectura de proyectos/tareas asignados.
