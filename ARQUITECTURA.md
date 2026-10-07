# Arquitectura de Colón 360

Mapa rápido de dónde vive cada cosa, para que sea fácil encontrar y cambiar algo.

## Pantallas (qué ve el usuario)
| Pantalla | Archivo |
|---|---|
| Armado general, Inicio, listas (Playas / Comer / Alojamiento / Explorar), Agenda | `src/App.jsx` |
| Mapa | `src/components/MapView.jsx` |
| ¿Qué hago ahora? | `src/components/AhoraModePage.jsx` |
| Detalle de un lugar | `src/components/DetailPage.jsx` |
| Planner de viaje | `src/components/PlannerPage.jsx` |
| Servicios | `src/components/ServiciosPage.jsx` |
| Juegos | `src/components/JuegosPage.jsx` |
| Modo Relax | `src/components/RelaxPage.jsx` |
| Barra de abajo (Inicio, Playas, Comer, Explorar, Mapa) | `src/components/BottomNav.jsx` |

## Datos y lógica
- `src/data/lugares.js`: datos de respaldo de lugares, atractivos, servicios y marcadores del mapa.
- `src/data/geo.js`: coordenadas y zonas de afluencia.
- `src/data/juegos.js`: juegos.
- `src/lib/helpers.js`: horarios (¿abierto ahora?), distancias, abrir Maps/WhatsApp.
- `src/lib/planner.js`: lógica que arma el itinerario del Planner.
- `src/lib/eventos.js`: fechas de eventos y "próximo evento".
- `src/lib/api.js` + `src/hooks/*`: conexión con el servidor (Cloudflare Worker + base D1).
- `src/assets/images.js`: foto de portada e isotipo.

## Datos del servidor
Lugares, eventos, playas, restaurantes y alojamientos se cargan desde la API (`use*.js`).
Servicios, Juegos y Planner todavía usan los datos de respaldo locales; los hooks
`useServicios`, `useJuegos` y `useActividades` ya están listos para conectarlos más adelante.

## Cómo compilar
- Web (GitHub Pages): `npm run build`
- App Android: `npm run build:android`, luego `npx cap sync android` (ver `ANDROID_BUILD.md`).
