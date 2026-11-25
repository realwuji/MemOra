/*
  What the shaded or lettered areas of a diagram are, by slide number. Hover an
  area in the bank or in diagram revision and it says what it is.

    fill   the number of the slide's own shaded shape (its index in
           diagram-bank.json items), when the area is a shaded polygon
    poly   or the corners of the area as [x, y] pairs in the slide's own
           coordinates, for a lettered area that has no shape of its own
    name   what the area is, in a few words (Consumer surplus at P2)
    note   one short sentence of why, when the name alone does not explain it

  An area the teacher did not define is simply left out: no definition is
  better than a guessed one.
*/
export const AREAS = {
  // The three rectangles sit inside each other, so the largest is listed first and the
  // smallest last: pointing at one picks the smallest rectangle that holds the point.
  112: [
    { fill: 14, name: 'Total cost at output F', note: 'Its height is AC at F and its width is output F, so the rectangle is TC = AC x Q.' },
    { fill: 13, name: 'Total cost at output E', note: 'AC is at its lowest here, so each unit costs least at E.' },
    { fill: 12, name: 'Total cost at output D', note: 'Its height is AC at D and its width is output D, so the rectangle is TC = AC x Q.' },
  ],
  42: [
    { poly: [[284, 214], [413, 214], [413, 336], [284, 336]], name: 'Area A: revenue lost', note: 'The Q units sold before now sell at P1, not P, so each brings in less.' },
    { poly: [[284, 336], [413, 336], [413, 509], [284, 509]], name: 'Area B: revenue kept', note: 'The Q units sold before still sell, at the new price P1. Original revenue is A + B.' },
    { poly: [[413, 336], [577, 336], [577, 509], [413, 509]], name: 'Area C: revenue gained', note: 'The extra units sold, Q to Q1, at P1. New revenue is B + C.' },
  ],
}
