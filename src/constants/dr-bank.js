import { useEffect, useState } from 'react'
import SCENARIOS from '../data/dr-scenarios.json'

/*
  The diagram bank, indexed.

  The 214 diagrams come straight from the teacher's PowerPoint (converted by a
  script into data/diagram-bank.json) so they are exactly what was taught. The
  file is large, so it loads on demand the first time a diagram is needed.

  FAMILIES group the slides the way the student thinks about them ("which
  diagram?"): supply and demand, tax and subsidy, monopoly... The practice
  questions ask for a family; the reveal plays the exact slide.
*/

/*
  Each slide gets the curated wording on the way in (data/diagram-copy.js):
    title      the short name, for lists and headings
    caption    the full sentence(s), shown under the drawing
    heldTitle  the teacher's original title, kept for reference
    hidden     left out of the bank and of diagram revision (still here, because
               essay plans look diagrams up by number)
*/
const tidy = (t) => String(t || '').replace(/\s+/g, ' ').replace(/\s*;\s*$/, '').trim()
const withCopy = (s, COPY, hidden) => {
  const c = COPY[s.id]
  return { ...s, heldTitle: s.title, title: c?.title || tidy(s.title), caption: c?.caption || `${tidy(s.title)}.`, hidden: hidden.has(s.id) }
}

let cache = null
let pending = null
export const loadBank = () => {
  if (cache) return Promise.resolve(cache)
  pending ||= Promise.all([import('../data/diagram-bank.json'), import('../data/diagram-copy.js'), import('../data/diagram-extras.js')]).then(([m, c, x]) => {
    // The note diagrams (301+) are drawn in the same format and sit in the bank and revision like the rest
    const hidden = new Set(c.HIDDEN)
    const copy = { ...c.COPY, ...x.EXTRA_COPY }
    cache = Object.fromEntries([...m.default, ...x.EXTRA_SLIDES].map((s) => [s.id, withCopy(s, copy, hidden)]))
    return cache
  })
  return pending
}
export function useBank() {
  const [bank, setBank] = useState(cache)
  useEffect(() => {
    let live = true
    if (!cache) loadBank().then((b) => live && setBank(b))
    return () => {
      live = false
    }
  }, [])
  return bank
}

/* ------------------------------------------------------------ families */

const RANGES = [
  ['PPF', 3, 6],
  ['Supply and demand', 8, 26],
  ['Elasticity', 27, 34],
  ['Price controls', 35, 52],
  ['Consumer and producer surplus', 37, 38],
  ['Elasticity', 39, 45],
  ['Tax and subsidy', 53, 59],
  ['Externalities', 61, 75],
  ['Labour market', 77, 88],
  ['AR and MR curves', 90, 101],
  ['Costs', 102, 122],
  ['Perfect competition', 123, 134],
  ['Monopoly', 135, 148],
  ['Monopolistic competition', 149, 151],
  ['Monopoly', 152, 157],
  ['Oligopoly', 158, 160],
  ['Monopoly', 161, 161],
  ['Monopolistic competition', 162, 162],
  ['AD / AS (Keynesian AS)', 164, 164],
  ['AD / AS (neo-classical LRAS)', 165, 178],
  ['AD / AS (Keynesian AS)', 179, 189],
  ['AD / AS (neo-classical LRAS)', 190, 191],
  ['Money and bonds', 193, 197],
  ['Exchange rate', 198, 203],
  ['Economic cycle', 205, 206],
  ['Phillips and Laffer', 207, 211],
  ['Inequality', 212, 216],
  ['Trade', 218, 226],
  ['Monopoly', 301, 301],
  ['Exchange rate', 302, 302],
  ['AD / AS (Keynesian AS)', 303, 303],
  ['Phillips and Laffer', 304, 304],
  ['Costs', 305, 306],
  ['Trade', 307, 307],
  ['Inequality', 308, 308],
  ['Money and bonds', 309, 309],
]
// First range that contains the id wins, except where a later one is more specific.
export const familyOf = (id) => {
  let hit = null
  for (const [name, a, b] of RANGES) if (id >= a && id <= b) hit = name
  return hit || 'Other'
}
export const FAMILIES = [...new Set(RANGES.map((r) => r[0]))]

