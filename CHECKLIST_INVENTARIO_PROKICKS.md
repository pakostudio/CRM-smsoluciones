# Checklist Inventario ProKicks

## Base de datos

- [ ] Ejecutar `supabase/prokicks-inventory.sql` en Supabase.
- [ ] Confirmar que existen `inventory_devices` e `inventory_movements`.
- [ ] Confirmar que existen `PK-0001` a `PK-0200`.
- [ ] Confirmar que `code` es único.
- [ ] Confirmar que RLS está habilitado en ambas tablas.

## Frontend

- [ ] Abrir SM OS.
- [ ] Entrar como administrador o responsable ProKicks.
- [ ] Abrir **Operación ProKicks**.
- [ ] Abrir pestaña **Inventario dispositivos**.
- [ ] Validar KPIs: registrados, disponibles, en campo, vencidos y siguiente código.
- [ ] Buscar manualmente `PK-0047`.
- [ ] Filtrar por estado.
- [ ] Filtrar por cliente.
- [ ] Filtrar por responsable.
- [ ] Filtrar por devolución vencida.

## Dispositivos

- [ ] Crear nuevo dispositivo y confirmar que sugiere `PK-0201` o el siguiente disponible.
- [ ] Abrir ficha del dispositivo.
- [ ] Registrar salida.
- [ ] Registrar entrada.
- [ ] Registrar devolución.
- [ ] Asignar cliente.
- [ ] Registrar mantenimiento.
- [ ] Ver historial completo de movimientos.

## QR

- [ ] Probar escáner con cámara en celular.
- [ ] Confirmar que el QR contiene solo el código, por ejemplo `PK-0047`.
- [ ] Confirmar que al escanear abre la ficha correcta.
- [ ] Confirmar que un código inexistente muestra aviso y lo deja en búsqueda.

## Importación / exportación

- [ ] Importar CSV con columnas `code,status,cliente_nombre,responsable,ubicacion,fecha_devolucion_prevista,notas`.
- [ ] Importar Excel `.xlsx` con las mismas columnas.
- [ ] Exportar CSV con filtros activos.
- [ ] Abrir CSV exportado y validar columnas.

## Móvil

- [ ] Revisar vista móvil en iPhone/Android.
- [ ] Confirmar que filtros no se enciman.
- [ ] Confirmar que tabla permite desplazamiento horizontal.
- [ ] Confirmar que la ficha se ve completa.
