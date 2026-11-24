# Login con Google (versión 1.2) — qué trae este zip

Archivos nuevos/cambiados (se copian encima del proyecto, respetando las carpetas):

- App: `src/App.jsx`, `src/lib/cuenta.js`, `src/components/CuentaPage.jsx`, `src/components/BienvenidaCuenta.jsx` (pantalla de bienvenida)
- Plugin: `package.json`, `package-lock.json`, `capacitor.config.json`
- Android: `android/app/build.gradle` (versión 1.2, versionCode 4)
- Servidor: `server/auth.js`, `server/worker.js`, `server/wrangler.toml`, `server/schema.sql`, `server/migracion-usuarios.sql`
- Web: `public/privacidad.html` (actualizada), `public/borrar-cuenta.html` (nueva)

## Orden de los pasos (uno por vez)
1. Copiar los archivos del zip encima de la carpeta del proyecto.
2. `npm install` (instala el plugin de Google).
3. Servidor: correr la migración UNA sola vez (`cd server` y `npx wrangler d1 execute colon360 --remote --file=migracion-usuarios.sql`).
4. Servidor: `npx wrangler deploy` (desde `server`).
5. Comprobar: abrir https://colon360-api.colon360.workers.dev/api/me → debe decir `{"error":"Sesión inválida"}`.
6. GitHub Desktop: commit + push (publica la política de privacidad y la página de borrado).
7. Android: `set BUILD_TARGET=capacitor&& npx vite build` y `npx cap sync android`.
8. Android Studio: generar APK firmado (release) con la llave de subida, instalarlo en el celular y probar el login.
9. Si anda: generar el AAB 1.2, subirlo a prueba cerrada y luego a producción. Actualizar el formulario "Seguridad de los datos" en Play Console.
