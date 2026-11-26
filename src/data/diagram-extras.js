/*
  Slides drawn in the bank's own format for the note diagrams that were not in the
  teacher's PowerPoint (limit pricing, the J-curve, the consumption function, the
  long-run Phillips curve, the LRAC envelope, efficiency, terms of trade, the
  poverty trap, bond prices and yields).

  They are plain black ink plus letters, exactly like the converted slides, so the
  engine colours them by what each curve IS (AR blue, MC red, AC green, MR purple),
  draws them with the pen, shifts SRPC1 to SRPC2, and gives them the scrubber and
  hover. Nothing here is special-cased: same frame, same fonts, same colours.

  Ids start at 301 so they never collide with the 214 converted slides.
*/

const OX = 284
const OY = 508.5
const TOPY = 92.8
const RX = 826
const W = RX - OX
const H = OY - TOPY
const X = (u) => OX + u * W
const Y = (v) => OY - v * H

const ink = (p, w = 3.8, extra = {}) => ({ k: 's', p, c: 'ink', w, ...extra })
const guide = (p) => ink(p, 1.3, { d: [9, 6] })
const arrow = (a, b, c = 'ink') => ({ k: 's', p: [a, b], c, w: 2.8, a: 1 })
const dot = (x, y, c = 'ink', r = 6) => ({ k: 'd', x, y, r, c })
const fill = (p, c, o = 0.3) => ({ k: 'f', p, c, o, w: 0 })

// 'Q_p' is Q with a subscript p
function runs(s, c, b = true) {
  const out = []
  String(s)
    .split(/(_[A-Za-z0-9]+)/)
    .forEach((part) => {
      if (!part) return
      const sub = part.startsWith('_')
      const r = { t: sub ? part.slice(1) : part, b }
      if (sub) r.sub = true
      if (c) r.c = c
      out.push(r)
    })
  return out
}
const text = (cx, cy, s, c) => {
  const plain = String(s).replace(/_/g, '')
  const bw = Math.round(plain.length * 13 + 12)
  return {
    k: 't',
    x: cx - 56.4,
    y: cy - 18.2,
    w: 112.8,
    h: 36.4,
    anc: 't',
    ins: [9, 4.5, 9],
    para: [{ al: 'ctr', r: runs(s, c) }],
    pw: { bw, bh: 27 },
    br: [[]],
  }
}

const curve = (f, u0, u1, n = 56, clip = true) => {
  const pts = []
  for (let i = 0; i < n; i++) {
    const u = u0 + ((u1 - u0) * i) / (n - 1)
    const v = f(u)
    if (clip && (v < 0.005 || v > 0.985)) continue
    pts.push([+X(u).toFixed(1), +Y(v).toFixed(1)])
  }
  return pts
}
const through = (pts, n = 14) => {
  // Catmull-Rom through points given as [u, v]
  const out = []
  const P = [pts[0], ...pts, pts[pts.length - 1]]
  for (let i = 1; i < P.length - 2; i++) {
    for (let k = 0; k < n; k++) {
      const t = k / n
      const t2 = t * t
      const t3 = t2 * t
      const pt = [0, 1].map(
        (d) => 0.5 * (2 * P[i][d] + (-P[i - 1][d] + P[i + 1][d]) * t + (2 * P[i - 1][d] - 5 * P[i][d] + 4 * P[i + 1][d] - P[i + 2][d]) * t2 + (-P[i - 1][d] + 3 * P[i][d] - 3 * P[i + 1][d] + P[i + 2][d]) * t3),
      )
      out.push([+X(pt[0]).toFixed(1), +Y(pt[1]).toFixed(1)])
    }
  }
  out.push([+X(pts[pts.length - 1][0]).toFixed(1), +Y(pts[pts.length - 1][1]).toFixed(1)])
  return out
}
const bisect = (f, a, b) => {
  let lo = a
  let hi = b
  for (let i = 0; i < 60; i++) {
    const m = (lo + hi) / 2
    if (f(lo) * f(m) <= 0) hi = m
    else lo = m
  }
  return (lo + hi) / 2
}

