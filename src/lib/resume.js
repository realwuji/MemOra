import { daysAgo } from '@/lib/sessions'
import { slugify } from '@/lib/slug'
import { studyPathFor } from '@/lib/techniques'

/*
  "Continue where you left off": the single definition, shared by the dashboard's Continue card and the
  header (the Continue shortcut and the Study menu's card), so they can never point at different places.

  What counts as the last place you were: whichever is newer of
    - the last screen you opened (`lastVisit`, saved the moment a study screen opens), and
    - your last FINISHED session that names a chapter (a chaptered session beats a whole-subject one
      even if older: resuming a whole subject is a weaker offer),
  and only if it is a subject you still study (dropping a subject must not leave a dead link to it).
*/

export const BAND_LABEL = {
  not_started: 'Not started',
  seen: 'Seen once',
  shaky: 'Shaky',
  solid: 'Solid',
  'exam-ready': 'Exam-ready',
}

// The colour token behind each readiness band (the same meaning the rest of the app gives them).
export const BAND_COLOUR = {
  not_started: 'var(--muted)',
  seen: 'var(--r1-seen)',
  shaky: 'var(--r2-shaky)',
  solid: 'var(--r3-solid)',
  'exam-ready': 'var(--r4-exam-ready)',
}

// The most recent session that names a chapter, so "continue" has something concrete to point at.
export function lastResumable(sessions = []) {
  const withTopic = sessions.filter((s) => s.topic && s.subject)
  return withTopic[0] || sessions.find((s) => s.subject) || null
}

// daysAgo() returns a raw number; "MCQ · 1" is not a sentence.
export function relativeDay(ts) {
  const d = daysAgo(ts)
  if (d === null) return null
  if (d === 0) return 'today'
  if (d === 1) return 'yesterday'
  return `${d} days ago`
}

// The subjects this student studies, by name (a university course replaces the school subjects).
export function subjectNamesOf(user) {
  return user.courseType === 'University' && user.courseName ? [user.courseName] : (user.subjects || []).map((s) => s.name)
}

export function pickResume({ sessions = [], lastVisit = null, subjectNames = [] }) {
  const finished = lastResumable(sessions)
  const s = lastVisit && (!finished || (lastVisit.ts || 0) >= (finished.ts || 0)) ? lastVisit : finished
  return s && subjectNames.includes(s.subject) ? s : null
}

// Where Continue opens: the exact chapter and the exact technique, not a menu.
export function resumePath(session) {
  const technique = session.technique || 'notes'
  return session.topic ? studyPathFor(session.subject, session.topic, technique) : `/study/${slugify(session.subject)}/${technique}`
}
