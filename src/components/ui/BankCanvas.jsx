import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { prepare, frame, polyLen, textWidth } from '@/lib/bankEngine'
import useHeadFont from '@/hooks/useHeadFont'
import { MOVES } from '@/constants/dr-moves'
import { FIXES } from '@/data/diagram-fixes'
import { AREAS } from '@/data/diagram-areas'
import './diagram-revision.css'

/*
  Draws a slide of the teacher's diagram bank in the app's own style: graph
  paper, a pencil that inks each stroke in the order the teacher built it,
  shifts that slide rather than redraw, and a tooltip for what shifts a
  curve on hover. Colours are semantic, so it re-themes (black, cream, high
  contrast) with the rest of the app.
*/

const PT = 1.25
const colour = (c) => (c === 'ink' || !c ? 'var(--fg)' : c === 'muted' ? 'var(--muted)' : `var(--dr-${c})`)
const poly = (p) => p.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('')

// The three corners of an arrowhead whose tip is the end (or the start) of a line.
function arrowHead(p, atStart, size) {
  const a = atStart ? p[0] : p[p.length - 1]
  const b = atStart ? p[1] : p[p.length - 2]
  const dx = a[0] - b[0]
  const dy = a[1] - b[1]
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len
  const bx = a[0] - ux * size
  const by = a[1] - uy * size
  const w = size * 0.4
  return `${a[0]},${a[1]} ${bx - uy * w},${by + ux * w} ${bx + uy * w},${by - ux * w}`
}

// Word-wrap a paragraph into the width of its text box, measuring real glyphs
// in the font the page is set in (a reading-support font is much wider).
const width = textWidth
/*
  PowerPoint's own line breaks (`br` in data/diagram-bank.json: offsets into the
  paragraph's text) are used when the slide has them, so every label wraps
  exactly as on the slide. Without them, short labels never wrap and longer
  annotations wrap to the box.
*/
function breakPara(p, breaks) {
  const lines = [[]]
  let pos = 0
  p.r.forEach((r) => {
    let text = r.t
    while (text.length) {
      const next = breaks.find((b) => b > pos)
      if (next !== undefined && pos + text.length > next) {
        const cut = next - pos
        if (text.slice(0, cut).trim()) lines[lines.length - 1].push({ ...r, t: text.slice(0, cut).replace(/\s+$/, '') })
        lines.push([])
        text = text.slice(cut).replace(/^\s+/, '')
        pos = next
      } else {
        if (text.trim() || lines[lines.length - 1].length) lines[lines.length - 1].push({ ...r, t: text })
        pos += text.length
        text = ''
      }
    }
  })
  return lines.filter((l) => l.length).map((r) => ({ al: p.al, r }))
}
function wrapPara(p, maxW, forceNoWrap, breaks) {
  if (breaks) return breakPara(p, breaks)
  // The slides were set in a narrower font than ours, so a short label that fit
  // its box on the slide must never wrap here; only long annotations do.
  const noWrap = forceNoWrap || p.r.reduce((n, r) => n + r.t.length, 0) <= 22
  maxW *= 1.12
  const base = (p.r.find((r) => r.sz)?.sz || 18) * PT
  const lines = [[]]
  let used = 0
  p.r.forEach((r) => {
    const size = (r.sz ? r.sz * PT : base) * (r.sub || r.sup ? 0.72 : 1)
    r.t.split(/(\s+)/).forEach((tok) => {
      if (!tok) return
      const w = width(tok, size, r.b)
      if (!noWrap && used + w > maxW && used > 0 && tok.trim()) {
        lines.push([])
        used = 0
      }
      if (!used && !tok.trim()) return
      lines[lines.length - 1].push({ ...r, t: tok })
      used += w
    })
  })
  return lines.filter((l) => l.length).map((r) => ({ al: p.al, r }))
}

