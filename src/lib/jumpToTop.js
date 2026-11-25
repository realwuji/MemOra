/*
  Puts the page back at the top, instantly.

  The site sets `scroll-behavior: smooth` on <html> (index.css), which is right
  for in-page jumps (notes sections, "back to top") but turns a plain
  scrollTo(0, 0) into a slide: the new screen would appear at the old offset and
  then crawl up. So the behaviour is switched to `auto` for the duration of the
  jump only.

  Used for a route change (components/layout/ScrollToTop.jsx) and for a screen
  change inside one page (the study session's chapter list, notes and results).
*/
export default function jumpToTop() {
  const root = document.documentElement
  const previous = root.style.scrollBehavior
  root.style.scrollBehavior = 'auto'
  window.scrollTo(0, 0)
  root.style.scrollBehavior = previous
}

/*
  Brings an element to the middle of the screen, instantly (the same reason as
  jumpToTop: the site's smooth scrolling would turn a "you are back where you were"
  into a slide). Used to return to a card in a long list.
*/
export function jumpTo(el, block = 'center') {
  const root = document.documentElement
  const previous = root.style.scrollBehavior
  root.style.scrollBehavior = 'auto'
  el.scrollIntoView({ block })
  root.style.scrollBehavior = previous
}
