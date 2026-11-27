// Tests for "continue where you left off" (src/lib/resume.js): the single definition the dashboard and
// the header share. Plain node:assert.
//
//   node --import ./scripts/resolve-ext.mjs scripts/test-resume.mjs      (also run by `npm test`)
import assert from 'node:assert/strict'
import { lastResumable, pickResume, relativeDay, resumePath, subjectNamesOf } from '../src/lib/resume.js'

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
const DAY = 86400000
const now = Date.now()
const sess = (subject, topic, technique, ago = 0) => ({ subject, topic, technique, ts: now - ago })

test('a chaptered session beats a newer whole-subject one', () => {
  const sessions = [sess('Maths', null, 'notes', 0), sess('Maths', 'Quadratics', 'flashcards', DAY)]
  assert.equal(lastResumable(sessions).topic, 'Quadratics')
})
test('with only whole-subject sessions, the newest is used', () => {
  assert.equal(lastResumable([sess('Maths', null, 'notes', 0), sess('Economics', null, 'mcq', DAY)]).subject, 'Maths')
})
test('no sessions means nothing to continue', () => {
  assert.equal(lastResumable([]), null)
  assert.equal(pickResume({ sessions: [], lastVisit: null, subjectNames: ['Maths'] }), null)
})
test('the last screen opened wins when it is newer than the last finished session', () => {
  const lastVisit = sess('Computer Science', 'Databases', 'exam-questions', 1000)
  const sessions = [sess('Maths', 'Quadratics', 'notes', DAY)]
  assert.equal(pickResume({ sessions, lastVisit, subjectNames: ['Maths', 'Computer Science'] }).topic, 'Databases')
})
test('a finished session wins when it is newer than the last screen opened', () => {
  const lastVisit = sess('Computer Science', 'Databases', 'exam-questions', DAY)
  const sessions = [sess('Maths', 'Quadratics', 'notes', 1000)]
  assert.equal(pickResume({ sessions, lastVisit, subjectNames: ['Maths', 'Computer Science'] }).topic, 'Quadratics')
})
test('a subject the student no longer studies is never offered', () => {
  const lastVisit = sess('Physics', 'Waves', 'notes', 0)
  assert.equal(pickResume({ sessions: [], lastVisit, subjectNames: ['Maths'] }), null)
})
test('Continue opens the exact chapter and technique', () => {
  assert.equal(
    resumePath(sess('Computer Science', 'Structure and Function of the Processor', 'exam-questions')),
    '/study/computer-science/exam-questions?chapter=Structure+and+Function+of+the+Processor',
  )
})
test('a whole-subject session opens the subject and method, with no chapter', () => {
  assert.equal(resumePath(sess('Economics', null, 'mcq')), '/study/economics/mcq')
})
test('a session with no technique falls back to notes', () => {
  assert.equal(resumePath({ subject: 'Maths', topic: null }), '/study/maths/notes')
})
test('Maths has no multiple choice, so a resumed MCQ opens flashcards', () => {
  assert.equal(resumePath(sess('Maths', 'Quadratics', 'mcq')), '/study/maths/flashcards?chapter=Quadratics')
})
test('relativeDay reads as a sentence', () => {
  assert.equal(relativeDay(now), 'today')
  assert.equal(relativeDay(now - DAY), 'yesterday')
  assert.equal(relativeDay(now - 3 * DAY), '3 days ago')
})
test('a university course replaces the school subjects', () => {
  assert.deepEqual(subjectNamesOf({ courseType: 'University', courseName: 'Law', subjects: [{ name: 'Maths' }] }), ['Law'])
  assert.deepEqual(subjectNamesOf({ courseType: 'A-level', subjects: [{ name: 'Maths' }, { name: 'Economics' }] }), ['Maths', 'Economics'])
})

console.log(`resume: ${run} tests passed${process.exitCode ? ' (some failed)' : ''}`)
