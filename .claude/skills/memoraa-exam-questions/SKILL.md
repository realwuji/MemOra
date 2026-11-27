---
name: memoraa-exam-questions
description: How Memoraa's exam questions work end to end - the converted question images, their topics (chapters), the typing areas, paper ordering, marking and progress - and exactly what to run after changing any of it. Use when touching exam questions, past papers, the Computer Science question bank, answer areas, topic tagging, the question card or list, or the chapter picker for exam questions.
---

# Exam questions in Memoraa

Read `examconversion.md` for the full detail (sections 9 and 10 cover topics and typing areas). This is the working summary and the checklist.

## The data (Computer Science)

| Thing | Where |
| ----- | ----- |
| Question, mark scheme and examiner's report images (1060px wide WebP) | `public/past-papers/computer-science/<num>.webp`, `ms/<num>.webp`, `er/<file>.webp` |
| Index, one row per part (set, paper, q, marks, heights, `topic`) | `src/data/computer-science-past-papers.js` |
| Typing areas per question (per mille x, y, w, h, kind) | `src/data/computer-science-answer-areas.js` |
| Rows turned into question objects | `src/constants/cs-past-papers.js` |
| Maths equivalent | `src/data/maths-past-papers.js`, `src/constants/maths-past-papers.js` |
| List, card, pad, fields | `PastPaperChapter.jsx`, `PastPaperQuestion.jsx`, `AnswerPad.jsx`, `PaperFields.jsx` |
| Right / wrong marks (keyed so subjects never collide) | `src/hooks/usePastPaperDone.js` (`doneKey`) |
| Per-chapter right/wrong for the picker | `src/hooks/usePastPaperMarks.js` |
| Natural order (a before b, i before ii, newest sitting first) | `src/lib/questionOrder.js` |

## Rules that are easy to break

1. **Marks are keyed with `doneKey(q)`**, which is `<base>:<num>` for Computer Science and the bare number for Maths. Never key on `q.num` alone: Maths and Computer Science share numbers.
2. **Topics are the chapter names of the pack** (22 for Computer Science). A chapter with no questions, a question with no topic, or a topic that is not a chapter fails the build.
3. **The card's title is the position in the list** ("Question 1"), and the paper reference ("June 2016 / AS Paper 2 - Q7(d)") is the small line. The mark scheme and report keep the full reference. In a timed sitting the printed reference is the title.
4. **Order is `lib/questionOrder.js`**: sitting newest first, paper, question number, part (a), (b), (c), sub-part (i), (ii). Do not re-sort ad hoc. "Shortest first" is the other option.
5. **Typed answers are session-only** (sessionStorage, keyed by question) and never sent anywhere. Typed ink on the paper is a fixed blue-black, not the theme colour: the scan is forced white in every theme.
6. **The pad must keep working with the pen and with a finger.** The pad's textarea ignores the pointer unless the Type chip is on.
7. **A notes/flashcard card shows confidence; an exam-question card shows right and wrong.** Never both on one card (`ChapterPicker.jsx` gets `marks` only for exam methods).

## When you change something, run this

| You changed | Run |
| ----------- | --- |
| Anything | `npm run lint`, `npm test`, `npm run build` |
| Images in `public/past-papers/` (re-converted or added) | `python3 scripts/pastpapers/detect_answer_areas.py computer-science`, then re-run the topic steps below if rows changed, then `npm run check:past-papers` |
| Topic rules or the tagging | `python3 scripts/pastpapers/ocr_questions.py <out.json>` (once), then `python3 scripts/pastpapers/tag_topics.py <out.json> --sample 70 --seed <new seed>` to read a fresh sample, add corrections to `scripts/pastpapers/topic-overrides.json`, then `--write` |
| Detection of answer areas | Run with `--debug <dir>` and LOOK at overlays for: a truth table, a table with pale edges, dotted answer lines, a code listing. Past bugs: cells with printed values, circuit wires as lines, text rows as lines |
| The order of questions | `node scripts/test-question-order.mjs` |
| What "continue" means | `node --import ./scripts/resolve-ext.mjs scripts/test-resume.mjs` |
| A header menu link | `node --import ./scripts/resolve-ext.mjs scripts/test-nav-links.mjs` |

`npm test` runs all of these. The Python tools need a throwaway virtualenv (`pip install ocrmac pillow opencv-python-headless numpy`; OCR uses Apple Vision so it is macOS only). The generated data is committed, so a normal build needs none of it.

## Adding another subject's questions

Follow `examconversion.md` section 7, then: add an index and a constants module with the same object shape (including `base`, `subject`, `board`, `topic`, `areas`), give the pack `examImages: true` in `pack-<subject>.js`, and add a loader in `usePastPaperMarks.js` so its chapter cards get right/wrong rings.