// Also given `fk` (the heading font), which is not read: memo compares every prop,
// so a change of font makes the text wrap again, in the new glyph widths.
const Text = memo(function Text({ t, fade, nudge }) {
  const innerW = Math.max(40, t.w - t.ins[0] - t.ins[2])
  const lines = t.para.flatMap((p, pi) => wrapPara(p, innerW, t.nw, t.br?.[pi]))
  const lh = (p) => (p.r.find((r) => r.sz && !r.sub && !r.sup)?.sz || p.r.find((r) => r.sz)?.sz || 18) * PT * 1.2
  const totalH = lines.reduce((n, p) => n + lh(p), 0)
  const boxTop = t.y - t.ins[1]
  const left = t.x - t.ins[0]
  let y0 = boxTop + t.ins[1]
  if (t.anc === 'ctr') y0 = boxTop + t.h / 2 - totalH / 2
  else if (t.anc === 'b') y0 = boxTop + t.h - totalH - t.ins[1]
  const cx = left + t.w / 2
  const cy = boxTop + t.h / 2
  let y = y0
  return (
    <g opacity={fade} data-ti={t.i} data-rot={t.rot ? 1 : undefined} transform={t.rot ? `rotate(${t.rot} ${cx} ${cy})` : nudge ? `translate(${nudge[0]} ${nudge[1]})` : undefined}>
      {lines.map((p, li) => {
        const fs = (p.r.find((r) => r.sz && !r.sub && !r.sup)?.sz || p.r.find((r) => r.sz)?.sz || 18) * PT
        const base = y + fs * 0.92
        y += lh(p)
        const al = p.al === 'ctr' ? 'middle' : p.al === 'r' ? 'end' : 'start'
        const x = p.al === 'ctr' ? left + t.w / 2 : p.al === 'r' ? left + t.w - t.ins[2] : left + t.ins[0]
        let pending = 0
        return (
          <text key={li} x={x} y={base} textAnchor={al} xmlSpace="preserve" className="bk-text" style={{ fontSize: fs }}>
            {p.r.map((r, ri) => {
              const rfs = (r.sz || fs / PT) * PT
              const dy = (r.sub ? rfs * 0.3 : r.sup ? -rfs * 0.35 : 0) - pending
              pending = r.sub ? rfs * 0.3 : r.sup ? -rfs * 0.35 : 0
              return (
                <tspan key={ri} dy={dy || undefined} fill={colour(r.c)} fontWeight={r.b ? 800 : 600} fontStyle={r.i ? 'italic' : undefined} fontSize={r.sub || r.sup ? rfs * 0.72 : rfs}>
                  {r.t}
                </tspan>
              )
            })}
          </text>
        )
      })}
    </g>
  )
})

const inRect = (r, [x, y], m) => x > r.x - m && x < r.x + r.width + m && y > r.y - m && y < r.y + r.height + m
function hitsLine(r, p, m) {
  for (let i = 1; i < p.length; i++) {
    const [x1, y1] = p[i - 1]
    const [x2, y2] = p[i]
    const n = Math.max(2, Math.ceil(Math.hypot(x2 - x1, y2 - y1) / 3))
    for (let k = 0; k <= n; k++) if (inRect(r, [x1 + ((x2 - x1) * k) / n, y1 + ((y2 - y1) * k) / n], m)) return true
  }
  return false
}
const overlap = (a, b) => a.x < b.x + b.width - 1 && a.x + a.width > b.x + 1 && a.y < b.y + b.height - 1 && a.y + a.height > b.y + 1

function resolveLabels(svg, prep) {
  const solid = prep.items.filter((it) => it.k === 's' && !it.d && it.w >= 2.2).map((it) => it.p)
  const groups = [...svg.querySelectorAll('g[data-ti]')].filter((g) => !g.dataset.rot)
  const boxes = groups.map((g) => {
    const b = g.getBBox()
    return { g, i: Number(g.dataset.ti), x: b.x, y: b.y, width: b.width, height: b.height }
  })
  const out = {}
  const DIRS = [[0, -1], [0, 1], [-1, 0], [1, 0], [-0.7, -0.7], [0.7, -0.7], [-0.7, 0.7], [0.7, 0.7]]
  const clashes = (b, self) => solid.some((p) => hitsLine(b, p, 2.5)) || boxes.some((o) => o !== self && overlap(b, o))
  // How far a label sticks out of the frame. A label is never moved further out
  // than it already is: in a wide reading font a label near the edge used to be
  // pushed clear of a curve and straight out of the picture.
  const [vx, vy, vw, vh] = prep.vb
  const outside = (r) => Math.max(0, vx - r.x, vy - r.y, r.x + r.width - (vx + vw), r.y + r.height - (vy + vh))
  boxes.forEach((b) => {
    if (!clashes(b, b)) return
    for (const d of [8, 14, 20, 28, 38, 50]) {
      for (const [dx, dy] of DIRS) {
        const moved = { x: b.x + dx * d, y: b.y + dy * d, width: b.width, height: b.height }
        if (!clashes(moved, b) && outside(moved) <= outside(b) + 0.5) {
          out[b.i] = [dx * d, dy * d]
          b.x = moved.x
          b.y = moved.y
          return
        }
      }
    }
  })
  return out
}