const axes = (yLabel, xLabel, extra = []) => [
  ink([[OX, TOPY], [OX, OY]]),
  ink([[OX, OY], [RX, OY]]),
  text(OX + 6, 68, yLabel),
  text(RX - 40, OY + 32, xLabel),
  ...extra,
]

const BOX = [150, 40, 880, 575]
const slide = (id, title, items, box = BOX) => ({ id, title, section: 'NOTE DIAGRAMS', box, items })

/* 301 ------------------------------------------------------ limit pricing */
function limitPricing() {
  const ar = (u) => 0.96 - 0.95 * u
  const mr = (u) => 0.96 - 1.9 * u
  const ac = (u) => 0.32 + 1.76 * (u - 0.45) ** 2
  const mc = (u) => ac(u) + u * 3.52 * (u - 0.45)
  const qm = bisect((u) => mr(u) - mc(u), 0.15, 0.45)
  const qc = bisect((u) => ar(u) - ac(u), 0.5, 0.9)
  const pm = ar(qm)
  const pc = ar(qc)
  const cm = ac(qm)
  const mcEnd = bisect((u) => mc(u) - 0.95, 0.5, 1.2)
  const s301 = slide(301, 'Limit pricing', [
    ...axes('Costs and Revenue', 'Output'),
    ink(curve(ar, 0.03, 0.95)),
    text(X(0.95) + 22, Y(ar(0.95)) + 4, 'AR'),
    ink(curve(mr, 0.03, 0.48)),
    text(X(0.48) + 30, Y(mr(0.48)) - 22, 'MR'),
    ink(curve(mc, 0.1, mcEnd)),
    text(X(mcEnd) + 26, Y(mc(mcEnd)) - 4, 'MC'),
    ink(curve(ac, 0.08, 0.94)),
    text(X(0.94) + 24, Y(ac(0.94)) - 4, 'AC'),
    guide([[X(qm), Y(pm)], [OX, Y(pm)]]),
    guide([[X(qm), Y(pm)], [X(qm), OY]]),
    guide([[X(qc), Y(pc)], [OX, Y(pc)]]),
    guide([[X(qc), Y(pc)], [X(qc), OY]]),
    text(OX - 36, Y(pm), 'Pm'),
    text(OX - 36, Y(pc), 'Pc'),
    text(X(qm), OY + 28, 'Qm'),
    text(X(qc), OY + 28, 'Qc'),
    dot(X(qm), Y(pm)),
    text(X(qm) + 14, Y(pm) - 18, 'a'),
    dot(X(qc), Y(pc)),
    text(X(qc) + 16, Y(pc) - 18, 'c'),
    arrow([OX + 30, Y(pm) + 10], [OX + 30, Y(pc) - 10], 'amber'),
  ])
  s301.areas = [{ poly: [[OX, Y(pm)], [X(qm), Y(pm)], [X(qm), Y(cm)], [OX, Y(cm)]].map(([x, y]) => [+x.toFixed(1), +y.toFixed(1)]), name: 'Supernormal profit at Pm', note: 'Price is above average cost at Qm, so the monopolist earns (Pm minus AC) x Qm. This is what invites entry.' }]
  return s301
}

