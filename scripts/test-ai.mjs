// Tests for the AI layer (src/lib/ai): config, errors, parsing and each feature, with a fake fetch so no
// key and no network are needed.   node --import ./scripts/resolve-ext.mjs scripts/test-ai.mjs   (also run by `npm test`)
import assert from 'node:assert/strict'
import { createAI, parseJSON, MISTRAL_ENDPOINT, DEFAULT_MODEL } from '../src/lib/ai/client.js'
import { generateFlashcards, markAnswer, explainMistake } from '../src/lib/ai/features.js'

let run = 0
const test = async (name, fn) => {
  try {
    await fn()
    run += 1
  } catch (e) {
    console.error(`FAIL  ${name}\n      ${e.message.split('\n')[0]}`)
    process.exitCode = 1
  }
}
const reply = (content, status = 200) => async () => ({ ok: status < 400, status, json: async () => ({ choices: [{ message: { content: JSON.stringify(content) } }] }) })
const ai = (fetchImpl, env = { VITE_MISTRAL_API_KEY: 'k' }) => createAI({ env, fetchImpl })
const code = async (p) => { try { await p } catch (e) { return e.message } return 'resolved' }

await test('not configured without a key or proxy', async () => {
  assert.equal(ai(reply({}), {}).configured(), false)
  assert.equal(await code(generateFlashcards(ai(reply({}), {}), 'x')), 'no-key')
})
await test('proxy counts as configured and sends no key', async () => {
  let seen
  const c = ai(async (u, o) => { seen = { u, o }; return reply({ cards: [{ front: 'a', back: 'b' }] })() }, { VITE_AI_PROXY_URL: 'https://p.example/ai' })
  assert.equal(c.configured(), true)
  await generateFlashcards(c, 'x')
  assert.equal(seen.u, 'https://p.example/ai')
  assert.equal(seen.o.headers.Authorization, undefined)
})
await test('direct call hits Mistral with the key and default model', async () => {
  let seen
  await generateFlashcards(ai(async (u, o) => { seen = { u, o }; return reply({ cards: [{ front: 'a', back: 'b' }] })() }), 'x')
  assert.equal(seen.u, MISTRAL_ENDPOINT)
  assert.equal(seen.o.headers.Authorization, 'Bearer k')
  assert.equal(JSON.parse(seen.o.body).model, DEFAULT_MODEL)
})
await test('error codes: quota, http, network, timeout, bad response', async () => {
  assert.equal(await code(generateFlashcards(ai(reply({}, 429)), 'x')), 'quota')
  assert.equal(await code(generateFlashcards(ai(reply({}, 500)), 'x')), 'http-500')
  assert.equal(await code(generateFlashcards(ai(async () => { throw new Error('boom') }), 'x')), 'network')
  assert.equal(await code(generateFlashcards(ai(async () => { const e = new Error('a'); e.name = 'AbortError'; throw e }), 'x')), 'timeout')
  assert.equal(await code(generateFlashcards(ai(async () => ({ ok: true, status: 200, json: async () => ({ choices: [{ message: { content: 'not json' } }] }) })), 'x')), 'bad-response')
})
await test('parseJSON accepts a code fence', () => assert.deepEqual(parseJSON('```json\n{"a":1}\n```'), { a: 1 }))
await test('flashcards: cleans, trims, caps and rejects empty', async () => {
  const cards = await generateFlashcards(ai(reply({ cards: [{ front: ' q1 ', back: ' a1 ' }, { front: 'q2' }, { front: 'q3', back: 'a3' }, { front: 'q4', back: 'a4' }] })), 'x', 2)
  assert.deepEqual(cards, [{ front: 'q1', back: 'a1' }, { front: 'q3', back: 'a3' }])
  assert.equal(await code(generateFlashcards(ai(reply({ cards: [] })), 'x')), 'empty')
  assert.equal(await code(generateFlashcards(ai(reply({})), '  ')), 'no-input')
})
await test('markAnswer: clamps to the marks, needs all inputs', async () => {
  const input = { question: 'q', markScheme: 'ms', answer: 'a', marks: 3 }
  assert.deepEqual(await markAnswer(ai(reply({ awarded: 9, feedback: ['x', ''], next: ' go ' })), input), { awarded: 3, feedback: ['x'], next: 'go' })
  assert.equal((await markAnswer(ai(reply({ awarded: -2 })), input)).awarded, 0)
  assert.equal(await code(markAnswer(ai(reply({ awarded: 'lots' })), input)), 'bad-response')
  assert.equal(await code(markAnswer(ai(reply({})), { ...input, markScheme: '' })), 'no-input')
})
await test('explainMistake: needs a question and the right answer', async () => {
  assert.deepEqual(await explainMistake(ai(reply({ why: ' because ', tip: 't' })), { question: 'q', correctAnswer: 'c' }), { why: 'because', tip: 't' })
  assert.equal(await code(explainMistake(ai(reply({ why: '' })), { question: 'q', correctAnswer: 'c' })), 'empty')
  assert.equal(await code(explainMistake(ai(reply({})), { question: '', correctAnswer: 'c' })), 'no-input')
})
console.log(`ai: ${run} tests passed`)
