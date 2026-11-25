import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import BankCanvas from '@/components/ui/BankCanvas'
import DiagramCard from '@/components/ui/DiagramCard'
import DiagramPicker from '@/components/ui/DiagramPicker'
import DiagramScope from '@/components/ui/DiagramScope'
import DiagramShowcase from '@/components/ui/DiagramShowcase'
import TopicJump from '@/components/ui/TopicJump'
import Icon from '@/components/ui/Icon'
import { subjectColor } from '@/constants/content'
import { BANK_SECTIONS, THEME_NAMES, chapterFor, sectionFor } from '@/constants/dr-notes'
import { MOVES } from '@/constants/dr-moves'
import { familyOf, inScope, scopeOf, useBank } from '@/constants/dr-bank'
import { AREAS } from '@/data/diagram-areas'
import { FIXES } from '@/data/diagram-fixes'
import useDiagramScope from '@/hooks/useDiagramScope'
import { prepare } from '@/lib/bankEngine'
import jumpToTop, { jumpTo } from '@/lib/jumpToTop'
import { studyPathFor } from '@/lib/techniques'
import './notes.css'
import './diagram-bank.css'

/*
  Diagram bank: every diagram from the teacher's slides, in the order the notes
  teach them.

  The page opens on a random diagram that draws itself, holds for a few seconds
  and hands over to the next (hover a curve to see what shifts it; it waits while
  you do). Under it, a search and an All / Micro / Macro switch, an index that
  follows you down the page, and the four themes of the course as rack panels,
  each holding its topics as grids of cards. A card draws itself when it scrolls
  into view and again when you point at it, and carries its number (#157) and its
  short name in full so a mistake can be reported by number. Open one and it is
  drawn axes first, then curves, then equilibrium; hover a curve to see what shifts
  it, or a shaded area to see what it is; and the passage of your notes that
  explains it is one click away. Coming back from a diagram lands you on its card,
  not at the top of the list.
*/

const OPEN = 'd'

// "Income (normal goods right, inferior left)" and "Related goods: dearer substitute right" read better as a
// cause with its direction beneath, so each line is split into the two.
function splitMove(text) {
  const paren = text.match(/^(.*?)\s*\((.*)\)$/)
  if (paren) return { main: paren[1], note: paren[2] }
  const colon = text.match(/^([^:]+):\s*(.+)$/)
  if (colon) return { main: colon[1], note: colon[2] }
  return { main: text, note: '' }
}

// The curves of a diagram that something can shift, once each, for the "what shifts it" list.
function curvesOf(slide) {
  const prep = prepare(slide, FIXES[slide.id])
  const seen = new Set()
  const out = []
  prep.items
    .filter((it) => it.k === 's' && it.base && MOVES[it.base])
    .forEach((it) => {
      if (seen.has(it.base)) return
      seen.add(it.base)
      out.push({ base: it.base, label: it.label.replace(/\s*\d$/, '') || it.base, colour: it.c, moves: MOVES[it.base] })
    })
  return out
}

/*
  The one idea of a notes section, in a sentence or two: its first plain
  paragraph, cut at a sentence end (never mid-sentence, never with "..."). The
  tables, callouts and diagrams of the section are the notes' job; this panel
  only says what the diagram is for, and links to the rest.
*/
function keyIdea(html) {
  if (!html || typeof DOMParser === 'undefined') return ''
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html')
  doc.querySelectorAll('table, .exam-tip, .defn, .worked, .det, [data-diagram], figure').forEach((n) => n.remove())
  const first = [...doc.querySelectorAll('p, li')].map((n) => n.textContent.replace(/\s+/g, ' ').trim()).find((t) => t.length > 40)
  if (!first) return ''
  const sentences = first.match(/[^.!?]+[.!?]+(\s|$)/g) || [first]
  let out = ''
  for (const s of sentences) {
    if (out && (out + s).length > 260) break
    out += s
  }
  return out.trim()
}

