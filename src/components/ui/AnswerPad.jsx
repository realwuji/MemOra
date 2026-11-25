import { useCallback, useEffect, useRef, useState } from 'react'
import Chip from '@/components/ui/Chip'

/*
  A ruled writing pad under a question, for working out by hand: Apple Pencil, stylus, mouse
  or a finger on a laptop touchscreen. A pen (or mouse) draws and a finger scrolls the page
  (touch-action pan-y), so a hand resting on the screen never leaves marks. Pressure
  sets the line width. Ink takes the theme's text colour, so it reads in all four themes.
  Strokes live in memory only: they are working, not saved answers.
*/
const STEP = 36 // the ruled line spacing, in px

export default function AnswerPad({ lines = 6 }) {
  const canvas = useRef(null)
  const strokes = useRef([]) // [{ erase, pts: [[x, y, w]] }]
  const live = useRef(null)
  const [rows, setRows] = useState(lines)
  const [erase, setErase] = useState(false)
  const [count, setCount] = useState(0)

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
    if (live.current) setCount(strokes.current.length)
    live.current = null
  }
  const undo = () => {
    strokes.current.pop()
    setCount(strokes.current.length)
    paint()
  }
  const clear = () => {
    strokes.current = []
    setCount(0)
    paint()
  }

  return (
    <div className="border-t border-line">
      <div className="flex flex-wrap items-center gap-2 px-3 py-2">
        <span className="mr-auto font-mono text-xs uppercase tracking-wide text-muted">// Your working</span>
        <Chip size="sm" selected={!erase} onClick={() => setErase(false)}>
          Pen
        </Chip>
        <Chip size="sm" selected={erase} onClick={() => setErase(true)}>
          Eraser
        </Chip>
        <Chip size="sm" disabled={!count} onClick={undo}>
          Undo
        </Chip>
        <Chip size="sm" disabled={!count} onClick={clear}>
          Clear
        </Chip>
        <Chip size="sm" onClick={() => setRows((n) => n + 4)}>
          More space
        </Chip>
      </div>
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
          cursor: erase ? 'cell' : 'crosshair',
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent ${STEP - 1}px, var(--srv-line, rgba(128,128,128,.35)) ${STEP - 1}px, var(--srv-line, rgba(128,128,128,.35)) ${STEP}px)`,
        }}
      />
    </div>
  )
}
