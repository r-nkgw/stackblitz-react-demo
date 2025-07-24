import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process': JSON.stringify({
      env: { NODE_ENV: process.env.NODE_ENV || 'development' },
      stdout: { isTTY: false }
    })
  }
})
