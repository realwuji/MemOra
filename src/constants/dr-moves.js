/*
  What shifts each named curve, keyed by the curve's base label. Shown when a
  curve is hovered in the diagram bank and in diagram revision, and as the
  "What shifts each curve" panel. A curve whose label is not here (a J-curve,
  a Lorenz curve) simply gets no tooltip: there is nothing that "shifts" it.

  Every line is "Cause: what it does to the curve". The panel splits at the colon, so
  the cause is the heading and the effect is the explanation beneath it. Keep the
  effect in full (which way the curve moves and why), and keep brackets out of it.
*/
const D = [
  'Population: more buyers shift D right, fewer buyers shift it left',
  'Income: a rise shifts D right for normal goods and left for inferior goods',
  'Prices of related goods: a dearer substitute shifts D right, a dearer complement shifts D left',
  'Tastes and advertising: a fashion or a successful advert shifts D right, a loss of popularity shifts it left',
  'Expected future prices: if buyers expect prices to rise, D shifts right now, and if they expect them to fall, it shifts left',
  'Seasons: demand for a seasonal good shifts right in season and left out of season',
  'Interest rates and credit: cheaper borrowing shifts D right for goods bought on credit, dearer borrowing shifts it left',
]
const S = [
  'Costs of production: higher costs shift S left, lower costs shift it right',
  'Technology and productivity: improvements shift S right',
  'Indirect taxes and subsidies: a tax shifts S left, a subsidy shifts it right',
  'Number of firms: entry shifts S right, exit shifts it left, and barriers to entry limit this',
  'Weather and shocks: a good harvest shifts S right, a drought, disaster or strike shifts it left',
  'Producer expectations: if firms expect higher prices later, they may hold back supply now and shift S left',
]
const MCS = [
  'Wages and variable input costs: a rise shifts MC up, a fall shifts it down',
  'Technology: better technology shifts MC down',
  'Productivity of workers: higher productivity shifts MC down',
  'Fixed costs: these do not shift MC, because MC only counts the cost of one more unit',
]
const COSTS = [
  'Wages and other input costs: a rise shifts the curve up, a fall shifts it down',
  'Technology: better technology shifts the curve down',
  'Productivity of workers: higher productivity shifts the curve down',
  'Fixed costs: these shift AC and AFC but not MC',
]
const AD = [
  'Consumption: higher confidence or wealth, or lower interest rates, shift AD right, and the opposite shifts it left',
  'Investment: lower interest rates or optimistic expectations shift AD right',
  'Government spending: higher spending shifts AD right, cuts shift it left',
  'Net exports: a weaker exchange rate or faster world growth shifts AD right',
]
// The Keynesian AS curve is simply called AS (never LRAS).
const AS = [
  'Costs of production: wages, energy, materials or a weaker exchange rate move the whole curve, higher costs left and lower costs right',
  'Productivity, technology and education: these raise full capacity, so the vertical part moves right',
  'More workers or capital: these also raise full capacity and move the vertical part right',
  'Taxes, subsidies and regulation on firms: higher taxes or tougher rules shift AS left, subsidies shift it right',
]
const REV = [
  'Income and tastes: a rise in income or popularity shifts AR right, a fall shifts it left',
  'Prices of substitutes and complements: a dearer substitute shifts AR right, a dearer complement shifts it left',
  'Advertising and brand loyalty: effective advertising shifts AR right',
]
const LABOUR_SUPPLY = [
  'Population and migration: more workers shift labour supply right',
  'Wages in other jobs: higher pay elsewhere shifts labour supply left',
  'Benefits besides wages: better non-wage benefits in this job shift labour supply right',
  'Training and qualifications: more people qualified for the job shift labour supply right',
]

