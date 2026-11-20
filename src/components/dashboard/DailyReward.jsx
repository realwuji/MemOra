import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import { useApp } from '@/context/AppProvider'
import { DAILY_REWARDS, dailyStatus } from '@/lib/daily'
import { fadeInUp } from '@/lib/motion'

/*
  The daily reward card: seven days in a row, XP that climbs each day.
  One tap a day. The logic is lib/daily.js; this only draws the run and
  calls claimDaily, then tells the page so the buddy can react
  (onClaimed).
*/
const SPARKS = Array.from({ length: 26 }, (_, i) => ({
  a: `${(i * 360) / 26}deg`,
  r: `${70 + ((i * 29) % 70)}px`,
  s: `${5 + ((i * 3) % 6)}px`,
  d: `${(i % 5) * 0.03}s`,
  c: ['var(--brand)', 'var(--flash)', 'var(--paper)', 'var(--quiz)'][i % 4],
}))

/* One-shot celebration fired from the claim button; remounts per claim. */
function ClaimBurst({ xp, week }) {
  return (
    <div className="dr-burst" aria-hidden="true">
      <span className="dr-shock" />
      <span className="dr-shock" style={{ animationDelay: '0.18s' }} />
      {week && <span className="dr-shock dr-shock-week" style={{ animationDelay: '0.36s' }} />}
      {SPARKS.map((p, i) => (
        <span key={i} className="dr-spark" style={{ '--a': p.a, '--r': week ? `calc(${p.r} * 1.6)` : p.r, '--s': p.s, '--d': p.d, '--c': p.c }} />
      ))}
      <span className="dr-float">+{xp} XP</span>
    </div>
  )
}

export default function DailyReward({ now, onClaimed }) {
  const { daily, claimDaily, showToast } = useApp()
  const status = dailyStatus(daily, now)
  const [burst, setBurst] = useState(null)

  const claim = () => {
    const r = claimDaily()
    if (!r) return
    showToast(r.completedWeek ? `+${r.xp} XP - seven days in a row!` : `+${r.xp} XP claimed`)
    setBurst({ id: Date.now(), xp: r.xp, week: !!r.completedWeek })
    onClaimed?.(r)
  }

  return (
    <motion.section variants={fadeInUp} className="card dr-card relative overflow-hidden p-5" aria-label="Daily reward">
      <AnimatePresence>{burst && <ClaimBurst key={burst.id} xp={burst.xp} week={burst.week} />}</AnimatePresence>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-fg">Daily reward</h2>
          <p className="text-xs text-muted">
            {status.claimedToday
              ? `Day ${status.day} taken - back tomorrow for +${DAILY_REWARDS[status.day % 7]} XP`
              : status.streakKept
                ? `Day ${status.day} of 7 is ready`
                : 'The run restarted - day 1 is ready'}
          </p>
        </div>
        <Icon name="star" className={`h-6 w-6 shrink-0 text-paper ${status.claimedToday ? '' : 'dr-star'}`} />
      </div>

      <ol className="mt-4 grid grid-cols-7 gap-1.5" aria-label="Seven-day run">
        {DAILY_REWARDS.map((xp, i) => {
          const day = i + 1
          const done = status.claimedToday ? day <= status.day : day < status.day
          const today = day === status.day
          return (
            <li
              key={day}
              className={`reward-day ${done ? 'reward-day-done' : ''} ${today && !status.claimedToday ? 'reward-day-today' : ''} ${
                day === 7 ? 'reward-day-seven' : ''
              }`}
              title={`+${xp} XP`}
              aria-current={today ? 'date' : undefined}
            >
              {done ? <Icon name="check" className="h-3.5 w-3.5" /> : day === 7 ? <Icon name="star" className="h-3.5 w-3.5" /> : `+${xp}`}
            </li>
          )
        })}
      </ol>

      <div className="mt-4">
        {status.claimedToday ? (
          <p className="flex items-center gap-2 text-sm font-semibold text-muted">
            <Icon name="check" className="h-4 w-4 text-r3-solid" />
            Claimed today
          </p>
        ) : (
          <Button size="sm" onClick={claim} className="dr-claim w-full">
            <Icon name="sparkles" className="h-4 w-4" />
            Claim +{status.xp} XP
          </Button>
        )}
      </div>
    </motion.section>
  )
}
