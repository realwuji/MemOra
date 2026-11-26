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

export default function PastPaperQuestion({ q, result, onMark, showTopic = false, phase, score, onScore }) {
  // phase 'sit': timed paper, nothing but the question and the pad. 'mark': mark scheme open, with a mark box.
  const [msPick, setMs] = useState(null)
  const ms = msPick ?? phase === 'mark'
  const [er, setEr] = useState(false)
  const label = `${q.set} ${q.paper}, question ${q.q}, ${q.marks} marks`

  return (
    <li className="card exam-sheet overflow-hidden" style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 900px' }}>
      <header className="exam-sheet-head">
        <div>
          <p className="exam-sheet-source"><Icon name="paper" className="h-4 w-4" /> {q.set} / {q.paper}</p>
          <h3 className="exam-sheet-title">Question {q.q}</h3>
          {showTopic && q.topic && <p className="mt-1 text-sm text-muted">{q.topic}</p>}
        </div>
        <span className="srv-tag exam-sheet-marks">{q.marks} {q.marks === 1 ? 'mark' : 'marks'}</span>
      </header>
      {/* The printed page is dark ink on white, so it keeps a white ground in every theme. */}
      <img
        src={`${BASE}/${q.num}.webp`}
        alt={label}
        loading="lazy"
        decoding="async"
        width={1000}
        height={q.h}
        className="exam-sheet-scan block h-auto w-full bg-white"
      />
      <AnswerPad lines={Math.min(24, Math.max(5, q.marks + 3))} />
      {phase === 'sit' ? null : (
      <div className="exam-sheet-actions">
        <div className="exam-sheet-tools">
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
          <Chip quiet size="sm" selected={ms} aria-expanded={ms} onClick={() => setMs(!ms)}>
            {ms ? 'Hide mark scheme' : 'Mark scheme'}
          </Chip>
        ) : null}
        {q.erH ? (
          <Chip quiet size="sm" selected={er} aria-expanded={er} onClick={() => setEr((v) => !v)}>
            {er ? "Hide examiner's report" : "Examiner's report"}
          </Chip>
        ) : null}
        </div>
        {phase === 'mark' ? null : (
          <div className="exam-sheet-tools">
            <Chip quiet
              size="sm"
              selected={result === 'right'}
              aria-pressed={result === 'right'}
              onClick={() => onMark(q, 'right')}
              className="exam-sheet-right"
            >
              <Icon name="check" className="h-3.5 w-3.5" />
              Got it right
            </Chip>
            <Chip quiet
              size="sm"
              selected={result === 'wrong'}
              aria-pressed={result === 'wrong'}
              onClick={() => onMark(q, 'wrong')}
              className="exam-sheet-wrong"
            >
              <Icon name="x" className="h-3.5 w-3.5" />
              Got it wrong
            </Chip>
          </div>
        )}
      </div>
      )}
      <Reveal open={ms} src={`${BASE}/ms/${q.num}.webp`} alt={`Mark scheme: ${label}`} height={q.msH} />
      <Reveal open={er} src={`${BASE}/er/${q.num}.webp`} alt={`Examiner's report: ${label}`} height={q.erH} />
    </li>
  )
}
