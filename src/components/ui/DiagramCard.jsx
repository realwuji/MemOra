import { useCallback, useEffect, useRef, useState } from 'react'
import BankCanvas from '@/components/ui/BankCanvas'
import Icon from '@/components/ui/Icon'

/*
  One diagram of the bank as a card: the finished drawing, large, in a viewfinder frame
  with nothing laid over it, and under it its number and its short name in full (an
  arrow shows on hover, so "open" never covers the drawing).

  The drawing draws itself, at the real pace, only while the card is pointed at or
  focused. For speed, at most three cards are ever being drawn at once: pointing at a
  fourth (sweeping across the grid, say) finishes the oldest. Until a card is near the
  screen it is a still placeholder.
*/
const MAX_DRAWING = 3
const inFlight = [] // the stop function of each card being drawn now, oldest first
const startDrawing = (stop) => {
  inFlight.push(stop)
  while (inFlight.length > MAX_DRAWING) inFlight.shift()()
}
const stopDrawing = (stop) => {
  const i = inFlight.indexOf(stop)
  if (i >= 0) inFlight.splice(i, 1)
}

export default function DiagramCard({ slide, onOpen, returned = false }) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  const [round, setRound] = useState(0)
  const [live, setLive] = useState(false)
  const halt = useCallback(() => setLive(false), [])
  useEffect(() => () => stopDrawing(halt), [halt])
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
      { rootMargin: '120px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const begin = () => {
    if (!seen || live) return
    setRound((n) => n + 1)
    setLive(true)
    startDrawing(halt)
  }
  const end = () => {
    stopDrawing(halt)
    setLive(false)
  }
  return (
    <button
      type="button"
      data-card={slide.id}
      className={`db-thumb ${returned ? 'is-returned' : ''} ${live ? 'is-drawing' : ''}`}
      onClick={onOpen}
      onPointerEnter={(e) => e.pointerType === 'mouse' && begin()}
      onPointerLeave={end}
      onFocus={begin}
      onBlur={end}
      aria-label={`Open diagram ${slide.id}: ${slide.title}`}
    >
      <span className="db-thumb-art" ref={ref}>
        {seen ? <BankCanvas key={round} slide={slide} autoplay={live} bare /> : <span className="db-thumb-ph" aria-hidden="true" />}
      </span>
      <span className="db-thumb-meta">
        <b>#{slide.id}</b>
        <span className="db-thumb-title">{slide.title}</span>
        <Icon name="arrowRight" className="db-thumb-go h-4 w-4" />
      </span>
    </button>
  )
}
