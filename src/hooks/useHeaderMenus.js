import { useMemo } from 'react'
import { useApp } from '@/context/AppProvider'
import { APP_MENUS } from '@/constants/nav-menu'
import { PRIORITISED_COURSES, subjectColor } from '@/constants/content'
import { getPackByName } from '@/constants/packs'
import { computeAllChapterStates } from '@/lib/attempts'
import { computeGaps } from '@/lib/gaps'
import { relevantTopics, subjectBandCounts } from '@/lib/pace'
import { slugify } from '@/lib/slug'
import { BAND_COLOUR, BAND_LABEL, pickResume, relativeDay, resumePath, subjectNamesOf } from '@/lib/resume'
import { studyPathFor, techniqueLabel, techniquesFor } from '@/lib/techniques'

/*
  The header menus, filled with the student's own state instead of generic copy.

  constants/nav-menu.js holds the static menus. They are what a brand-new account sees, and what stays
  in place wherever there is nothing real to say. This hook layers the real thing on top:

    Study     Subjects: each of YOUR subjects with how far through it you are. Methods: the methods that
              actually exist for the subject you were last in (a method with no content is left out), each
              opening that subject. Card: Continue, naming your last chapter and method and when.
    Track     Progress and Mistakes carry real counts; the card names the chapter that most needs a
              second look and why (the first of "Close your gaps").
    Together  Friends carries how many you have; the card follows.

  Everything comes from the same helpers the dashboard uses (lib/resume.js, lib/gaps.js, lib/pace.js), so the
  menu can never disagree with the page. Nothing is invented: if a number cannot be known, the generic line
  is used. Returns { menus, resume } where resume is the Continue target (or null) for the bar's shortcut.
*/
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`

// The dot animation that previews each method's page.
const ART_FOR = { notes: 'log', flashcards: 'packets', 'exam-questions': 'rack', mcq: 'packets', 'past-papers': 'rack' }

export default function useHeaderMenus() {
  const { user, sessions, lastVisit, attempts, friends } = useApp()

  return useMemo(() => {
    const now = Date.now()
    const isYear12 = user.yearGroup === 'Year 12' && PRIORITISED_COURSES.includes(user.courseType)
    const subjectNames = subjectNamesOf(user)
    const packs = subjectNames.map((n) => getPackByName(n)).filter(Boolean)
    const states = computeAllChapterStates({ attempts, sessions, now })

    // ---- continue where you left off ----
    const session = pickResume({ sessions, lastVisit, subjectNames })
    const resume = session
      ? {
          session,
          to: resumePath(session),
          subject: session.subject,
          topic: session.topic || 'All chapters',
          method: techniqueLabel(session.technique || 'notes'),
          when: relativeDay(session.ts),
          color: subjectColor(session.subject),
          band: session.topic ? states.get(`${session.subject}␟${session.topic}`)?.band || null : null,
          art: ART_FOR[session.technique || 'notes'] || 'bus',
        }
      : null

    // ---- progress per subject ----
    const progress = packs.map((pack) => {
      const topics = relevantTopics(pack, isYear12)
      const counts = subjectBandCounts({ pack, isYear12, chapterStates: states })
      return { pack, total: topics.length, started: topics.length - (counts.not_started || 0) }
    })
    const totalChapters = progress.reduce((t, p) => t + p.total, 0)
    const startedChapters = progress.reduce((t, p) => t + p.started, 0)

    const { gaps, total: gapsTotal } = computeGaps({ subjectNames, chapterStates: states, attempts, limit: 1 })

    const menus = APP_MENUS.map((m) => ({
      ...m,
      columns: m.columns.map((c) => ({ ...c, links: c.links.map((l) => ({ ...l })) })),
      cards: m.cards.map((c) => ({ ...c })),
    }))
    const menu = (id) => menus.find((m) => m.id === id)

    // ---------------------------------------------------------------- Study
    const study = menu('study')
    if (progress.length) {
      const spec = (name) => user.subjects?.find((s) => s.name === name)?.spec
      study.columns[0].links = progress.map(({ pack, total, started }) => ({
        label: pack.name,
        to: `/start/${slugify(pack.name)}`,
        desc: [spec(pack.name), started ? `${started} of ${total} chapters started` : `${plural(total, 'chapter')}, none started`].filter(Boolean).join('. '),
      }))
    }
    // The methods that exist for the subject you were last in (or your first subject).
    const methodsPack = (resume && getPackByName(resume.subject)) || progress[0]?.pack || null
    if (methodsPack) {
      const slug = slugify(methodsPack.name)
      const all = techniquesFor(methodsPack)
      const shown = all.slice(0, 5)
      study.columns[1] = {
        title: `Methods for ${methodsPack.name}`,
        links: [
          ...shown.map((t) => ({ label: t.label, to: `/study/${slug}/${t.id}`, desc: t.desc })),
          ...(all.length > shown.length ? [{ label: 'All methods', to: `/start/${slug}`, desc: `${all.length - shown.length} more for ${methodsPack.name}` }] : []),
        ],
      }
    }
    if (resume) {
      study.cards = [
        {
          title: resume.topic,
          eyebrow: resume.subject,
          tag: resume.band ? { label: BAND_LABEL[resume.band], color: BAND_COLOUR[resume.band] } : null,
          desc: `Continue where you left off. ${resume.method}${resume.when ? `, ${resume.when}` : ''}.`,
          to: resume.to,
          art: resume.art,
          color: resume.color,
        },
      ]
    }

    // ---------------------------------------------------------------- Track
    const track = menu('track')
    if (totalChapters && startedChapters) {
      track.columns[0].links[0].desc = `${startedChapters} of ${totalChapters} chapters started`
    }
    if (gapsTotal > 0) track.columns[0].links[1].desc = `${plural(gapsTotal, 'chapter')} to have another go at`
    else if (attempts.length) track.columns[0].links[1].desc = 'Nothing to fix right now'
    if (gaps[0]) {
      const g = gaps[0]
      track.cards = [
        {
          title: g.topic,
          eyebrow: g.subject,
          desc: `${g.reason}.`,
          to: studyPathFor(g.subject, g.topic, g.mode),
          art: 'log',
          color: subjectColor(g.subject),
        },
      ]
    }

    // ------------------------------------------------------------- Together
    const together = menu('together')
    const n = (friends || []).length
    if (n > 0) {
      together.columns[0].links[1].desc = `${plural(n, 'friend')}. Compare weeks`
      together.cards = [{ title: 'Friends', desc: `${plural(n, 'friend')} on your list. See who is really revising this week.`, to: '/friends', art: 'bus' }]
    } else {
      together.cards = [{ title: 'Add a friend', desc: 'Share your code to see who is really revising this week.', to: '/friends', art: 'bus' }]
    }

    return { menus, resume }
  }, [user, sessions, lastVisit, attempts, friends])
}
