import { useEffect, useRef, useState } from 'react'
import { getAudioState, onAudioFrame, subscribeAudioState } from '@/lib/audioReactive'
import './atmosphere.css'

/*
  The page backdrop: a dense dot grid that behaves like a server, and changes
  character as you scroll so it matches what is being shown.

  Sections opt in with a data-bg attribute:

    data-bg="packets"  data streaming along rows       (hero, "doing work")
    data-bg="rack"     rack units with status LEDs     (dashboards, status)
    data-bg="bus"      packets down vertical lines     (flows, how it works)
    data-bg="log"      terminal log lines in the margins (footers, FAQ)

  An IntersectionObserver watches a thin band across the middle of the screen
  and switches the active mode to whichever tagged section is crossing it. The
  modes cross-fade, and an inactive mode is hidden with its animations paused,
  so only one set of effects ever runs. With no tagged section the default is
  "packets".

  The cursor addresses the grid like a memory cell: its row and column light up
  and one cell is selected where they cross. It snaps to cells and chases the
  pointer with a stepped delay.

  Everything is gradients, masks, transforms and opacity (see atmosphere.css),
  so it stays on the GPU. Reduced motion keeps only the static grid.
  High-contrast hides the whole layer (.atmosphere in index.css).
*/

const CELL = 14 // px, must match --bg-cell in atmosphere.css

// Packets along rows. `row` is a grid row, `dur` the seconds to cross the
// screen, `delay` a negative offset so packets are already mid-flight on load,
// `len` the trail length in px, `rtl` the direction. Fixed values, not random,
// so the layout is identical on every render.
const PACKETS = [
  { row: 2, dur: 7.5, delay: -2.1, len: 240, rtl: false },
  { row: 5, dur: 10, delay: -6.4, len: 300, rtl: true },
  { row: 8, dur: 6.2, delay: -1.3, len: 180, rtl: false },
  { row: 12, dur: 9, delay: -4.8, len: 260, rtl: true },
  { row: 15, dur: 11, delay: -9.2, len: 320, rtl: false },
  { row: 19, dur: 7, delay: -3.5, len: 200, rtl: true },
  { row: 23, dur: 8.5, delay: -7.7, len: 280, rtl: false },
  { row: 26, dur: 6.8, delay: -0.9, len: 220, rtl: true },
  { row: 30, dur: 10.5, delay: -5.6, len: 310, rtl: false },
  { row: 34, dur: 7.8, delay: -2.9, len: 190, rtl: true },
  { row: 38, dur: 9.6, delay: -8.3, len: 270, rtl: false },
  { row: 42, dur: 6.5, delay: -4.1, len: 230, rtl: true },
  { row: 46, dur: 11.5, delay: -10.4, len: 330, rtl: false },
  { row: 50, dur: 8, delay: -1.7, len: 210, rtl: true },
  { row: 55, dur: 9.2, delay: -6.9, len: 250, rtl: false },
  { row: 60, dur: 7.2, delay: -3.2, len: 200, rtl: true },
]

// Five blink layers (see atmosphere.css). Every duration and delay is different
// and none is a multiple of another, so the lights never fall into a rhythm.
const BLINKS = [
  { cls: 'a', blink: 3.1, delay: -0.7 },
  { cls: 'b', blink: 4.7, delay: -2.3 },
  { cls: 'c', blink: 6.3, delay: -4.1 },
  { cls: 'd', blink: 7.9, delay: -1.2 },
  { cls: 'e', blink: 11.3, delay: -6.8 },
]

// Packets down vertical lines (bus mode). `col` is a grid column.
const VPACKETS = [
  { col: 2, dur: 8, delay: -3.1, len: 260, up: false },
  { col: 5, dur: 10.5, delay: -7.4, len: 320, up: true },
  { col: 9, dur: 7, delay: -1.2, len: 200, up: false },
  { col: 13, dur: 9.5, delay: -5.5, len: 280, up: true },
  { col: 17, dur: 11, delay: -9.0, len: 300, up: false },
  { col: 21, dur: 6.8, delay: -2.4, len: 220, up: true },
  { col: 26, dur: 8.8, delay: -6.1, len: 260, up: false },
  { col: 31, dur: 7.6, delay: -0.6, len: 210, up: true },
  { col: 38, dur: 10, delay: -4.7, len: 290, up: false },
  { col: 46, dur: 9, delay: -8.2, len: 240, up: true },
  { col: 55, dur: 7.2, delay: -2.9, len: 230, up: false },
  { col: 66, dur: 11.5, delay: -10.1, len: 310, up: true },
  { col: 78, dur: 8.4, delay: -5.0, len: 250, up: false },
  { col: 90, dur: 9.8, delay: -1.9, len: 270, up: true },
]

