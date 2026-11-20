/*
  Revision content built FROM the notes.

  The notes are structured HTML (definitions, worked examples, determinant
  cards, tables). This reads those blocks back out, so the flashcards and MCQs
  are exactly what the notes say, and applied cases can be moved out of the
  notes into the Application method.

  It works on strings only (no DOM), so it runs in the app, at build time and
  in node scripts alike.
*/

const ENT = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&ast;': '*', '&nbsp;': ' ' }
export const text = (h) =>
  String(h || '')
    .replace(/<br\s*\/?>/g, ' ')
    .replace(/<\/(p|li|div|tr)>/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z#0-9]+;/g, (m) => ENT[m] ?? m)
    .replace(/\s+/g, ' ')
    .trim()

const DEFN = /<div class="defn"><strong>Definition: (.*?)<\/strong>(.*?)<\/div>/gs
const WORKED = /<div class="worked"><strong>Worked example\.<\/strong>\s*(.*?)<br><strong>Answer:<\/strong>\s*(.*?)<\/div>/gs
const DET = /<div class="det"><p class="det-name">(.*?)<\/p>(?:<p class="det-lead">(.*?)<\/p>)?(?:<ul>(.*?)<\/ul>)?<div class="det-eval"><strong>Why it might not hold: <\/strong>(.*?)<\/div><\/div>/gs
const TABLE = /<table><thead><tr>(.*?)<\/tr><\/thead><tbody>(.*?)<\/tbody><\/table>/gs

const lowerFirst = (s) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s)
const clip = (s, n) => (s.length <= n ? s : `${s.slice(0, n).replace(/\s+\S*$/, '')}...`)

/* A worked example that is a calculation stays in the notes; a scenario to
   analyse is an application and moves to the Application method. */
const CALC = /\b(calculate|work out|find the|how much|how many|what is the (ped|yed|xed|pes|multiplier|value)|show that|compute)\b/i
export const isApplication = (question) => !CALC.test(question)

export function splitApplication(html) {
  const apps = []
  let rest = String(html || '').replace(WORKED, (m, q, a) => {
    const question = text(q)
    if (!isApplication(question)) return m
    apps.push({ question, answer: a })
    return ''
  })
  // A heading left with nothing under it goes too.
  rest = rest.replace(/<h3>[^<]*<\/h3>(?=<h3>|$)/g, '')
  return { notes: rest, apps }
}

// 'ANALYSIS: ... EVALUATION: ...' answers split into their parts; others are one part.
export function answerParts(answerHtml) {
  const t = text(answerHtml)
  const m = t.match(/^ANALYSIS:\s*(.*?)\s*EVALUATION(?:\s*\(\d\))?:\s*(.*)$/s)
  if (m) return [{ label: 'Analysis', body: m[1] }, { label: 'Evaluation', body: m[2].replace(/\s*EVALUATION(?:\s*\(\d\))?:\s*/g, ' ') }]
  return [{ label: 'How it works', body: t }]
}
export const sentences = (s) => s.split(/(?<=[.!?])\s+(?=[A-Z0-9(])/).map((x) => x.trim()).filter(Boolean)

/* ----------------------------------------------------------- flashcards */

export function cardsFromChapter(topic, html) {
  const cards = []
  const add = (front, back) => {
    if (front && back && back.length > 8) cards.push({ front, back, topic })
  }
  for (const m of html.matchAll(DEFN)) add(`Define: ${text(m[1])}`, text(m[2]))
  for (const m of html.matchAll(WORKED)) {
    const q = text(m[1])
    if (!isApplication(q)) add(q, text(m[2]))
  }
  for (const m of html.matchAll(DET)) {
    const name = text(m[1])
    const lead = text(m[2])
    const points = [...String(m[3] || '').matchAll(/<li>(.*?)<\/li>/gs)].map((x) => text(x[1]))
    add(name.endsWith('?') ? name : `${name}: how does it work?`, [lead, ...points].filter(Boolean).join(' '))
    add(`${name.replace(/\?$/, '')}: why might it not hold?`, text(m[4]))
  }
  for (const m of html.matchAll(TABLE)) {
    const heads = [...m[1].matchAll(/<th>(.*?)<\/th>/gs)].map((x) => text(x[1]))
    const rows = [...m[2].matchAll(/<tr>(.*?)<\/tr>/gs)].map((r) => [...r[1].matchAll(/<td>(.*?)<\/td>/gs)].map((x) => text(x[1])))
    const avg = rows.flat().reduce((n, c) => n + c.length, 0) / Math.max(1, rows.flat().length)
    if (avg < 14 || heads.length < 2) continue // number grids are not cards
    rows.forEach((r) => {
      const lead = r[0]
      if (!lead || lead.length > 90) return
      for (let j = 1; j < r.length; j++) {
        if (!heads[j] || r[j].length < 14) continue
        add(`${heads[0] ? `${heads[0]} · ` : ''}${lead}: ${lowerFirst(heads[j])}?`, r[j])
      }
    })
  }
  return cards
}

/* ----------------------------------------------------------------- MCQs */

const shuffle = (a) => {
  const x = [...a]
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[x[i], x[j]] = [x[j], x[i]]
  }
  return x
}
/* Wrong answers that could pass for the right one: the other definitions that
   share the most words with it (same chapter first, on a tie), so the options
   are not three obvious outsiders. Deterministic, so a build is repeatable. */
