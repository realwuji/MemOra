import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import Diagram from '@/components/diagrams'
import './notes.css'

/*
  Renders a note, splicing real diagram components into it, then dresses it.

  Notes are trusted, hand-authored HTML shipped in the source bundle (see
  constants/*-notes.js) - not user input - so dangerouslySetInnerHTML is safe
  here; there is no untrusted-content path into the string.

  Economics is examined through diagrams, so its notes carry markers of the
  form <div data-diagram="monopoly"></div> at the point each diagram is
  discussed. The HTML is split on the markers and the pieces interleaved:
  HTML chunk, diagram, HTML chunk.

  What this adds on top of the plain HTML, none of which touches the content:

    - tables become cards: the table is wrapped, every cell is labelled with
      its column heading, and on a phone a text table stacks into one card
      per row instead of scrolling sideways (a 5-column table of sentences
      cannot be read at 375px)
    - worked examples split into a question band and an answer band
    - everything fades up as it scrolls into view, table rows cascade in,
      list items arrive one after another (skipped for reduced motion)
    - a reading-progress bar, and a dot rail on wide screens that shows where
      you are in the chapter and jumps between sections

  The animation classes are only added from here, so with scripting off or
  reduced motion the note is simply visible.
*/
const DIAGRAM_MARKER = /<div\s+data-diagram="([a-z0-9-]+)"\s*><\/div>/gi

// <div class="worked"><strong>Worked example.</strong> Q<br><strong>Answer:</strong> A</div>
const WORKED =
  /<div class="worked"><strong>Worked example\.<\/strong>\s*([\s\S]*?)<br><strong>Answer:<\/strong>\s*((?:(?!<\/?div)[\s\S])*?)<\/div>/g

const decorate = (html) =>
  html.replace(
    WORKED,
    (_, q, a) =>
      `<div class="worked"><div class="w-q"><span class="w-tag">Worked example</span><div>${q}</div></div><div class="w-a"><span class="w-tag w-tag-a">Answer</span><div>${a}</div></div></div>`,
  )

function split(html) {
  const parts = []
  let last = 0
  let m
  DIAGRAM_MARKER.lastIndex = 0
  while ((m = DIAGRAM_MARKER.exec(html)) !== null) {
    if (m.index > last) parts.push({ type: 'html', value: html.slice(last, m.index) })
    parts.push({ type: 'diagram', value: m[1] })
    last = m.index + m[0].length
  }
  if (last < html.length) parts.push({ type: 'html', value: html.slice(last) })
  return parts
}

const wordCount = (html) => html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length

