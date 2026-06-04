# MENLUN Control 360

MENLUN Control 360 es un MVP web estatico para operar y supervisar reportes internos por gerencia. Esta construido con HTML, CSS y JavaScript puro, sin backend ni base de datos por ahora.

El sistema usa identidad visual PMPS: Arial, azul marino `#0B2A4A`, cyan `#00A7D8`, blanco `#FFFFFF` y gris claro `#F4F7FA`.

## Usuarios demo

| Usuario | Email | Contrasena / PIN | Rol | Acceso |
| --- | --- | --- | --- | --- |
| Pako | `pako@menlun.com` | `1234` | Administrador General | Acceso total |
| Carmen | `carmen@menlun.com` | `1234` | Acceso Total Operativo | Acceso total |
| Direccion General | `direccion@menlun.com` | `1234` | Vista Ejecutiva | Dashboard, calendario y reportes |
| Produccion | `produccion@menlun.com` | `2401` | Gerente de Produccion | Solo Produccion |

Los demas gerentes usan el email de su gerencia y el PIN configurado en el panel Gerencias.

## Roles

- **Administrador General:** ve todos los modulos, gerencias, reportes, autorizaciones y dashboards.
- **Acceso Total Operativo:** ve todos los modulos operativos y administrativos.
- **Direccion General:** consulta informacion ejecutiva y reportes, sin edicion.
- **Gerente de area:** ve solo su gerencia, sus reportes, sus tareas, captura, kanban y calendario.

## Modulos incluidos

- Login demo por email y contrasena/PIN.
- Dashboard ejecutivo.
- Panel Carmen.
- Panel Gerencias.
- Captura de reportes.
- Kanban por estatus.
- Calendario mensual.
- Modulos por gerencia:
  - Produccion
  - Calidad
  - Compras
  - Almacen
  - Logistica
  - Mantenimiento
  - Ventas
  - Recursos Humanos
  - Contabilidad
  - Sistemas

## Flujo de operacion

1. El usuario inicia sesion con email y contrasena/PIN demo.
2. El sistema muestra solo los modulos permitidos para su rol.
3. Pako y Carmen pueden revisar el dashboard ejecutivo, Panel Carmen, Gerencias, reportes, kanban y calendario.
4. Direccion General puede consultar informacion ejecutiva, calendario y reportes por gerencia.
5. Cada gerente puede capturar reportes y revisar informacion de su propia area.
6. Los reportes alimentan tarjetas, tablas, bandejas de autorizacion, kanban y vistas por gerencia.

## Limitaciones actuales del MVP

- No hay backend.
- No hay base de datos.
- Los datos demo viven en `app.js`.
- Las acciones como editar, desactivar o revisar son simuladas.
- Los reportes capturados se mantienen solo durante la sesion del navegador.
- No hay autenticacion real ni seguridad productiva.

## Pendientes futuros

- Conectar backend y base de datos.
- Implementar autenticacion real.
- Persistir reportes, usuarios, gerencias y autorizaciones.
- Agregar carga real de evidencias.
- Agregar filtros avanzados por fecha, gerencia, estatus y prioridad.
- Exportar reportes a Excel/PDF.
- Agregar bitacora de cambios.
- Agregar permisos finos por accion.
- Crear version movil optimizada.
- Agregar pruebas automatizadas formales.

## Despliegue en GitHub Pages

1. Crear un repositorio en GitHub.
2. Subir estos archivos al repositorio:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `assets/pmps-logo.png`
   - `README.md`
3. Entrar a **Settings** del repositorio.
4. Ir a **Pages**.
5. En **Build and deployment**, seleccionar:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
6. Guardar la configuracion.
7. Esperar a que GitHub genere la URL publica.

La app puede ejecutarse directamente como sitio estatico porque no requiere servidor ni compilacion.
