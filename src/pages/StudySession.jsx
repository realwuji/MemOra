import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import Icon from '@/components/ui/Icon'
import RevisionRunner from '@/components/ui/RevisionRunner'
import ChapterPicker from '@/components/ui/ChapterPicker'
import { fadeInUp } from '@/lib/motion'
import { STUDY_TECHNIQUES, PRIORITISED_COURSES, PACK_LOAD_ERROR, STUDY_NEXT } from '@/constants/content'
import { getPackByName } from '@/constants/packs'
import usePack from '@/hooks/usePack'
import PageFallback from '@/components/layout/PageFallback'
import { useApp } from '@/context/AppProvider'
import { slugify, resolveSlug } from '@/lib/slug'
import { computeAllChapterStates } from '@/lib/attempts'
import { computeNextBestAction, relevantTopics } from '@/lib/pace'
import { useFocusMode } from '@/lib/focusMode'
import jumpToTop from '@/lib/jumpToTop'
import usePastPaperMarks from '@/hooks/usePastPaperMarks'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const ALL = '__all__'

/*
  Shuffle an MCQ's options and remap `answer` to wherever the correct option
  landed. Without this, a pack whose questions all happen to list the correct
  option first is trivially gameable by position rather than knowledge - and
  authoring bias like that is easy to introduce and hard to spot by eye.
*/
function shuffleOptions(q) {
  if (!Array.isArray(q?.options) || typeof q.answer !== 'number') return q
  const correct = q.options[q.answer]
  const options = shuffle(q.options)
  return { ...q, options, answer: options.indexOf(correct) }
}

function Stars({ value, onRate, max = 5 }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {Array.from({ length: max }, (_, i) => {
        const n = i + 1
        return (
          <button
            key={n}
            type="button"
            onClick={() => onRate(n)}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            className={`transition-transform hover:scale-110 ${
              n <= value ? 'text-paper' : 'text-muted'
            }`}
          >
            <Icon name="star" filled={n <= value} className="h-9 w-9" />
          </button>
        )
      })}
    </div>
  )
}

