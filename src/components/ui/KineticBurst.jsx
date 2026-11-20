import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

/*
  Hero motion graphic: expanding shockwave rings, tilted orbits with glowing
  satellites, sweeping beams and a breathing core glow, all pointer-parallaxed.
  Decorative only (aria-hidden). Colours come from semantic tokens so it
  re-themes and re-accents; hidden under reduced motion and in high-contrast
  (see .kb in index.css).
*/
const RINGS = [
  { s: '38vmin', c: 'var(--brand)', d: '0s' },
  { s: '38vmin', c: 'var(--flash)', d: '-2.3s' },
  { s: '38vmin', c: 'var(--quiz)', d: '-4.6s' },
]
const ORBITS = [
  { s: '52vmin', c: 'var(--brand)', t: '14s', tilt: '68deg' },
  { s: '70vmin', c: 'var(--flash)', t: '22s', tilt: '62deg', dir: 'reverse' },
  { s: '90vmin', c: 'var(--paper)', t: '31s', tilt: '74deg' },
  { s: '62vmin', c: 'var(--quiz)', t: '18s', tilt: '55deg', dir: 'reverse' },
]
const BEAMS = [
  { a: '-20deg', c: 'var(--brand)', d: '0s' },
  { a: '200deg', c: 'var(--flash)', d: '-1.7s' },
  { a: '35deg', c: 'var(--paper)', d: '-3.2s' },
  { a: '160deg', c: 'var(--quiz)', d: '-4.1s' },
]

export default function KineticBurst() {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 18 })
  const sy = useSpring(my, { stiffness: 60, damping: 18 })
  const rotY = useTransform(sx, [-1, 1], [-14, 14])
  const rotX = useTransform(sy, [-1, 1], [10, -10])

  const onMove = (e) => {
    mx.set((e.clientX / window.innerWidth) * 2 - 1)
    my.set((e.clientY / window.innerHeight) * 2 - 1)
  }

  return (
    <div ref={ref} className="kb" aria-hidden="true">
      <motion.div
        className="kb-stage"
        style={{ rotateX: rotX, rotateY: rotY }}
        onPointerMove={onMove}
      >
        <div className="kb-glow" />
        {BEAMS.map((b) => (
          <span key={b.a} className="kb-beam" style={{ '--a': b.a, '--c': b.c, '--d': b.d }} />
        ))}
        {RINGS.map((r) => (
          <span key={r.d} className="kb-ring" style={{ '--s': r.s, '--c': r.c, '--d': r.d }} />
        ))}
        {ORBITS.map((o) => (
          <span key={o.s} className="kb-orbit" style={{ '--s': o.s, '--c': o.c, '--t': o.t, '--tilt': o.tilt, '--dir': o.dir }}>
            <span className="kb-dot" />
          </span>
        ))}
      </motion.div>
    </div>
  )
}
