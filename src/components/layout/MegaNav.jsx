import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import MenuArt from '@/components/layout/MenuArt'
import './meganav.css'

/*
  The header's primary navigation: a few plain links and a few menus, where the menus share ONE
  panel that morphs between them (the way a good mega menu does), in Memoraa's square terminal
  style: a console title bar with status LEDs and a path, `//` column headings, `>` prompt rows, and
  cards with a small dot animation that previews the page. Content comes from constants/nav-menu.js.

  Structure (the panel is a sibling of the nav, so the bar's own layout never moves):
    <nav>            plain links, then one <button> per menu (a disclosure, not role="menu")
    .mn-panel        position:absolute under the bar; width, height and left morph together
      .mn-viewport   overflow:hidden
        .mn-content  one per menu, ALL in the DOM (crawlable); only the active one is interactive

  Motion: opening from closed lands at size with no morph (data-instant), then fades up; switching while
  open morphs width, height and left over 280ms while the old content slides out opposite to travel
  and the new content slides in. Reduced motion: no morph or slide, opacity only (meganav.css).

  Behaviour: hover intent (a short delay to open, a longer one to close, no delay to switch while open),
  click toggles (a click right after a hover-open is ignored), outside press, route change, Escape
  (focus returns to the trigger) and focus leaving the nav and panel all close it. Keyboard: Enter,
  Space or ArrowDown on a trigger open it and focus the first link; ArrowUp focuses the last;
  ArrowLeft and ArrowRight move between the top-level items (switching the open menu); Home and End
  jump to the first and last; inside the panel ArrowUp and ArrowDown move through the links.
*/
const OPEN_MS = 90
const CLOSE_MS = 180
const CLICK_GUARD_MS = 300

