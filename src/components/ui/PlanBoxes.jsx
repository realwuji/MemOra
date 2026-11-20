import { useEffect, useRef, useState } from 'react'
import Icon from '@/components/ui/Icon'
import SketchPad from '@/components/ui/SketchPad'

/*
  Your own plan, before you look at the written one.

  One box per point, in two columns (analysis, then evaluation) when the
  question carries evaluation marks, and one column when it does not. Under
  every box sits "Add diagram": press it and a drawing pad opens for the
  diagram that belongs to that point, with a line to name it. Evaluation
  points work the same way as analysis points. A judgement box finishes a
  question that has evaluation marks.

  Everything is saved in this browser against the question, so a plan survives
  leaving the page.
*/

const MAX_POINTS = 6
const key = (id) => `memora.plan.mine.${id}`
const uid = () => Math.random().toString(36).slice(2, 9)
const point = () => ({ id: uid(), text: '', diagrams: [] })

function initial(marks, hasEval) {
  const long = marks >= 12
  return {
    analysis: Array.from({ length: long ? 3 : 2 }, point),
    evaluation: hasEval ? Array.from({ length: long ? 2 : 1 }, point) : [],
    judgement: '',
  }
}

function load(id) {
  try {
    const v = JSON.parse(localStorage.getItem(key(id)) || 'null')
    return v && Array.isArray(v.analysis) && Array.isArray(v.evaluation) ? v : null
  } catch {
    return null
  }
}

function Box({ n, side, tone, value, onChange, onRemove, canRemove }) {
  const setDiagram = (id, patch) => onChange({ ...value, diagrams: value.diagrams.map((d) => (d.id === id ? { ...d, ...patch } : d)) })
  const placeholder = side === 'analysis' ? 'Write the point as a chain: because..., so..., which leads to...' : 'Write the evaluation point: it depends on..., so how far...'
  const noun = side === 'analysis' ? 'Point' : 'Evaluation'

  return (
    <article className={`pp-box ep-${tone}`}>
      <header className="pp-head">
        <span className="ep-n">{n}</span>
        <label className="pp-title" htmlFor={`pp-${value.id}`}>
          {noun} {n}
        </label>
        {canRemove && (
          <button
            type="button"
            className="pp-remove"
            aria-label={`Remove ${noun.toLowerCase()} ${n}`}
            onClick={() => {
              if (!value.text.trim() && !value.diagrams.length) onRemove()
              else if (window.confirm(`Remove ${noun.toLowerCase()} ${n} and its diagrams?`)) onRemove()
            }}
          >
            <Icon name="x" className="h-4 w-4" />
          </button>
        )}
      </header>

      <textarea id={`pp-${value.id}`} className="pp-text" rows={3} placeholder={placeholder} value={value.text} onChange={(e) => onChange({ ...value, text: e.target.value })} />

      {value.diagrams.map((d, i) => (
        <div key={d.id} className="pp-diagram">
          <div className="pp-diagram-head">
            <input
              type="text"
              className="pp-diagram-name"
              placeholder="Which diagram? (for example negative externality)"
              aria-label={`Name of diagram ${i + 1} for ${noun.toLowerCase()} ${n}`}
              value={d.name}
              onChange={(e) => setDiagram(d.id, { name: e.target.value })}
            />
            <button type="button" className="pp-remove" aria-label="Remove this diagram" onClick={() => onChange({ ...value, diagrams: value.diagrams.filter((x) => x.id !== d.id) })}>
              <Icon name="x" className="h-4 w-4" />
            </button>
          </div>
          <SketchPad value={d.sketch} onChange={(sketch) => setDiagram(d.id, { sketch })} label={`Diagram for ${noun.toLowerCase()} ${n}`} />
        </div>
      ))}

      <button type="button" className="pp-add" onClick={() => onChange({ ...value, diagrams: [...value.diagrams, { id: uid(), name: '', sketch: null }] })}>
        <Icon name="plus" className="h-4 w-4" />
        {value.diagrams.length ? 'Add another diagram' : 'Add diagram'}
      </button>
    </article>
  )
}

function Side({ side, tone, heading, list, onList }) {
  const set = (i, v) => onList(list.map((x, k) => (k === i ? v : x)))
  return (
    <div className="ep-col">
      <h3 className={`ep-colhead ep-${tone}`}>{heading}</h3>
      {list.map((v, i) => (
        <Box key={v.id} n={i + 1} side={side} tone={tone} value={v} onChange={(nv) => set(i, nv)} canRemove={list.length > 1} onRemove={() => onList(list.filter((_, k) => k !== i))} />
      ))}
      {list.length < MAX_POINTS && (
        <button type="button" className="pp-more" onClick={() => onList([...list, point()])}>
          <Icon name="plus" className="h-4 w-4" />
          Add {side === 'analysis' ? 'a point' : 'an evaluation point'}
        </button>
      )}
    </div>
  )
}

export default function PlanBoxes({ itemId, marks, hasEval }) {
  const [plan, setPlan] = useState(() => load(itemId) || initial(marks, hasEval))
  const timer = useRef(null)

  // Saved a moment after the last keystroke or stroke, not on every one.
  useEffect(() => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      try {
        localStorage.setItem(key(itemId), JSON.stringify(plan))
      } catch {
        /* private mode: the plan still works for this visit */
      }
    }, 400)
    return () => clearTimeout(timer.current)
  }, [itemId, plan])

  const showEval = hasEval
  return (
    <div>
      <div className={`ep-cols ${showEval ? '' : 'ep-single'}`}>
        <Side side="analysis" tone="good" heading="Analysis" list={plan.analysis} onList={(analysis) => setPlan((p) => ({ ...p, analysis }))} />
        {showEval && <Side side="evaluation" tone="bad" heading="Evaluation" list={plan.evaluation} onList={(evaluation) => setPlan((p) => ({ ...p, evaluation }))} />}
      </div>
      {showEval && (
        <div className="pp-judge">
          <label className="ep-label" htmlFor="pp-judgement">
            Judgement
          </label>
          <textarea id="pp-judgement" className="pp-text" rows={3} placeholder="Your overall judgement, and the one thing it depends on most." value={plan.judgement} onChange={(e) => setPlan((p) => ({ ...p, judgement: e.target.value }))} />
        </div>
      )}
    </div>
  )
}