/* 302 ----------------------------------------------------------- J-curve */
function jCurve() {
  const z = 0.55
  const pts = through([[0.06, z], [0.16, 0.34], [0.3, 0.2], [0.46, 0.32], [0.64, 0.6], [0.94, 0.88]])
  const zy = +Y(z).toFixed(1)
  let low = pts[0]
  pts.forEach((p) => {
    if (p[1] > low[1]) low = p
  })
  const cross = pts.findIndex((p, k) => k > pts.indexOf(low) && p[1] <= zy)
  const dip = pts.slice(0, cross).map(([x, y]) => [x, Math.max(y, zy)])
  const gain = [[pts[cross][0], zy], ...pts.slice(cross)]
  const xc = pts[cross][0]
  const s302 = slide(302, 'The J-curve', [
    fill([...dip, [dip[dip.length - 1][0], zy]], 'red', 0.3),
    fill([...gain, [gain[gain.length - 1][0], zy]], 'green', 0.3),
    ...axes('Current account balance', 'Time'),
    guide([[OX, zy], [X(0.95), zy]]),
    text(OX - 36, zy, '0'),
    guide([[X(0.06), TOPY + 20], [X(0.06), OY]]),
    text(X(0.06) + 70, TOPY + 22, 'Depreciation'),
    text(X(0.06), OY + 28, 'T₀'),
    ink(pts, 3.8, { c: 'blue' }),
    text(X(0.94) + 62, Y(0.88) - 6, 'J-curve', 'blue'),
    guide([[low[0], low[1]], [OX, low[1]]]),
    guide([[low[0], low[1]], [low[0], OY]]),
    dot(low[0], low[1]),
    text(OX - 36, low[1], 'B₁'),
    text(low[0], OY + 28, 'T₁'),
    text(low[0] + 18, low[1] + 22, 'a'),
    guide([[xc, zy], [xc, OY]]),
    dot(xc, zy),
    text(xc, OY + 28, 'T₂'),
    text(xc + 16, zy - 20, 'b'),
  ])
  s302.areas = [
    { fill: 0, name: 'Deficit worse than before', note: 'The import bill rises before export volumes respond (demand is inelastic in the short run), so the balance falls below its starting level until T₂.' },
    { fill: 1, name: 'Improvement over time', note: 'Once demand becomes elastic (the Marshall-Lerner condition holds) export volumes rise and import volumes fall, so the balance rises above its starting level.' },
  ]
  return s302
}

/* 303 ------------------------------------------------ consumption function */
function consumption() {
  const a = 0.22
  const b = 0.58 / 0.95
  const be = a / (1 - b)
  const s303 = slide(303, 'The consumption function', [
    fill([[OX, Y(0)], [OX, Y(a)], [X(be), Y(be)]], 'red', 0.3),
    fill([[X(be), Y(be)], [X(0.95), Y(a + b * 0.95)], [X(0.95), Y(0.95)]], 'green', 0.3),
    ...axes('Consumption (C)', 'Disposable income (Y)'),
    ink([[X(0), Y(0)], [X(0.95), Y(0.95)]], 2.4),
    text(X(0.95) + 22, Y(0.95) - 6, '45°'),
    ink([[X(0), Y(a)], [X(0.95), Y(a + b * 0.95)]], 3.8, { c: 'blue' }),
    text(X(0.95) + 22, Y(a + b * 0.95) + 4, 'C', 'blue'),
    guide([[X(be), Y(be)], [X(be), OY]]),
    guide([[X(be), Y(be)], [OX, Y(be)]]),
    text(OX - 36, Y(be), 'C₀'),
    text(X(be), OY + 28, 'Y₀'),
    dot(X(be), Y(be)),
    text(X(be) + 70, Y(be) + 34, 'break-even'),
    text(OX - 28, Y(a), 'a'),
    text(X(0.36), Y(0.12), 'dissaving', 'red'),
    text(X(0.8), Y(0.86) - 30, 'saving', 'green'),
  ])
  s303.areas = [
    { fill: 0, name: 'Dissaving', note: 'Left of break-even, C is above income, so households spend more than they earn and borrow or run down savings.' },
    { fill: 1, name: 'Saving', note: 'Right of break-even, C is below income, and the gap is saved. The saving ratio rises as income grows.' },
  ]
  return s303
}

