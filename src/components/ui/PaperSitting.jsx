import { useEffect, useMemo, useRef, useState } from 'react'
import Button from '@/components/ui/Button'
import PastPaperQuestion from '@/components/ui/PastPaperQuestion'
import usePaperAttempts from '@/hooks/usePaperAttempts'
import { allowedSeconds, fmtClock } from '@/lib/paperTime'

/*
  Sit one past paper under timed conditions, then mark it and save the score.

    sit    the timer runs (pinned to the top so it is always in view), with the questions and a
           writing pad under each, and no mark scheme anywhere.
    mark   the mark scheme and examiner's report open under every question, with a box for your
           mark, and the total adds up as you go.
    saved  the score goes into the paper's history (usePaperAttempts), shown when the papers are listed.

  Time allowed is Edexcel's own rate, 1.2 minutes a mark (100 marks in 2 hours).
*/
export default function PaperSitting({ questions, set, paper, onExit }) {
  const max = useMemo(() => questions.reduce((t, q) => t + q.marks, 0), [questions])
  const allowed = allowedSeconds(max)
  const [phase, setPhase] = useState('sit')
  const [elapsed, setElapsed] = useState(0)
  const [paused, setPaused] = useState(false)
  const [scores, setScores] = useState({})
  const [saved, setSaved] = useState(false)
  const { save } = usePaperAttempts()
  const started = useRef(Date.now())

  // wall clock, so a throttled background tab does not lose time
  useEffect(() => {
    if (phase !== 'sit' || paused) return undefined
    const base = elapsed
    started.current = Date.now()
    const id = setInterval(() => setElapsed(base + Math.round((Date.now() - started.current) / 1000)), 500)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, paused])

  const left = allowed - elapsed
  const total = Object.values(scores).reduce((t, v) => t + (v || 0), 0)
  const marked = questions.filter((q) => scores[q.num] != null).length
  const setScore = (num, v) => setScores((s) => ({ ...s, [num]: v }))

  const finish = () => {
    setPhase('mark')
    window.scrollTo({ top: 0, behavior: 'auto' })
  }
  const saveAttempt = () => {
    save({ date: Date.now(), set, paper, seconds: elapsed, allowed, total, max, scores })
    setSaved(true)
  }

  const tone = left < 0 ? 'text-red-500' : left < 300 ? 'text-amber-500' : 'text-fg'

  return (
    <div className="mx-auto max-w-3xl">
      <div className="sticky top-2 z-40 mb-4 flex flex-wrap items-center gap-3 rounded-[var(--srv-r)] border border-line bg-surface px-4 py-3 shadow-lg">
        {phase === 'sit' ? (
          <>
            <div className="mr-auto">
              <p className="font-mono text-xs uppercase tracking-wide text-muted">
                {set} / {paper}{paused ? ' / paused' : ''}
              </p>
              <p className={`font-mono text-3xl font-semibold tabular-nums ${tone}`} aria-live="off">
                {fmtClock(left)}
              </p>
              <p className="font-mono text-xs text-muted">
                {left < 0 ? 'over time' : 'left'} · {fmtClock(allowed)} allowed for {max} marks
              </p>
            </div>
            <Button variant="secondary" size="sm" onClick={() => setPaused((p) => !p)}>
              {paused ? 'Resume' : 'Pause'}
            </Button>
            <Button size="sm" onClick={finish}>
              Finish and mark
            </Button>
          </>
        ) : (
          <>
            <div className="mr-auto">
              <p className="font-mono text-xs uppercase tracking-wide text-muted">
                {set} / {paper} / marking · took {fmtClock(elapsed)}
              </p>
              <p className="font-mono text-3xl font-semibold tabular-nums text-fg">
                {total} <span className="text-muted">/ {max}</span>{' '}
                <span className="text-lg text-muted">{max ? Math.round((total / max) * 100) : 0}%</span>
              </p>
              <p className="font-mono text-xs text-muted">
                {marked} of {questions.length} questions marked
              </p>
            </div>
            {saved ? (
              <Button size="sm" onClick={onExit}>
                Saved. Back to papers
              </Button>
            ) : (
              <>
                <Button variant="secondary" size="sm" onClick={onExit}>
                  Discard
                </Button>
                <Button size="sm" onClick={saveAttempt} disabled={marked === 0}>
                  Save score
                </Button>
              </>
            )}
          </>
        )}
      </div>

      {phase === 'sit' && (
        <p className="readable mb-4 text-sm text-muted">
          Work through the paper in order. Write your working in the space under each question, or on paper. The mark scheme
          opens when you finish.
        </p>
      )}

      <ol className="flex flex-col gap-5">
        {questions.map((q) => (
          <PastPaperQuestion
            key={q.num}
            q={q}
            phase={phase}
            score={scores[q.num]}
            onScore={setScore}
          />
        ))}
      </ol>

      {phase === 'sit' && (
        <div className="mt-8 flex justify-center">
          <Button onClick={finish}>Finish and mark</Button>
        </div>
      )}
    </div>
  )
}
