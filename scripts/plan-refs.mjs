/*
  References into the Economics notes, for building essay plans.

    D(chapter, card)       a determinant card: its lead and points become the
                           steps of an analysis chain
    E(chapter, card)       the same card's "why it might not hold": the steps
                           of an evaluation chain
    S(chapter, heading)    the first list under a heading in a chapter

  Each takes an options object: { t: 'title', d: [diagram ids], n: max steps }.
  Matching is by case-insensitive substring and fails loudly (see `errors`), so
  a plan can never silently point at nothing.
*/
import { getPackByName } from '../src/constants/library.js'
import { text } from '../src/lib/notesDeck.js'

const notes = getPackByName('Economics').notes
const DET = /<div class="det"><p class="det-name">(.*?)<\/p>(?:<p class="det-lead">(.*?)<\/p>)?(?:<ul>(.*?)<\/ul>)?<div class="det-eval"><strong>Why it might not hold: <\/strong>(.*?)<\/div><\/div>/gs

export const errors = []
export const touched = [] // chapters read while building the current plan

const chapterKey = (name) => {
  const keys = Object.keys(notes)
  const key = keys.find((k) => k.toLowerCase() === name.toLowerCase()) || keys.find((k) => k.toLowerCase().includes(name.toLowerCase()))
  if (!key) errors.push(`no chapter "${name}"`)
  return key
}

const cardsOf = (ch) =>
  [...(notes[ch] || '').matchAll(DET)].map((m) => ({
    name: text(m[1]),
    lead: text(m[2]),
    points: [...String(m[3] || '').matchAll(/<li>(.*?)<\/li>/gs)].map((x) => text(x[1])),
    eval: text(m[4]),
  }))

const findCard = (ch, card, at = 0) => {
  const hit = cardsOf(ch).filter((c) => c.name.toLowerCase().includes(card.toLowerCase()))[at]
  if (!hit) errors.push(`no card "${card}" in ${ch}`)
  return hit
}

const sentences = (s) => s.split(/(?<=[.!?])\s+(?=[A-Z0-9(])/).map((x) => x.trim()).filter(Boolean)

// A step that runs on is cut at a sentence end; the notes' meaning stays whole.
const clip = (s, max = 260) => {
  if (s.length <= max) return s
  let out = ''
  for (const x of sentences(s)) {
    if (out && (out + ' ' + x).trim().length > max) break
    out = (out + ' ' + x).trim()
  }
  return out
}

const shortTitle = (name) => {
  const n = name.replace(/\s+/g, ' ')
  return n.length <= 60 ? n : n.slice(0, 60).replace(/\s+\S*$/, '')
}

const chain = (name, steps, o = {}) => ({
  title: o.t || shortTitle(name),
  steps: steps.slice(0, o.n || 5).map((x) => clip(x)),
  ...(o.d ? { d: { ids: o.d, ...(o.hover ? { hover: o.hover } : {}) } } : {}),
})

export const D = (ch, card, o) => () => {
  const key = chapterKey(ch)
  const c = key && findCard(key, card, o?.at)
  if (!c) return null
  touched.push(key)
  return chain(c.name, [c.lead, ...c.points].filter(Boolean), o)
}

export const E = (ch, card, o) => () => {
  const key = chapterKey(ch)
  const c = key && findCard(key, card, o?.at)
  if (!c) return null
  touched.push(key)
  return chain(c.name, sentences(c.eval), { ...o, t: o?.t || `Why it may not hold: ${shortTitle(c.name)}` })
}

export const S = (ch, heading, o) => () => {
  const key = chapterKey(ch)
  if (!key) return null
  const sec = notes[key].split('<h3>').slice(1).find((p) => p.split('</h3>')[0].toLowerCase().includes(heading.toLowerCase()))
  if (!sec) {
    errors.push(`no heading "${heading}" in ${key}`)
    return null
  }
  const list = sec.match(/<(ul|ol)>(.*?)<\/\1>/s)
  const items = list ? [...list[2].matchAll(/<li>(.*?)<\/li>/gs)].map((x) => text(x[1])) : sentences(text(sec.split('</h3>')[1] || ''))
  if (!items.length) errors.push(`empty section "${heading}" in ${key}`)
  touched.push(key)
  return chain(text(sec.split('</h3>')[0]), items, o)
}

// Listing helpers for authoring specs.
export const headings = (ch) => (notes[chapterKey(ch)] || '').split('<h3>').slice(1).map((p) => text(p.split('</h3>')[0]))
export const cardNames = (ch) => cardsOf(chapterKey(ch)).map((c) => c.name)
