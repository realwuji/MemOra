// Fails the build when the Computer Science past-paper index and the images on disk disagree.
//
// Every row in src/data/computer-science-past-papers.js must have:
//   - a question image   public/past-papers/computer-science/<num>.webp
//   - a mark scheme      public/past-papers/computer-science/ms/<num>.webp
//   - when it has an examiner's report (erFile set), that file  .../er/<erFile>.webp
// and sane numbers (marks and image heights are positive). It must also have a `topic` that is one of
// the Computer Science pack's chapters (the names the notes and the chapter picker use), and every
// chapter must have at least one question, so the picker never shows an empty chapter. A bad or
// partial conversion (see examconversion.md) is caught here instead of showing a broken image or a
// missing chapter to a student.
//
// Run on its own with:  npm run check:past-papers
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import rows from '../src/data/computer-science-past-papers.js'
import { PACK_MANIFEST as manifest } from '../src/constants/pack-manifest.js'
import answerAreas from '../src/data/computer-science-answer-areas.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const base = join(root, 'public', 'past-papers', 'computer-science')

const pack = manifest.find((p) => p.name === 'Computer Science' || p.id === 'computer-science')
const chapters = pack?.topics || []
const problems = []
if (!chapters.length) problems.push('could not read the Computer Science chapters from src/constants/pack-manifest.js')
const perChapter = new Map(chapters.map((c) => [c, 0]))
const seen = new Set()
for (const r of rows) {
  const id = `#${r.num} (${r.set} ${r.paper} ${r.q})`
  if (seen.has(r.num)) problems.push(`${id}: duplicate number`)
  seen.add(r.num)
  if (!existsSync(join(base, `${r.num}.webp`))) problems.push(`${id}: missing question image ${r.num}.webp`)
  if (!existsSync(join(base, 'ms', `${r.num}.webp`))) problems.push(`${id}: missing mark scheme ms/${r.num}.webp`)
  if (r.erFile && !existsSync(join(base, 'er', `${r.erFile}.webp`))) problems.push(`${id}: missing examiner's report er/${r.erFile}.webp`)
  if (!r.topic) problems.push(`${id}: no topic`)
  else if (!perChapter.has(r.topic)) problems.push(`${id}: topic "${r.topic}" is not a Computer Science chapter`)
  else perChapter.set(r.topic, perChapter.get(r.topic) + 1)
  if (!(r.marks > 0)) problems.push(`${id}: marks should be positive, got ${r.marks}`)
  if (!(r.h > 0)) problems.push(`${id}: question image height should be positive, got ${r.h}`)
  if (!(r.msH > 0)) problems.push(`${id}: mark scheme height should be positive, got ${r.msH}`)
  if (r.erFile && !(r.erH > 0)) problems.push(`${id}: examiner's report height should be positive, got ${r.erH}`)
}

// Answer areas (where a student can type on the image, scripts/pastpapers/detect_answer_areas.py): every key
// must be a real question, and every area four per-mille numbers inside the image plus a kind of 0 or 1.
for (const [num, list] of Object.entries(answerAreas)) {
  if (!seen.has(num)) problems.push(`answer areas: #${num} is not a question in the index`)
  for (const a of list) {
    const [x, y, w, h, k] = a
    const ok = a.length === 5 && [x, y, w, h].every(Number.isFinite) && x >= 0 && y >= 0 && w > 0 && h > 0 && x + w <= 1005 && y + h <= 1005 && (k === 0 || k === 1)
    if (!ok) {
      problems.push(`answer areas: #${num} has a bad area ${JSON.stringify(a)}`)
      break
    }
  }
}
for (const [chapter, n] of perChapter) if (chapters.length && n === 0) problems.push(`chapter "${chapter}" has no questions`)

if (problems.length) {
  console.error(`Computer Science past papers: ${problems.length} problem${problems.length === 1 ? '' : 's'}`)
  for (const p of problems.slice(0, 40)) console.error(`  - ${p}`)
  if (problems.length > 40) console.error(`  ...and ${problems.length - 40} more`)
  process.exit(1)
}
console.log(`Computer Science past papers: ${rows.length} rows, all images present, all ${chapters.length} chapters have questions, ${Object.keys(answerAreas).length} with typing areas`)
