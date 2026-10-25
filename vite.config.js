import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate', // Automatically updates the service worker in the background
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'robots.txt'],
      manifest: {
        name: 'Access Lingua',
        short_name: 'AccessLingua',
        description: 'Professional Interpretation Services - Bridging Languages, Connecting People.',
        theme_color: '#1A56DB', // Matches your brand-royal color
        background_color: '#ffffff',
        display: 'standalone', // Makes it look like a real app (hides browser URL bar)
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Required for Android adaptive icons
          }
        ]
      },
      workbox: {
        // Cache all static assets for instant loading and offline resilience
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,woff,ttf}'],
        // Ensure the app works offline by falling back to index.html for navigation requests
        navigateFallback: 'index.html',
        // Don't apply the fallback to API requests or external resources
        navigateFallbackDenylist: [/^\/api/, /^\/supabase/],
      },
      devOptions: {
        enabled: true // Allows testing PWA features in local development mode
      }
    })
  ],
  
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
    // Default chunking is already optimal, removing manualChunks prevents build errors
    sourcemap: false
  }
})