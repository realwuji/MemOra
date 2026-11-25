/*
  Client for the Python worker (python.worker.js): one worker, one program at a
  time, with a time limit.

    preloadPython()                          start fetching the runtime now
    runPython({ code, stdin, trace })        -> Promise of the result
    stopPython()                             stop whatever is running
    onPythonStatus(fn)                       'idle' | 'loading' | 'running'

  A program that runs past the limit is stopped by throwing the worker away (the
  only way to stop a Python loop), and the next run starts a fresh one. The
  runtime is cached by the browser, so that costs a second or two, not a
  download. Loading time does not count against the limit.
*/

const TIME_LIMIT_MS = 10_000

let worker = null
let ready = false
let status = 'idle'
let nextId = 1
let active = null // { id, resolve, timer }
const listeners = new Set()

const setStatus = (s) => {
  if (s === status) return
  status = s
  listeners.forEach((fn) => fn(s))
}

export const onPythonStatus = (fn) => {
  listeners.add(fn)
  fn(status)
  return () => listeners.delete(fn)
}

function spawn() {
  worker = new Worker(new URL('./python.worker.js', import.meta.url), { type: 'module' })
  ready = false
  worker.onmessage = (e) => {
    const msg = e.data
    if (msg.type === 'ready') {
      ready = true
      if (!active) setStatus('idle')
    } else if (msg.type === 'result' && active && msg.id === active.id) {
      clearTimeout(active.timer)
      const { resolve } = active
      active = null
      setStatus('idle')
      resolve({ ok: msg.ok, output: msg.output, error: msg.error, steps: msg.steps, stepsCut: msg.stepsCut, ms: msg.ms })
    }
  }
  worker.onerror = (e) => {
    if (!active) return
    clearTimeout(active.timer)
    const { resolve } = active
    active = null
    worker.terminate()
    worker = null
    setStatus('idle')
    resolve({ ok: false, output: '', error: { type: 'LoadError', message: `Python could not be loaded${e.message ? `: ${e.message}` : ''}`, line: null }, steps: [], stepsCut: false, ms: 0 })
  }
}

export function preloadPython() {
  if (typeof Worker === 'undefined') return
  if (!worker) spawn()
  if (!ready) {
    if (!active) setStatus('loading')
    worker.postMessage({ type: 'init' })
  }
}

export function runPython({ code, stdin = '', trace = false, timeLimitMs = TIME_LIMIT_MS }) {
  if (typeof Worker === 'undefined') {
    return Promise.resolve({ ok: false, output: '', error: { type: 'Unsupported', message: 'This browser cannot run Python here.', line: null }, steps: [], stepsCut: false, ms: 0 })
  }
  if (active) stopPython()
  if (!worker) spawn()
  const id = nextId++
  return new Promise((resolve) => {
    active = { id, resolve, timer: null }
    setStatus(ready ? 'running' : 'loading')
    // The clock starts when the program starts, not while the runtime loads.
    const arm = () => {
      active.timer = setTimeout(() => {
        const { resolve: done } = active
        active = null
        worker.terminate()
        worker = null
        ready = false
        setStatus('idle')
        done({ ok: false, output: '', error: { type: 'TimeLimit', message: `Stopped: the program ran for more than ${Math.round(timeLimitMs / 1000)} seconds. Is there a loop that never ends?`, line: null }, steps: [], stepsCut: false, ms: timeLimitMs })
      }, timeLimitMs)
    }
    const startClock = () => {
      if (!active || active.id !== id) return
      setStatus('running')
      arm()
    }
    if (ready) startClock()
    else {
      const wait = (e) => {
        if (e.data.type === 'ready') {
          worker?.removeEventListener('message', wait)
          startClock()
        }
      }
      worker.addEventListener('message', wait)
      worker.postMessage({ type: 'init' })
    }
    worker.postMessage({ type: 'run', id, code, stdin, trace })
  })
}

export function stopPython() {
  if (!active) return
  clearTimeout(active.timer)
  const { resolve } = active
  active = null
  if (worker) worker.terminate()
  worker = null
  ready = false
  setStatus('idle')
  resolve({ ok: false, output: '', error: { type: 'Stopped', message: 'Stopped.', line: null }, steps: [], stepsCut: false, ms: 0 })
}
