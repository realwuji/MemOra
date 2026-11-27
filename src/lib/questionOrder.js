/*
  The natural order of exam questions, the way a student would read a paper:

    sitting (newest first)  >  paper  >  question number  >  part (a), (b), (c)  >  sub-part (i), (ii), (iii)

  So Question 3(a) comes before 3(b), which comes before 3(c)(i) and 3(c)(ii), and question 3 as a
  whole (no part) comes before all of them. The parts of one question stay together, which matters
  because they share a scenario printed in each image.

  Used by the exam question list (components/ui/PastPaperChapter.jsx) and tested by
  scripts/test-question-order.mjs. Works for both subjects: Maths ("June 2025", "Mock Set 2", papers
  such as "Pure 1" and "AS Statistics") and Computer Science ("November 2020", "AS Paper 2").

  A question is { set, paper, q, num }. Nothing here changes the questions; it only compares them.
*/

const MONTH = { january: 1, february: 2, march: 3, april: 4, may: 5, june: 6, july: 7, august: 8, september: 9, october: 10, november: 11, december: 12 }

// Newest sitting first. Real sittings by date; "Mock Set N" after them, in order.
export function sittingRank(set = '') {
  const real = /^([A-Za-z]+)\s+(\d{4})$/.exec(set.trim())
  if (real) return -(Number(real[2]) * 12 + (MONTH[real[1].toLowerCase()] || 0))
  const mock = /(\d+)\s*$/.exec(set)
  return 1e6 + (mock ? Number(mock[1]) : 0)
}

// A-level papers before the AS ones, then in the order the specification lists them.
const PAPER_ORDER = ['pure', 'statistics and mechanics', 'statistics', 'mechanics']
export function paperRank(paper = '') {
  const isAs = /^as\b/i.test(paper)
  const rest = paper.replace(/^as\s+/i, '').trim().toLowerCase()
  const n = /(\d+)\s*$/.exec(rest)
  const name = rest.replace(/\s*\d+\s*$/, '').trim()
  const at = PAPER_ORDER.indexOf(name)
  return (isAs ? 1000 : 0) + (at >= 0 ? at * 10 : name === 'paper' || name === '' ? 0 : 50) + (n ? Number(n[1]) : 0)
}

const ROMAN = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8, ix: 9, x: 10, xi: 11, xii: 12 }

/*
  "7(d)(ii)" -> { n: 7, part: 'd', sub: 2 }. The first bracket is a letter and the second a roman
  numeral, so a lone "(i)" in the first position is the letter i (it follows (h)), not the number one.
*/
export function parseRef(q) {
  const m = /^\s*(\d+)\s*(?:\(\s*([a-z]+)\s*\))?\s*(?:\(\s*([a-z]+)\s*\))?/i.exec(String(q))
  if (!m) return { n: Number.POSITIVE_INFINITY, part: '', sub: 0 }
  return { n: Number(m[1]), part: (m[2] || '').toLowerCase(), sub: m[3] ? ROMAN[m[3].toLowerCase()] || 99 : 0 }
}

const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0)

// Question 3 (no part) < 3(a) < 3(b)(i) < 3(b)(ii) < 3(c) < 4
export function compareInPaper(a, b) {
  const ra = parseRef(a.q)
  const rb = parseRef(b.q)
  return (
    cmp(sittingRank(a.set), sittingRank(b.set)) ||
    cmp(paperRank(a.paper), paperRank(b.paper)) ||
    cmp(ra.n, rb.n) ||
    cmp(ra.part.length, rb.part.length) ||
    cmp(ra.part, rb.part) ||
    cmp(ra.sub, rb.sub) ||
    cmp(Number(a.num), Number(b.num))
  )
}

// The other order the list offers: the quick marks first, then longer ones, still tidy inside a tie.
export function compareShortestFirst(a, b) {
  return a.marks - b.marks || compareInPaper(a, b)
}
