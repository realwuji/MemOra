import { useMemo, useState } from 'react'
import { BANK_SECTIONS } from '@/constants/dr-notes'
import { familyOf, inScope } from '@/constants/dr-bank'

/*
  A searchable list of diagrams, grouped by topic, each as its number and short
  name in full (never cut off with "..."). Used to switch diagram from inside
  the bank.

    <DiagramPicker slides={visibleSlides} scope="Micro" current={12} onPick={(id) => ...} />
*/
export default function DiagramPicker({ slides, scope = 'All', current = null, onPick, autoFocus = false, className = '' }) {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase().replace(/^#/, '')

  const groups = useMemo(() => {
    const matches = slides.filter((s) => {
      const f = familyOf(s.id)
      if (!inScope(scope, f)) return false
      return !q || s.title.toLowerCase().includes(q) || s.caption.toLowerCase().includes(q) || f.toLowerCase().includes(q) || String(s.id) === q
    })
    return BANK_SECTIONS.map((sec) => ({ ...sec, slides: matches.filter((s) => familyOf(s.id) === sec.family) })).filter((g) => g.slides.length)
  }, [slides, scope, q])

  return (
    <div className={`dp ${className}`}>
      <input
        type="search"
        className="db-search dp-search"
        placeholder="Search by name, topic or number"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search diagrams"
        autoFocus={autoFocus}
      />
      {groups.length === 0 ? (
        <p className="dp-empty">No diagram matches that. Try another word or a number.</p>
      ) : (
        <div className="dp-list">
          {groups.map((g) => (
            <section key={g.family} className="dp-group" aria-label={g.title}>
              <h4>{g.title}</h4>
              <ul>
                {g.slides.map((s) => (
                  <li key={s.id}>
                    <button type="button" className={`dp-item ${current === s.id ? 'is-on' : ''}`} aria-current={current === s.id ? 'true' : undefined} onClick={() => onPick(s.id)}>
                      <b>#{s.id}</b>
                      <span>{s.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
