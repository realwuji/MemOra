/*
  Corrections to the converted bank, by slide id. The slides are the teacher's
  and are kept as they are; this only adds what a slide left off.

  labels: a curve the teacher did not name. `stroke` is the item index of the
  curve in the slide, `f` how far along it (0 to 1) the name sits, dx and dy
  its offset from that point.
*/
export const FIXES = {
  3: { labels: [{ stroke: 4, f: 0.78, dx: 14, dy: -34, text: 'PPF', c: 'blue' }] },
  13: {
    labels: [
      { stroke: 10, f: 0.96, dx: 10, dy: -30, text: 'D', c: 'blue' },
      { stroke: 11, f: 0.04, dx: 10, dy: -4, text: 'D', c: 'blue' },
    ],
  },
  185: { labels: [{ stroke: 12, f: 0.97, dx: 12, dy: -8, text: 'AS1', c: 'red' }] },
  216: { labels: [{ stroke: 4, f: 0.5, dx: -40, dy: -48, text: 'Kuznets curve' }] },
}
