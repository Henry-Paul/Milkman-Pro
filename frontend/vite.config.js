import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Simple configuration for Netlify
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  server: {
    port: 3000
  }
})
