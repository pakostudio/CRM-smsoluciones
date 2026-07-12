# SM OS 2.5 - Seguridad, roles y alertas

## Implementado

- Roles formales en frontend: administrador, responsable, colaborador y solo lectura.
- Acciones administrativas restringidas para creacion/edicion de proyectos y usuarios.
- Preparacion de migracion segura de PIN con `pin_hash`, vista `usuarios_publicos` y RPC `sm_verify_pin`.
- Base de alertas por correo con Resend usando funciones serverless de Vercel.
- Cron diario de alertas para vencimientos, seguimientos, tareas sin accion y proximos vencimientos.
- Bitacora de envios en `notification_logs`.
- Preferencias por usuario para correo, resumen diario y hora del resumen.
- Headers basicos de seguridad en `vercel.json`.
- Documentacion operativa para Supabase, Resend y Vercel.

## Pendiente antes de declarar seguridad cerrada

- Ejecutar `supabase/security-hardening.sql` en Supabase.
- Ejecutar `supabase/notifications.sql` en Supabase.
- Configurar variables privadas en Vercel.
- Migrar de PIN local a Supabase Auth o sesiones firmadas para RLS real por usuario.
- Revisar dominio verificado en Resend para evitar problemas de entrega.

## No incluido por decision de producto

- Mensajeria externa.
- SMS.
- Facturacion.
- ERP.
- IA dentro del producto.