/* 304 ---------------------------------------------- long-run Phillips curve */
function longRunPhillips() {
  const nairu = 0.55
  const at = (u, s) => s + 0.1 / (u + 0.05) - 0.06
  const lo = (s) => (u) => at(u, s)
  return slide(304, 'The long-run Phillips curve', [
    ...axes('Inflation (π)', 'Unemployment (U)'),
    ink(curve(lo(0.18), 0.12, 0.95), 3.8),
    text(X(0.95) + 8, Y(at(0.95, 0.18)) + 26, 'SRPC_1'),
    ink(curve(lo(0.44), 0.12, 0.95), 3.8),
    text(X(0.95) + 8, Y(at(0.95, 0.44)) + 26, 'SRPC_2'),
    ink([[X(nairu), OY], [X(nairu), TOPY + 20]], 3.8),
    text(X(nairu), TOPY + 4, 'LRPC'),
    text(X(nairu), OY + 28, 'NAIRU'),
    guide([[X(nairu), Y(at(nairu, 0.18))], [OX, Y(at(nairu, 0.18))]]),
    text(OX - 36, Y(at(nairu, 0.18)), 'π₁'),
    guide([[X(0.32), Y(at(0.32, 0.18))], [OX, Y(at(0.32, 0.18))]]),
    guide([[X(0.32), Y(at(0.32, 0.18))], [X(0.32), OY]]),
    text(OX - 36, Y(at(0.32, 0.18)), 'π₂'),
    text(X(0.32), OY + 28, 'U₂'),
    guide([[X(nairu), Y(at(nairu, 0.44))], [OX, Y(at(nairu, 0.44))]]),
    text(OX - 36, Y(at(nairu, 0.44)), 'π₃'),
    dot(X(nairu), Y(at(nairu, 0.18))),
    text(X(nairu) + 18, Y(at(nairu, 0.18)) + 24, 'A'),
    dot(X(0.32), Y(at(0.32, 0.18))),
    text(X(0.32) - 18, Y(at(0.32, 0.18)) - 18, 'B'),
    dot(X(nairu), Y(at(nairu, 0.44))),
    text(X(nairu) + 18, Y(at(nairu, 0.44)) - 18, 'C'),
  ])
}

/* 305 -------------------------------------------------------- LRAC envelope */
function lracEnvelope() {
  const lrac = (q) => 2 + 0.03 * (q - 10) ** 2
  const srac = (q0) => (q) => lrac(q0) + 2 * 0.03 * (q0 - 10) * (q - q0) + 0.12 * (q - q0) ** 2
  const uq = (q) => 0.04 + ((q - 2) / 16) * 0.92
  const vq = (val) => 0.06 + (val / 9) * 0.9
  const plot = (f, a, b) => curve((u) => vq(f(2 + ((u - 0.04) / 0.92) * 16)), uq(a), uq(b), 60, false)
  const items = [...axes('Average cost', 'Output')]
  const marks = {}
  ;[5, 10, 15].forEach((q0, i) => {
    items.push(ink(plot(srac(q0), q0 - 4.5, q0 + 4.5)))
    marks[`s${i}`] = items.length - 1
    const ql = i === 0 ? q0 + 4.5 : q0 + 4.5
    items.push(text(X(uq(ql)) + (i === 0 ? 16 : 0), Y(vq(srac(q0)(ql))) - 26, `SRAC${['₁', '₂', '₃'][i]}`))
    marks[`t${i}`] = items.length - 1
  })
  items.push(ink(plot(lrac, 2, 18), 4.4))
  marks.l = items.length - 1
  items.push(text(X(uq(3.4)) + 10, Y(vq(lrac(3.4))) + 40, 'LRAC'))
  marks.lt = items.length - 1
  ;[5, 10, 15].forEach((q0) => items.push(dot(X(uq(q0)), Y(vq(lrac(q0))))))
  items.push(guide([[X(uq(10)), Y(vq(lrac(10)))], [X(uq(10)), OY]]))
  items.push(guide([[X(uq(10)), Y(vq(lrac(10)))], [OX, Y(vq(lrac(10)))]]))
  items.push(text(OX - 40, Y(vq(lrac(10))), 'AC*'))
  items.push(text(X(uq(10)), OY + 28, 'MES'))
  const s = slide(305, 'Short-run cost curves and the long-run envelope', items)
  s.fixes = {
    recolour: {
      [marks.s0]: 'blue', [marks.t0]: 'blue',
      [marks.s1]: 'cyan', [marks.t1]: 'cyan',
      [marks.s2]: 'purple', [marks.t2]: 'purple',
      [marks.l]: 'amber', [marks.lt]: 'amber',
    },
  }
  return s
}

