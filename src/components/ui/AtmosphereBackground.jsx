import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { getAudioState, onAudioFrame, subscribeAudioState } from '@/lib/audioReactive'
import { useFocusSignal } from '@/lib/focusMode'
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

  Focus mode (src/lib/focusMode.js) is a state on top of all of that. While a
  screen is focused work - reading notes, a question, a diagram - the lively
  effects would only compete with the page, so the backdrop goes quiet: a ring
  of the grid's own lit dots sweeps out from where you last pressed, and behind
  it the packets, lights and modes fall away to a faint resting grid. Leaving
  focus runs the same sweep the other way, closing in on the pointer. A backdrop
  that mounts already focused starts quiet with no sweep; a session that begins
  a moment after the page loads (a reload, a deep link) still sweeps, from where
  the pointer last was. Reduced
  motion swaps the sweep for an instant switch.

  Everything is gradients, masks, transforms and opacity (see atmosphere.css),
  so it stays on the GPU. Reduced motion keeps only the static grid.
  High-contrast hides the whole layer (.atmosphere in index.css).
*/

const CELL = 14 // px, must match --bg-cell in atmosphere.css

// Radius the focus ring grows to: the screen diagonal plus a margin, so it can
// reach any corner from wherever it starts.
const fieldRadius = () => `${Math.ceil(Math.hypot(window.innerWidth, window.innerHeight)) + 180}px`

// Equalizer geometry. A bar every second grid column (so there is a gap between
// bars), as tall as 45% of the screen at most, and offset from the bottom by the
// remainder of height / CELL so the bars' dots land exactly on the grid's rows.
const barGeometry = () => ({
  count: Math.max(8, Math.floor(window.innerWidth / (CELL * 2))),
  maxRows: Math.max(4, Math.floor((window.innerHeight * 0.45) / CELL)),
  bottom: window.innerHeight % CELL,
})

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

// Log lines (log mode): independent dashes of the grid's own dots drifting upward, a few per
// margin, well apart. `x` is the cell from the page edge, `n` the length in cells, `dur` the
// seconds to cross the screen (slow on purpose), `delay` a negative offset so they are already
// mid-flight on load, `peak` the brightest opacity (varied, none above .7, so it stays distant).
// Fixed values, not random, so the layout is identical on every render, and the two margins differ.
// See atmosphere.css.
const LOG_DASHES = {
  l: [
    { x: 0, n: 7, dur: 31, delay: -4, peak: 0.6 },
    { x: 2, n: 4, dur: 38, delay: -23, peak: 0.5 },
    { x: 1, n: 9, dur: 34, delay: -13, peak: 0.6 },
    { x: 4, n: 5, dur: 43, delay: -31, peak: 0.45 },
    { x: 0, n: 3, dur: 36, delay: -19, peak: 0.6 },
    { x: 3, n: 6, dur: 41, delay: -8, peak: 0.55 },
    { x: 1, n: 5, dur: 33, delay: -27, peak: 0.65 },
  ],
  r: [
    { x: 0, n: 5, dur: 37, delay: -11, peak: 0.65 },
    { x: 3, n: 8, dur: 44, delay: -29, peak: 0.5 },
    { x: 1, n: 4, dur: 32, delay: -2, peak: 0.65 },
    { x: 2, n: 7, dur: 40, delay: -17, peak: 0.55 },
    { x: 0, n: 9, dur: 35, delay: -25, peak: 0.6 },
    { x: 4, n: 3, dur: 46, delay: -36, peak: 0.45 },
  ],
}

