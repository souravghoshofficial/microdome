import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://microdome-backend.vercel.app',
        changeOrigin: true,
        secure: true,
        // DO NOT use rewrite if your backend expects `/api`
        // rewrite: (path) => path.replace(/^\/api/, '') 
      }
    }
  }
})
