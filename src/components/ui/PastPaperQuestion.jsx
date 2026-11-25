import { useState } from 'react'
import AnswerPad from '@/components/ui/AnswerPad'
import Chip from '@/components/ui/Chip'
import Icon from '@/components/ui/Icon'

/*
  One real exam question, as printed, with its mark scheme and the examiner's report
  directly underneath (each opens on its own, so a student can try the question first).
  The report is missing for some questions (the mock sets have none), and then there is no button.

  q: { num, set, paper, q, marks, h, msH, erH }. The images live in
  public/past-papers/maths: <num>.webp (question), ms/<num>.webp, er/<num>.webp.
*/
const BASE = '/past-papers/maths'

function Reveal({ open, src, alt, height }) {
  if (!open) return null
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      width={900}
      height={height}
      className="block h-auto w-full border-t border-line bg-white"
    />
  )
}

export default function PastPaperQuestion({ q, done, onToggleDone, showTopic = false, phase, score, onScore }) {
  // phase 'sit': timed paper, nothing but the question and the pad. 'mark': mark scheme open, with a mark box.
  const [msPick, setMs] = useState(null)
  const ms = msPick ?? phase === 'mark'
  const [er, setEr] = useState(false)
  const label = `${q.set} ${q.paper}, question ${q.q}, ${q.marks} marks`

  return (
    <li className="card overflow-hidden" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 900px' }}>
      <div className="srv-titlebar">
        <span className="leds" aria-hidden="true">
          <i className="srv-led" />
          <i className="srv-led" />
          <i className="srv-led" />
        </span>
        <span className="path">
          {q.set} / {q.paper} / Q{q.q} / {q.marks} {q.marks === 1 ? 'mark' : 'marks'}
          {showTopic && q.topic ? ` / ${q.topic}` : ''}
        </span>
      </div>
      {/* The printed page is dark ink on white, so it keeps a white ground in every theme. */}
      <img
        src={`${BASE}/${q.num}.webp`}
        alt={label}
        loading="lazy"
        decoding="async"
        width={1000}
        height={q.h}
        className="block h-auto w-full bg-white"
      />
      <AnswerPad lines={Math.min(24, Math.max(5, q.marks + 3))} />
      {phase === 'sit' ? null : (
      <div className="flex flex-wrap items-center gap-2 border-t border-line px-3 py-2">
        <span className="mr-auto font-mono text-xs text-muted">#{q.num}</span>
        {phase === 'mark' && (
          <label className="flex items-center gap-2 font-mono text-xs text-muted">
            Your mark
            <input
              type="number"
              min={0}
              max={q.marks}
              inputMode="numeric"
              value={score ?? ''}
              onChange={(e) => onScore(q.num, e.target.value === '' ? null : Math.max(0, Math.min(q.marks, Number(e.target.value))))}
              className="w-14 rounded-md border border-line bg-surface px-2 py-1 text-center text-fg"
            />
            / {q.marks}
          </label>
        )}
        {q.msH ? (
          <Chip size="sm" selected={ms} aria-expanded={ms} onClick={() => setMs(!ms)}>
            {ms ? 'Hide mark scheme' : 'Mark scheme'}
          </Chip>
        ) : null}
        {q.erH ? (
          <Chip size="sm" selected={er} aria-expanded={er} onClick={() => setEr((v) => !v)}>
            {er ? "Hide examiner's report" : "Examiner's report"}
          </Chip>
        ) : null}
        {phase === 'mark' ? null : (
          <Chip size="sm" selected={done} aria-pressed={done} onClick={() => onToggleDone(q.num)}>
            {done && <Icon name="check" className="h-3.5 w-3.5" />}
            {done ? 'Done' : 'Mark as done'}
          </Chip>
        )}
      </div>
      )}
      <Reveal open={ms} src={`${BASE}/ms/${q.num}.webp`} alt={`Mark scheme: ${label}`} height={q.msH} />
      <Reveal open={er} src={`${BASE}/er/${q.num}.webp`} alt={`Examiner's report: ${label}`} height={q.erH} />
    </li>
  )
}
