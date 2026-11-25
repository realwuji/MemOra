// 'D1', 'AR = D', 'S_L' -> 'D', 'AR', 'SL': the letters that name a curve.
function keyOf(text) {
  const m = String(text || '').replace(/[₀-₉]/g, '').trim().match(/^([A-Za-z£]{1,6})\s*(\d)?(?![A-Za-z])/)
  return m ? m[1].toUpperCase() : null
}

/*
  Plays a converted slide of the diagram bank (data/diagram-bank.json).

  The teacher's slides are built in a deliberate order - axes, labels,
  curves, guide lines - so replaying the z-order IS the drawing: the pen
  inks each stroke in turn and text appears as it was placed. Where a later
  curve carries the same label as an earlier one (D1 then D2, S1 then S2, AD1
  then AD2) it is not drawn again: the earlier curve slides to the new
  position and leaves a ghost behind, which is what a shift looks like.

  Time is a pure function, `frame(prep, ms)`, so play, pause, replay and the
  scrubber are one number.
*/

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1])
// How far a point is from the nearest part of a polyline.
function polyDist(pt, pts) {
  let best = Infinity
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1]
    const dx = pts[i][0] - ax
    const dy = pts[i][1] - ay
    const l2 = dx * dx + dy * dy || 1
    const t = Math.max(0, Math.min(1, ((pt[0] - ax) * dx + (pt[1] - ay) * dy) / l2))
    best = Math.min(best, dist(pt, [ax + t * dx, ay + t * dy]))
  }
  return best
}
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
export const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const PT = 1.25 // 1pt in slide units

/*
  Text widths in the font the diagram is really drawn in. The 0.6 em per
  character used to size the frame (and the wrapping in BankCanvas) was tuned on
  the default heading face. The two reading-support faces are not like it:
  OpenDyslexic is about half as wide again and its spaces are a third of an em.
  For those, the real glyphs are measured instead; for the default face nothing
  here changes.
*/
let measureCtx = null
const DEFAULT_STACK = "'Bricolage Grotesque Variable', 'Instrument Sans Variable', sans-serif"
export function textWidth(txt, size, bold) {
  if (typeof document === 'undefined') return txt.length * size * 0.55
  measureCtx ||= document.createElement('canvas').getContext('2d')
  const mode = document.documentElement.getAttribute('data-font') || 'default'
  const stack = (mode !== 'default' && getComputedStyle(document.documentElement).getPropertyValue('--font-head').trim()) || DEFAULT_STACK
  measureCtx.font = `${bold ? 800 : 600} ${size}px ${stack}`
  return measureCtx.measureText(txt).width
}

export function polyLen(p) {
  let n = 0
  for (let i = 1; i < p.length; i++) n += dist(p[i - 1], p[i])
  return n
}
export function resample(p, n = 48) {
  const cum = [0]
  for (let i = 1; i < p.length; i++) cum.push(cum[i - 1] + dist(p[i - 1], p[i]))
  const total = cum[cum.length - 1] || 1
  const out = []
  let j = 0
  for (let k = 0; k < n; k++) {
    const target = (total * k) / (n - 1)
    while (j < p.length - 2 && cum[j + 1] < target) j++
    const seg = cum[j + 1] - cum[j] || 1
    const u = (target - cum[j]) / seg
    out.push([p[j][0] + (p[j + 1][0] - p[j][0]) * u, p[j][1] + (p[j + 1][1] - p[j][1]) * u])
  }
  return out
}
export function pointAt(p, f) {
  const total = polyLen(p)
  let want = total * f
  for (let i = 1; i < p.length; i++) {
    const d = dist(p[i - 1], p[i])
    if (want <= d || i === p.length - 1) {
      const u = d ? want / d : 0
      return [p[i - 1][0] + (p[i][0] - p[i - 1][0]) * u, p[i - 1][1] + (p[i][1] - p[i - 1][1]) * u]
    }
    want -= d
  }
  return p[p.length - 1]
}

export const textPlain = (t) => t.para.map((p) => p.r.map((r) => r.t).join('')).join(' ').replace(/\s+/g, ' ').trim()
const fsOf = (t) => (t.para[0]?.r.find((r) => r.sz)?.sz || 18) * PT

// Approximate centre of a text item's visible glyphs (for matching labels to curves).
function textCentre(t) {
  const txt = textPlain(t)
  const fs = fsOf(t)
  const w = txt.length * fs * 0.58
  const al = t.para[0]?.al || 'l'
  const left = t.x - t.ins[0]
  const anchorX = al === 'ctr' ? left + t.w / 2 : al === 'r' ? left + t.w - t.ins[2] : t.x
  const cx = al === 'ctr' ? anchorX : al === 'r' ? anchorX - w / 2 : anchorX + w / 2
  return [cx, t.y + fs * 0.7]
}