// `defaultMode` is the effect shown until a [data-bg] section takes over, and
// the one used on pages with no tagged sections (the signed-in app uses 'rack').
export default function AtmosphereBackground({ defaultMode = 'packets' }) {
  const [mode, setMode] = useState(defaultMode)
  const ptrRef = useRef(null)
  const rootRef = useRef(null)
  const [geo, setGeo] = useState(barGeometry)
  const geoRef = useRef(geo)
  const barRefs = useRef([])
  const topRefs = useRef([])

  // ---- focus mode ---------------------------------------------------------
  // `focus` is the state; `sweeping` is true while the ring is travelling;
  // `settled` means the sweep is done (or there never was one), so the lively
  // modes can be switched off for good instead of running under a veil.
  const focus = useFocusSignal()
  const [settled, setSettled] = useState(focus)
  const [sweeping, setSweeping] = useState(false)
  const lastPt = useRef({ x: window.innerWidth / 2, y: window.innerHeight * 0.4 })

  // Where you last pressed or moved: the ring starts there.
  useEffect(() => {
    const rec = (e) => {
      lastPt.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('pointerdown', rec, { passive: true, capture: true })
    window.addEventListener('pointermove', rec, { passive: true })
    return () => {
      window.removeEventListener('pointerdown', rec, { capture: true })
      window.removeEventListener('pointermove', rec)
    }
  }, [])

  // The ring starts at the pointer and must be able to reach any corner from
  // there, so it always grows to a little more than the screen diagonal. The
  // same radius is used leaving focus, when the centre may have moved.
  //
  // While focused, `--fr` follows `--fR`, so changing `--fR` would itself start
  // a 2.6s transition: resizing the window (or a phone's address bar sliding
  // away) would replay the whole ring. So it is written with transitions off and
  // the style flushed before they come back, and it only ever jumps, unseen. A
  // resize in the middle of a sweep waits for that sweep to end, since turning
  // transitions off would cut it short.
  const sweepRef = useRef(false) // a --fr transition is running right now
  const fitRef = useRef(null)
  const fitPending = useRef(false)
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const fit = () => {
      const next = fieldRadius()
      if (root.style.getPropertyValue('--fR') === next) return
      root.style.transition = 'none'
      root.style.setProperty('--fR', next)
      getComputedStyle(root).getPropertyValue('--fr') // flush, so the jump is the "before" state
      root.style.removeProperty('transition')
    }
    fitRef.current = fit
    fit()
    const onResize = () => {
      if (sweepRef.current) fitPending.current = true
      else fit()
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  // The centre is set in the same commit that flips the class, so the browser
  // reads both in one style pass and the sweep starts from the right place. A
  // sweep already under way keeps its centre: --fx and --fy are not animated, so
  // moving them now would make the ring jump across the screen.
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (!sweepRef.current) {
      root.style.setProperty('--fx', `${Math.round(lastPt.current.x)}px`)
      root.style.setProperty('--fy', `${Math.round(lastPt.current.y)}px`)
    }
    // A resize that arrived during the last sweep is caught up with here, as
    // the new sweep starts (its target is the new radius, so nothing jumps).
    if (fitPending.current) {
      fitPending.current = false
      root.style.setProperty('--fR', fieldRadius())
    }
  }, [focus])

  // The sweep is a CSS transition of --fr (atmosphere.css), so its start and
  // end are events: they say when to show the ring and when the modes can stop.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const isRing = (e) => e.target === root && e.propertyName === '--fr'
    const onRun = (e) => {
      if (!isRing(e)) return
      sweepRef.current = true
      setSweeping(true)
    }
    // Only a sweep that ran to the end settles the modes. A cancelled one has
    // been replaced (focus came back mid-exit): by the time its cancel arrives
    // data-focus is already set again, and settling then would switch the
    // modes off while the new ring has barely left the pointer.
    const onEnd = (e) => {
      if (!isRing(e)) return
      sweepRef.current = false
      setSweeping(false)
      if (e.type !== 'transitionend') return
      if (root.hasAttribute('data-focus')) setSettled(true)
      // A resize that came in during the sweep is applied now that it is over.
      if (fitPending.current) {
        fitPending.current = false
        fitRef.current?.()
      }
    }
    root.addEventListener('transitionrun', onRun)
    root.addEventListener('transitionend', onEnd)
    root.addEventListener('transitioncancel', onEnd)
    return () => {
      root.removeEventListener('transitionrun', onRun)
      root.removeEventListener('transitionend', onEnd)
      root.removeEventListener('transitioncancel', onEnd)
    }
  }, [])

  // Leaving focus brings the modes back at once; entering waits for the sweep.
  // Where no sweep runs (reduced motion, no @property) settle after a moment.
  useEffect(() => {
    if (!focus) {
      setSettled(false)
      return undefined
    }
    const t = setTimeout(() => setSettled(true), 3100)
    return () => clearTimeout(t)
  }, [focus])

  // Keep the bar count and heights in step with the window.
  useEffect(() => {
    const onResize = () => {
      const next = barGeometry()
      geoRef.current = next
      setGeo(next)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

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
        .filter((a) => /^bg-(packet|vpacket|dash)/.test(a.animationName || ''))
    }
    const reset = () => {
      ;['level', 'bass', 'mid', 'treble', 'beat'].forEach((k) => root.style.removeProperty(`--au-${k}`))
      anims.forEach((a) => {
        a.playbackRate = 1
      })
      rate = 1
    }
    // Equalizer bars: each bar takes its share of the spectrum (low notes on the
    // left) and a ripple that rolls across them, stronger when it is loud, so the
    // row moves like a wave even between hits. Heights are whole grid cells, so a
    // bar is always a stack of complete dots. The top row mirrors the bottom one
    // at about half height.
    const lastRows = []
    const drawBars = (f) => {
      const g = geoRef.current
      const sp = f.spectrum
      const t = performance.now() / 1000
      for (let i = 0; i < g.count; i += 1) {
        const bin = Math.min(sp.length - 1, Math.floor((i / g.count) * sp.length))
        const ripple = 0.12 * f.level * Math.sin(i * 0.45 - t * 4.2)
        const v = Math.max(0, Math.min(1, sp[bin] + ripple))
        const rows = Math.round(v * g.maxRows)
        if (rows !== lastRows[i]) {
          lastRows[i] = rows
          if (barRefs.current[i]) barRefs.current[i].style.height = `${rows * CELL}px`
          if (topRefs.current[i]) topRefs.current[i].style.height = `${Math.round(rows * 0.55) * CELL}px`
        }
      }
    }
    const clearBars = () => {
      lastRows.length = 0
      barRefs.current.forEach((el) => el && (el.style.height = '0px'))
      topRefs.current.forEach((el) => el && (el.style.height = '0px'))
    }
    const applyState = (st) => {
      const on = Boolean(st.source)
      root.classList.toggle('reactive', on)
      if (on) collect()
      else {
        reset()
        clearBars()
      }
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
      if (f.spectrum && !reduce.matches) drawBars(f)
      if (!reduce.matches) {
        const target = 1 + f.level * 2.4 + f.beat * 1.2
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
      clearBars()
      root.classList.remove('reactive')
    }
  }, [])

  // Once focus has settled no mode is on: each fades out and is paused, so the
  // quiet state costs nothing.
  const on = (m) => `bg-mode m-${m}${mode === m && !settled ? ' on' : ''}`

  return (
    <div
      ref={rootRef}
      className="atmosphere fixed inset-0 z-0 overflow-hidden bg-page"
      data-focus={focus ? '' : undefined}
      data-sweeping={sweeping ? '' : undefined}
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
        {/* The same lone blinking dots as the home page, so the two backdrops are one family. */}
        {BLINKS.map((b) => (
          <div
            key={b.cls}
            className={`bg-blink ${b.cls} absolute inset-0`}
            style={{ '--blink': `${b.blink}s`, '--delay': `${b.delay}s` }}
          />
        ))}
        {['l', 'r'].map((side) => (
          <div key={side} className={`bg-log ${side}`}>
            {LOG_DASHES[side].map((d, i) => (
              <div
                key={i}
                className="bg-dash"
                style={{ '--x': d.x, '--n': d.n, '--dur': `${d.dur}s`, '--delay': `${d.delay}s`, '--peak': d.peak }}
              >
                <i />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Beat flash: a bright copy of the grid whose opacity follows --au-beat.
          Invisible (opacity 0) unless audio sync is on. */}
      <div className="bg-pulse absolute inset-0" />

      {/* A calm zone behind the content column: dims the grid and effects where
          text sits so body copy stays readable, and leaves the edges busy. */}
      <div className="bg-calm absolute inset-0" />

      {/* Focus mode: a quiet field that grows from the pointer (a faint grid on
          the page colour, hiding the effects below it) and the ring of lit dots
          at its edge. Both are driven by one value, --fr. Empty unless focused. */}
      <div className="bg-quiet absolute inset-0" />
      <div className="bg-wave absolute inset-0" />

      {/* Equalizer: dot-built bars along the bottom edge, mirrored more faintly
          from the top. Hidden unless audio sync is on (CSS), driven from the
          audio effect above. Above the calm zone so the music is never dimmed. */}
      <div className="bg-spectrum">
        <div className="bg-spec-row bottom" style={{ bottom: geo.bottom }}>
          {Array.from({ length: geo.count }, (_, i) => (
            <i
              key={i}
              ref={(el) => {
                barRefs.current[i] = el
              }}
              className="bg-bar"
              style={{ left: i * CELL * 2 }}
            />
          ))}
        </div>
        <div className="bg-spec-row top">
          {Array.from({ length: geo.count }, (_, i) => (
            <i
              key={i}
              ref={(el) => {
                topRefs.current[i] = el
              }}
              className="bg-bar"
              style={{ left: i * CELL * 2 }}
            />
          ))}
        </div>
      </div>

      <div ref={ptrRef} className="bg-ptr absolute inset-0">
        <div className="row"><i /></div>
        <div className="col"><i /></div>
        <div className="cell"><i /></div>
      </div>
    </div>
  )
}
