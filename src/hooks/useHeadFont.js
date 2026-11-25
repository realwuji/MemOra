import { useSyncExternalStore } from 'react'

/*
  Which font the page's headings (and so the diagram bank's text) are set in:
  'default', or a reading-support face ('dyslexic', 'hyperlegible') chosen in
  the accessibility settings, which AppProvider writes to data-font on <html>.

    const font = useHeadFont()   // 'default' | 'dyslexic:<n>' | 'hyperlegible:<n>'

  The value changes when the setting changes and, for a reading-support face,
  again whenever a font finishes loading, so anything sized from measured glyph
  widths re-measures once the real font is there instead of the fallback. For the
  default face it never changes, so nothing re-measures.
*/

let version = 0
const subs = new Set()
let observer = null

const bump = () => {
  version += 1
  subs.forEach((cb) => cb())
}

function subscribe(cb) {
  subs.add(cb)
  if (subs.size === 1 && typeof document !== 'undefined') {
    observer = new MutationObserver(bump)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-font'] })
    document.fonts?.addEventListener?.('loadingdone', bump)
  }
  return () => {
    subs.delete(cb)
    if (!subs.size) {
      observer?.disconnect()
      observer = null
      document.fonts?.removeEventListener?.('loadingdone', bump)
    }
  }
}

const snapshot = () => {
  const font = document.documentElement.getAttribute('data-font') || 'default'
  return font === 'default' ? 'default' : `${font}:${version}`
}

export default function useHeadFont() {
  return useSyncExternalStore(subscribe, snapshot, () => 'default')
}
