import { useCallback, useEffect, useRef, useState } from 'react'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'

/*
  A drawing pad for sketching an economics diagram by hand - mouse, finger
  or Apple Pencil - inside the diagram revision and the essay plan boxes.

  Why a pad and not a textarea: the exam asks for a drawn diagram, and
  "S shifts left, P rises" typed in a box is not the same skill as putting
  the curves in the right place with the right labels. Drawing it is the
  practice that transfers.

  Tools: Pen (freehand, smoothed into a clean curve), Line (a straight line
  with a drag; hold Shift to lock it to 45 degree steps), Dashed (for guide
  lines down to the axes), Arrow (for a shift), Point (a plotted equilibrium),
  Label (type a name such as D1 or P2 straight onto the diagram) and Eraser.
  Undo and redo, a Grid that the line, point and label tools snap to so
  everything lines up, and Ctrl/Cmd+Z and Ctrl/Cmd+Y while the pad is focused.

  Pointer Events cover mouse, finger and pencil with one handler;
  touch-action: none on the canvas stops the page scrolling while a finger
  or pencil is drawing. Strokes are stored as numbers in a fixed 400x300 space
  (the same box the SVG diagrams use) so a sketch made on a phone redraws
  correctly on a laptop and the saved data stays small.

  value / onChange carry { preset, snap, strokes }. preset names the faint
  axes drawn underneath. Each stroke is { c: colourIndex, w: width, p: [...] }
  and an optional t: none = freehand (p is x, y pairs), 'line' | 'dash' |
  'arrow' (p is x1, y1, x2, y2), 'dot' (p is x, y), 'text' (p is x, y and s
  is the text). Sketches saved before the new tools were added still load.
*/

export const BOX_W = 400
export const BOX_H = 300

// The axes drawn underneath, and the grid that the snapping tools use, are laid
// out from this corner.
const ORIGIN = [40, 262]
const GRID = 20

const PRESETS = {
  pq: { label: 'Price / Quantity', x: 'Quantity', y: 'Price' },
  ply: { label: 'Price level / Real GDP', x: 'Real output (Y)', y: 'Price level' },
  wl: { label: 'Wage / Labour', x: 'Quantity of labour', y: 'Wage rate' },
  cq: { label: 'Costs & revenue / Output', x: 'Output', y: 'Costs / revenue' },
  blank: { label: 'Blank', x: '', y: '' },
}

// Curve colours follow the site's diagram conventions: blue for demand
// and benefit curves, amber for supply and cost, green for social or
// shifted curves, red for losses, plus the foreground for labels.
const COLOURS = [
  { name: 'Ink', css: 'var(--fg)' },
  { name: 'Demand (blue)', css: 'var(--brand-strong)' },
  { name: 'Supply (amber)', css: '#e08a2c' },
  { name: 'Shift (green)', css: '#2e9e6b' },
  { name: 'Loss (red)', css: 'var(--danger)' },
]

const TOOLS = [
  { id: 'pen', label: 'Pen', hint: 'Draw a curve freehand. It is smoothed when you lift.' },
  { id: 'line', label: 'Line', hint: 'Drag for a straight line. Hold Shift to lock it to 45 degree steps.' },
  { id: 'dash', label: 'Dashed', hint: 'Drag for a dashed guide line, for example from an equilibrium down to the axis.' },
  { id: 'arrow', label: 'Arrow', hint: 'Drag for an arrow, for example to show which way a curve shifts.' },
  { id: 'dot', label: 'Point', hint: 'Tap to plot a point, for example an equilibrium.' },
  { id: 'text', label: 'Label', hint: 'Tap where the label goes, type it (D1, P2, Q1) and press Enter.' },
  { id: 'eraser', label: 'Eraser', hint: 'Drag over anything to remove it.' },
]
const SHAPE = new Set(['line', 'dash', 'arrow'])

