/*
  Memoraa service worker. Not served from here: scripts/generate-sw.mjs fills in VERSION and PRECACHE from
  the finished build and writes dist/sw.js. It is only registered in production (src/lib/pwa.js).

  What it does
    precache   every built script, style and font, each page's HTML, the icons, brand marks and the offline
               page, so the app opens and runs with no connection after the first visit.
    pages      network first (3 second patience) then the cached page, then the single-page fallback for
               /start, /study and /mock routes, then offline.html. The app is a client-side app, so any cached
               shell can render any route.
    /assets    cache first: every file name carries a content hash, so a cached copy is never stale.
    papers     past-paper images and pyodide (large) are cached the first time they are opened, cache first,
               kept to a fixed number of entries so storage never grows without limit. A question you have
               opened once works offline.
    images     hero, mascots and og: stale while revalidate.
    updates    a new worker waits; the page asks the person (src/lib/pwa.js) and then sends SKIP_WAITING.
               Nothing is replaced under someone mid-question.
  Cross-origin requests (Firebase, Mistral, Spotify) and anything that is not a GET are never touched.
*/
const VERSION = '__VERSION__'
const PRECACHE = `memoraa-precache-${VERSION}`
const RUNTIME = 'memoraa-runtime-v1'
const PAPERS = 'memoraa-papers-v1'
const MAX_PAPERS = 400
const PRECACHE_URLS = __PRECACHE__
const SPA_ROOTS = ['/start/', '/study/', '/mock/']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(PRECACHE).then((c) => c.addAll(PRECACHE_URLS)))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) {
        if (key.startsWith('memoraa-precache-') && key !== PRECACHE) await caches.delete(key)
      }
      if (self.registration.navigationPreload) await self.registration.navigationPreload.enable().catch(() => {})
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting()
  if (event.data === 'GET_VERSION') event.source?.postMessage({ type: 'VERSION', version: VERSION })
})

const trim = async (name, max) => {
  const cache = await caches.open(name)
  const keys = await cache.keys()
  if (keys.length > max) await Promise.all(keys.slice(0, keys.length - max).map((k) => cache.delete(k)))
}

const cacheFirst = async (request, cacheName, max) => {
  const hit = await caches.match(request)
  if (hit) return hit
  const res = await fetch(request)
  if (res.ok) {
    const cache = await caches.open(cacheName)
    await cache.put(request, res.clone())
    if (max) trim(cacheName, max)
  }
  return res
}

const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(RUNTIME)
  const hit = await cache.match(request)
  const net = fetch(request)
    .then((res) => {
      if (res.ok) cache.put(request, res.clone())
      return res
    })
    .catch(() => hit)
  return hit || net
}

// A cached copy of this page, or of the shell that can render it. `last` adds the offline page.
const cachedPage = async (url, last) => {
  const path = url.pathname.replace(/\/$/, '') || '/'
  const tries = [path]
  const spa = SPA_ROOTS.find((r) => url.pathname.startsWith(r))
  if (spa) tries.push(`${spa}index.html`)
  tries.push('/')
  if (last) tries.push('/offline.html')
  for (const t of tries) {
    const hit = await caches.match(t, { ignoreSearch: true })
    if (hit) return hit
  }
  return null
}

const navigate = async (event) => {
  const url = new URL(event.request.url)
  const net = (async () => (await event.preloadResponse) || fetch(event.request))()
  net.catch(() => {}) // a late failure after we answered from the cache is not an error
  const patience = new Promise((resolve) => setTimeout(() => resolve(null), 3000))
  try {
    const first = await Promise.race([net, patience])
    if (first) return first
    // The network is slow: show the saved page now if there is one, otherwise keep waiting for it.
    return (await cachedPage(url, false)) || (await net)
  } catch {
    return (await cachedPage(url, true)) || Response.error()
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET' || request.headers.has('range')) return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(navigate(event))
    return
  }
  if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/icons/') || url.pathname.startsWith('/brand/')) {
    event.respondWith(cacheFirst(request, RUNTIME))
    return
  }
  if (url.pathname.startsWith('/past-papers/') || url.pathname.startsWith('/pyodide/')) {
    event.respondWith(cacheFirst(request, PAPERS, MAX_PAPERS))
    return
  }
  if (/^\/(hero|mascots|og)\//.test(url.pathname) || url.pathname === '/favicon.svg') {
    event.respondWith(staleWhileRevalidate(request))
  }
})