/* 306 ----------------------------------------------------------- efficiency */
function efficiency() {
  const c = 0.5
  const ac = (q) => 0.36 + 0.7 * (q - c) ** 2
  const mc = (q) => ac(q) + q * 1.4 * (q - c)
  const d = (q) => 0.94 - 0.6 * q
  const ax = (q) => 0.04 + q * 0.9
  const ay = (v) => 0.06 + v * 0.9
  const f = (fn) => (u) => ay(fn((u - 0.04) / 0.9))
  let qa = 0.3
  for (let i = 0; i < 60; i += 1) qa += (d(qa) - mc(qa)) * 0.3
  const items = [
    ...axes('Price / cost', 'Output'),
    ink(curve(f(ac), ax(0.14), ax(0.92))),
    text(X(ax(0.92)) + 22, Y(ay(ac(0.92))) - 10, 'AC'),
    ink(curve(f(mc), ax(0.2), ax(0.82))),
    text(X(ax(0.82)) + 26, Y(ay(mc(0.82))) - 6, 'MC'),
    ink(curve(f(d), ax(0.04), ax(0.96))),
    text(X(ax(0.96)) + 6, Y(ay(d(0.96))) + 28, 'D = AR'),
    ink(curve(f((q) => ac(q) + 0.14), ax(0.26), ax(0.84)), 3.2, { c: 'purple' }),
    text(X(0.86), Y(0.12), 'AC (X-inefficient)', 'purple'),
    guide([[X(ax(c)), Y(ay(ac(c)))], [X(ax(c)), OY]]),
    guide([[X(ax(c)), Y(ay(ac(c)))], [OX, Y(ay(ac(c)))]]),
    guide([[X(ax(qa)), Y(ay(d(qa)))], [X(ax(qa)), OY]]),
    guide([[X(ax(qa)), Y(ay(d(qa)))], [OX, Y(ay(d(qa)))]]),
    text(X(ax(c)), OY + 28, 'Q_p'),
    text(X(ax(qa)), OY + 28, 'Q_a'),
    text(OX - 36, Y(ay(ac(c))), 'P_p'),
    text(OX - 36, Y(ay(d(qa))), 'P_a'),
    dot(X(ax(c)), Y(ay(ac(c)))),
    dot(X(ax(qa)), Y(ay(d(qa)))),
  ]
  const upper = curve(f((q) => ac(q) + 0.14), ax(0.26), ax(0.84))
  const lower = curve(f(ac), ax(0.26), ax(0.84))
  const s306 = slide(306, 'Productive and allocative efficiency', items)
  s306.areas = [{ poly: [...upper, ...[...lower].reverse()], name: 'X-inefficiency', note: 'The gap between the dashed AC and the lowest AC the firm could reach. Organisational slack a firm shielded from competition can afford.' }]
  return s306
}

