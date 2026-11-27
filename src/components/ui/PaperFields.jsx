import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import '@fontsource-variable/caveat'
import { fieldScale, groupAreas } from '@/lib/answerBlocks'

/*
  Type straight onto the question paper.

  A question image is a printed page, so the places a student writes (the empty cells of a truth table,
  a trace table, a row of dots, a ruled line) are part of the picture. scripts/pastpapers/
  detect_answer_areas.py finds them once, and this lays a transparent text field over each, in the
  handwriting face, so a keyboard user can fill a table or write on the printed lines. It is optional
  and additive: the working pad below the question and the pen are untouched, nothing is drawn on the
  image itself, and a student who ignores it sees only the paper.

  q.areas is [[x, y, w, h, kind], ...] in per mille of the image's own width and height (kind 0 = a table
  cell or box, 1 = an answer line). Lines that belong together are grouped (lib/answerBlocks.js): the two
  dotted lines under "Data bus", or the ten of an essay, are ONE text area whose text wraps from each line on
  to the next, with a printed label's width kept clear on the first line. A table cell is its own field. Sizes are exact for any display width: the wrapper is a CSS container
  and the text is sized in container-width units from the area's real pixel height, so a field's text
  stays in proportion to its cell on a phone and on a desktop.

  The page is dark ink on white in every theme (the scan is forced white, see .exam-sheet-scan), so the
  typed ink is a fixed dark blue-black, not the theme's text colour (which is white in the dark theme).

  Typed text is kept for the browser SESSION only (sessionStorage), like the pad: it survives a reload
  and is gone when the tab closes (the state lives in hooks/usePaperFields.js). Enter moves to the next
  field, so a table can be filled in a row.
*/
const IMG_W = 1060 // every converted question image is this wide (see examconversion.md)
const omit = (o, k) => Object.fromEntries(Object.entries(o).filter(([key]) => key !== k))
// The font for a field drawn at scale k (see fieldScale): a real 16px, shrunk by the transform.
const scaled = (k, fs) => (k < 1 ? { fontSize: '16px', transform: `scale(${k.toFixed(4)})`, transformOrigin: '0 0' } : { fontSize: cq(fs) })
const cq = (px) => `${((px / IMG_W) * 100).toFixed(3)}cqw`

// One written answer. Its text wraps over the printed dotted lines; if the student writes more than the
// lines hold, the area grows by whole lines instead of scrolling, so nothing is ever hidden (the paper
// below is blank space or the next part, never the answer).
function Block({ item, pitch, fs, k, indent, height, forwardRef, ...rest }) {
  const el = useRef(null)
  const value = rest.value
  useLayoutEffect(() => {
    const t = el.current
    if (!t) return
    t.style.height = '' // back to the printed lines, then measure
    const line = parseFloat(getComputedStyle(t).lineHeight) || 1
    const lines = Math.max(item.n, Math.round(t.scrollHeight / line))
    if (lines > item.n) t.style.height = `${lines * line}px`
  }, [value, item.n])
  const top = (((item.dots / 1000) * height - pitch + pitch * 0.3) / height) * 100
  return (
    <textarea
      {...rest}
      ref={(n) => {
        el.current = n
        forwardRef?.(n)
      }}
      className="paper-field is-block"
      style={{
        left: `${item.left / 10}%`,
        width: `${(item.right - item.left) / 10 / k}%`,
        top: `${top}%`,
        height: `${(((item.n * pitch) / height) * 100) / k}%`,
        ...scaled(k, fs),
        lineHeight: cq(pitch / k),
        textIndent: cq(((indent / 1000) * IMG_W) / k),
      }}
      rows={item.n}
      aria-label={`Written answer, ${item.n} ${item.n === 1 ? 'line' : 'lines'}`}
    />
  )
}

export default function PaperFields({ areas, height, fields }) {
  const refs = useRef([])
  const items = useMemo(() => groupAreas(areas), [areas])
  // The paper's displayed width, to keep every field's font at 16px or more (see fieldScale).
  const [sheetW, setSheetW] = useState(0)
  useLayoutEffect(() => {
    const sheet = refs.current.find(Boolean)?.parentElement
    if (!sheet) return undefined
    const read = () => setSheetW(sheet.getBoundingClientRect().width)
    read()
    const ro = new ResizeObserver(read)
    ro.observe(sheet)
    return () => ro.disconnect()
  }, [items.length])
  if (!items.length) return null
  const py = (permille) => (permille / 1000) * height // per mille of the image height -> source pixels
  return items.map((it, k) => {
    const common = {
      ref: (el) => (refs.current[k] = el),
      value: fields.values[it.i] || '',
      onChange: (e) => fields.set(it.i, e.target.value),
      spellCheck: false,
      autoCapitalize: 'none',
      autoCorrect: 'off',
      autoComplete: 'off',
    }
    if (it.type === 'cell') {
      // A table cell is filled to about two thirds of its height, capped so a huge box does not get a huge letter.
      const fs = Math.min(py(it.h) * 0.72, 54)
      // A faint, repeatable tilt per field (never random on each render), so a column of answers reads as
      // written by hand and not as typeset: between -0.6 and +0.6 degrees.
      const tilt = (((it.i * 37) % 13) - 6) / 10
      const k = fieldScale(fs, sheetW)
      return (
        <input
          key={it.i}
          {...common}
          className="paper-field"
          style={{ left: `${it.x / 10}%`, top: `${it.y / 10}%`, width: `${it.w / 10 / k}%`, height: `${it.h / 10 / k}%`, '--tilt': `${tilt}deg`, ...(k < 1 ? { fontSize: '16px', transform: `rotate(${tilt}deg) scale(${k.toFixed(4)})`, transformOrigin: '0 0' } : { fontSize: cq(fs) }) }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              refs.current[k + 1]?.focus()
            }
          }}
          aria-label={`Answer box ${k + 1}`}
          enterKeyHint="next"
        />
      )
    }
    // A written answer: one text area over all of its lines. Each text line is one line pitch tall, so the
    // handwriting sits on the dots and the text wraps to the next dotted line by itself. The first line starts
    // after the printed label (indent). The area is shifted down so the writing's baseline rides just above the
    // dots, as a pen would.
    const pitch = py(it.pitch)
    const fs = Math.min(pitch * 0.64, 40)
    return <Block key={it.i} item={it} pitch={pitch} fs={fs} k={fieldScale(fs, sheetW)} indent={it.indent} height={height} forwardRef={common.ref} {...omit(common, 'ref')} />
  })
}
