import './app.css'

import { mount } from 'svelte'
import App from './App.svelte'

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration: ServiceWorkerRegistration) => {
            console.log('Service Worker registered with scope:', registration.scope)
        })
        .catch((error) => {
            console.error('Service Worker registration failed:', error)
        })
}

const app = mount(App, { target: document.getElementById('app') })

export default app
