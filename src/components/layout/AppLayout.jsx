import { Suspense, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import AppBar from './AppBar'
import Footer from './Footer'
import FocusMusic from '@/components/ui/FocusMusic'
import LevelUp from '@/components/ui/LevelUp'
import PageFallback from '@/components/layout/PageFallback'
import AtmosphereBackground from '@/components/ui/AtmosphereBackground'
import useIsDesktop from '@/hooks/useIsDesktop'

/*
  Shell for every app page: top bar + routed page. No login gate; this is a
  single-user, on-device tool.
*/
export default function AppLayout() {
  const isDesktop = useIsDesktop()

  // Once the shell is up and the browser is idle, fetch the pages people go to
  // next, so moving between them is instant rather than a download.
  useEffect(() => {
    const warm = () => {
      import('@/pages/Dashboard')
      import('@/pages/Start')
      import('@/pages/StudySession')
    }
    if (typeof requestIdleCallback === 'function') {
      const id = requestIdleCallback(warm, { timeout: 5000 })
      return () => cancelIdleCallback(id)
    }
    const id = setTimeout(warm, 2500)
    return () => clearTimeout(id)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      {/* The server dot-grid sits behind every app page. The rack mode (status
          LEDs down the edges) fits a dashboard; the content column is dimmed
          by the backdrop's calm zone so nothing competes with it. */}
      <AtmosphereBackground defaultMode="rack" />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <AppBar />
      <main id="main-content" tabIndex={-1} className="relative z-10 flex-1 focus:outline-none">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      {/* Corner Spotify player - PC only, persists across app routes, see FocusMusic. */}
      {isDesktop && <FocusMusic />}
      {/* Level-up screen - watches XP on every app page. */}
      <LevelUp />
    </div>
  )
}
