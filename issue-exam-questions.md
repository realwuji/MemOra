**Title:** Computer Science exam questions: topics, optional working pad, matching header, question numbering, confidence tracking, and a full test pass

## Summary

The Computer Science exam questions (1,157 parts converted from the OCR question-bank PDFs, see `examconversion.md`) are live, but they are not yet at the standard of the Maths ones. This issue brings them up to that standard, fixes how progress is tracked across every method, and adds a test pass for the whole site. It is a plan: nothing in this issue is implemented yet.

Where things are today:

| Thing | Where |
|---|---|
| Converted images (question, mark scheme, examiner's report) | `public/past-papers/computer-science/` (`<id>.webp`, `ms/<id>.webp`, `er/<file>.webp`) |
| Index (one row per part) | `src/data/computer-science-past-papers.js` |
| Rows turned into question objects | `src/constants/cs-past-papers.js` (sets `base`, `subject`, `board`, `component`) |
| The pack uses them | `src/constants/pack-computer-science.js` (`examQuestions`, `examImages: true`) |
| List page | `src/components/ui/PastPaperChapter.jsx` (shared with Maths) |
| One question card | `src/components/ui/PastPaperQuestion.jsx` (shared with Maths) |
| Done / right / wrong memory | `src/hooks/usePastPaperDone.js` |
| Conversion scripts | `scripts/pastpapers/` (`pipeline.py`, `tryplumi.py`, `convert.py`) |

Screenshots to attach (taken from the live site):
1. The exam questions header bar (plain, with "Change method", full-screen icon and "Finish session").
2. A question card marked wrong, titled "Question 7(d)".
3. A dashboard subject card showing "1 at 5/5 confidence" for Pure.
4. A chapter card showing "1 of 3 marked · 1 right, 0 wrong" for Algebraic Expressions.

---

## 1. Test everything

A full pass across the site, with a written result for each line. Record failures as separate issues.

**Methods, for each of Maths, Economics and Computer Science**
- [ ] Notes: every chapter opens, diagrams draw, the highlighted key terms look the same, the Finish buttons lead to the rating screen.
- [ ] Flashcards, MCQ (Economics and Computer Science only), exam questions, past papers (Maths only), essay plans, diagram revision, diagram bank, application.
- [ ] Each method's empty state (a subject or chapter with no content) shows a clear message, not a blank page.

**Marking and progress**
- [ ] Mark a question right, then wrong, then press the same button again to clear it. The stamp, the card edge colour, the saved state and the progress numbers all agree.
- [ ] Marking a Computer Science question must not change any Maths number, and the other way round. (They share question numbers, so this was a real risk; done-tracking now keys CS questions as `<folder>:<id>`.)
- [ ] Attempts for Computer Science are logged under "Computer Science", not "Maths".
- [ ] Reload the page: marks, ratings and "Continue where you left off" are still there.
- [ ] Sign in with a second account in the same browser: each account keeps its own marks.

**Themes and layout**
- [ ] Black, White, High contrast, and a handful of accents (Mono, Pink, Sky, Amber). The White theme's key is still `cream` internally, so check the saved theme of an older account loads correctly.
- [ ] The Mono accent swatch reads as black on White and white on Black, with a visible tick in both.
- [ ] Phone width (375 px), tablet (768 px), desktop (1280 px and wider). No horizontal scroll, no overlapping buttons.
- [ ] Full screen mode on a study page: the page bar and footer step away and Esc brings them back.
- [ ] Reduced motion setting on: the stamp, the dot meter and the open and close animations do not move.

**Quality gates**
- [ ] `npm run lint` and `npm run build` pass, and the prerendered routes are unchanged.
- [ ] No console errors on any page in the pass.
- [ ] A run of the route sweep script over every route.

## 2. Split Computer Science exam questions into topics

Maths files every question under a specification chapter and opens on a chapter picker. Computer Science shows one list, split only by Component 1 and Component 2 (Paper 1 and Paper 2). Match Maths.

**Goal**
- [ ] The Computer Science exam questions open on a chapter picker (same as Maths), and picking a chapter shows only that chapter's questions.
- [ ] Top level: Component 1: Computer Systems and Component 2: Algorithms and Programming. Inside each, the chapters, using the same chapter names as the notes (for example "Structure and Function of the Processor", "Databases", "Algorithm Complexity (Big O)").
- [ ] Each chapter card shows how many questions it has and how many you have marked, and a right and wrong ring like Maths.
- [ ] A "The whole of Computer Science" shuffled option, like the other subjects.

**How the topics get assigned (decide first)**
The questions are images, so there is no text to search. Options, with trade-offs:
1. Text recognition on the question images, then keyword rules per chapter. Fast to run, needs a tool installed, and needs a human check of the result.
2. Tagging by hand or with an assistant reading each image. Slow for 1,157 parts, but the most accurate.
3. Use the OCR specification's own structure. The first two letters of the part (`1(a)`) do not give a topic, so this alone is not enough.
- [ ] Choose a method, tag the questions, and store the topic in the index (`topic` is `null` for every row today).
- [ ] Record the method, the rules used, and the checks done in `examconversion.md`.
- [ ] Spot-check at least 5 per cent of tags, and check every chapter has questions.
- [ ] A question that fits two chapters goes to the one it mostly tests. A question with no obvious chapter goes to the nearest, not dropped.

**App changes this needs**
- [ ] Remove the `examImages` exception in `StudySession.jsx` (`hasChapters`) once topics exist, so the chapter step comes back for Computer Science.
- [ ] Keep `examImages` in the pack and the manifest (`scripts/generate-pack-manifest.mjs`) so the list still uses the image sheet.
- [ ] The chapter filter in the study page (`inChapter`) must treat questions by topic, and the empty chapter must say so.
- [ ] Remove the temporary "Component" chips from `PastPaperChapter.jsx`, or keep them as a filter inside a chapter if they still help.

**Known data limits to handle or document**
- The source has no header for some parts, so they appear inside a neighbouring part's image. For example June 2017, Paper 2, question 6: parts (e) and (f) are shown in the image of (d)(iii), and only its 5 marks are counted.
- 31 parts are over 2,000 px tall and 5 are over 3,000 px (ids 1071, 1109, 1110, 1111, 1112). Check these by eye.
- One part, June 2016 AS Paper 2 Q4(c)(ii), exists twice in the PDFs, so the pack keeps 1,157 of 1,158.

## 3. "Your working" should be optional, behind an "Extra Space" button

Today `AnswerPad` is always open under each question. Make it optional, and make opening it feel good.

**Behaviour**
- [ ] The pad is closed by default and the card is shorter for it.
- [ ] A button called **Extra Space** sits in the actions row of the card.
- [ ] Clicking it opens the pad with an animation that looks like the pad coming out of the button: it grows from the button's position (clip or scale from the button's corner, a soft fade, a short ease-out).
- [ ] The label changes to **Hide space** while open. Clicking closes it with the reverse animation.
- [ ] Whatever was drawn stays when the pad is closed and opened again, and survives a page reload for the session.
- [ ] "More space" (the extra rows) stays inside the pad, and keeps working.
- [ ] The open state is remembered per question while the list is on screen, and not shared between questions.

