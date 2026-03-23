import {defineConfig} from 'vite'
import {VitePWA} from 'vite-plugin-pwa'
import {svelte} from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
	base: './',
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
			includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg', 'images/*.png'], 
			manifest: {
				name: 'JSON Formatter',
				short_name: 'JSON',
				description: 'A Progressive Web App for formatting JSON data.',
				theme_color: '#0a0a0a',
				background_color: '#0a0a0a',
				display: 'standalone',
				icons: [
					{
						src: 'images/json-128.png',
						sizes: '128x128',
						type: 'image/png'
					},
					{
						src: 'images/json-192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'images/json-512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable'
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
				cleanupOutdatedCaches: true,
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'google-fonts-cache',
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60 * 24 * 365
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
								maxAgeSeconds: 60 * 60 * 24 * 365
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