const resolve = (css, el) => {
  if (!css.startsWith('var(')) return css
  const name = css.slice(4, -1)
  return getComputedStyle(el).getPropertyValue(name).trim() || '#888'
}

const EMPTY = { preset: 'pq', snap: false, strokes: [] }

/* ------------------------------------------------------------ geometry */

const snapPoint = ([x, y]) => [ORIGIN[0] + Math.round((x - ORIGIN[0]) / GRID) * GRID, ORIGIN[1] + Math.round((y - ORIGIN[1]) / GRID) * GRID]

// Lock the end of a line to the nearest 45 degrees from its start.
function lockAngle(a, b) {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const len = Math.hypot(dx, dy)
  if (!len) return b
  const step = Math.PI / 4
  const ang = Math.round(Math.atan2(dy, dx) / step) * step
  return [a[0] + Math.cos(ang) * len, a[1] + Math.sin(ang) * len]
}

function distToSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1
  const dy = y2 - y1
  const l2 = dx * dx + dy * dy
  const t = l2 ? Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / l2)) : 0
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy))
}

// Is the point (x, y) within r of this stroke? Measured against the line itself,
// not just its end points, so a straight line is erased by touching its middle.
function touches(s, x, y, r) {
  const p = s.p
  if (s.t === 'text') {
    const w = (s.s || '').length * 7.6
    return x >= p[0] - r && x <= p[0] + w + r && y >= p[1] - 15 - r && y <= p[1] + 5 + r
  }
  if (s.t === 'dot' || p.length === 2) return Math.hypot(p[0] - x, p[1] - y) <= r + (s.t === 'dot' ? 4 : 0)
  for (let i = 0; i < p.length - 2; i += 2) if (distToSegment(x, y, p[i], p[i + 1], p[i + 2], p[i + 3]) <= r) return true
  return false
}

function ToolIcon({ id }) {
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', className: 'h-4 w-4', 'aria-hidden': true }
  if (id === 'pen') return <Icon name="pencil" className="h-4 w-4" />
  if (id === 'eraser') return <Icon name="wand" className="h-4 w-4" />
  return (
    <svg {...common}>
      {id === 'line' && <path d="M5 19 19 5" />}
      {id === 'dash' && <path d="M4 20l3-3M10 14l4-4M17 7l3-3" />}
      {id === 'arrow' && <path d="M5 19 19 5M9 5h10v10" />}
      {id === 'dot' && <circle cx="12" cy="12" r="3.5" fill="currentColor" />}
      {id === 'text' && <path d="M6 6h12M12 6v13M9 19h6" />}
    </svg>
  )
}

