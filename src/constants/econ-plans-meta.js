/*
  The small, static part of the essay plans: which area of the notes a question
  draws on, the mark split and the time allowed. The planner screen
  (components/ui/EssayPlans.jsx) imports these from here, not from
  econ-plans.js, because that file also holds the whole plan bank (about
  450KB), and importing it would put the bank in the download of every study
  page, for every subject, just to show a filter row.
*/

// Which part of the notes a question draws on, for the filter and the empty state.
const AREAS = [
  ['Trade and globalisation', /globalis|protection|trading bloc|integration|tariff|absolute advantage|competitiveness|exchange rate|sterling|currency|current account|net trade|exports/i],
  ['Inflation, money and banks', /inflation|interest rate|CPI|MPC|quantitative|deflation|banks|financial|forward markets|microfinance/i],
  ['Fiscal policy and growth', /fiscal|deficit|austerity|government expenditure|tax rates|tax revenue|supply-side|productivity|growth|GDP|multiplier|infrastructure|consumption|savings|investment|house prices|real wages|recession|unemployment|Phillips|trade-offs|macroeconomic objectives|conflicts/i],
  ['Market failure and intervention', /intervention|externalit|market failure|public good|merit|tax on|maximum price|carbon|plastic|nuclear|over-fishing|fishing|emissions|unintended|free market|state-funded|private costs|social optimum|asymmetric|electronic waste|energy/i],
  ['Firms, markets and competition', /monopol|oligopol|collusi|contestab|concentration|price discrimination|merger|PED|YED|PES|elastic|competition|profit|price and non|economies of scale|market share|integration within|retailers|business|firms|Starbucks|coffee|rational|demand for|supply of|prices|price of|vet insurance|streaming/i],
  ['Labour, inequality and development', /labour|wage|inequality|poverty|aid|development|Fairtrade|debt relief|cocoa|nationalisation|migration|immigration|Rwanda|Kenya|Ghana|Angola|Nigeria|Mozambique|Indonesia|Ivory/i],
]
export const areaOf = (q) => AREAS.find(([, re]) => re.test(q))?.[0] || 'Other'
export const PLAN_AREAS = [...AREAS.map((a) => a[0]), 'Other']

export const MARK_SPLIT = {
  5: { kaa: 5, evaluation: 0 },
  8: { kaa: 6, evaluation: 2 },
  10: { kaa: 6, evaluation: 4 },
  12: { kaa: 8, evaluation: 4 },
  15: { kaa: 9, evaluation: 6 },
  25: { kaa: 16, evaluation: 9 },
}
// About 1.2 minutes a mark, as the exam allows.
export const minutesFor = (marks) => Math.round(marks * 1.2)
