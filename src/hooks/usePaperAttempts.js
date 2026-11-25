import { useCallback, useEffect, useState } from 'react'

/*
  Past paper sittings a student has timed, marked and saved, kept in this browser:
  [{ id, date, set, paper, seconds, allowed, total, max, scores: { [questionNum]: mark } }].
  Every view of the past papers reads the same list, so a score saved after a sitting shows
  up next time the paper is listed.
*/
const KEY = 'memora.pastpapers.maths.attempts'
const listeners = new Set()

const read = () => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]')
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}
let state = read()

const write = (next) => {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* private window or blocked storage: scores last until the page closes */
  }
  listeners.forEach((fn) => fn(next))
}

export default function usePaperAttempts() {
  const [attempts, setAttempts] = useState(state)
  useEffect(() => {
    listeners.add(setAttempts)
    return () => listeners.delete(setAttempts)
  }, [])
  const save = useCallback((a) => write([{ ...a, id: `${a.date}-${a.set}-${a.paper}` }, ...state]), [])
  const remove = useCallback((id) => write(state.filter((x) => x.id !== id)), [])
  return { attempts, save, remove }
}
