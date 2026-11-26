/*
  A marked point with guides to both axes, for the converted slides that drew curves
  but never picked a point on them (the demand curve, the cost curves, the PPF...).

  Every diagram that has axes should show a point on a curve with its value read off
  each axis, as the limit pricing diagram does. The point is chosen from the slide's
  own geometry: where two curves cross (equilibrium, MC meeting ATC, MR meeting MC);
  failing that, the lowest point of a U-shaped curve; failing that, the middle of the
  main curve. It is added in the same format as the teacher's own guide lines, so the
  engine draws it with the rest.
*/

const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1])

// Slides that have axes and curves but no marked point (found by scripts-audit.mjs).
export const POINT_SLIDES = [
  4, 5, 8, 9, 10, 11, 14, 30, 31, 77, 87, 88, 90, 91, 92, 93, 94, 95, 96, 100, 104, 105, 106, 107, 108, 109, 110, 111, 113, 114, 115, 117, 121, 122, 123, 124, 127, 135, 144, 165, 207, 218, 220, 221,
]

// Slides whose own labels name the point already, or where a point would mislead; set as needed.
const SKIP = new Set([30, 31, 115, 127])

const Y_WORDS = [
  [/price level/i, 'PL'],
  [/price/i, 'P'],
  [/wage/i, 'W'],
  [/cost|revenue|\$|£/i, 'C'],
  [/capital/i, 'K'],
  [/consumer/i, 'C'],
  [/exchange/i, 'E'],
  [/inflation/i, 'π'],
  [/gdp|income|output|price level/i, 'P'],
  [/interest/i, 'i'],
]
const X_WORDS = [
  [/national output/i, 'Y'],
  [/gdp|income/i, 'Y'],
  [/quantity|output|demand|supply/i, 'Q'],
  [/capital/i, 'K'],
  [/consumer/i, 'C'],
  [/gdp|income/i, 'Y'],
  [/labour/i, 'L'],
  [/unemploy/i, 'U'],
  [/time/i, 'T'],
]
const pick = (words, txt, fallback) => {
  for (const [re, l] of words) if (re.test(txt)) return l
  const first = txt.match(/[A-Za-z]/)
  return first ? first[0].toUpperCase() : fallback
}
const plain = (t) => t.para.map((p) => p.r.map((r) => r.t).join('')).join(' ').replace(/\s+/g, ' ').trim()

function segHit(a, b, c, d) {
  const r = [b[0] - a[0], b[1] - a[1]]
  const s = [d[0] - c[0], d[1] - c[1]]
  const den = r[0] * s[1] - r[1] * s[0]
  if (Math.abs(den) < 1e-9) return null
  const t = ((c[0] - a[0]) * s[1] - (c[1] - a[1]) * s[0]) / den
  const u = ((c[0] - a[0]) * r[1] - (c[1] - a[1]) * r[0]) / den
  if (t < 0 || t > 1 || u < 0 || u > 1) return null
  return [a[0] + t * r[0], a[1] + t * r[1]]
}

