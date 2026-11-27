# Exam question conversion

How a past-paper PDF becomes a question in the app, and how the same steps are repeated for another subject.

The maths past papers are the baseline. Their presentation (the exam sheet, the answer pad, the mark scheme under the question) is what each converted subject uses now. The conversion itself is in `scripts/pastpapers/`.

## 1. The baseline: maths

Maths questions are page images with this layout, all in one place:

| Part | Where | What it is |
|---|---|---|
| Images | `public/past-papers/maths/<num>.webp`, `ms/<num>.webp`, `er/<num>.webp` | the printed question, its mark scheme, its examiner's report. Width 1000 px. Blank answer space already trimmed. |
| Index | `src/data/maths-past-papers.js` | one row per question: `[num, set, paper, q, marks, questionHeight, markSchemeHeight, reportHeight, topic]` |
| Constants | `src/constants/maths-past-papers.js` | turns rows into objects: `{ num, set, paper, q, marks, h, msH, erH, topic, question }` |
| Component | `src/components/ui/PastPaperQuestion.jsx` | the exam sheet: source line, question, marks tag, working pad, mark scheme and examiner's report opened under the question |

The blank-space trim for maths is `scripts/trim-question-space.py`. Its numbers are kept in `scripts/pastpapers/pipeline.py` (`LONG`, `KEEP`, `TAIL`), so both use the same rule.

Any new subject should produce the same three things: images in `public/past-papers/<subject>/`, an index, and a constants module that gives the component the same object shape. The component reads its folder from `q.base`, which is `/past-papers/maths` when a question does not set one.

## 2. What the Computer Science PDFs contain

There are 8 PDFs in `C:\Users\mudas\Downloads` named `OCR-A-Level-Computer-Science-…`. They come from tryplumi.app, a question bank.

- Each page holds printed question images. The question text is in the image, not the text layer.
- The text layer holds a header line above every part, such as `1050 – June 2017 – Paper 2 – Q2(e) – 6 marks`.
- Mark schemes use the same line with `Mark scheme –` at the front, on their own pages.
- A stem (the text that opens a question, shared by its parts) has a line `For 1052–1056 – June 2017 – Paper 2 – start of question 3`.
- Long parts continue across pages. The header repeats with `(answer continued)` or `(continued)`.
- The 51- and 64-question files contain only questions already in the larger files. The 1-question file adds one question. The first copy of each id is kept.

Across the 8 PDFs there are 1,158 unique parts, each with a mark scheme, 3,776 marks in total, from June 2016 to June 2025 (ten sets).

## 3. The process, step by step

Each step is a function in `scripts/pastpapers/`. Only the parser is specific to one source.

### Step 1. Read the text layer (`pipeline.read_pages`)

For each page, read every text line with its position. Drop the footer. The footer is the line containing `tryplumi.app`. Its top edge is the bottom of the content on that page. The cover's title line (`OCR A-Level Computer Science: 109 questions`) has no web address and is not treated as a footer.

### Step 2. Classify the header lines (`tryplumi.py`)

Each line is matched against one of these patterns:

| Kind | Example | Used as |
|---|---|---|
| `q` | `1050 – June 2017 – Paper 2 – Q2(e) – 6 marks` | the start of a question part |
| `ms` | `Mark scheme – 1050 – June 2017 – Paper 2 – Q2(e) – 6 marks` | the start of its mark scheme |
| `stem` | `For 1052–1056 – June 2017 – Paper 2 – start of question 3` | the start of the stem for question 3 |
| `er` | `150–151 – Examiner's report – June 2024 – Paper 1 – question 5` | the examiner's report for the whole of question 5 |
| `boundary` | `Mark schemes`, the copyright page | ends the region above; starts nothing |

The en dash comes out of the PDF as `�`, so the separators are matched as "any one non-word character". `(continued)` and `(answer continued)` are accepted. Summary lines such as `378 marks` are left alone.