/* 307 --------------------------------------------------------- terms of trade */
function termsOfTrade() {
  const exportIdx = [100, 108, 118, 120, 118]
  const importIdx = [100, 104, 106, 116, 130]
  const ux = (i) => 0.08 + i * 0.15
  const vy = (v) => ((v - 90) / 50) * 0.92 + 0.04
  const line = (arr) => arr.map((v, i) => [+X(ux(i)).toFixed(1), +Y(vy(v)).toFixed(1)])
  const tot = exportIdx.map((e, i) => Math.round((e / importIdx[i]) * 100))
  const items = [
    ...axes('Index (Y1 = 100)', 'Year'),
    guide([[X(0.06), Y(vy(100))], [X(0.9), Y(vy(100))]]),
    ink(line(exportIdx), 3.8, { c: 'blue' }),
    text(X(ux(4)) + 100, Y(vy(exportIdx[4])) + 12, 'Export prices', 'blue'),
    ink(line(importIdx), 3.8, { c: 'red' }),
    text(X(ux(4)) + 100, Y(vy(importIdx[4])) - 8, 'Import prices', 'red'),
  ]
  exportIdx.forEach((_, i) => {
    items.push(text(X(ux(i)), OY + 28, `Y${i + 1}`))
    items.push(text(X(ux(i)), OY + 66, `${tot[i]}`, tot[i] >= 100 ? 'green' : 'red'))
  })
  items.push(guide([[X(ux(2)), Y(vy(118))], [OX, Y(vy(118))]]))
  items.push(guide([[X(ux(2)), Y(vy(118))], [X(ux(2)), OY]]))
  items.push(dot(X(ux(2)), Y(vy(118))))
  items.push(text(OX - 40, Y(vy(118)), '118'))
  items.push(guide([[X(ux(4)), Y(vy(130))], [OX, Y(vy(130))]]))
  items.push(dot(X(ux(4)), Y(vy(130))))
  items.push(text(OX - 40, Y(vy(130)), '130'))
  items.push(text(OX - 40, OY + 66, 'ToT'))
  items.push(text(OX - 40, Y(vy(100)), '100'))
  return slide(307, 'The terms of trade as an index', items, [150, 40, 960, 620])
}

/* 308 ------------------------------------------------------- poverty trap */
function povertyTrap() {
  const box = (cx, cy, label, c) => {
    const w = 230
    const h = 56
    const p = [[cx - w / 2, cy - h / 2], [cx + w / 2, cy - h / 2], [cx + w / 2, cy + h / 2], [cx - w / 2, cy + h / 2]]
    return [fill(p, c, 0.22), ink([...p, p[0]], 2.4, { c }), text(cx, cy, label)]
  }
  const cx = 555
  return slide(
    308,
    'The poverty trap',
    [
      ...box(cx, 130, 'Low income', 'blue'),
      ...box(cx + 250, 300, 'Low saving', 'red'),
      ...box(cx, 470, 'Low investment', 'blue'),
      ...box(cx - 250, 300, 'Low productivity', 'red'),
      arrow([cx + 110, 152], [cx + 230, 266], 'blue'),
      arrow([cx + 230, 334], [cx + 110, 446], 'blue'),
      arrow([cx - 110, 446], [cx - 230, 334], 'blue'),
      arrow([cx - 230, 266], [cx - 110, 152], 'blue'),
      text(cx, 300, 'vicious circle', 'ink'),
      text(cx, 560, 'broken by an injection: aid, FDI, debt relief', 'green'),
    ],
    [150, 60, 960, 600],
  )
}

/* 309 ------------------------------------------------------ bond price/yield */
function bondPriceYield() {
  const pu = (p) => (p - 50) / 120
  const yv = (y) => y / 9
  const yld = (p) => 500 / p
  const items = [
    ...axes('Yield (%)', 'Bond price (£)'),
    ink(curve((u) => yv(yld(50 + u * 120)), 0.08, 0.95), 3.8, { c: 'blue' }),
    text(X(0.95) + 30, Y(yv(yld(50 + 0.95 * 120))) - 28, 'yield = 5 ÷ price', 'blue'),
  ]
  ;[80, 100, 125].forEach((p) => {
    items.push(guide([[X(pu(p)), Y(yv(yld(p)))], [X(pu(p)), OY]]))
    items.push(guide([[X(pu(p)), Y(yv(yld(p)))], [OX, Y(yv(yld(p)))]]))
    items.push(dot(X(pu(p)), Y(yv(yld(p)))))
    items.push(text(X(pu(p)), OY + 28, `£${p}`))
    items.push(text(OX - 40, Y(yv(yld(p))), `${+yld(p).toFixed(2)}%`))
  })
  items.push(text(X(pu(125)) + 70, Y(yv(yld(125))) - 40, 'price up, yield down', 'green'))
  items.push(text(X(pu(80)) + 30, Y(yv(yld(80))) - 38, 'price down, yield up', 'red'))
  return slide(309, 'Bond prices and yields', items)
}