export default function SketchPad({ value, onChange, label = 'Sketch the diagram' }) {
  const data = value && Array.isArray(value.strokes) ? value : EMPTY
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const drawing = useRef(null) // the pen stroke, or the line being dragged out, while a pointer is down
  const draft = useRef(null) // a line / dashed / arrow stroke that is being dragged out, drawn but not yet saved
  const penAt = useRef(0) // when a stylus last touched the pad (palm rejection)
  const raf = useRef(0)
  const cols = useRef([])
  const [colour, setColour] = useState(1)
  const [tool, setTool] = useState('pen')
  const [redo, setRedo] = useState([])
  const [textAt, setTextAt] = useState(null) // { x, y } in box units while a label is being typed
  const [textValue, setTextValue] = useState('')
  // The same label, held in a ref too, so that finishing it twice (a blur and then a tap on
  // the pad) can only ever add it once.
  const typing = useRef(null)
  const dataRef = useRef(data)
  dataRef.current = data

  // Canvas pixel size follows its CSS size x devicePixelRatio so lines stay
  // sharp on retina screens; all drawing happens in BOX units and is
  // scaled once here.
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return null
    const cssW = wrap.clientWidth
    const cssH = (cssW * BOX_H) / BOX_W
    const dpr = window.devicePixelRatio || 1
    if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
      canvas.width = Math.round(cssW * dpr)
      canvas.height = Math.round(cssH * dpr)
      canvas.style.height = `${cssH}px`
    }
    const ctx = canvas.getContext('2d')
    ctx.setTransform((cssW / BOX_W) * dpr, 0, 0, (cssH / BOX_H) * dpr, 0, 0)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    return ctx
  }, [])

  const drawGrid = useCallback((ctx) => {
    ctx.save()
    ctx.strokeStyle = resolve('var(--muted)', canvasRef.current)
    ctx.globalAlpha = 0.16
    ctx.lineWidth = 0.8
    ctx.beginPath()
    for (let x = ORIGIN[0]; x <= 380; x += GRID) {
      ctx.moveTo(x, 20)
      ctx.lineTo(x, ORIGIN[1])
    }
    for (let y = ORIGIN[1]; y >= 20; y -= GRID) {
      ctx.moveTo(ORIGIN[0], y)
      ctx.lineTo(380, y)
    }
    ctx.stroke()
    ctx.restore()
  }, [])

  const drawAxes = useCallback((ctx, preset) => {
    const p = PRESETS[preset] || PRESETS.pq
    const line = resolve('var(--muted)', canvasRef.current)
    ctx.save()
    ctx.strokeStyle = line
    ctx.globalAlpha = 0.6
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.moveTo(40, 20)
    ctx.lineTo(40, 262)
    ctx.lineTo(380, 262)
    ctx.stroke()
    ctx.globalAlpha = 0.9
    ctx.fillStyle = line
    ctx.font = '600 11px system-ui, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(p.x, 380, 280)
    ctx.textAlign = 'left'
    ctx.fillText('0', 28, 275)
    ctx.save()
    ctx.translate(20, 145)
    ctx.rotate(-Math.PI / 2)
    ctx.textAlign = 'center'
    ctx.fillText(p.y, 0, 0)
    ctx.restore()
    ctx.restore()
  }, [])

  const drawStroke = useCallback((ctx, s) => {
    const col = cols.current[s.c] || cols.current[0] || '#888'
    ctx.strokeStyle = col
    ctx.fillStyle = col
    ctx.lineWidth = s.w || 2.4
    ctx.setLineDash([])
    const p = s.p
    if (s.t === 'dot') {
      ctx.beginPath()
      ctx.arc(p[0], p[1], 3.8, 0, Math.PI * 2)
      ctx.fill()
      return
    }
    if (s.t === 'text') {
      ctx.font = '700 13px system-ui, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(s.s || '', p[0], p[1])
      return
    }
    if (SHAPE.has(s.t)) {
      if (s.t === 'dash') ctx.setLineDash([7, 6])
      ctx.beginPath()
      ctx.moveTo(p[0], p[1])
      ctx.lineTo(p[2], p[3])
      ctx.stroke()
      ctx.setLineDash([])
      if (s.t === 'arrow') {
        const a = Math.atan2(p[3] - p[1], p[2] - p[0])
        ctx.beginPath()
        ctx.moveTo(p[2], p[3])
        ctx.lineTo(p[2] - 11 * Math.cos(a - 0.45), p[3] - 11 * Math.sin(a - 0.45))
        ctx.lineTo(p[2] - 11 * Math.cos(a + 0.45), p[3] - 11 * Math.sin(a + 0.45))
        ctx.closePath()
        ctx.fill()
      }
      return
    }
    // freehand: a curve through the middle of each pair of points, so a hand-drawn
    // curve comes out smooth instead of faintly jagged
    ctx.beginPath()
    ctx.moveTo(p[0], p[1])
    if (p.length === 2) ctx.lineTo(p[0] + 0.1, p[1])
    else if (p.length < 6) ctx.lineTo(p[2], p[3])
    else {
      for (let i = 2; i < p.length - 2; i += 2) ctx.quadraticCurveTo(p[i], p[i + 1], (p[i] + p[i + 2]) / 2, (p[i + 1] + p[i + 3]) / 2)
      ctx.lineTo(p[p.length - 2], p[p.length - 1])
    }
    ctx.stroke()
  }, [])

  const redraw = useCallback(() => {
    const ctx = setupCanvas()
    if (!ctx) return
    const d = dataRef.current
    // Colours are resolved once per repaint, not once per stroke.
    cols.current = COLOURS.map((c) => resolve(c.css, canvasRef.current))
    ctx.clearRect(0, 0, BOX_W, BOX_H)
    if (d.snap) drawGrid(ctx)
    drawAxes(ctx, d.preset)
    for (const s of d.strokes) drawStroke(ctx, s)
    if (draft.current) drawStroke(ctx, draft.current)
  }, [setupCanvas, drawGrid, drawAxes, drawStroke])

  // Repaint when the drawing changes; follow the pad's own size separately, so the
  // observer is set up once rather than rebuilt after every stroke.
  useEffect(() => {
    redraw()
  }, [redraw, data])
  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || typeof ResizeObserver === 'undefined') return undefined
    const ro = new ResizeObserver(redraw)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [redraw])

  // Theme changes re-colour the tokens; the canvas has to be repainted to
  // pick them up, since it holds resolved colours rather than variables.
  useEffect(() => {
    const mo = new MutationObserver(redraw)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-accent'] })
    return () => mo.disconnect()
  }, [redraw])

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  const toBox = (e) => {
    const r = canvasRef.current.getBoundingClientRect()
    return [Math.round(((e.clientX - r.left) / r.width) * BOX_W * 10) / 10, Math.round(((e.clientY - r.top) / r.height) * BOX_H * 10) / 10]
  }

  const commit = (next) => {
    dataRef.current = next
    onChange?.(next)
  }
  const addStroke = (s) => {
    setRedo([])
    commit({ ...dataRef.current, strokes: [...dataRef.current.strokes, s] })
  }

  const erase = (x, y) => {
    const keep = dataRef.current.strokes.filter((s) => !touches(s, x, y, 10))
    if (keep.length !== dataRef.current.strokes.length) {
      commit({ ...dataRef.current, strokes: keep })
      redraw()
    }
  }

  // Repaint at most once a frame while a line is being dragged out.
  const scheduleRedraw = () => {
    if (raf.current) return
    raf.current = requestAnimationFrame(() => {
      raf.current = 0
      redraw()
    })
  }

  const onDown = (e) => {
    if (e.button !== undefined && e.button !== 0 && e.pointerType === 'mouse') return
    // Palm rejection: while an Apple Pencil or stylus is in use, a resting palm
    // (a touch pointer) must not draw. Fingers work again after a pause.
    if (e.pointerType === 'pen') penAt.current = performance.now()
    else if (e.pointerType === 'touch' && performance.now() - penAt.current < 20000) return
    e.preventDefault()
    if (typing.current) finishText()
    const snap = dataRef.current.snap
    const raw = toBox(e)
    const pt = snap && tool !== 'pen' && tool !== 'eraser' ? snapPoint(raw) : raw

    if (tool === 'eraser') {
      canvasRef.current.setPointerCapture?.(e.pointerId)
      drawing.current = { erasing: true }
      erase(raw[0], raw[1])
      return
    }
    if (tool === 'dot') {
      addStroke({ t: 'dot', c: colour, p: pt })
      return
    }
    if (tool === 'text') {
      typing.current = { x: pt[0], y: pt[1], v: '' }
      setTextAt({ x: pt[0], y: pt[1] })
      setTextValue('')
      return
    }
    canvasRef.current.setPointerCapture?.(e.pointerId)
    if (SHAPE.has(tool)) {
      draft.current = { t: tool, c: colour, w: 2.4, p: [pt[0], pt[1], pt[0], pt[1]] }
      drawing.current = { shape: true }
      return
    }
    const width = e.pointerType === 'pen' && e.pressure > 0 ? 1.6 + e.pressure * 2 : 2.4
    drawing.current = { stroke: { c: colour, w: Number(width.toFixed(1)), p: [raw[0], raw[1]] }, last: raw }
  }

  const onMove = (e) => {
    const d = drawing.current
    if (!d) return
    e.preventDefault()
    if (d.shape) {
      let pt = toBox(e)
      const start = [draft.current.p[0], draft.current.p[1]]
      if (e.shiftKey) pt = lockAngle(start, pt)
      if (dataRef.current.snap) pt = snapPoint(pt)
      draft.current.p[2] = pt[0]
      draft.current.p[3] = pt[1]
      scheduleRedraw()
      return
    }
    const events = e.nativeEvent.getCoalescedEvents ? e.nativeEvent.getCoalescedEvents() : [e]
    const ctx = d.erasing ? null : setupCanvas()
    for (const ev of events) {
      const [x, y] = toBox(ev)
      if (d.erasing) {
        erase(x, y)
        continue
      }
      const [lx, ly] = d.last
      if ((x - lx) * (x - lx) + (y - ly) * (y - ly) < 2.5) continue
      d.stroke.p.push(x, y)
      d.last = [x, y]
      if (ctx) {
        ctx.strokeStyle = cols.current[d.stroke.c] || '#888'
        ctx.lineWidth = d.stroke.w
        ctx.beginPath()
        ctx.moveTo(lx, ly)
        ctx.lineTo(x, y)
        ctx.stroke()
      }
    }
  }

  const onUp = (e) => {
    const d = drawing.current
    drawing.current = null
    if (!d || d.erasing) return
    e.preventDefault()
    if (d.shape) {
      const s = draft.current
      draft.current = null
      // A tap with no drag is not a line.
      if (s && Math.hypot(s.p[2] - s.p[0], s.p[3] - s.p[1]) >= 4) addStroke(s)
      else redraw()
      return
    }
    addStroke(d.stroke)
  }

  const undo = () => {
    const strokes = dataRef.current.strokes
    if (!strokes.length) return
    setRedo((r) => [...r, strokes[strokes.length - 1]])
    commit({ ...dataRef.current, strokes: strokes.slice(0, -1) })
    redraw()
  }
  const redoStroke = () => {
    if (!redo.length) return
    const s = redo[redo.length - 1]
    setRedo((r) => r.slice(0, -1))
    commit({ ...dataRef.current, strokes: [...dataRef.current.strokes, s] })
    redraw()
  }
  const clear = () => {
    setRedo([])
    commit({ ...dataRef.current, strokes: [] })
    redraw()
  }
  const setPreset = (preset) => {
    commit({ ...dataRef.current, preset })
    redraw()
  }
  const toggleSnap = () => {
    commit({ ...dataRef.current, snap: !dataRef.current.snap })
    redraw()
  }

  function finishText() {
    const t = typing.current
    typing.current = null
    if (t) {
      const v = t.v.trim().slice(0, 32)
      if (v) addStroke({ t: 'text', c: colour, p: [t.x, t.y], s: v })
    }
    setTextAt(null)
    setTextValue('')
  }

  const onKeyDown = (e) => {
    if (textAt) return
    if (!(e.ctrlKey || e.metaKey)) return
    const k = e.key.toLowerCase()
    if (k === 'z' && !e.shiftKey) {
      e.preventDefault()
      undo()
    } else if (k === 'y' || (k === 'z' && e.shiftKey)) {
      e.preventDefault()
      redoStroke()
    }
  }

  const count = data.strokes.length
  const active = TOOLS.find((t) => t.id === tool)
  const cssW = wrapRef.current?.clientWidth || 0

  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
        <label className="flex items-center gap-1.5 text-xs text-muted">
          Axes
          <select
            value={data.preset}
            onChange={(e) => setPreset(e.target.value)}
            className="rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-medium text-fg focus:border-brand focus:outline-none"
          >
            {Object.entries(PRESETS).map(([k, p]) => (
              <option key={k} value={k}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap items-center gap-0.5 rounded-2xl border border-line bg-surface p-1" role="toolbar" aria-label="Drawing tools">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={tool === t.id}
              title={t.hint}
              onClick={() => setTool(t.id)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-colors ${tool === t.id ? 'bg-brand' : 'text-muted hover:bg-brand-soft hover:text-fg'}`}
              style={tool === t.id ? { color: 'var(--on-brand, #fff)' } : undefined}
            >
              <ToolIcon id={t.id} />
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 rounded-full border border-line bg-surface p-1" role="radiogroup" aria-label="Pen colour">
          {COLOURS.map((c, i) => (
            <button
              key={c.name}
              type="button"
              role="radio"
              aria-checked={colour === i}
              aria-label={c.name}
              title={c.name}
              onClick={() => {
                setColour(i)
                if (tool === 'eraser') setTool('pen')
              }}
              className={`h-6 w-6 rounded-full border-2 transition-transform ${colour === i ? 'scale-110 border-fg' : 'border-transparent'}`}
              style={{ background: c.css }}
            />
          ))}
        </div>

        <div className="flex items-center gap-0.5">
          <Button size="sm" variant="ghost" onClick={undo} disabled={!count} title="Undo (Ctrl+Z)">
            <Icon name="arrowLeft" className="h-4 w-4" />
            Undo
          </Button>
          <Button size="sm" variant="ghost" onClick={redoStroke} disabled={!redo.length} title="Redo (Ctrl+Y)">
            Redo
            <Icon name="arrowRight" className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={clear} disabled={!count}>
            <Icon name="x" className="h-4 w-4" />
            Clear
          </Button>
          <Button size="sm" variant={data.snap ? 'primary' : 'ghost'} onClick={toggleSnap} aria-pressed={Boolean(data.snap)} title="Show a grid that lines, points and labels snap to">
            Grid
          </Button>
        </div>
      </div>

      {/* tabIndex so Ctrl/Cmd+Z and Y work once the pad has been clicked */}
      <div
        ref={wrapRef}
        className="relative mt-2 overflow-hidden rounded-xl border border-line bg-page focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        style={{ touchAction: 'none' }}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={count ? `Your sketch, ${count} ${count === 1 ? 'mark' : 'marks'}` : 'Empty sketch pad'}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onPointerLeave={(e) => drawing.current && !e.currentTarget.hasPointerCapture?.(e.pointerId) && onUp(e)}
          onContextMenu={(e) => e.preventDefault()}
          className={`block w-full ${tool === 'eraser' ? 'cursor-cell' : tool === 'text' ? 'cursor-text' : 'cursor-crosshair'}`}
          style={{ touchAction: 'none' }}
        />
        {textAt && (
          <input
            autoFocus
            type="text"
            value={textValue}
            maxLength={32}
            aria-label="Label text"
            placeholder="D1"
            onChange={(e) => {
              if (typing.current) typing.current.v = e.target.value
              setTextValue(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                finishText()
              } else if (e.key === 'Escape') {
                typing.current = null
                setTextAt(null)
                setTextValue('')
              }
            }}
            onBlur={finishText}
            className="absolute w-24 rounded-md border border-brand bg-surface px-1.5 py-0.5 text-sm font-bold text-fg focus:outline-none"
            style={{ left: Math.min((textAt.x / BOX_W) * cssW, Math.max(cssW - 100, 0)), top: Math.max((textAt.y / BOX_H) * (cssW * BOX_H / BOX_W) - 20, 0) }}
          />
        )}
      </div>
      <p className="mt-1.5 text-[0.7rem] text-muted">
        {active.hint} Label the axes, curves and every point you move between - the labels are what the marks are for.
      </p>
    </div>
  )
}
