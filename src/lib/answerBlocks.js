/*
  Turns the answer areas found in a question image (scripts/pastpapers/detect_answer_areas.py) into what a
  student actually writes into.

  An area is [x, y, w, h, kind] in per mille of the image: kind 0 is a table cell or box, kind 1 is one
  dotted or ruled answer line. A written answer is almost never one line: "Data bus ........" has a second
  line under it, an essay has ten. If every line were its own field, the text would stop at the end of the
  first line instead of carrying on to the next, which is not how anyone writes. So consecutive lines that
  belong together are grouped into ONE block, and the block wraps its text across its lines.

  Lines belong together when, in reading order, the next line
    - starts no further right than the first (a printed label like "Data bus" indents only the FIRST line;
      a line indented more than that is a new labelled answer),
    - lines up with the block's left edge once there is a second line,
    - ends at about the same place (the last line may be short, a mark such as [3] sits at its end),
    - and is about one line pitch below, with no big gap (a gap means a different part of the question).

  groupAreas(areas) -> [{ type: 'cell', i, x, y, w, h }
                        | { type: 'block', i, n, left, right, indent, dots, pitch }]
    i       index of the first area (stable key for the stored text; the same as before grouping)
    dots    per-mille y of the FIRST line's dots (where the writing sits)
    pitch   per-mille distance between lines
    indent  per-mille the first line starts to the right of the block's left edge (the label)
*/
const X_TOL = 8 // per mille: the same left edge
const RIGHT_TOL = 40 // the last line is shorter by a mark label
const MAX_GAP = 2.4 // line pitch may not exceed this many line heights
const PITCH_TOL = [0.6, 1.5] // each gap relative to the previous one

const dotsOf = (a) => a[1] + a[3] + 2 // the line is just under the area (the area sits on top of it)

export function groupAreas(areas = []) {
  const items = []
  let cur = null
  const flush = () => {
    if (!cur) return
    const L = cur.lines
    const n = L.length
    const left = n > 1 ? Math.min(...L.slice(1).map((l) => l.a[0])) : L[0].a[0]
    const rights = L.map((l) => l.a[0] + l.a[2])
    const right = n > 1 ? Math.max(...rights.slice(0, -1)) : rights[0]
    const first = dotsOf(L[0].a)
    const pitch = n > 1 ? (dotsOf(L[n - 1].a) - first) / (n - 1) : L[0].a[3] * 1.5
    items.push({ type: 'block', i: L[0].i, n, left, right, indent: L[0].a[0] - left > X_TOL ? L[0].a[0] - left : 0, dots: first, pitch })
    cur = null
  }
  const continues = (line) => {
    const L = cur.lines
    const last = L[L.length - 1].a
    const a = line.a
    const gap = dotsOf(a) - dotsOf(last)
    if (gap <= 0 || gap > a[3] * MAX_GAP) return false
    if (L.length === 1) {
      if (a[0] > L[0].a[0] + X_TOL) return false
    } else {
      const left = Math.min(...L.slice(1).map((l) => l.a[0]))
      if (Math.abs(a[0] - left) > X_TOL) return false
      const prev = dotsOf(last) - dotsOf(L[L.length - 2].a)
      if (gap < prev * PITCH_TOL[0] || gap > prev * PITCH_TOL[1]) return false
    }
    const lastRight = last[0] + last[2]
    const firstRight = L[0].a[0] + L[0].a[2]
    return Math.abs(a[0] + a[2] - firstRight) <= RIGHT_TOL || Math.abs(a[0] + a[2] - lastRight) <= RIGHT_TOL
  }
  areas.forEach((a, i) => {
    if (a[4] !== 1) {
      flush()
      items.push({ type: 'cell', i, x: a[0], y: a[1], w: a[2], h: a[3] })
      return
    }
    const line = { i, a }
    if (cur && continues(line)) cur.lines.push(line)
    else {
      flush()
      cur = { lines: [line] }
    }
  })
  flush()
  return items
}

/*
  iPhone Safari zooms the whole page when a text field with a font under 16px gets focus, which would throw
  the typed text off the paper. The handwriting is smaller than that on a phone (the paper is shrunk to fit),
  so the field is given a 16px font and then scaled DOWN with a transform, which the zoom rule ignores. This is
  that scale: 1 when the text is already 16px or more, otherwise rendered size / 16.
    fs        the handwriting size in source image pixels
    sheetW    the paper's displayed width in CSS pixels
*/
export const fieldScale = (fs, sheetW, imgW = 1060, min = 16) => {
  if (!sheetW) return 1
  return Math.min(1, (fs * sheetW) / imgW / min)
}
