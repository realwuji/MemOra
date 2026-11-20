/*
  The Memoora wordmark: a terminal prompt.  > memoora▮

  Set in JetBrains Mono ExtraBold. The wordmark inherits its colour from its
  parent (e.g. `text-brand`), so it follows the theme. The ">" prompt is a
  muted tone of the same colour; the block cursor blinks.

  Motion (animated wordmarks only, i.e. the header and hero):
    - boot:  the prompt appears, then each letter types itself in, decoding
             through a few random glyphs as it lands.
    - hover: the letter under the pointer scrambles through random glyphs and
             settles back, with a split-slice glitch while it does.
    - idle:  every few seconds a random letter glitches on its own, as if the
             terminal is still alive.
    - the cursor goes solid while the wordmark is hovered.
  Static wordmarks (footer, sign-in, legal pages) show the same mark with only
  the blinking cursor. Reduced motion turns every effect off.

  The wordmark is exposed as one image labelled "Memoora": scrambled glyphs
  must never be read out or copied as text.

  Sizes:
  - 'nav'  : 21px (navbar / small contexts)
  - 'hero' : 6xl–8xl (landing hero, marketing hero)
*/

import { useCallback, useEffect, useRef, useState } from 'react'
import './sigil.css'

const WORD = 'memoora'
const GLYPHS = '01<>/\\|_-+*#%&@$=:;?!'
const FRAME_MS = 45
const BOOT_START_MS = 380 // after the prompt appears
const BOOT_STEP_MS = 95 // gap between letters typing in

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// One letter of the animated wordmark. `triggers` is a shared ref array so the
// parent can fire this letter's scramble for the idle glitch.
function Letter({ char, index, triggers }) {
  const reduce = useRef(prefersReducedMotion())
  const [shown, setShown] = useState(reduce.current ? char : '')
  const [glitching, setGlitching] = useState(false)
  const timers = useRef([])
  const busy = useRef(false)

  const clear = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  // Cycle through `frames` random glyphs, then settle on the real letter.
  const scramble = useCallback(
    (frames, delay = 0) => {
      if (reduce.current) return
      clear()
      busy.current = true
      for (let i = 0; i < frames; i += 1) {
        timers.current.push(
          setTimeout(() => {
            setShown(randomGlyph())
            setGlitching(true)
          }, delay + i * FRAME_MS),
        )
      }
      timers.current.push(
        setTimeout(() => {
          setShown(char)
          setGlitching(false)
          busy.current = false
        }, delay + frames * FRAME_MS),
      )
    },
    [char],
  )

  useEffect(() => {
    triggers.current[index] = (frames) => {
      if (!busy.current) scramble(frames)
    }
    // Boot: type in, decoding as the letter lands.
    if (!reduce.current) scramble(5, BOOT_START_MS + index * BOOT_STEP_MS)
    return clear
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <span
      className={`t-letter${glitching ? ' glitch' : ''}${shown === '' ? ' pending' : ''}`}
      data-char={shown}
      onPointerEnter={() => {
        if (!busy.current) scramble(7)
      }}
    >
      {shown}
    </span>
  )
}

function AnimatedWordmark({ className }) {
  const triggers = useRef([])

  // Idle glitch: a random letter scrambles briefly every few seconds.
  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    let timer
    const tick = () => {
      const fire = triggers.current[Math.floor(Math.random() * WORD.length)]
      fire?.(3)
      timer = setTimeout(tick, 3500 + Math.random() * 5500)
    }
    timer = setTimeout(tick, 4500 + Math.random() * 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <span role="img" aria-label="Memoora" className={`term-word ${className}`}>
      <span aria-hidden="true" className="t-inner">
        <span className="t-prompt">&gt;</span>
        {WORD.split('').map((c, i) => (
          <Letter key={i} char={c} index={i} triggers={triggers} />
        ))}
        <span className="t-cursor" />
      </span>
    </span>
  )
}

function StaticWordmark({ className }) {
  return (
    <span role="img" aria-label="Memoora" className={`term-word ${className}`}>
      <span aria-hidden="true" className="t-inner">
        <span className="t-prompt static">&gt;</span>
        <span className="t-static-text">{WORD}</span>
        <span className="t-cursor" />
      </span>
    </span>
  )
}

function SigilWordmarkText({ className = '', animate = false }) {
  return animate ? (
    <AnimatedWordmark className={className} />
  ) : (
    <StaticWordmark className={className} />
  )
}

export default function SigilWordmark({ size = 'nav', className = '', animate = false }) {
  if (size === 'hero') {
    return (
      <SigilWordmarkText
        animate={animate}
        className={`text-6xl sm:text-7xl lg:text-8xl text-brand ${className}`}
      />
    )
  }
  return (
    <SigilWordmarkText animate={animate} className={`text-[21px] text-brand ${className}`} />
  )
}
