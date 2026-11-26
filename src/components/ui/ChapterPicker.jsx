import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Icon from '@/components/ui/Icon'
import { subjectColor } from '@/constants/content'
import { fadeInUp } from '@/lib/motion'
import './chapter-picker.css'

/*
  The chapter list: the last screen before revising.

  Every chapter shows where you are with it in plain words (Not started, In
  progress, Completed) and as a ring that fills, and the whole subject is
  summarised at the top the same way. Chapters are grouped the way the
  specification groups them, each group carries its own progress, and the
  list can be narrowed to what is left to do. A card lights up under the
  pointer; clicking one starts the session straight away.

  The status is the chapter's evidence band (lib/attempts.js) in words a
  student uses: nothing yet is "Not started", seen or shaky is "In progress",
  solid or exam-ready is "Completed".
*/

const STATUS = {
  not_started: { id: 'todo', label: 'Not started', pct: 0 },
  seen: { id: 'doing', label: 'In progress', pct: 22 },
  shaky: { id: 'doing', label: 'In progress', pct: 55 },
  solid: { id: 'done', label: 'Completed', pct: 90 },
  'exam-ready': { id: 'done', label: 'Completed', pct: 100 },
}
const FILTERS = [
  ['all', 'All'],
  ['todo', 'Not started'],
  ['doing', 'In progress'],
  ['done', 'Completed'],
]

function Ring({ pct, status, size = 38, stroke = 4, children }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <span className={`cp-ring is-${status}`} style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} className="cp-ring-track" strokeWidth={stroke} />
        {pct > 0 && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="cp-ring-fill"
          strokeWidth={stroke}
          strokeDasharray={`${(c * pct) / 100} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        )}
      </svg>
      <span className="cp-ring-mid">{children}</span>
    </span>
  )
}

function Card({ topic, n, status, examReady, onPick, index, marks, rating }) {
  const reduce = useReducedMotion()
  const s = STATUS[status]
  // Maths past papers: questions marked right or wrong fill the ring, green while right
  // answers lead and red once wrong ones do
  const marked = marks ? marks.right + marks.wrong : 0
  const markPct = marks && marks.total ? Math.round((marked / marks.total) * 100) : 0
  const wrongLeads = marks ? marks.wrong > marks.right : false
  // The last confidence rating (1 to 5 stars) colours the card: red 1 or 2, amber 3, green 4 or 5
  const rated = !marked && rating ? (rating <= 2 ? 'bad' : rating === 3 ? 'ok' : 'good') : null
  const spot = (e) => {
    const b = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - b.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - b.top}px`)
  }
  return (
    <motion.button
      type="button"
      onClick={() => onPick(topic)}
      onPointerMove={spot}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.025, 0.6), ease: [0.22, 1, 0.36, 1] }}
      className={`cp-card is-${marked ? (wrongLeads ? 'wrong' : 'right') : s.id}${rated ? ` is-rated is-${rated}` : ''}`}
      aria-label={`${topic}. ${marked ? `${marked} of ${marks.total} questions marked, ${marks.right} right and ${marks.wrong} wrong` : s.label}.`}
    >
      <span className="cp-card-n">{String(n).padStart(2, '0')}</span>
      <span className="cp-card-body">
        <span className="cp-card-title">{topic}</span>
        <span className="cp-card-status">
          <i aria-hidden="true" />
          {marked ? `${marked} of ${marks.total} marked · ${marks.right} right, ${marks.wrong} wrong` : rated ? `Confidence ${rating}/5` : s.label}
          {examReady && (
            <em>
              <Icon name="star" filled className="h-3 w-3" />
              Exam-ready
            </em>
          )}
        </span>
      </span>
      <Ring pct={marked ? Math.max(4, markPct) : s.pct} status={marked ? (wrongLeads ? 'wrong' : 'right') : rated ? `rate-${rated}` : s.id}>
        {marked ? <span className="text-[0.68rem] font-bold tabular-nums">{markPct}%</span> : s.id === 'done' ? <Icon name="check" className="h-4 w-4" /> : null}
      </Ring>
      <span className="cp-card-go" aria-hidden="true">
        {s.id === 'todo' ? 'Start' : s.id === 'doing' ? 'Continue' : 'Revise again'}
        <Icon name="arrowRight" className="h-3.5 w-3.5" />
      </span>
    </motion.button>
  )
}

