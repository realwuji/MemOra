import data from '../data/maths-past-papers'

/*
  Every question of the Edexcel A-level Maths past paper pack, one object each:
  { num, set, paper, q, marks, h, msH, erH, topic, question }.

  The index (src/data/maths-past-papers.js) stores a row per question,
  [num, set, paper, q, marks, questionHeight, markSchemeHeight, reportHeight, topic],
  where set, paper and topic are positions in the lists beside it. A height of 0 means the
  image does not exist (the mock sets have no examiner's reports). `topic` is the
  specification chapter the question is filed under, so the same questions serve the By paper
  view (Past papers) and the By chapter view (Exam questions).
*/
export const PP_SETS = data.sets
export const PP_PAPERS = data.papers

export const PAST_PAPER_QUESTIONS = data.rows.map(([num, s, p, q, marks, h, msH, erH, t]) => ({
  num,
  set: data.sets[s],
  paper: data.papers[p],
  q,
  marks,
  h,
  msH,
  erH,
  topic: data.topics[t],
  // the pack's de-duplicator keys exam questions on this, so it is unique per question
  question: `${data.sets[s]} ${data.papers[p]} Q${q}`,
}))
