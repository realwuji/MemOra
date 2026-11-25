/*
  The Economics (Edexcel A A-level) revision pack, assembled: the base content plus every
  batch written for it since (flashcards, questions, notes, diagrams), with repeats
  dropped. One module per subject so the app can load a subject only when it is
  studied (see packs.js); library.js assembles all of them for scripts.
*/
import { mergeNotes } from './notes-merge'
import { ECON_NOTES, ECON_GROUPS, ECON_FLASHCARDS, ECON_MCQ, ECON_EXAM } from './econ-full'
import { ECON_THEME2_NOTES } from './econ-notes-theme2'
import { ECON_THEME2B_NOTES } from './econ-notes-theme2b'
import { ECON_THEME2C_NOTES } from './econ-notes-theme2c'
import { ECON_THEME1A_NOTES } from './econ-notes-theme1a'
import { ECON_THEME1B_NOTES } from './econ-notes-theme1b'
import { ECON_THEME3A_NOTES } from './econ-notes-theme3a'
import { ECON_THEME3B_NOTES } from './econ-notes-theme3b'
import { ECON_THEME4_NOTES } from './econ-notes-theme4'
import { ECON_EXAM_2 } from './econ-exam-2'
import { ECON_EXAM_3 } from './econ-exam-3'
import { ECON_ESSAYS } from './econ-essays'
import { ECON_ESSAYS_2 } from './econ-essays-2'
import { PLAN_BANK } from './econ-plans'
import { deriveDeck, splitApplication } from '../lib/notesDeck'
import { APPLICATION_CASES } from '../data/application-cases'
import { ECON_FIRM_CARDS } from './econ-flashcards-firm'
import { ECON_FIRM_MASTER_NOTES } from './econ-notes-firm-master'
import { ECON_MASTER_T2_NOTES } from './econ-notes-master-theme2'
import { ECON_MASTER_T1_NOTES } from './econ-notes-master-theme1'
import { ECON_MASTER_T3_NOTES } from './econ-notes-master-theme3'
import { ECON_MASTER_T4_NOTES } from './econ-notes-master-theme4'
import { ECON_MCQ_2 } from './econ-mcq-2'
import { ECON_EXTRA_DEPTH } from './econ-notes-extra'
import { ECON_EXTRA_DEPTH_2 } from './econ-notes-extra2'
import { ECON_GAP_NOTES } from './econ-notes-gaps'
import { ECON_GAP_NOTES_2, ECON_SURPLUS_FLASHCARDS, ECON_SURPLUS_MCQ, ECON_SURPLUS_EXAM } from './econ-notes-gaps-2'
import { ECON_EXTRA_FLASHCARDS_4, ECON_EXTRA_MCQ_4, ECON_EXTRA_EXAM_4 } from './econ-extra-4'
import { withDiagrams } from './econ-diagrams'
import { tagWithDiagrams } from './diagram-map'
import { ECON_DIAGRAM_CARDS } from './econ-diagram-cards'
import { dedupeContent } from './pack-dedupe'

const BASE = {
    id: 'economics',
    name: 'Economics',
    groups: ECON_GROUPS,
    topics: ECON_GROUPS.flatMap((g) => g.subgroups.flatMap((sg) => sg.topics)),
    flashcards: ECON_FLASHCARDS,
    mcq: ECON_MCQ,
    examQuestions: ECON_EXAM,
}

const withExtras = (pack) => {
  // The notes, with their applied cases moved out into the Application method.
  const merged = withDiagrams(
    mergeNotes(
      { ...ECON_NOTES, ...ECON_THEME2_NOTES, ...ECON_THEME2B_NOTES, ...ECON_THEME2C_NOTES, ...ECON_THEME1A_NOTES, ...ECON_THEME1B_NOTES, ...ECON_THEME3A_NOTES, ...ECON_THEME3B_NOTES, ...ECON_THEME4_NOTES, ...ECON_GAP_NOTES, ...ECON_GAP_NOTES_2 },
      ECON_EXTRA_DEPTH,
      ECON_EXTRA_DEPTH_2,
      ECON_FIRM_MASTER_NOTES,
      ECON_MASTER_T1_NOTES,
      ECON_MASTER_T2_NOTES,
      ECON_MASTER_T3_NOTES,
      ECON_MASTER_T4_NOTES,
    ),
  )
  const notes = {}
  const applications = {}
  Object.entries(merged).forEach(([topic, html]) => {
    const split = splitApplication(html)
    notes[topic] = split.notes
    if (split.apps.length) applications[topic] = split.apps
  })
  // Flashcards and MCQs are built from the notes you supplied (the MASTER notes):
  // definitions, worked examples, determinant cards and table rows (lib/notesDeck.js).
  const master = {}
  ;[ECON_FIRM_MASTER_NOTES, ECON_MASTER_T1_NOTES, ECON_MASTER_T2_NOTES, ECON_MASTER_T3_NOTES, ECON_MASTER_T4_NOTES].forEach((m) =>
    Object.entries(m).forEach(([k, v]) => {
      master[k] = (master[k] || '') + v
    }),
  )
  const derived = deriveDeck(master)
  // A chapter whose notes yield too few items to revise from keeps its earlier ones
  // as well, so no chapter is left thin.
  const tally = (list) => list.reduce((m, x) => ({ ...m, [x.topic]: (m[x.topic] || 0) + 1 }), {})
  const cardCount = tally(derived.flashcards)
  const mcqCount = tally(derived.mcq)
  const keepCards = (list) => list.filter((x) => (cardCount[x.topic] || 0) < 8)
  const keepMcq = (list) => list.filter((x) => (mcqCount[x.topic] || 0) < 6)
  return {
    ...pack,
    // tagWithDiagrams attaches each chapter's diagram to its questions, so
    // every technique can show one - the mark scheme for a "using a
    // diagram" question, and the explanation after a wrong MCQ.
    examQuestions: tagWithDiagrams([...pack.examQuestions, ...ECON_EXAM_2, ...ECON_EXAM_3, ...ECON_ESSAYS, ...ECON_ESSAYS_2, ...ECON_EXTRA_EXAM_4, ...ECON_SURPLUS_EXAM], 'Economics'),
    mcq: tagWithDiagrams([...keepMcq([...pack.mcq, ...ECON_MCQ_2, ...ECON_EXTRA_MCQ_4, ...ECON_SURPLUS_MCQ]), ...derived.mcq], 'Economics'),
    flashcards: tagWithDiagrams([...keepCards([...pack.flashcards, ...ECON_DIAGRAM_CARDS, ...ECON_FIRM_CARDS, ...ECON_EXTRA_FLASHCARDS_4, ...ECON_SURPLUS_FLASHCARDS]), ...derived.flashcards], 'Economics'),
    // A distinct technique from examQuestions: a bank of questions to PLAN
    // answers to, with no model answers - see econ-plans.js. Not
    // filtered by chapter (the bank has its own paper/topic filters) and
    // not run through tagWithDiagrams: which diagram a plan needs is part
    // of the plan the student writes, not something handed to them.
    essayBank: PLAN_BANK,
    // Diagram revision: the animated, data-driven diagrams (constants/dr-bank.js).
    diagramRevision: true,
    // Diagrams spliced into the notes at the passage that describes
    // them - see econ-diagrams.js.
    // Rewritten chapters replace their thin originals; the rest are
    // untouched until they are rewritten too.
    notes,
    // Applied cases per topic: the scenarios taken out of the notes, plus
    // real-life cases with a timeline, numbers and links to the theory
    // (data/application-cases.js).
    applications,
    realCases: APPLICATION_CASES,
  }
}

export default dedupeContent(withExtras(BASE))