**Accessibility and polish**
- [ ] The button has `aria-expanded` and `aria-controls`, and the pad is not focusable while closed.
- [ ] Reduced motion: open and close are instant.
- [ ] Keyboard: Enter or Space opens, Esc closes, focus returns to the button.
- [ ] The animation runs on the pad's own box, not the whole card, so the list does not jump while it plays.

**Scope**
- [ ] Do this in the shared question card, so Maths and Computer Science match.
- [ ] The timed paper mode (Maths past papers, `PaperSitting`) keeps its pad, because there the pad is the answer area. Decide whether Extra Space applies there, and write it down.

## 4. Fix the top bar on the exam questions page

The Computer Science exam questions page shows a small header (Change method, full-screen icon, Finish session) that looks plainer than the headers on the notes pages and the chapter picker.

- [ ] Use the same header card as the notes pages: round back button, "Studying · Exam questions" label, bold subject or chapter title, grouped actions on the right.
- [ ] The Finish buttons match: **Finish session** (secondary) and **Finish and continue** (primary) where there is a next section.
- [ ] Back button: "All chapters" once topics exist (section 2), "Change method" before then.
- [ ] Full screen button and behaviour identical to notes.
- [ ] Sticky position matches the notes pages, including the offset under the page bar and the full screen offset.
- [ ] Check it on a phone width, where the buttons wrap onto a second row.
- [ ] Also show a small count in the header, such as "25 of 1,157 questions", so the list's size is clear before you scroll.

## 5. Question labels: "Question 1", not "Question 7(d)"

The card title is the original part label, such as "Question 7(d)", which looks wrong at the top of a shuffled or filtered list.

- [ ] The title shows the position in the list: Question 1, Question 2, and so on.
- [ ] The original reference becomes the small line above or beside it: "June 2016 / AS Paper 2 · Q7(d)".
- [ ] The number follows the list, so it changes when you filter or page, and the "Show 25 more" button continues the numbering.
- [ ] The mark scheme and examiner's report keep the full paper reference in their headings, because the images and the exam board use it.
- [ ] Mark a question and it keeps its number in the list. A "Hide the ones I have done" filter renumbers the visible list.
- [ ] Do this for Maths as well, so both subjects match, or decide Maths keeps its labels, and say so.