export function pointItems(slide) {
  if (SKIP.has(slide.id)) return []
  const it = slide.items
  const strokes = it.filter((x) => x.k === 's')
  const vs = strokes.filter((s) => !s.d && s.p.length === 2 && Math.abs(s.p[0][0] - s.p[1][0]) < 9 && Math.abs(s.p[0][1] - s.p[1][1]) > 90)
  const hs = strokes.filter((s) => !s.d && s.p.length === 2 && Math.abs(s.p[0][1] - s.p[1][1]) < 9 && Math.abs(s.p[0][0] - s.p[1][0]) > 90)
  let axis = null
  vs.forEach((v) => {
    const bottom = v.p[0][1] > v.p[1][1] ? v.p[0] : v.p[1]
    hs.forEach((h) => {
      const left = h.p[0][0] < h.p[1][0] ? h.p[0] : h.p[1]
      if (!axis && dist(bottom, left) < 22) axis = { x: v.p[0][0], y: h.p[0][1], v, h }
    })
  })
  if (!axis) return []
  const curves = strokes.filter((s) => s !== axis.v && s !== axis.h && !s.d && !s.a && !s.ah && s.w >= 1.2 && polyLen(s.p) > 120)
  if (!curves.length) return []

  // where two curves cross, nearest the middle of the plot
  const cx = (axis.x + Math.max(...axis.h.p.map((q) => q[0]))) / 2
  let hit = null
  for (let i = 0; i < curves.length; i++) {
    for (let j = i + 1; j < curves.length; j++) {
      for (let a = 1; a < curves[i].p.length; a++) {
        for (let b = 1; b < curves[j].p.length; b++) {
          const q = segHit(curves[i].p[a - 1], curves[i].p[a], curves[j].p[b - 1], curves[j].p[b])
          if (q && q[0] > axis.x + 70 && q[1] < axis.y - 70 && (!hit || Math.abs(q[0] - cx) < Math.abs(hit[0] - cx))) hit = q
        }
      }
    }
  }
  let pt = hit
  if (!pt) {
    const main = [...curves].sort((a, b) => polyLen(b.p) - polyLen(a.p))[0]
    const ys = main.p.map((q) => q[1])
    const lowest = main.p[ys.indexOf(Math.max(...ys))]
    const ends = Math.max(main.p[0][1], main.p[main.p.length - 1][1])
    pt = lowest[1] > ends + 25 ? lowest : pointAt(main.p, 0.5)
  }
  if (!pt) return []

  const titles = it.filter((x) => x.k === 't').map((t) => ({ t, s: plain(t) }))
  // The axis title is the longest text near the end of the axis (curve names are short)
  const titleNear = (at) =>
    titles
      .filter((x) => dist([x.t.x + x.t.w / 2, x.t.y + x.t.h / 2], at) < 210)
      .sort((p, q) => q.s.length - p.s.length)[0]?.s || ''
  const yTitle = titleNear([axis.x, Math.min(...axis.v.p.map((q) => q[1]))])
  const xTitle = titleNear([Math.max(...axis.h.p.map((q) => q[0])), axis.y])
  const yl = pick(Y_WORDS, yTitle, 'P') + '1'
  const xl = pick(X_WORDS, xTitle, 'Q') + '1'

  const label = (cx2, cy2, s) => ({
    k: 't', x: cx2 - 56.4, y: cy2 - 18.2, w: 112.8, h: 36.4, anc: 't', ins: [9, 4.5, 9],
    para: [{ al: 'ctr', r: [{ t: s.slice(0, -1), b: true }, { t: s.slice(-1), b: true, sub: true }] }],
    pw: { bw: 40, bh: 27 }, br: [[]],
  })
  const guide = (p) => ({ k: 's', p, c: 'ink', w: 1.3, d: [9, 6] })
  // A y label that would land on a text already there (the axis title) goes inside the plot instead
  const crowded = (x, y) => titles.some(({ t }) => Math.abs(t.x + t.w / 2 - x) < 70 && Math.abs(t.y + t.h / 2 - y) < 34)
  const yx = crowded(axis.x - 40, pt[1]) ? axis.x + 34 : axis.x - 40
  const yy = yx > axis.x ? pt[1] - 22 : pt[1]
  const out = [
    guide([[pt[0], pt[1]], [axis.x, pt[1]]]),
    guide([[pt[0], pt[1]], [pt[0], axis.y]]),
    { k: 'd', x: +pt[0].toFixed(1), y: +pt[1].toFixed(1), r: 6, c: 'ink' },
    label(yx, yy, yl),
    label(pt[0], axis.y + 28, xl),
  ]
  // The labels use the digit as a subscript, as the teacher's P1 and Q1 do; keep plain text too.
  return out.map((o) => (o.k === 't' ? { ...o, para: [{ al: 'ctr', r: [{ t: o.para[0].r[0].t + o.para[0].r[1].t, b: true }] }] } : o))
}

function polyLen(p) {
  let n = 0
  for (let i = 1; i < p.length; i++) n += dist(p[i - 1], p[i])
  return n
}
function pointAt(p, f) {
  let want = polyLen(p) * f
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