// The teacher's curves are all black ink; colour them by what they are.
const ROLE = { D: 'blue', DEMAND: 'blue', AD: 'blue', AR: 'blue', MPB: 'blue', MSB: 'green', PPF: 'blue', MRP: 'blue', SRPC: 'blue', 'D£': 'blue', S: 'red', SUPPLY: 'red', AS: 'red', SRAS: 'red', MC: 'red', MPC: 'red', MSC: 'amber', LRPC: 'red', 'S£': 'red', LRAS: 'green', AC: 'green', ATC: 'green', LRAC: 'green', SRAC: 'green', AVC: 'cyan', AFC: 'purple', MR: 'purple', SL: 'red', DL: 'blue', ACL: 'red', MCL: 'red', TR: 'amber', TC: 'red', TVC: 'cyan', TFC: 'purple', AP: 'green', MP: 'red', SM: 'red', DM: 'blue' }

// Names the teacher wrote out in words, and what curve they mean.
const PHRASES = [
  [/^(S of L|Labour supply)\b/i, 'SL'],
  [/^(D of L|Labour demand)\b/i, 'DL'],
  [/\(\s*=\s*(MSB|MPB|MSC|MPC)\s*\)/i, null],
  [/^Dmarket\b/i, 'D'],
  [/^S\d? of £/i, 'S£'],
  [/^D\d? of £/i, 'D£'],
]
const phraseKey = (text) => {
  const t = String(text || '').trim()
  for (const [re, key] of PHRASES) {
    const m = t.match(re)
    if (m) return key || m[1].toUpperCase()
  }
  return null
}
const nameOf = (text) => phraseKey(text) || keyOf(text)

// Least-cost matching of rows to columns (Hungarian method), rows <= columns.
function hungarian(cost) {
  const n = cost.length
  const m = cost[0].length
  const u = Array(n + 1).fill(0)
  const v = Array(m + 1).fill(0)
  const p = Array(m + 1).fill(0)
  const way = Array(m + 1).fill(0)
  for (let i = 1; i <= n; i++) {
    p[0] = i
    let j0 = 0
    const minv = Array(m + 1).fill(Infinity)
    const used = Array(m + 1).fill(false)
    do {
      used[j0] = true
      const i0 = p[j0]
      let delta = Infinity
      let j1 = 0
      for (let j = 1; j <= m; j++) {
        if (used[j]) continue
        const cur = cost[i0 - 1][j - 1] - u[i0] - v[j]
        if (cur < minv[j]) {
          minv[j] = cur
          way[j] = j0
        }
        if (minv[j] < delta) {
          delta = minv[j]
          j1 = j
        }
      }
      for (let j = 0; j <= m; j++) {
        if (used[j]) {
          u[p[j]] += delta
          v[j] -= delta
        } else minv[j] -= delta
      }
      j0 = j1
    } while (p[j0] !== 0)
    do {
      const j1 = way[j0]
      p[j0] = p[j1]
      j0 = j1
    } while (j0)
  }
  const ans = Array(n).fill(-1)
  for (let j = 1; j <= m; j++) if (p[j]) ans[p[j] - 1] = j - 1
  return ans
}

// A label such as P, P1, Q2, D, D1: letters plus an optional digit.
const LABEL_RE = /^([A-Za-z£]{1,3})\s*([0-9₁-₉])?$/
const digitOf = (d) => (d ? ('₁₂₃₄₅₆₇₈₉'.includes(d) ? '₁₂₃₄₅₆₇₈₉'.indexOf(d) + 1 : Number(d)) : 0)

// Text item for a label the bank forgot to put on a curve.
function makeText(x, y, text, c, b) {
  const m = text.match(/^(.*?)(\d)$/)
  const runs = m ? [{ t: m[1], sz: 18, c, b }, { t: m[2], sz: 18, sub: true, c, b }] : [{ t: text, sz: 18, c, b }]
  return { k: 't', x, y, w: 130, h: 28, anc: 't', ins: [0, 0, 0], para: [{ al: 'l', r: runs }], synthetic: true }
}

