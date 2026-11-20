import KineticBurst from '@/components/ui/KineticBurst'

/*
  Motion layer for the dashboard banner, the one decorative surface on the
  page (see HeroBanner). A spinning conic aurora, rising embers, a diagonal
  light sheen and the orbital burst, all pointer-events:none so nothing
  underneath stops being clickable. Confined to the banner card on purpose:
  a page-wide wash fights the readiness colours (see Dashboard.jsx).
  Token colours only; hidden under reduced motion and in high-contrast.
*/
const EMBERS = Array.from({ length: 22 }, (_, i) => ({
  x: `${(i * 37 + 7) % 100}%`,
  s: `${4 + ((i * 5) % 9)}px`,
  d: `${-((i * 1.7) % 11)}s`,
  t: `${7 + ((i * 3) % 7)}s`,
  w: `${((i % 5) - 2) * 18}px`,
  c: ['var(--brand)', 'var(--flash)', 'var(--paper)', 'var(--quiz)'][i % 4],
}))

export default function HeroFX() {
  return (
    <div className="hero-fx" aria-hidden="true">
      <span className="hero-fx-aurora" />
      <KineticBurst />
      {EMBERS.map((e, i) => (
        <span
          key={i}
          className="hero-fx-ember"
          style={{ '--x': e.x, '--s': e.s, '--d': e.d, '--t': e.t, '--w': e.w, '--c': e.c }}
        />
      ))}
      <span className="hero-fx-sheen" />
    </div>
  )
}
