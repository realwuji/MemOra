// Tests for the natural question order (src/lib/questionOrder.js), and a check of it against the
// real Computer Science and Maths questions. Plain node:assert, no test framework needed.
//
//   node scripts/test-question-order.mjs      (also run by `npm test`)
import assert from 'node:assert/strict'
import { compareInPaper, compareShortestFirst, parseRef, sittingRank, paperRank } from '../src/lib/questionOrder.js'
import cs from '../src/data/computer-science-past-papers.js'
import maths from '../src/data/maths-past-papers.js'

let run = 0
const test = (name, fn) => {
  try {
    fn()
    run += 1
  } catch (e) {
    console.error(`FAIL  ${name}\n      ${e.message.split('\n')[0]}`)
    process.exitCode = 1
  }
}
const q = (ref, extra = {}) => ({ set: 'June 2019', paper: 'Paper 1', q: ref, num: '1', marks: 1, ...extra })
const order = (refs) => refs.map((r) => q(r)).sort(compareInPaper).map((x) => x.q)

test('parts read a before b before c', () => {
  assert.deepEqual(order(['3(c)', '3(a)', '3(b)']), ['3(a)', '3(b)', '3(c)'])
})
test('sub-parts read i before ii before iii, and iv after iii', () => {
  assert.deepEqual(order(['2(b)(iv)', '2(b)(ii)', '2(b)(i)', '2(b)(iii)']), ['2(b)(i)', '2(b)(ii)', '2(b)(iii)', '2(b)(iv)'])
})
test('a whole question comes before its parts, and questions are numeric (2 before 10)', () => {
  assert.deepEqual(order(['10(a)', '2(b)', '2', '2(a)', '1(c)']), ['1(c)', '2', '2(a)', '2(b)', '10(a)'])
})
test('(i) after (h) as a LETTER, but before (ii) as a roman numeral', () => {
  assert.deepEqual(order(['4(i)', '4(h)', '4(a)']), ['4(a)', '4(h)', '4(i)'])
  assert.deepEqual(order(['4(a)(ii)', '4(a)(i)']), ['4(a)(i)', '4(a)(ii)'])
})
test('parts of one question stay together between sub-parts of its neighbours', () => {
  assert.deepEqual(order(['2(a)', '1(b)(ii)', '1(a)', '1(b)(i)']), ['1(a)', '1(b)(i)', '1(b)(ii)', '2(a)'])
})
test('sittings run newest first; November is later than June', () => {
  const a = q('1', { set: 'June 2019' })
  const b = q('1', { set: 'November 2020' })
  const c = q('1', { set: 'June 2025' })
  assert.deepEqual([a, b, c].sort(compareInPaper).map((x) => x.set), ['June 2025', 'November 2020', 'June 2019'])
  assert.ok(sittingRank('November 2020') < sittingRank('June 2020'))
})
test('mock sets come after the real sittings, in order', () => {
  const sets = ['Mock Set 2', 'June 2018', 'Mock Set 1', 'June 2025']
  assert.deepEqual(sets.map((s) => q('1', { set: s })).sort(compareInPaper).map((x) => x.set), ['June 2025', 'June 2018', 'Mock Set 1', 'Mock Set 2'])
})
test('A-level papers before AS ones, and Paper 1 before Paper 2', () => {
  const papers = ['AS Paper 1', 'Paper 2', 'AS Paper 2', 'Paper 1']
  assert.deepEqual(papers.map((p) => q('1', { paper: p })).sort(compareInPaper).map((x) => x.paper), ['Paper 1', 'Paper 2', 'AS Paper 1', 'AS Paper 2'])
  assert.ok(paperRank('Pure 1') < paperRank('Pure 2'))
  assert.ok(paperRank('Pure 2') < paperRank('Statistics'))
  assert.ok(paperRank('Statistics') < paperRank('Mechanics'))
  assert.ok(paperRank('Mechanics') < paperRank('AS Pure'))
})
test('shortest first keeps ties in paper order', () => {
  const xs = [q('2(b)', { marks: 3 }), q('2(a)', { marks: 3 }), q('1(a)', { marks: 6 }), q('9', { marks: 1 })]
  assert.deepEqual(xs.sort(compareShortestFirst).map((x) => x.q), ['9', '2(a)', '2(b)', '1(a)'])
})
test('parseRef handles the shapes in both indexes', () => {
  assert.deepEqual(parseRef('7(d)(ii)'), { n: 7, part: 'd', sub: 2 })
  assert.deepEqual(parseRef('12'), { n: 12, part: '', sub: 0 })
  assert.deepEqual(parseRef('3(b)'), { n: 3, part: 'b', sub: 0 })
})

// The same rules on the real data: every part of a question is adjacent and in order.
const realRows = {
  'Computer Science': cs,
  Maths: maths.rows.map(([num, s, p, qq, marks]) => ({ num: String(num), set: maths.sets[s], paper: maths.papers[p], q: qq, marks })),
}
for (const [subject, rows] of Object.entries(realRows)) {
  test(`${subject}: sorting the real questions never splits a question, and a precedes b`, () => {
    const sorted = [...rows].sort(compareInPaper)
    const seen = new Set()
    let last = null
    for (const r of sorted) {
      const key = `${r.set}|${r.paper}|${parseRef(r.q).n}`
      if (key !== last) {
        assert.ok(!seen.has(key), `question ${key} appears in two separate runs`)
        seen.add(key)
        last = key
      }
    }
    // inside a question, the order of (part, sub) never goes backwards
    for (let i = 1; i < sorted.length; i += 1) {
      const a = sorted[i - 1]
      const b = sorted[i]
      if (a.set === b.set && a.paper === b.paper && parseRef(a.q).n === parseRef(b.q).n) {
        const pa = parseRef(a.q)
        const pb = parseRef(b.q)
        assert.ok(pa.part.length < pb.part.length || pa.part < pb.part || (pa.part === pb.part && pa.sub <= pb.sub), `${a.q} should not come before ${b.q}`)
      }
    }
  })
}

console.log(`question order: ${run} tests passed${process.exitCode ? ' (some failed)' : ''}`)
