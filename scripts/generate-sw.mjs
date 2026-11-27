/*
  Writes dist/sw.js from scripts/sw-template.js, after `vite build` and the prerender. It lists what to
  precache (see sw-template.js for the strategy) and stamps a version made from the content of that list, so
  the worker changes exactly when the shipped app changes, and the "update available" prompt appears then.

    node scripts/generate-sw.mjs        (run by `npm run build`)
*/
import { createHash } from 'node:crypto'
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const DIST = 'dist'
// Large or rarely needed: cached on first use instead (past papers, pyodide), or not at all (SEO files).
const SKIP_DIRS = new Set(['past-papers', 'pyodide', 'hero', 'og'])
const SKIP_FILES = new Set(['sw.js', '404.html', 'robots.txt', 'sitemap.xml', 'llms.txt', 'essay-plans.txt', 'og-memora.png'])

const walk = (dir, root) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) return SKIP_DIRS.has(name) && dir === root ? [] : walk(p, root)
    return [p]
  })

export function precacheList(dist = DIST) {
  const urls = []
  for (const file of walk(dist, dist)) {
    const rel = relative(dist, file).split(sep).join('/')
    if (SKIP_FILES.has(rel)) continue
    if (rel === 'index.html') urls.push('/')
    else if (rel.endsWith('/index.html')) urls.push(`/${rel.slice(0, -'/index.html'.length)}`, `/${rel}`)
    else urls.push(`/${rel}`)
  }
  return [...new Set(urls)].sort()
}

export function versionOf(urls, dist = DIST) {
  const h = createHash('sha1')
  for (const u of urls) {
    h.update(u)
    // Hashed assets already change name with their content; pages and unhashed files are read.
    if (!u.startsWith('/assets/')) {
      const f = u === '/' ? 'index.html' : u.slice(1)
      try {
        const p = join(dist, f)
        if (statSync(p).isFile()) h.update(readFileSync(p))
      } catch {
        /* a route without a file of its own */
      }
    }
  }
  return h.digest('hex').slice(0, 12)
}

if (process.argv[1] && process.argv[1].endsWith('generate-sw.mjs')) {
  const urls = precacheList()
  const version = versionOf(urls)
  const sw = readFileSync('scripts/sw-template.js', 'utf8').replace('__VERSION__', version).replace('__PRECACHE__', JSON.stringify(urls, null, 2))
  writeFileSync(join(DIST, 'sw.js'), sw)
  console.log(`service worker ${version}: precaching ${urls.length} files`)
}
