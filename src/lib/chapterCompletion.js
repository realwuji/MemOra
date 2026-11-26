import { slugify } from './slug.js'

export const chapterSubjectKey = slugify

// Sessions are capped at 200. Keep the set of finished chapters independently
// so revising another chapter cannot erase an earlier completion.
export function rememberFinishedChapter(chapters = {}, session) {
  if (!session.subject || !session.topic || session.finished === false) return chapters
  const key = chapterSubjectKey(session.subject)
  const topics = chapters[key] || []
  if (topics.includes(session.topic)) return chapters
  return { ...chapters, [key]: [...topics, session.topic] }
}
