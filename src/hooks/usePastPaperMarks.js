import { useEffect, useMemo, useState } from 'react'
import usePastPaperDone, { doneKey } from '@/hooks/usePastPaperDone'

/*
  Per chapter, how many past paper questions there are and how many were marked right and wrong:
  Map of topic to { total, right, wrong }. `source` says whose questions: 'maths',
  'computer-science', or a falsy value for none (then this returns null). The question index is
  loaded on demand, so a subject never downloads another subject's questions. Marks are looked up
  with doneKey(q), the same key the question cards save under, so the two subjects never mix.
*/
const LOADERS = {
  maths: () => import('@/constants/maths-past-papers').then((m) => m.PAST_PAPER_QUESTIONS),
  'computer-science': () => import('@/constants/cs-past-papers').then((m) => m.CS_PAST_PAPER_QUESTIONS),
}

export default function usePastPaperMarks(source) {
  const enabled = Boolean(source && LOADERS[source])
  const [questions, setQuestions] = useState(null)
  const [done] = usePastPaperDone()
  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    LOADERS[source]().then((list) => !cancelled && setQuestions(list))
    return () => {
      cancelled = true
    }
  }, [enabled, source])
  return useMemo(() => {
    if (!enabled || !questions) return null
    const map = new Map()
    for (const q of questions) {
      const e = map.get(q.topic) || { total: 0, right: 0, wrong: 0 }
      e.total += 1
      const r = done.get(doneKey(q))
      if (r === 'right') e.right += 1
      else if (r === 'wrong') e.wrong += 1
      map.set(q.topic, e)
    }
    return map
  }, [enabled, questions, done])
}
