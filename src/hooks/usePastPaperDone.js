import { useCallback, useEffect, useState } from 'react'
import { useApp } from '@/context/AppProvider'

/*
  How each past paper question went, kept in this browser: a Map of question number to
  'right' or 'wrong'. The By paper and By chapter views read the same list, so a mark in one
  shows in the other, and the chapter cards use it for their progress ring.

  Marking a question also logs an attempt for its chapter, so the dashboard and Progress page
  move too. Pressing the same result again clears it.
*/
const KEY = 'memora.pastpapers.maths.done'
const listeners = new Set()

/*
  Maths questions are keyed by their number (the saved lists predate other subjects). Any other
  subject's questions carry a base folder, and are keyed by that folder and number, so the two
  subjects' numbers never collide.
*/
export const doneKey = (q) => (q.base ? `${q.base}:${q.num}` : q.num)

const read = () => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]')
    // an older list of ticked numbers counts as right
    if (Array.isArray(v)) return new Map(v.map((n) => (Array.isArray(n) ? n : [n, 'right'])))
    return new Map(Object.entries(v).map(([k, r]) => [/^\d+$/.test(k) ? Number(k) : k, r]))
  } catch {
    return new Map()
  }
}
let state = read()

const write = (next) => {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify([...next]))
  } catch {
    /* private window or blocked storage: marks last until the page closes */
  }
  listeners.forEach((fn) => fn(next))
}

export default function usePastPaperDone() {
  const [done, setDone] = useState(state)
  const { logAttempt } = useApp()
  useEffect(() => {
    listeners.add(setDone)
    return () => listeners.delete(setDone)
  }, [])
  // mark(q, 'right' | 'wrong'): q is the question object (num, topic, question, subject)
  const mark = useCallback(
    (q, result) => {
      const next = new Map(state)
      const key = doneKey(q)
      if (next.get(key) === result) next.delete(key)
      else {
        next.set(key, result)
        logAttempt?.({ subject: q.subject || 'Maths', topic: q.topic, technique: 'exam-questions', question: q.question, correct: result === 'right', dontKnow: false })
      }
      write(next)
    },
    [logAttempt],
  )
  return [done, mark]
}
