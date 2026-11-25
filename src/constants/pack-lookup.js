/*
  Pure helpers over a list of revision packs. They work on a full pack (with
  its flashcards, questions and notes) and on the light entry for it in
  pack-manifest.js (outline and counts only), so the same code serves
  library.js (scripts, full packs) and packs.js (the app, light packs).
*/

// Match a free-text subject name (e.g. "Maths", "Computer Science") to a pack.
// Exact id/name matches win before looser "contains" matches.
const normName = (x) => String(x).toLowerCase().replace(/[^a-z]/g, '')

export const makeLookup = (list) => ({
  getPack: (id) => list.find((p) => p.id === id),
  getPackByName: (name) => {
    if (!name) return null
    const s = normName(name)
    if (!s) return null
    return (
      list.find((p) => normName(p.id) === s || normName(p.name) === s) ||
      list.find(
        (p) =>
          s.includes(normName(p.id)) ||
          normName(p.name).includes(s) ||
          s.includes(normName(p.name)),
      ) ||
      null
    )
  },
})

/*
  Derives an AS/A2 (Year 1/Year 2) level per topic from the pack's own
  `groups` outline, where the curriculum actually splits that way - Maths
  labels its subgroups "Year 1 (AS)" / "Year 2 (A2)"; Economics' AS themes
  are Theme 1-2, A2 adds Theme 3-4. A subject without a real AS/A2 split
  (Computer Science's OCR H446 is one linear two-year course, not a
  decoupled AS + A2) returns an empty map, so nothing gets filtered out for
  a Year 12 student there - there is no "AS-only" subset to fall back to.
*/
export function topicLevelMap(pack) {
  const map = {}
  if (!pack?.groups) return map
  for (const group of pack.groups) {
    const groupLevel = /^Theme (1|2)\b/.test(group.label)
      ? 'AS'
      : /^Theme (3|4)\b/.test(group.label)
        ? 'A2'
        : null
    for (const sub of group.subgroups || []) {
      const subLevel = /\(AS\)/.test(sub.label) ? 'AS' : /\(A2\)/.test(sub.label) ? 'A2' : groupLevel
      if (!subLevel) continue
      for (const topic of sub.topics || []) map[topic] = subLevel
    }
  }
  return map
}

/*
  How much of each kind of content a pack holds. The launchers (Start, the
  dashboard cards) only ever need these numbers, never the content itself, so
  the manifest carries them and the heavy pack is not loaded to show them.

    flashcards, mcq, examQuestions, essayBank  number of items
    notes                                      number of chapters with notes
    applicationItems                           applied cases + real cases
    applicationTopics                          topics that have either
    applicationKeys                            topic keys in applications + realCases
    diagramRevision                            true if the diagram methods exist
    pastPapers                                 true if the pack has the past papers browser
*/
export function computeCounts(pack) {
  const len = (x) => (Array.isArray(x) ? x.length : 0)
  const keys = (x) => Object.keys(x || {})
  const items = (m) => Object.values(m || {}).reduce((t, l) => t + (Array.isArray(l) ? l.length : 0), 0)
  return {
    flashcards: len(pack.flashcards),
    mcq: len(pack.mcq),
    examQuestions: len(pack.examQuestions),
    essayBank: len(pack.essayBank),
    notes: keys(pack.notes).length,
    applicationItems: items(pack.applications) + items(pack.realCases),
    applicationTopics: new Set([...keys(pack.applications), ...keys(pack.realCases)]).size,
    applicationKeys: keys(pack.applications).length + keys(pack.realCases).length,
    diagramRevision: Boolean(pack.diagramRevision),
    pastPapers: Boolean(pack.pastPapers),
  }
}

// Counts for a light pack (precomputed) or a full one (computed on the spot).
export const countsOf = (pack) => (pack ? pack.counts || computeCounts(pack) : null)
