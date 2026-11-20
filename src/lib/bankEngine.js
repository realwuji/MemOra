// 'D1', 'AR = D', 'S_L' -> 'D', 'AR', 'SL': the letters that name a curve.
function keyOf(text) {
  const m = String(text || '').replace(/[₀-₉]/g, '').trim().match(/^([A-Za-z£]{1,6})s*(d)?(?![A-Za-z])/)
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
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))
export const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const PT = 1.25 // 1pt in slide units

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
const ROLE = { D: 'blue', DEMAND: 'blue', AD: 'blue', AR: 'blue', MPB: 'blue', MSB: 'blue', PPF: 'blue', PPC: 'blue', MRP: 'blue', SRPC: 'blue', 'D£': 'blue', S: 'red', SUPPLY: 'red', AS: 'red', SRAS: 'red', MC: 'red', MPC: 'red', MSC: 'red', LRPC: 'red', 'S£': 'red', LRAS: 'green', AC: 'green', ATC: 'green', LRAC: 'green', SRAC: 'green', AVC: 'cyan', AFC: 'purple', MR: 'purple', SL: 'red', DL: 'blue', ACL: 'red', MCL: 'red', TR: 'amber', TC: 'red', TVC: 'cyan', TFC: 'purple', AP: 'green', MP: 'red' }

// A label such as P, P1, Q2, D, D1: letters plus an optional digit.
const LABEL_RE = /^([A-Za-z£]{1,3})\s*([0-9₁-₉])?$/
const digitOf = (d) => (d ? ('₁₂₃₄₅₆₇₈₉'.includes(d) ? '₁₂₃₄₅₆₇₈₉'.indexOf(d) + 1 : Number(d)) : 0)

// Text item for a label the bank forgot to put on a curve.
function makeText(x, y, text, c) {
  const m = text.match(/^(.*?)(\d)$/)
  const runs = m ? [{ t: m[1], sz: 18, c }, { t: m[2], sz: 18, sub: true, c }] : [{ t: text, sz: 18, c }]
  return { k: 't', x, y, w: 130, h: 28, anc: 't', ins: [0, 0, 0], para: [{ al: 'l', r: runs }], synthetic: true }
}

export function prepare(slide, fixes) {
  const items = slide.items.map((it, i) => ({ ...it, i }))

  // Labels the teacher left off, added from the fixes table.
  const extra = []
  ;(fixes?.labels || []).forEach((f) => {
    const s = items[f.stroke]
    if (!s || s.k !== 's') return
    const [px, py] = pointAt(s.p, f.f ?? 0.5)
    const t = { ...makeText(px + (f.dx ?? 10), py + (f.dy ?? -26), f.text, f.c), i: items.length + extra.length }
    extra.push(t)
  })
  items.push(...extra)

  const strokes = items.filter((it) => it.k === 's' && it.p.length >= 2)
  const labels = items.filter((it) => it.k === 't').map((it) => ({ it, plain: textPlain(it), c: textCentre(it) })).filter((l) => /^[A-Za-z£]{1,6}\s*\d?(\s*[=+].{0,14})?$/.test(l.plain))

  // Greedy nearest-endpoint matching of labels to strokes.
  const pairs = []
  strokes.forEach((s) => {
    const ends = [s.p[0], s.p[s.p.length - 1]]
    labels.forEach((l) => {
      const d = Math.min(dist(ends[0], l.c), dist(ends[1], l.c))
      if (d < 75) pairs.push({ s, l, d })
    })
  })
  pairs.sort((a, b) => a.d - b.d)
  const usedS = new Set()
  const usedL = new Set()
  pairs.forEach(({ s, l }) => {
    if (usedS.has(s.i) || usedL.has(l.it.i)) return
    const base = keyOf(l.plain)
    if (!base) return
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
  })

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

  // Shifts: a later curve with the same base label as an earlier one. Pair by
  // label index, not drawing order, so D then D1 works whichever was inked first.
  const byBase = {}
  strokes
    .filter((s) => s.base)
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
      // A short title is never wrapped, so it can run past its box: find where
      // the line really starts and ends along the box, by its alignment.
      const len = it.nw || chr <= 28 ? chr * fsr * 0.6 : Math.min(chr * fsr * 0.6, it.w - it.ins[0] - it.ins[2])
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
    const longest = chars * fs * 0.6
    const wEst = lineLens || it.nw || chars <= 22 ? longest : Math.min(longest, it.w * 1.12)
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
        const a = resample(e.p)
        const b = resample(it.p)
        const q = ease(p)
        st.pts = a.map((pt, i) => [pt[0] + (b[i][0] - pt[0]) * q, pt[1] + (b[i][1] - pt[1]) * q])
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
