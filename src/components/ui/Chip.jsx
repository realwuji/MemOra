import { Link } from 'react-router-dom'

/*
  The one selectable pill used across the app - subject pickers, technique
  pickers, exam-paper pickers, filters, settings choices, mark tallies.

  Before this existed each of those was hand-rolled, and they had drifted to
  seven different combinations of padding, text size and selected-state
  colour, which is what made the app feel like separate pages stitched
  together rather than one product.

  Props:
    - selected: filled brand treatment vs hairline outline
    - size: 'sm' | 'md'  (default 'md')
    - as / to: render as a router Link instead of a button
    - disabled: greyed and non-interactive (also used for "no content here")
*/
const sizes = {
  sm: 'px-3 py-1 text-xs gap-1.5',
  md: 'px-3.5 py-1.5 text-sm gap-1.5',
}

export default function Chip({
  selected = false,
  quiet = false,
  size = 'md',
  as,
  to,
  disabled = false,
  className = '',
  children,
  ...rest
}) {
  const base = `srv-chip inline-flex items-center justify-center rounded-md border font-medium transition-colors ${sizes[size]}`

  const state = disabled
    ? 'cursor-not-allowed border-line bg-surface text-muted opacity-40'
    : selected
      ? 'border-brand bg-brand text-on-brand'
      : quiet ? 'border-line bg-surface text-fg' : 'btn-charge border-line bg-surface text-fg'

  // an unselected chip carries the same charged hover as a button (selected ones are already filled)
  const charged = !quiet && !disabled && !selected
  const inner = charged ? (
    <>
      <span className="btn-charge-current" aria-hidden="true" />
      <span className="btn-charge-cover" aria-hidden="true" />
      <span className="btn-charge-label inline-flex items-center gap-1.5">{children}</span>
    </>
  ) : (
    children
  )

  const cls = `${base} ${state} ${className}`

  if (to && !disabled) {
    const Component = as || Link
    return (
      <Component to={to} className={cls} {...rest}>
        {inner}
      </Component>
    )
  }

  return (
    <button type="button" disabled={disabled} className={cls} {...rest}>
      {inner}
    </button>
  )
}
