import { useEffect, useMemo, useRef, useState } from 'react'
import Icon from '@/components/ui/Icon'

/*
  "Jump to a topic" for the diagram bank. A button that shows the topic you are
  reading; open it, type a few letters of a topic (or a theme) and press Enter to
  go to the first match, or pick one. Topics are listed under their theme, with how
  many diagrams each holds.

    <TopicJump groups={[{ n, name, part, sections: [{ family, title, slides }] }]} active="Costs" onGo={(family) => ...} />
*/
export default function TopicJump({ groups, active, onGo }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const root = useRef(null)
  const input = useRef(null)

  const list = useMemo(() => {
    const t = q.trim().toLowerCase()
    return groups
      .map((g) => ({ ...g, sections: g.sections.filter((s) => !t || s.title.toLowerCase().includes(t) || s.family.toLowerCase().includes(t) || g.name.toLowerCase().includes(t)) }))
      .filter((g) => g.sections.length)
  }, [groups, q])
  const first = list[0]?.sections[0]
  const activeTitle = groups.flatMap((g) => g.sections).find((s) => s.family === active)?.title

  useEffect(() => {
    if (!open) return undefined
    const away = (e) => {
      if (!root.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', away)
    input.current?.focus()
    return () => document.removeEventListener('pointerdown', away)
  }, [open])

  const go = (family) => {
    setOpen(false)
    setQ('')
    onGo(family)
  }

  return (
    <div className="tj" ref={root}>
      <button type="button" className="tj-btn" aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen((o) => !o)}>
        <span className="tj-k">Jump to</span>
        <span className="tj-v">{activeTitle || 'Topics'}</span>
        <Icon name="chevronDown" className="h-4 w-4" />
      </button>
      {open && (
        <div className="tj-pop" role="dialog" aria-label="Jump to a topic" onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}>
          <div className="srv-titlebar">
            <span className="leds" aria-hidden="true">
              <i className="srv-led" />
              <i className="srv-led" />
              <i className="srv-led" />
            </span>
            <span className="path">~/economics/topics</span>
          </div>
          <label className="tj-search">
            <Icon name="search" className="h-4 w-4" />
            <input
              ref={input}
              type="search"
              value={q}
              placeholder="Find a topic"
              aria-label="Find a topic"
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && first) {
                  e.preventDefault()
                  go(first.family)
                }
              }}
            />
          </label>
          <div className="tj-list">
            {list.length === 0 ? (
              <p className="tj-none">No topic matches that.</p>
            ) : (
              list.map((g) => (
                <div key={g.n}>
                  <p className="tj-theme">
                    Theme {g.n} · {g.part}: {g.name}
                  </p>
                  {g.sections.map((s) => (
                    <button key={s.family} type="button" className={`tj-item ${s.family === active ? 'is-on' : ''}`} onClick={() => go(s.family)}>
                      <span>{s.title}</span>
                      <small>{s.slides.length}</small>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
