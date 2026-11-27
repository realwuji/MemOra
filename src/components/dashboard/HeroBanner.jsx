import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Icon from '@/components/ui/Icon'
import Pfp from '@/components/ui/Pfp'
import Banner from '@/components/ui/Banner'
import { assessmentType } from '@/constants/assessments'
import { levelFromXp, nextReward, streakTier, nextStreakTier } from '@/lib/xp'
import { fadeInUp } from '@/lib/motion'

/*
  The banner across the top of the dashboard, laid out the way a profile
  card is: your chosen banner as a strip, your profile picture sitting on
  its bottom edge (a GIF keeps moving), then your name, handle, level and
  the three numbers that matter today (streak in its tier colour, this
  week's time, the next assessment). It is the one decorative place on
  the dashboard, and it is decorated with things you picked. The study
  buddy lives below it, in the quote card.

  This is a display, not an editor - the picture and the banner are both
  read-only here and link to Settings, where changing them actually
  lives. "Set up profile" shows once, until the profile section has been
  opened or a username chosen, and then gets out of the way.

  Everything on it is live data: the streak is computed from sessions AND
  attempts, XP from lib/xp.js, the countdown from the nearest assessment.
*/

const greetingFor = (hour) => (hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening')

function Flame({ colour, size = 30 }) {
  return (
    <svg viewBox="0 0 24 28" width={size} height={size * 1.16} aria-hidden="true">
      <path d="M12 2c1 4 5 6 5 12a5 5 0 0 1-10 0c0-2 1-3 1-3s.5 2 2 2c1.5 0 2-1.5 2-3 0-3-3-5 0-8z" fill={colour} />
      <path
        d="M12 12c.6 2 3 3 3 6a3 3 0 0 1-6 0c0-1.5 1-2.2 1-2.2s.3 1.2 1.2 1.2c.9 0 1.3-.9 1.3-1.8 0-1.4-1-2-.5-3.2z"
        fill="#fff"
        opacity="0.55"
      />
    </svg>
  )
}

/* The level number inside a ring that fills clockwise with progress to the next level. */
function LevelRing({ level, progress }) {
  const r = 22
  const c = 2 * Math.PI * r
  return (
    <span className="level-ring relative grid h-14 w-14 shrink-0 place-items-center" aria-label={`Level ${level}`}>
      <svg viewBox="0 0 56 56" className="absolute inset-0 h-full w-full -rotate-90">
        <circle cx="28" cy="28" r={r} className="level-ring-track" strokeWidth="4" fill="none" />
        <motion.circle
          cx="28"
          cy="28"
          r={r}
          className="level-ring-fill"
          strokeWidth="4"
          strokeLinecap={progress >= 1 ? 'butt' : 'round'}
          fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - Math.max(0.02, progress)) }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <span
        className={`level-ring-core grid h-9 w-9 place-items-center rounded-full font-extrabold leading-none tabular-nums ${String(level).length > 2 ? 'text-[0.72rem] tracking-tighter' : 'text-base'}`}
      >
        {level}
      </span>
    </span>
  )
}

