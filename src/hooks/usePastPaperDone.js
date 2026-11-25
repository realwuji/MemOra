import { useCallback, useEffect, useState } from 'react'

/*
  Which past paper questions a student has ticked off, kept in this browser. The By paper and
  By chapter views read the same list, so a tick in one shows in the other.
*/
const KEY = 'memora.pastpapers.maths.done'
const listeners = new Set()

const read = () => {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) || '[]'))
  } catch {
    return new Set()
  }
}
let state = read()

const write = (next) => {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify([...next]))
  } catch {
    /* private window or blocked storage: ticks last until the page closes */
  }
  listeners.forEach((fn) => fn(next))
}

export default function usePastPaperDone() {
  const [done, setDone] = useState(state)
  useEffect(() => {
    listeners.add(setDone)
    return () => listeners.delete(setDone)
  }, [])
  const toggle = useCallback((num) => {
    const next = new Set(state)
    if (next.has(num)) next.delete(num)
    else next.add(num)
    write(next)
  }, [])
  return [done, toggle]
}
