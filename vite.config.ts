import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 2505,
  },
  preview: {
    port: 7505,
  },
  plugins: [
    svelte(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg', 'offline.html', 'images/*.png'], // Ensures offline.html and icons are precached
      manifest: {
        name: 'JSON Formatter', // Changed name slightly for clarity
        short_name: 'JSON',
        description: 'A Progressive Web App for formatting JSON data.', // Added description
        start_url: '/',
        display: 'standalone',
        background_color: '#16191d',
        theme_color: '#16191d',
        icons: [
          {
            src: '/images/json-128.png', // Path relative to public directory
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: '/images/json-152.png',
            sizes: '152x152',
            type: 'image/png'
          },
          {
            src: '/images/json-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/images/json-256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: '/images/json-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'], // Default Workbox patterns, ensure assets are picked up
        navigateFallback: '/offline.html',
        // Optional: cleanup outdated caches
        cleanupOutdatedCaches: true
      }
    })
  ],
})
