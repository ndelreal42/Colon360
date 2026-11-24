# Panel unificado de Colón 360

Un solo panel para todo: Inicio, Clientes, Fichas en la app, Eventos, Servicios,
Pendientes, Notificaciones, Cobros y Ajustes. Reemplaza al panel anterior en la
misma dirección: https://colon360-admin.pages.dev (misma clave de admin).

## Instalarlo (una sola vez) — en la compu, con cmd
GitHub Desktop: rama `panel-unificado` > Fetch/Pull > Repository > Open in Command Prompt.

1. Actualizar la base (agrega clientes, pendientes, notificaciones y "visible"):
   cd server
   npx wrangler d1 execute colon360 --remote --file=migracion-panel.sql
   (Si alguna línea dice "duplicate column name", esa parte ya estaba: no pasa nada.)
2. Subir la API nueva:
   npx wrangler deploy
3. Subir el panel:
   cd ..\admin
   npx wrangler pages deploy . --project-name=colon360-admin
   (si pide el nombre del proyecto y no es ese, usar el que figure en Cloudflare > Workers y Pages)

Importante: hacer el paso 1 ANTES del 2. Igual, si la API nueva se sube sin la
base actualizada, la app sigue funcionando como hoy y el panel avisa qué falta.

## Probar sin tocar nada real
Abrir el panel con `?demo` al final de la dirección, o tocar "Probar con datos de ejemplo".

## Qué cambia en la app (sin versión nueva de Google Play)
- Fichas y clientes "Ocultos" dejan de aparecer en la app (la API solo manda las visibles).
- Todo lo demás se ve igual que hoy.

## Manual y Notas (agregado 21/11/2026)
- Manual: procedimientos paso a paso (se tildan mientras los hacés) y se editan desde el panel.
  La primera vez, botón "Cargar el manual base".
- Notas: botón flotante "Nota" en todas las pantallas; se puede pegar a un cliente y ponerle día para recordar.
- Instalación (una sola vez), desde la carpeta server:
    npx wrangler d1 execute colon360 --remote --file=migracion-manual-notas.sql
    npx wrangler deploy
  y desde la carpeta admin:
    npx wrangler pages deploy . --project-name=colon360-admin
