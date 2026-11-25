// Time allowed for a past paper, and clock text. Edexcel's own rate: 1.2 minutes a mark (100 marks in 2 hours).
export const allowedSeconds = (marks) => Math.round(marks * 1.2 * 60)

export const fmtClock = (s) => {
  const t = Math.abs(Math.round(s))
  const h = Math.floor(t / 3600)
  const m = Math.floor((t % 3600) / 60)
  const sec = t % 60
  const mm = String(m).padStart(2, '0')
  const ss = String(sec).padStart(2, '0')
  return `${s < 0 ? '-' : ''}${h > 0 ? `${h}:${mm}` : m}:${ss}`
}
