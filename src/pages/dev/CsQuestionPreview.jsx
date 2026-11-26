import { useSearchParams } from 'react-router-dom'
import PastPaperQuestion from '@/components/ui/PastPaperQuestion'
import { CS_PAST_PAPER_QUESTIONS } from '@/constants/cs-past-papers'

// Dev only: converted Computer Science questions as the exam-questions page shows them.
// /dev/cs-questions?ids=1050,1052 (default: 1050 and 1052)
export default function CsQuestionPreview() {
  const [params] = useSearchParams()
  const ids = (params.get('ids') || '1050,1052').split(',')
  const list = ids.map((id) => CS_PAST_PAPER_QUESTIONS.find((q) => q.num === id)).filter(Boolean)
  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6">
      <h1 className="text-2xl font-bold text-fg">Computer Science question preview ({list.length})</h1>
      <ul className="space-y-6">
        {list.map((q) => (
          <PastPaperQuestion key={q.num} q={q} result={undefined} onMark={() => {}} showTopic={false} />
        ))}
      </ul>
    </div>
  )
}
