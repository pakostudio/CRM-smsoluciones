# Inventario ProKicks

## Incluido

- Nueva pestaña **Inventario dispositivos** dentro de Operación ProKicks.
- Control individual de dispositivos con códigos `PK-0001` en adelante.
- Carga inicial SQL de `PK-0001` a `PK-0200`.
- Botón **Nuevo dispositivo** con siguiente código automático.
- Búsqueda manual por código, cliente, responsable, ubicación o notas.
- Filtros por estado, cliente, responsable y devolución vencida.
- Ficha por dispositivo con estado, cliente, responsable, ubicación, devolución y notas.
- Historial completo de movimientos.
- Movimientos: salida, entrada, devolución, asignación de cliente y mantenimiento.
- Importación CSV/Excel.
- Exportación CSV.
- Escaneo QR con cámara del celular usando `BarcodeDetector` cuando el navegador lo soporta.
- QR esperado: solo el código del equipo, por ejemplo `PK-0047`.

## Supabase

- Nueva migración: `supabase/prokicks-inventory.sql`.
- Tablas:
  - `inventory_devices`
  - `inventory_movements`
- RLS activado en ambas tablas.
- Políticas de compatibilidad con el login actual por PIN.
- Función `sm_next_inventory_code()` para obtener el siguiente código desde base de datos.

## Notas de seguridad

- No se agregaron llaves privadas al frontend.
- No se agregó WhatsApp, SMS, IA, NFC ni código de barras.
- El control estricto por rol a nivel base requiere migrar el login actual por PIN a Supabase Auth.
