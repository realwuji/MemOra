import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import AtmosphereBackground from '@/components/ui/AtmosphereBackground'
import Footer from '@/components/layout/Footer'
import SigilWordmark from '@/components/ui/SigilWordmark'
import MarketingHeader from '@/components/layout/MarketingHeader'
import { fadeInUp, staggerContainer, inViewProps } from '@/lib/motion'
import { useApp } from '@/context/AppProvider'
import { LANDING, SITE, SUBJECT_CATALOG } from '@/constants/content'

/*
  The three subjects the app covers, as a quiet static row under the hero.
  No rotation: with only three names there is nothing to cycle through, and a
  fixed row reads as a statement of what the product is.
*/
function SubjectStrip() {
  return (
    <ul className="mx-auto mt-8 flex w-full max-w-md flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[13px] font-medium text-muted sm:max-w-2xl sm:gap-x-6 sm:text-sm">
      {SUBJECT_CATALOG.map((name, i) => (
        <li key={name} className="flex items-center gap-4 sm:gap-6">
          {i > 0 && <span aria-hidden="true" className="h-3.5 w-px bg-line" />}
          <span>{name}</span>
        </li>
      ))}
    </ul>
  )
}


/*
  A stylised mockup of the real dashboard - built from the same tokens and
  components as the real thing (glass, the brand->paper gradient heading),
  not a screenshot, so it never goes stale and re-themes live with
  the rest of the page. Sits in a "browser window" frame with a soft glow
  behind it, echoing the reference site's product-preview treatment.
*/
function DashboardPreview() {
  const subjects = [
    { icon: '💻', name: 'Computer Science', pct: 65 },
    { icon: '➗', name: 'Maths', pct: 40 },
    { icon: '📈', name: 'Economics', pct: 78 },
  ]

  return (
    <motion.div variants={fadeInUp} className="relative mx-auto w-full max-w-4xl">
      <div className="glass-strong overflow-hidden p-2 sm:p-3">
        <div className="flex items-center gap-1.5 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
        </div>

        <div className="rounded-2xl bg-page/70 p-4 sm:p-7">
          {/* Mini hero */}
          <div className="glass rounded-2xl p-5 sm:p-7">
            <p className="text-xl font-extrabold leading-tight text-fg sm:text-2xl">
              Hi Alex,{' '}
              <span className="text-muted">let&rsquo;s make today count.</span>
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-bold text-on-brand">
                <Icon name="play" className="h-3.5 w-3.5" />
                Start a study session
              </span>
              <div className="ml-auto flex gap-2">
                {[
                  ['activity', '4'],
                  ['target', '12h'],
                  ['cap', '23'],
                ].map(([icon, value]) => (
                  <span
                    key={icon}
                    className="glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-fg"
                  >
                    <Icon name={icon} className="h-3.5 w-3.5 text-brand-strong" />
                    {value}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Mini subject cards */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {subjects.map((s) => (
              <div key={s.name} className="glass rounded-xl p-3 sm:p-4">
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg" aria-hidden="true">
                    {s.icon}
                  </span>
                  <p className="truncate text-xs font-bold text-fg sm:text-sm">{s.name}</p>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-raised">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${s.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function StoryBlock({ icon, title, body }) {
  return (
    <motion.div variants={fadeInUp} className="mx-auto flex max-w-lg flex-col items-center text-center">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-brand-soft text-brand-strong">
        <Icon name={icon} className="h-7 w-7" />
      </span>
      <h3 className="mt-5 text-2xl font-bold text-fg sm:text-3xl">{title}</h3>
      <p className="readable mt-3 text-muted">{body}</p>
    </motion.div>
  )
}

export default function Landing() {
  const { account } = useApp()

  return (
    <div className="relative min-h-screen">
      <AtmosphereBackground />
      <MarketingHeader showHowItWorks />

      {/* Hero - centered, one-line subtitle, matching the reference layout */}
      <section data-bg="packets"
        className="relative z-10 mx-auto flex min-h-[82vh] w-full max-w-3xl flex-col items-center justify-center px-5 py-14 text-center sm:py-16"
        style={{ textShadow: '0 2px 24px color-mix(in srgb, var(--page) 75%, transparent)' }}
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="flex w-full flex-col items-center"
        >
          {/* The visible h1 is the logo and wordmark. */}
          <motion.h1 variants={fadeInUp} className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center">
              <SigilWordmark size="hero" animate={true} className="items-center" />
              <span className="sr-only"> - A-level revision built for your exact spec</span>
            </div>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mt-3 text-balance text-lg font-semibold text-fg sm:text-xl"
          >
            {LANDING.tagline}
          </motion.p>

          <motion.p
            variants={fadeInUp}
            className="mx-auto mt-4 max-w-full text-balance text-sm text-muted sm:whitespace-nowrap sm:text-base"
          >
            {LANDING.subtitleLead}{' '}
            <span className="rounded-full bg-raised px-2.5 py-1 font-semibold text-fg">
              {LANDING.subtitleHighlight}.
            </span>
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mt-8 flex w-full flex-col items-center justify-center gap-5 sm:w-auto sm:flex-row"
          >
            <Button as={Link} to={account ? '/dashboard' : '/signin'} size="lg">
              {account ? LANDING.primaryCtaSignedIn : LANDING.primaryCta}
              <Icon name="arrowRight" className="h-5 w-5" />
            </Button>
            <Button as={Link} to="/how-it-works" variant="link" className="text-base font-semibold">
              {LANDING.secondaryCta}
              <Icon name="arrowRight" className="h-4 w-4" />
            </Button>
          </motion.div>

          <motion.p variants={fadeInUp} className="mt-3 text-xs text-muted">
            Free · no card required
          </motion.p>

          <motion.div variants={fadeInUp} className="w-full">
            <SubjectStrip />
          </motion.div>
        </motion.div>
      </section>

      {/* Product preview - shows the real dashboard's look (as a live-token
          mockup, not a screenshot) so visitors see what they're signing up
          for before the pitch below. */}
      <motion.section data-bg="rack"
        variants={staggerContainer}
        {...inViewProps}
        className="relative z-10 mx-auto max-w-5xl px-5 pb-28"
      >
        <motion.div variants={fadeInUp} className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-fg sm:text-4xl">Your dashboard, at a glance</h2>
        </motion.div>
        <DashboardPreview />
      </motion.section>

      {/* What it does - a short, centered scroll-story, replacing the old
          cards/reviews/marquee/FAQ wall for something closer to the
          reference's restraint. */}
      <motion.section data-bg="bus"
        variants={staggerContainer}
        {...inViewProps}
        className="relative z-10 mx-auto max-w-4xl space-y-16 px-5 pb-32 pt-8"
        style={{ textShadow: '0 2px 20px color-mix(in srgb, var(--page) 70%, transparent)' }}
      >
        <motion.div variants={fadeInUp} className="text-center">
          <h2 className="text-2xl font-bold text-fg sm:text-3xl">What {SITE.name} does</h2>
        </motion.div>

        <StoryBlock
          icon="cards"
          title="Deep, spec-matched content"
          body="Notes, flashcards, and questions built topic by topic against the real specification, not a generic summary."
        />
        <StoryBlock
          icon="target"
          title="A plan that adapts"
          body="Sessions notice when a topic was tough last time and ease you back in, so revision meets you where you are."
        />
        <StoryBlock
          icon="activity"
          title="Progress you can see"
          body="Real per-subject and per-chapter tracking from what you've actually answered, not seeded demo numbers."
        />

        <motion.div variants={fadeInUp} className="flex justify-center pt-4">
          <Button as={Link} to="/dashboard" size="lg">
            Start studying
            <Icon name="arrowRight" className="h-5 w-5" />
          </Button>
        </motion.div>
      </motion.section>

      <Footer />
    </div>
  )
}