// `measured`: the page is set in a reading-support font, so size the frame from
// the real glyphs (see textWidth) instead of the default face's average.
export function prepare(slide, fixes, measured = false) {
  // `drop`: items of the slide that are wrong or not wanted (by their number in
  // slide.items); the others keep their numbers so the other fixes still line up.
  const dropped = new Set(fixes?.drop || [])
  const items = slide.items.map((it, i) => ({ ...it, i })).filter((it) => !dropped.has(it.i))

  // `rename`: { item number: new text } for a label that says the wrong thing (a firm's
  // demand curve in a revenue diagram is its AR curve), keeping the label's own look.
  Object.entries(fixes?.rename || {}).forEach(([n, text]) => {
    const it = items.find((x) => x.i === Number(n))
    if (it?.k === 't') {
      it.para = it.para.map((p, pi) => (pi === 0 ? { ...p, r: [{ ...p.r[0], t: text }] } : p))
      it.br = it.para.map(() => []) // the old line breaks belonged to the old words
    }
  })

  // Labels the teacher left off, added from the fixes table.
  const extra = []
  ;(fixes?.labels || []).forEach((f) => {
    const s = items[f.stroke]
    if (!s || s.k !== 's') return
    const [px, py] = pointAt(s.p, f.f ?? 0.5)
    const t = { ...makeText(px + (f.dx ?? 10), py + (f.dy ?? -26), f.text, f.c), i: items.length + extra.length }
    extra.push(t)
  })
  // `fills`: shaded areas drawn in place of ones the slide got wrong (two
  // revenue rectangles laid over each other). `texts`: the letters that name them.
  ;(fixes?.fills || []).forEach((f) => {
    extra.push({ k: 'f', p: f.poly, c: f.c, o: f.o ?? 0.3, w: 1.3, sc: f.c, i: items.length + extra.length, synthetic: true })
  })
  ;(fixes?.texts || []).forEach((f) => {
    extra.push({ ...makeText(f.x, f.y, f.text, f.c, true), i: items.length + extra.length })
  })
  items.push(...extra)

  const strokes = items.filter((it) => it.k === 's' && it.p.length >= 2)
  // `notCurve`: letters on a slide that mark points, not curves (the D of a point D on a
  // product curve is not a demand curve).
  const notCurve = new Set(fixes?.notCurve || [])
  const labels = items
    .filter((it) => it.k === 't')
    .map((it) => ({ it, plain: textPlain(it), c: textCentre(it) }))
    .filter((l) => !notCurve.has(l.plain) && (/^[A-Za-z£]{1,6}\s*\d?(\s*[=+].{0,14})?$/.test(l.plain) || phraseKey(l.plain)))

  /*
    Matching labels to strokes, greedy by distance, in two passes. A curve's name (D,
    S, AC, LRAS...) is matched first, so the letters on an axis (P, Q, Y) cannot take a
    curve that stands near them (the vertical LRAS, a money supply line) and leave its
    own name behind. A name sits at the end of its curve; one a little way along a curve
    (a PPF labelled in the middle) counts too, but only after every end-of-curve match
    has been made. The axes themselves are never named curves.
  */
  const solid = strokes.filter((s) => !s.d && s.p.length === 2)
  const axisLike = new Set()
  solid
    .filter((s) => Math.abs(s.p[0][0] - s.p[1][0]) < 9 && Math.abs(s.p[0][1] - s.p[1][1]) > 90)
    .forEach((v) => {
      const bottom = v.p[0][1] > v.p[1][1] ? v.p[0] : v.p[1]
      solid
        .filter((h) => Math.abs(h.p[0][1] - h.p[1][1]) < 9 && Math.abs(h.p[0][0] - h.p[1][0]) > 90)
        .forEach((h) => {
          const left = h.p[0][0] < h.p[1][0] ? h.p[0] : h.p[1]
          if (dist(bottom, left) < 22) {
            axisLike.add(v.i)
            axisLike.add(h.i)
          }
        })
    })
  const usedS = new Set()
  const usedL = new Set()
  // A short dashed or thin line straight up or across is a guide to an axis, not a curve:
  // it only takes a name that belongs to an upright curve (LRAS, the money supply...).
  const UPRIGHT = new Set(['LRAS', 'LRPC', 'SM'])
  const guideLike = (s) => s.p.length === 2 && (s.d || s.w < 3) && (Math.abs(s.p[0][0] - s.p[1][0]) < 9 || Math.abs(s.p[0][1] - s.p[1][1]) < 9)
  const NONE = 1e6
  const pairUp = (ls, ss, alongToo) => {
    const L = ls.filter((l) => !usedL.has(l.it.i) && nameOf(l.plain))
    const S = ss.filter((s) => !usedS.has(s.i))
    if (!L.length || !S.length) return
    const cost = (l, s) => {
      // An arrow is never a curve (the shift arrows between PPF1 and PPF2).
      if (s.a || s.ah) return NONE
      // A guide line never takes a curve's name (the D, E, F under a cost diagram mark outputs).
      if (guideLike(s) && ROLE[nameOf(l.plain) || ''] && !UPRIGHT.has(nameOf(l.plain))) return NONE
      const d = Math.min(dist(s.p[0], l.c), dist(s.p[s.p.length - 1], l.c))
      if (d < 75) return d
      if (alongToo) {
        const m = polyDist(l.c, s.p)
        if (m < 30) return 60 + m
      }
      return NONE
    }
    const link = (l, s) => {
      const base = nameOf(l.plain)
      usedS.add(s.i)
      usedL.add(l.it.i)
      const dig = l.plain.match(/(\d)(?!.*\d)/)
      s.label = l.plain
      s.base = base
      s.idx = dig ? Number(dig[1]) : 0
      l.it.owner = s.i
      // Colour-coded by what the curve IS (AR blue, MR purple, MC red, AC green...),
      // whatever colour the slide happened to be drawn in.
      if (ROLE[base]) s.c = ROLE[base]
    }
    if (!alongToo) {
      // The letters of an axis or a point (P, Q, W...): each goes to the nearest line.
      const pairs = []
      S.forEach((s) => L.forEach((l) => cost(l, s) < NONE && pairs.push({ s, l, d: cost(l, s) })))
      pairs.sort((a, b) => a.d - b.d)
      pairs.forEach(({ s, l }) => !usedS.has(s.i) && !usedL.has(l.it.i) && link(l, s))
      return
    }
    // The names of curves: every name gets the curve that suits all the names best
    // together, not just the nearest one, so AC and AC1 beside two curves end up on
    // the right ones.
    const flip = L.length > S.length
    const rows = flip ? S : L
    const cols = flip ? L : S
    const ans = hungarian(rows.map((r) => cols.map((c) => (flip ? cost(c, r) : cost(r, c)))))
    ans.forEach((j, i) => {
      if (j < 0) return
      const l = flip ? cols[j] : rows[i]
      const s = flip ? rows[i] : cols[j]
      if (cost(l, s) < NONE) link(l, s)
    })
  }
  pairUp(
    labels.filter((l) => ROLE[nameOf(l.plain) || '']),
    strokes.filter((s) => !axisLike.has(s.i)),
    true,
  )
  pairUp(labels, strokes, false)

  /*
    Axes: a long upright and a long flat solid line that meet at a corner. They
    are drawn first, in plain ink, so nothing else is the same colour as them.
  */
  const plain = strokes.filter((s) => !s.d && s.p.length === 2 && !ROLE[s.base || ''])
  const ups = plain.filter((s) => Math.abs(s.p[0][0] - s.p[1][0]) < 9 && Math.abs(s.p[0][1] - s.p[1][1]) > 90)
  const flats = plain.filter((s) => Math.abs(s.p[0][1] - s.p[1][1]) < 9 && Math.abs(s.p[0][0] - s.p[1][0]) > 90)
  const origins = []
  ups.forEach((v) => {
    const bottom = v.p[0][1] > v.p[1][1] ? v.p[0] : v.p[1]
    const top = v.p[0][1] < v.p[1][1] ? v.p[0] : v.p[1]
    flats.forEach((h) => {
      const left = h.p[0][0] < h.p[1][0] ? h.p[0] : h.p[1]
      const right = h.p[0][0] > h.p[1][0] ? h.p[0] : h.p[1]
      if (dist(bottom, left) < 22) {
        v.axis = true
        h.axis = true
        v.c = 'ink'
        h.c = 'ink'
        origins.push({ o: left, top, right })
      }
    })
  })
  // Which panel (which y axis) a point belongs to, for multi-panel slides.
  const panelXs = [...new Set(origins.map((o) => Math.round(o.o[0])))].sort((a, b) => a - b)
  const panelOf = (pt) => {
    let n = 0
    panelXs.forEach((x, i) => {
      if (x <= pt[0] + 25) n = i
    })
    return n
  }

  /*
    A curve drawn past an axis is cut where it meets it. The teacher's slides
    sometimes let a line run a little beyond the axes (the end of the PPF in
    slide 5 hangs below the x axis), which reads as a mistake in the drawing.
    Only a clear overshoot is cut (more than 2.5 units), and only for a curve
    that sits inside one panel's axes.
  */
  const cutAt = (pts, inside, hit) => {
    const out = []
    for (let k = 0; k < pts.length; k++) {
      const a = pts[k]
      const b = pts[k + 1]
      if (inside(a)) out.push(a)
      if (b && inside(a) !== inside(b)) out.push(hit(a, b))
    }
    return out
  }
  strokes.forEach((s) => {
    if (s.axis || !origins.length || s.p.length < 2) return
    const mid = pointAt(s.p, 0.5)
    const home = origins.find((g) => mid[0] >= g.o[0] - 6 && mid[0] <= g.right[0] + 6 && mid[1] >= g.top[1] - 6 && mid[1] <= g.o[1] + 6)
    if (!home) return
    const xmin = home.o[0]
    const ymax = home.o[1]
    const past = s.p.some((q) => q[1] > ymax + 2.5 || q[0] < xmin - 2.5)
    if (!past) return
    let pts = cutAt(s.p, (q) => q[1] <= ymax, (a, b) => [a[0] + ((b[0] - a[0]) * (ymax - a[1])) / (b[1] - a[1]), ymax])
    pts = cutAt(pts, (q) => q[0] >= xmin, (a, b) => [xmin, a[1] + ((b[1] - a[1]) * (xmin - a[0])) / (b[0] - a[0])])
    // Only a small overshoot is a slip of the pen. A line that goes well past the axis on
    // purpose (marginal revenue turning negative, below the output axis) is left alone.
    if (pts.length >= 2 && polyLen(s.p) - polyLen(pts) <= 45) s.p = pts
  })

  // Shifts: a later curve with the same base label as an earlier one. Pair by
  // label index, not drawing order, so D then D1 works whichever was inked first.
  const byBase = {}
  strokes
    .filter((s) => s.base && !s.axis)
    .sort((a, b) => a.idx - b.idx || a.i - b.i)
    .forEach((s) => {
      const group = (byBase[s.base] ||= [])
      const prev = group.filter((e) => e.idx < s.idx && !e.shiftedTo).pop()
      if (prev && polyLen(s.p) > 40) {
        s.morphFrom = prev.i
        prev.shiftedTo = s.i
      }
      group.push(s)
    })

  /*
    Stages. Labels with the same letters form a sequence: P, P1 (or P1, P2).
    The lowest is the original state, the next is what it becomes. Everything
    tied to a later label - the shifted curve, its guide lines, its dots - is
    drawn after the shift, so the order is: original equilibrium, then the
    shift, then the new equilibrium (P before P1, never the other way round).
  */
  const groups = {}
  items.forEach((it) => {
    if (it.k !== 't') return
    const m = textPlain(it).replace(/\s+/g, '').match(LABEL_RE)
    if (!m) return
    // An axis title ("Q" at the end of the x axis) is not the first stage of Q1, Q2.
    if (it.owner !== undefined && strokes.some((s) => s.i === it.owner && s.axis)) return
    it.lkey = m[1].toUpperCase()
    it.ldig = digitOf(m[2])
    ;(groups[it.lkey] ||= new Set()).add(it.ldig)
  })
  items.forEach((it) => {
    if (it.k !== 't' || it.lkey === undefined) return
    const ranks = [...groups[it.lkey]].sort((a, b) => a - b)
    it.stage = ranks.length > 1 ? ranks.indexOf(it.ldig) : 0
  })
  const staged = items.filter((it) => it.k === 't' && it.stage > 0)
  const labelStage = (pt) => {
    let best = null
    items.forEach((it) => {
      if (it.k !== 't' || it.lkey === undefined || !groups[it.lkey] || groups[it.lkey].size < 2) return
      const d = dist(pt, textCentre(it))
      if (d < 58 && (!best || d < best.d)) best = { d, stage: it.stage }
    })
    return best ? best.stage : null
  }
  strokes.forEach((s) => {
    if (s.morphFrom !== undefined || s.label) {
      // a labelled curve takes its label's stage
      const l = labels.find((x) => x.plain === s.label && usedL.has(x.it.i))
      s.stage = l && l.it.stage !== undefined ? l.it.stage : 0
      if (s.morphFrom !== undefined && !s.stage) s.stage = 1
    }
  })
  strokes.forEach((s) => {
    if (s.stage !== undefined) return
    const guide = s.d || s.w < 3
    if (!guide) return
    const a = labelStage(s.p[0])
    const b = labelStage(s.p[s.p.length - 1])
    const st = Math.max(a ?? 0, b ?? 0)
    s.stage = st
  })
  items.forEach((it) => {
    if (it.stage !== undefined) return
    if (it.k === 'd') {
      const g = strokes.find((s) => s.stage > 0 && s.p.some((q) => dist(q, [it.x, it.y]) < 10))
      it.stage = g ? g.stage : 0
    } else if (it.k === 'f') {
      const hit = strokes.filter((s) => s.stage > 0 && s.p.some((q) => it.p.some((v) => dist(q, v) < 14)))
      it.stage = hit.length ? Math.max(...hit.map((s) => s.stage)) : 0
    } else it.stage = 0
  })
  // Slides that compare two outcomes (profit maximising against allocatively
  // efficient output) have P1 and P2, Q1 and Q2 but nothing shifts: draw them in one go.
  if (fixes?.noShift) {
    items.forEach((it) => {
      it.stage = 0
      delete it.morphFrom
      delete it.shiftedTo
    })
  }
  const hasStages = staged.length > 0 || strokes.some((s) => s.stage > 0)

  /*
    Drawing order, always the same: AXES (with what they are called), then the
    CURVES (each label is written as its curve is drawn, never before it), then
    the EQUILIBRIUM (guide lines, dots, shading, P and Q), then the TITLES and
    any other writing. A slide with several panels goes panel by panel inside
    each step. With a shift the order is the original state, then the shift;
    the titles come last of all.
  */
  const AXIS_WORD = /^(output|quantity|price( level)?|real (gdp|national output|output)|gdp|national income|income|wages?( rate)?|labour|employment|inflation( rate)?( %)?|unemployment( rate)?( %)?|exchange rate|interest rate|revenue( and costs)?|costs?( and revenue)?|cost ?\/ ?rev|p ?\/ ?c|rate)$/i
  strokes.forEach((s) => {
    s.phase = s.axis ? 0 : (s.d || s.w < 3) && !ROLE[s.base || ''] ? 2 : 1
  })
  const strokeByI = new Map(strokes.map((s) => [s.i, s]))
  items.forEach((it) => {
    if (it.k === 's') return
    if (it.k === 'f' && !it.c) {
      it.phase = 0 // an outline with no fill is the chart's frame: drawn with the axes
      return
    }
    if (it.k === 'd' || it.k === 'f') {
      it.phase = 2
      return
    }
    const own = it.owner !== undefined ? strokeByI.get(it.owner) : null
    if (own) {
      it.phase = own.phase
      it.anchor = own.i + 0.5 // straight after its own curve
      return
    }
    const plain = textPlain(it)
    const c = textCentre(it)
    const quarter = it.rot && Math.abs((((it.rot % 180) + 180) % 180) - 90) < 20
    const nearAxis = origins.some((o) => dist(c, o.top) < 160 || dist(c, o.right) < 160 || dist(c, o.o) < 70)
    if (quarter || (nearAxis && (AXIS_WORD.test(plain) || /^[0-9.,%]+$/.test(plain) || /^[0O]$/.test(plain)))) it.phase = 0
    else if (LABEL_RE.test(plain.replace(/\s+/g, ''))) it.phase = 2
    else it.phase = 3
  })
  // Writing takes the colour of what it names: curve labels their curve, axis titles plain ink.
  items.forEach((it) => {
    if (it.k !== 't') return
    const own = it.owner !== undefined ? strokeByI.get(it.owner) : null
    const col = own ? (own.axis ? 'ink' : ROLE[own.base] ? own.c : null) : it.phase === 0 ? 'ink' : null
    if (col) it.para = it.para.map((p) => ({ ...p, r: p.r.map((r) => ({ ...r, c: col })) }))
  })

  // `recolour`: { item number: colour key } for things the slide coloured the same
  // that must be told apart (the elastic and inelastic ends of a demand curve).
  // A shaded area may also be given how strong it is: { c: 'blue', o: 0.25 }.
  Object.entries(fixes?.recolour || {}).forEach(([n, spec]) => {
    const it = items.find((x) => x.i === Number(n))
    if (!it) return
    const col = typeof spec === 'object' ? spec.c : spec
    if (typeof spec === 'object' && spec.o !== undefined) it.o = spec.o
    if (it.k === 't') it.para = it.para.map((p) => ({ ...p, r: p.r.map((r) => ({ ...r, c: col })) }))
    else it.c = col
  })

  // `nudge`: { item number: [dx, dy] } moves a label (or a whole line or dot) that sits on
  // another line or runs into its neighbour. Applied last, so the pairing above is unaffected.
  Object.entries(fixes?.nudge || {}).forEach(([n, [dx, dy]]) => {
    const it = items.find((x) => x.i === Number(n))
    if (!it) return
    if (it.k === 's') it.p = it.p.map(([x, y]) => [x + dx, y + dy])
    else if (typeof it.x === 'number') {
      it.x += dx
      it.y += dy
    }
  })

  // `pin`: { item: [x, y] } puts a line's first end exactly there; `pinEnd` its last end (a line
  // that stops short of the curve it meets, or starts off its axis). `vertical`: [items] makes a
  // near-vertical guide exactly vertical. `solid`: [items] draws a dashed line solid.
  Object.entries(fixes?.pin || {}).forEach(([n, pt]) => {
    const it = items.find((x) => x.i === Number(n))
    if (it?.k === 's') it.p = [pt, ...it.p.slice(1)]
  })
  Object.entries(fixes?.pinEnd || {}).forEach(([n, pt]) => {
    const it = items.find((x) => x.i === Number(n))
    if (it?.k === 's') it.p = [...it.p.slice(0, -1), pt]
  })
  ;(fixes?.vertical || []).forEach((n) => {
    const it = items.find((x) => x.i === Number(n))
    if (it?.k !== 's') return
    const x = it.p.reduce((t, q) => t + q[0], 0) / it.p.length
    it.p = it.p.map(([, y]) => [x, y])
  })
  ;(fixes?.solid || []).forEach((n) => {
    const it = items.find((x) => x.i === Number(n))
    if (it) it.dash = undefined
  })

  const rank = (it) => (it.stage > 0 && it.morphFrom === undefined ? 1 : 0)
  const point = (it) => (it.k === 's' ? it.p[0] : it.k === 't' ? textCentre(it) : it.k === 'd' ? [it.x, it.y] : it.p?.[0] || [0, 0])
  const sortKey = (it) => [it.phase === 3 ? 1 : 0, it.phase === 3 ? 0 : it.stage, it.phase, panelOf(point(it)), rank(it), it.anchor ?? it.i]
  const order = [...items].sort((a, b) => {
    const ka = sortKey(a)
    const kb = sortKey(b)
    for (let n = 0; n < ka.length; n++) if (ka[n] !== kb[n]) return ka[n] - kb[n]
    return 0
  })
  let t = 0
  order.forEach((it) => {
    let dur = 220
    if (it.k === 's') dur = it.morphFrom !== undefined ? 1300 : clamp(polyLen(it.p) * 4, 200, 760)
    else if (it.k === 'f') dur = 320
    else if (it.k === 'd') dur = 160
    it.t0 = t
    it.dur = dur
    t += dur + 30
    // a beat before the shift so the original state can be read
    if (hasStages && it.stage === 0 && order[order.indexOf(it) + 1]?.stage > 0) t += 700
  })
  const cap = 8600
  const k = t > cap ? cap / t : 1
  items.forEach((it) => {
    it.t0 *= k
    it.dur = it.morphFrom !== undefined ? it.dur : it.dur * k
  })
  const total = t * k + 1600
  // The title waits until everything else is down.
  const firstTitle = order.find((it) => it.phase === 3)
  const titleAt = firstTitle ? firstTitle.t0 : t * k

  // viewBox around everything drawn.
  let [x0, y0, x1, y1] = slide.box
  // Grow the frame to hold every piece of text at its real width.
  items.forEach((it) => {
    if (it.k !== 't') return
    if (it.rot) {
      // A text turned a quarter turn (an axis title) swaps its width and height
      // about its centre, so it can poke out of the frame at the left or the top.
      const turn = ((it.rot % 180) + 180) % 180
      if (Math.abs(turn - 90) > 20) return // along a curve: leave it where it is
      const fsr = fsOf(it)
      const chr = Math.max(...it.para.map((p) => p.r.reduce((n, r) => n + r.t.length, 0)))
      const realLen = measured ? Math.max(...it.para.map((p) => textWidth(p.r.map((r) => r.t).join(''), fsr, p.r.some((r) => r.b)))) * 1.06 : 0
      const rawLen = Math.max(chr * fsr * 0.6, realLen)
      // A short title is never wrapped, so it can run past its box: find where
      // the line really starts and ends along the box, by its alignment.
      const len = it.nw || chr <= 28 ? rawLen : Math.min(rawLen, it.w - it.ins[0] - it.ins[2])
      const al = it.para[0]?.al || 'l'
      const a = al === 'ctr' ? -len / 2 : al === 'r' ? it.w / 2 - it.ins[2] - len : -it.w / 2 + it.ins[0]
      const cx = it.x - it.ins[0] + it.w / 2
      const cy = it.y - it.ins[1] + it.h / 2
      // A quarter turn clockwise (90) reads downwards, so along-the-box offsets
      // run +y; a three-quarter turn (270) reads upwards, so they run -y.
      const up = ((it.rot % 360) + 360) % 360 > 180
      const ys = up ? [cy - (a + len), cy - a] : [cy + a, cy + a + len]
      x0 = Math.min(x0, cx - it.h / 2)
      x1 = Math.max(x1, cx + it.h / 2)
      y0 = Math.min(y0, ys[0])
      y1 = Math.max(y1, ys[1])
      return
    }
    const fs = fsOf(it)
    // With PowerPoint's own line breaks the lines are known exactly; without
    // them, estimate from the text and its box.
    const lineLens = it.br
      ? it.para.flatMap((p, pi) => {
          const total = p.r.reduce((n, r) => n + r.t.length, 0)
          const cuts = [0, ...(it.br[pi] || []), total]
          return cuts.slice(1).map((v, i) => v - cuts[i])
        })
      : null
    const chars = lineLens ? Math.max(...lineLens) : Math.max(...it.para.map((p) => p.r.reduce((n, r) => n + r.t.length, 0)))
    // Teachers space tick labels out with long runs of spaces ("0      20
    // 40"), and counting each one as a full letter made the Lorenz slides' x
    // axis look twice as wide as it is, which left the drawing small in the
    // middle of an empty frame. A space is about half as wide as a letter, so
    // in a run of three or more each counts as half. Ordinary single spaces
    // are left alone: the 0.6 em per character below is already an average that
    // includes them. `chars` stays a plain count: it only decides whether a
    // title is short enough never to wrap.
    const wide = (s) => s.replace(/ {3,}/g, (run) => ' '.repeat(Math.ceil(run.length / 2))).length
    const paraText = (p) => p.r.map((r) => r.t).join('')
    // Every line as text, so it can be counted (estimate) or measured (real font).
    const pieces = it.br
      ? it.para.flatMap((p, pi) => {
          const text = paraText(p)
          const cuts = [0, ...(it.br[pi] || []), text.length]
          return cuts.slice(1).map((v, i) => ({ text: text.slice(cuts[i], v), bold: p.r.some((r) => r.b) }))
        })
      : it.para.map((p) => ({ text: paraText(p), bold: p.r.some((r) => r.b) }))
    const widest = Math.max(...pieces.map((s) => wide(s.text)))
    // In a reading-support font the frame is never smaller than the estimate, but
    // grows to the real width where the font is wider (6% for word-wrap slack).
    const realWidest = measured ? Math.max(...pieces.map((s) => textWidth(s.text.trimEnd(), fs, s.bold))) * 1.06 : 0
    const longest = Math.max(widest * fs * 0.6, realWidest)
    // PowerPoint's own breaks keep every line inside its box unless the box is
    // set not to wrap, so the box width caps the estimate for those.
    // (In a wider font those lines run past the box, so the cap gives way to the
    // measured width; unbroken text is wrapped to the box in the real font.)
    const wEst = lineLens && !it.nw ? Math.min(longest, Math.max(it.w * 1.12, realWidest)) : lineLens || it.nw || chars <= 22 ? longest : Math.min(longest, it.w * 1.12)
    const al = it.para[0]?.al || 'l'
    const left = it.x - it.ins[0]
    const l = al === 'ctr' ? left + it.w / 2 - wEst / 2 : al === 'r' ? left + it.w - it.ins[2] - wEst : it.x
    const lines = lineLens ? lineLens.length : it.para.length + (it.nw || chars <= 22 ? 0 : Math.max(0, Math.ceil(longest / wEst) - 1))
    x0 = Math.min(x0, l)
    x1 = Math.max(x1, l + wEst)
    y1 = Math.max(y1, it.y + lines * fs * 1.2)
  })
  const pad = 46
  let W = x1 - x0 + pad * 2
  let H = y1 - y0 + pad * 2
  let vx = x0 - pad
  let vy = y0 - pad
  if (W / H < 1.4) {
    const nw = H * 1.4
    vx -= (nw - W) / 2
    W = nw
  } else if (W / H > 2.2) {
    const nh = W / 2.2
    vy -= (nh - H) / 2
    H = nh
  }
  const firstMorph = items.filter((it) => it.morphFrom !== undefined).map((it) => it.t0)
  return { items, vb: [vx, vy, W, H], total, titleAt, shiftAt: firstMorph.length ? Math.max(0, Math.min(...firstMorph) - 700) : 0, beforeShift: firstMorph.length ? Math.max(0, Math.min(...firstMorph) - 30) : total, hasShift: firstMorph.length > 0, byIndex: Object.fromEntries(items.map((it) => [it.i, it])) }
}

