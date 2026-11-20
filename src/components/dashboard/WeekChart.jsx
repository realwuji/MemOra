import { useId, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

/*
  Minutes studied per week, the last eight weeks, as one quiet bar chart.

  Built to the house chart rules: a single series in a single hue (the
  accent), so no legend; thin bars with 4px rounded tops anchored on the
  baseline and a 2px gap between them; a recessive dotted grid; text in
  text tokens, never the series colour; one selective direct label on the
  current week; and a hover tooltip on every bar because an HTML chart is
  interactive by default. The goal line is the student's own session
  length × 5 - a working week of their chosen sessions - so the target
  moves with the setting rather than being a number we picked for them.

  Motion: bars grow from the baseline in a stagger when the chart scrolls
  into view, a trend line draws across the bar tops, the current bar glows,
  and any week that hit the goal gets a star. All of it is transform and
  opacity (framer honours reduced motion app-wide) and token colours only.

  Weeks run Monday to Sunday. The current week is drawn in the strong
  accent and everything earlier in a softer step of the same hue, which
  is the sequential rule: one hue, lightness carrying "now versus then".
*/

const DAY = 86400000

const mondayOf = (ts) => {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  const dow = (d.getDay() + 6) % 7 // Monday = 0
  d.setDate(d.getDate() - dow)
  return d.getTime()
}

export default function WeekChart({ sessions, now, weeks = 8, goalMinutes = 125 }) {
  const id = useId()
  const [hover, setHover] = useState(null)

  const data = useMemo(() => {
    const thisMonday = mondayOf(now)
    return Array.from({ length: weeks }, (_, i) => {
      const start = thisMonday - (weeks - 1 - i) * 7 * DAY
      const end = start + 7 * DAY
      const minutes = sessions
        .filter((s) => s.ts >= start && s.ts < end)
        .reduce((sum, s) => sum + (s.minutes || 0), 0)
      return { start, minutes, current: i === weeks - 1 }
    })
  }, [sessions, now, weeks])

  const max = Math.max(goalMinutes * 1.15, ...data.map((d) => d.minutes), 30)
  const W = 320
  const H = 132
  const padL = 30
  const padB = 22
  const padT = 10
  const plotH = H - padB - padT
  const plotW = W - padL - 6
  const slot = plotW / weeks
  const barW = Math.min(26, slot - 6)
  const y = (v) => padT + plotH - (v / max) * plotH
  const label = (d) => new Date(d.start).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
  const total = data.reduce((s, d) => s + d.minutes, 0)
  const best = Math.max(...data.map((d) => d.minutes))
  const current = data[data.length - 1]
  // Smooth curve (Catmull-Rom to Bezier) through the bar tops.
  const pts = data.map((d, i) => [padL + i * slot + slot / 2, y(d.minutes)])
  const trend = pts.reduce((acc, p, i) => {
    if (i === 0) return `M ${p[0]} ${p[1]}`
    const p0 = pts[i - 2] || pts[i - 1]
    const p1 = pts[i - 1]
    const p3 = pts[i + 1] || p
    const c1 = [p1[0] + (p[0] - p0[0]) / 6, p1[1] + (p[1] - p0[1]) / 6]
    const c2 = [p[0] - (p3[0] - p1[0]) / 6, p[1] - (p3[1] - p1[1]) / 6]
    return `${acc} C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p[0]} ${p[1]}`
  }, '')
  const gridSteps = [0.5, 1].map((f) => Math.round(goalMinutes * f))

  return (
    <div>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-labelledby={`${id}-t`}>
          <title id={`${id}-t`}>
            Minutes studied per week for the last {weeks} weeks; this week {current.minutes} minutes, goal {goalMinutes}.
          </title>
          <defs>
            <linearGradient id={`${id}-cur`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--brand-strong)" />
              <stop offset="100%" stopColor="var(--brand)" />
            </linearGradient>
            <linearGradient id={`${id}-old`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="color-mix(in srgb, var(--brand) 55%, var(--surface))" />
              <stop offset="100%" stopColor="color-mix(in srgb, var(--brand) 25%, var(--surface))" />
            </linearGradient>
          </defs>
          {/* grid */}
          {gridSteps.map((v) => (
            <g key={v}>
              <line
                x1={padL}
                x2={W - 6}
                y1={y(v)}
                y2={y(v)}
                stroke="var(--line)"
                strokeWidth="1"
                strokeDasharray={v === goalMinutes ? '4 3' : '1.5 4'}
              />
              <text x={padL - 6} y={y(v) + 3.5} textAnchor="end" fontSize="9" fontWeight="600" fill="var(--muted)">
                {v}
              </text>
            </g>
          ))}
          <text x={padL + 3} y={y(goalMinutes) - 4} textAnchor="start" fontSize="8.5" fontWeight="700" fill="var(--muted)">
            weekly goal
          </text>
          {/* baseline */}
          <line x1={padL} x2={W - 6} y1={y(0)} y2={y(0)} stroke="var(--line)" strokeWidth="1.2" />
          {/* trend line across the bar tops */}
          {data.filter((d) => d.minutes > 0).length > 1 && (
            <motion.path
              d={trend}
              fill="none"
              stroke="var(--brand-strong)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="0.1 3.2"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.8 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.5, ease: 'easeInOut' }}
              aria-hidden="true"
            />
          )}
          {/* hover guide */}
          {hover !== null && (
            <line x1={padL + hover * slot + slot / 2} x2={padL + hover * slot + slot / 2} y1={padT} y2={y(0)} stroke="var(--brand)" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="2 3" />
          )}
          {/* bars */}
          {data.map((d, i) => {
            const x = padL + i * slot + (slot - barW) / 2
            const h = Math.max(d.minutes > 0 ? 3 : 0, y(0) - y(d.minutes))
            const fill = d.current ? `url(#${id}-cur)` : `url(#${id}-old)`
            return (
              <g
                key={d.start}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                tabIndex={0}
                role="graphics-symbol"
                aria-label={`Week of ${label(d)}: ${d.minutes} minutes`}
                className="week-bar"
              >
                {/* hit target bigger than the bar */}
                <rect x={padL + i * slot} y={padT} width={slot} height={plotH} fill="transparent" />
                {h > 0 ? (
                  <motion.path
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.7, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformBox: 'fill-box', transformOrigin: 'bottom', filter: d.current ? 'drop-shadow(0 0 6px var(--brand))' : undefined }}
                    d={`M ${x} ${y(0)} V ${y(0) - h + 4} Q ${x} ${y(0) - h} ${x + 4} ${y(0) - h} H ${x + barW - 4} Q ${x + barW} ${y(0) - h} ${x + barW} ${y(0) - h + 4} V ${y(0)} Z`}
                    fill={fill}
                    opacity={hover === null || hover === i ? 1 : 0.55}
                  />
                ) : (
                  <rect x={x} y={y(0) - 2} width={barW} height={2} rx={1} fill="var(--line)" />
                )}
                {d.minutes >= goalMinutes && (
                  <motion.text
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + i * 0.07, type: 'spring', stiffness: 300, damping: 14 }}
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    x={x + barW / 2}
                    y={y(d.minutes) - (d.current ? 16 : 5)}
                    textAnchor="middle"
                    fontSize="10"
                    fill="var(--paper)"
                  >
                    ★
                  </motion.text>
                )}
                {d.current && d.minutes > 0 && (
                  <text
                    x={x + barW / 2}
                    y={y(d.minutes) - 5}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="800"
                    fill="var(--fg)"
                  >
                    {d.minutes}
                  </text>
                )}
                <text
                  x={x + barW / 2}
                  y={H - 7}
                  textAnchor="middle"
                  fontSize="8.5"
                  fontWeight={d.current ? '800' : '600'}
                  fill={d.current ? 'var(--fg)' : 'var(--muted)'}
                >
                  {d.current ? 'now' : label(d).split(' ')[0] + ' ' + label(d).split(' ')[1].slice(0, 3)}
                </text>
              </g>
            )
          })}
        </svg>
        {hover !== null && (
          <div
            className="pointer-events-none absolute -top-1 rounded-lg border border-line bg-surface px-2.5 py-1.5 text-xs shadow-lg"
            style={{
              left: `${((padL + hover * slot + slot / 2) / W) * 100}%`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <span className="block font-bold tabular-nums text-fg">{data[hover].minutes} min</span>
            <span className="block text-[0.68rem] text-muted">week of {label(data[hover])}</span>
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-muted">
        <span className="font-bold tabular-nums text-fg">{total >= 60 ? `${(total / 60).toFixed(1)}h` : `${total}m`}</span>{' '}
        over {weeks} weeks
        {best > 0 && (
          <>
            {' · best '}
            <span className="font-bold tabular-nums text-fg">{best}m</span>
          </>
        )}
        {' · goal '}
        <span className="font-bold tabular-nums text-fg">{goalMinutes}m</span>/week
      </p>
    </div>
  )
}