/*
  Micro or macro. The course splits that way (Themes 1 and 3 are micro, Themes 2
  and 4 are macro), and a student who has finished one half does not want to
  wade through the other, in the bank or in revision.
*/
export const SCOPES = ['All', 'Micro', 'Macro']
const MACRO = new Set(['AD / AS (Keynesian AS)', 'AD / AS (neo-classical LRAS)', 'Money and bonds', 'Exchange rate', 'Economic cycle', 'Phillips and Laffer', 'Inequality', 'Trade'])
export const scopeOf = (family) => (MACRO.has(family) ? 'Macro' : 'Micro')
export const inScope = (scope, family) => scope === 'All' || scopeOf(family) === scope

// Either AD/AS model is a correct answer; the Keynesian AS curve (which is called
// AS, never LRAS) is the stronger one, so it is listed and shown first.
export const canon = (f) => (f && f.startsWith('AD / AS') ? 'AD / AS' : f)

/* ------------------------------------------------------ notes diagrams */

// Old notes diagram id -> the bank slide(s) that replace it.
export const NOTE_DIAGRAMS = {
  ppf: [3],
  'ppf-shift': [4],
  'supply-demand': [16],
  'demand-shift': [19],
  elasticity: [27, 28],
  'negative-externality': [63],
  'positive-externality': [62],
  'indirect-tax': [53],
  subsidy: [58],
  'minimum-price': [52],
  'maximum-price': [49],
  'ad-as': [180],
  'lras-shift': [188],
  'cost-push': [185],
  phillips: [207],
  laffer: [208],
  'cost-curves': [111],
  'perfect-competition': [127],
  monopoly: [138],
  'kinked-demand': [158],
  'business-objectives': [146],
  'economies-of-scale': [116],
  'labour-market': [78],
  'exchange-rate': [198],
  'lorenz-curve': [212],
  'comparative-advantage': [221],
  'pes-elasticity': [33, 34],
  'consumer-producer-surplus': [38],
  'asymmetric-information': [70],
  'demand-pull': [182],
  'ad-shift': [180],
  'output-gap': [183],
  'multiplier-effect': [181],
  'revenue-curves': [96],
  'perfect-competition-short-run': [125],
  'monopolistic-competition': [150],
  'price-discrimination': [157],
  'natural-monopoly': [161],
  monopsony: [87],
  'trade-union': [85],
  tariff: [222],
  'kuznets-curve': [216],
  'external-economies': [117],
  'surplus-change': [38],
  'ad-as-classical': [172],
  'limit-pricing': [301],
  'j-curve': [302],
  'consumption-function': [303],
  'long-run-phillips': [304],
  'lrac-envelope': [305],
  efficiency: [306],
  'terms-of-trade': [307],
  'poverty-trap': [308],
  'bond-price-yield': [309],
}

/* ----------------------------------------------------------- questions */

// My written scenarios -> the slide that shows them.
const SCENARIO_SLIDE = {
  'market-demand-up': 19,
  'market-demand-down': 18,
  'market-supply-up': 20,
  'market-supply-down': 21,
  'ppf-growth': 4,
  'ppf-shock': 6,
  'ppf-pivot': 5,
  'ppf-opportunity': 3,
  'tax-indirect': 53,
  'tax-inelastic': 53,
  subsidy: 58,
  'ext-neg-production': 63,
  'ext-pos-consumption': 62,
  'ext-neg-consumption': 61,
  'ext-pos-production': 64,
  'price-max': 49,
  'price-min': 52,
  'adas-ad-up': 180,
  'adas-ad-up-full': 182,
  'adas-ad-down': 184,
  'adas-sras-left': 185,
  'adas-supply-side': 188,
  'adas-multiplier': 181,
  'neo-inflationary-gap': 173,
  'neo-lras-shift': 176,
  'mono-profit-max': 138,
  'mono-cost-rise': 153,
  'mono-demand-up': 155,
  'pc-supernormal': 131,
  'fx-appreciation': 200,
  'fx-depreciation': 199,
  tariff: 222,
}