## 6. Fix the tracking so each method shows what makes sense for it

Progress is shown differently in different places, and some of it does not fit the method. From the screenshots: a Maths notes chapter reads "1 of 3 marked · 1 right, 0 wrong", and the dashboard reads "1 at 5/5 confidence".

**Rule: one meaning per method**
- Notes, flashcards, diagrams: how confident you feel (the 1 to 5 stars after a session). Colours: red 1 to 2, amber 3, green 4 to 5.
- Exam questions and past papers: right and wrong counts for the questions you marked, as a ring.
- MCQ: score from your answers.
A card must not mix two meanings.

**Fixes**
- [ ] Notes chapter cards: show "Confidence 4/5", never "1 of 3 marked". (A notes chapter has nothing to mark.)
- [ ] Exam question and past paper chapter cards: show "3 of 12 marked · 2 right, 1 wrong" with the ring, and no confidence line.
- [ ] A chapter you finished but did not rate: show "Completed", not blank.
- [ ] The dashboard subject cards: the per-section strips (Pure, Statistics, Mechanics) use one legend. Rated chapters show confidence colours. Unrated chapters show the "not started" colour. The text under the strip says what the colours mean.
- [ ] The hero meter (the dot field with the percentage) and the section counts (Pure 1/26) use one definition of "completed", the same as the chapter cards. Write the definition down.
- [ ] The Progress page uses the same definition and the same colours.
- [ ] Marking an exam question updates the chapter card, the dashboard, and the Progress page, for every subject, with no reload.
- [ ] Past paper marks that come from Computer Science do not appear in Maths numbers (see section 1).
- [ ] "Continue where you left off" names the right method and chapter, and opens it.
- [ ] After finishing a notes chapter and rating it, the rating shows on that chapter's card straight away. The rating the user gave last wins.
- [ ] Reset path: a way to clear a mark or a rating, and a test that clearing updates every number.

## 7. Further items found along the way

- [ ] **Section screen after clicking a method.** The plan to split each method into its sections first (Maths: Pure Mathematics, Statistics, Mechanics; Economics: Theme 1 to 4; Computer Science: Component 1 and 2) before showing chapters. See the earlier plan. Build it after section 2, so Computer Science exam questions have chapters to show.
- [ ] **Images load lazily and stay light.** The converted Computer Science folder is about 94 MB. Confirm images use native lazy loading, that the first screen only fetches what is visible, and that the deploy size and hosting limits are fine. Consider smaller WebP quality or width for the mark scheme and report images.
- [ ] **Examiner's reports.** 489 of the 1,157 parts have one. The button is hidden when there is none, which is right. Check that the count shown ("examiner's report underneath") does not promise a report where there is none, and that the report image is easy to read on a phone.
- [ ] **Past papers for Computer Science.** The Maths "Past papers" page groups by paper and sitting, with timed papers. Decide whether Computer Science gets the same page, with its sets (June 2016 to June 2025, plus November 2020 and 2021) and papers (Paper 1, Paper 2, AS Paper 1, AS Paper 2).
- [ ] **Search.** A search box on the exam questions list, to find a question by its paper reference ("June 2019 Paper 2").
- [ ] **Sort and filters.** Sort by marks, by sitting, or shuffled. Filter by sitting year and by AS or A-level.
- [ ] **Persisted filters.** The chosen component, length and sort stay when you leave the page and come back.
- [ ] **Stamp polish.** The red and green stamp should not play on page load for questions already marked, only when the mark changes.
- [ ] **Sign-in copy.** Any place that still says "Edexcel" for Computer Science. The intro now says OCR; check the Teachers page, the start page, the sitemap text and `llms.txt`.
- [ ] **Docs.** Keep `examconversion.md` current: topics method, style settings, limits, and how to run the conversion again.
- [ ] **Tests.** Add a script that checks every row in the Computer Science index has an image on disk, a mark scheme, and a valid report file when `erFile` is set, so a bad conversion fails the build.

## Acceptance criteria

1. Computer Science exam questions open on a chapter picker, grouped by component, with right and wrong rings. A chapter shows only its questions, numbered from 1.
2. "Your working" is closed by default and opens from an **Extra Space** button with a smooth animation. It respects reduced motion and keyboard use.
3. The exam questions header matches the notes pages, including Finish and Finish and continue.
4. Cards show confidence for notes and right and wrong for exam questions, and never both. The dashboard, Progress page and chapter cards agree.
5. All of section 1 is ticked, including all themes, three screen widths, and no console errors.
6. Lint and build pass, and `examconversion.md` is up to date.
