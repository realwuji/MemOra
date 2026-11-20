import { flushSync } from 'react-dom'

/*
  Swaps the theme as a circular reveal: the new theme grows out of the toggle
  as an expanding circle until it covers the whole page, instead of
  everything recolouring at once.

  It uses the View Transitions API. The browser snapshots the old page, the
  theme change runs, and the live new page is revealed through a clip-path
  circle centred on the button (the cross-fade the browser would otherwise
  play is switched off in index.css). Two things keep it clean:

    - flushSync: the browser takes the "after" picture the moment the update
      callback returns, so React has to have committed the new theme by then.
    - the `theme-switching` class on <html> turns off every CSS transition for
      the duration (except the toggle's own). Without it, colours would still
      be easing towards their new values inside the revealed circle.

  With reduced motion requested, or a browser without the API, the theme just
  changes instantly.
*/

// Quick on purpose, and close to constant speed: a slow reveal makes a theme
// switch feel like a loading screen, a fast one feels like a burst.
const DURATION_MS = 400
const EASING = 'cubic-bezier(0.4, 0.1, 0.3, 1)'

export function revealTheme(apply, originEl) {
  const root = document.documentElement
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced || typeof document.startViewTransition !== 'function' || !originEl) {
    apply()
    return
  }

  const box = originEl.getBoundingClientRect()
  const x = box.left + box.width / 2
  const y = box.top + box.height / 2
  // Far enough to reach the corner furthest from the button.
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

  root.classList.add('theme-switching')
  const transition = document.startViewTransition(() => {
    flushSync(apply)
  })

  transition.ready
    .then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: DURATION_MS, easing: EASING, pseudoElement: '::view-transition-new(root)' },
      )
    })
    .catch(() => {})

  transition.finished.finally(() => root.classList.remove('theme-switching'))
}
