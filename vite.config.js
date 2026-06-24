import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Colon360/',
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
