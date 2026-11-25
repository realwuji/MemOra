import { useSearchParams } from 'react-router-dom'
import BankCanvas from '@/components/ui/BankCanvas'
import { useBank, familyOf } from '@/constants/dr-bank'

// Dev only: slides of the diagram bank at their finished frame, for review.
// /dev/bank shows all of them; /dev/bank?ids=9,35,50 shows just those.
export default function BankGallery() {
  const bank = useBank()
  const [params] = useSearchParams()
  if (!bank) return <p className="p-8 text-muted">Loading...</p>
  const only = params.get('ids')?.split(',').map(Number)
  const slides = Object.values(bank).filter((s) => !only || only.includes(s.id))
  return (
    <div className={`${only ? "" : "bk-gallery"} mx-auto max-w-[1500px] p-4`}>
      <h1 className="text-2xl font-bold text-fg">Diagram bank ({slides.length})</h1>
      <div className={`mt-4 grid gap-6 ${only && only.length <= 1 ? 'md:grid-cols-1' : only ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
        {slides.map((s) => (
          <div key={s.id} data-slide={s.id}>
            <p className="mb-1 text-xs font-bold text-muted">
              #{s.id} · {familyOf(s.id)} · {s.title.slice(0, 70)}
            </p>
            <BankCanvas slide={s} autoplay={params.get('play') === '1'} areas={window.__areas?.[s.id]} />
          </div>
        ))}
      </div>
    </div>
  )
}
