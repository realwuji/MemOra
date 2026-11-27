import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { NAV_LINKS } from '@/constants/content'
import { APP_PLAIN } from '@/constants/nav-menu'
import useHeaderMenus from '@/hooks/useHeaderMenus'
import Icon from '@/components/ui/Icon'
import SigilWordmark from '@/components/ui/SigilWordmark'
import ThemeSwitcher from '@/components/layout/ThemeSwitcher'
import MegaNav from '@/components/layout/MegaNav'
import InstallMenuItem from '@/components/pwa/InstallMenuItem'
import { useApp } from '@/context/AppProvider'
import '@/components/layout/meganav.css'

// Icons for the nav destinations in the small-screen menu, so it reads clearly.
const NAV_ICONS = {
  '/dashboard': 'home',
  '/progress': 'activity',
  '/mistakes': 'target',
  '/friends': 'heart',
  '/community': 'users',
}

/*
  The in-app header: a flat, square bar with a hairline under it (no pill, no blur), the wordmark, the
  primary navigation (a few links and the morphing menus, MegaNav.jsx) and, on the right, the theme
  switch and the account menu. Below 768px the menus are replaced by the account menu, which lists every
  destination, so a phone never needs hover. Everything is square, in line with the rest of the product
  (DESIGN.md, principle 3).
*/
export default function AppBar() {
  const { user, account, signOut, showToast } = useApp()
  // The menus, filled with this student's own state, and the Continue target (hooks/useHeaderMenus.js).
  const { menus, resume } = useHeaderMenus()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const initial = (user?.name?.[0] || '?').toUpperCase()
  const menuButtonRef = useRef(null)

  // Closing must hand focus back to the button that opened the menu, otherwise a keyboard user's focus
  // silently drops onto <body> (WAI-ARIA menu-button pattern).
  const close = () => {
    setOpen(false)
    menuButtonRef.current?.focus()
  }

  // Signing out has to leave the app: staying on an in-app page after signing out shows a dashboard
  // that is no longer "yours". Land on the marketing page with a confirmation.
  const handleSignOut = () => {
    signOut()
    close()
    navigate('/')
    showToast('Signed out')
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // A discrete "scrolled past the top" flag (never a per-pixel scroll-linked style, which would
  // recalculate layout on every frame): it only tightens the padding and firms up the hairline.
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="app-bar sticky top-0 z-40"
      data-scrolled={scrolled ? 'true' : 'false'}
    >
      <div className="app-bar-bg absolute inset-0" />
      <div
        className={`relative flex w-full items-center justify-between px-6 transition-[padding] duration-200 ease-out sm:px-8 ${
          scrolled ? 'py-2' : 'py-3.5'
        }`}
      >
        <div className="flex items-center gap-8">
          {/* AppBar only renders on in-app pages, so the logo goes back to the dashboard. */}
          <Link to="/dashboard" className="flex items-center text-xl font-semibold text-fg" aria-label="Memoraa dashboard">
            <SigilWordmark animate={true} />
          </Link>
          <MegaNav menus={menus} plain={APP_PLAIN} />
        </div>

        <div className="flex items-center gap-3">
          {/* Continue where you left off: always one click away, naming the actual chapter. */}
          {resume && (
            <Link to={resume.to} className="mn-resume" style={{ '--subject': resume.color }} title={`${resume.subject}: ${resume.topic}`}>
              <i className="srv-led" aria-hidden="true" />
              <span className="mn-resume-label">Continue</span>
              <span className="mn-resume-topic">{resume.topic}</span>
            </Link>
          )}
          <ThemeSwitcher />
          {/* Account menu (shown on every screen size; on small screens it also lists the destinations). */}
          <div className="relative">
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-haspopup="menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="app-bar-btn"
            >
              <Icon name={open ? 'x' : 'menu'} className="h-5 w-5" />
            </button>

            <AnimatePresence>
              {open && (
                <>
                  <button type="button" aria-hidden="true" tabIndex={-1} onClick={close} className="fixed inset-0 z-40 cursor-default" />
                  <motion.div
                    role="menu"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.14 }}
                    className="mn-account"
                  >
                    <div className="srv-titlebar" aria-hidden="true">
                      <span className="leds">
                        <i className="srv-led" />
                        <i className="srv-led" />
                        <i className="srv-led" />
                      </span>
                      <span className="path">~/memoraa/account</span>
                    </div>

                    {/* Who's studying */}
                    <div className="mn-who">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden bg-brand text-sm font-bold text-on-brand">
                        {user?.avatar ? <img src={user.avatar} alt="Your profile photo" className="h-full w-full object-cover" /> : initial}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-fg">{user?.name}</p>
                        {account ? <p className="truncate text-xs text-muted">{account.email}</p> : null}
                      </div>
                    </div>

                    <nav className="mn-items">
                      {/* The destinations live here on small screens; from 768px up they are in the bar. */}
                      <div className="flex flex-col md:hidden">
                        {NAV_LINKS.map((l) => (
                          <NavLink key={l.to} to={l.to} role="menuitem" onClick={close} className="mn-link">
                            <Icon name={NAV_ICONS[l.to] || 'chevronRight'} className="mt-0.5 h-4 w-4 text-muted" />
                            <span className="mn-text">
                              <span className="mn-label">{l.label}</span>
                            </span>
                          </NavLink>
                        ))}
                        <div className="mn-sep" />
                      </div>

                      <NavLink to="/profile" role="menuitem" onClick={close} className="mn-link">
                        <Icon name="user" className="mt-0.5 h-4 w-4 text-muted" />
                        <span className="mn-text">
                          <span className="mn-label">Settings</span>
                        </span>
                      </NavLink>

                      <InstallMenuItem onDone={() => setOpen(false)} />

                      {account ? (
                        <button type="button" role="menuitem" onClick={handleSignOut} className="mn-link">
                          <Icon name="logout" className="mt-0.5 h-4 w-4 text-muted" />
                          <span className="mn-text">
                            <span className="mn-label">Sign out</span>
                          </span>
                        </button>
                      ) : (
                        <NavLink to="/signin" role="menuitem" onClick={close} className="mn-link">
                          <Icon name="user" className="mt-0.5 h-4 w-4 text-muted" />
                          <span className="mn-text">
                            <span className="mn-label">Sign in</span>
                          </span>
                        </NavLink>
                      )}
                    </nav>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
