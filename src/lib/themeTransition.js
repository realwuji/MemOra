import { flushSync } from 'react-dom'

/*
  Swaps the theme as a server flush: a rippled wave spreads out from the toggle
  button, and the new theme comes on behind it through a field of dots, like a
  bank of status lights coming up in the wake of a flush, instead of everything
  recolouring at once.

  It uses the View Transitions API. The browser snapshots the old page, the
  theme change runs, and the live new page is revealed through three things at
  once (the cross-fade the browser would otherwise play is switched off in
  index.css):

    - a rippled front: a clip-path polygon, a circle around the button whose
      radius is modulated by two sine waves of angle, so the edge undulates. The
      phase is random, so the ripple is different every time.
    - a soft trailing fade (server.css, --srv-reach): dots are absent at the
      front and reach full strength a few hundred pixels behind it, so the
      wave has a gentle, trailing edge.
    - four dot lattices of different pitch whose dots grow at different sizes
      and rates, so the page comes on in scattered patches, not one flat wipe.

  EVERYTHING IS CONTINUOUS. An earlier version grew the dots in stepped jumps
  and started the lattices at staggered delays. That read as the animation
  stuttering, so there are no steps and no start delays now: every part eases
  smoothly from the first frame and the unevenness comes from the lattices
  alone (different pitches, sizes and durations).

  Two things keep it clean:

    - flushSync: the browser takes the "after" picture the moment the update
      callback returns, so React has to have committed the new theme by then.
    - the `theme-switching` class on <html> turns off every CSS transition for
      the duration (except the toggle's own). Without it, colours would still
      be easing towards their new values inside the revealed area.

  With reduced motion requested, or a browser without the API, the theme just
  changes instantly.
*/

const DURATION_MS = 880
// One easing for the front and the fade, so their relationship never drifts.
const FRONT_EASING = 'cubic-bezier(0.4, 0, 0.15, 1)'
const POINTS = 120 // vertices around the ripple: enough that it reads as smooth

// A closed polygon around (x, y). The radius at each angle is `radius` times a
// ripple factor, so the edge undulates. The vertex count never changes, so the
// browser can animate between a small one and a large one.
function ripplePolygon(x, y, radius, phase) {
  const pts = []
  for (let i = 0; i < POINTS; i += 1) {
    const a = (i / POINTS) * Math.PI * 2
    const factor = 1 + 0.035 * Math.sin(a * 7 + phase) + 0.02 * Math.sin(a * 13 + phase * 1.7)
    const r = radius * factor
    pts.push(`${(x + Math.cos(a) * r).toFixed(1)}px ${(y + Math.sin(a) * r).toFixed(1)}px`)
  }
  return `polygon(${pts.join(', ')})`
}

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
  // Distance to the farthest corner: the front must travel at least this far.
  const corner = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
  const phase = Math.random() * Math.PI * 2

  // The mask's fade is centred on the button (server.css reads these).
  root.style.setProperty('--srv-x', `${x}px`)
  root.style.setProperty('--srv-y', `${y}px`)
  root.classList.add('theme-switching')
  const transition = document.startViewTransition(() => {
    flushSync(apply)
  })

  transition.ready
    .then(() => {
      const target = { pseudoElement: '::view-transition-new(root)' }
      const opts = { duration: DURATION_MS, easing: FRONT_EASING, fill: 'forwards', ...target }

      // The rippled front. The ripple dips to 0.945 of the radius at worst, so
      // the end radius is padded to still clear the farthest corner.
      root.animate(
        { clipPath: [ripplePolygon(x, y, 0, phase), ripplePolygon(x, y, corner * 1.12, phase)] },
        opts,
      )
      // The trailing fade. Starts far enough negative to be fully transparent
      // everywhere, and ends far enough out that it is at full strength over
      // the whole page in the last frame.
      root.animate({ '--srv-reach': ['-600px', `${corner + 360}px`] }, opts)
      // The four dot lattices (see server.css). Smooth, from the first frame,
      // each with its own size and duration so they never move together. The
      // dense 14px grid (--srv-a) must end larger than half its tile's
      // diagonal (9.9px) so the final frame is fully opaque.
      const grow = (name, to, ms, easing) =>
        root.animate({ [name]: ['0px', `${to}px`] }, { duration: ms, easing, fill: 'forwards', ...target })
      grow('--srv-b', 5, 760, 'cubic-bezier(0.2, 0.6, 0.3, 1)')
      grow('--srv-c', 7, 820, 'cubic-bezier(0.3, 0.5, 0.2, 1)')
      grow('--srv-d', 9, 860, 'cubic-bezier(0.25, 0.4, 0.2, 1)')
      grow('--srv-a', 11, DURATION_MS, 'cubic-bezier(0.35, 0, 0.2, 1)')
    })
    .catch(() => {})

  transition.finished.finally(() => {
    root.classList.remove('theme-switching')
    root.style.removeProperty('--srv-x')
    root.style.removeProperty('--srv-y')
  })
}