export const MOVES = {
  D: D,
  DEMAND: D,
  S: S,
  SUPPLY: S,
  'D£': [
    'Foreign demand for exports: more exports sold abroad means more pounds bought, which shifts D£ right',
    'Interest rates and hot money: higher UK interest rates attract savings and shift D£ right',
    'Inward investment: foreign firms buying UK assets shift D£ right',
    'Speculation and confidence: expecting the pound to rise shifts D£ right',
  ],
  'S£': [
    'Demand for imports: more spending on imports means more pounds sold, which shifts S£ right',
    'Investment abroad: UK firms investing overseas shift S£ right',
    'Lower interest rates: savers move money abroad, so S£ shifts right',
    'Quantitative easing and falling confidence: more pounds supplied, or expected falls, shift S£ right',
  ],
  PPF: [
    'More or better factors of production: more labour, land or capital shifts the PPF outwards',
    'Technology and productivity: these shift the PPF outwards, or pivot it if only one good gains',
    'Investment in capital goods: this raises future capacity and shifts the PPF outwards over time',
    'War, disaster or resource loss: these shift the PPF inwards',
  ],
  AD: AD,
  AS: AS,
  SRAS: [
    'Wages and other input costs: a rise shifts SRAS left, a fall shifts it right',
    'Energy and commodity prices: dearer inputs shift SRAS left',
    'Taxes and regulation on firms: higher taxes or tougher rules shift SRAS left, subsidies shift it right',
    'Exchange rate: a weaker currency makes imported inputs dearer and shifts SRAS left',
  ],
  LRAS: [
    'Quantity of factors of production: more workers, capital or land shifts LRAS right',
    'Quality of factors: better education, technology and productivity shift LRAS right',
    'Institutions, infrastructure and investment: improvements shift LRAS right, damage shifts it left',
  ],
  AR: REV,
  MR: ['Moves with AR: any demand shifter that moves AR moves MR in the same direction'],
  MC: MCS,
  AC: COSTS,
  ATC: COSTS,
  AVC: [
    'Wages and variable input costs: a rise shifts AVC up, a fall shifts it down',
    'Technology and productivity: improvements shift AVC down',
  ],
  AFC: ['Fixed costs: higher rent or capital costs shift AFC up, lower costs shift it down'],
  MSC: [
    'External cost: a bigger external cost of production puts MSC further above MPC',
    'Any MPC shifter: costs, technology or taxes move MSC the same way as MPC',
    'External benefit of production: this puts MSC below MPC',
  ],
  MSB: [
    'External benefit: a bigger external benefit of consumption puts MSB further above MPB',
    'Any MPB shifter: income, tastes or prices move MSB the same way as MPB',
    'External cost of consumption: this puts MSB below MPB',
  ],
  MPC: S,
  MPB: D,
  LRAC: [
    'Technology: better technology shifts LRAC down',
    'Input prices: dearer inputs shift LRAC up',
    'External economies of scale: growth of the industry shifts LRAC down',
    'Internal scale: growing output is a movement along LRAC, not a shift',
  ],
  SRAC: [
    'Fixed and variable costs: higher costs shift SRAC up, lower costs shift it down',
    'Scale of plant: a bigger plant puts the firm on a different SRAC curve',
  ],
  MRP: [
    'Productivity of labour: more output per worker shifts MRP right',
    'Price of the output: a higher price shifts MRP right',
    'Demand for the product: stronger demand shifts MRP right',
  ],
  SRPC: [
    'Expected inflation: higher expectations shift SRPC upwards',
    'Supply shocks: higher energy prices shift SRPC upwards',
    'Natural rate of unemployment: a rise shifts SRPC to the right',
  ],
  SL: LABOUR_SUPPLY,
  ACL: LABOUR_SUPPLY,
  MCL: LABOUR_SUPPLY,
  DL: [
    'Productivity of labour: higher productivity shifts labour demand right',
    'Price of the product: a higher price shifts labour demand right',
    'Demand for the product: stronger demand shifts labour demand right',
    'Price of capital: cheaper machines can shift labour demand left as firms swap workers for capital',
  ],
  LRPC: [
    'Supply-side policy: policies that cut natural unemployment shift LRPC left',
    'Labour market flexibility and skills: better skills and flexibility shift LRPC left',
  ],
}

// 'D1', 'D₂', 'AR = D', 'S + tax' -> the base label the lookup uses.
export function baseLabel(text) {
  const t = String(text || '')
    .replace(/[₀-₉]/g, '')
    .trim()
  const m = t.match(/^([A-Za-z£]{1,6})\s*(\d)?\b/)
  if (!m) return null
  const base = m[1].toUpperCase()
  return MOVES[base] ? base : MOVES[m[1]] ? m[1] : null
}