export default function HeroBanner({
  name,
  fullName,
  username,
  photo,
  photoPos,
  banner,
  bannerPos,
  streak,
  xp,
  weekMinutes,
  nextAssessment,
  daysToNext,
  now,
  showSetup,
  owner = false,
}) {
  const tier = streakTier(streak)
  const next = nextStreakTier(streak)
  const lvl = levelFromXp(xp)
  const reward = nextReward(lvl.level)
  const hours = weekMinutes >= 60 ? `${(weekMinutes / 60).toFixed(1)}h` : `${weekMinutes}m`
  const type = nextAssessment ? assessmentType(nextAssessment.type) : null

  return (
    <motion.section variants={fadeInUp} aria-label="Your banner" className="card overflow-hidden">
      {/* Console title bar: three status LEDs, a path, and today's date. */}
      <div className="srv-titlebar">
        <span className="leds" aria-hidden="true">
          <i className="srv-led" />
          <i className="srv-led" />
          <i className="srv-led" />
        </span>
        <span className="path">~/memoraa/dashboard{username ? ` · @${username}` : ''}</span>
        <span className="hidden sm:inline">
          {new Date(now).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
        </span>
      </div>
      <Banner src={banner} pos={bannerPos} className="aspect-[24/6] w-full">
        <span aria-hidden="true" className="banner-scrim absolute inset-0" />
        <div className="relative flex h-full items-start justify-end p-4 sm:p-5">
          {showSetup && (
            <Link
              to="/profile"
              className="inline-flex items-center gap-1.5 rounded-md bg-black/40 px-3 py-1 text-[0.7rem] font-bold text-white transition-colors hover:bg-black/55"
              style={{ fontFamily: 'var(--font-mono-ui)' }}
            >
              <Icon name="user" className="h-3.5 w-3.5" />
              Set up profile
            </Link>
          )}
        </div>
      </Banner>

      <div className="relative px-4 pb-5 sm:px-6">
        <div className="-mt-14 grid gap-4 sm:-mt-16 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-end">
          {/* Profile picture on the banner edge - a link to Settings, not an
              editor: changing it happens there, never here. */}
          <Link
            to="/profile"
            className="mx-auto block h-32 w-32 rounded-full bg-surface p-1.5 ring-1 ring-line transition-transform hover:-translate-y-0.5 sm:h-36 sm:w-36 lg:mx-0"
            aria-label="Your profile"
          >
            <Pfp photo={photo} pos={photoPos} name={fullName || name} className="h-full w-full" />
          </Link>

          {/* Name, handle, level */}
          <div className="min-w-0 text-center lg:pb-1 lg:text-left">
            <h1 className="text-2xl font-extrabold leading-tight text-fg sm:text-3xl">
              <span aria-hidden="true" className="mr-2 font-medium text-muted" style={{ fontFamily: 'var(--font-mono-ui)' }}>
                &gt;
              </span>
              {greetingFor(new Date(now).getHours())}
              {name ? `, ${name}` : ''}
              <span aria-hidden="true" className="t-cursor" style={{ marginLeft: '0.2em' }} />
            </h1>
            <p className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-muted lg:justify-start">
              {username && <span className="font-semibold text-fg">@{username}</span>}
              {owner && (
                <span className="owner-tag" title="Owner of Memoraa">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="owner-tag-crown">
                    <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5L3 8z" fill="currentColor" />
                  </svg>
                  Owner
                </span>
              )}
              <span className="srv-tag" style={{ '--tag': 'var(--fg)' }}>
                <i aria-hidden="true" className="srv-led" />
                LVL {String(lvl.level).padStart(2, '0')} · {lvl.title}
              </span>
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 lg:w-[21rem]">
            <div
              className="hero-stat"
              style={{ '--glow': tier.glow }}
              title={next ? `${next.min - streak} more day${next.min - streak === 1 ? '' : 's'} to ${next.name}` : 'Top tier'}
            >
              <Flame colour={tier.colour} />
              <span className="text-2xl font-extrabold leading-none tabular-nums" style={{ color: tier.colour }}>
                {streak}
              </span>
              <span className="hero-stat-label">{streak > 0 ? `${tier.name} streak` : 'day streak'}</span>
            </div>
            <div className="hero-stat">
              <Icon name="clock" className="h-6 w-6 text-brand-strong" />
              <span className="text-2xl font-extrabold leading-none tabular-nums text-fg">{hours}</span>
              <span className="hero-stat-label">this week</span>
            </div>
            {nextAssessment ? (
              <Link to="/profile#assessments" className="hero-stat hover:border-brand">
                <span className={`hero-type hero-type-${type.tone}`}>{type.short}</span>
                <span
                  className={`text-2xl font-extrabold leading-none tabular-nums ${
                    daysToNext <= 7 ? 'text-danger' : daysToNext <= 21 ? 'text-r2-shaky' : 'text-fg'
                  }`}
                >
                  {daysToNext <= 0 ? 'today' : `${daysToNext}d`}
                </span>
                <span className="hero-stat-label truncate">{nextAssessment.subject || nextAssessment.paperLabel}</span>
              </Link>
            ) : (
              <Link to="/profile#assessments" className="hero-stat border-dashed hover:border-brand">
                <Icon name="calendar" className="h-6 w-6 text-brand-strong" />
                <span className="text-sm font-bold text-brand-strong">Add dates</span>
                <span className="hero-stat-label">DA · IA · mocks</span>
              </Link>
            )}
          </div>
        </div>

        {/* Level: a ring around the level number that fills as the level
            does, the title beside it, and an XP bar with a moving sheen
            and a lit leading edge. */}
        <div className="level-row mt-5 flex items-center gap-4">
          <LevelRing level={lvl.level} progress={lvl.progress} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
              <p className="min-w-0">
                <span className="text-base font-extrabold text-fg">{lvl.title}</span>
                <span className="ml-2 text-xs font-semibold text-muted">
                  {lvl.capped ? 'Max level' : `${lvl.toNext.toLocaleString()} XP to level ${lvl.level + 1}`}
                </span>
              </p>
              <p className="text-xs tabular-nums text-muted">
                {lvl.capped ? (
                  <span className="font-bold text-fg">{lvl.xp.toLocaleString()} XP · MAX</span>
                ) : (
                  <>
                    <span className="font-bold text-fg">{xp.toLocaleString()}</span> / {lvl.next.toLocaleString()} XP
                  </>
                )}
              </p>
            </div>
            <div className="xp-bar mt-2">
              <motion.div
                className="xp-fill"
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(2, lvl.progress * 100)}%` }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              >
              </motion.div>
            </div>
            {reward && (
              <p className="mt-1.5 text-[0.7rem] text-muted">
                Next unlock <span className="font-semibold text-fg">{reward.label.replace('Title: ', '')}</span> at level{' '}
                {reward.level}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
