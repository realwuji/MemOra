import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from '@/components/ui/Icon'
import { quoteForDay, randomQuote } from '@/constants/quotes'
import { fadeInUp } from '@/lib/motion'

/*
  The line of the day, under the banner. The quote is picked by date so it
  stays put all day; "another" shuffles without saving.
*/
export default function DailyQuote({ now }) {
  const [quote, setQuote] = useState(() => quoteForDay(now))

  return (
    <motion.section
      variants={fadeInUp}
      className="rounded-2xl border border-line bg-surface/70 px-5 py-4 sm:px-6"
      aria-label="Quote of the day"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.figure
          key={quote.text}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="flex items-start gap-3"
        >
          <div className="min-w-0 flex-1">
            <blockquote className="text-sm font-medium leading-snug text-fg sm:text-base">
              &ldquo;{quote.text}&rdquo;
            </blockquote>
            <figcaption className="mt-1 text-xs text-muted">
              {quote.by}
              {quote.from ? ` · ${quote.from}` : ''}
            </figcaption>
          </div>
          <button
            type="button"
            onClick={() => setQuote((q) => randomQuote(q))}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-brand-soft hover:text-brand-strong"
            aria-label="Another quote"
            title="Another"
          >
            <Icon name="shuffle" className="h-4 w-4" />
          </button>
        </motion.figure>
      </AnimatePresence>
    </motion.section>
  )
}
