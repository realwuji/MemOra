import rows from '../data/computer-science-past-papers'
import areas from '../data/computer-science-answer-areas'

/*
  Every OCR A-Level Computer Science question part from the question-bank PDFs, in the same shape
  as the maths index (constants/maths-past-papers.js). Made by scripts/pastpapers/convert.py;
  see examconversion.md. The images live in public/past-papers/computer-science.

  An examiner's report covers a whole question, so every part of that question points at the same
  report file (erFile). The topic of each part (one of the 22 chapters of the pack, so the same
  names as the notes) was assigned by scripts/pastpapers/tag_topics.py; see examconversion.md.
*/
const BASE = '/past-papers/computer-science'

export const CS_PAST_PAPER_QUESTIONS = rows.map((r) => ({
  num: r.num,
  set: r.set,
  paper: r.paper,
  q: r.q,
  marks: r.marks,
  h: r.h,
  msH: r.msH,
  erH: r.erH,
  erFile: r.erFile,
  topic: r.topic,
  // where a student writes on the image (cells, boxes, answer lines): see components/ui/PaperFields.jsx
  areas: areas[r.num] || null,
  base: BASE,
  subject: 'Computer Science',
  board: 'OCR',
  // Paper 1 is Component 1 and Paper 2 is Component 2, for both the A-level and the AS
  component: /Paper 1$/.test(r.paper) ? 'Component 1: Computer Systems' : 'Component 2: Algorithms and Programming',
  question: `${r.set} ${r.paper} Q${r.q}`,
}))
