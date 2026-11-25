/*
  Corrections to the converted bank, by slide id. The slides are the teacher's
  and are kept as they are; this only adds what a slide left off.

  labels: a curve the teacher did not name. `stroke` is the item index of the
  curve in the slide, `f` how far along it (0 to 1) the name sits, dx and dy
  its offset from that point.

  noShift: the slide compares two outcomes (P1 and P2, Q1 and Q2) and nothing
  shifts, so no guide line is treated as "after the shift".

  drop: items (by their number in the slide) that are wrong or not wanted.
  recolour: { item number: colour } for things the slide coloured the same that
  must be told apart.
  rename: { item number: text } a label that says the wrong thing.
  notCurve: ['D'] letters that mark points, not curves.
  fills: { poly, c, o } shaded areas drawn in place of dropped ones.
  texts: { x, y, text, c } letters that name those areas.
*/
export const FIXES = {
  3: {
    rename: { 2: 'Capital goods (K)', 3: 'Consumer goods (C)' },
    labels: [
      { stroke: 4, f: 0.78, dx: 14, dy: -34, text: 'PPF', c: 'blue' },
    ],
  },
  // The PPF axes carry their usual letters: K for capital goods, C for consumer goods.
  4: {
    rename: { 2: 'Capital goods (K)', 3: 'Consumer goods (C)' },
  },
  5: {
    rename: { 3: 'Consumer goods (C)', 6: 'Capital goods (K)' },
    nudge: { 7: [-20, 0] },
  },
  6: {
    rename: { 2: 'Capital goods (K)', 3: 'Consumer goods (C)' },
  },
  // Contraction only, as in the extension slide (#9): the curve is already there,
  // so the shifted curve and its arrow and caption added nothing.
  10: {
    drop: [12, 13, 14, 15],
    nudge: { 11: [10, 0] },
  },
  11: {
    rename: { 5: 'D market' },
  },
  13: {
    labels: [
      { stroke: 10, f: 0.96, dx: 10, dy: -30, text: 'D', c: 'blue' },
      { stroke: 11, f: 0.04, dx: 10, dy: -4, text: 'D', c: 'blue' },
    ],
  },
  22: {
    vertical: [16, 10],
  },
  24: {
    rename: { 2: 'Price of coffee', 3: 'Quantity of coffee' },
  },
  26: {
    nudge: { 18: [-185, 4] },
  },
  // Elastic and inelastic told apart: blue for the elastic stretch, amber for the inelastic one.
  29: {
    recolour: { 2: 'blue', 22: 'blue', 23: 'amber', 24: 'blue', 25: 'amber' },
  },
  31: {
    recolour: { 6: 'ink', 9: 'ink', 10: 'ink', 16: 'red' },
    rename: { 3: 'Price', 4: 'Quantity', 5: 'D' },
  },
  35: {
    nudge: { 2: [-12, 0], 3: [22, 0], 8: [-14, 0] },
  },
  37: {
    rename: { 3: 'Price', 4: 'Quantity', 5: 'D' },
    recolour: { 6: { c: 'blue', o: 0.3 } },
  },
  // Revenue diagrams for a firm: its demand curve is its AR curve (as in #43 and #45).
  40: {
    rename: { 5: 'AR = D' },
  },
  42: {
    rename: { 9: 'AR = D' },
    drop: [10, 11, 12, 13],
    fills: [
      { poly: [[284, 214], [413, 214], [413, 336], [284, 336]], c: 'red', o: 0.3 },
      { poly: [[284, 336], [413, 336], [413, 509], [284, 509]], c: 'blue', o: 0.3 },
      { poly: [[413, 336], [577, 336], [577, 509], [413, 509]], c: 'green', o: 0.35 },
    ],
    texts: [
      { x: 340, y: 262, text: 'A', c: 'red' },
      { x: 340, y: 410, text: 'B', c: 'blue' },
      { x: 487, y: 410, text: 'C', c: 'green' },
    ],
  },
  43: {
    recolour: { 10: { c: 'blue', o: 0.3 }, 11: { c: 'red', o: 0.3 } },
  },
  44: {
    recolour: { 7: 'ink', 8: 'ink', 9: 'ink', 17: 'ink', 18: 'ink' },
  },
  48: {
    recolour: { 6: 'ink', 7: 'ink', 8: 'ink', 9: 'ink', 12: 'ink', 13: 'ink', 14: 'green' },
  },
  50: {
    nudge: { 12: [136, -22] },
  },
  51: {
    rename: { 13: 'Max Price e.g. $0.44 per kg' },
    recolour: { 12: 'green', 13: 'green', 17: 'ink' },
  },
  52: {
    rename: { 12: 'Price floor', 16: 'Price ceiling' },
  },
  53: {
    rename: { 3: 'Price', 4: 'Quantity' },
  },
  54: {
    fills: [
      { poly: [[284, 257], [463, 257], [463, 359], [284, 359]], c: 'blue', o: 0.3 },
    ],
  },
  56: {
    drop: [21],
  },
  58: {
    rename: { 2: 'Price', 3: 'Quantity' },
  },
  59: {
    nudge: { 16: [96, 100] },
  },
  62: {
    recolour: { 8: 'red', 9: 'red', 10: 'red', 11: 'red', 12: 'ink', 13: 'green', 14: 'green', 15: 'ink' },
  },
  64: {
    recolour: { 8: 'red', 9: 'red', 10: 'red', 11: 'red', 12: 'ink', 13: 'green', 14: 'green', 15: 'ink' },
    nudge: { 19: [55, 95] },
  },
  65: {
    fills: [
      { poly: [[584.7, 333], [694, 460.5], [694, 212.9]], c: 'blue', o: 0.4 },
    ],
  },
  66: {
    rename: { 2: 'Costs and Benefits' },
    recolour: { 13: 'red', 14: 'red' },
    fills: [
      { poly: [[504.5, 312.4], [624, 452.2], [624, 187.3]], c: 'blue', o: 0.4 },
    ],
  },
  67: {
    rename: { 2: 'Costs and benefits' },
  },
  68: {
    rename: { 2: 'Costs and benefits' },
    fills: [
      { poly: [[616.7, 333], [674, 399.8], [674, 270]], c: 'blue', o: 0.4 },
    ],
  },
  69: {
    rename: { 2: 'Costs and benefits' },
    fills: [
      { poly: [[490, 327], [606, 383.6], [606, 205]], c: 'blue', o: 0.4 },
    ],
  },
  70: {
    recolour: { 25: 'red', 26: 'red', 27: 'red', 28: 'red', 29: 'ink', 30: 'green', 31: 'green', 32: 'ink' },
    rename: { 2: 'Price, costs, benefits', 20: 'Price, costs, benefits' },
    nudge: { 2: [0, -22], 20: [35, -22], 24: [-25, 0] },
    fills: [
      { poly: [[367.4, 307.1], [324, 269.5], [324, 355]], c: 'blue', o: 0.4 },
      { poly: [[894, 357.8], [946, 404.2], [946, 300.6]], c: 'blue', o: 0.4 },
    ],
  },
  71: {
    drop: [17],
    fills: [
      { poly: [[594, 203], [650.8, 269.3], [594, 329]], c: 'blue', o: 0.4 },
    ],
  },
  72: {
    drop: [17],
    fills: [
      { poly: [[593, 203], [649.8, 269.3], [593, 329]], c: 'blue', o: 0.4 },
    ],
  },
  73: {
    rename: { 8: 'P' },
    drop: [19],
    fills: [
      { poly: [[623, 335.7], [671, 391.7], [623, 436]], c: 'blue', o: 0.4 },
    ],
  },
  74: {
    drop: [19],
    fills: [
      { poly: [[585, 335.7], [633, 391.7], [633, 278.1]], c: 'blue', o: 0.4 },
    ],
  },
  75: {
    drop: [19],
    fills: [
      { poly: [[607, 317.7], [655, 373.7], [655, 262.4]], c: 'blue', o: 0.4 },
    ],
  },
  77: {
    rename: { 2: 'Wage rate' },
  },
  79: {
    recolour: { 8: 'amber', 16: 'amber' },
    rename: { 3: 'Wage rate', 4: 'Quantity of labour', 5: 'DL', 7: 'SL' },
  },
  82: {
    rename: { 2: 'Wage rate', 3: 'Quantity of labour', 9: 'W2', 16: 'W1' },
  },
  83: {
    rename: { 2: 'Wage rate', 3: 'Quantity of labour', 9: 'W1', 16: 'W2' },
  },
  84: {
    rename: { 14: 'WTU' },
  },
  85: {
    recolour: { 8: 'amber' },
    rename: { 3: 'Wage rate', 4: 'Quantity of labour', 5: 'DL', 7: 'SL' },
  },
  86: {
    recolour: { 10: 'amber', 11: 'amber', 12: 'amber', 13: 'amber' },
    rename: { 2: 'Wage rate (£)' },
  },
  // Curves the teacher drew without a short name the engine can read: coloured by what they are.
  87: {
    recolour: { 4: 'green', 7: 'green' },
  },
  88: {
    rename: { 2: 'Wage rate', 6: 'Wage rate' },
  },
  99: {
    nudge: { 11: [-26, 0], 12: [26, 6] },
  },
  101: {
    rename: { 15: 'Costs and Revenue' },
    nudge: { 2: [-16, 0], 9: [-16, 0], 15: [-26, 0], 30: [-10, 0], 31: [14, 0] },
  },
  // The letters A to F mark points on the product curves, and D is not a demand curve.
  102: {
    notCurve: ['D'],
    vertical: [14, 15],
  },
  // The two revenue rectangles overlapped. Redrawn as the three areas they make:
  // lost (A), kept (B) and gained (C), so original revenue is A + B and new revenue is B + C.
  // Three nested rectangles (total cost at D, E and F): one soft colour each, so each can be
  // told apart where they overlap, instead of a solid block under two amber ones.
  112: {
    recolour: { 9: 'ink', 12: { c: 'blue', o: 0.3 }, 13: { c: 'green', o: 0.22 }, 14: { c: 'amber', o: 0.2 } },
  },
  115: {
    rename: { 2: 'Costs' },
    pin: { 6: [284, 366], 8: [551, 366] },
    pinEnd: { 6: [551, 366] },
    nudge: { 12: [0, -4] },
  },
  118: {
    recolour: { 4: 'green', 5: 'green' },
  },
  119: {
    rename: { 2: 'Costs', 3: 'Output' },
    solid: [1],
  },
  120: {
    nudge: { 7: [9, -95] },
  },
  124: {
    rename: { 10: 'P' },
    recolour: { 8: 'blue', 9: 'blue' },
  },
  125: {
    drop: [19, 20],
    recolour: { 8: 'blue', 9: 'blue' },
  },
  126: {
    recolour: { 12: 'blue' },
  },
  127: {
    recolour: { 8: 'blue', 9: 'blue' },
  },
  130: {
    recolour: { 14: 'amber' },
  },
  131: {
    recolour: { 13: 'blue' },
  },
  132: {
    nudge: { 7: [9, -95] },
  },
  133: {
    recolour: { 14: 'blue' },
    nudge: { 7: [9, -95] },
  },
  134: {
    rename: { 2: 'Costs and Revenue', 11: 'Q', 17: 'Q1' },
  },
  137: {
    recolour: { 0: 'blue' },
  },
  138: {
    rename: { 2: 'Costs and Revenue', 3: 'Output' },
  },
  139: {
    rename: { 15: 'C' },
  },
  // Comparisons of two outcomes, not a shift: every guide line is drawn, none is held back.
  140: {
    noShift: true,
    rename: { 2: 'Costs and Revenue', 3: 'Output' },
    nudge: { 8: [14, 0] },
  },
  // Both marginal cost curves are red; Ppc is a price, not a curve.
  141: {
    recolour: { 4: 'red', 9: 'red', 12: 'red', 19: 'red' },
    pin: { 8: [284, 97], 14: [427, 197], 15: [427, 197] },
    pinEnd: { 14: [427, 509], 15: [286, 197] },
    nudge: { 11: [37, 0], 17: [0, -52] },
  },
  142: {
    nudge: { 6: [-23, 8], 15: [8, 0], 17: [14, 0], 21: [-8, 0] },
  },
  143: {
    recolour: { 15: 'blue' },
    rename: { 12: 'Profit', 14: 'Q' },
    nudge: { 8: [14, 0] },
    pin: { 9: [284, 97] },
  },
  144: {
    recolour: { 12: 'amber' },
  },
  145: {
    rename: { 13: 'Q', 15: 'P' },
    recolour: { 13: 'ink', 15: 'ink' },
    pin: { 9: [284, 97] },
  },
  146: {
    noShift: true,
    rename: { 25: 'Supernormal profit' },
  },
  147: {
    rename: { 2: 'Costs and Revenue', 3: 'Output' },
  },
  149: {
    rename: { 19: 'Supernormal profit' },
  },
  // The short run panel was pasted twice on top of itself (and its AR and MR label
  // nudged), so every label was doubled. One copy is kept.
  151: {
    drop: [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51],
    recolour: { 12: 'blue', 13: 'blue', 14: 'ink', 15: 'ink' },
    nudge: { 2: [-14, 0], 18: [-8, 0], 26: [-14, 0] },
  },
  152: {
    nudge: { 8: [-30, -13] },
  },
  153: {
    nudge: { 20: [8, 0], 21: [-10, 0] },
  },
  155: {
    pin: { 15: [284, 111] },
  },
  157: {
    rename: { 2: 'Costs and Revenue', 17: 'Costs and Revenue', 32: 'Costs and Revenue' },
  },
  // The upper part of a kinked AR is AR (blue) and of a kinked MR is MR (purple).
  158: {
    recolour: { 6: 'blue', 10: 'purple' },
    texts: [
      { x: 558, y: 527, text: 'Q', c: 'ink' },
    ],
  },
  159: {
    recolour: { 6: 'blue', 13: 'purple' },
  },
  // Two different LRAC curves, so two different colours.
  160: {
    noShift: true,
    recolour: { 4: 'green', 5: 'green', 9: 'cyan', 10: 'cyan' },
  },
  161: {
    noShift: true,
    recolour: { 10: 'ink', 15: 'red' },
    pinEnd: { 0: [349, 495] },
    nudge: { 19: [10, 0] },
  },
  162: {
    noShift: true,
    texts: [
      { x: 501, y: 527, text: 'Q1', c: 'ink' },
      { x: 544, y: 527, text: 'Q2', c: 'ink' },
      { x: 619, y: 527, text: 'Q3', c: 'ink' },
    ],
    nudge: { 8: [40, 12] },
  },
  // Every AD / AS diagram's vertical axis reads "Price level" (it was Price level, General
  // price level and PL).
  164: {
    rename: { 3: 'Price level' },
    nudge: { 7: [10, -26] },
  },
  // Every AD / AS diagram names its x axis the same way: Real GDP (it was Real National
  // Output, RNO, Y and Real GDP).
  165: {
    rename: { 3: 'Real GDP' },
  },
  166: {
    rename: { 3: 'Price level' },
  },
  167: {
    rename: { 3: 'Price level' },
  },
  168: {
    rename: { 3: 'Real GDP' },
  },
  169: {
    rename: { 3: 'Real GDP' },
  },
  170: {
    rename: { 3: 'Real GDP' },
  },
  171: {
    rename: { 3: 'Real GDP' },
  },
  172: {
    rename: { 3: 'Real GDP' },
  },
  173: {
    rename: { 3: 'Real GDP' },
  },
  174: {
    rename: { 3: 'Real GDP' },
  },
  175: {
    rename: { 3: 'Real GDP', 6: 'Yfe2', 11: 'Yfe1', 14: 'P1', 15: 'P2' },
  },
  176: {
    rename: { 2: 'Price level', 3: 'Real GDP' },
  },
  177: {
    rename: { 3: 'Real GDP' },
  },
  178: {
    rename: { 3: 'Real GDP' },
  },
  179: {
    rename: { 10: 'Real GDP' },
  },
  180: {
    rename: { 3: 'Price level', 4: 'Real GDP' },
    pinEnd: { 16: [304, 381] },
  },
  181: {
    rename: { 11: 'Real GDP' },
    nudge: { 24: [0, -10] },
  },
  182: {
    rename: { 2: 'Price level' },
    recolour: { 18: 'blue' },
    nudge: { 17: [25, 0] },
  },
  183: {
    rename: { 11: 'Real GDP' },
  },
  184: {
    rename: { 11: 'Real GDP' },
  },
  185: {
    rename: { 2: 'Price level' },
    labels: [
      { stroke: 12, f: 0.97, dx: 12, dy: -8, text: 'AS1', c: 'red' },
    ],
  },
  186: {
    rename: { 4: 'Price level' },
  },
  187: {
    rename: { 4: 'Price level' },
    nudge: { 7: [-36, 0], 13: [40, -6] },
  },
  188: {
    rename: { 2: 'Price level', 14: 'Price level' },
  },
  189: {
    nudge: { 18: [8, -42] },
  },
  190: {
    rename: { 3: 'Real GDP' },
  },
  191: {
    rename: { 3: 'Real GDP' },
  },
  200: {
    rename: { 2: 'Exchange rate (price of currency)' },
    nudge: { 18: [-18, 0] },
  },
  201: {
    rename: { 2: 'Price of £', 3: 'Quantity of £' },
  },
  202: {
    rename: { 2: 'Exchange rate (price of currency)' },
  },
  203: {
    rename: { 3: 'Quantity of currency' },
  },
  206: {
    recolour: { 4: 'blue', 5: 'purple', 6: 'blue', 7: 'purple', 8: 'green', 9: 'green', 10: 'green', 11: 'green' },
  },
  207: {
    recolour: { 8: 'blue', 9: 'blue' },
  },
  208: {
    notCurve: ['T1', 'T2'],
    rename: { 2: 'Tax revenue' },
  },
  209: {
    rename: { 2: 'Tax revenue', 6: 'T*', 9: 'T2' },
    notCurve: ['TR1', 'TR2'],
  },
  210: {
    rename: { 2: 'Tax revenue', 3: 'Tax rate %' },
  },
  211: {
    rename: { 2: 'Tax revenue' },
  },
  212: {
    rename: { 12: 'Lorenz curve' },
  },
  213: {
    rename: { 17: 'Cumulative percentage of households' },
    recolour: { 11: 'amber', 12: 'amber', 15: 'amber' },
  },
  214: {
    recolour: { 0: 'green', 1: 'blue', 3: 'green', 4: 'blue' },
  },
  215: {
    recolour: { 2: 'amber', 4: 'amber', 6: 'amber' },
    nudge: { 5: [-30, -14], 8: [30, 0] },
  },
  216: {
    labels: [
      { stroke: 4, f: 0.5, dx: -40, dy: -48, text: 'Kuznets curve' },
    ],
    recolour: { 4: 'green', 9: 'green' },
  },
  218: {
    recolour: { 2: 'green', 5: 'green', 6: 'purple', 7: 'purple' },
    rename: { 5: 'China' },
  },
  219: {
    nudge: { 3: [30, 0] },
  },
  222: {
    recolour: { 0: 'red', 4: 'red', 8: 'red', 9: 'ink', 10: 'ink', 11: 'red', 16: 'red', 17: 'red', 18: 'ink' },
  },
  223: {
    recolour: { 0: 'red', 4: 'red', 7: 'red', 10: 'red', 15: 'red', 16: 'red' },
  },
  224: {
    recolour: { 11: 'red', 12: 'red' },
    notCurve: ['P1', 'P2', 'Q1', 'Q2'],
  },
  225: {
    recolour: { 0: 'red', 10: 'red', 15: 'red', 16: 'red' },
  },
  226: {
    drop: [16],
  },
}
