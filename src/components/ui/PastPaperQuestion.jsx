import { useId, useRef, useState } from 'react'
import AnswerPad from '@/components/ui/AnswerPad'
import PaperFields from '@/components/ui/PaperFields'
import usePaperFields from '@/hooks/usePaperFields'
import Chip from '@/components/ui/Chip'
import Icon from '@/components/ui/Icon'
import { doneKey } from '@/hooks/usePastPaperDone'
import '@/components/ui/past-paper-stamp.css'

/*
  One real exam question, as printed, with its mark scheme and the examiner's report
  directly underneath (each opens on its own, so a student can try the question first).
  The report is missing for some questions (the mock sets have none), and then there is no button.

  q: { num, set, paper, q, marks, h, msH, erH }. The images live in
  public/past-papers/<subject>: <num>.webp (question), ms/<num>.webp, er/<num>.webp.
  q.base names the folder (set by each subject's index); maths is the default.

  `index` is the question's place in the list on screen (1, 2, 3...). It becomes the card's title
  so a shuffled or filtered list always reads Question 1, 2, 3, and the paper reference
  ("June 2016 / AS Paper 2 - Q7(d)") moves to the small line above it. The mark scheme and the
  examiner's report keep the full reference, because the images and the exam board use it.
  Without `index` (the timed papers, where the printed number matters) the title is the
  reference, as before.

  Working space: "Your working" is closed behind an Extra Space button, and grows out of that
  button when opened. The pad stays mounted while closed (hidden and inert) so the drawing is
  kept, and is also kept for the session. In a timed sitting (phase 'sit') the pad IS the answer
  area, so it is always open there and has no button.
*/
const DEFAULT_BASE = '/past-papers/maths'

// The mark just given: a red cross for wrong, a green tick for right. The key replays the animation
// each time the mark changes.
function MarkStamp({ result }) {
  if (!result) return null
  const wrong = result === 'wrong'
  return (
    <span key={result} className={`pp-stamp is-${result}`} role="status" aria-label={wrong ? 'Marked wrong' : 'Marked right'}>
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle className="pp-stamp-ring" cx="32" cy="32" r="28" pathLength="1" />
        {wrong ? (
          <path className="pp-stamp-mark" d="M21 21 L43 43 M43 21 L21 43" pathLength="1" />
        ) : (
          <path className="pp-stamp-mark" d="M18 33 L28 43 L46 22" pathLength="1" />
        )}
      </svg>
      <span className="pp-stamp-word">{wrong ? 'Wrong' : 'Right'}</span>
    </span>
  )
}

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

export default function PastPaperQuestion({ q, result, onMark, showTopic = false, phase, score, onScore, index }) {
  const BASE = q.base || DEFAULT_BASE
  // phase 'sit': timed paper, nothing but the question and the pad. 'mark': mark scheme open, with a mark box.
  const [msPick, setMs] = useState(null)
  const ms = msPick ?? phase === 'mark'
  const [er, setEr] = useState(false)
  // Typing straight onto the paper (empty cells and answer lines found in the image). See PaperFields.jsx.
  const fields = usePaperFields(doneKey(q))
  const hasAreas = Boolean(q.areas?.length)
  // Extra Space: closed by default, except in a timed sitting where the pad is the answer area.
  const [padOpen, setPadOpen] = useState(false)
  const padId = useId()
  const padWrap = useRef(null)
  const padButton = useRef(null)
  const alwaysOpen = phase === 'sit'
  const open = alwaysOpen || padOpen
  const toggledPad = () => {
    // The pad opens from the button: its clip starts at the button's horizontal position.
    const wrap = padWrap.current
    const btn = padButton.current
    if (wrap && btn && !padOpen) {
      const x = btn.getBoundingClientRect().left - wrap.getBoundingClientRect().left + btn.offsetWidth / 2
      wrap.style.setProperty('--pad-x', `${Math.max(0, Math.round(x))}px`)
    }
    setPadOpen(!padOpen)
  }
  const closePadOnEsc = (e) => {
    if (e.key === 'Escape' && padOpen && !alwaysOpen) {
      e.stopPropagation()
      setPadOpen(false)
      padButton.current?.focus()
    }
  }
  const label = `${q.set} ${q.paper}, question ${q.q}, ${q.marks} marks`

  return (
    <li
      className={`card exam-sheet overflow-hidden${result ? ` is-${result}` : ''}`}
      style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 900px' }}
    >
      <header className="exam-sheet-head">
        <div>
          <p className="exam-sheet-source">
            <Icon name="paper" className="h-4 w-4" /> {q.set} / {q.paper}
            {index ? ` · Q${q.q}` : ''}
          </p>
          <h3 className="exam-sheet-title">Question {index || q.q}</h3>
          {showTopic && q.topic && <p className="mt-1 text-sm text-muted">{q.topic}</p>}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <MarkStamp result={result} />
          <span className="srv-tag exam-sheet-marks">{q.marks} {q.marks === 1 ? 'mark' : 'marks'}</span>
        </div>
      </header>
      {/* The printed page is dark ink on white, so it keeps a white ground in every theme. */}
      <div className="paper-sheet">
        <img
          src={`${BASE}/${q.num}.webp`}
          alt={label}
          loading="lazy"
          decoding="async"
          width={1000}
          height={q.h}
          className="exam-sheet-scan block h-auto w-full bg-white"
        />
        {hasAreas && <PaperFields areas={q.areas} height={q.h} fields={fields} />}
      </div>
      {phase === 'sit' ? null : (
      <div className="exam-sheet-actions">
        <div className="exam-sheet-tools">
        <Chip
          ref={padButton}
          quiet
          size="sm"
          selected={padOpen}
          aria-expanded={padOpen}
          aria-controls={padId}
          onClick={toggledPad}
        >
          {padOpen ? 'Hide space' : 'Extra Space'}
        </Chip>
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
        {fields.count > 0 && (
          <Chip quiet size="sm" onClick={fields.clear}>
            Clear typing
          </Chip>
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
      <div
        ref={padWrap}
        id={padId}
        className={`exam-pad-reveal${open ? ' is-open' : ''}`}
        inert={!open}
        onKeyDown={closePadOnEsc}
      >
        <div className="exam-pad-inner">
          <AnswerPad lines={Math.min(24, Math.max(5, q.marks + 3))} storeKey={doneKey(q)} />
        </div>
      </div>
      <Reveal open={ms} src={`${BASE}/ms/${q.num}.webp`} alt={`Mark scheme: ${label}`} height={q.msH} />
      <Reveal open={er} src={`${BASE}/er/${q.erFile || q.num}.webp`} alt={`Examiner's report: ${label}`} height={q.erH} />
    </li>
  )
}
