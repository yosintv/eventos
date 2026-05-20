import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // Base path for deployment
  // For GitHub Pages subdirectory (yosintv.github.io/eventos): base: '/eventos/'
  // For custom domain (countdown.singhyogendra.com.np): base: '/'
  // NOTE: Update this based on your deployment target!
  base: '/eventos/',

  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Event Countdown',
        short_name: 'Countdown',
        description: 'Track upcoming events with live countdown timers',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/countdown-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/countdown-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  build: {
    // Ensure index.html is generated for SPA routing
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor'
            }
            return 'vendor'
          }
        },
      },
    },
  },
})
