import {defineConfig} from 'vite'
import {VitePWA} from 'vite-plugin-pwa'
import {svelte} from '@sveltejs/vite-plugin-svelte'

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
				globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
				cleanupOutdatedCaches: true,
				clientsClaim: true,
				skipWaiting: true,
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'google-fonts-cache',
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
							},
							cacheableResponse: {
								statuses: [0, 200]
							}
						}
					},
					{
						urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'google-fonts-gstatic-cache',
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
							},
							cacheableResponse: {
								statuses: [0, 200]
							}
						}
					}
				]
			}
		})
	],
})