function MenuContent({ menu, live, onNavigate }) {
  return (
    <>
      <div className="srv-titlebar mn-bar" aria-hidden="true">
        <span className="leds">
          <i className="srv-led" />
          <i className="srv-led" />
          <i className="srv-led" />
        </span>
        <span className="path">~/memoraa/{menu.path}</span>
        <span className="mn-hint">esc</span>
      </div>
      <div className="mn-body">
        <div className="mn-cols">
          {menu.columns.map((col, ci) => {
            const titleId = `mn-${menu.id}-col-${ci}`
            return (
              <div key={col.title} className="mn-col">
                <p className="mn-coltitle" id={titleId}>
                  <span aria-hidden="true">// </span>
                  {col.title}
                </p>
                <ul className="mn-list" aria-labelledby={titleId}>
                  {col.links.map((l) => (
                    <li key={`${l.to}-${l.label}`}>
                      <Link to={l.to} className="mn-link" onClick={onNavigate}>
                        <span className="mn-prompt" aria-hidden="true">
                          &gt;
                        </span>
                        <span className="mn-text">
                          <span className="mn-label">{l.label}</span>
                          {l.desc ? <span className="mn-desc">{l.desc}</span> : null}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
        <div className="mn-cards">
          {menu.cards.map((c) => (
            <Link
              key={`${c.to}-${c.title}`}
              to={c.to}
              className={`mn-card${c.color ? ' has-subject' : ''}`}
              style={c.color ? { '--subject': c.color } : undefined}
              onClick={onNavigate}
            >
              <MenuArt art={c.art} live={live} />
              <span className="mn-card-body">
                {c.eyebrow ? (
                  <span className="mn-card-eyebrow">
                    <i className="srv-led" aria-hidden="true" />
                    {c.eyebrow}
                    {c.tag ? (
                      <span className="srv-tag" style={{ '--tag': c.tag.color }}>
                        {c.tag.label}
                      </span>
                    ) : null}
                  </span>
                ) : null}
                <span className="mn-card-title">
                  {c.title}
                  <span className="mn-card-arrow" aria-hidden="true">
                    →
                  </span>
                </span>
                <span className="mn-card-desc">{c.desc}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

export default function MegaNav({ menus, plain = [] }) {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState(menus[0].id)
  const [geom, setGeom] = useState(null) // { w, h, x } in px
  const [instant, setInstant] = useState(false)
  const [live, setLive] = useState(false) // card art renders once the nav is first used

  const navRef = useRef(null)
  const panelRef = useRef(null)
  const contentRefs = useRef(new Map())
  const triggerRefs = useRef(new Map())
  const timers = useRef({ open: 0, close: 0 })
  const openRef = useRef(false)
  const currentRef = useRef(menus[0].id)
  const hoverAt = useRef(0)
  const pendingFocus = useRef(null)

  const clear = useCallback((k) => {
    if (timers.current[k]) {
      window.clearTimeout(timers.current[k])
      timers.current[k] = 0
    }
  }, [])

  const setOpenBoth = useCallback((v) => {
    openRef.current = v
    setOpen(v)
  }, [])

  // The panel's size, and a left edge that starts at the nav and never runs off the screen.
  const measure = useCallback((id) => {
    const nav = navRef.current
    const panel = panelRef.current
    const content = contentRefs.current.get(id)
    if (!nav || !panel || !content) return null
    const w = content.offsetWidth
    const h = content.offsetHeight
    const parent = panel.offsetParent
    if (!w || !h || !parent) return null
    const pr = parent.getBoundingClientRect()
    const left = nav.getBoundingClientRect().left - pr.left
    const x = Math.round(Math.max(0, Math.min(left, pr.width - w - 12)))
    return { w, h, x }
  }, [])

  const linksOf = useCallback((id) => {
    const el = contentRefs.current.get(id)
    return el ? Array.from(el.querySelectorAll('a[href]')) : []
  }, [])

  const openMenu = useCallback(
    (id, opts = {}) => {
      clear('open')
      clear('close')
      const g = measure(id)
      if (!g) return
      if (opts.hover) hoverAt.current = Date.now()
      const wasOpen = openRef.current
      if (wasOpen && currentRef.current === id) {
        if (opts.focus) {
          const l = linksOf(id)
          ;(opts.focus === 'last' ? l[l.length - 1] : l[0])?.focus()
        }
        return
      }
      if (!wasOpen) setInstant(true)
      setLive(true)
      pendingFocus.current = opts.focus ? { id, which: opts.focus } : null
      currentRef.current = id
      setCurrent(id)
      setGeom(g)
      setOpenBoth(true)
    },
    [clear, measure, linksOf, setOpenBoth],
  )

  const closeMenu = useCallback(
    (opts = {}) => {
      clear('open')
      clear('close')
      if (!openRef.current) return
      pendingFocus.current = null
      setOpenBoth(false)
      if (opts.focusTrigger) triggerRefs.current.get(currentRef.current)?.focus()
    },
    [clear, setOpenBoth],
  )

  const scheduleClose = useCallback(() => {
    clear('close')
    if (!openRef.current) return
    timers.current.close = window.setTimeout(() => {
      timers.current.close = 0
      closeMenu()
    }, CLOSE_MS)
  }, [clear, closeMenu])

  // Drop data-instant one frame after the first-open styles are flushed, so later switches morph.
  useLayoutEffect(() => {
    if (!instant) return undefined
    panelRef.current?.getBoundingClientRect()
    const raf = window.requestAnimationFrame(() => setInstant(false))
    return () => window.cancelAnimationFrame(raf)
  }, [instant])

  // A keyboard open moves focus into the panel once its content is live (no longer inert).
  useEffect(() => {
    const p = pendingFocus.current
    if (!p || !open || current !== p.id) return
    pendingFocus.current = null
    const l = linksOf(p.id)
    ;(p.which === 'last' ? l[l.length - 1] : l[0])?.focus()
  }, [open, current, linksOf])

  // A route change closes the menu at once (the new page is the feedback).
  useEffect(() => {
    clear('open')
    clear('close')
    if (openRef.current) setOpenBoth(false)
  }, [pathname, clear, setOpenBoth])

  // While open: outside press, Escape and resize. Listeners exist only while open.
  useEffect(() => {
    if (!open) return undefined
    let frame = 0
    const inside = (n) => n instanceof Node && (navRef.current?.contains(n) || panelRef.current?.contains(n))
    const onDown = (e) => {
      if (!inside(e.target)) closeMenu()
    }
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      closeMenu({ focusTrigger: inside(document.activeElement) })
    }
    const onResize = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        const g = measure(currentRef.current)
        if (g) setGeom(g)
        else closeMenu()
      })
    }
    document.addEventListener('pointerdown', onDown, true)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      document.removeEventListener('pointerdown', onDown, true)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [open, closeMenu, measure])

  // Web fonts change text metrics: re-measure an open panel once they land.
  useEffect(() => {
    let alive = true
    document.fonts?.ready
      ?.then(() => {
        if (!alive || !openRef.current) return
        const g = measure(currentRef.current)
        if (g) setGeom(g)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [measure])

  useEffect(() => {
    const t = timers.current
    return () => {
      Object.keys(t).forEach((k) => t[k] && window.clearTimeout(t[k]))
    }
  }, [])

  // ---- pointer ----
  const onTriggerEnter = (id) => (e) => {
    if (e.pointerType === 'touch') return
    clear('close')
    if (openRef.current) {
      if (currentRef.current !== id) openMenu(id, { hover: true }) // switching while open: no delay
      return
    }
    clear('open')
    timers.current.open = window.setTimeout(() => {
      timers.current.open = 0
      openMenu(id, { hover: true })
    }, OPEN_MS)
  }
  const onTriggerLeave = (e) => {
    if (e.pointerType === 'touch') return
    clear('open')
    scheduleClose()
  }
  const onTriggerClick = (id) => (e) => {
    const keyboard = e.detail === 0 // Enter or Space: the click has no pointer
    if (openRef.current && currentRef.current === id) {
      if (!keyboard && Date.now() - hoverAt.current < CLICK_GUARD_MS) return
      closeMenu()
      return
    }
    openMenu(id, keyboard ? { focus: 'first' } : {})
  }
  const onPanelEnter = (e) => e.pointerType !== 'touch' && clear('close')
  const onPanelLeave = (e) => e.pointerType !== 'touch' && scheduleClose()

  // ---- keyboard ----
  const items = [...plain.map((p) => ({ kind: 'link', id: p.to })), ...menus.map((m) => ({ kind: 'menu', id: m.id }))]
  const elOf = (it) => (it.kind === 'menu' ? triggerRefs.current.get(it.id) : navRef.current?.querySelector(`a[data-to="${it.id}"]`))
  const onNavKey = (e) => {
    const at = items.findIndex((it) => elOf(it) === e.target)
    if (at < 0) return
    const go = (i) => {
      const it = items[(i + items.length) % items.length]
      elOf(it)?.focus()
      if (openRef.current && it.kind === 'menu') openMenu(it.id)
      else if (openRef.current) closeMenu()
    }
    const target = { ArrowRight: at + 1, ArrowLeft: at - 1, Home: 0, End: items.length - 1 }[e.key]
    if (target !== undefined) {
      e.preventDefault()
      go(target)
    } else if (items[at].kind === 'menu' && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault()
      openMenu(items[at].id, { focus: e.key === 'ArrowDown' ? 'first' : 'last' })
    }
  }
  const onPanelKey = (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    const l = linksOf(currentRef.current)
    const at = l.indexOf(document.activeElement)
    if (at < 0) return
    e.preventDefault()
    l[(at + (e.key === 'ArrowDown' ? 1 : -1) + l.length) % l.length]?.focus()
  }
  // Focus moving somewhere outside the nav and panel closes the menu.
  const onRegionBlur = (e) => {
    if (!openRef.current) return
    const next = e.relatedTarget
    if (!next) return
    if (navRef.current?.contains(next) || panelRef.current?.contains(next)) return
    closeMenu()
  }

  const index = menus.findIndex((m) => m.id === current)
  const onRoute = (m) => m.columns.some((c) => c.links.some((l) => pathname === l.to || pathname.startsWith(`${l.to}/`)))

  return (
    <>
      <nav ref={navRef} className="mn-nav" aria-label="Primary" onKeyDown={onNavKey} onBlur={onRegionBlur} onFocus={() => setLive(true)} onPointerEnter={() => setLive(true)}>
        {plain.map((p) => (
          <NavLink key={p.to} to={p.to} data-to={p.to} className={({ isActive }) => `mn-top${isActive ? ' is-route' : ''}`}>
            {p.label}
          </NavLink>
        ))}
        {menus.map((m) => (
          <button
            key={m.id}
            ref={(el) => (el ? triggerRefs.current.set(m.id, el) : triggerRefs.current.delete(m.id))}
            type="button"
            id={`mn-trigger-${m.id}`}
            className={`mn-top mn-trigger${onRoute(m) ? ' is-route' : ''}`}
            aria-expanded={open && current === m.id}
            aria-controls={`mn-content-${m.id}`}
            onPointerEnter={onTriggerEnter(m.id)}
            onPointerLeave={onTriggerLeave}
            onClick={onTriggerClick(m.id)}
          >
            {m.label}
            <Icon name="chevronDown" className="mn-caret" />
          </button>
        ))}
      </nav>

      <div
        ref={panelRef}
        className="mn-panel"
        data-open={open ? 'true' : 'false'}
        data-instant={instant ? 'true' : 'false'}
        style={geom ? { width: geom.w, height: geom.h, left: geom.x } : undefined}
        onPointerEnter={onPanelEnter}
        onPointerLeave={onPanelLeave}
        onKeyDown={onPanelKey}
        onBlur={onRegionBlur}
      >
        <div className="mn-viewport">
          {menus.map((m, i) => {
            const active = open && current === m.id
            return (
              <div
                key={m.id}
                ref={(el) => (el ? contentRefs.current.set(m.id, el) : contentRefs.current.delete(m.id))}
                id={`mn-content-${m.id}`}
                className="mn-content"
                role="region"
                aria-labelledby={`mn-trigger-${m.id}`}
                data-pos={i < index ? 'before' : i > index ? 'after' : 'active'}
                inert={!active}
              >
                <MenuContent menu={m} live={live} onNavigate={() => closeMenu()} />
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
