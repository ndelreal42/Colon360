# Cómo generar el APK/AAB de Colón 360

Actualizado: el proyecto Android ya está generado dentro de este repo (carpeta `android/`),
con Capacitor instalado y los íconos/splash reales de la app ya aplicados. Lo que falta es
compilarlo — para eso hace falta Android Studio (el entorno de Claude no tiene el Android SDK
disponible por política de red, así que no puede compilar el APK por vos).

## Requisitos
- Node.js instalado
- Android Studio instalado (https://developer.android.com/studio) — ya trae el Android SDK

## Flujo normal de trabajo (cada vez que cambiás código)

```bash
npm install                 # solo la primera vez, o si cambiaron las dependencias
npm run build:android       # genera dist-android/ con los paths correctos para la app nativa
npx cap sync android        # copia dist-android/ + plugins dentro de android/
npx cap open android        # abre el proyecto en Android Studio
```

> Importante: para la app nativa SIEMPRE usar `npm run build:android` (no `npm run build`).
> `npm run build` genera la versión para la web en GitHub Pages, con rutas distintas — si se
> usa por error para la app, la pantalla queda en blanco al abrir la app.

## Generar el APK (para probar en un celular / subir a testing cerrado)
Dentro de Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
El APK queda en: `android/app/build/outputs/apk/debug/app-debug.apk`

## Generar el AAB firmado (lo que pide Google Play para producción)
Google Play ya no acepta APK para publicar — pide un **Android App Bundle (.aab)** firmado.

Dentro de Android Studio: **Build → Generate Signed Bundle / APK → Android App Bundle**
- La primera vez vas a tener que crear un *keystore* (archivo de firma). Guardalo en un lugar
  seguro y hacé backup — si se pierde, no se puede volver a actualizar la app con el mismo
  identificador en Play Store.
- Alternativa más simple: dejar que Google gestione la firma con **Play App Signing** (lo
  recomendado, y lo que se sugiere en la guía de publicación).

## Pendiente de decidir antes de compilar el primer build "real"
- **Identificador de la app (`appId`)**: definido como `ar.com.colon360.app` (en
  `capacitor.config.json` y `android/app/build.gradle`). Es el único dato que queda fijo para
  siempre una vez publicada la primera versión en Play Store, así que si se quiere cambiar tiene
  que ser ANTES del primer build real — después no se puede. Si hace falta cambiarlo: no alcanza
  con editar esos dos archivos a mano, hay que borrar la carpeta `android/` entera y volver a
  correr `npx cap add android` (y `npx capacitor-assets generate --android` para los íconos) con
  el nuevo valor ya puesto en `capacitor.config.json`.
- **Versión**: `android/app/build.gradle` tiene `versionCode` y `versionName` — hay que subirlos
  en cada actualización que se publique.

## Para publicar en Google Play Store
- Necesitás una cuenta de Google Play Developer (USD 25, pago único).
- La política de privacidad ya existe en este repo: `public/privacidad.html` (se publica junto
  con el resto del sitio en GitHub Pages).
- Google exige un testing cerrado con 12 testers durante 14 días antes de habilitar producción
  (ver el cronograma del proyecto para las fechas).
