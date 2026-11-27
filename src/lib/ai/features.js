/*
  What Memoraa asks the model to do. Each feature is a function that takes the client (createAI) and plain
  text, builds one prompt, and returns clean, validated data, never raw model output. Adding a feature =
  one function here, plus a line in ./index.js.

  House rules for every prompt: British spelling, no em dashes, exam-board accuracy over friendliness,
  and never invent a mark scheme: marking only ever uses a mark scheme the caller supplies.
*/

const STYLE = 'Use British spelling and do not use em dashes.'
const text = (v) => String(v ?? '').trim()

// Flashcards about a topic -> [{ front, back }]
export async function generateFlashcards(ai, topic, count = 8) {
  const clean = text(topic)
  if (!clean) throw new Error('no-input')
  const out = await ai.chatJSON({
    system: 'You are a precise A-level revision assistant.',
    user: `Create ${count} concise, exam-accurate revision flashcards about "${clean}". Each card has a clear question or key term and a correct, self-contained answer (one to three sentences). Return exactly {"cards": [{"front": "...", "back": "..."}]}. ${STYLE}`,
    temperature: 0.6,
    maxTokens: 1600,
  })
  const cards = (Array.isArray(out?.cards) ? out.cards : [])
    .filter((c) => c && c.front && c.back)
    .map((c) => ({ front: text(c.front), back: text(c.back) }))
    .slice(0, count)
  if (!cards.length) throw new Error('empty')
  return cards
}

// Mark a student's written answer against a mark scheme the caller supplies.
// -> { awarded: 0..marks, feedback: [string], next: string }
export async function markAnswer(ai, { subject, question, markScheme, answer, marks }) {
  const total = Math.max(1, Math.floor(Number(marks) || 0))
  if (!text(question) || !text(markScheme) || !text(answer)) throw new Error('no-input')
  const out = await ai.chatJSON({
    system: `You are a strict but fair ${text(subject) || 'A-level'} examiner.`,
    user: `Question (${total} marks):\n${text(question)}\n\nMark scheme:\n${text(markScheme)}\n\nStudent answer:\n${text(answer)}\n\nAward marks only where the mark scheme allows. Return exactly {"awarded": <integer 0 to ${total}>, "feedback": ["one short point per mark gained or missed"], "next": "one concrete thing to do to improve"}. ${STYLE}`,
    temperature: 0.2,
    maxTokens: 700,
  })
  const awarded = Number.isFinite(Number(out?.awarded)) ? Math.min(total, Math.max(0, Math.round(Number(out.awarded)))) : null
  if (awarded === null) throw new Error('bad-response')
  return {
    awarded,
    feedback: (Array.isArray(out.feedback) ? out.feedback : []).map(text).filter(Boolean).slice(0, 8),
    next: text(out.next),
  }
}

// Explain why an answer was wrong, in a few plain sentences.
// -> { why: string, tip: string }
export async function explainMistake(ai, { subject, topic, question, studentAnswer, correctAnswer }) {
  if (!text(question) || !text(correctAnswer)) throw new Error('no-input')
  const out = await ai.chatJSON({
    system: `You are a patient ${text(subject) || 'A-level'} tutor.`,
    user: `Topic: ${text(topic) || 'general'}\nQuestion: ${text(question)}\nStudent answered: ${text(studentAnswer) || '(no answer)'}\nCorrect answer: ${text(correctAnswer)}\n\nExplain in at most three sentences why the student's answer is wrong and how to remember the right one. Return exactly {"why": "...", "tip": "a one-line memory hook"}. ${STYLE}`,
    temperature: 0.4,
    maxTokens: 400,
  })
  const why = text(out?.why)
  if (!why) throw new Error('empty')
  return { why, tip: text(out.tip) }
}
