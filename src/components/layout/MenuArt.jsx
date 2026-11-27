/*
  The small dot illustrations on the header menu cards. They are the page backdrop in miniature: the
  same four effects (packets along rows, a rack with blinking LEDs, packets down columns, log dashes
  drifting up), built from the same lit-dot lattice and the same window and counter-window trick, so a
  card previews the look of the page it opens. No images, no gradients, no blur; only transforms and
  opacity, and none of it runs until the menu is first used (`live`), or at all with reduced motion.

  Geometry is in whole 14px cells so lit dots land on the art's own dim grid. The art box is 238px by
  84px (17 by 6 cells) and meganav.css sets those sizes.
*/
const W = 238
const H = 84

// [row or col or x, length px, seconds, delay, reverse]
const PACKETS = [
  { at: 0, len: 112, dur: 4.2, delay: -0.8, rev: false },
  { at: 2, len: 140, dur: 5.6, delay: -3.1, rev: true },
  { at: 4, len: 98, dur: 3.6, delay: -1.9, rev: false },
]
const BUS = [
  { at: 2, len: 56, dur: 3.4, delay: -0.6, rev: false },
  { at: 6, len: 70, dur: 4.6, delay: -2.4, rev: true },
  { at: 10, len: 56, dur: 3.9, delay: -1.2, rev: false },
  { at: 14, len: 70, dur: 5.1, delay: -3.3, rev: true },
]
const DASHES = [
  { x: 1, n: 6, dur: 5.5, delay: -0.5 },
  { x: 5, n: 8, dur: 6.5, delay: -3.2 },
  { x: 9, n: 5, dur: 5, delay: -1.6 },
  { x: 11, n: 4, dur: 7, delay: -4.4 },
]

export default function MenuArt({ art, live }) {
  return (
    <div className={`mn-art mn-art--${art}`} aria-hidden="true">
      {live && art === 'packets' &&
        PACKETS.map((p, i) => (
          <b key={i} className={`mn-win mn-h${p.rev ? ' rev' : ''}`} style={{ top: p.at * 14, '--len': `${p.len}px`, '--dur': `${p.dur}s`, '--delay': `${p.delay}s` }}>
            <i />
          </b>
        ))}
      {live && art === 'bus' &&
        BUS.map((p, i) => (
          <b key={i} className={`mn-win mn-v${p.rev ? ' rev' : ''}`} style={{ left: p.at * 14, '--len': `${p.len}px`, '--dur': `${p.dur}s`, '--delay': `${p.delay}s` }}>
            <i />
          </b>
        ))}
      {art === 'rack' && (
        <>
          <span className="mn-rackrows" />
          {live && (
            <>
              <span className="mn-led" style={{ '--x': '63px', '--blink': '3.1s', '--delay': '-0.4s' }} />
              <span className="mn-led" style={{ '--x': '91px', '--blink': '4.7s', '--delay': '-1.8s' }} />
              <span className="mn-led" style={{ '--x': '161px', '--blink': '5.9s', '--delay': '-3.3s' }} />
              <span className="mn-led" style={{ '--x': '203px', '--blink': '7.3s', '--delay': '-2.1s' }} />
            </>
          )}
        </>
      )}
      {live && art === 'log' &&
        DASHES.map((d, i) => (
          <b key={i} className="mn-win mn-u" style={{ left: d.x * 14, width: d.n * 14, '--dur': `${d.dur}s`, '--delay': `${d.delay}s` }}>
            <i />
          </b>
        ))}
    </div>
  )
}

export { W as ART_W, H as ART_H }
