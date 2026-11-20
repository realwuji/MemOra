import { Suspense } from 'react'
import { Routes, Route, Navigate, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import AppLayout from '@/components/layout/AppLayout'
import Landing from '@/pages/Landing'
import CursorGlow from '@/components/ui/CursorGlow'
import ScrollToTop from '@/components/layout/ScrollToTop'
import Seo from '@/components/layout/Seo'
import Toast from '@/components/ui/Toast'
import PageFallback from '@/components/layout/PageFallback'
import lazyPage from '@/lib/lazyPage'

/*
  Every page except the landing page loads on demand, so a visitor to the
  landing page downloads a few hundred KB, not the whole app and every
  subject's notes (about 4 MB). The shell stays put while a page's code arrives.
*/
const HowItWorks = lazyPage(() => import('@/pages/HowItWorks'))
const Dashboard = lazyPage(() => import('@/pages/Dashboard'))
const Profile = lazyPage(() => import('@/pages/Profile'))
const StudySession = lazyPage(() => import('@/pages/StudySession'))
const Start = lazyPage(() => import('@/pages/Start'))
const Flashcards = lazyPage(() => import('@/pages/Flashcards'))
const Progress = lazyPage(() => import('@/pages/Progress'))
const Performance = lazyPage(() => import('@/pages/Performance'))
const Community = lazyPage(() => import('@/pages/Community'))
const Friends = lazyPage(() => import('@/pages/Friends'))
const SignIn = lazyPage(() => import('@/pages/SignIn'))
const Privacy = lazyPage(() => import('@/pages/Privacy'))
const Terms = lazyPage(() => import('@/pages/Terms'))
const Contact = lazyPage(() => import('@/pages/Contact'))
const NotFound = lazyPage(() => import('@/pages/NotFound'))
const DiagramGallery = lazyPage(() => import('@/pages/dev/DiagramGallery'))
const BrandSheet = lazyPage(() => import('@/pages/dev/BrandSheet'))
const BankGallery = lazyPage(() => import('@/pages/dev/BankGallery'))

/*
  Routing.
  - "/" is the landing/hero.
  - Everything under <AppLayout> gets the top bar. No auth gate: this is a
    single-user, on-device tool, so every route is always reachable.

  MotionConfig honours the OS "reduce motion" setting app-wide.
*/

/*
  Spotify sends the browser back to the site root after its consent
  screen, with ?code=...&state=memora-music. The player that exchanges
  that code (components/ui/FocusMusic.jsx) is only mounted inside the app
  layout, so the root hands the query straight on to the dashboard -
  otherwise the code was dropped on the landing page and "Connect
  Spotify" silently never connected.
*/
// Old /mock/:subject links land on that subject's exam questions.
function MockRedirect() {
  const { subjectSlug } = useParams()
  return <Navigate to={`/study/${subjectSlug}/exam-questions`} replace />
}

/*
  A study session keeps its own state (which chapter, running or not). Moving to
  another method or subject has to start it afresh: without a key, React reuses
  the same session for the new route, so the Diagram bank opened on the old
  method's chapter picker.
*/
function StudyRoute() {
  const { subjectSlug, technique } = useParams()
  const [params] = useSearchParams()
  return <StudySession key={`${subjectSlug || ''}/${technique || ''}/${params.get('chapter') || ''}`} />
}

function Root() {
  const { search } = useLocation()
  const state = new URLSearchParams(search).get('state')
  if (state === 'memora-music' || (state && state.startsWith('memora-music.'))) {
    return <Navigate to={`/dashboard${search}`} replace />
  }
  return <Landing />
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      {/* Keeps <title>, description, canonical, OG/Twitter tags and JSON-LD
          correct as you navigate. The static build bakes the same tags into
          each route's HTML file (scripts/prerender.mjs) for crawlers that
          don't run JavaScript. */}
      <Seo />
      <ScrollToTop />
      <CursorGlow />
      <Toast />
      <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />

        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/start" element={<Start />} />
          <Route path="/start/:subjectSlug" element={<Start />} />
          <Route path="/study" element={<StudyRoute />} />
          <Route path="/study/:subjectSlug" element={<StudyRoute />} />
          <Route path="/study/:subjectSlug/:technique" element={<StudyRoute />} />
          {/* The timed paper now lives inside Exam questions (a Timed test option). */}
          <Route path="/mock" element={<Navigate to="/dashboard" replace />} />
          <Route path="/mock/:subjectSlug" element={<MockRedirect />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/progress" element={<Progress />} />
          {/* Renamed from Performance (§6): two nav items both meaning "how
              am I doing" was one too many. Old links/bookmarks still land
              on the right page. */}
          <Route path="/mistakes" element={<Performance />} />
          <Route path="/performance" element={<Navigate to="/mistakes" replace />} />
          <Route path="/community" element={<Community />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/courses" element={<Navigate to="/profile" replace />} />

          {/* A real 404 page rather than a silent redirect to "/". Sending
              every unknown URL to the landing page told the visitor
              nothing, and made every typo look to a crawler like a
              duplicate of the home page. */}
          {import.meta.env.DEV && <Route path="/dev/diagrams/:id?" element={<DiagramGallery />} />}
          {import.meta.env.DEV && <Route path="/dev/brand" element={<BrandSheet />} />}
          {import.meta.env.DEV && <Route path="/dev/bank" element={<BankGallery />} />}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      </Suspense>
    </MotionConfig>
  )
}
