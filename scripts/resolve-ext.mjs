/*
  Lets plain node resolve the app's extensionless imports.

  Source files are written for Vite, which fills in ".js" itself. Node's ESM
  resolver does not, so a script that imports src/ directly needs this hook:

    node --import ./scripts/resolve-ext.mjs scripts/<script>.mjs
*/
import { register } from 'node:module'
import { existsSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'

const SRC = new URL('../src/', import.meta.url)

export function resolve(specifier, context, next) {
  // The app's "@/" alias points at src/ (see vite.config.js), so scripts can import app code the same way.
  if (specifier.startsWith('@/')) {
    const base = new URL(specifier.slice(2), SRC)
    for (const ext of ['', '.js', '.jsx', '/index.js', '/index.jsx']) {
      const candidate = new URL(base.href + ext)
      if (existsSync(fileURLToPath(candidate)) && !fileURLToPath(candidate).endsWith('/')) {
        if (/\.[a-z]+$/i.test(candidate.pathname)) return next(candidate.href, context)
      }
    }
  }
  if (specifier.startsWith('.') && !/\.[a-z]+$/i.test(specifier)) {
    const base = new URL(specifier, context.parentURL)
    for (const ext of ['.js', '.jsx', '/index.js', '/index.jsx']) {
      if (existsSync(fileURLToPath(new URL(base.href + ext)))) return next(specifier + ext, context)
    }
  }
  return next(specifier, context)
}

register(pathToFileURL(fileURLToPath(import.meta.url)))
