import { useEffect, useMemo, useState } from 'react'
import usePastPaperDone from '@/hooks/usePastPaperDone'

/*
  Per chapter, how many past paper questions there are and how many were marked right and wrong:
  Map of topic to { total, right, wrong }. Only built for subjects with past papers (Maths), and
  the question index is loaded on demand so other subjects never download it.
*/
export default function usePastPaperMarks(enabled) {
  const [questions, setQuestions] = useState(null)
  const [done] = usePastPaperDone()
  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    import('@/constants/maths-past-papers').then((m) => !cancelled && setQuestions(m.PAST_PAPER_QUESTIONS))
    return () => {
      cancelled = true
    }
  }, [enabled])
  return useMemo(() => {
    if (!enabled || !questions) return null
    const map = new Map()
    for (const q of questions) {
      const e = map.get(q.topic) || { total: 0, right: 0, wrong: 0 }
      e.total += 1
      const r = done.get(q.num)
      if (r === 'right') e.right += 1
      else if (r === 'wrong') e.wrong += 1
      map.set(q.topic, e)
    }
    return map
  }, [enabled, questions, done])
}
