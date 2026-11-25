import { useEffect, useMemo, useState } from 'react'
import Button from '@/components/ui/Button'
import Chip from '@/components/ui/Chip'
import PaperSitting from '@/components/ui/PaperSitting'
import PastPaperQuestion from '@/components/ui/PastPaperQuestion'
import usePaperAttempts from '@/hooks/usePaperAttempts'
import usePastPaperDone from '@/hooks/usePastPaperDone'
import jumpToTop from '@/lib/jumpToTop'
import { allowedSeconds, fmtClock } from '@/lib/paperTime'
import { PAST_PAPER_QUESTIONS, PP_SETS } from '@/constants/maths-past-papers'

/*
  Maths past papers. The first screen is only the papers: pick a paper type, then a sitting from the
  grid. A sitting opens as a timed paper (PaperSitting.jsx) or as untimed practice, and only then do
  the questions appear. Each sitting's card carries your best saved score and how many times you
  have sat it.
*/
const GROUPS = [
  { label: 'A-level', papers: ['Pure 1', 'Pure 2', 'Statistics', 'Mechanics', 'Statistics and Mechanics'] },
  { label: 'AS', papers: ['AS Pure', 'AS Statistics', 'AS Mechanics'] },
]
const tint = (paper) => (/Stat/.test(paper) ? '#be123c' : /Mech/.test(paper) ? '#0f766e' : '#2f8bd4')
const scoreTint = (pct) => (pct >= 70 ? '#2e9e6b' : pct >= 50 ? '#b45309' : '#be123c')

function SittingCard({ paper, set, qs, tries, onSit, onPractice }) {
  const marks = qs.reduce((t, q) => t + q.marks, 0)
  const best = tries.length ? Math.max(...tries.map((a) => Math.round((a.total / a.max) * 100))) : null
  const last = tries[0]
  return (
    <li className="card flex flex-col overflow-hidden" style={{ '--tag': tint(paper) }}>
      <div className="srv-titlebar">
        <span className="leds" aria-hidden="true">
          <i className="srv-led" />
          <i className="srv-led" />
          <i className="srv-led" />
        </span>
        <span className="path">{paper}</span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-semibold leading-tight text-fg">{set}</h3>
          {best !== null ? (
            <span className="srv-tag" style={{ '--tag': scoreTint(best) }}>
              <i aria-hidden="true" className="srv-led" />
              {best}%
            </span>
          ) : (
            <span className="srv-tag">Not sat</span>
          )}
        </div>
        <p className="font-mono text-xs text-muted">
          {qs.length} questions · {marks} marks · {fmtClock(allowedSeconds(marks))}
        </p>
        <p className="font-mono text-xs text-muted">
          {last ? `Last ${last.total} / ${last.max} · sat ${tries.length} ${tries.length === 1 ? 'time' : 'times'}` : 'No score saved yet'}
        </p>
        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          <Button size="sm" onClick={onSit}>
            Sit it timed
          </Button>
          <Button size="sm" variant="secondary" onClick={onPractice}>
            Practise
          </Button>
        </div>
      </div>
    </li>
  )
}

export default function PastPapers() {
  const [group, setGroup] = useState(0)
  const [paper, setPaper] = useState('Pure 1')
  const [open, setOpen] = useState(null) // { mode: 'sit' | 'practice', set, paper }
  const { attempts, remove } = usePaperAttempts()
  const [done, toggle] = usePastPaperDone()

  // opening a sitting (or coming back to the list) starts at the top, not wherever the card was
  useEffect(() => {
    jumpToTop()
  }, [open])

  const sittings = useMemo(
    () => PP_SETS.filter((s) => PAST_PAPER_QUESTIONS.some((q) => q.paper === paper && q.set === s)),
    [paper],
  )
  const qsOf = (p, s) => PAST_PAPER_QUESTIONS.filter((q) => q.paper === p && q.set === s)
  const triesOf = (p, s) => attempts.filter((a) => a.paper === p && a.set === s)

  const pickGroup = (i) => {
    setGroup(i)
    setPaper(GROUPS[i].papers[0])
  }

  if (open?.mode === 'sit') {
    return <PaperSitting questions={qsOf(open.paper, open.set)} set={open.set} paper={open.paper} onExit={() => setOpen(null)} />
  }

  if (open?.mode === 'practice') {
    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Button variant="secondary" size="sm" onClick={() => setOpen(null)}>
            All papers
          </Button>
          <p className="font-mono text-xs uppercase tracking-wide text-muted">
            // {open.set} / {open.paper} / practice, untimed
          </p>
        </div>
        <ol className="flex flex-col gap-5">
          {qsOf(open.paper, open.set).map((q) => (
            <PastPaperQuestion key={q.num} q={q} done={done.has(q.num)} onToggleDone={toggle} />
          ))}
        </ol>
      </div>
    )
  }

  const sat = new Set(attempts.map((a) => `${a.set}|${a.paper}`)).size
  const total = new Set(PAST_PAPER_QUESTIONS.map((q) => `${q.set}|${q.paper}`)).size

  return (
    <div className="mx-auto max-w-4xl">
      <p className="font-mono text-xs uppercase tracking-wide text-muted">// Edexcel A-level Maths</p>
      <h2 className="mt-1 text-3xl font-semibold text-fg">Past papers</h2>
      <p className="readable mt-2 text-sm text-muted">
        Choose a paper, then a sitting. Sit it under timed conditions, mark it against the mark scheme and
        examiner&apos;s report, and your score is saved here.
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-y border-line py-2 font-mono text-xs text-muted">
        <span>
          {sat} of {total} sittings sat
        </span>
        <span>1.2 minutes a mark</span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Level">
        {GROUPS.map((g, i) => (
          <Chip key={g.label} selected={i === group} onClick={() => pickGroup(i)}>
            {g.label}
          </Chip>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Paper">
        {GROUPS[group].papers.map((p) => (
          <Chip key={p} size="sm" selected={p === paper} onClick={() => setPaper(p)}>
            {p}
          </Chip>
        ))}
      </div>

      <ul className="mt-5 grid gap-4 sm:grid-cols-2">
        {sittings.map((s) => (
          <SittingCard
            key={s}
            paper={paper}
            set={s}
            qs={qsOf(paper, s)}
            tries={triesOf(paper, s)}
            onSit={() => setOpen({ mode: 'sit', set: s, paper })}
            onPractice={() => setOpen({ mode: 'practice', set: s, paper })}
          />
        ))}
      </ul>

      {attempts.length > 0 && (
        <section className="mt-10">
          <p className="font-mono text-xs uppercase tracking-wide text-muted">// Your saved scores</p>
          <ul className="mt-2 divide-y divide-line border-y border-line font-mono text-xs">
            {attempts.slice(0, 12).map((a) => (
              <li key={a.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-2">
                <span className="text-muted">{new Date(a.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className="text-fg">
                  {a.set} / {a.paper}
                </span>
                <span className="mr-auto text-fg">
                  {a.total} / {a.max} · {Math.round((a.total / a.max) * 100)}%
                </span>
                <span className="text-muted">
                  {fmtClock(a.seconds)} of {fmtClock(a.allowed)}
                </span>
                <button type="button" className="text-muted underline hover:text-fg" onClick={() => remove(a.id)} aria-label="Delete this saved score">
                  delete
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-8 text-xs text-muted">
        Questions, mark schemes and examiner&apos;s reports are from Pearson Edexcel papers and their mock sets.
      </p>
    </div>
  )
}
