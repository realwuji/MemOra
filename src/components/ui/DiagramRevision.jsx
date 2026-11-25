import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import BankCanvas from '@/components/ui/BankCanvas'
import DiagramScope from '@/components/ui/DiagramScope'
import Icon from '@/components/ui/Icon'
import SketchPad from '@/components/ui/SketchPad'
import { FAMILIES, TOPICS, buildDeck, familyOf, inScope, useBank } from '@/constants/dr-bank'
import { THEME_NAMES, chapterFor, themeOfFamily } from '@/constants/dr-notes'
import useDiagramScope from '@/hooks/useDiagramScope'
import { studyPathFor } from '@/lib/techniques'

/*
  Diagram Revision, on the teacher's own diagram bank.

  PRACTISE: pick a topic (or everything). You get a situation and draw the
  diagram on the pad that is always open under it (mouse, finger or Apple
  Pencil). Then the exact diagram is drawn by a pen, and shifts play. Hover a
  curve to see what shifts it, then say how yours compared.

  A question you have marked is remembered on this device and does not come
  back until the topic is finished. Browsing every diagram is the bank's job.
*/

const SEEN_KEY = 'memora.dr2.seen'
const loadSeen = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'))
  } catch {
    return new Set()
  }
}
const saveSeen = (s) => {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify([...s]))
  } catch {
    /* private mode: seen-tracking lasts the session only */
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
const STEPS = ['Read', 'Draw', 'Watch']

function Stepper({ at }) {
  return (
    <ol className="dr-steps" aria-label="Steps">
      {STEPS.map((s, i) => (
        <li key={s} className={i < at ? 'is-done' : i === at ? 'is-now' : ''}>
          <span>{i + 1}</span>
          {s}
        </li>
      ))}
    </ol>
  )
}

function Evaluate({ items }) {
  if (!items?.length) return null
  return (
    <section className="dr-eval" aria-label="Evaluation">
      <p className="dr-eval-head">Evaluation: why it might not hold</p>
      <ol>
        {items.map((e, i) => (
          <li key={e}>
            <span className="dr-eval-n">{i + 1}</span>
            <p>{e}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

// Where the notes explain this diagram, one click away.
function NotesLink({ id }) {
  const note = chapterFor(id)
  if (!note) return null
  return (
    <div className="dr-notes-link">
      <div>
        <p className="dr-notes-label">In your notes</p>
        <p className="dr-notes-where">
          {note.chapter}
          {note.heading ? ` · ${note.heading}` : ''}
        </p>
      </div>
      <Link className="dr-btn" to={studyPathFor('Economics', note.chapter, 'notes')}>
        Read the topic
        <Icon name="arrowRight" className="h-4 w-4" />
      </Link>
    </div>
  )
}

function Reveal({ question, bank }) {
  const [tab, setTab] = useState(0)
  const slide = bank[question.slides[tab]]
  return (
    <div className="mt-6">
      {question.slides.length > 1 && (
        <div className="dr-tabs" role="tablist">
          {question.slides.map((id, i) => (
            <button key={`${id}-${i}`} type="button" role="tab" aria-selected={tab === i} className={`dr-tab ${tab === i ? 'is-on' : ''}`} onClick={() => setTab(i)}>
              Diagram {i + 1}: {familyOf(id)}
            </button>
          ))}
        </div>
      )}
      <p className="dr-eyebrow mt-3">{familyOf(slide.id)}</p>
      {question.what && question.slides.length === 1 && <p className="dr-lead">{question.what}</p>}
      <div className="mt-3">
        <BankCanvas key={`${question.id}-${tab}`} slide={slide} />
      </div>
      <NotesLink id={slide.id} />
      {question.slides.length === 1 && <Evaluate items={question.eval} />}
    </div>
  )
}

function Practise({ bank, onAnswer }) {
  const fullDeck = useMemo(() => buildDeck(bank), [bank])
  const [scope, setScope] = useDiagramScope()
  // Only the questions whose diagrams are all in the chosen half of the course.
  const deck = useMemo(() => fullDeck.filter((x) => x.slides.every((id) => inScope(scope, familyOf(id)))), [fullDeck, scope])
  const topics = useMemo(() => TOPICS.filter((t) => (t === 'More than one diagram' ? deck.some((x) => x.topic === t) : inScope(scope, t))), [deck, scope])
  // The topics of this half of the course, grouped under their theme.
  const themed = useMemo(() => {
    const by = new Map()
    topics.forEach((t) => {
      const th = themeOfFamily(t)
      if (!th) return
      if (!by.has(th)) by.set(th, [])
      by.get(th).push(t)
    })
    return [...by.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([th, list]) => ({ key: th, title: `${th}: ${THEME_NAMES[th]}`, list }))
  }, [topics])
  const [seen, setSeen] = useState(loadSeen)
  const [topic, setTopic] = useState('All topics')
  const [order, setOrder] = useState(() => shuffled(deck))
  const [current, setCurrent] = useState(null)
  const [checked, setChecked] = useState(false)
  const [marked, setMarked] = useState(null)
  const [sketch, setSketch] = useState(null)
  const [score, setScore] = useState({ right: 0, done: 0 })

  const inTopic = (q) => topic === 'All topics' || q.topic === topic
  const pool = useMemo(() => order.filter((q) => inTopic(q) && !seen.has(q.id)), [order, seen, topic]) // eslint-disable-line react-hooks/exhaustive-deps

  // The question on screen is held in state, so answering it (which marks it
  // seen and shrinks the pool) never swaps it for another one.
  useEffect(() => {
    if (!current && pool.length) setCurrent(pool[0])
  }, [current, pool])
  const q = current

  const counts = useMemo(() => {
    const c = { 'All topics': deck.filter((x) => !seen.has(x.id)).length }
    topics.forEach((t) => {
      c[t] = deck.filter((x) => x.topic === t && !seen.has(x.id)).length
    })
    return c
  }, [deck, seen, topics])

  const markSeen = (id) =>
    setSeen((s) => {
      const n = new Set(s)
      n.add(id)
      saveSeen(n)
      return n
    })

  // The diagram is shown, then you say how yours compared: that is what is remembered.
  const reveal = () => setChecked(true)
  const mark = (right) => {
    setMarked(right ? 'right' : 'missed')
    markSeen(q.id)
    setScore((s) => ({ right: s.right + (right ? 1 : 0), done: s.done + 1 }))
    onAnswer?.({ question: q.context, correct: right, dontKnow: false })
  }
  const reset = () => {
    setCurrent(null)
    setChecked(false)
    setMarked(null)
    setSketch(null)
  }
  const resetTopic = () => {
    const ids = new Set(deck.filter(inTopic).map((d) => d.id))
    const n = new Set([...seen].filter((id) => !ids.has(id)))
    saveSeen(n)
    setSeen(n)
    setOrder(shuffled(deck))
    reset()
  }
  const pick = (t) => {
    setTopic(t)
    reset()
  }
  // A different half of the course is a different set of questions: start it fresh.
  const changeScope = (next) => {
    setScope(next)
    setTopic('All topics')
    setOrder(shuffled(fullDeck.filter((x) => x.slides.every((id) => inScope(next, familyOf(id))))))
    reset()
  }
  const scopeCounts = useMemo(() => {
    const n = (sc) => fullDeck.filter((x) => !seen.has(x.id) && x.slides.every((id) => inScope(sc, familyOf(id)))).length
    return { All: n('All'), Micro: n('Micro'), Macro: n('Macro') }
  }, [fullDeck, seen])

  const verdict = marked === 'right' ? 'Marked as right. Well done.' : 'Marked as missed. Watch it again to see what it needed.'
  const step = checked ? 2 : sketch ? 1 : 0

  return (
    <div>
      <div className="dr-toolbar">
        <DiagramScope value={scope} onChange={changeScope} counts={scopeCounts} label="Questions from" />
      </div>
      {/* Topics only once a half of the course is picked: under All there are too many to scan. */}
      {scope !== 'All' && (
        <div className="dr-themes" role="group" aria-label="Topic">
          {[{ key: 'all', title: null, list: ['All topics'] }, ...themed, ...(topics.includes('More than one diagram') ? [{ key: 'multi', title: 'Across topics', list: ['More than one diagram'] }] : [])].map((grp) => (
            <div key={grp.key} className="dr-theme">
              {grp.title && <p className="dr-theme-name">{grp.title}</p>}
              <div className="dr-topics">
                {grp.list.map((g) => (
                  <button key={g} type="button" onClick={() => pick(g)} aria-pressed={topic === g} className={`dr-topic ${topic === g ? 'is-on' : ''}`}>
                    {g}
                    <span>{counts[g]}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!q ? (
        <div className="dr-card mt-5 text-center">
          <p className="dr-context">You have been through every question in this topic.</p>
          <p className="mt-2 text-sm text-muted">Reset it to go round again in a new order, or pick another topic.</p>
          <button type="button" className="dr-btn mt-4" onClick={resetTopic}>
            Reset this topic
          </button>
        </div>
      ) : (
        <>
          <div className="dr-card mt-5" key={q.id}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Stepper at={step} />
              <p className="text-xs font-semibold text-muted">
                {score.right} right of {score.done} · {Math.max(0, pool.length - (marked ? 0 : 1))} left in this topic
              </p>
            </div>
            <p className="dr-eyebrow mt-4">{checked ? q.topic : 'Question'}</p>
            <p className="dr-context">{q.context}</p>

            <div className="mt-5">
              <p className="dr-label">Draw it (mouse, finger or Apple Pencil)</p>
              <div className="mt-2">
                <SketchPad value={sketch} onChange={setSketch} label="Draw the diagram, with the shift" />
              </div>
            </div>

            {!checked && (
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" className="dr-btn dr-btn-primary" onClick={reveal}>
                  Show the diagram
                </button>
              </div>
            )}
          </div>

          {checked && (
            <>
              <Reveal key={q.id} question={q} bank={bank} />
              <div className="dr-card mt-6">
                {!marked ? (
                  <>
                    <p className="dr-label">How did your diagram compare?</p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <button type="button" className="dr-btn dr-btn-primary" onClick={() => mark(true)}>
                        I had it right
                      </button>
                      <button type="button" className="dr-btn" onClick={() => mark(false)}>
                        I missed something
                      </button>
                    </div>
                  </>
                ) : (
                  <div className={`dr-marked flex flex-wrap items-center justify-between gap-3 ${marked === 'right' ? 'is-right' : ''}`}>
                    <p className="dr-marked-text">
                      {marked === 'right' && (
                        <span className="dr-marked-tick" aria-hidden="true">
                          <Icon name="check" className="h-4 w-4" />
                        </span>
                      )}
                      {verdict}
                    </p>
                    <button type="button" className="dr-btn dr-btn-primary" onClick={reset}>
                      Next question
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default function DiagramRevision({ onAnswer }) {
  const bank = useBank()
  return (
    <div className="dr-root mx-auto max-w-5xl">
      <div>
        <p className="dr-eyebrow">Economics</p>
        <h2 className="dr-title">Diagram revision</h2>
        <p className="mt-1 max-w-xl text-muted">A situation, then the diagram. Draw it, then watch the pen and the shift play out.</p>
      </div>
      <div className="mt-6">{!bank ? <p className="text-muted">Loading the diagram bank...</p> : <Practise bank={bank} onAnswer={onAnswer} />}</div>
    </div>
  )
}

export { FAMILIES }
