// Every link in the header menus (src/constants/nav-menu.js) must go to a route that exists in
// src/App.jsx, so renaming a route cannot silently leave a dead link in the menu. Static menus and the
// public menu are checked; the links the header builds from a student's own state (their subjects, their
// last chapter) are built from the same route helpers and are covered by test-resume.mjs.
//
//   node --import ./scripts/resolve-ext.mjs scripts/test-nav-links.mjs      (also run by `npm test`)
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { APP_MENUS, APP_PLAIN, MARKETING_MENUS } from '../src/constants/nav-menu.js'

const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')
const routes = [...app.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]).filter((p) => p !== '*')
const toRegex = (p) => new RegExp(`^${p.replace(/:[^/]+/g, '[^/]+').replace(/\/$/, '')}/?$`)
const matchers = routes.map(toRegex)
const exists = (to) => matchers.some((rx) => rx.test(to.split(/[?#]/)[0]))

const links = []
for (const p of APP_PLAIN) links.push({ where: `plain "${p.label}"`, to: p.to })
for (const m of [...APP_MENUS, ...MARKETING_MENUS]) {
  for (const c of m.columns) for (const l of c.links) links.push({ where: `${m.id} > ${c.title} > "${l.label}"`, to: l.to })
  for (const c of m.cards) links.push({ where: `${m.id} > card "${c.title}"`, to: c.to })
}

let failed = 0
for (const { where, to } of links) {
  try {
    assert.ok(exists(to), `${where} links to ${to}, which is not a route in App.jsx`)
  } catch (e) {
    console.error(`FAIL  ${e.message}`)
    failed += 1
  }
}
// no em dashes in menu copy (house style, AGENTS.md)
const copy = JSON.stringify([APP_MENUS, MARKETING_MENUS])
if (copy.includes('—')) {
  console.error('FAIL  menu copy contains an em dash (house style: use a hyphen or rewrite)')
  failed += 1
}
if (failed) process.exit(1)
console.log(`nav links: ${links.length} links all go to real routes (${routes.length} routes known)`)