Check the parser against the whole set before converting: every line that starts with an id and mentions marks should match one pattern. The count for this run is 1,358 question lines, 1,278 mark-scheme lines, 237 stems, and the examiner's reports. The only unmatched lines were summary text.

### Step 3. Give each marker a region (`pipeline.regions_for`)

A region runs from just below its header to the top of the next marker of any kind. Headers themselves are left out of the crop, because the app shows the metadata. If the next marker is on a later page, the region is cut into pieces: the bottom of its page, every full page in between, and the top of the page with the next marker.

Boundary markers end a region without starting one. That stops the last question from swallowing the mark-scheme title or the examiner's report.

### Step 4. Attach stems

A stem region runs from its `For … start of question N` line to the first part of that question. Each part of question N gets the stem placed above its own pieces. So every part can be answered on its own. This makes the image longer for parts that come late in a question, but it means no part depends on another part's image.

### Step 5. Stitch continuation pieces

Pieces with the same id, from `(continued)` headers, are joined in document order into one image.

### Step 6. Render at the maths width (`pipeline.render`)

Each piece is rendered at 1000 px wide, with the page margins of 36 pt cut off each side. The pieces are stacked vertically on a white background. The white ground matches the maths images, because the printed page is dark ink on white in every theme.

### Step 7. Trim blank space (`pipeline.trim_blank`)

Each subject has a style (`pipeline.py`):

| Style | Blank band longer than | shrinks to | Blank after the last line | Border | Gap between stitched pieces |
|---|---|---|---|---|---|
| `STYLE_TIGHT` (maths) | 90 px | 36 px | 18 px | none | none |
| `STYLE_SPACED` (Computer Science) | 260 px | 150 px | 40 px | 30 px sides, 26 px top and bottom | 22 px |

The first version of the CS conversion used the maths style. That made the code blocks, the parts and the answer lines run into each other, because the gaps the printed page has were cut to a sliver. The spaced style keeps those gaps and adds a border, so each part reads as a separate block. Dotted answer lines are ink, so they stay in both styles.

### Step 8. Write the output (`pipeline.write_subject`)

- `public/past-papers/<subject>/<id>.webp` for the question.
- `public/past-papers/<subject>/ms/<id>.webp` for its mark scheme.
- `public/past-papers/<subject>/er/<file>.webp` for the examiner's report of the whole question. The file name comes from the set, paper and question, for example `june-2024-as-paper-1-q5.webp`. Every part of that question shares the one file.
- `src/data/<subject>-past-papers.json` with one object per part: `num`, `set`, `paper`, `q`, `marks`, `h`, `msH`, `erH` and `erFile`.

The `num` is the source id, so the same question always gets the same file name.

### Step 9. Wire it to the app

- `src/constants/cs-past-papers.js` turns the JSON rows into the same shape as the maths constants. It sets `base` to `/past-papers/computer-science`, passes on `erH` and `erFile`, and leaves `topic` null.
- `PastPaperQuestion.jsx` reads `q.base`, so both subjects render from their own folder. The examiner's report is loaded from `q.erFile` when it is set, and from `q.num` otherwise, which is how maths already works.
- `src/pages/dev/CsQuestionPreview.jsx` is a dev-only page at `/dev/cs-questions?ids=…`, to check any converted question on screen.

Not done yet: the live Computer Science pack does not use these questions. Its exam-questions page, its past papers view and its chapter list are unchanged. See "Still to do" below.

## 4. Run it

```powershell
cd C:\Users\mudas\Desktop\Thinking\adapthub-source
python scripts/pastpapers/convert.py computer-science "C:\Users\mudas\Downloads"
```

This takes about 8 minutes, most of it rendering. It rewrites the images and the JSON, so it is safe to run again.

To check one question on screen, run `npm run dev` and open `http://localhost:5173/dev/cs-questions?ids=1052,1050`.

