import { useMemo, useState } from 'react'
import Chip from '@/components/ui/Chip'
import PastPaperQuestion from '@/components/ui/PastPaperQuestion'
import usePastPaperDone from '@/hooks/usePastPaperDone'

/*
  Maths exam questions: the real past paper questions, filed by specification chapter. The
  study page has already narrowed `items` to the chosen chapter (or all of them). Shortest
  questions first, so a chapter builds from quick marks to the long ones, with its mark
  scheme and examiner's report under each question.
*/
const SIZES = [
  { id: 'All', label: 'All lengths', test: () => true },
  { id: 'short', label: 'Short (1 to 4 marks)', test: (m) => m <= 4 },
  { id: 'medium', label: 'Medium (5 to 8)', test: (m) => m >= 5 && m <= 8 },
  { id: 'long', label: 'Long (9 and over)', test: (m) => m >= 9 },
]

export default function PastPaperChapter({ items, chapterLabel }) {
  const [size, setSize] = useState('All')
  const [hideDone, setHideDone] = useState(false)
  const [done, mark] = usePastPaperDone()

  const ordered = useMemo(() => [...items].sort((a, b) => a.marks - b.marks || b.num - a.num), [items])
  const test = SIZES.find((s) => s.id === size).test
  const shown = ordered.filter((q) => test(q.marks) && !(hideDone && done.has(q.num)))
  const doneHere = items.filter((q) => done.has(q.num)).length
  const showTopic = new Set(items.map((q) => q.topic)).size > 1

  return (
    <div className="mx-auto max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-wide text-muted">// Exam questions</p>
      <h2 className="mt-1 text-2xl font-semibold text-fg">{chapterLabel}</h2>
      <p className="readable mt-2 text-sm text-muted">
        Real Edexcel questions on this chapter, shortest first. Try one, then open its mark scheme and the examiner&apos;s
        report underneath.
      </p>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Question length">
        {SIZES.map((s) => (
          <Chip key={s.id} size="sm" selected={s.id === size} onClick={() => setSize(s.id)}>
            {s.label}
          </Chip>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-y border-line py-2 font-mono text-xs text-muted">
        <span>
          {shown.length} questions · {shown.reduce((t, q) => t + q.marks, 0)} marks · {doneHere} of {items.length} done
        </span>
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" checked={hideDone} onChange={(e) => setHideDone(e.target.checked)} />
          Hide the ones I have done
        </label>
      </div>

      <ol className="mt-5 flex flex-col gap-5">
        {shown.map((q) => (
          <PastPaperQuestion key={q.num} q={q} result={done.get(q.num)} onMark={mark} showTopic={showTopic} />
        ))}
      </ol>
      {shown.length === 0 && <p className="mt-8 text-center text-sm text-muted">Nothing here. Try another length or chapter.</p>}
    </div>
  )
}
