import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import BankDiagram from '@/components/ui/BankDiagram'
import { answerParts, sentences, text } from '@/lib/notesDeck'
import './application.css'

/*
  Application: real-life examples for each topic, in one place.

  A real-life case is laid out so it can be remembered, not just read:
    what happened    a timeline that draws itself, one dated beat at a time
    the numbers      the figures worth learning, counting up as they appear
    how it links     each piece of theory the case shows, joined to it by an arrow
    the diagram      the related diagram, unshifted until you ask what shifts
    the answer       the chain of analysis, then evaluation

  Cases come newest first (latest events, then real examples). The practice
  scenarios that used to sit in the notes follow, as before. Memorise turns a
  case into a recall drill: the dates show, you say what happened, then the
  numbers are hidden behind tiles you flip, then the links, then the answer.
*/

const KNOWN_KEY = 'memora.app.known'
const loadKnown = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(KNOWN_KEY) || '[]'))
  } catch {
    return new Set()
  }
}
const saveKnown = (s) => {
  try {
    localStorage.setItem(KNOWN_KEY, JSON.stringify([...s]))
  } catch {
    /* private mode: progress lasts the session only */
  }
}

const shuffled = (list) => {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/* ---------------------------------------------------------------- data */

function buildCases(pack) {
  const out = {}
  const add = (topic, c) => {
    ;(out[topic] ||= []).push(c)
  }
  Object.entries(pack.realCases || {}).forEach(([topic, list]) =>
    list.forEach((c, i) =>
      add(topic, {
        ...c,
        id: `real:${topic}:${i}`,
        topic,
        real: true,
        parts: [
          { label: 'Analysis', steps: c.analysis },
          ...(c.evaluation?.length ? [{ label: 'Evaluation', steps: c.evaluation }] : []),
        ],
      }),
    ),
  )
  Object.entries(pack.applications || {}).forEach(([topic, list]) =>
    list.forEach((c, i) =>
      add(topic, {
        id: `note:${topic}:${i}`,
        topic,
        kind: 'notes',
        real: false,
        situation: c.question,
        parts: answerParts(c.answer).map((p) => ({ label: p.label, steps: sentences(p.body) })),
      }),
    ),
  )
  // Latest events first, then real examples, then your notes' practice cases.
  const rank = { latest: 0, example: 1, notes: 2 }
  Object.values(out).forEach((l) => l.sort((a, b) => rank[a.kind] - rank[b.kind]))
  return out
}

function outline(pack, cases) {
  const placed = new Set()
  const themes = []
  ;(pack.groups || []).forEach((g) => {
    const subs = []
    ;(g.subgroups || []).forEach((s) => {
      const topics = (s.topics || []).filter((t) => cases[t]?.length)
      topics.forEach((t) => placed.add(t))
      if (topics.length) subs.push({ label: s.label, topics })
    })
    if (subs.length) themes.push({ label: g.label, subs })
  })
  const rest = Object.keys(cases).filter((t) => !placed.has(t))
  if (rest.length) themes.push({ label: 'Other topics', subs: [{ label: '', topics: rest }] })
  return themes
}

/* -------------------------------------------------------------- motion */

const ease = [0.22, 1, 0.36, 1]
function useMotion() {
  const reduce = useReducedMotion()
  return { reduce, init: (v) => (reduce ? false : v) }
}

const MONTH = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/
const isYear = (v, token) => Number.isInteger(v) && v >= 1900 && v <= 2100 && !token.includes(',')

/* A figure that counts up when it scrolls into view. Dates and years stay still. */
function CountUp({ value, go }) {
  const { reduce } = useMotion()
  // Starts at the final figure so it is correct with no animation (printing,
  // reduced motion); when it scrolls into view it counts up from zero.
  const [p, setP] = useState(1)
  const still = MONTH.test(value)
  useEffect(() => {
    if (still || reduce || !go) return undefined
    let raf
    let t0
    setP(0)
    const tick = (t) => {
      t0 ??= t
      const k = Math.min(1, (t - t0) / 1100)
      setP(1 - (1 - k) ** 3)
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [go, still, reduce])

  const pieces = value.split(/(\d[\d,]*\.?\d*)/)
  return (
    <>
      {pieces.map((piece, i) => {
        if (i % 2 === 0) return piece
        const v = parseFloat(piece.replace(/,/g, ''))
        const dec = piece.split('.')[1]?.length || 0
        const prev = pieces[i - 1]?.slice(-1)
        const next = pieces[i + 1]?.[0]
        const money = prev === '£' || prev === '$' || next === '%'
        if (still || (isYear(v, piece) && !money) || p >= 1) return piece
        const shown = v * p
        return dec ? shown.toFixed(dec) : Math.round(shown).toLocaleString('en-GB')
      })}
    </>
  )
}

/* ------------------------------------------------------------ sections */

function Heading({ n, children }) {
  return (
    <h4 className="ar-h">
      <span className="ar-h-n">{n}</span>
      {children}
    </h4>
  )
}

function Facts({ facts, flip = false }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const { init } = useMotion()
  const [open, setOpen] = useState(() => new Set())
  return (
    <div ref={ref} className="ar-facts" data-n={facts.length}>
      {facts.map((f, i) => {
        const hidden = flip && !open.has(i)
        return (
          <motion.div
            key={f.l}
            className={`ar-fact ${hidden ? 'is-hidden' : ''}`}
            initial={init({ opacity: 0, y: 14, scale: 0.96 })}
            animate={inView || flip ? { opacity: 1, y: 0, scale: 1 } : undefined}
            transition={{ duration: 0.5, delay: i * 0.1, ease }}
          >
            {hidden ? (
              <button type="button" className="ar-fact-flip" onClick={() => setOpen((s) => new Set(s).add(i))} aria-label={`Reveal the number for: ${f.l}`}>
                <span className="ar-fact-q">?</span>
                <span className="ar-fact-l">{f.l}</span>
                <span className="ar-fact-tap">tap to reveal</span>
              </button>
            ) : (
              <>
                <span className="ar-fact-n">
                  <CountUp value={f.n} go={inView || flip} />
                </span>
                <span className="ar-fact-l">{f.l}</span>
              </>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

/* `upto`: undefined shows every beat (it draws as it scrolls in); a number shows
   only the dates and reveals the text of that many beats (memorise mode). */
function Timeline({ story, upto }) {
  const { init } = useMotion()
  const staged = typeof upto === 'number'
  return (
    <ol className="ar-timeline">
      <motion.span
        className="ar-tl-line"
        aria-hidden="true"
        initial={init({ scaleY: 0 })}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: Math.min(2.2, 0.35 * story.length + 0.4), ease: 'easeOut' }}
      />
      {story.map((s, i) => {
        const shown = !staged || i < upto
        return (
          <motion.li
            key={s.when + s.what}
            className={`ar-beat ${shown ? '' : 'is-hidden'}`}
            initial={init({ opacity: 0, x: -16 })}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: staged ? 0 : i * 0.14, ease }}
          >
            <motion.span
              className="ar-node"
              aria-hidden="true"
              initial={init({ scale: 0 })}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ type: 'spring', stiffness: 380, damping: 18, delay: staged ? 0 : i * 0.14 + 0.1 }}
            />
            <div className="ar-beat-body">
              <p className="ar-when">{s.when}</p>
              {shown ? (
                <motion.p
                  className="ar-what"
                  initial={init({ opacity: 0, y: 6 })}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease }}
                >
                  {s.what}
                </motion.p>
              ) : (
                <p className="ar-what ar-what-ghost" aria-hidden="true">
                  <i />
                  <i />
                </p>
              )}
            </div>
          </motion.li>
        )
      })}
    </ol>
  )
}

function Links({ links }) {
  const { init } = useMotion()
  return (
    <ul className="ar-links">
      {links.map((l, i) => (
        <motion.li
          key={l.concept}
          className="ar-link"
          initial={init({ opacity: 0, x: -18 })}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, delay: i * 0.1, ease }}
        >
          <span className="ar-concept">{l.concept}</span>
          <motion.span
            className="ar-arrow"
            aria-hidden="true"
            initial={init({ scaleX: 0 })}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.45, delay: i * 0.1 + 0.25, ease: 'easeOut' }}
          />
          <p className="ar-how">{l.how}</p>
        </motion.li>
      ))}
    </ul>
  )
}

