/*
  Accessible progress bar, drawn as a row of cells like a load meter (the
  server design language, src/server.css). Pass `value` (0..1). Optional
  visible `label`.
  Announces progress to screen readers via role="progressbar".
*/
export default function ProgressBar({ value = 0, label, className = '' }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100)

  return (
    <div className={className}>
      {label && (
        <div className="mb-1.5 flex justify-between text-sm font-medium text-muted">
          <span>{label}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progress'}
        className="srv-bar w-full"
      >
        <div
          className="srv-bar-fill"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
