import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/ui/Button'
import SigilWordmark from '@/components/ui/SigilWordmark'
import ThemeSwitcher from '@/components/layout/ThemeSwitcher'
import MegaNav from '@/components/layout/MegaNav'
import { MARKETING_MENUS } from '@/constants/nav-menu'
import { useApp } from '@/context/AppProvider'
import '@/components/layout/meganav.css'

/*
  Shared header for all marketing / public pages (Landing, HowItWorks, SignIn, legal pages, etc.).

  The same square terminal bar as the in-app header (AppBar.jsx), with the same morphing menu
  (MegaNav.jsx). At the very top of a page it is transparent and borderless so it merges into the
  backdrop; once the page scrolls past 90px it takes the page colour and a hairline, so content scrolling
  under it never shows through. No pill, no blur, no rounded corners. A discrete boolean (`scrolled`)
  drives plain CSS transitions, never a per-pixel scroll-linked style.

  Props:
  - ctaLabel       label for the right-hand call-to-action button (optional)
  - ctaTo          route for the CTA (optional, defaults to /signin or /dashboard)
  - showHowItWorks whether to show the "How it works" link (default true on landing)
*/
export default function MarketingHeader({ showHowItWorks = false, ctaLabel, ctaTo }) {
  const { account } = useApp()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 90)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const resolvedCtaTo = ctaTo ?? (account ? '/dashboard' : '/signin')
  const resolvedCtaLabel = ctaLabel ?? (account ? 'Go to dashboard' : 'Sign in')
  const plain = showHowItWorks ? [{ label: 'How it works', to: '/how-it-works' }] : []

  return (
    <header className="app-bar mkt-bar sticky top-0 z-40" data-scrolled={scrolled ? 'true' : 'false'}>
      <div className="app-bar-bg absolute inset-0" />
      <div
        className={`relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 transition-[padding] duration-200 ease-out sm:px-8 ${
          scrolled ? 'py-2.5' : 'py-5'
        }`}
      >
        <div className="flex items-center gap-8">
          <Link to={account ? '/dashboard' : '/'} className="flex items-center text-xl font-semibold text-fg" aria-label="Memoraa home">
            <SigilWordmark animate={true} />
          </Link>
          <MegaNav menus={MARKETING_MENUS} plain={plain} />
        </div>

        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <Button as={Link} to={resolvedCtaTo} size="sm">
            <span className="hidden sm:inline">{resolvedCtaLabel}</span>
            <span className="sm:hidden">{account ? 'Dashboard' : resolvedCtaLabel}</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
