import { useCallback, useEffect, useRef, useState } from 'react'
import Chip from '@/components/ui/Chip'
import '@fontsource-variable/caveat'

/*
  A ruled writing pad under a question, for working out by hand: Apple Pencil, stylus, mouse
  or a finger on a laptop touchscreen. A pen (or mouse) draws and a finger scrolls the page
  (touch-action pan-y), so a hand resting on the screen never leaves marks. Pressure
  sets the line width. Ink takes the theme's text colour, so it reads in all four themes.
  Typing: the Type chip lets a keyboard user type on the ruled lines instead. The text is a
  transparent textarea laid over the canvas with the same line pitch as the ruling (STEP), set in a
  handwriting face (Caveat) so it looks like writing on the page, and it grows with the pad. The
  textarea only receives the pointer in Type mode; in Pen and Eraser mode it lets every pen, mouse
  and touch event fall through to the canvas, so drawing and finger scrolling work exactly as before.
  Typed text and drawing can share a page (type a line, draw a diagram).

  Strokes are working, not saved answers, so they are kept for the browser SESSION only
  (sessionStorage, keyed by `storeKey`): they survive closing and re-opening the pad and a
  page reload, and are gone when the tab closes. The pad stays mounted while hidden behind
  the Extra Space button (see PastPaperQuestion), so nothing is lost by closing it.
*/
const STEP = 36 // the ruled line spacing, in px
const MAX_SAVED = 150000 // characters; a pad drawn on for a long time just stops saving

const loadText = (storeKey) => {
  if (!storeKey) return ''
  try {
    return sessionStorage.getItem(`memora:pad-text:${storeKey}`) || ''
  } catch {
    return ''
  }
}

