/*
  Runs Python (Pyodide) off the main thread.

  Why a worker: a student's program can loop for ever, and the only way to stop a
  running Python is to throw the whole interpreter away. In a worker that is
  `terminate()`; on the main thread it would freeze the page. The runtime itself
  is fetched from this site (public/pyodide/, see scripts/copy-pyodide.mjs).

  Messages in:
    { type: 'init' }                                   load the runtime
    { type: 'run', id, code, stdin, trace }            run a program
  Messages out:
    { type: 'ready' }
    { type: 'result', id, ok, output, error, steps, stepsCut, ms }

  Input: `input()` reads the lines in `stdin`, in order, and echoes each line into
  the output as a terminal would. When they run out it raises EOFError, which is
  reported as "asked for more input than was given". Exam questions give their
  test data up front, so this is the same situation.

  Trace: with `trace` on, every executed line records the variables in the
  frame. That feeds the step-through and the trace table.
*/

const BASE = import.meta.env.BASE_URL || '/'
const MAX_OUTPUT = 100_000
const MAX_STEPS = 4000

let pyodide = null
let loading = null

// Python side: compile, run, trace, and turn any failure into plain data.
const HARNESS = `
import sys, json

def __memora_run(src, trace, max_steps):
    filename = '<program>'
    steps = []
    state = {'cut': False}
    g = {'__name__': '__main__'}

    def show(v):
        r = repr(v)
        return r if len(r) <= 80 else r[:77] + '...'

    def visible(frame):
        out = {}
        scope = frame.f_locals
        for k, v in list(scope.items()):
            if k.startswith('__'):
                continue
            if callable(v) or type(v).__name__ == 'module':
                continue
            out[k] = show(v)
        return out

    def tracer(frame, event, arg):
        if frame.f_code.co_filename != filename:
            return None
        if event == 'line':
            if len(steps) >= max_steps:
                state['cut'] = True
                sys.settrace(None)
                raise KeyboardInterrupt('step limit')
            depth = 0
            f = frame
            while f is not None:
                if f.f_code.co_filename == filename:
                    depth += 1
                f = f.f_back
            steps.append({'line': frame.f_lineno, 'fn': frame.f_code.co_name, 'depth': depth, 'vars': visible(frame)})
        return tracer

    try:
        code = compile(src, filename, 'exec')
    except SyntaxError as e:
        return json.dumps({'ok': False, 'error': {'type': 'SyntaxError', 'message': e.msg or 'invalid syntax', 'line': e.lineno}, 'steps': [], 'stepsCut': False})
    except Exception as e:
        return json.dumps({'ok': False, 'error': {'type': type(e).__name__, 'message': str(e), 'line': None}, 'steps': [], 'stepsCut': False})

    error = None
    try:
        if trace:
            sys.settrace(tracer)
        exec(code, g)
    except SystemExit:
        pass
    except KeyboardInterrupt:
        if not state['cut']:
            error = {'type': 'KeyboardInterrupt', 'message': 'stopped', 'line': None}
    except BaseException as e:
        line = None
        tb = e.__traceback__
        while tb is not None:
            if tb.tb_frame.f_code.co_filename == filename:
                line = tb.tb_lineno
            tb = tb.tb_next
        error = {'type': type(e).__name__, 'message': str(e), 'line': line}
    finally:
        sys.settrace(None)
    return json.dumps({'ok': error is None, 'error': error, 'steps': steps, 'stepsCut': state['cut']})
`

async function boot() {
  if (pyodide) return pyodide
  if (!loading) {
    loading = (async () => {
      const base = `${self.location.origin}${BASE}pyodide/`
      const { loadPyodide } = await import(/* @vite-ignore */ `${base}pyodide.mjs`)
      const py = await loadPyodide({ indexURL: base })
      py.runPython(HARNESS)
      pyodide = py
      return py
    })()
  }
  return loading
}

async function run({ id, code, stdin, trace }) {
  const py = await boot()
  const started = performance.now()
  const lines = String(stdin ?? '').split(/\r?\n/)
  if (lines.length && lines[lines.length - 1] === '') lines.pop() // a trailing newline is not another line
  let output = ''
  let clipped = false
  const decoder = new TextDecoder()
  const add = (text) => {
    if (clipped) return
    output += text
    if (output.length > MAX_OUTPUT) {
      output = `${output.slice(0, MAX_OUTPUT)}\n[output cut at ${MAX_OUTPUT.toLocaleString('en-GB')} characters]`
      clipped = true
    }
  }
  py.setStdout({ write: (buf) => { add(decoder.decode(buf, { stream: true })); return buf.length } })
  py.setStderr({ write: (buf) => { add(decoder.decode(buf, { stream: true })); return buf.length } })
  py.setStdin({
    stdin: () => {
      if (!lines.length) return undefined // end of input
      const line = lines.shift()
      add(`${line}\n`) // echo, as a terminal does
      return line
    },
  })
  let result
  try {
    const fn = py.globals.get('__memora_run')
    result = JSON.parse(fn(code, Boolean(trace), MAX_STEPS))
    fn.destroy?.()
  } catch (err) {
    result = { ok: false, error: { type: 'InternalError', message: String(err && err.message ? err.message : err), line: null }, steps: [], stepsCut: false }
  }
  if (result.error && result.error.type === 'EOFError') {
    result.error.message = 'The program asked for more input than was given.'
  }
  self.postMessage({ type: 'result', id, ok: result.ok, output, error: result.error, steps: result.steps, stepsCut: result.stepsCut, ms: Math.round(performance.now() - started) })
}

self.onmessage = async (e) => {
  const msg = e.data
  try {
    if (msg.type === 'init') {
      await boot()
      self.postMessage({ type: 'ready' })
    } else if (msg.type === 'run') {
      await run(msg)
    }
  } catch (err) {
    self.postMessage({ type: 'result', id: msg.id, ok: false, output: '', error: { type: 'LoadError', message: `Python could not be loaded: ${err && err.message ? err.message : err}`, line: null }, steps: [], stepsCut: false, ms: 0 })
  }
}
