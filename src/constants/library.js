/*
  Revision content per subject: notes-driven flashcards, MCQ, and exam
  questions with mark schemes, built spec-accurate for the subjects covered:
  Maths (Edexcel A-level), Economics (Edexcel A A-level), and Computer Science
  (OCR H446 A-level).

  Every flashcard and exam question carries a `topic` (chapter) field, and
  packs with a real specification structure also carry `groups`: an ordered
  outline (section -> subsection -> topic titles) used to build a real chapter
  picker instead of a flat wall of chips.

  THE APP DOES NOT IMPORT THIS FILE. It holds every subject's full content
  (about 2.7MB), so importing it puts all of that in the first download of any
  page that so much as counts chapters. The app imports packs.js instead: an
  outline and counts for every subject up front, and each subject's full pack
  only when that subject is studied. This file is for node scripts
  (scripts/*.mjs), which want the whole library at once, and for
  scripts/generate-pack-manifest.mjs, which writes the manifest from it.

  Each subject is assembled in its own module (pack-maths.js,
  pack-economics.js, pack-computer-science.js).
*/
import maths from './pack-maths'
import economics from './pack-economics'
import computerScience from './pack-computer-science'
import { makeLookup, topicLevelMap } from './pack-lookup'

export const REVISION = [maths, economics, computerScience]

export const REVISION_SUBJECTS = REVISION.map((p) => ({ id: p.id, name: p.name }))

const lookup = makeLookup(REVISION)
export const getPack = lookup.getPack
export const getPackByName = lookup.getPackByName
export { topicLevelMap }
