import { useEffect, useRef, useState } from 'react'
import BankCanvas from '@/components/ui/BankCanvas'
import { useBank } from '@/constants/dr-bank'

/*
  A diagram from the bank, placed in a note (or anywhere else). It only starts
  drawing when it scrolls into view, so the pen is seen, not missed.
*/
function One({ slide, quiz, hover }) {
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
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className="bk-slot">
      {seen ? <BankCanvas slide={slide} quiz={quiz} hover={hover} /> : <div className="bk-placeholder" aria-hidden="true" />}
    </div>
  )
}

export default function BankDiagram({ ids, quiz = false, hover = null }) {
  const bank = useBank()
  if (!bank) return <div className="bk-placeholder" aria-hidden="true" />
  return (
    <>
      {ids.map((id) => (bank[id] ? <One key={id} slide={bank[id]} quiz={quiz} hover={hover} /> : null))}
    </>
  )
}