export default function StudySession() {
  const { subjectSlug, technique: techniqueParam } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user, setRecentTopic, setLastVisit, logSession, rateSession, logAttempt, sessions, attempts, examDates } = useApp()
  const isYear12 = user?.yearGroup === 'Year 12' && PRIORITISED_COURSES.includes(user?.courseType)

  const availableSubjects = user?.courseType === 'University' && user?.courseName
    ? [user.courseName]
    : (user?.subjects || []).map((s) => s.name)

  const subject =
    resolveSlug(subjectSlug, availableSubjects) ||
    user?.subjects?.find((s) => s.priority)?.name ||
    user?.subjects?.[0]?.name ||
    user?.courseName ||
    'Revision'
  const technique = techniqueParam || 'flashcards'
  // `pack` is the LIGHT pack: name, chapter outline, counts. It is all the
  // chapter picker and the recommender need, so the page opens at once. The
  // content (flashcards, questions, notes) is `fullPack`, fetched in the
  // background from the moment the page opens, so it is usually there by the
  // time a chapter is tapped (constants/packs.js).
  const pack = getPackByName(subject)
  const { pack: fullPack, error: packError, retry: retryPack } = usePack(pack)
  // `subject` can arrive as a URL slug ("computer-science"), which must never
  // reach the UI - the pack carries the properly-cased display name.
  const subjectLabel = pack?.name || subject
  const techniqueLabel =
    STUDY_TECHNIQUES.find((t) => t.id === technique)?.label || 'Focus'
  // Only offer the chapter picker when the pack actually has a `groups`
  // outline - otherwise picking a chapter would silently filter everything out.
  // The essay bank is the one technique that ignores chapters: its questions
  // are keyed by paper and spec topic, and the planner carries its own
  // filters for those, so a chapter picker here would just be a second,
  // worse version of the same thing.
  const hasChapters = Boolean(pack?.groups?.length) && technique !== 'essay-plans' && technique !== 'diagram-revision' && technique !== 'diagram-bank' && technique !== 'application' && technique !== 'past-papers'

  // A chapter bar segment (Progress/Dashboard) links straight here with
  // ?chapter=<topic> so tapping it lands on that exact chapter, not the
  // picker - only honoured when it's a real topic in this pack, so a stale
  // or hand-edited link can't silently land on an empty run.
  const preselectedChapter = pack?.topics?.includes(searchParams.get('chapter'))
    ? searchParams.get('chapter')
    : null

  // Maths past papers: how many questions of each chapter were marked right and wrong
  const paperMarks = usePastPaperMarks(Boolean(pack?.counts?.pastPapers || pack?.pastPapers))

  // chapter | ready | running | done | done-N (difficulty rating saved)
  const [phase, setPhase] = useState(preselectedChapter ? 'ready' : hasChapters ? 'chapter' : 'ready')
  const [chapter, setChapter] = useState(preselectedChapter || ALL) // ALL, or a specific topic title
  const [runPack, setRunPack] = useState(null) // shuffled, chapter-scoped copy of pack
  const [startedAt, setStartedAt] = useState(null) // real wall-clock time studying began
  // Id of the session logged when Finish was pressed, so a later rating
  // updates that record instead of creating a second one.
  const [sessionId, setSessionId] = useState(null)
  // XP the finished session earned on its own (answers add theirs as they
  // happen), shown on the done screen with the buddy cheering.
  const [earnedXp, setEarnedXp] = useState(0)
  // Set when the session was ended with Finish and continue: after rating, the next chapter opens
  const [continueAfter, setContinueAfter] = useState(false)

  // Reading a chapter, working a question, drawing a diagram: while a session
  // is running the backdrop goes quiet (see src/lib/focusMode.js). It comes
  // back on the picker and the results screen.
  useFocusMode(phase === 'running')

  // Full screen: the browser's own full screen, the page bar and footer out of the way, and the
  // column as wide as the screen allows. Esc leaves it, and so does leaving the session.
  const [full, setFull] = useState(false)
  useEffect(() => {
    document.documentElement.classList.toggle('study-full', full)
    return () => document.documentElement.classList.remove('study-full')
  }, [full])
  useEffect(() => {
    const sync = () => {
      if (!document.fullscreenElement) setFull(false)
    }
    document.addEventListener('fullscreenchange', sync)
    return () => {
      document.removeEventListener('fullscreenchange', sync)
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {})
    }
  }, [])
  const toggleFull = () => {
    const next = !full
    setFull(next)
    try {
      if (next) document.documentElement.requestFullscreen?.().catch(() => {})
      else if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {})
    } catch {
      /* the page still goes wide without the browser's full screen */
    }
  }

  const chapterLabel = chapter === ALL ? subjectLabel : chapter

  // Saved the moment a chapter or method is opened, not when Finish is pressed, so Continue where
  // you left off is right even if the tab is just closed.
  useEffect(() => {
    if (phase === 'chapter' && hasChapters) return
    setLastVisit({ subject, technique, topic: chapter === ALL ? null : chapter, ts: Date.now() })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject, technique, chapter, phase === 'chapter'])

  // Chapter states and the recommender's shortlist, for the picker's
  // band pills and "Top pick" / "Needs you" tags.
  const chapterStates = useMemo(() => computeAllChapterStates({ attempts, sessions }), [attempts, sessions])
  const pickerTopics = useMemo(() => (pack ? relevantTopics(pack, isYear12) : []), [pack, isYear12])
  const pickerRecs = useMemo(() => {
    if (!pack) return []
    const exam = examDates.filter((e) => e.subject === pack.name).sort((a, b) => a.date.localeCompare(b.date))[0]
    return computeNextBestAction({
      subjectPacks: [pack],
      isYear12,
      attempts,
      sessions,
      examDatesBySubject: exam ? { [pack.name]: exam.date } : {},
      limit: 4,
    })
  }, [pack, isYear12, attempts, sessions, examDates])

  // Tapping a chapter starts it - no "ready?" screen in between. The
  // ready screen stays for links that arrive with ?chapter= already set,
  // so following a link never starts a timed session by itself.
  const pickChapter = (t) => {
    setChapter(t)
    // Content not here yet: wait on the 'ready' phase, which starts the run
    // the moment it arrives. After a failed download, tapping a chapter again
    // is a retry.
    if (fullPack) startStudying(t)
    else {
      if (packError) retryPack()
      setPhase('ready')
    }
  }

  // Jump straight into another technique on the same chapter, from the empty
  // state. Writes the URL so a refresh (or a shared link) keeps the switch.
  const switchTechnique = (nextTechnique) => {
    navigate(`/study/${slugify(subject)}/${nextTechnique}`, { replace: true })
  }

  const startStudying = (which = chapter) => {
    if (!fullPack) return
    const inChapter = (items) =>
      which === ALL ? items : items.filter((it) => it.topic === which)
    setRunPack({
      ...fullPack,
      flashcards: shuffle(inChapter(fullPack.flashcards)),
      mcq: shuffle(inChapter(fullPack.mcq)).map(shuffleOptions),
      examQuestions: shuffle(inChapter(fullPack.examQuestions)),
    })
    setStartedAt(Date.now())
    setPhase('running')
  }

  // No "ready?" screen for any method or subject: arriving at a session (a link,
  // or Another session) starts it straight away.
  useEffect(() => {
    if (phase === 'ready' && fullPack) startStudying()
  }, [phase, fullPack]) // eslint-disable-line react-hooks/exhaustive-deps

  // Real elapsed time, not a guess - this is what the dashboard's "hours
  // spent" is built from. Clamp to a sane range in case a tab was left open.
  const elapsedMinutes = () =>
    startedAt ? Math.min(180, Math.round((Date.now() - startedAt) / 60000)) : 0

  // The session is recorded the moment Finish is pressed. Rating it is a
  // separate, optional step that updates the same record - before this,
  // walking away from the rating screen lost the whole session, which is
  // why streaks and weekly minutes never seemed to move.
  const recordSession = () => {
    const minutes = elapsedMinutes()
    const id = logSession({
      subject,
      technique,
      difficulty: null,
      topic: chapter === ALL ? null : chapter,
      minutes,
    })
    setRecentTopic(`${chapterLabel} · ${techniqueLabel}`)
    return { id, minutes }
  }
  const finishSession = () => {
    const { id, minutes } = recordSession()
    setContinueAfter(false)
    setSessionId(id)
    setEarnedXp(minutes + 10)
    setPhase('done')
  }

  // The chapter that follows this one in the course, for "Finish and continue".
  // Only for a single chapter of a method that has chapters.
  const nextTopic = useMemo(() => {
    if (chapter === ALL || !hasChapters) return null
    const at = pickerTopics.indexOf(chapter)
    return at >= 0 ? pickerTopics[at + 1] || null : null
  }, [chapter, hasChapters, pickerTopics])
  // Ends this session (it is logged like any other) and opens the next chapter in
  // the same method, at the top.
  const finishAndContinue = () => {
    if (!nextTopic) return
    const { id, minutes } = recordSession()
    setContinueAfter(true)
    setSessionId(id)
    setEarnedXp(minutes + 10)
    setPhase('done')
  }
  // From the "Session saved" screen: no session left to log, just open the next chapter.
  const continueFromSaved = () => {
    if (!nextTopic) return
    setSessionId(null)
    setChapter(nextTopic)
    startStudying(nextTopic)
  }

  // The stars are how confident the chapter feels (5 = confident). A session stores it as
  // difficulty, the other way round (1 = easy), so the rest of the app reads it as before.
  const rateDifficulty = (n) => {
    if (sessionId) rateSession(sessionId, 6 - n)
    if (continueAfter && nextTopic) {
      setContinueAfter(false)
      continueFromSaved()
      return
    }
    setPhase(`done-${n}`)
  }
  const skipRating = () => {
    setContinueAfter(false)
    continueFromSaved()
  }

  // How each chapter was last rated in this method, for the colour on the chapter picker
  const ratings = useMemo(() => {
    const m = new Map()
    sessions
      .filter((x) => x.subject === subject && x.technique === technique && x.topic && x.difficulty)
      .sort((a, b) => (a.ts || 0) - (b.ts || 0))
      .forEach((x) => m.set(x.topic, 6 - x.difficulty))
    return m
  }, [sessions, subject, technique])

  // Leaving mid-run (back button, closing the tab's route) still counts
  // the minutes that were actually studied, once at least one has passed.
  const live = useRef({ phase, startedAt, sessionId })
  live.current = { phase, startedAt, sessionId }
  useEffect(
    () => () => {
      const { phase: ph, startedAt: st, sessionId: sid } = live.current
      if (ph !== 'running' || sid || !st) return
      const minutes = Math.min(180, Math.round((Date.now() - st) / 60000))
      if (minutes < 1) return
      logSession({
        subject,
        technique,
        difficulty: null,
        topic: chapter === ALL ? null : chapter,
        minutes,
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return (
    <Section width={full && phase === 'running' ? 'full' : technique === 'diagram-bank' ? 'wide' : phase === 'chapter' || technique === 'essay-plans' || technique === 'diagram-revision' ? 'default' : 'narrow'} animateOnMount className="pt-10 pb-28">
      <motion.div variants={fadeInUp} className="mb-6 flex flex-wrap gap-2">
        <Button as={Link} to="/dashboard" variant="ghost" size="sm" className="-ml-4">
          <Icon name="arrowLeft" className="h-4 w-4" />
          Dashboard
        </Button>
        {phase === 'chapter' && (
          <Button as={Link} to={`/start/${slugify(subject)}`} variant="ghost" size="sm">
            Change method
          </Button>
        )}
      </motion.div>

      {/* Each screen (chapter list, notes or questions, results) opens at the top.
          They share one route, so the router's own scroll reset never runs: without
          this, picking a chapter from far down the list opened its notes just as
          far down. It jumps once the old screen has gone, so it does not slide
          out of view while it fades. */}
      <AnimatePresence mode="wait" onExitComplete={jumpToTop}>
        {/* CHAPTER PICKER */}
        {phase === 'chapter' && pack && (
          <ChapterPicker
            key="chapter"
            pack={pack}
            technique={technique}
            techniqueLabel={techniqueLabel}
            states={chapterStates}
            recs={pickerRecs}
            topics={pickerTopics}
            onPick={pickChapter}
            allKey={ALL}
            marks={paperMarks}
            ratings={ratings}
          />
        )}

        {/* WAITING for the subject's content (a separate download), or it failed */}
        {phase === 'ready' && pack && !runPack && (
          <motion.div key="loading" variants={fadeInUp} initial="hidden" animate="show" exit={{ opacity: 0 }}>
            {packError ? (
              <div className="card p-8 text-center" role="alert">
                <p className="text-lg font-semibold text-fg">{PACK_LOAD_ERROR.title}</p>
                <p className="mt-1 text-sm text-muted">{PACK_LOAD_ERROR.hint}</p>
                <div className="mt-5">
                  <Button size="sm" onClick={retryPack}>
                    {PACK_LOAD_ERROR.retry}
                  </Button>
                </div>
              </div>
            ) : (
              <PageFallback />
            )}
            {hasChapters && (
              <div className="mt-6 text-center">
                <Button size="sm" variant="ghost" onClick={() => setPhase('chapter')}>
                  <Icon name="arrowLeft" className="h-4 w-4" />
                  All chapters
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {/* RUNNING: real, shuffled revision content */}
        {phase === 'running' && runPack && (
          <motion.div key="running" variants={fadeInUp} initial="hidden" animate="show" exit={{ opacity: 0 }}>
            {/* Sticky, under the app bar. A full chapter of notes is a long
                scroll, and Finish session used to scroll away with the top
                of the page - so ending a session meant scrolling all the way
                back up. top-[68px] clears the app bar's scrolled height. */}
            <div className={`sticky ${full ? 'top-3' : 'top-[68px]'} z-30 mb-6 flex flex-wrap items-center justify-between gap-3 card p-4`}>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                  Studying · {techniqueLabel}
                </p>
                <h1 className="truncate text-xl font-bold text-fg">{chapterLabel}</h1>
              </div>
              <div className="flex items-center gap-2">
                {hasChapters ? (
                  <Button size="sm" variant="secondary" onClick={() => setPhase('chapter')}>
                    <Icon name="arrowLeft" className="h-4 w-4" />
                    All chapters
                  </Button>
                ) : (
                  <Button as={Link} to={`/start/${slugify(subject)}`} size="sm" variant="secondary">
                    Change method
                  </Button>
                )}
                <Button size="sm" variant="secondary" onClick={toggleFull} aria-pressed={full}>
                  <Icon name={full ? 'shrink' : 'expand'} className="h-4 w-4" />
                  {full ? 'Exit full screen' : 'Full screen'}
                </Button>
                {nextTopic && (
                  <Button size="sm" variant="secondary" onClick={finishAndContinue}>
                    {STUDY_NEXT.cta}
                  </Button>
                )}
                <Button size="sm" onClick={finishSession}>
                  Finish session
                </Button>
              </div>
            </div>

            <RevisionRunner
              key={chapter}
              pack={runPack}
              technique={technique}
              chapter={chapter === ALL ? null : chapter}
              onSwitchTechnique={switchTechnique}
              onChangeChapter={hasChapters ? () => setPhase('chapter') : undefined}
              onAnswer={(attempt) =>
                logAttempt({
                  subject,
                  topic: chapter === ALL ? null : chapter,
                  technique,
                  ...attempt,
                })
              }
            />

            {nextTopic && (
              <div className="card mt-10 flex flex-wrap items-center justify-between gap-4 p-5">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted">{STUDY_NEXT.eyebrow}</p>
                  <p className="mt-1 text-lg font-bold text-fg">{nextTopic}</p>
                </div>
                <Button onClick={finishAndContinue}>
                  {STUDY_NEXT.cta}
                  <Icon name="arrowRight" className="h-4 w-4" />
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {/* DONE: difficulty rating */}
        {phase === 'done' && (
          <motion.div key="done" variants={fadeInUp} initial="hidden" animate="show" exit={{ opacity: 0 }} className="text-center">
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-sm font-bold text-brand-strong">
              <Icon name="sparkles" className="h-4 w-4" />+{earnedXp} XP
            </p>
            <h1 className="mt-3 text-2xl font-bold text-fg sm:text-3xl">
              Nice work on {chapterLabel}!
            </h1>
            <p className="readable mt-2 text-muted">
              How confident do you feel with this chapter, out of 5?
            </p>
            <div className="mt-6">
              <Stars value={0} onRate={rateDifficulty} />
            </div>
            {continueAfter && nextTopic && (
              <div className="mt-5">
                <Button size="sm" variant="ghost" onClick={skipRating}>
                  Skip and open {nextTopic}
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {/* DONE confirmation (after difficulty rating) */}
        {phase.startsWith('done-') && (
          <motion.div key="saved" variants={fadeInUp} initial="hidden" animate="show" className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-quiz-soft text-quiz">
              <Icon name="check" className="h-8 w-8" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-fg">Session saved</h1>
            <p className="readable mt-2 text-muted">
              You rated your confidence {phase.split('-')[1]}/5. Come back soon.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button as={Link} to="/dashboard">
                <Icon name="home" className="h-5 w-5" />
                Back to dashboard
              </Button>
              {nextTopic && (
                <Button onClick={continueFromSaved}>
                  {STUDY_NEXT.again}: {nextTopic}
                  <Icon name="arrowRight" className="h-5 w-5" />
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={() => setPhase(hasChapters ? 'chapter' : 'ready')}
              >
                <Icon name="refresh" className="h-5 w-5" />
                Another session
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  )
}
