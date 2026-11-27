// Tests for installability and offline support: the manifest, the icons, the install-help logic and the
// service worker generator.   node --import ./scripts/resolve-ext.mjs scripts/test-pwa.mjs   (also run by `npm test`)
import assert from 'node:assert/strict'
import { readFileSync, existsSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { platformOf, installHelpFor } from '../src/lib/pwa.js'
import { precacheList, versionOf } from './generate-sw.mjs'

let run = 0
const test = (name, fn) => {
  try { fn(); run += 1 } catch (e) { console.error(`FAIL  ${name}\n      ${e.message.split('\n')[0]}`); process.exitCode = 1 }
}
const manifest = JSON.parse(readFileSync('public/site.webmanifest', 'utf8'))
const png = (f) => { const b = readFileSync(f); return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) } }
const routes = [...readFileSync('src/App.jsx', 'utf8').matchAll(/path="([^"*:][^"]*)"/g)].map((m) => m[1])

test('manifest has what installability needs', () => {
  for (const k of ['name', 'short_name', 'start_url', 'scope', 'display', 'background_color', 'theme_color', 'icons', 'id']) assert.ok(manifest[k], k)
  assert.equal(manifest.display, 'standalone')
  assert.ok(manifest.short_name.length <= 12, 'short_name fits under an icon')
  assert.ok(manifest.start_url.startsWith(manifest.scope), 'start_url is inside scope')
})
test('icons: 192 and 512 any, plus a maskable one; files exist at the declared size', () => {
  const has = (size, purpose) => manifest.icons.some((i) => i.sizes === size && i.purpose === purpose && i.type === 'image/png')
  assert.ok(has('192x192', 'any') && has('512x512', 'any') && has('512x512', 'maskable'))
  for (const i of manifest.icons.filter((x) => x.type === 'image/png')) {
    const f = join('public', i.src)
    assert.ok(existsSync(f), `${i.src} exists`)
    const { w, h } = png(f)
    assert.equal(`${w}x${h}`, i.sizes, i.src)
  }
  assert.deepEqual(png('public/apple-touch-icon.png'), { w: 180, h: 180 })
})
test('every shortcut opens a real route with a real icon', () => {
  assert.ok(manifest.shortcuts.length >= 3 && manifest.shortcuts.length <= 4)
  for (const s of manifest.shortcuts) {
    assert.ok(routes.includes(new URL(s.url, 'https://x').pathname), s.url)
    for (const i of s.icons) assert.ok(existsSync(join('public', i.src)), i.src)
  }
  assert.ok(routes.includes(new URL(manifest.start_url, 'https://x').pathname))
})
test('index.html links the manifest, icons and iOS app tags', () => {
  const html = readFileSync('index.html', 'utf8')
  for (const needle of ['rel="manifest"', 'apple-touch-icon', 'apple-mobile-web-app-capable', 'theme-color']) assert.ok(html.includes(needle), needle)
})
test('offline page exists and is self-contained', () => {
  const html = readFileSync('public/offline.html', 'utf8')
  assert.ok(!/<link[^>]+stylesheet|<script[^>]+src=/.test(html), 'no external files')
})
test('platform detection: iPhone, iPad as a Mac, Android, Chrome, Safari on Mac', () => {
  const iphone = platformOf({ ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit Safari/604.1' })
  assert.ok(iphone.ios && iphone.safari)
  assert.ok(platformOf({ ua: 'Mozilla/5.0 (Macintosh)', platform: 'MacIntel', touchPoints: 5 }).ios, 'iPadOS')
  assert.ok(!platformOf({ ua: 'Mozilla/5.0 (Macintosh)', platform: 'MacIntel', touchPoints: 0 }).ios)
  assert.ok(platformOf({ ua: 'Mozilla/5.0 (Linux; Android 14) Chrome/120 Mobile Safari/537.36' }).android)
  assert.ok(!platformOf({ ua: 'Mozilla/5.0 (Windows NT 10.0) Chrome/120 Safari/537.36' }).safari)
})
test('install help: written steps only where there is no install button', () => {
  assert.match(installHelpFor({ ios: true }), /Add to Home Screen/)
  assert.match(installHelpFor({ mac: true, safari: true }), /Add to Dock/)
  assert.equal(installHelpFor({ android: true }), null)
  assert.equal(installHelpFor({}), null)
})
test('service worker generator: what is precached, and when the version changes', () => {
  const d = mkdtempSync(join(tmpdir(), 'dist-'))
  try {
    for (const dir of ['assets', 'dashboard', 'past-papers/computer-science', 'pyodide', 'icons']) mkdirSync(join(d, dir), { recursive: true })
    writeFileSync(join(d, 'index.html'), '<html>a</html>')
    writeFileSync(join(d, 'dashboard/index.html'), '<html>d</html>')
    writeFileSync(join(d, 'assets/app-abc.js'), 'x')
    writeFileSync(join(d, 'offline.html'), 'o')
    writeFileSync(join(d, 'sw.js'), 'old')
    writeFileSync(join(d, '404.html'), 'n')
    writeFileSync(join(d, 'past-papers/computer-science/1.webp'), 'p')
    writeFileSync(join(d, 'pyodide/py.wasm'), 'w')
    const urls = precacheList(d)
    for (const u of ['/', '/dashboard', '/dashboard/index.html', '/assets/app-abc.js', '/offline.html']) assert.ok(urls.includes(u), u)
    for (const u of urls) assert.ok(!/past-papers|pyodide|404|sw\.js/.test(u), `not precached: ${u}`)
    const v1 = versionOf(urls, d)
    assert.equal(versionOf(urls, d), v1, 'stable for the same build')
    writeFileSync(join(d, 'dashboard/index.html'), '<html>changed</html>')
    assert.notEqual(versionOf(urls, d), v1, 'a changed page makes a new version')
  } finally { rmSync(d, { recursive: true, force: true }) }
})
test('worker template has its two placeholders and valid syntax', () => {
  const t = readFileSync('scripts/sw-template.js', 'utf8')
  assert.ok(t.includes('__VERSION__') && t.includes('__PRECACHE__'))
  new Function(t.replace('__VERSION__', 'x').replace('__PRECACHE__', '[]'))
})
console.log(`pwa: ${run} tests passed`)