export default function ChapterPicker({ pack, technique, techniqueLabel, states, recs, topics, onPick, allKey = '__all__', marks, ratings }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const reduce = useReducedMotion()
  const color = subjectColor(pack.name)
  const allowed = useMemo(() => new Set(topics), [topics])
  const bandOf = (t) => states.get(`${pack.name}␟${t}`)?.band || 'not_started'
  const statusOf = (t) => STATUS[bandOf(t)].id

  // The spec's own order, so chapter numbers do not move when the list is filtered.
  const numbered = useMemo(() => {
    const order = pack.groups?.length ? pack.groups.flatMap((g) => g.subgroups.flatMap((s) => s.topics)) : pack.topics
    const map = new Map()
    order.filter((t) => allowed.has(t)).forEach((t, i) => map.set(t, i + 1))
    return map
  }, [pack, allowed])

  const counts = { todo: 0, doing: 0, done: 0 }
  topics.forEach((t) => {
    counts[statusOf(t)] += 1
  })
  const total = topics.length
  const donePct = total ? Math.round((counts.done / total) * 100) : 0
  const next = recs?.find((r) => allowed.has(r.topic))

  const q = query.trim().toLowerCase()
  const words = q.split(/\s+/).filter(Boolean)
  // Match the headings a chapter sits under as well as its own name, so
  // "Theme 3" or "How Markets Work" finds chapters too.
  const matches = (t, ...labels) => {
    if (!allowed.has(t)) return false
    if (filter !== 'all' && statusOf(t) !== filter) return false
    if (!words.length) return true
    const hay = [t, ...labels].filter(Boolean).join(' ').toLowerCase()
    return words.every((w) => hay.includes(w))
  }

  const groups = (
    pack.groups?.length
      ? pack.groups.map((g) => ({
          ...g,
          all: g.subgroups.flatMap((sg) => sg.topics).filter((t) => allowed.has(t)),
          subgroups: g.subgroups.map((sg) => ({ ...sg, topics: sg.topics.filter((t) => matches(t, sg.label, g.label)) })).filter((sg) => sg.topics.length),
        }))
      : [{ label: null, all: topics, subgroups: [{ label: null, topics: pack.topics.filter((t) => matches(t)) }] }]
  ).filter((g) => g.subgroups.length)
  const shown = groups.reduce((n, g) => n + g.subgroups.reduce((m, sg) => m + sg.topics.length, 0), 0)

  let cardIndex = 0

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="show" exit={{ opacity: 0 }} className="cp-root" style={{ '--subject': color }}>
      {/* ------------------------------------------------------------ hero */}
      <header className="cp-hero">
        <div className="cp-hero-text">
          <p className="cp-eyebrow">
            {pack.name} · {techniqueLabel}
          </p>
          <h1 className="cp-title">Pick a chapter</h1>
          <p className="cp-sub">
            {counts.done} of {total} completed · {counts.doing} in progress · {counts.todo} not started
          </p>
          <div className="cp-hero-actions">
            {next && (
              <button type="button" className="cp-primary" onClick={() => onPick(next.topic)}>
                <span>
                  <small>Next up</small>
                  {next.topic}
                </span>
                <Icon name="arrowRight" className="h-4 w-4" />
              </button>
            )}
            {!q && filter === 'all' && (
              <button type="button" className="cp-ghost" onClick={() => onPick(allKey)}>
                <Icon name="shuffle" className="h-4 w-4" />
                The whole of {pack.name}
                <small>{technique === 'notes' ? 'in order' : 'shuffled'}</small>
              </button>
            )}
          </div>
        </div>
        <div className="cp-hero-ring">
          <Ring pct={donePct} status="done" size={132} stroke={11}>
            <span className="cp-hero-num">
              {donePct}
              <small>%</small>
            </span>
            <span className="cp-hero-cap">completed</span>
          </Ring>
        </div>
      </header>

      {/* --------------------------------------------------------- filters */}
      <div className="cp-bar">
        <div className="cp-chips" role="group" aria-label="Show chapters">
          {FILTERS.map(([id, label]) => (
            <button key={id} type="button" aria-pressed={filter === id} onClick={() => setFilter(id)} className={`cp-chip ${filter === id ? 'is-on' : ''} ${id !== 'all' ? `is-${id}` : ''}`}>
              {id !== 'all' && <i aria-hidden="true" />}
              {label}
              <span>{id === 'all' ? total : counts[id]}</span>
            </button>
          ))}
        </div>
        <label className="cp-search">
          <span className="sr-only">Search chapters</span>
          <Icon name="search" className="h-4 w-4" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search chapters" autoComplete="off" />
        </label>
      </div>

      {/* ---------------------------------------------------------- groups */}
      {shown === 0 ? (
        <p className="cp-empty">{filter === 'done' ? 'Nothing completed yet. The first one is the hardest.' : filter === 'todo' ? 'Every chapter has been started. Nice.' : 'No chapter matches that.'}</p>
      ) : (
        <div className="cp-groups">
          {groups.map((group, gi) => {
            const done = group.all.filter((t) => statusOf(t) === 'done').length
            const doing = group.all.filter((t) => statusOf(t) === 'doing').length
            return (
              <section key={group.label || gi} className="cp-group">
                {group.label && (
                  <div className="cp-group-head">
                    <h2>{group.label}</h2>
                    <div className="cp-group-meter" aria-label={`${done} of ${group.all.length} completed`}>
                      <span className="cp-meter">
                        <motion.i
                          className="is-done"
                          initial={reduce ? false : { width: 0 }}
                          animate={{ width: `${group.all.length ? (done / group.all.length) * 100 : 0}%` }}
                          transition={{ duration: 0.9, delay: 0.2 + gi * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        />
                        <motion.i
                          className="is-doing"
                          initial={reduce ? false : { width: 0 }}
                          animate={{ width: `${group.all.length ? (doing / group.all.length) * 100 : 0}%` }}
                          transition={{ duration: 0.9, delay: 0.3 + gi * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </span>
                      <b>
                        {done}/{group.all.length}
                      </b>
                    </div>
                  </div>
                )}
                {group.subgroups.map((sub, si) => (
                  <div key={sub.label || si} className="cp-sub-group">
                    {sub.label && <p className="cp-sub-label">{sub.label}</p>}
                    <div className="cp-grid">
                      {sub.topics.map((t) => (
                        <Card key={t} topic={t} n={numbered.get(t) || 0} status={bandOf(t)} examReady={bandOf(t) === 'exam-ready'} onPick={onPick} index={cardIndex++} marks={marks?.get(t)} rating={ratings?.get(t)} />
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
