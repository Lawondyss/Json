/// <reference lib="webworker" />

const timestamp = Date.now().toString()

/** @var {ServiceWorkerGlobalScope} worker */
const worker = self
const cacheName = `cache${timestamp}`
const filesToCache = [
    '/icon.svg',
    '/offline.html',
    '/manifest.json',
    '/images/json-128.png',
    '/images/json-152.png',
    '/images/json-192.png',
    '/images/json-256.png',
    '/images/json-512.png',
]

worker.addEventListener('install', /** @param {ExtendableEvent} evt */(evt) => {
    console.log('[ServiceWorker] Install')

    evt.waitUntil(
        caches
            .open(cacheName)
            .then((cache) => {
                console.log('[ServiceWorker] Pre-caching')
                return cache.addAll(filesToCache)
            })
            .then(() => worker.skipWaiting())
    )

})

worker.addEventListener('activate', (evt) => {
    console.log('[ServiceWorker] Activate')
    // remove previous cached data from disk
    evt.waitUntil(
        caches.keys().then(async (keys) => {
            for (const key of keys) {
                if (key !== cacheName) await caches.delete(key)
            }

            worker.clients.claim()
        })
    )
})

/**
 * Fetch the asset from the network and store it in the cache.
 * Fall back to the cache if the user is offline.
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function fetchAndCache(request) {
    const cache = await caches.open(cacheName)

    try {
        const response = await fetch(request)
        cache.put(request, response.clone())
        console.log(`[ServiceWorker] cached: ${request.url}`);

        return response

    } catch (err) {
        const response = await caches.match(request)
        if (response) return response

        throw err
    }
}

worker.addEventListener('fetch', /** @param {FetchEvent} evt */(evt) => {
    if (evt.request.method !== 'GET' || evt.request.headers.has('range')) return

    if (evt.request.url.startsWith('http')) {
        evt.respondWith(
            (async () => await caches.match(evt.request) || await fetchAndCache(evt.request) || caches.match('/offline.html'))()
        )
    }
})
