import { useEffect, useMemo, useState } from 'react'
import BankCanvas from '@/components/ui/BankCanvas'
import SketchPad from '@/components/ui/SketchPad'
import { FAMILIES, TOPICS, buildDeck, canon, familyOf, useBank } from '@/constants/dr-bank'

/*
  Diagram Revision, on the teacher's own diagram bank.

  PRACTISE: pick a topic (or everything). You get a situation, draw the
  diagram on the pad that is always open under it (mouse, finger or Apple
  Pencil), name the diagram family or families the answer needs - "add a
  second diagram" if it needs more - and check. Then the exact diagram is
  drawn by a pen, and shifts play. Hover a curve to see what shifts it.

  A question you have seen is remembered on this device and does not come
  back until the topic is finished.

  EXPLORE: any diagram in the bank, to watch it drawn.
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
const STEPS = ['Read', 'Draw', 'Name', 'Watch']

function grade(question, chosen) {
  // Either AD/AS model counts: the Keynesian AS curve or the neo-classical LRAS.
  const need = question.slides.map((id) => canon(familyOf(id)))
  const pool = [...need]
  let right = 0
  chosen.map(canon).forEach((k) => {
    const i = pool.indexOf(k)
    if (i >= 0) {
      pool.splice(i, 1)
      right++
    }
  })
  return { right, needed: need.length, extra: chosen.length - right, missed: pool, perfect: right === need.length && chosen.length === need.length }
}

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
      {question.slides.length === 1 && <Evaluate items={question.eval} />}
    </div>
  )
}

function Practise({ bank, onAnswer }) {
  const deck = useMemo(() => buildDeck(bank), [bank])
  const [seen, setSeen] = useState(loadSeen)
  const [topic, setTopic] = useState('All topics')
  const [order, setOrder] = useState(() => shuffled(deck))
  const [current, setCurrent] = useState(null)
  const [slots, setSlots] = useState([null])
  const [checked, setChecked] = useState(false)
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
    TOPICS.forEach((t) => {
      c[t] = deck.filter((x) => x.topic === t && !seen.has(x.id)).length
    })
    return c
  }, [deck, seen])

  const markSeen = (id) =>
    setSeen((s) => {
      const n = new Set(s)
      n.add(id)
      saveSeen(n)
      return n
    })
  const result = useMemo(() => (checked && q ? grade(q, slots.filter(Boolean)) : null), [checked, q, slots])

  const finish = (dontKnow) => {
    const g = grade(q, slots.filter(Boolean))
    setChecked(true)
    markSeen(q.id)
    setScore((s) => ({ right: s.right + (!dontKnow && g.perfect ? 1 : 0), done: s.done + 1 }))
    onAnswer?.({ question: q.context, correct: !dontKnow && g.perfect, dontKnow })
  }
  const reset = () => {
    setCurrent(null)
    setSlots([null])
    setChecked(false)
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

  const verdict = result
    ? result.perfect
      ? { tone: 'is-good', text: result.needed > 1 ? 'Every diagram spotted.' : 'Right diagram.' }
      : result.right > 0
        ? { tone: 'is-part', text: `${result.right} of ${result.needed} needed diagram${result.needed > 1 ? 's' : ''} right${result.extra ? `, ${result.extra} not needed` : ''}.` }
        : { tone: 'is-miss', text: 'Not this one. Watch what the answer needed.' }
    : null
  const step = checked ? 3 : slots[0] ? 2 : sketch ? 1 : 0

  return (
    <div>
      <div className="dr-topics" role="group" aria-label="Topic">
        {['All topics', ...TOPICS].map((g) => (
          <button key={g} type="button" onClick={() => pick(g)} className={`dr-topic ${topic === g ? 'is-on' : ''}`}>
            {g}
            <span>{counts[g]}</span>
          </button>
        ))}
      </div>

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
                {score.right} perfect of {score.done} · {pool.length - (checked ? 0 : 1) < 0 ? 0 : pool.length - (checked ? 0 : 1)} left in this topic
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

            <p className="dr-label mt-6">Which diagram would you draw?</p>
            {slots.map((chosen, n) => (
              <div key={n} className="dr-slot">
                <div className="dr-slot-head">
                  <span>{`Diagram ${n + 1}`}</span>
                  {n > 0 && !checked && (
                    <button type="button" className="text-xs font-bold text-brand-strong hover:underline" onClick={() => setSlots((s) => s.filter((_, k) => k !== n))}>
                      Remove
                    </button>
                  )}
                </div>
                <div className="dr-chips">
                  {FAMILIES.map((f) => {
                    let state = ''
                    if (checked && chosen === f) state = q.slides.map((id) => canon(familyOf(id))).includes(canon(f)) ? 'is-right' : 'is-wrong'
                    else if (chosen === f) state = 'is-on'
                    return (
                      <button key={f} type="button" disabled={checked} onClick={() => setSlots((s) => s.map((v, k) => (k === n ? f : v)))} className={`dr-chip ${state}`}>
                        {f}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            {!checked && slots.length < 3 && (
              <button type="button" className="dr-add" onClick={() => setSlots((s) => [...s, null])}>
                + Add {slots.length === 1 ? 'a second' : 'a third'} diagram
              </button>
            )}

            {!checked ? (
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" className="dr-btn dr-btn-primary" disabled={!slots[0]} onClick={() => finish(false)}>
                  Check my diagrams
                </button>
                <button type="button" className="dr-btn" onClick={() => finish(true)}>
                  Show me
                </button>
              </div>
            ) : (
              verdict && (
                <div className={`dr-verdict mt-5 ${verdict.tone}`}>
                  <span>{verdict.text}</span>
                  {result.missed.length > 0 && <span className="text-sm text-muted">Needed: {q.slides.map((id) => canon(familyOf(id))).join(' + ')}</span>}
                  {q.slides.some((id) => canon(familyOf(id)) === 'AD / AS') && <span className="text-sm text-muted">Either AD / AS model scores here. The Keynesian AS curve is the stronger choice.</span>}
                </div>
              )
            )}
          </div>

          {checked && (
            <>
              <Reveal key={q.id} question={q} bank={bank} />
              <div className="mt-6 flex justify-end">
                <button type="button" className="dr-btn dr-btn-primary" onClick={reset}>
                  Next question
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

function Explore({ bank }) {
  const [family, setFamily] = useState(FAMILIES[1])
  const slides = Object.values(bank).filter((s) => familyOf(s.id) === family)
  const [id, setId] = useState(slides[0]?.id)
  const slide = bank[id] && familyOf(id) === family ? bank[id] : slides[0]
  return (
    <div>
      <div className="dr-kit-tabs">
        {FAMILIES.map((f) => (
          <button
            key={f}
            type="button"
            className={`dr-tab ${family === f ? 'is-on' : ''}`}
            onClick={() => {
              setFamily(f)
              setId(Object.values(bank).find((s) => familyOf(s.id) === f)?.id)
            }}
          >
            {f}
          </button>
        ))}
      </div>
      {slide && (
        <div className="mt-3">
          <BankCanvas key={slide.id} slide={slide} />
        </div>
      )}
      <div className="dr-chips">
        {slides.map((s) => (
          <button key={s.id} type="button" onClick={() => setId(s.id)} className={`dr-chip ${slide?.id === s.id ? 'is-on' : ''}`}>
            {s.title.length > 58 ? `${s.title.slice(0, 56)}...` : s.title}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function DiagramRevision({ onAnswer }) {
  const [mode, setMode] = useState('practise')
  const bank = useBank()
  return (
    <div className="dr-root mx-auto max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="dr-eyebrow">Economics</p>
          <h2 className="dr-title">Diagram revision</h2>
          <p className="mt-1 max-w-xl text-muted">A situation, then the diagram. Draw it, name it, and watch the pen and the shift play out.</p>
        </div>
        <div className="dr-modes" role="tablist">
          <button type="button" role="tab" aria-selected={mode === 'practise'} className={`dr-mode ${mode === 'practise' ? 'is-on' : ''}`} onClick={() => setMode('practise')}>
            Practise
          </button>
          <button type="button" role="tab" aria-selected={mode === 'explore'} className={`dr-mode ${mode === 'explore' ? 'is-on' : ''}`} onClick={() => setMode('explore')}>
            Explore
          </button>
        </div>
      </div>
      <div className="mt-6">{!bank ? <p className="text-muted">Loading the diagram bank...</p> : mode === 'practise' ? <Practise bank={bank} onAnswer={onAnswer} /> : <Explore bank={bank} />}</div>
    </div>
  )
}

export { FAMILIES }
