import { useSyncExternalStore } from 'react'

/*
  Installing Memoraa and keeping it working offline: everything the page needs to know about that, in one
  place. The worker itself is scripts/sw-template.js (written to dist/sw.js at build time).

    initPwa()        called once at start-up (main.jsx): registers the worker (production only, so the dev
                     server's hot reload is never cached), captures the browser's install prompt, and
                     watches online/offline, install and update state.
    usePwa()         { canInstall, installed, ios, installHelp, offline, updateReady, supported }
    promptInstall()  shows the browser's own install dialog: 'accepted' | 'dismissed' | 'unavailable'
    applyUpdate()    activates the waiting worker and reloads, only when the person chose to.

  Browsers that can install from a button (Chrome, Edge, Samsung Internet, Android) fire
  beforeinstallprompt. iPhone, iPad and Safari have no such event; for them installHelp says how to do it by
  hand, and the UI shows that instead of a button that cannot work.
*/

// What kind of device is this? Pure, so it can be tested.
export function platformOf({ ua = '', platform = '', touchPoints = 0 } = {}) {
  const iPadOS = platform === 'MacIntel' && touchPoints > 1 // iPadOS reports itself as a Mac
  const ios = /iPad|iPhone|iPod/.test(ua) || iPadOS
  const safari = /^((?!chrome|android|crios|fxios|edgios).)*safari/i.test(ua)
  const android = /Android/i.test(ua)
  const mac = !ios && /Macintosh/.test(ua)
  return { ios, safari, android, mac }
}

// How to install where there is no install button. null where the button (or nothing) applies.
export function installHelpFor(p) {
  if (p.ios) return 'Tap the Share button, then Add to Home Screen.'
  if (p.mac && p.safari) return 'In the menu bar choose File, then Add to Dock.'
  return null
}

let state = {
  supported: false,
  canInstall: false,
  installed: false,
  installHelp: null,
  offline: false,
  updateReady: false,
}
let deferred = null
let waiting = null
let started = false
const listeners = new Set()

const set = (patch) => {
  state = { ...state, ...patch }
  listeners.forEach((l) => l())
}
const subscribe = (l) => {
  listeners.add(l)
  return () => listeners.delete(l)
}
const snapshot = () => state

export const usePwa = () => useSyncExternalStore(subscribe, snapshot, snapshot)

const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches ||
  window.matchMedia?.('(display-mode: minimal-ui)').matches ||
  window.navigator.standalone === true

export async function promptInstall() {
  if (!deferred) return 'unavailable'
  const ev = deferred
  deferred = null
  set({ canInstall: false })
  try {
    await ev.prompt()
    const { outcome } = await ev.userChoice
    return outcome === 'accepted' ? 'accepted' : 'dismissed'
  } catch {
    return 'unavailable'
  }
}

export function applyUpdate() {
  if (!waiting) return
  navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload(), { once: true })
  waiting.postMessage('SKIP_WAITING')
}

function watchRegistration(reg) {
  const note = (worker) => {
    waiting = worker
    set({ updateReady: true })
  }
  if (reg.waiting && navigator.serviceWorker.controller) note(reg.waiting)
  reg.addEventListener('updatefound', () => {
    const w = reg.installing
    w?.addEventListener('statechange', () => {
      // "installed" with an existing controller is an UPDATE; without one it is the very first install.
      if (w.state === 'installed' && navigator.serviceWorker.controller) note(w)
    })
  })
  // Look for a new version when the app comes back to the front, and every hour it stays open.
  const check = () => reg.update().catch(() => {})
  document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && check())
  setInterval(check, 60 * 60 * 1000)
}

export function initPwa() {
  if (started || typeof window === 'undefined') return
  started = true
  const p = platformOf({ ua: navigator.userAgent, platform: navigator.platform, touchPoints: navigator.maxTouchPoints })
  const installed = isStandalone()
  set({
    supported: 'serviceWorker' in navigator,
    installed,
    installHelp: installed ? null : installHelpFor(p),
    offline: navigator.onLine === false,
  })

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault() // keep it for our own button, instead of the browser's mini-bar
    deferred = e
    set({ canInstall: true })
  })
  window.addEventListener('appinstalled', () => {
    deferred = null
    set({ installed: true, canInstall: false, installHelp: null })
  })
  window.matchMedia?.('(display-mode: standalone)').addEventListener?.('change', (e) => {
    if (e.matches) set({ installed: true, canInstall: false, installHelp: null })
  })
  window.addEventListener('online', () => set({ offline: false }))
  window.addEventListener('offline', () => set({ offline: true }))

  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then(watchRegistration)
        .catch(() => {
          /* no worker (private window, blocked): the site still works online */
        })
    })
  }
}
