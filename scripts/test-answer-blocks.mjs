// Tests for grouping answer lines into writing blocks (src/lib/answerBlocks.js), on synthetic lines and on
// real detected questions.   node --import ./scripts/resolve-ext.mjs scripts/test-answer-blocks.mjs   (also run by `npm test`)
import assert from 'node:assert/strict'
import { fieldScale, groupAreas } from '../src/lib/answerBlocks.js'
import areas from '../src/data/computer-science-answer-areas.js'

let run = 0
const test = (name, fn) => {
  try { fn(); run += 1 } catch (e) { console.error(`FAIL  ${name}\n      ${e.message.split('\n')[0]}`); process.exitCode = 1 }
}
const line = (x, dots, right = 1005, h = 56) => [x, dots - h - 2, right - x, h, 1]
const blocks = (a) => groupAreas(a).filter((b) => b.type === 'block')

test('essay lines become one block', () => {
  const b = blocks([0, 1, 2, 3, 4].map((k) => line(100, 500 + k * 80)))
  assert.equal(b.length, 1)
  assert.equal(b[0].n, 5)
  assert.equal(Math.round(b[0].pitch), 80)
})
test('a labelled line indents only the first line of its block', () => {
  const b = blocks([line(190, 400), line(100, 480), line(228, 560), line(100, 640)])
  assert.deepEqual(b.map((x) => x.n), [2, 2])
  assert.equal(b[0].indent, 90)
  assert.equal(b[0].left, 100)
})
test('a short last line (a mark label sits at its end) stays in the block', () => {
  const b = blocks([line(193, 300), line(193, 380), line(193, 460, 975)])
  assert.equal(b.length, 1)
  assert.equal(b[0].right, 1005)
})
test('a big gap starts a new block', () => {
  assert.equal(blocks([line(100, 300), line(100, 380), line(100, 900)]).length, 2)
})
test('cells stay cells and break a run', () => {
  const g = groupAreas([[100, 100, 80, 60, 0], line(100, 300), [300, 100, 80, 60, 0]])
  assert.deepEqual(g.map((x) => x.type), ['cell', 'block', 'cell'])
})
test('real question 1 (Data / Address / Control bus): three blocks of two', () => {
  assert.deepEqual(blocks(areas['1']).map((b) => b.n), [2, 2, 2])
})
test('real question 235 (eleven line essay): one block', () => {
  assert.deepEqual(blocks(areas['235']).map((b) => b.n), [11])
})
test('real question 588 (four line explanation): one block', () => {
  assert.deepEqual(blocks(areas['588']).map((b) => b.n), [4])
})
test('every real question groups without losing a line', () => {
  for (const [num, a] of Object.entries(areas)) {
    const lines = a.filter((x) => x[4] === 1).length
    const grouped = groupAreas(a).filter((x) => x.type === 'block').reduce((t, b) => t + b.n, 0)
    assert.equal(grouped, lines, `question ${num}`)
  }
})
test('iPhone zoom guard: fields are never below 16px before scaling', () => {
  assert.equal(fieldScale(32, 0), 1, 'unknown width: no scaling')
  assert.equal(fieldScale(32, 1060), 1, 'wide sheet: already 32px')
  assert.equal(fieldScale(32, 340).toFixed(3), '0.642', 'phone: 10.3px drawn as 16px x 0.642')
  assert.equal(fieldScale(40, 530), 1.25 > 1 ? 1 : 0, 'a big field on a half-size sheet is 20px: no scaling')
  for (const w of [320, 375, 414, 768, 1272]) assert.ok(fieldScale(30, w) <= 1 && fieldScale(30, w) > 0)
})
console.log(`answer blocks: ${run} tests passed`)