/*
  One drawn item. Memoised: while the diagram plays, only the items that are
  changing this frame are redrawn, not all fifty, and a finished label is not
  re-wrapped and re-measured sixty times a second.
*/
const Item = memo(function Item({ it, p, pts, ghost, hovered, nudge, fk }) {
  if (p <= 0 && !ghost) return null
  if (it.k === 's') {
    const w = Math.max(1.8, Math.min(3.8, it.w * 0.62))
    const dashed = it.d ? it.d.join(' ') : undefined
    if (ghost) return <path d={poly(pts)} className="bk-ghost" fill="none" stroke={colour(it.c)} strokeWidth={w} strokeDasharray="10 8" strokeLinecap="round" opacity="0.38" />
    const draw = it.morphFrom !== undefined ? 1 : p
    const path = (
      <path
        d={poly(pts)}
        fill="none"
        stroke={colour(it.c)}
        strokeWidth={hovered ? w + 2.5 : w}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={dashed ? undefined : 1}
        strokeDasharray={dashed ? dashed : `${draw} 2`}
        opacity={dashed ? p : 1}
        className="bk-stroke"
        style={{ '--c': colour(it.c) }}
      />
    )
    if (!it.a && !it.ah) return path
    // The slide's arrowheads, put on once the line has been drawn to its end.
    const line = it.morphFrom !== undefined ? pts : it.p
    const size = 9 + w * 1.6
    return (
      <g>
        {path}
        {p >= 0.97 && it.a && <polygon points={arrowHead(line, false, size)} fill={colour(it.c)} className="bk-head" />}
        {p >= 0.97 && it.ah && <polygon points={arrowHead(line, true, size)} fill={colour(it.c)} className="bk-head" />}
      </g>
    )
  }
  if (it.k === 'f')
    return (
      <polygon points={it.p.map(([x, y]) => `${x},${y}`).join(' ')} fill={it.c ? colour(it.c) : 'none'} fillOpacity={(it.o ?? 0.3) * Math.min(0.9, 1) * p} stroke={it.sc ? colour(it.sc) : 'none'} strokeWidth={Math.max(1.5, it.w * 0.8)} strokeDasharray={it.d ? it.d.join(' ') : undefined} opacity={p} />
    )
  if (it.k === 'd') return <circle cx={it.x} cy={it.y} r={Math.max(5, it.r)} fill={colour(it.c)} stroke="var(--surface)" strokeWidth="2" opacity={p} />
  if (it.k === 't') return <Text t={it} fade={p} nudge={nudge} fk={fk} />
  return null
})

