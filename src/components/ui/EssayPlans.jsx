import { useEffect, useMemo, useState } from 'react'
import BankDiagram from '@/components/ui/BankDiagram'
import PlanBoxes from '@/components/ui/PlanBoxes'
import { MARK_SPLIT, PLAN_AREAS, minutesFor } from '@/constants/econ-plans'
import './essay-plans.css'

/*
  Essay plans.

  The list is every exam question in the teaching spreadsheet. Opening one
  shows the question, boxes to plan in first (a box per point, each with an
  Add diagram under it, for analysis and for evaluation), and then the plan itself in the
  shape a strong answer takes: two columns of chains (analysis on the left,
  evaluation on the right), a bank diagram under the chains that need one,
  and a judgement.

  A plan's diagrams are NOT shifted for you. They sit in their starting
  position; "Do you know what shifts?" plays the shift, and hovering a curve
  says what shifts it in this chain.
*/

function Chain({ n, chain, tone }) {
  return (
    <article className={`ep-chain ep-${tone}`}>
      <header className="ep-chain-head">
        <span className="ep-n">{n}</span>
        <h4>{chain.title}</h4>
      </header>
      <ol className="ep-steps">
        {chain.steps.map((s, i) => (
          <li key={i}>
            <span className="ep-arrow" aria-hidden="true" />
            <p>{s}</p>
          </li>
        ))}
      </ol>
      {chain.d && (
        <div className="ep-diagram">
          <BankDiagram ids={chain.d.ids} quiz hover={chain.d.hover} />
        </div>
      )}
    </article>
  )
}

function PlanView({ item, onBack }) {
  const [revealed, setRevealed] = useState(false)
  const split = MARK_SPLIT[item.marks]
  const plan = item.plan
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [item.id])

  return (
    <div className="ep-root">
      <button type="button" className="ep-back" onClick={onBack}>
        ← All questions
      </button>
      <div className="ep-qcard">
        <div className="ep-tags">
          <span className="ep-tag ep-tag-marks">{item.marks} marks</span>
          {item.paper && <span className="ep-tag">{item.paper}</span>}
          <span className="ep-tag">{item.yr === 'Yr13' ? 'Year 13' : 'Year 12'}</span>
          <span className="ep-tag">{item.area}</span>
        </div>
        <h2 className="ep-question">{item.q}</h2>
        {split && (
          <p className="ep-split">
            {split.kaa} marks knowledge, application and analysis
            {split.evaluation ? `, ${split.evaluation} evaluation` : ', no evaluation marks'} · about {minutesFor(item.marks)} minutes
          </p>
        )}
      </div>

      <section className="ep-pad">
        <p className="ep-label">Plan it first</p>
        <p className="ep-hint">
          {split?.evaluation
            ? 'Write each analysis point and each evaluation point in its own box. Under any point that needs a diagram, press Add diagram and draw it. Finish with a judgement.'
            : 'Write each point in its own box. Under any point that needs a diagram, press Add diagram and draw it.'}
        </p>
        <div className="mt-3">
          <PlanBoxes itemId={item.id} marks={item.marks} hasEval={!!split?.evaluation} />
        </div>
      </section>

      {!plan ? (
        <section className="ep-none">
          <p className="ep-label">No plan yet</p>
          <p>
            There is no plan for this one: it depends on an extract that is not in the spreadsheet, or on content your notes do not cover, so nothing can be built from them. It draws on: <strong>{item.area}</strong>. Plan it yourself in the boxes above, then check it against the notes for that chapter.
          </p>
        </section>
      ) : !revealed ? (
        <div className="ep-reveal">
          <button type="button" className="dr-btn dr-btn-primary" onClick={() => setRevealed(true)}>
            Show the plan
          </button>
          <p className="ep-hint">Do your own first, then compare.</p>
        </div>
      ) : (
        <section className="ep-plan">
          <div className={`ep-cols ${plan.right.length ? '' : 'ep-single'}`}>
            <div className="ep-col">
              <h3 className="ep-colhead ep-good">{plan.cols[0]}</h3>
              {plan.left.map((ch, i) => (
                <Chain key={`${i}-${ch.title}`} n={i + 1} chain={ch} tone="good" />
              ))}
            </div>
            {plan.right.length > 0 && (
              <div className="ep-col">
                <h3 className="ep-colhead ep-bad">{plan.cols[1]}</h3>
                {plan.right.map((ch, i) => (
                  <Chain key={`${i}-${ch.title}`} n={i + 1} chain={ch} tone="bad" />
                ))}
              </div>
            )}
          </div>
          {plan.judge && (
            <div className="ep-judge">
              <p className="ep-label">Judgement</p>
              <p>{plan.judge}</p>
            </div>
          )}
          <p className="ep-source">From your notes: {plan.notes.join(', ')}</p>
        </section>
      )}
    </div>
  )
}