// State of every item at `ms`.
export function frame(prep, ms) {
  let pen = null
  const out = prep.items.map((it) => {
    const p = clamp((ms - it.t0) / it.dur, 0, 1)
    const st = { it, p: 0, pts: null, ghost: 0 }
    if (it.k === 's') {
      if (it.morphFrom !== undefined) {
        const e = prep.byIndex[it.morphFrom]
        // Before and after the shift the shape is fixed: reuse it (same array, so a
        // memoised item does not redraw), and only blend while it is moving.
        it.startPts ||= resample(e.p)
        it.endPts ||= resample(it.p)
        if (p >= 1) st.pts = it.endPts
        else if (p <= 0) st.pts = it.startPts
        else {
          const a = it.startPts
          const b = it.endPts
          const q = ease(p)
          st.pts = a.map((pt, i) => [pt[0] + (b[i][0] - pt[0]) * q, pt[1] + (b[i][1] - pt[1]) * q])
        }
        st.p = ms >= it.t0 ? 1 : 0
        st.fadeIn = 1
      } else {
        st.pts = it.p
        st.p = ease(p)
        if (p > 0 && p < 1 && !it.d && !pen) pen = pointAt(it.p, st.p)
      }
      if (it.shiftedTo !== undefined) {
        const s = prep.byIndex[it.shiftedTo]
        if (ms >= s.t0) {
          st.ghost = 1
          st.p = 1
        }
      }
    } else st.p = ease(p)
    return st
  })
  return { states: out, pen }
}