// Log lines: for each of 12 rows (one tile = 168px), a few [x, width] bars.
// Built once into a stack of repeat-y background layers, one layer per bar.
const LOG_ROWS = [
  [[8, 60], [76, 90], [174, 40]],
  [[8, 30], [46, 120]],
  [[22, 150]],
  [[8, 44], [60, 26], [94, 100]],
  [],
  [[8, 88], [104, 64]],
  [[22, 36], [66, 140]],
  [[8, 110]],
  [[8, 52], [68, 52], [128, 70]],
  [],
  [[22, 96], [126, 60]],
  [[8, 70], [86, 30]],
]
const LOG_BAR = 'linear-gradient(to bottom, color-mix(in srgb, var(--fg) 34%, transparent) 0 4px, transparent 4px)'
const logBars = LOG_ROWS.flatMap((bars, r) => bars.map(([x, w]) => ({ x, w, y: r * CELL + 5 })))
const LOG_STYLE = {
  backgroundImage: logBars.map(() => LOG_BAR).join(','),
  backgroundSize: logBars.map((b) => `${b.w}px ${CELL * 12}px`).join(','),
  backgroundPosition: logBars.map((b) => `${b.x}px ${b.y}px`).join(','),
  backgroundRepeat: 'repeat-y',
}

// `defaultMode` is the effect shown until a [data-bg] section takes over, and
// the one used on pages with no tagged sections (the signed-in app uses 'rack').
export default function AtmosphereBackground({ defaultMode = 'packets' }) {
  const [mode, setMode] = useState(defaultMode)
  const ptrRef = useRef(null)
  const rootRef = useRef(null)

  // Switch mode to whichever [data-bg] section crosses the middle of the screen.
  useEffect(() => {
    const sections = document.querySelectorAll('[data-bg]')
    if (!sections.length || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setMode(e.target.dataset.bg)
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  // The cursor addresses the grid: snap to the cell under the pointer.
  useEffect(() => {
    const ptr = ptrRef.current
    if (!ptr) return undefined
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fine = window.matchMedia('(pointer: fine)')
    if (reduce.matches || !fine.matches) return undefined

    const [row, col, cell] = ptr.children
    // Each window is placed at (wx, wy); its bright grid is moved to (-wx, -wy)
    // so that grid stays pinned to the page. All values are whole pixels.
    const put = (win, wx, wy) => {
      win.style.transform = `translate3d(${wx}px, ${wy}px, 0)`
      win.firstElementChild.style.transform = `translate3d(${-wx}px, ${-wy}px, 0)`
    }
    const place = (x, y) => {
      const cx = Math.floor(x / CELL) * CELL
      const cy = Math.floor(y / CELL) * CELL
      put(row, cx - 360, cy)
      put(col, cx, cy - 360)
      put(cell, cx - CELL, cy - CELL)
    }
    place(window.innerWidth / 2, window.innerHeight * 0.4)

    let frame = 0
    let nextX = 0
    let nextY = 0
    const onMove = (e) => {
      nextX = e.clientX
      nextY = e.clientY
      // Hidden until the pointer first moves, so it never sits behind the
      // hero text at load.
      ptr.classList.add('on')
      if (frame) return
      // One style write per animation frame, however fast the pointer moves.
      frame = requestAnimationFrame(() => {
        frame = 0
        place(nextX, nextY)
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  // Audio reactivity (src/lib/audioReactive.js). While sync is on, the analyser
  // publishes level / bass / mid / treble / beat every frame. They are written
  // as CSS custom properties on THIS element only (so only this subtree is
  // restyled, not the whole page), and atmosphere.css turns them into effects
  // under `.reactive`: blinkers and rack LEDs follow the bands, the grid
  // brightens with loudness, the whole grid flashes on a beat. The packets and
  // log lines also speed up with the music, through their animations'
  // playbackRate. With sync off none of this runs.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    let anims = []
    let rate = 1

    const collect = () => {
      anims = root
        .getAnimations({ subtree: true })
        .filter((a) => /^bg-(packet|vpacket|log)/.test(a.animationName || ''))
    }
    const reset = () => {
      ;['level', 'bass', 'mid', 'treble', 'beat'].forEach((k) => root.style.removeProperty(`--au-${k}`))
      anims.forEach((a) => {
        a.playbackRate = 1
      })
      rate = 1
    }
    const applyState = (st) => {
      const on = Boolean(st.source)
      root.classList.toggle('reactive', on)
      if (on) collect()
      else reset()
    }

    applyState(getAudioState())
    const offState = subscribeAudioState(applyState)
    const offFrame = onAudioFrame((f) => {
      if (!root.classList.contains('reactive')) return
      root.style.setProperty('--au-level', f.level.toFixed(3))
      root.style.setProperty('--au-bass', f.bass.toFixed(3))
      root.style.setProperty('--au-mid', f.mid.toFixed(3))
      root.style.setProperty('--au-treble', f.treble.toFixed(3))
      root.style.setProperty('--au-beat', f.beat.toFixed(3))
      if (!reduce.matches) {
        const target = 1 + f.level * 1.4 + f.beat * 0.8
        rate += (target - rate) * 0.25
        anims.forEach((a) => {
          a.playbackRate = rate
        })
      }
    })
    return () => {
      offState()
      offFrame()
      reset()
      root.classList.remove('reactive')
    }
  }, [])

  const on = (m) => `bg-mode m-${m}${mode === m ? ' on' : ''}`

  return (
    <div
      ref={rootRef}
      className="atmosphere fixed inset-0 z-0 overflow-hidden bg-page"
      data-mode={mode}
      aria-hidden="true"
    >
      <div className="bg-lattice absolute inset-0" />

      <div className={on('packets')}>
        {BLINKS.map((b) => (
          <div
            key={b.cls}
            className={`bg-blink ${b.cls} absolute inset-0`}
            style={{ '--blink': `${b.blink}s`, '--delay': `${b.delay}s` }}
          />
        ))}
        {PACKETS.map((p) => (
          <div
            key={p.row}
            className={`bg-packet absolute${p.rtl ? ' rtl' : ''}`}
            style={{
              '--row': p.row,
              '--dur': `${p.dur}s`,
              '--delay': `${p.delay}s`,
              '--len': `${p.len}px`,
            }}
          >
            <i />
          </div>
        ))}
      </div>

      <div className={on('rack')}>
        {/* The two strips are different on purpose (see atmosphere.css): their
            LEDs have unrelated blink periods and the right strip has an extra
            sparse LED. */}
        <div className="bg-rack l">
          <div className="units" />
          <div className="led a" style={{ '--blink': '2.9s', '--delay': '-0.5s' }} />
          <div className="led b" style={{ '--blink': '4.3s', '--delay': '-2.2s' }} />
          <div className="led c" style={{ '--blink': '6.1s', '--delay': '-3.4s' }} />
        </div>
        <div className="bg-rack r">
          <div className="units" />
          <div className="led a" style={{ '--blink': '3.7s', '--delay': '-1.9s' }} />
          <div className="led b" style={{ '--blink': '5.3s', '--delay': '-0.6s' }} />
          <div className="led c" style={{ '--blink': '8.3s', '--delay': '-5.1s' }} />
          <div className="led d" style={{ '--blink': '9.7s', '--delay': '-7.4s' }} />
        </div>
      </div>

      <div className={on('bus')}>
        {VPACKETS.map((p) => (
          <div
            key={p.col}
            className={`bg-vpacket absolute${p.up ? ' up' : ''}`}
            style={{
              '--col': p.col,
              '--dur': `${p.dur}s`,
              '--delay': `${p.delay}s`,
              '--len': `${p.len}px`,
            }}
          >
            <i />
          </div>
        ))}
      </div>

      <div className={on('log')}>
        {['l', 'r'].map((side) => (
          <div key={side} className={`bg-log ${side}`}>
            <i style={{ ...LOG_STYLE, '--dur': side === 'l' ? '16s' : '21s' }} />
          </div>
        ))}
      </div>

      {/* Beat flash: a bright copy of the grid whose opacity follows --au-beat.
          Invisible (opacity 0) unless audio sync is on. */}
      <div className="bg-pulse absolute inset-0" />

      {/* A calm zone behind the content column: dims the grid and effects where
          text sits so body copy stays readable, and leaves the edges busy. */}
      <div className="bg-calm absolute inset-0" />

      <div ref={ptrRef} className="bg-ptr absolute inset-0">
        <div className="row"><i /></div>
        <div className="col"><i /></div>
        <div className="cell"><i /></div>
      </div>
    </div>
  )
}
