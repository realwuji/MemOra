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
- **No topics yet.** The chapter view needs a topic for each question. The text is in the images, so this needs either hand mapping by question or OCR. `topic` is null until then.
- **Stems repeat.** A long stem appears in every part of its question. This is deliberate, so each part stands alone. It is also why some images are tall.
- **Only one copy per id.** When two PDFs have the same id, the first file in sorted order is kept.

## 7. Adapting another source

1. Write a module like `tryplumi.py`, with a `classify(text)` that returns `(kind, data)` for each header line. Kinds are `q`, `ms`, `stem` or `boundary`. `q` and `ms` need an `id`. `q` and `stem` need a `stem_key` of `(set, paper, question number)`, if the source has stems.
2. Add a profile in `convert.py` with the file glob, the classifier and the two output paths.
3. Add a constants module like `cs-past-papers.js` and a dev preview.
4. Run the conversion and check it as in section 5.

`pipeline.py` does not need to change for a new board, as long as its source puts the headers in the text layer.

## 8. Still to do

- Map each Computer Science question to a chapter, so the chapter view can use them.
- Add a Computer Science past-papers view, based on `PastPapers.jsx`, and point the exam-questions page at the new list.
- Look at the 31 tall parts and fix the parts that are missing headers, if the source can be read another way.
