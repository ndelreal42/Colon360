import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// La web pública vive en GitHub Pages bajo /Colon360/, pero la app
// empaquetada con Capacitor se sirve desde la raíz del WebView — por eso
// el base path cambia según el target de build (ver scripts "build" vs
// "build:android" en package.json).
const isCapacitorBuild = process.env.BUILD_TARGET === 'capacitor'

export default defineConfig({
  plugins: [react()],
  base: isCapacitorBuild ? '/' : '/Colon360/',
  build: {
    outDir: isCapacitorBuild ? 'dist-android' : 'dist',
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
