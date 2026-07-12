# Alertas por correo con Resend

SM OS ya tiene preferencias por usuario para correo y resumen diario. Esta capa agrega el envio seguro desde Vercel, sin exponer llaves privadas en el navegador.

## Variables de entorno en Vercel

Configurar en Project Settings -> Environment Variables:

- `RESEND_API_KEY`: llave privada de Resend.
- `ALERT_FROM_EMAIL`: remitente verificado, por ejemplo `SM OS <alertas@tudominio.com>`.
- `ALERT_REPLY_TO`: opcional.
- `SUPABASE_URL`: URL del proyecto Supabase.
- `SUPABASE_SERVICE_ROLE_KEY`: llave service role. Nunca ponerla en frontend.
- `CRON_SECRET`: recomendado para proteger el endpoint del cron.
- `SM_INTERNAL_API_TOKEN`: opcional para envios manuales administrativos.

## SQL requerido

Ejecutar en Supabase SQL Editor:

```sql
-- archivo: supabase/notifications.sql
```

Esto crea o actualiza:

- `notification_preferences`
- `notification_logs`
- indices para evitar duplicados de resumen diario

## Endpoints

- `GET /api/cron-daily-alerts`: envia resumen diario a responsables con pendientes vencidos, proximos, sin accion o con seguimiento vencido.
- `POST /api/send-alert`: envia un recordatorio manual de una tarea a un usuario. Requiere header `x-sm-admin-token`.

## Prueba rapida

```bash
curl "https://TU_URL.vercel.app/api/cron-daily-alerts?secret=TU_CRON_SECRET"
```

La respuesta debe regresar `ok: true` o indicar exactamente que variable de entorno falta.

## Criterios

- No usar canales de mensajeria externos.
- No guardar llaves privadas en GitHub.
- No enviar resumen duplicado el mismo dia por usuario.
- Registrar cada envio en `notification_logs`.
