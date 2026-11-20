import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import BankCanvas from '@/components/ui/BankCanvas'
import Icon from '@/components/ui/Icon'
import { BANK_SECTIONS, sectionFor } from '@/constants/dr-notes'
import { MOVES } from '@/constants/dr-moves'
import { familyOf, useBank } from '@/constants/dr-bank'
import { FIXES } from '@/data/diagram-fixes'
import { prepare } from '@/lib/bankEngine'
import { studyPathFor } from '@/lib/techniques'
import './notes.css'
import './diagram-bank.css'

/*
  Diagram bank: every diagram from the teacher's slides, in the order the notes
  teach them.

  The list is grouped by topic (production possibility frontier, demand and
  supply, elasticity ... through to trade), each group named after its notes
  chapters. Hover a diagram and it says "Take a look"; click and it opens in
  depth: the diagram drawn axes first, then curves, then equilibrium, then its
  title; hover any curve to see what shifts it; and the passage of your notes
  that explains it. Every diagram carries its number (#157) so a mistake can be
  reported by number.
*/

const OPEN = 'd'

// Shown while the thumbnails scroll into view, then drawn finished.
function Thumb({ slide, onOpen }) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setSeen(true)
      return undefined
    }
    const io = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) {
          setSeen(true)
          io.disconnect()
        }
      },
      { rootMargin: '300px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <button type="button" className="db-thumb" onClick={onOpen} aria-label={`Take a look: diagram ${slide.id}, ${slide.title}`}>
      <span className="db-thumb-art" ref={ref}>
        {seen ? <BankCanvas slide={slide} autoplay={false} bare /> : <span className="db-thumb-ph" aria-hidden="true" />}
        <span className="db-thumb-over" aria-hidden="true">
          <span>
            Take a look
            <Icon name="arrowRight" className="h-4 w-4" />
          </span>
        </span>
      </span>
      <span className="db-thumb-meta">
        <b>#{slide.id}</b>
        <span>{slide.title}</span>
      </span>
    </button>
  )
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