export default function EssayPlans({ items }) {
  const [marks, setMarks] = useState(0)
  const [area, setArea] = useState('All')
  const [onlyPlans, setOnlyPlans] = useState(false)
  const [search, setSearch] = useState('')
  const [openId, setOpenId] = useState(null)

  const shown = useMemo(() => {
    const s = search.trim().toLowerCase()
    return items.filter((q) => (!marks || q.marks === marks) && (area === 'All' || q.area === area) && (!onlyPlans || q.plan) && (!s || q.q.toLowerCase().includes(s)))
  }, [items, marks, area, onlyPlans, search])
  const ready = items.filter((q) => q.plan).length
  const open = openId && items.find((q) => q.id === openId)

  if (open) return <PlanView item={open} onBack={() => setOpenId(null)} />

  return (
    <div className="ep-root">
      <div>
        <p className="dr-eyebrow">Economics</p>
        <h2 className="dr-title">Essay plans</h2>
        <p className="mt-1 max-w-2xl text-muted">
          Every exam question in your spreadsheet. {ready} of {items.length} have a plan written from your notes; the rest open as plan-it-yourself.
        </p>
      </div>

      <div className="ep-filters">
        <input type="search" className="ep-search" placeholder="Search questions" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search questions" />
        <div className="dr-topics" role="group" aria-label="Marks">
          {[0, 25, 15, 12, 10, 8, 5].map((m) => (
            <button key={m} type="button" onClick={() => setMarks(m)} className={`dr-topic ${marks === m ? 'is-on' : ''}`}>
              {m ? `${m} marks` : 'All marks'}
              <span>{items.filter((q) => (!m || q.marks === m) && (area === 'All' || q.area === area)).length}</span>
            </button>
          ))}
        </div>
        <div className="dr-topics" role="group" aria-label="Topic">
          {['All', ...PLAN_AREAS].map((a) => (
            <button key={a} type="button" onClick={() => setArea(a)} className={`dr-topic ${area === a ? 'is-on' : ''}`}>
              {a}
            </button>
          ))}
        </div>
        <label className="ep-check">
          <input type="checkbox" checked={onlyPlans} onChange={(e) => setOnlyPlans(e.target.checked)} />
          Only questions with a plan ({ready})
        </label>
      </div>

      <ul className="ep-list">
        {shown.map((q) => (
          <li key={q.id}>
            <button type="button" className="ep-row" onClick={() => setOpenId(q.id)}>
              <span className="ep-row-marks">{q.marks}</span>
              <span className="ep-row-main">
                <span className="ep-row-q">{q.q}</span>
                <span className="ep-row-meta">
                  {q.area}
                  {q.paper ? ` · ${q.paper}` : ''}
                </span>
              </span>
              <span className={`ep-badge ${q.plan ? 'is-ready' : ''}`}>{q.plan ? 'Plan ready' : 'Plan it yourself'}</span>
            </button>
          </li>
        ))}
        {!shown.length && <li className="text-muted">No questions match.</li>}
      </ul>
    </div>
  )
}