const loadStrokes = (storeKey) => {
  if (!storeKey) return []
  try {
    const v = JSON.parse(sessionStorage.getItem(`memora:pad:${storeKey}`) || '[]')
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

export default function AnswerPad({ lines = 6, storeKey }) {
  const canvas = useRef(null)
  const strokes = useRef(null) // [{ erase, pts: [[x, y, w]] }]
  if (strokes.current === null) strokes.current = loadStrokes(storeKey)
  const live = useRef(null)
  const [rows, setRows] = useState(lines)
  const [mode, setMode] = useState('pen') // 'pen' | 'erase' | 'type'
  const erase = mode === 'erase'
  const field = useRef(null)
  const [text, setText] = useState(() => loadText(storeKey))
  const [count, setCount] = useState(() => strokes.current.length)

  // Typed text is remembered for the session, like the drawing, and makes the pad taller when it
  // runs past the last ruled line (the textarea never scrolls inside the pad).
  const onType = (e) => {
    const value = e.target.value
    setText(value)
    try {
      if (value) sessionStorage.setItem(`memora:pad-text:${storeKey}`, value)
      else sessionStorage.removeItem(`memora:pad-text:${storeKey}`)
    } catch {
      /* storage blocked: the text still works, it just is not remembered */
    }
  }
  useEffect(() => {
    const ta = field.current
    if (!ta) return
    ta.style.height = '0px' // measure the text on its own, not the pad's current height
    const needed = Math.ceil(ta.scrollHeight / STEP)
    ta.style.height = ''
    setRows((n) => (needed > n ? needed : n))
  }, [text])

  const save = useCallback(() => {
    if (!storeKey) return
    try {
      const json = JSON.stringify(strokes.current.map((s) => ({ ...s, pts: s.pts.map(([x, y, w]) => [Math.round(x), Math.round(y), Math.round(w * 10) / 10]) })))
      if (json.length <= MAX_SAVED) sessionStorage.setItem(`memora:pad:${storeKey}`, json)
    } catch {
      /* storage full or blocked: the pad still works, it just is not remembered */
    }
  }, [storeKey])

  const paint = useCallback(() => {
    const c = canvas.current
    if (!c) return
    const ctx = c.getContext('2d')
    const ink = getComputedStyle(c).color
    ctx.clearRect(0, 0, c.width, c.height)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    for (const s of strokes.current) {
      ctx.globalCompositeOperation = s.erase ? 'destination-out' : 'source-over'
      ctx.strokeStyle = ink
      for (let i = 1; i < s.pts.length; i++) {
        const [x0, y0] = s.pts[i - 1]
        const [x1, y1, w] = s.pts[i]
        ctx.lineWidth = s.erase ? 22 : w
        ctx.beginPath()
        ctx.moveTo(x0, y0)
        ctx.lineTo(x1, y1)
        ctx.stroke()
      }
      if (s.pts.length === 1) {
        ctx.beginPath()
        ctx.arc(s.pts[0][0], s.pts[0][1], (s.erase ? 22 : s.pts[0][2]) / 2, 0, 7)
        ctx.fillStyle = ink
        ctx.fill()
      }
    }
    ctx.globalCompositeOperation = 'source-over'
  }, [])

  // keep the bitmap sharp at the screen's pixel ratio and redraw when the pad resizes
  useEffect(() => {
    const c = canvas.current
    const fit = () => {
      const r = c.getBoundingClientRect()
      const k = window.devicePixelRatio || 1
      c.width = Math.round(r.width * k)
      c.height = Math.round(r.height * k)
      c.getContext('2d').setTransform(k, 0, 0, k, 0, 0)
      paint()
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(c)
    // a theme change recolours the ink
    const mo = new MutationObserver(paint)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] })
    return () => {
      ro.disconnect()
      mo.disconnect()
    }
  }, [paint, rows])

  const point = (e) => {
    const r = canvas.current.getBoundingClientRect()
    const p = e.pointerType === 'pen' || e.pressure > 0 ? e.pressure || 0.5 : 0.5
    return [e.clientX - r.left, e.clientY - r.top, 1.2 + p * 2.8]
  }
  const down = (e) => {
    if (e.pointerType === 'touch') return // fingers scroll
    canvas.current.setPointerCapture(e.pointerId)
    // the pencil's eraser end, or the Eraser chip
    live.current = { erase: erase || e.buttons === 32, pts: [point(e)] }
    strokes.current.push(live.current)
    paint()
  }
  const move = (e) => {
    if (!live.current) return
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e]
    for (const ev of evs.length ? evs : [e]) live.current.pts.push(point(ev))
    paint()
  }
  const up = () => {
    if (live.current) {
      setCount(strokes.current.length)
      save()
    }
    live.current = null
  }
  const undo = () => {
    strokes.current.pop()
    setCount(strokes.current.length)
    paint()
    save()
  }
  const clear = () => {
    strokes.current = []
    setCount(0)
    paint()
    save()
    setText('')
    try {
      sessionStorage.removeItem(`memora:pad-text:${storeKey}`)
    } catch {
      /* nothing to clear */
    }
  }

  return (
    <div className="exam-sheet-pad">
      <div className="exam-sheet-toolbar">
        <span className="mr-auto font-mono text-xs uppercase tracking-wide text-muted">Your working</span>
        <Chip quiet size="sm" selected={mode === 'pen'} aria-pressed={mode === 'pen'} onClick={() => setMode('pen')}>
          Pen
        </Chip>
        <Chip quiet size="sm" selected={mode === 'erase'} aria-pressed={mode === 'erase'} onClick={() => setMode('erase')}>
          Eraser
        </Chip>
        <Chip
          quiet
          size="sm"
          selected={mode === 'type'}
          aria-pressed={mode === 'type'}
          onClick={() => {
            setMode('type')
            // focus once the textarea has started taking pointer input
            requestAnimationFrame(() => field.current?.focus())
          }}
        >
          Type
        </Chip>
        <Chip quiet size="sm" disabled={!count} onClick={undo}>
          Undo
        </Chip>
        <Chip quiet size="sm" disabled={!count && !text} onClick={clear}>
          Clear
        </Chip>
        <Chip quiet size="sm" onClick={() => setRows((n) => n + 4)}>
          More space
        </Chip>
      </div>
      <div className="exam-pad-field" style={{ height: rows * STEP }}>
        <canvas
          ref={canvas}
          aria-label="Writing space for your working. Draw with a pen or mouse."
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          className="block w-full text-fg"
          style={{
            height: rows * STEP,
            touchAction: 'pan-y pinch-zoom',
            cursor: erase ? 'cell' : mode === 'type' ? 'text' : 'crosshair',
            backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent ${STEP - 1}px, var(--line) ${STEP - 1}px, var(--line) ${STEP}px)`,
          }}
        />
        <textarea
          ref={field}
          value={text}
          onChange={onType}
          aria-label="Type your working. Each line sits on a ruled line."
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
          className={`exam-pad-text${mode === 'type' ? ' is-typing' : ''}`}
          style={{ lineHeight: `${STEP}px` }}
        />
      </div>
    </div>
  )
}
