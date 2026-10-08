import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  server: {
    // CORS Proxy for Development
    proxy: {
      '/api': {
        target: 'https://your-backend-api.com', // REPLACE with your actual backend URL later
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  
  build: {
    // Optimize build for production (SEO & Performance)
    sourcemap: false
  }
})