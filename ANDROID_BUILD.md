# Cómo generar el APK de Colón 360

## Requisitos
- Node.js instalado
- Android Studio instalado (https://developer.android.com/studio)

## Pasos

### 1. Instalar dependencias de Capacitor
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

### 2. Hacer el build de la app
```bash
npm run build
```

### 3. Agregar plataforma Android
```bash
npx cap add android
```

### 4. Sincronizar
```bash
npx cap sync android
```

### 5. Abrir en Android Studio
```bash
npx cap open android
```

### 6. Generar APK en Android Studio
- Menú: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
- El APK queda en: `android/app/build/outputs/apk/debug/app-debug.apk`

## Para publicar en Google Play Store
- Necesitás una cuenta de Google Play Developer ($25 pago único)
- En Android Studio usar: **Build → Generate Signed Bundle / APK**