function Parts({ parts }) {
  return (
    <div className="ap-parts">
      {parts.map((p) => (
        <section key={p.label} className={`ap-part ap-part-${p.label.toLowerCase().replace(/\s+/g, '-')}`}>
          <p className="ap-label">{p.label}</p>
          <ol className="ap-steps">
            {p.steps.map((s) => (
              <li key={s}>
                <span className="ap-dot" aria-hidden="true" />
                <p>{s}</p>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}

function Tags({ c }) {
  if (!c.real) return <span className="ap-tag ap-tag-notes">Practice case from your notes</span>
  return (
    <>
      <span className={`ap-tag ${c.kind === 'latest' ? 'ap-tag-live' : 'ap-tag-example'}`}>{c.kind === 'latest' ? 'Latest event' : 'Real example'}</span>
      <span className="ap-tag">{c.region}</span>
      <span className="ap-tag">{c.when}</span>
    </>
  )
}

function Sources({ sources }) {
  if (!sources?.length) return null
  return (
    <p className="ar-sources">
      <span>Sources</span>
      {sources.map((s) => (
        <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer">
          {s.label} ↗
        </a>
      ))}
    </p>
  )
}

function Situation({ c }) {
  return (
    <div className="ap-situation">
      <p className="ap-label">Situation</p>
      <p>{text(c.situation)}</p>
    </div>
  )
}

/* The whole real-life case, every section at once (read mode). */
function RealCard({ c, n }) {
  const { init } = useMotion()
  return (
    <motion.article
      className={`ar-card ${c.kind === 'latest' ? 'is-live' : ''}`}
      initial={init({ opacity: 0, y: 22 })}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease }}
    >
      <header className="ar-top">
        <span className="ap-n">{n}</span>
        <div className="ap-tags">
          <Tags c={c} />
        </div>
      </header>
      <h3 className="ar-title">{c.title}</h3>
      <p className="ar-headline">{c.headline}</p>

      <Heading n="1">What happened</Heading>
      <Timeline story={c.story} />

      <Heading n="2">The numbers to know</Heading>
      <Facts facts={c.facts} />

      <Heading n="3">How it links to the theory</Heading>
      <Links links={c.links} />
      {c.diagram?.length > 0 && (
        <div className="ar-diagram">
          <p className="ap-label">The diagram behind it</p>
          <BankDiagram ids={c.diagram} />
        </div>
      )}

      <Heading n="4">Write the answer</Heading>
      <div className="ap-situation ar-task">
        <p className="ap-label">Your task</p>
        <p>{c.task}</p>
      </div>
      <Parts parts={c.parts} />
      <Sources sources={c.sources} />
    </motion.article>
  )
}

/* A practice case from the notes (read mode). */
function PracticeCard({ c, n }) {
  return (
    <article className="ap-card">
      <header className="ap-card-head">
        <span className="ap-n">{n}</span>
        <div className="ap-tags">
          <Tags c={c} />
        </div>
      </header>
      <Situation c={c} />
      <Parts parts={c.parts} />
    </article>
  )
}

/* ------------------------------------------------------------ memorise */

const REAL_STAGES = ['story', 'facts', 'links', 'answer']
const PROMPTS = {
  story: 'Say what happened at each date, then tap to check it.',
  facts: 'Say the number for each tile, then flip it.',
  links: 'Say which theory this case shows, then reveal the links.',
  answer: 'Say the chain of analysis out loud, then check it.',
}

function MemoriseReal({ c, stage, beats }) {
  const at = REAL_STAGES.indexOf(stage) // how far in
  return (
    <>
      <article className={`ar-card ${c.kind === 'latest' ? 'is-live' : ''}`}>
        <header className="ar-top">
          <div className="ap-tags">
            <span className="ap-tag ap-tag-topic">{c.topic}</span>
            <Tags c={c} />
          </div>
        </header>
        <h3 className="ar-title">{c.title}</h3>
        {at >= 3 && <p className="ar-headline">{c.headline}</p>}

        <Heading n="1">What happened</Heading>
        <Timeline story={c.story} upto={at === 0 ? beats : c.story.length} />

        {at >= 1 && (
          <>
            <Heading n="2">The numbers to know</Heading>
            <Facts facts={c.facts} flip />
          </>
        )}
        {at >= 2 && (
          <>
            <Heading n="3">How it links to the theory</Heading>
            <Links links={c.links} />
            {c.diagram?.length > 0 && (
              <div className="ar-diagram">
                <BankDiagram ids={c.diagram} />
              </div>
            )}
          </>
        )}
        {at >= 3 && (
          <>
            <Heading n="4">Write the answer</Heading>
            <div className="ap-situation ar-task">
              <p className="ap-label">Your task</p>
              <p>{c.task}</p>
            </div>
            <Parts parts={c.parts} />
            <Sources sources={c.sources} />
          </>
        )}
      </article>
      {at === 0 && beats < c.story.length && <p className="ap-prompt">{PROMPTS.story}</p>}
      {at > 0 && at < 3 && <p className="ap-prompt">{PROMPTS[stage]}</p>}
      {at === 3 && <p className="ap-prompt">{PROMPTS.answer}</p>}
    </>
  )
}

function Memorise({ list, label, onExit }) {
  const [known, setKnown] = useState(loadKnown)
  const [queue, setQueue] = useState(() => {
    const k = loadKnown()
    const fresh = list.filter((c) => !k.has(c.id))
    return shuffled(fresh.length ? fresh : list)
  })
  const [step, setStep] = useState(0) // how many reveals so far
  const [done, setDone] = useState(0)
  const [total, setTotal] = useState(() => queue.length)

  const c = queue[0]
  const reveals = c?.real ? REAL_STAGES.length : 1
  const [beatCount, setBeatCount] = useState(0) // dated beats of the timeline revealed so far

  const finish = (gotIt) => {
    if (gotIt) {
      const next = new Set(known).add(c.id)
      setKnown(next)
      saveKnown(next)
      setDone((d) => d + 1)
      setQueue((q) => q.slice(1))
    } else {
      setQueue((q) => [...q.slice(1), q[0]])
    }
    setStep(0)
    setBeatCount(0)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const restart = () => {
    const next = new Set(known)
    list.forEach((x) => next.delete(x.id))
    setKnown(next)
    saveKnown(next)
    setQueue(shuffled(list))
    setTotal(list.length)
    setDone(0)
    setStep(0)
    setBeatCount(0)
  }

  if (!c) {
    return (
      <div className="ap-done">
        <p className="ap-done-big">All {list.length} remembered</p>
        <p className="ap-hint">{label}. Come back before the exam and run it again.</p>
        <div className="ap-row">
          <button type="button" className="ap-btn ap-btn-primary" onClick={restart}>
            Go again
          </button>
          <button type="button" className="ap-btn" onClick={onExit}>
            Back to the cases
          </button>
        </div>
      </div>
    )
  }

  // Real cases: reveal the timeline beat by beat first, then each section in turn.
  const storyDone = !c.real || beatCount >= c.story.length
  const stage = c.real ? REAL_STAGES[Math.min(step, reveals - 1)] : 'answer'
  const last = c.real ? step >= reveals - 1 && storyDone : step >= 1

  const advance = () => {
    if (c.real && step === 0 && beatCount < c.story.length) {
      setBeatCount((b) => b + 1)
      return
    }
    setStep((s) => s + 1)
  }

  return (
    <div className="ap-mem ar-mem">
      <div className="ap-progress" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={done} aria-label="Cases remembered">
        <span style={{ width: `${total ? (done / total) * 100 : 0}%` }} />
      </div>
      <p className="ap-hint">
        {done} of {total} remembered · {queue.length} left
      </p>

      {c.real ? (
        <MemoriseReal key={c.id} c={c} stage={stage} beats={beatCount} />
      ) : (
        <article className="ap-card">
          <header className="ap-card-head">
            <div className="ap-tags">
              <span className="ap-tag ap-tag-topic">{c.topic}</span>
              <Tags c={c} />
            </div>
          </header>
          <Situation c={c} />
          {step >= 1 ? <Parts parts={c.parts} /> : <p className="ap-prompt">Say the chain of analysis out loud, then check it.</p>}
        </article>
      )}

      <div className="ap-row ap-actions">
        {!last ? (
          <button type="button" className="ap-btn ap-btn-primary" onClick={advance}>
            {c.real && step === 0 && beatCount < c.story.length
              ? beatCount === 0
                ? 'Show the first beat'
                : `Next beat (${beatCount} of ${c.story.length})`
              : c.real
                ? { 0: 'Show the numbers', 1: 'Show how it links', 2: 'Show the answer' }[step] || 'Next'
                : 'Show the application'}
          </button>
        ) : (
          <>
            <button type="button" className="ap-btn" onClick={() => finish(false)}>
              Again later
            </button>
            <button type="button" className="ap-btn ap-btn-primary" onClick={() => finish(true)}>
              Got it
            </button>
          </>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------- runner */

export default function ApplicationRunner({ pack }) {
  const cases = useMemo(() => buildCases(pack), [pack])
  const themes = useMemo(() => outline(pack, cases), [pack, cases])
  const [topic, setTopic] = useState(null) // a topic, '*' everything, '@real', '@latest'
  const [mode, setMode] = useState('read')

  const all = useMemo(() => Object.values(cases).flat(), [cases])
  const real = all.filter((c) => c.real)
  const latest = all.filter((c) => c.kind === 'latest')
  const topicCount = Object.keys(cases).length

  if (!all.length) return <p className="ap-hint">No applied cases for this subject yet.</p>

  if (!topic) {
    return (
      <div className="ap-root">
        <p className="ap-eyebrow">{pack.name}</p>
        <h2 className="ap-h1">Application</h2>
        <p className="ap-lede">
          Real-life cases for each topic: what happened, the numbers, how it links to the theory, and how to write it up. {real.length} real cases and {all.length - real.length} practice cases across {topicCount} topics.
        </p>

        <div className="ap-quick">
          <button type="button" className="ap-quick-btn" onClick={() => { setTopic('@real'); setMode('memorise') }}>
            <strong>Memorise the real cases</strong>
            <span>{real.length} cases, one reveal at a time</span>
          </button>
          {latest.length > 0 && (
            <button type="button" className="ap-quick-btn is-live" onClick={() => { setTopic('@latest'); setMode('read') }}>
              <strong>Latest events</strong>
              <span>{latest.length} dated, sourced cases</span>
            </button>
          )}
        </div>

        {themes.map((t) => (
          <section key={t.label} className="ap-theme">
            <h3 className="ap-theme-h">{t.label}</h3>
            {t.subs.map((s) => (
              <div key={s.label || 'x'}>
                {s.label && <p className="ap-sub">{s.label}</p>}
                <div className="ap-topics">
                  {s.topics.map((name) => {
                    const list = cases[name]
                    const r = list.filter((c) => c.real).length
                    const live = list.filter((c) => c.kind === 'latest').length
                    return (
                      <button key={name} type="button" className="ap-topic" onClick={() => setTopic(name)}>
                        <span className="ap-topic-name">{name}</span>
                        <span className="ap-topic-meta">
                          {r > 0 ? `${r} real` : ''}
                          {r > 0 && list.length - r > 0 ? ' · ' : ''}
                          {list.length - r > 0 ? `${list.length - r} practice` : ''}
                          {live > 0 && <em>{live} latest</em>}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
    )
  }

  const list = topic === '*' ? all : topic === '@real' ? real : topic === '@latest' ? latest : cases[topic] || []
  const heading = topic === '*' ? 'Every topic' : topic === '@real' ? 'The real cases' : topic === '@latest' ? 'Latest events' : topic
  const realList = list.filter((c) => c.real)
  const practice = list.filter((c) => !c.real)

  return (
    <div className="ap-root">
      <button type="button" className="ap-back" onClick={() => setTopic(null)}>
        ← All topics
      </button>
      <p className="ap-eyebrow">Application</p>
      <h2 className="ap-h1">{heading}</h2>
      <div className="ap-bar">
        <p className="ap-lede ap-lede-tight">
          {realList.length > 0 && `${realList.length} real ${realList.length === 1 ? 'case' : 'cases'}`}
          {realList.length > 0 && practice.length > 0 ? ' · ' : ''}
          {practice.length > 0 && `${practice.length} practice`}
        </p>
        <div className="ap-toggle" role="group" aria-label="Mode">
          <button type="button" className={mode === 'read' ? 'is-on' : ''} aria-pressed={mode === 'read'} onClick={() => setMode('read')}>
            Read
          </button>
          <button type="button" className={mode === 'memorise' ? 'is-on' : ''} aria-pressed={mode === 'memorise'} onClick={() => setMode('memorise')}>
            Memorise
          </button>
        </div>
      </div>

      {mode === 'read' ? (
        <div className="ap-list">
          {realList.map((c, i) => (
            <RealCard key={c.id} c={c} n={i + 1} />
          ))}
          {practice.length > 0 && (
            <>
              <h3 className="ar-sep">{realList.length ? 'Practice cases from your notes' : 'Cases from your notes'}</h3>
              {practice.map((c, i) => (
                <PracticeCard key={c.id} c={c} n={i + 1} />
              ))}
            </>
          )}
        </div>
      ) : (
        <Memorise key={topic} list={list} label={heading} onExit={() => setMode('read')} />
      )}
    </div>
  )
}
