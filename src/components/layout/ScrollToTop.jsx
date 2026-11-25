import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import jumpToTop from '@/lib/jumpToTop'

/*
  React Router doesn't reset scroll position on navigation - without this,
  clicking a link while scrolled down on the current page lands you at the
  same scroll offset on the new page, which usually means the middle of
  nowhere. Resets to the top on every route change (path or query).

  The reset is INSTANT and happens before the browser paints, so a new page
  simply opens at the top. It used to be a plain scrollTo(0, 0), but the site
  sets `scroll-behavior: smooth` on <html> (index.css), which turned that into
  an animated scroll: the new page appeared at the old offset and then slid up
  to the top. Smooth scrolling is still right for in-page jumps (notes
  sections, "back to top"), so only this call opts out of it, by switching the
  behaviour to `auto` for the duration of the jump.

  A page that scrolls to its own anchor (e.g. /profile#assessments) still
  works: this runs in the layout phase, before that page's own effects.
*/
export default function ScrollToTop() {
  const { pathname, search } = useLocation()

  useLayoutEffect(() => {
    jumpToTop()
  }, [pathname, search])

  return null
}
