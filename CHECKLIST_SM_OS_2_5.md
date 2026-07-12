# Checklist SM OS 2.5

## Seguridad

- [ ] Ejecutar `supabase/security-hardening.sql`.
- [ ] Confirmar que `usuarios_publicos` responde sin columnas `pin` ni `pin_hash`.
- [ ] Confirmar que `sm_verify_pin` permite login.
- [ ] Confirmar que el frontend ya no descarga PINs.
- [ ] Definir siguiente fase: Supabase Auth o sesiones firmadas para RLS real.

## Alertas por correo

- [ ] Ejecutar `supabase/notifications.sql`.
- [ ] Configurar `RESEND_API_KEY` en Vercel.
- [ ] Configurar `ALERT_FROM_EMAIL` con dominio verificado.
- [ ] Configurar `SUPABASE_URL`.
- [ ] Configurar `SUPABASE_SERVICE_ROLE_KEY`.
- [ ] Configurar `CRON_SECRET`.
- [ ] Probar `GET /api/cron-daily-alerts?secret=...`.
- [ ] Revisar registros en `notification_logs`.

## Roles

- [ ] Probar administrador: crear proyecto, editar proyecto, crear usuario, editar usuario.
- [ ] Probar responsable: editar tareas visibles.
- [ ] Probar colaborador: editar tareas visibles.
- [ ] Probar solo lectura: entrar, navegar y no poder editar.

## Operacion

- [ ] Confirmar deploy automatico en Vercel desde GitHub.
- [ ] Confirmar que el sitio responde 200.
- [ ] Confirmar que no hay llaves privadas en GitHub.
- [ ] Documentar rollback del ultimo commit estable.
