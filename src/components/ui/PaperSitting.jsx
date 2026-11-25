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
const DOCK_KEY = 'memora.pastpapers.maths.dock'

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
  const cardRef = useRef(null)
  const [docked, setDocked] = useState(false)
  const dockRef = useRef(null)
  // The pill is dragged anywhere, and on release it settles against whichever side edge is nearer,
  // so it never rests in the middle of the questions. Stored as { side: 'left' | 'right', y }.
  const EDGE = 12
  const [spot, setSpot] = useState(() => {
    try {
      const v = JSON.parse(localStorage.getItem(DOCK_KEY) || 'null')
      return v && (v.side === 'left' || v.side === 'right') && typeof v.y === 'number' ? v : null
    } catch {
      return null
    }
  })
  const [live, setLive] = useState(null) // { x, y } while it is being dragged
  const [vw, setVw] = useState(() => window.innerWidth)
  const drag = useRef(null)
  useEffect(() => {
    const on = () => setVw(window.innerWidth)
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  const size = () => ({ w: dockRef.current?.offsetWidth || 120, h: dockRef.current?.offsetHeight || 120 })
  const clampY = (y) => Math.min(Math.max(72, y), window.innerHeight - size().h - 4)
  const dragStart = (e) => {
    if (e.target.closest('button')) return
    const r = dockRef.current.getBoundingClientRect()
    drag.current = { dx: e.clientX - r.left, dy: e.clientY - r.top }
    setLive({ x: r.left, y: r.top })
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const dragMove = (e) => {
    if (!drag.current) return
    const { w } = size()
    setLive({ x: Math.min(Math.max(4, e.clientX - drag.current.dx), window.innerWidth - w - 4), y: clampY(e.clientY - drag.current.dy) })
  }
  const dragEnd = () => {
    if (!drag.current) return
    drag.current = null
    setLive((cur) => {
      if (!cur) return null
      const { w } = size()
      const next = { side: cur.x + w / 2 > window.innerWidth / 2 ? 'right' : 'left', y: cur.y }
      setSpot(next)
      try {
        localStorage.setItem(DOCK_KEY, JSON.stringify(next))
      } catch {
        /* private window: the position lasts until the page closes */
      }
      return null
    })
  }
  const dockStyle = live
    ? { left: live.x, top: live.y, transition: 'none' }
    : spot
      ? { left: spot.side === 'right' ? vw - size().w - EDGE : EDGE, top: spot.y }
      : undefined
  const dragReset = () => {
    setSpot(null)
    try {
      localStorage.removeItem(DOCK_KEY)
    } catch {
      /* nothing stored */
    }
  }

  // once the timer card scrolls out of view, a small copy docks to the left edge (the pen hand is
  // usually the right one, so the left stays clear of it)
  useEffect(() => {
    const el = cardRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(([e]) => setDocked(!e.isIntersecting), { rootMargin: '-72px 0px 0px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [phase])

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
      <div ref={cardRef} className="card mb-4 flex flex-wrap items-center gap-3 px-4 py-3">
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

      <div
        ref={dockRef}
        className={`ps-dock ${docked ? 'is-on' : ''} ${(live ? live.x + 60 > window.innerWidth / 2 : spot?.side === 'right') ? 'is-right' : ''}`}
        aria-hidden={!docked}
        style={dockStyle}
        onPointerDown={dragStart}
        onPointerMove={dragMove}
        onPointerUp={dragEnd}
        onPointerCancel={dragEnd}
        onDoubleClick={dragReset}
        title="Drag to move. Double-click to put it back."
      >
        <span className="ps-dock-grip" aria-hidden="true" />
        {phase === 'sit' ? (
          <>
            <span className={`ps-dock-time font-mono tabular-nums ${tone}`}>{fmtClock(left)}</span>
            <span className="ps-dock-sub font-mono">{paused ? 'paused' : left < 0 ? 'over time' : 'left'}</span>
            <button type="button" className="ps-dock-btn" tabIndex={docked ? 0 : -1} onClick={() => setPaused((p) => !p)}>
              {paused ? 'Resume' : 'Pause'}
            </button>
            <button type="button" className="ps-dock-btn" tabIndex={docked ? 0 : -1} onClick={finish}>
              Finish
            </button>
          </>
        ) : (
          <>
            <span className="ps-dock-time font-mono tabular-nums text-fg">
              {total}/{max}
            </span>
            <span className="ps-dock-sub font-mono">{max ? Math.round((total / max) * 100) : 0}%</span>
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