function Detail({ slide, notes, prev, next, onBack, onOpen }) {
  const curves = useMemo(() => curvesOf(slide), [slide])
  const section = useMemo(() => sectionFor(slide.id, notes), [slide.id, notes])
  const family = familyOf(slide.id)
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    window.scrollTo({ top: 0 })
    setCopied(false)
  }, [slide.id])
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
        <div className="db-pager">
          <button type="button" className="dr-btn" disabled={!prev} onClick={() => prev && onOpen(prev.id)}>
            <Icon name="arrowLeft" className="h-4 w-4" />
            Previous
          </button>
          <button type="button" className="dr-btn" disabled={!next} onClick={() => next && onOpen(next.id)}>
            Next
            <Icon name="arrowRight" className="h-4 w-4" />
          </button>
        </div>
      </div>

      <header className="db-detail-head">
        <span className="db-number">#{slide.id}</span>
        <div>
          <p className="dr-eyebrow">{family}</p>
          <h2 className="db-detail-title">{slide.title}</h2>
        </div>
      </header>

      <div className="db-detail">
        <div className="db-detail-main">
          <BankCanvas key={slide.id} slide={slide} />
          <p className="db-hint">
            <Icon name="target" className="h-4 w-4" />
            Hover a curve to see what shifts it.
          </p>

          {curves.length > 0 && (
            <section className="db-panel">
              <h3>What shifts each curve</h3>
              <div className="db-moves">
                {curves.map((c) => (
                  <div key={c.base} className="db-move" style={{ '--c': `var(--dr-${c.colour === 'ink' ? 'white' : c.colour})` }}>
                    <b>{c.label}</b>
                    <ul>
                      {c.moves.map((m) => (
                        <li key={m}>{m}</li>
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
            <h3>From your notes</h3>
            {section ? (
              <>
                <p className="db-notes-ref">
                  {section.chapter}
                  {section.heading ? ` · ${section.heading}` : ''}
                </p>
                {section.html && <div className="notes-content readable db-notes" dangerouslySetInnerHTML={{ __html: section.html }} />}
                <Link className="db-notes-link" to={studyPathFor('Economics', section.chapter, 'notes')}>
                  Read the whole chapter
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
  const [family, setFamily] = useState('All')
  const scrollAt = useRef(0)

  // Every diagram in teaching order: by section, then by number.
  const ordered = useMemo(() => {
    if (!bank) return []
    const slides = Object.values(bank)
    const rank = new Map(BANK_SECTIONS.map((s, i) => [s.family, i]))
    return slides.sort((a, b) => (rank.get(familyOf(a.id)) ?? 99) - (rank.get(familyOf(b.id)) ?? 99) || a.id - b.id)
  }, [bank])

  const openId = Number(params.get(OPEN)) || null
  const open = openId && bank ? bank[openId] : null
  const openIndex = open ? ordered.findIndex((s) => s.id === open.id) : -1

  const show = (id) => {
    if (!open) scrollAt.current = window.scrollY
    setParams({ [OPEN]: String(id) })
  }
  const back = () => {
    setParams({})
    requestAnimationFrame(() => window.scrollTo({ top: scrollAt.current }))
  }

  const q = query.trim().toLowerCase().replace(/^#/, '')
  const list = ordered.filter((s) => {
    const f = familyOf(s.id)
    return (family === 'All' || f === family) && (!q || s.title.toLowerCase().includes(q) || f.toLowerCase().includes(q) || String(s.id) === q)
  })
  const sections = BANK_SECTIONS.map((sec) => ({ ...sec, slides: list.filter((s) => familyOf(s.id) === sec.family) })).filter((sec) => sec.slides.length)
  const counts = useMemo(() => {
    const c = {}
    ordered.forEach((s) => {
      const f = familyOf(s.id)
      c[f] = (c[f] || 0) + 1
    })
    return c
  }, [ordered])

  if (open) {
    return <Detail slide={open} notes={notes} prev={ordered[openIndex - 1]} next={ordered[openIndex + 1]} onBack={back} onOpen={show} />
  }

  return (
    <div className="db-root">
      <p className="dr-eyebrow">Economics</p>
      <h2 className="dr-title">Diagram bank</h2>
      <p className="mt-1 max-w-2xl text-muted">
        Every diagram in the course{bank ? ` (${ordered.length})` : ''}, in the order your notes teach them. Hover one and click Take a look to see it drawn, what shifts each curve, and the part of your notes that explains it.
      </p>

      <div className="db-filters">
        <input
          type="search"
          className="db-search"
          placeholder="Search by topic, name or number (for example monopoly, tariff, 157)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search diagrams"
        />
        <div className="dr-topics" role="group" aria-label="Topic">
          <button type="button" onClick={() => setFamily('All')} className={`dr-topic ${family === 'All' ? 'is-on' : ''}`}>
            All topics
            <span>{ordered.length}</span>
          </button>
          {BANK_SECTIONS.filter((s) => counts[s.family]).map((s) => (
            <button key={s.family} type="button" onClick={() => setFamily(s.family)} className={`dr-topic ${family === s.family ? 'is-on' : ''}`}>
              {s.title}
              <span>{counts[s.family]}</span>
            </button>
          ))}
        </div>
      </div>

      {!bank ? (
        <p className="mt-6 text-muted">Loading the bank...</p>
      ) : sections.length === 0 ? (
        <p className="mt-6 text-muted">No diagram matches that. Try another word, a number, or All topics.</p>
      ) : (
        sections.map((sec) => (
          <section key={sec.family} className="db-section">
            <header className="db-section-head">
              <div>
                <p className="db-theme">{sec.theme}</p>
                <h3>{sec.title}</h3>
              </div>
              <p className="db-section-meta">
                {sec.slides.length} {sec.slides.length === 1 ? 'diagram' : 'diagrams'}
                <span>Notes: {sec.chapters.join(' · ')}</span>
              </p>
            </header>
            <div className="db-grid">
              {sec.slides.map((s) => (
                <Thumb key={s.id} slide={s} onOpen={() => show(s.id)} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  )
}