## 5. Check the output

- Lint and build: `npm run lint` and `npm run build`.
- Open a few converted questions in the preview page. Look for: the stem above the part, the header absent from the crop, the mark scheme under the question, no cut-off text at the bottom.
- The list of parts taller than 2,000 px is the first place to look. There are 31 of them, and 5 are over 3,000 px: 1071, 1110, 1111, 1112 and 1109. These are parts that run across several pages, and some of them contain parts that have no header of their own (see the limits below).

## 6. Limits

- **Parts with no header.** Question 6 of the June 2017 Paper 2 has parts (e) and (f) with no header in the PDF. They sit in the image of part (d)(iii), so that image shows them too. The marks shown are those of (d)(iii) only. The source is wrong here, not the converter, so these cannot be split without the source.
- **Topics are assigned by keyword rules, not by a person.** See section 9. About nine in ten are right by spot-check; the rest can be corrected in `scripts/pastpapers/topic-overrides.json`.
- **Stems repeat.** A long stem appears in every part of its question. This is deliberate, so each part stands alone. It is also why some images are tall.
- **Only one copy per id.** When two PDFs have the same id, the first file in sorted order is kept.

## 7. Adapting another source

1. Write a module like `tryplumi.py`, with a `classify(text)` that returns `(kind, data)` for each header line. Kinds are `q`, `ms`, `stem` or `boundary`. `q` and `ms` need an `id`. `q` and `stem` need a `stem_key` of `(set, paper, question number)`, if the source has stems.
2. Add a profile in `convert.py` with the file glob, the classifier and the two output paths.
3. Add a constants module like `cs-past-papers.js` and a dev preview.
4. Run the conversion and check it as in section 5.

`pipeline.py` does not need to change for a new board, as long as its source puts the headers in the text layer.

## 8. Still to do

- Add a Computer Science past-papers view, based on `PastPapers.jsx`, and point the exam-questions page at the new list.
- Look at the 31 tall parts and fix the parts that are missing headers, if the source can be read another way.
- Find the answer areas for Maths too (section 10 only covers Computer Science).

## 9. Topics: how each question got its chapter

Every question has a `topic` in the index, one of the 22 chapters of the Computer Science pack (the same names as the notes and the chapter picker). The questions are images, so there was no text to search; the method is:

1. **Read the text off the images** with `scripts/pastpapers/ocr_questions.py`. It uses Apple Vision (macOS, nothing to install system-wide) in its "fast" mode, which read these printed pages well; the "accurate" mode returned nothing here. It needs `pip install ocrmac pillow` in a virtualenv, and writes one JSON file of `{ num: text }`. It takes under a minute.
2. **Tag by keyword rules** with `scripts/pastpapers/tag_topics.py <ocr.json> --write`. Each chapter has weighted keyword patterns (specific terms like "round robin" and "two's complement" weigh more than generic ones like "table"). The highest score wins. If it is too low to trust, the other parts of the same question vote (they share a scenario). If the whole question has no signal, it goes to a default chapter for its component. Paper 1 and AS Paper 1 are Component 1; Paper 2 and AS Paper 2 are Component 2, which gives the chapters of that component a small bonus.
3. **Corrections** live in `scripts/pastpapers/topic-overrides.json` (question number to chapter name) and win over the rules. A spot-check finding is recorded there without touching the rules.
4. Without `--write` the script only reports: how many questions each chapter got, how many were decided by their own text, by neighbours or by default, and a random sample (`--sample N --seed S`) to read.