export const EXTRA_SLIDES = [limitPricing(), jCurve(), consumption(), longRunPhillips(), lracEnvelope(), efficiency(), termsOfTrade(), povertyTrap(), bondPriceYield()]

export const EXTRA_AREAS = Object.fromEntries(EXTRA_SLIDES.filter((s) => s.areas).map((s) => [s.id, s.areas]))

export const EXTRA_FIXES = Object.fromEntries(EXTRA_SLIDES.filter((s) => s.fixes).map((s) => [s.id, s.fixes]))

export const EXTRA_COPY = {
  301: {
    title: 'Limit pricing',
    caption: 'A monopolist facing potential entrants would earn supernormal profit at Pm (output Qm, where MR = MC). To keep rivals out it cuts price to the limit price Pc, where AR meets AC, so only normal profit is made at Qc and entering is not worth it. This is not predatory pricing, which goes below cost to drive out a rival already in the market.',
  },
  302: {
    title: 'The J-curve',
    caption: 'After a depreciation demand is price inelastic in the short run, so the import bill rises before export volumes respond and the current account balance worsens first. As demand becomes more elastic (Marshall-Lerner) the balance improves, tracing a J.',
  },
  303: {
    title: 'The consumption function',
    caption: 'Consumption rises with disposable income. Autonomous consumption (a) is spent even at zero income. Where C crosses the 45 degree line is break-even: to the left households dissave, to the right they save. The slope of C is the MPC.',
  },
  304: {
    title: 'The long-run Phillips curve and the NAIRU',
    caption: 'There is a trade-off in the short run only. Expanding demand moves the economy from A to B: lower unemployment, higher inflation. Once expectations adjust SRPC1 shifts up to SRPC2 and unemployment returns to the NAIRU at C with permanently higher inflation. The long-run curve is vertical.',
  },
  305: {
    title: 'Short-run cost curves and the long-run envelope',
    caption: 'Each SRAC is one plant size. In the long run the firm can choose any plant, so LRAC is the envelope: it touches each SRAC once and lies below it everywhere else. The lowest point of LRAC is the minimum efficient scale (MES).',
  },
  306: {
    title: 'Productive and allocative efficiency',
    caption: 'Productive efficiency is output at the lowest point of AC, where MC = AC. Allocative efficiency is output where price = MC. A firm sitting above its AC curve (the dashed curve) is X-inefficient. Dynamic efficiency is the whole AC curve shifting down over time.',
  },
  307: {
    title: 'The terms of trade as an index',
    caption: 'Terms of trade = (export price index ÷ import price index) × 100. A rise means each unit of exports buys more imports. A fall means the country must export more to afford the same imports. The ratio for each year is shown along the top.',
  },
  308: {
    title: 'The poverty trap',
    caption: 'Low income means little saving, so little investment, so low productivity, which keeps incomes low. An external injection (aid, FDI, debt relief, microfinance) can fill the Harrod-Domar savings gap and break the cycle.',
  },
  309: {
    title: 'Bond prices and yields',
    caption: 'A bond pays a fixed coupon (here £5), so yield = coupon ÷ price. Pay more for the same payment and the return is lower. This is why QE, which raises bond prices, lowers yields.',
  },
}
