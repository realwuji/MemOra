import { useCallback, useEffect, useMemo, useState } from 'react'
import BankCanvas from '@/components/ui/BankCanvas'
import Icon from '@/components/ui/Icon'
import { BANK_SECTIONS } from '@/constants/dr-notes'
import { familyOf, scopeOf } from '@/constants/dr-bank'

/*
  The top of the diagram bank: one random diagram, large. It draws itself, holds for
  about three seconds, then hands over to the next. Hover a curve to see what shifts
  it, or a shaded area to see what it is; while the pointer is on the drawing it stays
  put so the tip can be read. The next three are shown below it, and any of them can be
  picked. With reduced motion nothing moves on its own: "Next" steps through.

    <DiagramShowcase pool={slides} counts={{ Costs: 21 }} onOpen={(id) => ...} />
*/
const calm = () => typeof window !== 'undefined' && Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
const shuffled = (list) => {
  const a = [...list]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function DiagramShowcase({ pool, counts, onOpen }) {
  const key = pool.map((s) => s.id).join(',')
  // A new search or part of the course is a new shuffle.
  const order = useMemo(() => shuffled(pool.map((s) => s.id)), [key]) // eslint-disable-line react-hooks/exhaustive-deps
  const byId = useMemo(() => new Map(pool.map((s) => [s.id, s])), [pool])
  const [at, setAt] = useState(0)
  const [done, setDone] = useState(false)
  const [hot, setHot] = useState(false)
  useEffect(() => {
    setAt(0)
    setDone(false)
  }, [key])

  const idx = order.length ? at % order.length : 0
  const slide = byId.get(order[idx])
  const go = useCallback(
    (steps) => {
      setAt((a) => a + steps)
      setDone(false)
    },
    [],
  )
  useEffect(() => {
    if (!done || hot || calm()) return undefined
    const t = setTimeout(() => go(1), 1400)
    return () => clearTimeout(t)
  }, [done, hot, go, at])
  const onDone = useCallback(() => setDone(true), [])

  if (!slide) return null
  const family = familyOf(slide.id)
  const sec = BANK_SECTIONS.find((x) => x.family === family)
  const upcoming = [1, 2, 3].map((k) => byId.get(order[(idx + k) % order.length])).filter((s, i, a) => s && s.id !== slide.id && a.findIndex((x) => x.id === s.id) === i)

  return (
    <section className="db-show" aria-label="A random diagram">
      <div className="srv-titlebar">
        <span className="leds" aria-hidden="true">
          <i className="srv-led" />
          <i className="srv-led" />
          <i className="srv-led" />
        </span>
        <span className="path">~/economics/#{slide.id}</span>
        <span className="db-readout">
          {done ? 'Holding' : 'Drawing'} · {scopeOf(family)} · {sec?.theme}
        </span>
      </div>
      <div className="db-show-body">
        <div className="db-show-canvas" onPointerEnter={() => setHot(true)} onPointerLeave={() => setHot(false)}>
          <BankCanvas key={slide.id} slide={slide} autoplay caption={false} onDone={onDone} />
        </div>
        <div className="db-show-info">
          <p className="db-label">{sec?.title}</p>
          <h3>{slide.title}</h3>
          <p className="db-show-cap">{slide.caption}</p>
          <dl className="db-facts">
            <div>
              <dt>Diagram</dt>
              <dd>#{slide.id}</dd>
            </div>
            <div>
              <dt>Part</dt>
              <dd>{scopeOf(family)}</dd>
            </div>
            <div>
              <dt>Theme</dt>
              <dd>{sec?.theme.replace('Theme ', '')}</dd>
            </div>
            <div>
              <dt>In this topic</dt>
              <dd>{counts[family]} diagrams</dd>
            </div>
          </dl>
          {upcoming.length > 0 && (
            <div className="db-up">
              <p className="db-label">Up next</p>
              <div className="db-up-row">
                {upcoming.map((s, i) => (
                  <button key={s.id} type="button" className="db-up-item" onClick={() => go(i + 1)} aria-label={`Show diagram ${s.id}: ${s.title}`}>
                    <span className="db-up-art">
                      <BankCanvas slide={s} autoplay={false} bare />
                    </span>
                    <span className="db-up-no">#{s.id}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="db-show-acts">
            <button type="button" className="dr-btn" onClick={() => go(1)}>
              Next
            </button>
            <button type="button" className="dr-btn dr-btn-primary" onClick={() => onOpen(slide.id)}>
              Open diagram
              <Icon name="arrowRight" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