export default function NotesBody({ html }) {
  const rootRef = useRef(null)
  const barRef = useRef(null)
  const uid = useId().replace(/[^a-z0-9]/gi, '')
  const reduce = useReducedMotion()
  const [sections, setSections] = useState([])
  const [active, setActive] = useState(0)

  const decorated = useMemo(() => decorate(html), [html])
  const parts = useMemo(() => split(decorated), [decorated])
  const minutes = Math.max(1, Math.round(wordCount(html) / 210))

  // The content elements are memoised so React never re-renders them when the
  // progress state below changes: React 19 re-applies dangerouslySetInnerHTML
  // on every render, which would wipe the wrappers and classes added to the DOM.
  const content = useMemo(
    () =>
      parts.map((p, i) =>
        p.type === 'diagram' ? (
          <Diagram key={i} id={p.value} />
        ) : (
          // eslint-disable-next-line react/no-danger -- trusted static content, see comment above
          <div key={i} dangerouslySetInnerHTML={{ __html: p.value }} />
        ),
      ),
    [parts],
  )

  // Dress the DOM once the HTML is in. Idempotent, so StrictMode's second
  // pass and a re-render with the same html are harmless.
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const heads = [...root.querySelectorAll('h3')]
    heads.forEach((h, i) => {
      h.id = `${uid}-s${i}`
    })
    setSections(heads.map((h) => h.textContent.trim()))

    root.querySelectorAll('table').forEach((t) => {
      const heads2 = [...t.querySelectorAll('thead th')].map((th) => th.textContent.trim())
      const body = [...t.querySelectorAll('tbody td')]
      const avg = body.length ? body.reduce((n, c) => n + c.textContent.length, 0) / body.length : 0
      const cols = heads2.length || t.rows[0]?.cells.length || 0
      // Short numeric grids (schedules, index tables) stay tables; tables of
      // sentences are the ones that stack on a phone.
      const numeric = avg < 14 && cols >= 3
      t.dataset.cols = String(cols)
      t.dataset.kind = numeric ? 'numeric' : 'text'
      t.dataset.stack = !numeric && cols >= 3 ? '1' : '0'
      t.querySelectorAll('tbody tr').forEach((tr, ri) => {
        tr.style.setProperty('--i', String(Math.min(ri, 14)))
        ;[...tr.cells].forEach((td, ci) => td.setAttribute('data-label', heads2[ci] || ''))
      })
      if (!t.parentElement.classList.contains('table-wrap')) {
        const w = document.createElement('div')
        w.className = 'table-wrap'
        t.parentNode.insertBefore(w, t)
        w.appendChild(t)
      }
    })

    root.querySelectorAll('.exam-tip').forEach((el) => {
      if (/^\s*exam tip/i.test(el.textContent)) el.dataset.hasLabel = '1'
    })
    // Set the first sentence of a long plain-text paragraph heavier, so the
    // eye finds where the idea starts. Text only; paragraphs with markup
    // inside already have their own emphasis.
    root.querySelectorAll(':scope > div > p').forEach((p) => {
      if (p.classList.contains('exam-tip') || p.children.length || p.textContent.length < 260) return
      const m = p.textContent.match(/^.{25,}?[.!?:](?=\s)/)
      if (!m || m[0].length > 190) return
      const rest = p.textContent.slice(m[0].length)
      p.textContent = ''
      const lead = document.createElement('span')
      lead.className = 'lead'
      lead.textContent = m[0]
      p.append(lead, rest)
    })
    root.querySelectorAll('ul, ol').forEach((l) => {
      ;[...l.children].forEach((li, i) => li.style.setProperty('--i', String(Math.min(i, 12))))
    })

    if (reduce || typeof IntersectionObserver === 'undefined') return undefined

    // Diagrams draw themselves when they scroll into view: every un-dashed
    // stroke is normalised to length 1 so one CSS animation inks all of them.
    root.querySelectorAll('.dgm-figure svg').forEach((svg) => {
      let n = 0
      svg.querySelectorAll('path, line, polyline').forEach((el) => {
        if (el.closest('marker, defs, clipPath')) return
        const stroke = el.getAttribute('stroke')
        const fill = el.getAttribute('fill')
        if (!stroke || stroke === 'none' || el.getAttribute('stroke-dasharray')) return
        if (el.tagName !== 'line' && fill && fill !== 'none') return
        el.setAttribute('pathLength', '1')
        el.dataset.draw = '1'
        el.style.setProperty('--di', String(Math.min(n++, 14)))
      })
    })

    const targets = [...root.querySelectorAll(':scope > div > *, :scope > figure, :scope > .dgm-figure')].filter(
      (t) => t.classList.contains('dgm-figure') || !t.closest('.dgm-figure') || t.tagName === 'FIGURE',
    )
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('rv-in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )
    targets.forEach((t) => {
      t.classList.add('rv')
      io.observe(t)
    })
    return () => io.disconnect()
  }, [parts, reduce, uid])

  // Reading progress and the active section.
  useEffect(() => {
    const root = rootRef.current
    const bar = barRef.current
    if (!root || !bar) return undefined
    let raf = 0
    const tick = () => {
      raf = 0
      const r = root.getBoundingClientRect()
      const vh = window.innerHeight
      const total = Math.max(r.height - vh * 0.6, 1)
      const p = Math.min(1, Math.max(0, (vh * 0.2 - r.top) / total))
      bar.style.transform = `scaleX(${p})`
      let idx = 0
      root.querySelectorAll('h3').forEach((h, i) => {
        if (h.getBoundingClientRect().top < vh * 0.35) idx = i
      })
      setActive((prev) => (prev === idx ? prev : idx))
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    tick()
    return () => {
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [parts])

  const jump = (i) => {
    document.getElementById(`${uid}-s${i}`)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <>
      <div className="notes-progress" aria-hidden="true">
        <span ref={barRef} />
      </div>
      {sections.length > 2 && (
        <nav className="notes-rail" aria-label="Sections in this chapter">
          {sections.map((s, i) => (
            <button
              key={`${i}-${s}`}
              type="button"
              onClick={() => jump(i)}
              className={`notes-rail-dot ${i === active ? 'is-active' : ''}`}
              aria-label={s}
              aria-current={i === active ? 'true' : undefined}
            >
              <span className="notes-rail-label">{s}</span>
            </button>
          ))}
        </nav>
      )}
      <p className="notes-meta">
        {sections.length > 0 && <span>{sections.length} sections</span>}
        <span>{minutes} min read</span>
      </p>
      <div ref={rootRef} className="notes-content readable">
        {content}
      </div>
    </>
  )
}