/* `bare`: just the finished drawing, no title, controls or hover (a thumbnail). */
export default function BankCanvas({ slide, autoplay = true, onDone, caption = true, quiz = false, hover = null, bare = false, areas = null, speed = 1 }) {
  const reduce = useReducedMotion()
  // In a reading-support font the frame is sized from the real glyph widths.
  const fontKey = useHeadFont()
  const prep = useMemo(() => prepare(slide, FIXES[slide.id], fontKey !== 'default'), [slide, fontKey])
  const svgRef = useRef(null)
  const [nudge, setNudge] = useState({})
  const [ms, setMs] = useState(0)
  const [playing, setPlaying] = useState(autoplay && !reduce)
  const [tip, setTip] = useState(null)
  const figRef = useRef(null)
  const tipRef = useRef(null)
  const last = useRef(0)
  const raf = useRef(0)
  const doneRef = useRef(false)

  useEffect(() => {
    doneRef.current = false
    // Quiz mode: the diagram waits, unshifted, until "Do you know what shifts?" is pressed.
    setMs(quiz ? prep.beforeShift : autoplay && !reduce ? 0 : prep.total)
    setPlaying(!quiz && autoplay && !reduce)
    setTip(null)
  }, [prep, autoplay, reduce, quiz])

  useEffect(() => {
    if (!playing) return undefined
    last.current = performance.now()
    const tick = (now) => {
      const dt = (now - last.current) * speed
      last.current = now
      setMs((m) => {
        const n = m + dt
        if (n >= prep.total) {
          setPlaying(false)
          if (!doneRef.current) {
            doneRef.current = true
            onDone?.()
          }
          return prep.total
        }
        return n
      })
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [playing, prep, onDone, speed])

  // Labels that land on a curve, an axis or each other are moved the shortest
  // distance that clears them. Measured from the real rendered text.
  useLayoutEffect(() => {
    let live = true
    const run = () => {
      const svg = svgRef.current
      if (!svg || !live) return
      setNudge(resolveLabels(svg, prep))
    }
    run()
    document.fonts?.ready?.then(run)
    return () => {
      live = false
    }
  }, [prep])

  const { states, pen } = frame(prep, ms)
  const atEnd = ms >= prep.total - 2
  const [vx, vy, vw, vh] = prep.vb
  const replay = () => {
    // Replay skips straight to the shift when there is one.
    doneRef.current = false
    setMs(prep.shiftAt)
    setPlaying(true)
  }
  const point = (e) => {
    const r = figRef.current.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width }
  }
  // The tip sits beside the pointer, flips to the other side near the right
  // edge, and is kept inside the drawing: it must never cover the caption or
  // the scrubber below it. Placed before paint, from its real size.
  useLayoutEffect(() => {
    const el = tipRef.current
    if (!tip || !el || !figRef.current || !svgRef.current) return
    const f = figRef.current.getBoundingClientRect()
    const s = svgRef.current.getBoundingClientRect()
    const w = el.offsetWidth
    const h = el.offsetHeight
    const gap = 18
    const pad = 8
    const maxX = Math.max(pad, f.width - w - pad)
    const minY = s.top - f.top + pad
    const maxY = Math.max(minY, s.bottom - f.top - h - pad)
    const left = tip.x + gap > maxX ? tip.x - gap - w : tip.x + gap
    el.style.left = `${Math.min(Math.max(left, pad), maxX)}px`
    el.style.top = `${Math.min(Math.max(tip.y - h / 2, minY), maxY)}px`
  }, [tip])
  const showTip = (it) => (e) => {
    const moves = hover?.[it.base] || MOVES[it.base]
    if (!it.base || !moves) return
    setTip({ id: it.i, label: it.label, moves, colour: it.c, ...point(e) })
  }
  // Shaded or lettered areas that have a definition (data/diagram-areas.js).
  const areaShapes = useMemo(
    () =>
      (bare ? [] : areas || AREAS[slide.id] || [])
        .map((a, n) => ({ ...a, n, pts: a.poly || prep.byIndex[a.fill]?.p }))
        .filter((a) => a.pts && a.pts.length >= 3),
    [bare, slide.id, prep, areas],
  )
  const showArea = (a) => (e) => setTip({ id: `a${a.n}`, area: a.n, label: a.name, text: a.note, colour: 'ink', ...point(e) })
  const grid = Math.max(28, vw / 22)

  return (
    <figure className={`dr-canvas ${bare ? "is-bare" : ""}`} ref={figRef} onPointerLeave={() => setTip(null)}>
      <svg ref={svgRef} viewBox={`${vx} ${vy} ${vw} ${vh}`} className="dr-svg" role="img" aria-label={slide.title}>
        <defs>
          <pattern id={`bk-grid-${slide.id}`} width={grid} height={grid} patternUnits="userSpaceOnUse" x={vx} y={vy}>
            <path d={`M${grid} 0H0V${grid}`} fill="none" className="dr-grid-line" />
          </pattern>
        </defs>
        <rect x={vx} y={vy} width={vw} height={vh} fill={`url(#bk-grid-${slide.id})`} />

        {states.map(({ it, p, pts, ghost }) => (
          <Item key={it.i} it={it} p={p} pts={pts} ghost={ghost} hovered={tip?.id === it.i} nudge={nudge[it.i]} fk={fontKey} />
        ))}

        {/* Areas that have a definition. Under the curve bands, so a curve wins where they meet. Only once the drawing is finished, so nothing is defined before it is drawn. */}
        {areaShapes.length > 0 &&
          ms >= prep.titleAt - 1 &&
          areaShapes.map((a) => (
            <polygon
              key={`a${a.n}`}
              points={a.pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')}
              className={`dr-area ${tip?.area === a.n ? 'is-on' : ''}`}
              onPointerEnter={showArea(a)}
              onPointerMove={(e) => setTip((t) => (t && t.area === a.n ? { ...t, ...point(e) } : t))}
              onPointerLeave={(e) => {
                if (e.pointerType !== 'touch') setTip((t) => (t && t.area === a.n ? null : t))
              }}
              onClick={showArea(a)}
            />
          ))}

        {/* Invisible strokes over each curve that has something that shifts it. Their width is set in CSS in real screen pixels (a thin band along the curve, wider for a finger), and the tip goes away the moment the pointer leaves that curve. */}
        {!bare &&
          prep.items
          .filter((it) => it.k === 's' && it.base && (hover?.[it.base] || MOVES[it.base]) && polyLen(it.p) > 40)
          .map((it) => (
            <path
              key={`h${it.i}`}
              d={poly(it.p)}
              fill="none"
              stroke="transparent"
              className="dr-hit"
              onPointerEnter={showTip(it)}
              onPointerMove={(e) => setTip((t) => (t && t.id === it.i ? { ...t, ...point(e) } : t))}
              onPointerLeave={(e) => {
                if (e.pointerType !== 'touch') setTip((t) => (t && t.id === it.i ? null : t))
              }}
              onClick={showTip(it)}
            />
          ))}

        {pen && (
          <g transform={`translate(${pen[0]} ${pen[1]}) rotate(-38) scale(${vw / 760})`} className="dr-pencil" pointerEvents="none">
            <polygon points="0,0 14,-5 14,5" fill="var(--fg)" />
            <rect x="14" y="-5" width="34" height="10" rx="2" fill="var(--r2-shaky)" />
            <rect x="48" y="-5" width="7" height="10" rx="2" fill="var(--dr-red)" />
          </g>
        )}
      </svg>

      {!bare && tip && (
        <div ref={tipRef} className="dr-tip" style={{ '--c': colour(tip.colour) }} role="status">
          <div className="dr-tip-bar">
            <span className="srv-led" aria-hidden="true" />
            <p className="dr-tip-head">{tip.area !== undefined ? tip.label : `What shifts ${tip.label}`}</p>
          </div>
          {tip.area !== undefined ? (
            tip.text && <p className="dr-tip-text">{tip.text}</p>
          ) : (
            <ul>
              {tip.moves.map((m) => (
                <li key={m}>{m.split(':')[0]}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {!bare && (
      <figcaption className="dr-caption">
        {/* the title is written last, once axes, curves and equilibrium are down */}
        {caption && slide.title && ms >= prep.titleAt - 1 && (!quiz || !prep.hasShift || playing || atEnd) && <p className="dr-caption-text dr-caption-in">{slide.caption || slide.title}</p>}
        {quiz ? (
          prep.hasShift && (
            <div className="dr-controls">
              <button
                type="button"
                className="dr-btn dr-btn-primary"
                onClick={() => {
                  doneRef.current = false
                  setMs(prep.beforeShift)
                  setPlaying(true)
                }}
              >
                {atEnd ? 'Play the shift again' : playing ? 'Playing...' : 'Do you know what shifts?'}
              </button>
              {atEnd && (
                <button
                  type="button"
                  className="dr-btn"
                  onClick={() => {
                    setPlaying(false)
                    setMs(prep.beforeShift)
                  }}
                >
                  Hide the shift
                </button>
              )}
            </div>
          )
        ) : (
          <div className="dr-controls">
            <input
              type="range"
              min="0"
              max={Math.round(prep.total)}
              value={Math.round(ms)}
              onChange={(e) => {
                setPlaying(false)
                setMs(Number(e.target.value))
              }}
              className="dr-scrub"
              aria-label="Scrub through the drawing"
            />
            <button type="button" className="dr-btn" onClick={() => (playing ? setPlaying(false) : atEnd ? replay() : setPlaying(true))}>
              {playing ? 'Pause' : atEnd ? 'Replay' : 'Play'}
            </button>
          </div>
        )}
      </figcaption>
      )}
    </figure>
  )
}