**Checks done:** two independent random samples of 70 questions each (about 6 per cent of the set each) were read against their text. The first found about seven wrong or doubtful tags (a Big O question read as "O{n)", a binary search tree tagged as binary search, RAM versus ROM pulled into processors by a stray "GPU", the verb "inherit" in an AI-bias question tagged as OOP, a database part tagged OOP, and stacks lost to a same-component bonus); the rules were fixed for each. The second sample, on the fixed rules, was about 90 per cent right, with five wrong or probably wrong (a "type of translator" question tagged Systems Software, an LMC addressing question tagged Processor, library files tagged Paradigms, a 2D array question tagged Sorting, a stack in an array tagged Programming Techniques); the rules were fixed where a rule was the cause and the rest are in the overrides file. Every chapter has questions (Programming Paradigms has the fewest, 5, because the exam rarely asks about it directly). `npm run check:past-papers` fails the build if any question has no topic, a topic that is not a chapter of the pack, or a chapter has no questions.

**Known weak spots:** a question whose scenario is about one thing and whose part asks about another can follow the scenario (the stem is repeated in every part). Heavily mixed questions go to the chapter they mostly test. Run the tagger with a new `--seed` to spot-check again after changing a rule.

## 10. Answer areas: typing straight onto the paper

A question image is a printed page, so the places a student writes are part of the picture. `scripts/pastpapers/detect_answer_areas.py` finds them once, and the app lays a transparent text field over each (`components/ui/PaperFields.jsx`), in the handwriting font and a blue-black biro ink, so a keyboard user can fill a truth table or write on the printed lines. The working pad and the pen are untouched, and nothing is drawn on the image.

**What it finds** (OpenCV, no machine learning): (1) the empty cells of a table, and empty ruled boxes: long horizontal and vertical lines are kept by a morphological opening, the regions they enclose are the cells, and a cell is an answer area when it has almost no ink in it (a printed value, even one digit, makes it a given, not an answer); (2) answer lines: rows of dots and long ruled lines, including pale grey ones, with blank paper directly above them (a printed row of text, such as a code listing, has ink on both sides and is rejected). The grid is found on a sensitive mask so a table with pale cell edges is still one table of cells. Short lines (circuit wires, arrows, underlines) are ignored.

**Output:** `src/data/computer-science-answer-areas.js`, `{ num: [[x, y, w, h, kind], ...] }` in per mille of the image's own width and height (so it is exact at any display size), `kind` 0 for a cell or box and 1 for a line. 1,155 of the 1,158 questions have at least one area, about 10,000 areas in all (190 KB). `npm run check:past-papers` validates every area.

**What it cannot do:** it finds ruled boxes and lines, so it misses an answer area that is only white space (it falls back on the pad), and may offer an empty cell the question did not mean as an answer, which is harmless (a field in the wrong place is simply not used). Checked by eye on a truth table, a Dijkstra table with pale edges, dotted answer lines, and a code listing.

**Run it:** `pip install opencv-python-headless numpy pillow` in a virtualenv, then `python3 scripts/pastpapers/detect_answer_areas.py computer-science` (add `--debug <dir>` to write an overlay PNG per question with the areas boxed, `--only <num>` for one question).

**Behaviour in the app:** the sheet is a CSS container and the text is sized in container-width units from the area's real height, so it stays in proportion to its cell at any width. A line is written at about one and a half times the printed text height; a cell is filled to about two thirds of its height; each field has a faint repeatable tilt (not random on each render). Enter moves to the next field. Typed text is kept for the browser session only (a reload keeps it; closing the tab clears it), and a "Clear typing" chip appears when there is any. In the reading fonts (OpenDyslexic, Atkinson Hyperlegible) the field uses the reading font instead of the handwriting face.

## Typing on answer lines: grouping

`detect_answer_areas.py` removes printed text before looking for dotted lines (only marks 5px tall or less
are kept), so a label such as "Data bus ......" yields only its dots: the area starts after the label and
sits exactly on the line. `src/lib/answerBlocks.js` then groups consecutive lines into one writing block
(a labelled first line may be indented; later lines share the left edge; a gap starts a new block), and
`PaperFields.jsx` renders each block as one text area whose text wraps from line to line. Tests:
`scripts/test-answer-blocks.mjs`.