const MULTI = [
  ['m-sterling-cars', 'The pound is expected to fall 10% against the euro because of Brexit, and UK car makers import rubber and glass from Western Europe. Analyse the effect on the exchange rate and on the market for UK cars.', [199, 21]],
  ['m-airline-tax', 'The government taxes airlines to deal with the global warming their flights cause. Using diagrams, explain the market failure and the effect of the tax.', [63, 68]],
  ['m-cigarette-tax', 'Smoking harms people nearby, and the government raises the tax on cigarettes. Use diagrams to explain the market failure and show who bears the tax.', [61, 53]],
  ['m-education', 'Education raises earnings for the individual and productivity and tax revenue for everyone, so the government subsidises it. Use diagrams to explain why and show the effect.', [62, 58]],
  ['m-public-transport', 'The government subsidises public transport. Analyse the effect on the public transport market and on the market for car travel.', [58, 18]],
  ['m-cheaper-cars', 'A fall in the cost of producing cars lowers their price. Evaluate what it would do to demand for public transport.', [20, 18]],
  ['m-wool', "Farm workers' wages rise. Explain what happens in the market for wool, in the market for jumpers made from it, and in the market for tracksuit tops, a substitute.", [21, 21, 19]],
  ['m-rates-sterling', 'Higher UK interest rates attract investors and strengthen the pound, which reduces demand for UK exports. Use diagrams to show the effect on the exchange rate and on aggregate demand.', [200, 184]],
  ['m-boom-gap', 'A government raises spending and national income rises by more than the spending. Then the economy overshoots full employment. Use diagrams to explain the multiplier and the long-run adjustment.', [181, 173]],
]

const clean = (t) => t.replace(/\s+/g, ' ').replace(/\s*[;]\s*$/, '').trim()

// The teacher's captions lean on the chapter they sit in. "Equilibrium of firm
// that has sales-maximisation goal" is a monopoly diagram, but the caption
// never says so, and a student cannot name the diagram family without knowing
// the market the firm is in. Every other bank question states its market ("a
// monopolist's variable costs rise", "in a perfectly competitive market"), so
// a market-structure slide whose caption does not name its market has it
// stated up front, the way an exam question would.
const MARKETS = {
  'Perfect competition': [/perfect|competitive|price[- ]taker/i, 'a perfectly competitive firm'],
  Monopoly: [/monopol/i, 'a monopoly'],
  'Monopolistic competition': [/monopolistic/i, 'a firm in monopolistic competition'],
  Oligopoly: [/oligopol|kinked|collu|cartel/i, 'an oligopoly'],
}
const marketLead = (family, caption) => {
  const m = MARKETS[family]
  return m && !m[0].test(caption) ? m[1] : null
}

// Built lazily so the bank titles are available.
export function buildDeck(bank) {
  const deck = []
  const covered = new Set()
  SCENARIOS.forEach((s) => {
    const slide = SCENARIO_SLIDE[s.id]
    if (!slide || !bank[slide]) return
    covered.add(slide)
    s.contexts.forEach((context, i) => deck.push({ id: `${s.id}-${i}`, context, slides: [slide], topic: familyOf(slide), eval: s.eval, what: s.what }))
  })
  MULTI.forEach(([id, context, slides]) => deck.push({ id, context, slides, topic: 'More than one diagram' }))
  // Every other diagram gets a question built from its own short title (the caption
  // is two sentences that already explain the answer), so the whole bank is practised.
  Object.values(bank).forEach((s) => {
    if (covered.has(s.id) || s.hidden) return
    const t = clean(s.title).replace(/[.!]+$/, '')
    if (!t) return
    const family = familyOf(s.id)
    const lead = marketLead(family, `${t} ${s.caption}`)
    deck.push({ id: `slide-${s.id}`, context: lead ? `Draw this diagram for ${lead}: ${t}.` : `Draw this diagram: ${t}.`, slides: [s.id], topic: family })
  })
  return deck
}
export const TOPICS = [...FAMILIES, 'More than one diagram']
