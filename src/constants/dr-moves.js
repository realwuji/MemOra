/*
  What shifts each named curve, keyed by the curve's base label. Shown when a
  curve is hovered in Diagram Revision and in the notes. A curve whose label
  is not here (a J-curve, a Lorenz curve) simply gets no tooltip: there is
  nothing that "shifts" it.
*/
const D = ['Population and demographics (more buyers shifts demand right)', 'Income (a rise shifts demand for a normal good right and for an inferior good left)', 'Prices of related goods (a rise in the price of a substitute shifts demand right; a rise in the price of a complement shifts it left)', 'Advertising and tastes', 'Expectations of future prices', 'Interest rates and the availability of credit', 'Seasons']
const S = ['Costs of production: wages, raw materials, energy (a rise shifts supply left)', 'Technology and productivity (shifts supply right)', 'Indirect taxes (shift supply left) and subsidies (shift it right)', 'Number of firms and barriers to entry', 'Weather, shocks and expectations (agriculture especially)']
const MCS = ['Wages and other variable input costs', 'Technology', 'Productivity of workers', 'Fixed costs do NOT shift MC']
const COSTS = ['Wages and other input costs', 'Technology', 'Productivity of workers', 'Fixed costs (rent, capital): these shift AC and AFC but not MC']
const AD = ['Consumption: confidence, wealth, interest rates', 'Investment: interest rates and expectations', 'Government spending', 'Net exports: exchange rate and world growth']
// The Keynesian AS curve is simply called AS (never LRAS).
const AS = ['Costs: wages, energy, raw materials, the exchange rate (the whole curve moves)', 'Productivity, technology and education (raise productive capacity, so the vertical part moves right)', 'More workers or capital (also move the full-capacity point right)', 'Taxes, subsidies and regulation on firms']
const REV = ['Income and tastes', 'Prices of substitutes and complements', 'Advertising and brand loyalty']

export const MOVES = {
  D,
  DEMAND: D,
  S,
  SUPPLY: S,
  'D£': ['Foreign demand for exports', 'Interest rates and hot money', 'Inward investment', 'Speculation and confidence'],
  'S£': ['Demand for imports', 'Investment abroad', 'Lower interest rates (more £ sold)', 'Quantitative easing and falling confidence'],
  PPF: ['More or better factors of production', 'Technology and productivity', 'Investment in capital goods', 'War, disaster or resource loss (inward)'],
  PPC: ['More or better factors of production', 'Technology and productivity', 'Investment in capital goods', 'War, disaster or resource loss (inward)'],
  AD,
  AS,
  SRAS: ['Wages and other input costs', 'Energy and commodity prices', 'Taxes and regulation on firms', 'Exchange rate (import costs)'],
  LRAS: ['Quantity of factors of production', 'Quality of factors: education, technology, productivity', 'Institutions, infrastructure, investment'],
  AR: REV,
  MR: ['Moves with AR: anything that shifts demand'],
  MC: MCS,
  AC: COSTS,
  ATC: COSTS,
  AVC: ['Wages and variable input costs', 'Technology and productivity'],
  AFC: ['Fixed costs (rent, capital)'],
  MSC: ['The size of the external cost of production (pollution, congestion) sets how far MSC sits above MPC', 'Anything that shifts MPC (costs, technology, taxes) moves it too', 'External benefits of production put MSC below MPC'],
  MSB: ['The size of the external benefit of consumption sets how far MSB sits above MPB', 'Anything that shifts MPB (income, tastes, prices of related goods) moves it too', 'External costs of consumption put MSB below MPB'],
  MPC: S,
  MPB: D,
  LRAC: ['Technology', 'Input prices', 'External economies of scale (shift it down)', 'Internal scale is a movement along the curve, not a shift'],
  SRAC: ['Fixed and variable costs', 'Scale of plant chosen'],
  MRP: ['Productivity of labour', 'Price of the output', 'Demand for the product'],
  SRPC: ['Expected inflation', 'Supply shocks (energy prices)', 'Changes in the natural rate'],
  SL: ['Population and migration', 'Wages in other jobs', 'Non-wage benefits', 'Training and qualifications'],
  ACL: ['Population and migration', 'Wages in other jobs', 'Non-wage benefits', 'Training and qualifications'],
  MCL: ['Population and migration', 'Wages in other jobs', 'Non-wage benefits', 'Training and qualifications'],
  DL: ['Productivity of labour', 'Price of the product', 'Demand for the product', 'Price of capital (a substitute for labour)'],
  LRPC: ['Supply-side policy lowering the natural rate of unemployment', 'Labour market flexibility and skills'],
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
