/*
  Drop repeats within a chapter, keeping the first occurrence.

  Content arrives in batches written at different times, so the same
  flashcard or question can be phrased twice for one chapter - a student
  then meets it twice in a single session, which reads like a bug. Keyed on
  "topic + text", so the SAME fact appearing under TWO chapters is kept:
  that is deliberate (the national debt belongs to both Fiscal Policy and
  The National Debt, and whichever chapter you revise should include it).

  Applied at assembly rather than by editing the data, so a future batch
  cannot silently reintroduce a duplicate.
*/
const dedupeByTopic = (items, key) => {
  if (!Array.isArray(items)) return items
  const seen = new Set()
  return items.filter((x) => {
    const id = `${x.topic ?? ''}␟${x[key] ?? ''}`
    if (seen.has(id)) return false
    seen.add(id)
    return true
  })
}

export const dedupeContent = (pack) => ({
  ...pack,
  flashcards: dedupeByTopic(pack.flashcards, 'front'),
  mcq: dedupeByTopic(pack.mcq, 'question'),
  examQuestions: dedupeByTopic(pack.examQuestions, 'question'),
})
