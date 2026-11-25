import { useEffect, useSyncExternalStore } from 'react'

/*
  Focus mode for the page backdrop.

  The backdrop (AtmosphereBackground) is busy on purpose: packets, status
  lights, a lit row and column under the pointer. That suits a dashboard, but it
  competes with the page when you are reading notes or working a question. Any
  screen that is a piece of focused work says so with useFocusMode, and the
  backdrop goes quiet for as long as at least one such screen is mounted.

    useFocusMode()            // focused for as long as this component is mounted
    useFocusMode(running)     // or only while a condition holds

  It is a count, not a flag, so two focused things on screen at once (or one
  mounting just as another unmounts) never fight over the state. React's strict
  mode mounts effects twice in development; the cleanup keeps the count right.
*/

let holders = 0
const listeners = new Set()

const emit = () => listeners.forEach((l) => l())
const subscribe = (l) => {
  listeners.add(l)
  return () => listeners.delete(l)
}
const getFocus = () => holders > 0

// Read by the backdrop.
export const useFocusSignal = () => useSyncExternalStore(subscribe, getFocus, () => false)

// Called by a screen that is focused work.
export function useFocusMode(active = true) {
  useEffect(() => {
    if (!active) return undefined
    holders += 1
    emit()
    return () => {
      holders -= 1
      emit()
    }
  }, [active])
}