function Detail({ slide, notes, scope, pool, visible, onBack, onOpen }) {
  const curves = useMemo(() => curvesOf(slide), [slide])
  const areas = AREAS[slide.id] || []
  const section = useMemo(() => sectionFor(slide.id, notes), [slide.id, notes])
  const idea = useMemo(() => keyIdea(section?.html), [section])
  const chapter = section?.chapter || chapterFor(slide.id)?.chapter
  const family = familyOf(slide.id)
  const index = pool.findIndex((s) => s.id === slide.id)
  const prev = pool[index - 1]
  const next = pool[index + 1]
  const [copied, setCopied] = useState(false)
  const [jump, setJump] = useState(false)
  const pagerRef = useRef(null)

  useEffect(() => {
    jumpToTop()
    setCopied(false)
    setJump(false)
  }, [slide.id])

  // The switcher closes on Escape and on a click anywhere else.
  useEffect(() => {
    if (!jump) return undefined
    const onKey = (e) => e.key === 'Escape' && setJump(false)
    const onDown = (e) => pagerRef.current && !pagerRef.current.contains(e.target) && setJump(false)
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [jump])

  const copy = () => {
    try {
      navigator.clipboard?.writeText(`Diagram #${slide.id}: `)
      setCopied(true)
    } catch {
      /* no clipboard: the number is on screen */
    }
  }

  return (
    <div className="db-root">
      <div className="db-bar">
        <button type="button" className="ep-back" onClick={onBack}>
          ← All diagrams
        </button>
        <div className="db-pager" ref={pagerRef}>
          <button type="button" className="dr-btn" aria-expanded={jump} onClick={() => setJump((v) => !v)}>
            <Icon name="search" className="h-4 w-4" />
            Switch diagram
          </button>
          <button type="button" className="dr-btn" disabled={!prev} onClick={() => prev && onOpen(prev.id)}>
            <Icon name="arrowLeft" className="h-4 w-4" />
            Previous
          </button>
          <button type="button" className="dr-btn" disabled={!next} onClick={() => next && onOpen(next.id)}>
            Next
            <Icon name="arrowRight" className="h-4 w-4" />
          </button>
          {jump && (
            <div className="db-jump" role="dialog" aria-label="Switch diagram">
              <DiagramPicker slides={visible} scope={scope} current={slide.id} autoFocus onPick={(id) => onOpen(id)} />
            </div>
          )}
        </div>
      </div>

      <header className="db-detail-head">
        <span className="db-number">#{slide.id}</span>
        <div>
          <p className="dr-eyebrow">
            {scopeOf(family)} · {family}
          </p>
          <h2 className="db-detail-title">{slide.title}</h2>
        </div>
      </header>

      <div className="db-detail">
        <div className="db-detail-main">
          <BankCanvas key={slide.id} slide={slide} />
          <p className="db-hint">
            <Icon name="target" className="h-4 w-4" />
            {areas.length > 0 ? 'Hover a curve to see what shifts it, or a shaded area to see what it is.' : 'Hover a curve to see what shifts it.'}
          </p>

          {areas.length > 0 && (
            <section className="db-panel">
              <h3>In this diagram</h3>
              <dl className="db-areas">
                {areas.map((a) => (
                  <div key={`${a.tag || ''}-${a.name}`}>
                    <dt>{a.tag || '•'}</dt>
                    <dd>
                      {a.name}
                      {a.note && <small>{a.note}</small>}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {curves.length > 0 && (
            <section className="db-panel">
              <h3>What shifts each curve</h3>
              <div className="db-moves">
                {curves.map((c) => (
                  <div key={c.base} className="db-move" style={{ '--c': `var(--dr-${c.colour === 'ink' ? 'white' : c.colour})` }}>
                    <b>{c.label}</b>
                    <ul>
                      {c.moves.map((m) => (
                        <li key={m}>
                          <span className="db-move-main">{splitMove(m).main}</span>
                          {splitMove(m).note ? <span className="db-move-note">{splitMove(m).note}</span> : null}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="db-detail-side">
          <section className="db-panel">
            <h3>In your notes</h3>
            {chapter ? (
              <>
                <p className="db-notes-ref">
                  {chapter}
                  {section?.heading ? ` · ${section.heading}` : ''}
                </p>
                {idea && <p className="db-notes-idea">{idea}</p>}
                <Link className="db-notes-link" to={studyPathFor('Economics', chapter, 'notes')}>
                  Read the topic
                  <Icon name="arrowRight" className="h-4 w-4" />
                </Link>
              </>
            ) : (
              <p className="text-muted">There is no section of your notes tied to this diagram yet.</p>
            )}
          </section>

          <section className="db-panel db-report">
            <h3>Spotted a mistake?</h3>
            <p>
              Tell me the number, <strong>#{slide.id}</strong>, and what looks wrong, and I will correct that diagram.
            </p>
            <button type="button" className="dr-btn" onClick={copy}>
              {copied ? 'Copied' : `Copy "Diagram #${slide.id}:"`}
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}

export default function DiagramBank({ notes }) {
  const bank = useBank()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [scope, setScope] = useDiagramScope()
  const [activeFamily, setActiveFamily] = useState(null)
  const [returned, setReturned] = useState(null)
  const lastId = useRef(null)

  // Every diagram that is shown, in teaching order: by section, then by number.
  const visible = useMemo(() => {
    if (!bank) return []
    const rank = new Map(BANK_SECTIONS.map((s, i) => [s.family, i]))
    return Object.values(bank)
      .filter((s) => !s.hidden)
      .sort((a, b) => (rank.get(familyOf(a.id)) ?? 99) - (rank.get(familyOf(b.id)) ?? 99) || a.id - b.id)
  }, [bank])

  // The list puts you back on the card you left (the effect below). The browser's own
  // scroll restore on Back fires after that and moves the list again, so it is
  // switched off while the bank is on screen.
  useEffect(() => {
    if (!('scrollRestoration' in window.history)) return undefined
    const before = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    return () => {
      window.history.scrollRestoration = before
    }
  }, [])

  const openId = Number(params.get(OPEN)) || null
  const open = openId && bank ? bank[openId] : null

  const show = (id) => {
    lastId.current = id
    setParams({ [OPEN]: String(id) })
  }
  const back = () => setParams({})
  useEffect(() => {
    if (open) lastId.current = open.id
  }, [open])

  const q = query.trim().toLowerCase().replace(/^#/, '')
  const scoped = useMemo(() => visible.filter((s) => inScope(scope, familyOf(s.id))), [visible, scope])
  const list = useMemo(
    () => scoped.filter((s) => !q || s.title.toLowerCase().includes(q) || s.caption.toLowerCase().includes(q) || familyOf(s.id).toLowerCase().includes(q) || String(s.id) === q),
    [scoped, q],
  )
  const sections = useMemo(
    () =>
      BANK_SECTIONS.map((sec) => {
        const slides = list.filter((s) => familyOf(s.id) === sec.family)
        return { ...sec, slides }
      }).filter((sec) => sec.slides.length),
    [list],
  )
  const counts = useMemo(() => ({ All: visible.length, Micro: visible.filter((s) => scopeOf(familyOf(s.id)) === 'Micro').length, Macro: visible.filter((s) => scopeOf(familyOf(s.id)) === 'Macro').length }), [visible])
  const railKey = sections.map((s) => s.family).join('|')

  // Which topic is on screen, for the index to light up.
  useEffect(() => {
    if (open || typeof IntersectionObserver === 'undefined') return undefined
    const els = [...document.querySelectorAll('.db-section[data-family]')]
    if (!els.length) return undefined
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActiveFamily(e.target.dataset.family)),
      { rootMargin: '-22% 0px -68% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [open, railKey])

  // Back from a diagram: land on its card, and ring it for a moment. Runs before
  // paint so the list never shows at the wrong place first.
  useLayoutEffect(() => {
    if (open || !bank) return undefined
    const id = lastId.current
    if (!id) return undefined
    const el = document.querySelector(`[data-card="${id}"]`)
    if (!el) return undefined
    jumpTo(el)
    setReturned(id)
    const t = setTimeout(() => setReturned(null), 2400)
    return () => clearTimeout(t)
  }, [open, bank])

  if (open) {
    const inPool = scoped.some((s) => s.id === open.id)
    return <Detail slide={open} notes={notes} scope={scope} pool={inPool ? scoped : visible} visible={visible} onBack={back} onOpen={show} />
  }

  // The four themes of the course, in the order of the chosen half: Micro is 1 and 3, Macro is 2 and 4.
  const themeOrder = scope === 'Micro' ? [1, 3] : scope === 'Macro' ? [2, 4] : [1, 3, 2, 4]
  const groups = themeOrder
    .map((n) => ({ n, name: THEME_NAMES[`Theme ${n}`], part: n === 1 || n === 3 ? 'Micro' : 'Macro', sections: sections.filter((s) => s.theme === `Theme ${n}`) }))
    .filter((g) => g.sections.length)
  const familyCounts = {}
  visible.forEach((s) => {
    const f = familyOf(s.id)
    familyCounts[f] = (familyCounts[f] || 0) + 1
  })
  const goTo = (family) => {
    const el = document.querySelector(`.db-section[data-family="${family}"]`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="db-root" style={{ '--subject': subjectColor('Economics') }}>
      <header className="db-head">
        <div>
          <p className="db-label">Economics</p>
          <h2 className="db-title">Diagram bank</h2>
          <p className="db-lede">Every diagram, in the order your notes teach them. Watch one drawn, see what shifts each curve and what each area is, then jump to the notes that explain it.</p>
        </div>
        <dl className="db-stats" aria-label="The bank in numbers">
          <div>
            <dt>Diagrams</dt>
            <dd>{bank ? visible.length : '...'}</dd>
          </div>
          <div>
            <dt>Topics</dt>
            <dd>{BANK_SECTIONS.length}</dd>
          </div>
          <div>
            <dt>Themes</dt>
            <dd>4</dd>
          </div>
        </dl>
      </header>

      <div className="db-toolbar">
        <DiagramScope value={scope} onChange={setScope} counts={counts} label="Show diagrams from" />
        <label className="db-search">
          <Icon name="search" className="h-4 w-4" />
          <input type="search" placeholder="Search by name, topic or number" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search diagrams" />
          {q && (
            <span className="db-found">
              {list.length} {list.length === 1 ? 'match' : 'matches'}
            </span>
          )}
        </label>
        {sections.length > 0 && <TopicJump groups={groups} active={activeFamily} onGo={goTo} />}
      </div>

      {!bank ? (
        <p className="mt-6 text-muted">Loading the bank...</p>
      ) : sections.length === 0 ? (
        <p className="mt-6 text-muted">No diagram matches that. Try another word, a number, or switch to All.</p>
      ) : (
        <>
          <DiagramShowcase pool={list} counts={familyCounts} onOpen={show} />
          <div className="db-layout">
            <div className="db-themes">
              {groups.map((g) => (
                <div key={g.n} className="db-rack" id={`theme-${g.n}`}>
                  <div className="srv-titlebar">
                    <span className="leds" aria-hidden="true">
                      <i className="srv-led" />
                      <i className="srv-led" />
                      <i className="srv-led" />
                    </span>
                    <span className="path">~/economics/theme-{g.n}</span>
                    <span className="db-readout">
                      {g.part} · {g.sections.reduce((n, s) => n + s.slides.length, 0)} diagrams
                    </span>
                  </div>
                  <div className="db-rack-head">
                    <span className="db-rack-no" aria-hidden="true">
                      {String(g.n).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="db-label">
                        Theme {g.n} · {g.part}
                      </p>
                      <h3>{g.name}</h3>
                    </div>
                    <span className="db-meter" aria-hidden="true">
                      {Array.from({ length: 10 }, (_, i) => (
                        <i key={i} className={i < Math.max(1, Math.round((g.sections.reduce((n, s) => n + s.slides.length, 0) / Math.max(1, list.length)) * 10)) ? 'on' : ''} />
                      ))}
                    </span>
                  </div>
                  {g.sections.map((sec, at) => (
                    <section key={sec.family} className="db-section" data-family={sec.family}>
                      <header className="db-section-head">
                        <h3>
                          <span className="db-topic-no">
                            {g.n}.{at + 1}
                          </span>
                          {sec.title}
                        </h3>
                        <p className="db-section-meta">
                          <b>
                            {sec.slides.length} {sec.slides.length === 1 ? 'diagram' : 'diagrams'}
                          </b>
                          <span>Notes: {sec.chapters.join(' · ')}</span>
                        </p>
                      </header>
                      <div className="db-grid">
                        {sec.slides.map((s) => (
                          <DiagramCard key={s.id} slide={s} returned={returned === s.id} onOpen={() => show(s.id)} />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
