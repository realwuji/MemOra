import { STUDY_TECHNIQUES } from '@/constants/content'
import { slugify } from '@/lib/slug'
import { countsOf } from '@/constants/pack-lookup'

/*
  The bits of "which technique, on which chapter, opens which route" that
  the dashboard's launchers share: the subject cards, the Start chooser
  and the gaps list. Kept here so they can never disagree about what a
  technique id links to.
*/

// The timed paper is a technique in the student's eyes but a different
// route in the router's, so the launchers list it beside the others.
export const MOCK_TECHNIQUE = { id: 'mock', icon: 'clock', label: 'Mock exam', desc: 'A timed, randomised paper' }

// The timed paper is now a Timed test option inside Exam questions, so it is
// no longer a launcher of its own.
export const ALL_TECHNIQUES = [...STUDY_TECHNIQUES]

// Attempts log the timed paper as 'mock-exam' (lib/attempts.js) and the
// recommender hands that back as a mode; the launcher id is 'mock'.
// Retired methods keep working as links: blurting is now flashcards.
export const normaliseMode = (id) => (id === 'mock-exam' || id === 'mock' ? 'exam-questions' : id === 'blurting' || id === 'active-recall' ? 'flashcards' : id)

// A technique is offered only if the subject's pack actually has content
// for it, so nobody lands on an empty "no MCQs yet" dead end.
// Works on a light pack (its precomputed counts) as well as a full one, so a
// launcher can answer this without downloading the content.
export function techniqueHasContent(pack, techniqueId) {
  if (!pack) return true
  const counts = countsOf(pack)
  switch (normaliseMode(techniqueId)) {
    case 'mcq':
      return counts.mcq > 0
    case 'exam-questions':
    case 'mock':
      return counts.examQuestions > 0
    case 'notes':
      return counts.notes > 0
    case 'essay-plans':
      return counts.essayBank > 0
    case 'diagram-revision':
    case 'diagram-bank':
      return counts.diagramRevision
    case 'application':
      return counts.applicationKeys > 0
    case 'past-papers':
      return Boolean(counts.pastPapers)
    case 'flashcards':
    default:
      return counts.flashcards > 0
  }
}

// The four specialist methods exist for only some subjects (Economics today).
// For a subject with none of that content the launcher leaves them out, rather
// than showing a greyed "Not for Maths yet" tile for each. The four core
// methods are always listed, so an empty one still says so.
// Maths has no multiple choice (its practice is the exam questions and past papers), so MCQ
// is left out of its launcher the same way.
const SPECIALIST_TECHNIQUES = new Set(['essay-plans', 'application', 'diagram-revision', 'diagram-bank', 'past-papers', 'mcq'])
export const techniquesFor = (pack) =>
  ALL_TECHNIQUES.filter((t) => !SPECIALIST_TECHNIQUES.has(t.id) || techniqueHasContent(pack, t.id))

export const techniqueLabel = (id) => ALL_TECHNIQUES.find((t) => t.id === normaliseMode(id))?.label || 'Study'

/*
  Where a technique on a subject opens. With a chapter, the study page
  lands on that exact chapter (?chapter=) rather than the picker; the
  mock exam builds its own paper, so a chapter is not passed to it.
*/
export function studyPathFor(subjectName, topic, mode) {
  const slug = slugify(subjectName)
  // The recommender suggests MCQ for a chapter just started; Maths has none, so it opens flashcards.
  const id = slug === 'maths' && normaliseMode(mode) === 'mcq' ? 'flashcards' : normaliseMode(mode)
  if (!topic) return `/study/${slug}/${id}`
  const params = new URLSearchParams({ chapter: topic })
  return `/study/${slug}/${id}?${params.toString()}`
}