const STOP = new Set('the a an of to in and or is are for on by with as that this it be at from which their its than into can may more'.split(' '))
const words = (s) => new Set(s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w) => w.length > 3 && !STOP.has(w)))
const closest = (pool, target, n) => {
  const tw = new Set([...words(target.term), ...words(target.def)])
  return pool
    .map((o) => {
      const ow = new Set([...words(o.term), ...words(o.def)])
      let shared = 0
      ow.forEach((w) => tw.has(w) && shared++)
      const union = tw.size + ow.size - shared
      return { o, shared, jaccard: union ? shared / union : 0, score: shared + (o.topic === target.topic ? 0.5 : 0) }
    })
    // An option that reads almost the same as the answer could be right too:
    // the question would have two defensible answers, so it is not a candidate.
    .filter((x) => x.jaccard < 0.4)
    .sort((a, b) => b.score - a.score || a.o.term.localeCompare(b.o.term))
    .slice(0, n)
    .map((x) => x.o)
}

export function mcqsFromDefinitions(defsByTopic) {
  const all = Object.entries(defsByTopic).flatMap(([topic, list]) => list.map((d) => ({ ...d, topic })))
  const out = []
  all.forEach((d) => {
    const pool = all.filter((o) => o.term !== d.term && o.def !== d.def)
    if (pool.length < 3) return
    const wrong = closest(pool, d, 3)
    if (wrong.length < 3) return
    // 1. which definition is right?
    {
      const opts = shuffle([d, ...wrong])
      out.push({
        question: `Which of the following is the definition of "${d.term}"?`,
        options: opts.map((o) => clip(o.def, 170)),
        answer: opts.indexOf(d),
        explanation: `${d.term}: ${d.def}`,
        topic: d.topic,
      })
    }
    // 2. which term does this define?
    {
      const opts = shuffle([d, ...wrong])
      out.push({
        question: `Which term is defined as: "${clip(d.def, 200)}"?`,
        options: opts.map((o) => o.term),
        answer: opts.indexOf(d),
        explanation: `${d.term}: ${d.def}`,
        topic: d.topic,
      })
    }
  })
  return out
}

/* Short, self-contained card answers become MCQs: the other answers from the
   same chapter are the wrong options, nearest in wording first. */
export function mcqsFromCards(cards, perTopic = 10) {
  const byTopic = {}
  cards.forEach((c) => {
    if (c.front.startsWith('Define:') || c.back.length < 24 || c.back.length > 190) return
    ;(byTopic[c.topic] ||= []).push(c)
  })
  const out = []
  Object.entries(byTopic).forEach(([topic, list]) => {
    if (list.length < 4) return
    const step = Math.max(1, Math.floor(list.length / perTopic))
    list
      .filter((_, i) => i % step === 0)
      .slice(0, perTopic)
      .forEach((c) => {
        const pool = list.filter((o) => o !== c && o.back !== c.back)
        const target = { term: c.front, def: c.back, topic }
        const wrong = closest(
          pool.map((o) => ({ term: o.front, def: o.back, topic, card: o })),
          target,
          3,
        )
        if (wrong.length < 3) return
        // "Firms: maximises?" says nothing out of context.
        if (c.front.replace(/^[^:?]*? · /, '').length < 30) return
        const opts = shuffle([c, ...wrong.map((w) => w.card)])
        out.push({
          // A table row's front is "Table · Row: column?"; the table name is
          // context a flashcard wants but a stand-alone question does not.
          question: c.front.replace(/^[^:?]*? · /, ''),
          options: opts.map((o) => o.back),
          answer: opts.indexOf(c),
          explanation: c.back,
          topic,
        })
      })
  })
  return out
}

export function definitionsOf(html) {
  return [...html.matchAll(DEFN)].map((m) => ({ term: text(m[1]), def: text(m[2]) })).filter((d) => d.def.length > 20)
}

/* Two cards with the same front would be ambiguous: drop exact repeats, and
   name the chapter on the rest ("Efficiency · Productive: why?" asked in
   both Oligopoly and Monopoly has a different answer in each). */
function disambiguate(cards) {
  const seen = new Set()
  const unique = cards.filter((c) => {
    const k = `${c.front}\u0000${c.back}`
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
  const count = {}
  unique.forEach((c) => (count[c.front] = (count[c.front] || 0) + 1))
  const nth = {}
  return unique.map((c) => {
    if (count[c.front] < 2) return c
    nth[c.front] = (nth[c.front] || 0) + 1
    const samePlace = unique.filter((o) => o.front === c.front && o.topic === c.topic).length > 1
    return { ...c, front: samePlace ? `${c.front} (${nth[c.front]})` : `${c.front} (${c.topic})` }
  })
}

/* One call for the whole subject: chapters is { topic: html }. */
export function deriveDeck(chapters) {
  const flashcards = []
  const defs = {}
  Object.entries(chapters).forEach(([topic, html]) => {
    flashcards.push(...cardsFromChapter(topic, html))
    const d = definitionsOf(html)
    if (d.length) defs[topic] = d
  })
  const cards = disambiguate(flashcards)
  return { flashcards: cards, mcq: [...mcqsFromDefinitions(defs), ...mcqsFromCards(cards)] }
}
