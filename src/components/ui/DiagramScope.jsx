import { SCOPES } from '@/constants/dr-bank'

/*
  The Micro / Macro / All switch shared by the diagram bank and diagram
  revision. `counts` is how many diagrams (or questions) each choice holds, so a
  finished half is visible at a glance.
*/
export default function DiagramScope({ value, onChange, counts = {}, label = 'Show' }) {
  return (
    <div className="dr-scope" role="group" aria-label={label}>
      {SCOPES.map((s) => (
        <button key={s} type="button" aria-pressed={value === s} onClick={() => onChange(s)} className={`dr-scope-btn ${value === s ? 'is-on' : ''}`}>
          {s}
          {counts[s] !== undefined && <span>{counts[s]}</span>}
        </button>
      ))}
    </div>
  )
}
