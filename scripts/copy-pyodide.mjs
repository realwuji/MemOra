/*
  Copies the Pyodide runtime (Python compiled to WebAssembly) into
  public/pyodide/, so the Coding feature runs Python from this site, offline,
  with no third-party host.

  The files are build artefacts, git-ignored, and copied again by `npm run dev`
  and `npm run build`. They are only fetched when someone presses Run on a Python
  program (src/lib/coding/python.worker.js), about 6MB compressed, once, and then
  cached by the browser; no other page downloads them.

  The version comes from the `pyodide` package in node_modules, so the loader
  and the WebAssembly always match.

  Run on its own with:
    node scripts/copy-pyodide.mjs
*/
import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const from = resolve(here, '..', 'node_modules', 'pyodide')
const to = resolve(here, '..', 'public', 'pyodide')

// The loader, the interpreter's glue code and WebAssembly, the standard library
// and the package index. Nothing else is needed to run plain Python.
const FILES = ['pyodide.mjs', 'pyodide.asm.mjs', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json']

if (!existsSync(from)) {
  console.error('pyodide is not installed: run `npm install` first.')
  process.exit(1)
}
mkdirSync(to, { recursive: true })

let copied = 0
for (const f of FILES) {
  const src = resolve(from, f)
  const dst = resolve(to, f)
  if (existsSync(dst) && statSync(dst).size === statSync(src).size && statSync(dst).mtimeMs >= statSync(src).mtimeMs) continue
  copyFileSync(src, dst)
  copied += 1
}
console.log(`pyodide: ${copied ? `${copied} file(s) copied to public/pyodide/` : 'up to date'}`)
